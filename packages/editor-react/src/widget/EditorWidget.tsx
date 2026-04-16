import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Arrow, Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import {
  addArrow,
  addMosaicRect,
  addMosaicStroke,
  addText,
  canRedo,
  canUndo,
  createEmptyDocument,
  createHistory,
  exportCanvasToBlob,
  pushHistory,
  redo,
  removeNode,
  undo,
  updateNode
} from '@screenshot/editor-core';
import type { HistoryState } from '@screenshot/editor-core';
import type {
  ArrowNode,
  EditorDocument,
  EditorNode,
  MosaicRectNode,
  MosaicStrokeNode,
  TextNode,
  Tool
} from '@screenshot/editor-core';
import type {
  EditorWidgetHandle,
  EditorWidgetOptions,
  ImageSource,
  MosaicRectInput
} from './types.js';

async function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, width: Math.abs(a.x - b.x), height: Math.abs(a.y - b.y) };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rectsOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
) {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

function rectIntersection(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): { x: number; y: number; width: number; height: number } | null {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  const w = x2 - x1;
  const h = y2 - y1;
  if (w <= 0 || h <= 0) return null;
  return { x: x1, y: y1, width: w, height: h };
}

function subtractRect(
  base: { x: number; y: number; width: number; height: number },
  cut: { x: number; y: number; width: number; height: number }
): Array<{ x: number; y: number; width: number; height: number }> {
  const inter = rectIntersection(base, cut);
  if (!inter) return [base];

  const out: Array<{ x: number; y: number; width: number; height: number }> = [];
  const baseRight = base.x + base.width;
  const baseBottom = base.y + base.height;
  const interRight = inter.x + inter.width;
  const interBottom = inter.y + inter.height;

  // top strip
  if (inter.y > base.y) {
    out.push({ x: base.x, y: base.y, width: base.width, height: inter.y - base.y });
  }
  // bottom strip
  if (interBottom < baseBottom) {
    out.push({ x: base.x, y: interBottom, width: base.width, height: baseBottom - interBottom });
  }
  // left strip (middle)
  if (inter.x > base.x) {
    out.push({ x: base.x, y: inter.y, width: inter.x - base.x, height: inter.height });
  }
  // right strip (middle)
  if (interRight < baseRight) {
    out.push({ x: interRight, y: inter.y, width: baseRight - interRight, height: inter.height });
  }

  // Filter tiny fragments
  return out.filter((r) => r.width > 1 && r.height > 1);
}

function rectUnionClipFunc(rects: Array<{ x: number; y: number; width: number; height: number }>) {
  return (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    for (const r of rects) ctx.rect(r.x, r.y, r.width, r.height);
    ctx.closePath();
  };
}

function arrowBounds(a: ArrowNode): { x: number; y: number; width: number; height: number } {
  const p0 = a.points[0];
  const p1 = a.points[1];
  const minX = Math.min(p0.x, p1.x);
  const maxX = Math.max(p0.x, p1.x);
  const minY = Math.min(p0.y, p1.y);
  const maxY = Math.max(p0.y, p1.y);
  const pad = Math.max(a.strokeWidth, a.pointerLength, a.pointerWidth) + 6;
  return { x: minX - pad, y: minY - pad, width: maxX - minX + pad * 2, height: maxY - minY + pad * 2 };
}

function textBoundsApprox(t: TextNode): { x: number; y: number; width: number; height: number } {
  const w = t.width ?? 320;
  // Approx height:
  // - singleLine: 1 line
  // - area: estimate wrapped lines by width and character count (good enough for mosaic splitting)
  const lh = (t.lineHeight ?? 1.25) * t.fontSize;
  const pad = (t.padding ?? 0) * 2;
  const txt = (t.text ?? '').replace(/\r\n/g, '\n');
  const explicitLines = txt.split('\n');
  const avgCharW = t.fontSize * 0.6;
  const estLineCountFor = (line: string) => {
    if (t.mode !== 'area') return 1;
    const usableW = Math.max(20, w - pad);
    const est = Math.ceil((line.length * avgCharW) / usableW);
    return Math.max(1, est);
  };
  const lines = explicitLines.reduce((sum, line) => sum + estLineCountFor(line), 0);
  const h = Math.max(24, lines * lh + pad);
  return { x: t.x, y: t.y, width: w, height: h };
}

function splitNodeByRegion(
  doc: EditorDocument,
  node: ArrowNode | TextNode,
  region: { x: number; y: number; width: number; height: number },
  rawBoundsOverride?: { x: number; y: number; width: number; height: number }
): EditorDocument {
  const rawBounds =
    rawBoundsOverride ?? (node.kind === 'arrow' ? arrowBounds(node) : textBoundsApprox(node));
  const clipRects = (node as any).clipRects as Array<{ x: number; y: number; width: number; height: number }> | undefined;

  // 如果已经被部分打码过（有 clipRects），第二次再被覆盖到时，直接把剩余可见区域整体锁到底图，
  // 避免无限拆分导致的“浮一块文字在上面”以及多次打码后旧文字复活。
  const hasClips = Array.isArray(clipRects) && clipRects.length > 0;
  if (hasClips) {
    const anyOverlap = clipRects!.some((vr) => rectIntersection(vr, region));
    if (!anyOverlap) return doc;
    const visibleRegions = clipRects!;
    let next = removeNode(doc, node.id);
    if (node.kind === 'arrow') {
      const { id: _id, kind: _kind, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = node as any;
      next = addArrow(next, { ...rest, layer: 'base', locked: true, clipRects: visibleRegions });
    } else {
      const { id: _id, kind: _kind, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = node as any;
      next = addText(next, { ...rest, layer: 'base', locked: true, clipRects: visibleRegions });
    }
    return next;
  }

  const visibleRegions = [rawBounds];

  const insideRects: Array<{ x: number; y: number; width: number; height: number }> = [];
  const outsideRects: Array<{ x: number; y: number; width: number; height: number }> = [];

  for (const vr of visibleRegions) {
    const inter = rectIntersection(vr, region);
    if (inter) insideRects.push(inter);
    outsideRects.push(...subtractRect(vr, region));
  }

  if (insideRects.length === 0) return doc;

  let next = removeNode(doc, node.id);

  // Overlapped part becomes base+locked (image-like; non-editable), clipped to the overlap.
  if (node.kind === 'arrow') {
    const { id: _id, kind: _kind, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = node as any;
    next = addArrow(next, { ...rest, layer: 'base', locked: true, clipRects: insideRects });
  } else {
    const { id: _id, kind: _kind, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = node as any;
    next = addText(next, { ...rest, layer: 'base', locked: true, clipRects: insideRects });
  }

  // Remaining visible part stays top+editable, clipped to the outside pieces.
  if (outsideRects.length > 0) {
    if (node.kind === 'arrow') {
      const { id: _id, kind: _kind, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = node as any;
      next = addArrow(next, { ...rest, layer: 'top', locked: false, clipRects: outsideRects });
    } else {
      const { id: _id, kind: _kind, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = node as any;
      next = addText(next, { ...rest, layer: 'top', locked: false, clipRects: outsideRects });
    }
  }

  return next;
}

function createLocalId(prefix: string): string {
  // Same shape as editor-core ids; sufficient for local nodes.
  return `${prefix}_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
}

function strokeBounds(s: MosaicStrokeNode): { x: number; y: number; width: number; height: number } {
  if (s.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  let minX = s.points[0]!.x;
  let maxX = s.points[0]!.x;
  let minY = s.points[0]!.y;
  let maxY = s.points[0]!.y;
  for (const p of s.points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const r = s.brushSize / 2;
  return { x: minX - r, y: minY - r, width: maxX - minX + r * 2, height: maxY - minY + r * 2 };
}

// NOTE:
// For rectangle/auto-detect mosaics we want "stacking override":
// later mosaics should visually cover earlier ones in the overlapped region,
// while earlier mosaics remain visible outside the overlap.

function carveOverlappedMosaicRects(
  doc: EditorDocument,
  region: { x: number; y: number; width: number; height: number },
  keepId?: string
): EditorDocument {
  let next = doc;

  // IMPORTANT:
  // Do NOT remove mosaic strokes here. Strokes can't be reliably carved, and deleting them makes
  // older brush mosaics "disappear" when a new rect mosaic overlaps. We rely on render stacking
  // (newer mosaics on top) to cover strokes in the overlapped region.

  // If region overlaps mosaic rects, split old rects around the overlap.
  const rectsToCarve = next.nodes.filter(
    (n): n is MosaicRectNode =>
      n.kind === 'mosaicRect' &&
      (!keepId || n.id !== keepId) &&
      rectsOverlap({ x: n.x, y: n.y, width: n.width, height: n.height }, region)
  );
  for (const r of rectsToCarve) {
    const base = { x: r.x, y: r.y, width: r.width, height: r.height };
    const pieces = subtractRect(base, region);
    next = removeNode(next, r.id);
    if (pieces.length > 0) {
      // IMPORTANT: keep carved pieces in the same stacking layer as the original rect.
      // If we re-add via addMosaicRect() it would get a new timestamp and may end up above the new mosaic.
      const carved: MosaicRectNode[] = pieces.map((p) => ({
        id: createLocalId('mosaic'),
        kind: 'mosaicRect',
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        pixelSize: r.pixelSize,
        style: r.style,
        blurRadius: r.style === 'blur' ? (r.blurRadius ?? 6) : undefined
      }));
      next = { ...next, nodes: [...next.nodes, ...carved] };
    }
  }
  return next;
}

function lockNodesUnderRegion(
  doc: EditorDocument,
  region: { x: number; y: number; width: number; height: number }
): EditorDocument {
  let next = doc;
  for (const n of doc.nodes) {
    if (n.kind !== 'arrow' && n.kind !== 'text') continue;
    if ((n as any).locked) continue;
    const bounds =
      n.kind === 'arrow'
        ? (() => {
            const [a, b] = n.points;
            const minX = Math.min(a.x, b.x);
            const maxX = Math.max(a.x, b.x);
            const minY = Math.min(a.y, b.y);
            const maxY = Math.max(a.y, b.y);
            const pad = Math.max(n.strokeWidth, n.pointerLength, n.pointerWidth) + 4;
            return { x: minX - pad, y: minY - pad, width: maxX - minX + pad * 2, height: maxY - minY + pad * 2 };
          })()
        : (() => {
            const w = n.mode === 'area' && n.width ? n.width : 320;
            const h = Math.max(24, (n.fontSize ?? 24) * 1.4);
            return { x: n.x, y: n.y, width: w, height: h };
          })();
    if (!rectsOverlap(bounds, region)) continue;
    next = updateNode(next, n.id, { layer: 'base', locked: true } as any);
  }
  return next;
}

function arrowDisplayPoints(node: ArrowNode): { points: number[]; tension: number } {
  const a = node.points[0];
  const b = node.points[1];
  const kind = node.arrowKind ?? 'straight';

  if (kind === 'straight') {
    return { points: [a.x, a.y, b.x, b.y], tension: 0 };
  }

  if (kind === 'elbow') {
    // Deterministic right-angle: horizontal then vertical.
    // (Matches typical "折线箭头" expectation and avoids shape flipping.)
    const mid = { x: b.x, y: a.y };
    return { points: [a.x, a.y, mid.x, mid.y, b.x, b.y], tension: 0 };
  }

  // curve
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const nx = -dy / dist;
  const ny = dx / dist;
  const bend = Math.min(120, dist * 0.25);
  const ctrl = { x: mx + nx * bend, y: my + ny * bend };
  return { points: [a.x, a.y, ctrl.x, ctrl.y, b.x, b.y], tension: 0.5 };
}

function cloneDoc(doc: EditorDocument): EditorDocument {
  // structuredClone is available in modern browsers/electron renderer.
  return structuredClone(doc);
}

type AnnotationTemplateV1 = {
  version: 1;
  base: { width: number; height: number };
  nodes: Array<Omit<EditorNode, 'id' | 'createdAt' | 'updatedAt'>>;
};

function isTemplateSupportedNode(
  n: EditorNode
): n is MosaicRectNode | MosaicStrokeNode | ArrowNode | TextNode {
  return n.kind === 'mosaicRect' || n.kind === 'mosaicStroke' || n.kind === 'arrow' || n.kind === 'text';
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeLocalStorageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}
function safeLocalStorageRemove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function normalizeTemplateNode(n: EditorNode): Omit<EditorNode, 'id' | 'createdAt' | 'updatedAt'> {
  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = n as any;
  // Keep all annotation kinds (mosaic/arrow/text) in template; only strip runtime-only fields.
  // Enforce "single annotation layer" semantics: arrow/text always top above mosaics after restore.
  delete (rest as any).layer;
  delete (rest as any).locked;
  delete (rest as any).clipRects;
  return rest as any;
}

function applyTemplateScale(
  node: Omit<EditorNode, 'id' | 'createdAt' | 'updatedAt'>,
  sx: number,
  sy: number
): Omit<EditorNode, 'id' | 'createdAt' | 'updatedAt'> {
  if (node.kind === 'mosaicRect') {
    return { ...node, x: node.x * sx, y: node.y * sy, width: node.width * sx, height: node.height * sy } as any;
  }
  if (node.kind === 'mosaicStroke') {
    return {
      ...node,
      points: node.points.map((p) => ({ x: p.x * sx, y: p.y * sy })),
      brushSize: node.brushSize * ((sx + sy) / 2)
    } as any;
  }
  if (node.kind === 'arrow') {
    return {
      ...node,
      points: [
        { x: node.points[0].x * sx, y: node.points[0].y * sy },
        { x: node.points[1].x * sx, y: node.points[1].y * sy }
      ]
    } as any;
  }
  // text
  const t = node as any;
  const out: any = { ...t, x: t.x * sx, y: t.y * sy };
  if (t.width != null) out.width = t.width * sx;
  if (t.fontSize != null) out.fontSize = t.fontSize * ((sx + sy) / 2);
  if (t.padding != null) out.padding = t.padding * ((sx + sy) / 2);
  if (t.letterSpacing != null) out.letterSpacing = t.letterSpacing * sx;
  return out as any;
}

function snapshotFromDoc(doc: EditorDocument, bgOffset: { x: number; y: number }): AnnotationTemplateV1 & { bgOffset?: { x: number; y: number } } {
  return {
    version: 1,
    base: { width: doc.width, height: doc.height },
    bgOffset,
    nodes: doc.nodes.map((n) => normalizeTemplateNode(n))
  };
}

async function createPixelatedDataUrl(image: HTMLImageElement, pixelSize: number): Promise<string> {
  const w = image.naturalWidth;
  const h = image.naturalHeight;

  const smallW = Math.max(1, Math.floor(w / pixelSize));
  const smallH = Math.max(1, Math.floor(h / pixelSize));

  const small = document.createElement('canvas');
  small.width = smallW;
  small.height = smallH;
  const sctx = small.getContext('2d');
  if (!sctx) throw new Error('2d context not available');
  sctx.imageSmoothingEnabled = true;
  sctx.clearRect(0, 0, smallW, smallH);
  sctx.drawImage(image, 0, 0, smallW, smallH);

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const octx = out.getContext('2d');
  if (!octx) throw new Error('2d context not available');
  octx.imageSmoothingEnabled = false;
  octx.clearRect(0, 0, w, h);
  octx.drawImage(small, 0, 0, smallW, smallH, 0, 0, w, h);

  return out.toDataURL('image/png');
}

async function createPixelatedDataUrlFromSource(
  source: CanvasImageSource,
  size: { width: number; height: number },
  pixelSize: number
): Promise<string> {
  const w = size.width;
  const h = size.height;
  const smallW = Math.max(1, Math.floor(w / pixelSize));
  const smallH = Math.max(1, Math.floor(h / pixelSize));
  const small = document.createElement('canvas');
  small.width = smallW;
  small.height = smallH;
  const sctx = small.getContext('2d');
  if (!sctx) throw new Error('2d context not available');
  sctx.imageSmoothingEnabled = true;
  sctx.clearRect(0, 0, smallW, smallH);
  // @ts-expect-error drawImage accepts CanvasImageSource
  sctx.drawImage(source, 0, 0, smallW, smallH);

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const octx = out.getContext('2d');
  if (!octx) throw new Error('2d context not available');
  octx.imageSmoothingEnabled = false;
  octx.clearRect(0, 0, w, h);
  octx.drawImage(small, 0, 0, smallW, smallH, 0, 0, w, h);
  return out.toDataURL('image/png');
}

async function createBlurredDataUrl(image: HTMLImageElement, radius: number): Promise<string> {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('2d context not available');
  ctx.clearRect(0, 0, w, h);
  // Simple Gaussian-ish blur using canvas filter API.
  // Radius in CSS pixels; browser will clamp as needed.
  (ctx as any).filter = `blur(${radius}px)`;
  ctx.drawImage(image, 0, 0, w, h);
  (ctx as any).filter = 'none';
  return out.toDataURL('image/png');
}

async function createBlurredDataUrlFromSource(
  source: CanvasImageSource,
  size: { width: number; height: number },
  radius: number
): Promise<string> {
  const w = size.width;
  const h = size.height;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('2d context not available');
  ctx.clearRect(0, 0, w, h);
  (ctx as any).filter = `blur(${radius}px)`;
  // @ts-expect-error drawImage accepts CanvasImageSource
  ctx.drawImage(source, 0, 0, w, h);
  (ctx as any).filter = 'none';
  return out.toDataURL('image/png');
}

export const EditorWidget = React.forwardRef<
  EditorWidgetHandle,
  {
    container: HTMLElement;
    image: ImageSource;
    options?: EditorWidgetOptions;
  }
>(function EditorWidgetImpl(props, ref) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const baseGroupRef = useRef<Konva.Group | null>(null);
  const snapshotGroupRef = useRef<Konva.Group | null>(null);
  const spacePressedRef = useRef(false);

  const [tool, setTool] = useState<Tool>(props.options?.initialTool ?? { kind: 'select' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextDraft, setEditingTextDraft] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const suppressNextTextCreateRef = useRef(false);
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);

  const [bgSrc, setBgSrc] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [baseCanvas, setBaseCanvas] = useState<HTMLCanvasElement | null>(null);
  const [baseCanvasBgSrc, setBaseCanvasBgSrc] = useState<string | null>(null);
  const [baseCanvasOffset, setBaseCanvasOffset] = useState<{ x: number; y: number } | null>(null);
  const [undoRedoKey, setUndoRedoKey] = useState(0);
  const [snapshotVersion, setSnapshotVersion] = useState(0);

  // Controls whether changing `bgSrc` should also reset editor `history`.
  // - When user loads a brand new image (props.image change), we reset history.
  // - When crop/undo/redo changes bgSrc, we must NOT reset history, or undo will break.
  const bgSrcUpdateOriginRef = useRef<'props' | 'history'>('props');

  const templateKey = props.options?.template?.key ? `screenshot_template_v1:${props.options.template.key}` : null;
  const templateAutoApply = props.options?.template?.autoApply ?? true;
  const templateAutoSave = props.options?.template?.autoSave ?? true;
  const templateSaveTimerRef = useRef<number | null>(null);

  function loadTemplate(): AnnotationTemplateV1 | null {
    if (!templateKey) return null;
    const raw = safeLocalStorageGet(templateKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AnnotationTemplateV1;
      if (!parsed || parsed.version !== 1) return null;
      if (!parsed.base || typeof parsed.base.width !== 'number' || typeof parsed.base.height !== 'number') return null;
      if (!Array.isArray(parsed.nodes)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveTemplateNow(doc: EditorDocument) {
    if (!templateKey) return;
    const allAnnotations = doc.nodes.filter(isTemplateSupportedNode);
    const tpl: AnnotationTemplateV1 = {
      version: 1,
      base: { width: doc.width, height: doc.height },
      nodes: allAnnotations.map((n) => normalizeTemplateNode(n))
    };
    safeLocalStorageSet(templateKey, JSON.stringify(tpl));
    props.options?.onTemplateEvent?.({
      type: 'save',
      key: templateKey,
      nodeCount: tpl.nodes.length
    });
  }

  function clearTemplateNow() {
    if (!templateKey) return;
    safeLocalStorageRemove(templateKey);
    props.options?.onTemplateEvent?.({ type: 'cleared', key: templateKey });
  }

  function applyTemplateToDocument(doc: EditorDocument, tpl: AnnotationTemplateV1): EditorDocument {
    const bw = tpl.base.width || 1;
    const bh = tpl.base.height || 1;
    const sx = doc.width / bw;
    const sy = doc.height / bh;
    const now = Date.now();
    const nodes: EditorNode[] = tpl.nodes.map((n) => {
      const scaled = applyTemplateScale(n as any, sx, sy) as any;
      const id = createLocalId(n.kind === 'text' ? 'text' : n.kind === 'arrow' ? 'arrow' : 'mosaic');
      return { ...scaled, id, createdAt: now, updatedAt: now } as EditorNode;
    });
    return { ...doc, nodes };
  }

  const [history, setHistory] = useState(() =>
    createHistory<EditorDocument>(createEmptyDocument({ width: 1, height: 1, backgroundSrc: '' }))
  );
  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
    kind: 'arrow' | 'text';
  } | null>(null);

  type DetectedRegion = MosaicRectInput & { id: string; selected: boolean };
  const [detectedRegions, setDetectedRegions] = useState<DetectedRegion[]>([]);
  // Currently drawn mosaic id, used only to render an extra overlay above arrows/texts for real-time cover.
  const [activeMosaicId, setActiveMosaicId] = useState<string | null>(null);

  const isDrawingRef = useRef(false);
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);
  const isTextCreatingRef = useRef(false);
  const drawingNodeIdRef = useRef<string | null>(null);
  const lastBrushPosRef = useRef<{ x: number; y: number } | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef<{ pointer: { x: number; y: number }; position: { x: number; y: number } } | null>(null);

  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  // Background alignment (drag image under annotations).
  const [bgOffsetDoc, setBgOffsetDoc] = useState({ x: 0, y: 0 });
  const [bgDragMode, setBgDragMode] = useState(false);
  const bgDragModeRef = useRef(false);
  const bgOffsetDocRef = useRef(bgOffsetDoc);
  const stageScaleRef = useRef(stageScale);
  useEffect(() => {
    bgOffsetDocRef.current = bgOffsetDoc;
  }, [bgOffsetDoc]);
  useEffect(() => {
    stageScaleRef.current = stageScale;
  }, [stageScale]);

  // Image-level transforms applied during export/display:
  // - crop: user drags a crop rectangle on the stage
  const [transformMode, setTransformModeState] = useState<'none' | 'crop'>('none');
  const [cropRectDoc, setCropRectDoc] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const cropRectNodeRef = useRef<Konva.Rect | null>(null);

  const container = props.container;

  useEffect(() => {
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setStageSize({ width, height });
    });
    ro.observe(container);
    const { width, height } = container.getBoundingClientRect();
    if (width > 0 && height > 0) setStageSize({ width, height });
    return () => ro.disconnect();
  }, [container]);

  // Align-mode drag with DOM listeners (not Konva bubbling), so annotations can't block dragging.
  useEffect(() => {
    if (!bgDragMode) return;
    const stageContainer = stageRef.current?.container();
    if (!stageContainer) return;
    let dragging = false;
    let startClient = { x: 0, y: 0 };
    let startOffset = { x: 0, y: 0 };

    const onPointerDown = (ev: PointerEvent) => {
      const target = ev.target as Node | null;
      if (!target || !stageContainer.contains(target)) return;
      dragging = true;
      startClient = { x: ev.clientX, y: ev.clientY };
      startOffset = { ...bgOffsetDocRef.current };
      ev.preventDefault();
    };
    const onPointerMove = (ev: PointerEvent) => {
      if (!dragging) return;
      const scale = Math.max(0.0001, stageScaleRef.current);
      const dx = (ev.clientX - startClient.x) / scale;
      const dy = (ev.clientY - startClient.y) / scale;
      setBgOffsetDoc({ x: startOffset.x + dx, y: startOffset.y + dy });
      ev.preventDefault();
    };
    const onPointerUp = () => {
      dragging = false;
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointermove', onPointerMove, true);
    window.addEventListener('pointerup', onPointerUp, true);
    window.addEventListener('pointercancel', onPointerUp, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerup', onPointerUp, true);
      window.removeEventListener('pointercancel', onPointerUp, true);
    };
  }, [bgDragMode]);

  const docW = history.present.width;
  const docH = history.present.height;
  const prevDocRef = useRef({ w: 0, h: 0 });
  useEffect(() => {
    if (docW <= 0 || docH <= 0 || stageSize.width <= 0 || stageSize.height <= 0) return;
    const docChanged = prevDocRef.current.w !== docW || prevDocRef.current.h !== docH;
    if (docChanged) prevDocRef.current = { w: docW, h: docH };
    if (!docChanged) return;
    const scale = Math.min(stageSize.width / docW, stageSize.height / docH, 1);
    setStageScale(scale);
    setStagePosition({
      x: (stageSize.width - docW * scale) / 2,
      y: (stageSize.height - docH * scale) / 2
    });
  }, [docW, docH, stageSize.width, stageSize.height]);

  const mosaicRects = useMemo(
    () => history.present.nodes.filter((n): n is MosaicRectNode => n.kind === 'mosaicRect'),
    [history.present.nodes]
  );
  const mosaicStrokes = useMemo(
    () => history.present.nodes.filter((n): n is MosaicStrokeNode => n.kind === 'mosaicStroke'),
    [history.present.nodes]
  );
  // Keep mosaic overlay stacking consistent with creation order:
  // later nodes should render above earlier ones, regardless of pixel/blur style.
  const mosaicNodesInOrder = useMemo(() => {
    // Do NOT rely on array order.
    // Use updatedAt to reflect the end of a draw gesture (mouseUp),
    // so the last edited/drawn mosaic always renders on top.
    const nodes = history.present.nodes.filter(
      (n): n is MosaicRectNode | MosaicStrokeNode => n.kind === 'mosaicRect' || n.kind === 'mosaicStroke'
    );
    return nodes.slice().sort((a, b) => {
      if (a.updatedAt !== b.updatedAt) return a.updatedAt - b.updatedAt;
      if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
      return a.id.localeCompare(b.id);
    });
  }, [history.present.nodes]);

  // Key of nodes that participate in "base snapshot" (background + base-layer arrows/texts).
  // This must change when nodes are locked into base (so mosaics can include them),
  // but should NOT change while drawing/moving top-layer nodes (prevents flicker).
  const baseLayerNodesKey = useMemo(() => {
    const parts: string[] = [];
    for (const n of history.present.nodes) {
      if (n.kind !== 'arrow' && n.kind !== 'text') continue;
      if ((n as any).layer !== 'base') continue;
      const clip = (n as any).clipRects;
      const clipKey = Array.isArray(clip) && clip.length > 0 ? JSON.stringify(clip) : '';
      parts.push(`${n.kind}:${n.id}:${n.updatedAt}:${clipKey}`);
    }
    return parts.join('|');
  }, [history.present.nodes]);

  function toggleDetectedRegion(id: string) {
    setDetectedRegions((prev) => prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  }
  function setAllDetectedRegionsSelected(selected: boolean) {
    setDetectedRegions((prev) => prev.map((r) => ({ ...r, selected })));
  }
  const arrows = useMemo(
    () => history.present.nodes.filter((n): n is ArrowNode => n.kind === 'arrow'),
    [history.present.nodes]
  );
  const texts = useMemo(
    () => history.present.nodes.filter((n): n is TextNode => n.kind === 'text'),
    [history.present.nodes]
  );
  const topArrows = arrows;
  const topTexts = texts;

  function captureSnapshotCanvasNow(): HTMLCanvasElement | null {
    if (!bgImage) return null;
    const g = snapshotGroupRef.current ?? null;
    if (!g) return null;
    const prevVisible = g.visible();
    if (!prevVisible) g.visible(true);
    const canvas = g.toCanvas({ pixelRatio: 2 });
    if (!prevVisible) g.visible(false);
    return canvas;
  }

  useEffect(() => {
    let objectUrl: string | null = null;
    (async () => {
      bgSrcUpdateOriginRef.current = 'props';
      setImageLoadError(null);
      if (props.image.kind === 'url') setBgSrc(props.image.url);
      if (props.image.kind === 'dataUrl') setBgSrc(props.image.dataUrl);
      if (props.image.kind === 'blob') {
        objectUrl = URL.createObjectURL(props.image.blob);
        setBgSrc(objectUrl);
      }
    })();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [props.image]);

  useEffect(() => {
    if (!bgSrc) return;
    let cancelled = false;
    (async () => {
      // Clear previous snapshot source immediately when switching image source,
      // so caches for the new image never sample the old image canvas.
      setBaseCanvas(null);
      setBaseCanvasBgSrc(null);
      setBaseCanvasOffset(null);
      setImageLoadError(null);
      const img = await loadHtmlImage(bgSrc);
      if (cancelled) return;
      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      if (w <= 0 || h <= 0) {
        throw new Error(
          'Loaded image has invalid size (0×0). Try using PNG/JPEG/WebP, or ensure the image has explicit dimensions.'
        );
      }
      setBgImage(img);

      // Only reset history when the whole editor image is being replaced via `props.image`.
      // During crop/undo/redo we update bgSrc for background rendering, but history is already updated.
      if (bgSrcUpdateOriginRef.current === 'props') {
        const baseDoc = createEmptyDocument({
          width: w,
          height: h,
          backgroundSrc: bgSrc
        });
        let doc = baseDoc;

        // Per-image restore (highest priority).
        if (props.options?.initialAnnotations) {
          doc = applyTemplateToDocument(doc, props.options.initialAnnotations as any);
          const off = (props.options.initialAnnotations as any).bgOffset;
          if (off && typeof off.x === 'number' && typeof off.y === 'number') {
            setBgOffsetDoc({ x: off.x, y: off.y });
          } else {
            setBgOffsetDoc({ x: 0, y: 0 });
          }
        } else {
          setBgOffsetDoc({ x: 0, y: 0 });
        }

        // Auto-apply last template when opening a new image.
        if (templateAutoApply) {
          const tpl = loadTemplate();
          if (tpl) doc = applyTemplateToDocument(doc, tpl);
        }

        // When restoring per-image annotations, keep at least one undo step:
        // base (no annotations) -> restored annotations.
        if (props.options?.initialAnnotations) {
          setHistory(pushHistory(createHistory(baseDoc), doc));
        } else {
          setHistory(createHistory(doc));
        }
        setSelectedId(null);
      }
    })().catch((err) => {
      if (cancelled) return;
      setBgImage(null);
      setImageLoadError(err instanceof Error ? err.message : String(err));
    });
    return () => {
      cancelled = true;
    };
  }, [bgSrc, templateAutoApply, templateKey]);

  // Build a "base snapshot" canvas in DOCUMENT coordinates (no stage pan/zoom):
  // background only. Arrow/text are always rendered as top layer.
  useEffect(() => {
    if (!bgImage) return;
    const g = snapshotGroupRef.current ?? null;
    if (!g) return;
    // Konva will not render invisible nodes into toCanvas(), so we temporarily toggle visibility
    // to generate a correct snapshot without affecting user-visible UI.
    const prevVisible = g.visible();
    if (!prevVisible) g.visible(true);
    const canvas = g.toCanvas({ pixelRatio: 2 });
    if (!prevVisible) g.visible(false);
    setBaseCanvas(canvas);
    setBaseCanvasBgSrc(bgSrc ?? null);
    setBaseCanvasOffset({ x: bgOffsetDoc.x, y: bgOffsetDoc.y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bgImage,
    history.present.width,
    history.present.height,
    bgOffsetDoc.x,
    bgOffsetDoc.y
  ]);

  // IMPORTANT:
  // Mosaic caches must be invalidated whenever the background snapshot changes.
  const baseSnapshotKey = useMemo(() => {
    // Only force-invalidate caches on explicit undo/redo, not on every history push,
    // otherwise mosaics can look like they "don't apply" while caches rebuild.
    return `${bgSrc ?? ''}|${history.present.width}x${history.present.height}|off:${bgOffsetDoc.x},${bgOffsetDoc.y}|${undoRedoKey}|${snapshotVersion}`;
  }, [bgSrc, history.present.width, history.present.height, bgOffsetDoc.x, bgOffsetDoc.y, undoRedoKey, snapshotVersion]);

  useEffect(() => {
    // Do not hard-clear caches on snapshot change; that would cause existing mosaics
    // to temporarily render as placeholder "shadows" while caches rebuild (especially during undo/redo).
    // Instead, cache entries are versioned by baseSnapshotKey and refreshed in the generator effects.
  }, [baseSnapshotKey]);

  const pixelSizesNeeded = useMemo(() => {
    const sizes = new Set<number>();
    for (const n of mosaicNodesInOrder) {
      const style = (n as any).style ?? 'pixel';
      if (style !== 'pixel') continue;
      sizes.add((n as any).pixelSize);
    }
    if (tool.kind === 'mosaic' && (tool.style ?? 'pixel') === 'pixel') sizes.add(tool.pixelSize);
    return [...sizes].sort((a, b) => a - b);
  }, [mosaicNodesInOrder, tool]);

  type CachedImg = { img: HTMLImageElement; key: string };
  const [pixelCache, setPixelCache] = useState<Record<number, CachedImg>>({});

  useEffect(() => {
    if (!bgImage) return;
    const canUseBaseCanvas =
      !!baseCanvas &&
      baseCanvasBgSrc === (bgSrc ?? null) &&
      !!baseCanvasOffset &&
      baseCanvasOffset.x === bgOffsetDoc.x &&
      baseCanvasOffset.y === bgOffsetDoc.y;
    const source = canUseBaseCanvas ? (baseCanvas as HTMLCanvasElement) : bgImage;
    const docSize = { width: history.present.width, height: history.present.height };
    let cancelled = false;
    (async () => {
      const next: Record<number, CachedImg> = { ...pixelCache };
      for (const px of pixelSizesNeeded) {
        if (next[px]?.key === baseSnapshotKey) continue;
        const dataUrl =
          source === bgImage
            ? await createPixelatedDataUrl(bgImage, px)
            : await createPixelatedDataUrlFromSource(source, docSize, px);
        if (cancelled) return;
        const img = await loadHtmlImage(dataUrl);
        if (cancelled) return;
        next[px] = { img, key: baseSnapshotKey };
      }
      if (!cancelled) setPixelCache(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgImage, baseCanvas, baseCanvasBgSrc, baseCanvasOffset, bgSrc, bgOffsetDoc.x, bgOffsetDoc.y, baseSnapshotKey, JSON.stringify(pixelSizesNeeded), history.present.width, history.present.height]);

  const blurRadiiNeeded = useMemo(() => {
    const radii = new Set<number>();
    for (const n of mosaicNodesInOrder) {
      const style = (n as any).style ?? 'pixel';
      if (style !== 'blur') continue;
      radii.add(((n as any).blurRadius as number | undefined) ?? 6);
    }
    if (tool.kind === 'mosaic' && tool.style === 'blur') radii.add(tool.blurRadius ?? 6);
    return [...radii].sort((a, b) => a - b);
  }, [mosaicNodesInOrder, tool]);

  const [blurCache, setBlurCache] = useState<Record<number, CachedImg>>({});

  useEffect(() => {
    if (!bgImage) return;
    const canUseBaseCanvas =
      !!baseCanvas &&
      baseCanvasBgSrc === (bgSrc ?? null) &&
      !!baseCanvasOffset &&
      baseCanvasOffset.x === bgOffsetDoc.x &&
      baseCanvasOffset.y === bgOffsetDoc.y;
    const source = canUseBaseCanvas ? (baseCanvas as HTMLCanvasElement) : bgImage;
    const docSize = { width: history.present.width, height: history.present.height };
    let cancelled = false;
    (async () => {
      const next: Record<number, CachedImg> = { ...blurCache };
      for (const radius of blurRadiiNeeded) {
        if (next[radius]?.key === baseSnapshotKey) continue;
        const dataUrl =
          source === bgImage
            ? await createBlurredDataUrl(bgImage, radius)
            : await createBlurredDataUrlFromSource(source, docSize, radius);
        if (cancelled) return;
        const img = await loadHtmlImage(dataUrl);
        if (cancelled) return;
        next[radius] = { img, key: baseSnapshotKey };
      }
      if (!cancelled) setBlurCache(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgImage, baseCanvas, baseCanvasBgSrc, baseCanvasOffset, bgSrc, bgOffsetDoc.x, bgOffsetDoc.y, baseSnapshotKey, JSON.stringify(blurRadiiNeeded), history.present.width, history.present.height]);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;

    if (transformMode === 'crop') {
      if (cropRectNodeRef.current && cropRectDoc) {
        transformer.nodes([cropRectNodeRef.current as unknown as Konva.Node]);
      } else {
        transformer.nodes([]);
      }
      transformer.getLayer()?.batchDraw();
      return;
    }

    if (editingTextId) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }
    if (!selectedId) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }
    const selectedNode = history.present.nodes.find((n) => n.id === selectedId) ?? null;
    if (selectedNode && (selectedNode.kind === 'mosaicRect' || selectedNode.kind === 'mosaicStroke')) {
      // Mosaic uses custom "box highlight" instead of transformer handles.
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }
    const node = stage.findOne(`#${selectedId}`);
    if (!node) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }
    transformer.nodes([node as unknown as Konva.Node]);
    transformer.getLayer()?.batchDraw();
  }, [selectedId, history.present.nodes, editingTextId, transformMode, cropRectDoc]);

  useEffect(() => {
    const cb = props.options?.onSelectionChange;
    if (!cb) return;
    if (!selectedId) {
      cb(null);
      return;
    }
    const node = history.present.nodes.find((n) => n.id === selectedId) ?? null;
    if (!node) {
      cb(null);
      return;
    }
    if (node.kind === 'text') {
      cb({
        kind: 'text',
        id: node.id,
        style: {
          fill: node.fill,
          fontSize: node.fontSize,
          fontFamily: node.fontFamily,
          fontWeight: node.fontWeight,
          align: node.align,
          lineHeight: node.lineHeight,
          letterSpacing: node.letterSpacing
        }
      });
      return;
    }
    if (node.kind === 'arrow') {
      cb({
        kind: 'arrow',
        id: node.id,
        style: {
          arrowKind: node.arrowKind,
          stroke: node.stroke,
          strokeWidth: node.strokeWidth,
          pointerSize: Math.max(node.pointerLength, node.pointerWidth)
        }
      });
      return;
    }
    cb(null);
  }, [history.present.nodes, props.options, selectedId]);

  function commit(nextDoc: EditorDocument) {
    setHistory((h) => pushHistory(h, cloneDoc(nextDoc)));
  }

  // Update "present" without adding a new undo step.
  function setPresent(nextDoc: EditorDocument) {
    setHistory((h) => ({ ...h, present: cloneDoc(nextDoc) }));
  }

  // Cancel the last pushHistory (so tiny drags don't leave an undo step).
  function cancelLastPush(h: HistoryState<EditorDocument>): HistoryState<EditorDocument> {
    if (h.past.length === 0) return h;
    const past = h.past.slice(0, -1);
    const previous = h.past[h.past.length - 1] as EditorDocument;
    return { past, present: previous, future: [] };
  }

  function deleteNodeById(id: string) {
    setHistory((h) => pushHistory(h, removeNode(h.present, id)));
    if (selectedId === id) setSelectedId(null);
    if (editingTextId === id) setEditingTextId(null);
    setContextMenu(null);
  }

  function finishTextEditing() {
    if (!editingTextId) return;
    commit(updateNode(history.present, editingTextId, { text: editingTextDraft }));
    setEditingTextId(null);
    setTool({ kind: 'select' });
  }

  function getPointer() {
    const stage = stageRef.current;
    if (!stage) return null;
    return stage.getPointerPosition();
  }

  function getPointerInDocument() {
    const p = getPointer();
    if (!p) return null;
    return {
      x: (p.x - stagePosition.x) / stageScale,
      y: (p.y - stagePosition.y) / stageScale
    };
  }

  function getTextBoundsFromStageInDoc(id: string, fallback: TextNode): { x: number; y: number; width: number; height: number } {
    const stage = stageRef.current;
    if (!stage) return textBoundsApprox(fallback);
    const n = stage.findOne(`#${id}`) as unknown as Konva.Text | null;
    if (!n) return textBoundsApprox(fallback);
    const r = n.getClientRect({ skipTransform: false });
    // Convert stage (screen) coords back into document coords.
    return {
      x: (r.x - stagePosition.x) / stageScale,
      y: (r.y - stagePosition.y) / stageScale,
      width: r.width / stageScale,
      height: r.height / stageScale
    };
  }

  function commitKonvaTextTransform(textId: string, konvaText: Konva.Text) {
    const orig = historyRef.current.present.nodes.find((n): n is TextNode => n.kind === 'text' && n.id === textId);
    if (!orig) return;

    const scaleX = konvaText.scaleX();
    const scaleY = konvaText.scaleY();
    const absX = Math.abs(scaleX) || 1;
    const absY = Math.abs(scaleY) || 1;

    const visualRect = konvaText.getClientRect({ skipTransform: false });
    const baseWidthNow = konvaText.width();
    const baseFontSizeNow = konvaText.fontSize();

    konvaText.scaleX(1);
    konvaText.scaleY(1);

    const patch: Partial<TextNode> = {
      x: (visualRect.x - stagePosition.x) / stageScale,
      y: (visualRect.y - stagePosition.y) / stageScale
    };

    if (absX !== 1) patch.width = Math.max(40, baseWidthNow * absX);
    if (absY !== 1) {
      patch.fontSize = Math.max(10, baseFontSizeNow * absY);
      patch.padding = Math.max(0, Math.round((orig.padding ?? 0) * absY));
    }
    if (orig.letterSpacing != null && absX !== 1) patch.letterSpacing = orig.letterSpacing * absX;

    commit(updateNode(historyRef.current.present, textId, patch));
  }

  function onStageMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!bgImage) return;
    // Background drag mode: only allow dragging the image, no drawing/selecting.
    if (bgDragMode) {
      // DOM-level pointer listeners handle background drag in align mode.
      return;
    }
    setContextMenu(null);
    const pos = getPointer();
    const docPos = getPointerInDocument();
    if (!pos) return;

    // Crop mode: drag a crop rectangle; affects only export output.
    if (transformMode === 'crop') {
      finishTextEditing();
      setSelectedId(null);
      setActiveMosaicId(null);
      isDrawingRef.current = false;
      drawingNodeIdRef.current = null;
      // Important:
      // If a valid crop rect already exists, don't reset it on mouse-down.
      // Otherwise the subsequent click-outside handler will think the click is
      // inside a newly-created tiny rect and won't apply crop.
      if (cropRectDoc && cropRectDoc.width >= 4 && cropRectDoc.height >= 4) {
        return;
      }

      // Initialize selection rect at mouse-down.
      if (!cropRectDoc) {
        setCropRectDoc({ x: docPos.x, y: docPos.y, width: 1, height: 1 });
      } else {
        // Keep current rect; transformer will handle drag/resize.
      }
      return;
    }

    if (tool.kind === 'text') {
      isTextCreatingRef.current = true;
      drawStartRef.current = docPos ?? pos;
      return;
    }

    if (tool.kind === 'select') {
      const stage = stageRef.current;
      const clickedOnEmpty = stage?.getIntersection(pos) == null;
      // Non-editing/select mode: allow dragging the whole canvas directly on empty area.
      // Keep space-drag behavior as compatible fallback.
      if (clickedOnEmpty && (spacePressedRef.current || !editingTextId)) {
        panStartRef.current = { pointer: pos, position: { ...stagePosition } };
      }
      return;
    }

    if (!docPos) return;
    isDrawingRef.current = true;
    drawStartRef.current = docPos;
    drawingNodeIdRef.current = null;

    if (tool.kind === 'mosaic' && (tool.mode ?? 'rect') === 'rect') {
      // Ensure mosaic base snapshot is up-to-date at the moment drawing starts
      // (prevents mosaicing against stale pre-resize text geometry).
      const snap = captureSnapshotCanvasNow();
      if (snap) {
        setBaseCanvas(snap);
        setSnapshotVersion((v) => v + 1);
      }
      const next = addMosaicRect(history.present, {
        x: docPos.x,
        y: docPos.y,
        width: 1,
        height: 1,
        pixelSize: tool.pixelSize,
        style: tool.style ?? 'pixel',
        blurRadius: tool.style === 'blur' ? (tool.blurRadius ?? 6) : undefined
      });
      const id = next.nodes[next.nodes.length - 1]?.id ?? null;
      drawingNodeIdRef.current = id;
      if (id) setActiveMosaicId(id);
      // Create one undo step for the whole drag gesture.
      commit(next);
      setSelectedId(id);
      return;
    }

    if (tool.kind === 'mosaic' && (tool.mode ?? 'rect') === 'brush') {
      const snap = captureSnapshotCanvasNow();
      if (snap) {
        setBaseCanvas(snap);
        setSnapshotVersion((v) => v + 1);
      }
      lastBrushPosRef.current = docPos;
      const brushSize = tool.brushSize ?? tool.pixelSize * 2;
      const next = addMosaicStroke(history.present, {
        points: [{ x: docPos.x, y: docPos.y }],
        brushSize,
        pixelSize: tool.pixelSize,
        style: tool.style ?? 'pixel',
        blurRadius: tool.style === 'blur' ? (tool.blurRadius ?? 6) : undefined
      });
      const id = next.nodes[next.nodes.length - 1]?.id ?? null;
      drawingNodeIdRef.current = id;
      if (id) setActiveMosaicId(id);
      // Create one undo step for the whole brush stroke.
      commit(next);
      setSelectedId(id);
      return;
    }

    if (tool.kind === 'arrow') {
      const next = addArrow(history.present, {
        arrowKind: tool.arrowKind ?? 'straight',
        points: [{ x: docPos.x, y: docPos.y }, { x: docPos.x, y: docPos.y }],
        stroke: tool.stroke,
        strokeWidth: tool.strokeWidth,
        pointerLength: tool.pointerLength,
        pointerWidth: tool.pointerWidth
      });
      const id = next.nodes[next.nodes.length - 1]?.id ?? null;
      drawingNodeIdRef.current = id;
      // Create one undo step for the whole arrow drag.
      commit(next);
      return;
    }
  }

  function onStageMouseMove() {
    if (bgDragMode) {
      return;
    }
    const pos = getPointer();
    if (pos && panStartRef.current) {
      const dx = pos.x - panStartRef.current.pointer.x;
      const dy = pos.y - panStartRef.current.pointer.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isPanningRef.current = true;
        setStagePosition({
          x: panStartRef.current.position.x + dx,
          y: panStartRef.current.position.y + dy
        });
      }
    }
    if (tool.kind === 'text') {
      return;
    }
    if (!isDrawingRef.current) return;
    const start = drawStartRef.current;
    const id = drawingNodeIdRef.current;
    const docPos = getPointerInDocument();
    if (!docPos) return;

    if (tool.kind === 'mosaic' && (tool.mode ?? 'rect') === 'rect') {
      if (!start || !id) return;
      const r = normalizeRect(start, docPos);
      const next = updateNode(historyRef.current.present, id, r);
      setPresent(next);
      return;
    }

    if (tool.kind === 'mosaic' && (tool.mode ?? 'rect') === 'brush') {
      if (!id) return;
      const last = lastBrushPosRef.current ?? docPos;
      const brushSize = tool.brushSize ?? tool.pixelSize * 2;
      const dx = docPos.x - last.x;
      const dy = docPos.y - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0;
      const step = Math.max(2, brushSize * 0.35);
      const steps = Math.max(1, Math.floor(dist / step));
      const stroke = historyRef.current.present.nodes.find(
        (n): n is MosaicStrokeNode => n.id === id && n.kind === 'mosaicStroke'
      );
      if (!stroke) return;

      const newPoints: { x: number; y: number }[] = [];
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        newPoints.push({ x: last.x + dx * t, y: last.y + dy * t });
      }

      setPresent(updateNode(historyRef.current.present, id, { points: [...stroke.points, ...newPoints] }));
      lastBrushPosRef.current = docPos;
      return;
    }

    if (tool.kind === 'arrow') {
      if (!start || !id) return;
      const next = updateNode(historyRef.current.present, id, { points: [start, docPos] });
      setPresent(next);
      return;
    }
  }

  function onStageMouseUp() {
    if (bgDragMode) {
      return;
    }
    if (isPanningRef.current) {
      isPanningRef.current = false;
      panStartRef.current = null;
      return;
    }
    const hadPanStart = !!panStartRef.current;
    panStartRef.current = null;

    const start = drawStartRef.current;
    const pos = getPointerInDocument();

    if (tool.kind === 'text' && isTextCreatingRef.current) {
      isTextCreatingRef.current = false;
      drawStartRef.current = null;
      if (!start || !pos) {
        if (hadPanStart) setSelectedId(null);
        return;
      }
      const dx = pos.x - start.x;
      const dy = pos.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const baseTextProps = {
        text: '',
        fill: tool.fill,
        fontSize: tool.fontSize,
        fontFamily: tool.fontFamily,
        backgroundFill: tool.backgroundFill,
        padding: tool.padding,
        align: tool.align ?? ('left' as const),
        lineHeight: tool.lineHeight ?? 1.25,
        letterSpacing: tool.letterSpacing ?? 0,
        fontWeight: tool.fontWeight
      };

      let nextDoc: EditorDocument;
      if (dist < 4) {
        // Single click: single-line text
        nextDoc = addText(history.present, {
          x: pos.x,
          y: pos.y,
          mode: 'singleLine',
          ...baseTextProps
        });
      } else {
        // Dragged rectangle: area text
        const r = normalizeRect(start, pos);
        nextDoc = addText(history.present, {
          x: r.x,
          y: r.y,
          mode: 'area',
          width: Math.max(40, r.width),
          ...baseTextProps
        });
      }
      const last = nextDoc.nodes[nextDoc.nodes.length - 1] ?? null;
      const id = last?.id ?? null;
      commit(nextDoc);
      setSelectedId(id);
      props.options?.onTextCreated?.();
      return;
    }

    if (hadPanStart) setSelectedId(null);

    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const id = drawingNodeIdRef.current;
    drawStartRef.current = null;
    drawingNodeIdRef.current = null;
    lastBrushPosRef.current = null;

    if (!start || !id) return;

    const node = historyRef.current.present.nodes.find((n) => n.id === id);
    if (node?.kind === 'mosaicRect') {
      if (node.width < 4 || node.height < 4) {
        setHistory((h) => cancelLastPush(h));
        setSelectedId(null);
        return;
      }
      // Ensure rect uses final pointer position (mouseUp can happen without a last mouseMove).
      if (!start || !pos) return;
      const region = normalizeRect(start, pos);
      setHistory((h) => {
        let doc = updateNode(h.present, node.id, region);
        // "Replace" semantics: carve old mosaics under this new region (so overlap is truly replaced).
        doc = carveOverlappedMosaicRects(doc, region, node.id);
        // Keep arrow/text above mosaics at all times: do not split/lock nodes under mosaic region.
        return { ...h, present: cloneDoc(doc) };
      });
    }
    if (node?.kind === 'mosaicStroke') {
      if (node.points.length < 2) {
        setHistory((h) => cancelLastPush(h));
        setSelectedId(null);
      } else {
        // Keep arrow/text above mosaics at all times: do not split/lock nodes under mosaic region.
        const region = strokeBounds(node);
        setHistory((h) => {
          let doc = h.present;
          // IMPORTANT: 不要在笔刷打码时“挖掉”旧的马赛克 stroke。
          // carveOverlappedMosaicRects 对 stroke 的策略是直接删除旧 stroke（无法可靠裁剪），
          // 这会导致“以前的马赛克消失”。笔刷之间的覆盖由渲染顺序自然叠加即可。
          void region;
          return { ...h, present: cloneDoc(doc) };
        });
      }
    }
    if (node?.kind === 'arrow') {
      const dx = Math.abs(node.points[0].x - node.points[1].x);
      const dy = Math.abs(node.points[0].y - node.points[1].y);
      if (dx < 3 && dy < 3) {
        // Click without drag: don't create an arrow.
        setHistory((h) => cancelLastPush(h));
        return;
      }
      // Only select if a real arrow was drawn (prevents tiny transformer box flash).
      setSelectedId(id);
    }

    setActiveMosaicId(null);
  }

  function startEditingTextNode(node: TextNode) {
    setEditingTextId(node.id);
    setEditingTextDraft(node.text);
    setSelectedId(node.id);
    // Focus after render.
    queueMicrotask(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    });
  }

  function startEditingText(id: string) {
    const node = history.present.nodes.find((n): n is TextNode => n.kind === 'text' && n.id === id);
    if (!node) return;
    startEditingTextNode(node);
  }

  function onStageClick(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!bgImage) return;
    // Text creation now handled in mouse down/up; click here only used for clearing selection in select tool.
    if (transformMode === 'crop') {
      const stage = stageRef.current;
      if (!stage) return;
      const docPos = getPointerInDocument();
      if (!docPos || !cropRectDoc) return;

      // Finish crop only when user clicks outside the selection rectangle.
      const inside =
        docPos.x >= cropRectDoc.x &&
        docPos.x <= cropRectDoc.x + cropRectDoc.width &&
        docPos.y >= cropRectDoc.y &&
        docPos.y <= cropRectDoc.y + cropRectDoc.height;

      if (!inside) applyCropNow();
      return;
    }
    if (tool.kind === 'select') {
      const stage = stageRef.current;
      const clickedOnEmpty = !!stage && e.target === stage;
      if (clickedOnEmpty) setSelectedId(null);
    }
  }

  function onSelectNode(id: string) {
    const node = history.present.nodes.find((n) => n.id === id) ?? null;
    if ((node as any)?.locked) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
  }

  function moveMosaicNodeBy(node: MosaicRectNode | MosaicStrokeNode, dx: number, dy: number): EditorDocument {
    if (node.kind === 'mosaicRect') {
      return updateNode(historyRef.current.present, node.id, { x: node.x + dx, y: node.y + dy });
    }
    return updateNode(historyRef.current.present, node.id, {
      points: node.points.map((p) => ({ x: p.x + dx, y: p.y + dy }))
    });
  }

  function mosaicHitNode(n: MosaicRectNode | MosaicStrokeNode) {
    if (n.kind === 'mosaicRect') {
      return (
        <Rect
          x={n.x}
          y={n.y}
          width={n.width}
          height={n.height}
          fill="rgba(0,0,0,0.001)"
          strokeEnabled={false}
          listening={true}
        />
      );
    }
    const pts: number[] = [];
    for (const p of n.points) pts.push(p.x, p.y);
    return (
      <Line
        points={pts}
        stroke="rgba(0,0,0,0.001)"
        strokeWidth={n.brushSize}
        lineCap="round"
        lineJoin="round"
        listening={true}
        hitStrokeWidth={Math.max(20, n.brushSize + 8)}
      />
    );
  }

  function applyExportTransforms(
    srcCanvas: HTMLCanvasElement,
    overrideCropRectDoc?: typeof cropRectDoc
  ): HTMLCanvasElement {
    let outCanvas: HTMLCanvasElement = srcCanvas;

    // 1) Crop (stage canvas coords, derived from doc coords).
    const effectiveCrop = overrideCropRectDoc ?? cropRectDoc;
    if (effectiveCrop) {
      const scale = stageScale;
      const pos = stagePosition;

      const x = effectiveCrop.x * scale + pos.x;
      const y = effectiveCrop.y * scale + pos.y;
      const w = effectiveCrop.width * scale;
      const h = effectiveCrop.height * scale;

      const sx = clamp(Math.round(x), 0, outCanvas.width - 1);
      const sy = clamp(Math.round(y), 0, outCanvas.height - 1);
      const ex = clamp(Math.round(x + w), 0, outCanvas.width);
      const ey = clamp(Math.round(y + h), 0, outCanvas.height);
      const cw = Math.max(1, ex - sx);
      const ch = Math.max(1, ey - sy);

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cw;
      cropCanvas.height = ch;
      const ctx = cropCanvas.getContext('2d');
      if (!ctx) return outCanvas;
      ctx.drawImage(outCanvas, sx, sy, cw, ch, 0, 0, cw, ch);
      outCanvas = cropCanvas;
    }

    return outCanvas;
  }

  function applyCropNow() {
    if (!cropRectDoc) return;
    if (cropRectDoc.width < 4 || cropRectDoc.height < 4) return;
    const stage = stageRef.current;
    if (!stage) return;

    // Important: do NOT include crop UI (selection rectangle + transformer) into output.
    const cropRectNode = cropRectNodeRef.current;
    const transformer = transformerRef.current;

    const prevCropVisible = cropRectNode ? cropRectNode.visible() : true;
    const prevTransformerVisible = transformer ? transformer.visible() : true;

    if (cropRectNode) cropRectNode.visible(false);
    if (transformer) transformer.visible(false);

    const canvas = stage.toCanvas({ pixelRatio: 1 });
    const transformed = applyExportTransforms(canvas, cropRectDoc);

    // Restore for safety (we'll immediately reset states after cropping anyway).
    if (cropRectNode) cropRectNode.visible(prevCropVisible);
    if (transformer) transformer.visible(prevTransformerVisible);
    const dataUrl = transformed.toDataURL('image/png');
    const newDoc = createEmptyDocument({
      width: transformed.width,
      height: transformed.height,
      backgroundSrc: dataUrl
    });

    // Make crop undoable: replace document with cropped background.
    setHistory((h) => pushHistory(h, newDoc));

    // Background rendering must follow the history background.
    bgSrcUpdateOriginRef.current = 'history';
    setBgSrc(dataUrl);

    props.options?.onCropApplied?.();
    setTransformModeState('none');
    setCropRectDoc(null);
    setSelectedId(null);
    setActiveMosaicId(null);
  }

  function clampCropRectDoc(next: typeof cropRectDoc): typeof cropRectDoc {
    if (!next) return null;
    const docW = historyRef.current.present.width;
    const docH = historyRef.current.present.height;
    if (docW <= 0 || docH <= 0) return null;

    const minSize = 4;
    const width = Math.max(minSize, Math.min(next.width, docW));
    const height = Math.max(minSize, Math.min(next.height, docH));
    const x = clamp(next.x, 0, Math.max(0, docW - width));
    const y = clamp(next.y, 0, Math.max(0, docH - height));
    return { x, y, width, height };
  }

  async function exportBlob(options: { format: 'png' | 'jpeg' | 'webp'; quality?: number }) {
    const stage = stageRef.current;
    if (!stage) throw new Error('Stage not ready');
    const canvas = stage.toCanvas({ pixelRatio: 1 });
    const transformed = applyExportTransforms(canvas);
    return await exportCanvasToBlob(transformed, options);
  }

  useImperativeHandle(ref, () => ({
    setTool(nextTool) {
      if (nextTool.kind !== 'text') finishTextEditing();
      setTool(nextTool);
      if (nextTool.kind !== 'select') setSelectedId(null);
      if (nextTool.kind !== 'select') {
        setTransformModeState('none');
        setCropRectDoc(null);
      }
    },
    setTransformMode(mode) {
      // Stop crop drag on mode switch.
      if (mode === 'none') setCropRectDoc(null);
      if (mode === 'crop') {
        const w = historyRef.current.present.width;
        const h = historyRef.current.present.height;
        setCropRectDoc((prev) => (prev && prev.width > 0 && prev.height > 0 ? prev : { x: 0, y: 0, width: w, height: h }));
      }
      setTransformModeState(mode);
      setSelectedId(null);
    },
    clearCrop() {
      setCropRectDoc(null);
    },
    resetTransforms() {
      setCropRectDoc(null);
      setTransformModeState('none');
    },
    applyTextStyle(style) {
      setHistory((h) => {
        const id = selectedId;
        if (!id) return h;
        const node = h.present.nodes.find((n): n is TextNode => n.kind === 'text' && n.id === id);
        if (!node) return h;
        const patch: Partial<TextNode> = {};
        if (style.fill != null) patch.fill = style.fill;
        if (style.fontSize != null) patch.fontSize = style.fontSize;
        if (style.fontFamily != null) patch.fontFamily = style.fontFamily;
        if (style.fontWeight != null) patch.fontWeight = style.fontWeight;
        if (style.align != null) patch.align = style.align;
        if (style.lineHeight != null) patch.lineHeight = style.lineHeight;
        if (style.letterSpacing != null) patch.letterSpacing = style.letterSpacing;
        return pushHistory(h, updateNode(h.present, id, patch));
      });
    },
    applyArrowStyle(style) {
      setHistory((h) => {
        const id = selectedId;
        if (!id) return h;
        const node = h.present.nodes.find((n): n is ArrowNode => n.kind === 'arrow' && n.id === id);
        if (!node) return h;
        const patch: Partial<ArrowNode> = {};
        if (style.arrowKind != null) patch.arrowKind = style.arrowKind;
        if (style.stroke != null) patch.stroke = style.stroke;
        if (style.strokeWidth != null) patch.strokeWidth = style.strokeWidth;
        if (style.pointerSize != null) {
          patch.pointerLength = style.pointerSize;
          patch.pointerWidth = style.pointerSize;
        }
        return pushHistory(h, updateNode(h.present, id, patch));
      });
    },
    undo() {
      finishTextEditing();
      const next = undo(historyRef.current);
      bgSrcUpdateOriginRef.current = 'history';
      setBgSrc(next.present.background.src);
      setHistory(next);
      setUndoRedoKey((k) => k + 1);
      setSelectedId(null);
      setTransformModeState('none');
      setCropRectDoc(null);
    },
    redo() {
      finishTextEditing();
      const next = redo(historyRef.current);
      bgSrcUpdateOriginRef.current = 'history';
      setBgSrc(next.present.background.src);
      setHistory(next);
      setUndoRedoKey((k) => k + 1);
      setSelectedId(null);
      setTransformModeState('none');
      setCropRectDoc(null);
    },
    saveTemplate() {
      if (!templateKey) {
        props.options?.onTemplateEvent?.({ type: 'invalid_key', key: '' });
        return;
      }
      saveTemplateNow(historyRef.current.present);
    },
    applyTemplate() {
      if (!templateKey) {
        props.options?.onTemplateEvent?.({ type: 'invalid_key', key: '' });
        return;
      }
      try {
        const tpl = loadTemplate();
        if (!tpl) {
          props.options?.onTemplateEvent?.({ type: 'not_found', key: templateKey });
          return;
        }
        const nodeCount = tpl.nodes.length;
        setHistory((h) => pushHistory(h, applyTemplateToDocument(h.present, tpl)));
        setSelectedId(null);
        props.options?.onTemplateEvent?.({ type: 'apply', key: templateKey, nodeCount });
      } catch (e) {
        props.options?.onTemplateEvent?.({
          type: 'error',
          key: templateKey,
          message: e instanceof Error ? e.message : String(e)
        });
      }
    },
    clearTemplate() {
      clearTemplateNow();
      // Also clear current annotation layer so user can remove an applied template immediately.
      setHistory((h) => pushHistory(h, { ...h.present, nodes: [] }));
      setSelectedId(null);
      setDetectedRegions([]);
      setActiveMosaicId(null);
    },
    exportAnnotations() {
      return snapshotFromDoc(historyRef.current.present, bgOffsetDoc) as any;
    },
    importAnnotations(snapshot) {
      if (!snapshot || snapshot.version !== 1) return;
      const off = (snapshot as any).bgOffset;
      if (off && typeof off.x === 'number' && typeof off.y === 'number') setBgOffsetDoc({ x: off.x, y: off.y });
      else setBgOffsetDoc({ x: 0, y: 0 });
      setHistory((h) => pushHistory(h, applyTemplateToDocument(h.present, snapshot as any)));
      setSelectedId(null);
    },
    clearAnnotations() {
      setHistory((h) => pushHistory(h, { ...h.present, nodes: [] }));
      setSelectedId(null);
      setDetectedRegions([]);
      setActiveMosaicId(null);
    },
    setBackgroundDragMode(enabled) {
      bgDragModeRef.current = !!enabled;
      setBgDragMode(!!enabled);
      setSelectedId(null);
      setActiveMosaicId(null);
    },
    resetBackgroundOffset() {
      setBgOffsetDoc({ x: 0, y: 0 });
    },
    addMosaicRects(rects: Array<{ x: number; y: number; width: number; height: number }>) {
      if (rects.length === 0) return;
      setHistory((h) => {
        let doc = h.present;
        for (const r of rects) {
          if (r.width <= 0 || r.height <= 0) continue;
          doc = carveOverlappedMosaicRects(doc, r);
          doc = addMosaicRect(doc, {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            pixelSize: 14,
            style: 'pixel'
          });
        }
        return pushHistory(h, doc);
      });
    },
    setDetectedRegions(rects: MosaicRectInput[]) {
      setDetectedRegions(
        rects.map((r, idx) => ({
          ...r,
          id: `det_${Date.now()}_${idx}`,
          selected: true
        }))
      );
    },
    clearDetectedRegions() {
      setDetectedRegions([]);
    },
    setAllDetectedRegionsSelected(selected: boolean) {
      setAllDetectedRegionsSelected(selected);
    },
    applyDetectedRegionsAsMosaic(options) {
      if (detectedRegions.length === 0) return;
      const pixelSize = options?.pixelSize ?? 14;
      const style = options?.style ?? 'pixel';
      const blurRadius = style === 'blur' ? (options?.blurRadius ?? 6) : undefined;
      const selected = detectedRegions.filter((r) => r.selected && r.width > 0 && r.height > 0);
      if (selected.length === 0) {
        setDetectedRegions([]);
        return;
      }
      setHistory((h) => {
        let doc = h.present;
        for (const r of selected) {
          doc = carveOverlappedMosaicRects(doc, r);
          doc = addMosaicRect(doc, {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            pixelSize,
            style,
            blurRadius
          });
        }
        return pushHistory(h, doc);
      });
      setDetectedRegions([]);
    },
    export: exportBlob,
    destroy() {
      // React handles unmount; kept for API symmetry.
    }
  }));

  useEffect(() => {
    const doc = container.ownerDocument;
    const onMouseDownCapture = (ev: MouseEvent) => {
      if (!editingTextId) return;
      const ta = textareaRef.current;
      const target = ev.target as Node | null;
      if (ta && target && (target === ta || ta.contains(target))) return;
      const stageContainer = stageRef.current?.container();
      const clickedInsideStage = !!stageContainer && !!target && stageContainer.contains(target);
      if (clickedInsideStage) suppressNextTextCreateRef.current = true;
      finishTextEditing();
    };
    doc.addEventListener('mousedown', onMouseDownCapture, true);
    return () => doc.removeEventListener('mousedown', onMouseDownCapture, true);
  }, [container, editingTextId, editingTextDraft, history.present]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTextInput =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          (target as any).isContentEditable);
      if (isTextInput) return;

      const key = e.key.toLowerCase();
      if (key === ' ') spacePressedRef.current = true;
      if ((e.ctrlKey || e.metaKey) && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo(history)) {
            const next = redo(history);
            bgSrcUpdateOriginRef.current = 'history';
            setBgSrc(next.present.background.src);
            setHistory(next);
            setUndoRedoKey((k) => k + 1);
          }
        } else {
          if (canUndo(history)) {
            const next = undo(history);
            bgSrcUpdateOriginRef.current = 'history';
            setBgSrc(next.present.background.src);
            setHistory(next);
            setUndoRedoKey((k) => k + 1);
          }
        }
        setSelectedId(null);
        setTransformModeState('none');
        setCropRectDoc(null);
      }
      if ((e.ctrlKey || e.metaKey) && key === 'y') {
        e.preventDefault();
        if (canRedo(history)) {
          const next = redo(history);
          bgSrcUpdateOriginRef.current = 'history';
          setBgSrc(next.present.background.src);
          setHistory(next);
          setUndoRedoKey((k) => k + 1);
        }
        setSelectedId(null);
        setTransformModeState('none');
        setCropRectDoc(null);
      }
      if (key === 'delete' || key === 'backspace') {
        e.preventDefault();
        if (!selectedId) return;
        if (selectedId === editingTextId) setEditingTextId(null);
        commit(removeNode(history.present, selectedId));
        setSelectedId(null);
      }
      if (key === 'escape') {
        if (editingTextId) {
          e.preventDefault();
          finishTextEditing();
        }
      }
    };
    container.ownerDocument.addEventListener('keydown', onKeyDown);
    return () => container.ownerDocument.removeEventListener('keydown', onKeyDown);
  }, [container, history, selectedId]);

  // Auto-save template (debounced) when annotations change.
  useEffect(() => {
    if (!templateKey || !templateAutoSave) return;
    // Only save after the image is loaded and we have a real document size.
    if (history.present.width <= 1 || history.present.height <= 1) return;
    if (templateSaveTimerRef.current) window.clearTimeout(templateSaveTimerRef.current);
    templateSaveTimerRef.current = window.setTimeout(() => {
      saveTemplateNow(historyRef.current.present);
    }, 350);
    return () => {
      if (templateSaveTimerRef.current) window.clearTimeout(templateSaveTimerRef.current);
      templateSaveTimerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateKey, templateAutoSave, history.present.nodes, history.present.width, history.present.height]);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === ' ') spacePressedRef.current = false;
    };
    container.ownerDocument.addEventListener('keyup', onKeyUp);
    return () => container.ownerDocument.removeEventListener('keyup', onKeyUp);
  }, [container]);

  const editingTextNode = editingTextId
    ? history.present.nodes.find((n): n is TextNode => n.kind === 'text' && n.id === editingTextId) ?? null
    : null;
  const editingTextRect = useMemo(() => {
    if (!editingTextId) return null;
    const stage = stageRef.current;
    const node = stage?.findOne(`#${editingTextId}`) as unknown as Konva.Text | null;
    if (!node) return null;
    return node.getClientRect({ skipTransform: false });
  }, [editingTextId, history.present.nodes]);

  if (!bgImage) {
    return (
      <div style={{ padding: 12, fontFamily: 'system-ui' }}>
        {imageLoadError ? (
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Failed to load image</div>
            <div style={{ opacity: 0.8, fontSize: 12, whiteSpace: 'pre-wrap' }}>{imageLoadError}</div>
          </div>
        ) : (
          'Loading image…'
        )}
      </div>
    );
  }

  const MIN_SCALE = 0.1;
  const MAX_SCALE = 10;
  const ZOOM_FACTOR = 1.12;

  function onStageWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    if (transformMode === 'crop') return;
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const scaleBy = e.evt.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, stageScale * scaleBy));
    const docX = (pointer.x - stagePosition.x) / stageScale;
    const docY = (pointer.y - stagePosition.y) / stageScale;
    setStageScale(newScale);
    setStagePosition({
      x: pointer.x - docX * newScale,
      y: pointer.y - docY * newScale
    });
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: stageSize.width, height: stageSize.height }}>
        <Stage
          ref={(n) => (stageRef.current = n)}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          onMouseUp={onStageMouseUp}
          onClick={onStageClick}
          onWheel={onStageWheel}
          style={{ background: '#111' }}
        >
          <Layer>
            <Group
              x={stagePosition.x}
              y={stagePosition.y}
              scaleX={stageScale}
              scaleY={stageScale}
              listening={true}
            >
            <Group
              ref={(n) => (baseGroupRef.current = n)}
              listening={true}
            >
              <KonvaImage
                image={bgImage}
                x={bgOffsetDoc.x}
                y={bgOffsetDoc.y}
                listening={bgDragMode}
                draggable={bgDragMode}
                onDragMove={(ev) => {
                  if (!bgDragMode) return;
                  const n = ev.target as any;
                  setBgOffsetDoc({ x: n.x(), y: n.y() });
                }}
                onDragEnd={(ev) => {
                  if (!bgDragMode) return;
                  const n = ev.target as any;
                  setBgOffsetDoc({ x: n.x(), y: n.y() });
                }}
              />
              <Rect
                x={0}
                y={0}
                width={history.present.width}
                height={history.present.height}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={1}
                visible={false}
                listening={false}
              />
              {transformMode === 'crop' && cropRectDoc ? (
                <Rect
                  ref={(n) => (cropRectNodeRef.current = n)}
                  x={cropRectDoc.x}
                  y={cropRectDoc.y}
                  width={cropRectDoc.width}
                  height={cropRectDoc.height}
                  stroke="rgba(76,159,254,0.95)"
                  dash={[6, 4]}
                  strokeWidth={2}
                  fill="rgba(76,159,254,0.10)"
                  draggable={true}
                  listening={true}
                  onDragMove={(ev) => {
                    const node = ev.target as unknown as Konva.Rect;
                    const next = clampCropRectDoc({
                      x: node.x(),
                      y: node.y(),
                      width: node.width(),
                      height: node.height()
                    });
                    if (!next) return;
                    setCropRectDoc(next);
                  }}
                  onTransformEnd={(ev) => {
                    const node = ev.target as unknown as Konva.Rect;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const newW = node.width() * scaleX;
                    const newH = node.height() * scaleY;
                    node.scaleX(1);
                    node.scaleY(1);
                    const next = clampCropRectDoc({
                      x: node.x(),
                      y: node.y(),
                      width: newW,
                      height: newH
                    });
                    if (!next) return;
                    setCropRectDoc(next);
                  }}
                />
              ) : null}
            </Group>
            {/* Render mosaics above background, but below arrow/text layer */}
            {mosaicNodesInOrder
              .filter((n) => !activeMosaicId || n.id !== activeMosaicId)
              .map((n) => {
                const canDragMosaic = tool.kind === 'select' && transformMode !== 'crop' && !bgDragMode;
                const style = (n as any).style ?? 'pixel';
                const w = history.present.width;
                const h = history.present.height;
                const fallbackSource = bgImage as any;
                const fallbackX = bgOffsetDoc.x;
                const fallbackY = bgOffsetDoc.y;

                if (style === 'blur') {
                  const radius = ((n as any).blurRadius as number | undefined) ?? 6;
                  const cached = blurCache[radius];
                  const img = cached?.key === baseSnapshotKey ? cached.img : null;
                  if (!img) {
                    return (
                      <Group
                        key={`mosaic_blur_ph_${radius}_${n.id}`}
                        id={n.id}
                        listening={true}
                        draggable={canDragMosaic}
                        onClick={(ev) => {
                          ev.cancelBubble = true;
                          onSelectNode(n.id);
                        }}
                        onDragEnd={(ev) => {
                          const g = ev.target as unknown as Konva.Group;
                          const dx = g.x();
                          const dy = g.y();
                          g.position({ x: 0, y: 0 });
                          if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
                          commit(moveMosaicNodeBy(n, dx, dy));
                        }}
                        clipFunc={(ctx) => {
                          if (n.kind === 'mosaicRect') {
                            ctx.rect(n.x, n.y, n.width, n.height);
                            return;
                          }
                          // mosaicStroke
                          ctx.beginPath();
                          const r = n.brushSize / 2;
                          for (const p of n.points) {
                            ctx.moveTo(p.x + r, p.y);
                            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                          }
                        }}
                      >
                        {mosaicHitNode(n)}
                        <KonvaImage image={fallbackSource} x={fallbackX} y={fallbackY} width={w} height={h} listening={false} />
                      </Group>
                    );
                  }
                  return (
                    <Group
                      key={`mosaic_blur_${radius}_${n.id}`}
                      id={n.id}
                      listening={true}
                      draggable={canDragMosaic}
                      onClick={(ev) => {
                        ev.cancelBubble = true;
                        onSelectNode(n.id);
                      }}
                      onDragEnd={(ev) => {
                        const g = ev.target as unknown as Konva.Group;
                        const dx = g.x();
                        const dy = g.y();
                        g.position({ x: 0, y: 0 });
                        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
                        commit(moveMosaicNodeBy(n, dx, dy));
                      }}
                      clipFunc={(ctx) => {
                        if (n.kind === 'mosaicRect') {
                          ctx.rect(n.x, n.y, n.width, n.height);
                          return;
                        }
                        // mosaicStroke
                        ctx.beginPath();
                        const r = n.brushSize / 2;
                        for (const p of n.points) {
                          ctx.moveTo(p.x + r, p.y);
                          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                        }
                      }}
                    >
                      {mosaicHitNode(n)}
                      <KonvaImage image={img} x={bgOffsetDoc.x} y={bgOffsetDoc.y} width={w} height={h} listening={false} />
                    </Group>
                  );
                }

                // pixel (default)
                const size = (n as any).pixelSize as number;
                const cached = pixelCache[size];
                const img = cached?.key === baseSnapshotKey ? cached.img : null;
                if (!img) {
                  return (
                    <Group
                      key={`mosaic_pixel_ph_${size}_${n.id}`}
                      id={n.id}
                      listening={true}
                      draggable={canDragMosaic}
                      onClick={(ev) => {
                        ev.cancelBubble = true;
                        onSelectNode(n.id);
                      }}
                      onDragEnd={(ev) => {
                        const g = ev.target as unknown as Konva.Group;
                        const dx = g.x();
                        const dy = g.y();
                        g.position({ x: 0, y: 0 });
                        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
                        commit(moveMosaicNodeBy(n, dx, dy));
                      }}
                      clipFunc={(ctx) => {
                        if (n.kind === 'mosaicRect') {
                          ctx.rect(n.x, n.y, n.width, n.height);
                          return;
                        }
                        // mosaicStroke
                        ctx.beginPath();
                        const r = n.brushSize / 2;
                        for (const p of n.points) {
                          ctx.moveTo(p.x + r, p.y);
                          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                        }
                      }}
                    >
                      {mosaicHitNode(n)}
                      <KonvaImage image={fallbackSource} x={fallbackX} y={fallbackY} width={w} height={h} listening={false} />
                    </Group>
                  );
                }
                return (
                  <Group
                    key={`mosaic_pixel_${size}_${n.id}`}
                    id={n.id}
                    listening={true}
                    draggable={canDragMosaic}
                    onClick={(ev) => {
                      ev.cancelBubble = true;
                      onSelectNode(n.id);
                    }}
                    onDragEnd={(ev) => {
                      const g = ev.target as unknown as Konva.Group;
                      const dx = g.x();
                      const dy = g.y();
                      g.position({ x: 0, y: 0 });
                      if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
                      commit(moveMosaicNodeBy(n, dx, dy));
                    }}
                    clipFunc={(ctx) => {
                      if (n.kind === 'mosaicRect') {
                        ctx.rect(n.x, n.y, n.width, n.height);
                        return;
                      }
                      // mosaicStroke
                      ctx.beginPath();
                      const r = n.brushSize / 2;
                      for (const p of n.points) {
                        ctx.moveTo(p.x + r, p.y);
                        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                      }
                    }}
                  >
                    {mosaicHitNode(n)}
                    <KonvaImage image={img} x={bgOffsetDoc.x} y={bgOffsetDoc.y} width={w} height={h} listening={false} />
                  </Group>
                );
              })}

            {/* Mosaic selection box (tight bounds) */}
            {(() => {
              if (!selectedId) return null;
              const n = history.present.nodes.find((x) => x.id === selectedId) ?? null;
              if (!n) return null;
              if (n.kind !== 'mosaicRect' && n.kind !== 'mosaicStroke') return null;
              const b =
                n.kind === 'mosaicRect'
                  ? { x: n.x, y: n.y, width: n.width, height: n.height }
                  : strokeBounds(n);
              return (
                <Rect
                  x={b.x}
                  y={b.y}
                  width={b.width}
                  height={b.height}
                  stroke="rgba(76,159,254,0.95)"
                  dash={[6, 4]}
                  strokeWidth={2}
                  listening={false}
                />
              );
            })()}

            {/* Nodes created/moved after mosaics should be on top and remain editable */}
            {topArrows.map((a) => {
              const disp = arrowDisplayPoints(a);
              const arrowEl = (
                <Arrow
                  key={`top_${a.id}`}
                  id={a.id}
                  points={disp.points}
                  stroke={a.stroke}
                  fill={a.stroke}
                  strokeWidth={a.strokeWidth}
                  strokeScaleEnabled={false}
                  pointerLength={a.pointerLength}
                  pointerWidth={a.pointerWidth}
                  tension={disp.tension}
                  lineCap="round"
                  lineJoin="round"
                  onClick={() => onSelectNode(a.id)}
                  onContextMenu={(ev) => {
                    ev.evt.preventDefault();
                    const pos = stageRef.current?.getPointerPosition();
                    if (!pos) return;
                    setContextMenu({ x: pos.x, y: pos.y, nodeId: a.id, kind: 'arrow' });
                  }}
                  hitStrokeWidth={Math.max(24, a.strokeWidth * 3)}
                  draggable={tool.kind === 'select' && !(a as any).locked}
                  onDragEnd={(e) => {
                    const n = e.target;
                    const dx = n.x();
                    const dy = n.y();
                    n.position({ x: 0, y: 0 });
                    commit(
                      updateNode(history.present, a.id, {
                        points: [
                          { x: a.points[0].x + dx, y: a.points[0].y + dy },
                          { x: a.points[1].x + dx, y: a.points[1].y + dy }
                        ],
                        layer: 'top',
                        locked: false
                      } as any)
                    );
                  }}
                />
              );
              if ((a as any).clipRects && (a as any).clipRects.length > 0) {
                return (
                  <Group key={`clip_top_${a.id}`} clipFunc={rectUnionClipFunc((a as any).clipRects)} listening={false}>
                    {arrowEl}
                  </Group>
                );
              }
              return arrowEl;
            })}

            {topTexts.map((t) => {
              const isEmpty = (t.text ?? '').trim() === '';
              const minHeight = Math.max(24, t.fontSize + 2 * (t.padding ?? 0));
              const textEl = (
                <Text
                  key={`top_${t.id}`}
                  id={t.id}
                  x={t.x}
                  y={t.y}
                  text={t.text}
                  fontSize={t.fontSize}
                  fontFamily={t.fontFamily}
                  fontStyle={t.fontWeight === 'bold' || t.fontWeight === 700 ? 'bold' : 'normal'}
                  fill={t.fill}
                  padding={(t.padding ?? 0) + 6}
                  width={t.width ?? (t.mode === 'singleLine' ? 320 : undefined)}
                  height={isEmpty ? minHeight : undefined}
                  wrap={t.mode === 'area' ? 'word' : 'none'}
                  align={t.align ?? 'left'}
                  lineHeight={t.lineHeight ?? 1.25}
                  letterSpacing={t.letterSpacing ?? 0}
                  visible={t.id !== editingTextId}
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    onSelectNode(t.id);
                    if (tool.kind === 'text') startEditingText(t.id);
                  }}
                  onDblClick={(ev) => {
                    ev.cancelBubble = true;
                    startEditingText(t.id);
                  }}
                  draggable={tool.kind === 'select' && !editingTextId && !(t as any).locked}
                  onDragEnd={(e) => {
                    const n = e.target;
                    commit(
                      updateNode(historyRef.current.present, t.id, { x: n.x(), y: n.y(), layer: 'top', locked: false } as any)
                    );
                  }}
                  onTransformEnd={(e) => {
                    commitKonvaTextTransform(t.id, e.target as Konva.Text);
                  }}
                />
              );
              if ((t as any).clipRects && (t as any).clipRects.length > 0) {
                return (
                  <Group key={`clip_top_${t.id}`} clipFunc={rectUnionClipFunc((t as any).clipRects)} listening={false}>
                    {textEl}
                  </Group>
                );
              }
              return textEl;
            })}

            {/* Auto-detect hint boxes should be above mosaics */}
            {detectedRegions.map((r) => (
              <Rect
                key={r.id}
                x={r.x}
                y={r.y}
                width={r.width}
                height={r.height}
                fill={r.selected ? 'rgba(76,159,254,0.22)' : 'rgba(0,0,0,0.18)'}
                stroke={r.selected ? 'rgba(76,159,254,0.9)' : 'rgba(255,255,255,0.6)'}
                strokeWidth={1}
                dash={r.selected ? [] : [4, 4]}
                listening={true}
                onClick={(ev) => {
                  ev.cancelBubble = true;
                  toggleDetectedRegion(r.id);
                }}
              />
            ))}

            <Transformer
              ref={(n) => (transformerRef.current = n)}
              rotateEnabled={false}
              keepRatio={false}
              boundBoxFunc={(oldBox, newBox) => {
                // Lines/arrows can have 0 width/height (perfectly horizontal/vertical),
                // which makes Transformer math unstable and can make the shape "disappear".
                const min = 1;
                const w = Math.abs(newBox.width) < min ? (newBox.width < 0 ? -min : min) : newBox.width;
                const h = Math.abs(newBox.height) < min ? (newBox.height < 0 ? -min : min) : newBox.height;
                return { ...newBox, width: w, height: h };
              }}
              enabledAnchors={[
                'top-left',
                'top-center',
                'top-right',
                'middle-left',
                'middle-right',
                'bottom-left',
                'bottom-center',
                'bottom-right'
              ]}
            />
            </Group>

            {/* Snapshot group (DOCUMENT coords): background only, no mosaics/arrows/texts. */}
            <Group ref={(n) => (snapshotGroupRef.current = n)} visible={false} listening={false}>
              <KonvaImage image={bgImage} x={bgOffsetDoc.x} y={bgOffsetDoc.y} listening={false} />
            </Group>
          </Layer>
        </Stage>

        {editingTextNode && editingTextRect ? (
          <textarea
            ref={(n) => (textareaRef.current = n)}
            value={editingTextDraft}
            onChange={(ev) => setEditingTextDraft(ev.target.value)}
            onBlur={() => finishTextEditing()}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
                ev.preventDefault();
                finishTextEditing();
              }
            }}
            style={{
              position: 'absolute',
              left: editingTextRect.x,
              top: editingTextRect.y,
              zIndex: 5,
              minWidth: 80,
              width: Math.max(80, editingTextRect.width + 20),
              minHeight: 28,
              height: Math.max(28, editingTextRect.height + 16),
              padding: 6,
              borderRadius: 4,
              border: '1px solid rgba(76,159,254,0.9)',
              outline: 'none',
              resize: 'none',
              background: 'rgba(0,0,0,0.08)',
              color: editingTextNode.fill,
              fontSize: editingTextNode.fontSize * stageScale,
              fontFamily: editingTextNode.fontFamily,
              lineHeight: 1.25
            }}
          />
        ) : null}

        {contextMenu ? (
          <div
            style={{
              position: 'absolute',
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 30,
              padding: 4,
              borderRadius: 6,
              background: 'rgba(16,18,25,0.98)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: 12,
              minWidth: 80
            }}
          >
            <button
              style={{
                width: '100%',
                padding: '4px 8px',
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                textAlign: 'left',
                cursor: 'pointer'
              }}
              onClick={() => deleteNodeById(contextMenu.nodeId)}
            >
              删除
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
});

