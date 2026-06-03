import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Arrow, Ellipse, Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { canvasFontString, konvaFontStyle, konvaTextDecoration } from '../text/text-style.js';
import {
  addArrow,
  addMosaicRect,
  addMosaicStroke,
  addText,
  canRedo,
  canUndo,
  createEmptyDocument,
  createHistory,
  cropDocumentToRegion,
  exportCanvasToBlob,
  pushHistory,
  redo,
  removeNode,
  removeNodesByIds,
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
import {
  applyCropShapeMask,
  boundsFromPoints,
  clampCropBoxToBounds,
  clampCropBoxToDocument,
  cropBoxFromPointerDrag,
  exportContentBoundsInDocument,
  DEFAULT_CROP_OPTIONS,
  isCropSelectionValid,
  pointInCropSelection,
  toCircleBox,
  type CropBox,
  type CropOptions,
  type CropSelection
} from './crop-utils.js';

async function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error ?? new Error('read failed'));
    r.readAsDataURL(blob);
  });
}

/** Tesseract needs a data URL; document background may be a blob: object URL. */
async function ensureDataUrlForOcr(src: string): Promise<string> {
  if (src.startsWith('data:image/')) return src;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to load background for OCR (${res.status})`);
  return blobToDataUrl(await res.blob());
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

const TEXT_RENDER_PADDING = 6;

function measureTextBlock(
  text: string,
  fontSize: number,
  fontFamily: string,
  padding: number,
  lineHeight = 1.25,
  fontWeight?: TextNode['fontWeight'],
  fontItalic?: boolean
): { width: number; height: number } {
  const pad = padding * 2 + TEXT_RENDER_PADDING * 2;
  const lh = lineHeight * fontSize;
  const lines = (text || ' ').replace(/\r\n/g, '\n').split('\n');
  const lineCount = Math.max(1, lines.length);

  if (typeof document === 'undefined') {
    return { width: Math.max(80, lines[0]!.length * fontSize * 0.6 + pad), height: lineCount * lh + pad };
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { width: Math.max(80, lines[0]!.length * fontSize * 0.6 + pad), height: lineCount * lh + pad };
  }
  ctx.font = canvasFontString(fontSize, fontFamily, fontWeight, fontItalic);
  let maxW = fontSize;
  for (const line of lines) {
    maxW = Math.max(maxW, ctx.measureText(line || ' ').width);
  }
  return { width: Math.ceil(maxW) + pad, height: Math.ceil(lineCount * lh) + pad };
}

/** Horizontal layout: only explicit newlines break lines (no auto word-wrap). */
function textKonvaWrap(_t: TextNode): 'none' {
  return 'none';
}

function textKonvaWidth(t: TextNode): number | undefined {
  const measured = measureTextBlock(
    t.text ?? '',
    t.fontSize,
    t.fontFamily,
    (t.padding ?? 0) + TEXT_RENDER_PADDING,
    t.lineHeight ?? 1.25,
    t.fontWeight,
    t.fontItalic
  );
  return measured.width;
}

function textBoundsApprox(t: TextNode): { x: number; y: number; width: number; height: number } {
  const measured = measureTextBlock(
    t.text ?? '',
    t.fontSize,
    t.fontFamily,
    (t.padding ?? 0) + TEXT_RENDER_PADDING,
    t.lineHeight ?? 1.25,
    t.fontWeight,
    t.fontItalic
  );
  return { x: t.x, y: t.y, width: measured.width, height: measured.height };
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

function mosaicNodeBounds(n: EditorNode): { x: number; y: number; width: number; height: number } | null {
  if (n.kind === 'mosaicRect') return { x: n.x, y: n.y, width: n.width, height: n.height };
  if (n.kind === 'mosaicStroke') return strokeBounds(n);
  return null;
}

/** Seed: primary selected if it is a mosaic, else first mosaic in multi-selection. */
function findSeedMosaicId(
  selectedId: string | null,
  selectedMosaicIds: readonly string[],
  doc: EditorDocument
): string | null {
  if (selectedId) {
    const n = doc.nodes.find((nn) => nn.id === selectedId);
    if (n && (n.kind === 'mosaicRect' || n.kind === 'mosaicStroke')) return selectedId;
  }
  for (const id of selectedMosaicIds) {
    const n = doc.nodes.find((nn) => nn.id === id);
    if (n && (n.kind === 'mosaicRect' || n.kind === 'mosaicStroke')) return id;
  }
  return null;
}

/** Same row: horizontal midline of seed passes through the mosaic's vertical span. */
function collectSameRowMosaicIds(doc: EditorDocument, seedId: string): string[] {
  const seed = doc.nodes.find((n) => n.id === seedId);
  if (!seed || (seed.kind !== 'mosaicRect' && seed.kind !== 'mosaicStroke')) return [];
  const b = mosaicNodeBounds(seed);
  if (!b || b.height <= 0) return [seedId];
  const midY = b.y + b.height / 2;
  const out: string[] = [];
  for (const n of doc.nodes) {
    if (n.kind !== 'mosaicRect' && n.kind !== 'mosaicStroke') continue;
    const r = mosaicNodeBounds(n);
    if (!r || r.height <= 0) continue;
    if (midY >= r.y - 1e-6 && midY <= r.y + r.height + 1e-6) out.push(n.id);
  }
  return out;
}

/** Same column: vertical midline of seed passes through the mosaic's horizontal span. */
function collectSameColumnMosaicIds(doc: EditorDocument, seedId: string): string[] {
  const seed = doc.nodes.find((n) => n.id === seedId);
  if (!seed || (seed.kind !== 'mosaicRect' && seed.kind !== 'mosaicStroke')) return [];
  const b = mosaicNodeBounds(seed);
  if (!b || b.width <= 0) return [seedId];
  const midX = b.x + b.width / 2;
  const out: string[] = [];
  for (const n of doc.nodes) {
    if (n.kind !== 'mosaicRect' && n.kind !== 'mosaicStroke') continue;
    const r = mosaicNodeBounds(n);
    if (!r || r.width <= 0) continue;
    if (midX >= r.x - 1e-6 && midX <= r.x + r.width + 1e-6) out.push(n.id);
  }
  return out;
}

function sortMosaicIdsByRowThenCol(doc: EditorDocument, ids: readonly string[]): string[] {
  return [...ids].sort((a, b) => {
    const na = doc.nodes.find((n) => n.id === a);
    const nb = doc.nodes.find((n) => n.id === b);
    const ba = na ? mosaicNodeBounds(na) : null;
    const bb = nb ? mosaicNodeBounds(nb) : null;
    const ya = ba ? ba.y + ba.height / 2 : 0;
    const yb = bb ? bb.y + bb.height / 2 : 0;
    if (Math.abs(ya - yb) > 1e-3) return ya - yb;
    const xa = ba ? ba.x + ba.width / 2 : 0;
    const xb = bb ? bb.x + bb.width / 2 : 0;
    return xa - xb;
  });
}

function unionMosaicBounds(
  doc: EditorDocument,
  ids: readonly string[]
): { x: number; y: number; width: number; height: number } | null {
  if (ids.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const id of ids) {
    const n = doc.nodes.find((nn) => nn.id === id);
    if (!n || (n.kind !== 'mosaicRect' && n.kind !== 'mosaicStroke')) continue;
    const b = mosaicNodeBounds(n);
    if (!b || b.width <= 0 || b.height <= 0) continue;
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.width);
    maxY = Math.max(maxY, b.y + b.height);
  }
  if (!Number.isFinite(minX)) return null;
  return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
}

function sortMosaicIdsByColThenRow(doc: EditorDocument, ids: readonly string[]): string[] {
  return [...ids].sort((a, b) => {
    const na = doc.nodes.find((n) => n.id === a);
    const nb = doc.nodes.find((n) => n.id === b);
    const ba = na ? mosaicNodeBounds(na) : null;
    const bb = nb ? mosaicNodeBounds(nb) : null;
    const xa = ba ? ba.x + ba.width / 2 : 0;
    const xb = bb ? bb.x + bb.width / 2 : 0;
    if (Math.abs(xa - xb) > 1e-3) return xa - xb;
    const ya = ba ? ba.y + ba.height / 2 : 0;
    const yb = bb ? bb.y + bb.height / 2 : 0;
    return ya - yb;
  });
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
        : textBoundsApprox(n);
    if (!rectsOverlap(bounds, region)) continue;
    next = updateNode(next, n.id, { layer: 'base', locked: true } as any);
  }
  return next;
}

function arrowKonvaShadowProps(shadow?: boolean) {
  return {
    shadowEnabled: !!shadow,
    shadowColor: 'rgba(0,0,0,0.75)',
    shadowBlur: 6,
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.5
  };
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

function distPointToSegmentSquared(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const wx = px - x1;
  const wy = py - y1;
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return (px - x1) ** 2 + (py - y1) ** 2;
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return (px - x2) ** 2 + (py - y2) ** 2;
  const t = c1 / c2;
  const projx = x1 + t * vx;
  const projy = y1 + t * vy;
  return (px - projx) ** 2 + (py - projy) ** 2;
}

/** Top-first pick in document space (later updatedAt = on top). */
function pickTopMosaicAtDocPos(doc: EditorDocument, docPos: { x: number; y: number }): string | null {
  const nodes = doc.nodes.filter(
    (n): n is MosaicRectNode | MosaicStrokeNode => n.kind === 'mosaicRect' || n.kind === 'mosaicStroke'
  );
  const sorted = nodes.slice().sort((a, b) => {
    if (a.updatedAt !== b.updatedAt) return a.updatedAt - b.updatedAt;
    if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
    return a.id.localeCompare(b.id);
  });
  for (let i = sorted.length - 1; i >= 0; i--) {
    const n = sorted[i]!;
    if ((n as any).locked) continue;
    if (n.kind === 'mosaicRect') {
      const b = mosaicNodeBounds(n);
      if (
        b &&
        docPos.x >= b.x &&
        docPos.x <= b.x + b.width &&
        docPos.y >= b.y &&
        docPos.y <= b.y + b.height
      ) {
        return n.id;
      }
      continue;
    }
    const hitW = Math.max(20, n.brushSize + 8);
    const thr = (hitW / 2) ** 2;
    const pts = n.points;
    if (pts.length === 1) {
      const p = pts[0]!;
      if ((docPos.x - p.x) ** 2 + (docPos.y - p.y) ** 2 <= thr) return n.id;
      continue;
    }
    for (let j = 0; j + 1 < pts.length; j++) {
      const p0 = pts[j]!;
      const p1 = pts[j + 1]!;
      if (distPointToSegmentSquared(docPos.x, docPos.y, p0.x, p0.y, p1.x, p1.y) <= thr) return n.id;
    }
  }
  return null;
}

function pickMosaicIdFromStageHit(
  stage: Konva.Stage,
  pos: { x: number; y: number },
  doc: EditorDocument
): string | null {
  const hit = stage.getIntersection(pos);
  let walk: Konva.Node | null = hit;
  while (walk && walk !== stage) {
    if (walk.name() === 'mosaic_multi_drag_box') return null;
    const id = walk.id();
    if (id) {
      const node = doc.nodes.find((n) => n.id === id);
      if (node && (node.kind === 'mosaicRect' || node.kind === 'mosaicStroke')) return id;
    }
    walk = walk.getParent();
  }
  return null;
}

/** Stage hit for arrow/text nodes; `'transformer'` when the transformer handle was hit. */
function pickArrowOrTextIdFromStageHit(
  stage: Konva.Stage,
  pos: { x: number; y: number },
  present: EditorDocument
): 'transformer' | string | null {
  const topHit = stage.getIntersection(pos);
  let walk: Konva.Node | null = topHit;
  while (walk) {
    if (walk.getClassName() === 'Transformer') return 'transformer';
    walk = walk.getParent();
  }
  walk = topHit;
  while (walk) {
    const cn = walk.getClassName?.();
    if ((cn === 'Arrow' || cn === 'Text') && walk.id()) {
      const nid = walk.id();
      if (present.nodes.some((n) => n.id === nid)) return nid;
    }
    walk = walk.getParent();
  }
  return null;
}

/** Top-first pick in document space (matches hitStrokeWidth-style tolerance). */
function pickTopArrowOrTextAtDocPos(doc: EditorDocument, docPos: { x: number; y: number }): string | null {
  for (let i = doc.nodes.length - 1; i >= 0; i--) {
    const n = doc.nodes[i]!;
    if ((n as any).locked) continue;
    if (n.kind === 'text') {
      const b = textBoundsApprox(n);
      const pad = 6;
      if (
        docPos.x >= b.x - pad &&
        docPos.x <= b.x + b.width + pad &&
        docPos.y >= b.y - pad &&
        docPos.y <= b.y + b.height + pad
      ) {
        return n.id;
      }
    }
    if (n.kind === 'arrow') {
      const hitW = Math.max(24, n.strokeWidth * 3);
      const thr = (hitW / 2) ** 2;
      const { points: flat } = arrowDisplayPoints(n);
      for (let j = 0; j + 3 < flat.length; j += 2) {
        const x1 = flat[j]!;
        const y1 = flat[j + 1]!;
        const x2 = flat[j + 2]!;
        const y2 = flat[j + 3]!;
        if (distPointToSegmentSquared(docPos.x, docPos.y, x1, y1, x2, y2) <= thr) return n.id;
      }
    }
  }
  return null;
}

function cloneDoc(doc: EditorDocument): EditorDocument {
  // structuredClone is available in modern browsers/electron renderer.
  return structuredClone(doc);
}

type MosaicCacheEntry = { img: HTMLImageElement; key: string };

/** Prefer exact cache key; otherwise nearest numeric key for the same snapshot (smooth slider drags). */
function pickNearestCachedMosaicImage(
  want: number,
  cache: Record<number, MosaicCacheEntry>,
  baseKey: string
): HTMLImageElement | null {
  const direct = cache[want];
  if (direct?.img && direct.key === baseKey) return direct.img;
  let best: { img: HTMLImageElement; dist: number } | null = null;
  for (const k of Object.keys(cache)) {
    const n = Number(k);
    const entry = cache[n];
    if (!entry?.img || entry.key !== baseKey) continue;
    const d = Math.abs(n - want);
    if (!best || d < best.dist) best = { img: entry.img, dist: d };
  }
  return best?.img ?? null;
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

/** Sample average color per block from source pixels (WeChat-style mosaic). */
function createPixelatedCanvas(
  source: CanvasImageSource,
  width: number,
  height: number,
  pixelSize: number
): HTMLCanvasElement {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const ps = Math.max(1, Math.round(pixelSize));

  const sample = document.createElement('canvas');
  sample.width = w;
  sample.height = h;
  const sctx = sample.getContext('2d', { willReadFrequently: true });
  if (!sctx) throw new Error('2d context not available');
  sctx.clearRect(0, 0, w, h);
  // @ts-expect-error drawImage accepts CanvasImageSource
  sctx.drawImage(source, 0, 0, w, h);
  const { data } = sctx.getImageData(0, 0, w, h);

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const octx = out.getContext('2d');
  if (!octx) throw new Error('2d context not available');
  const outImage = octx.createImageData(w, h);
  const outData = outImage.data;

  for (let by = 0; by < h; by += ps) {
    const bh = Math.min(ps, h - by);
    for (let bx = 0; bx < w; bx += ps) {
      const bw = Math.min(ps, w - bx);
      let r = 0;
      let g = 0;
      let b = 0;
      let weight = 0;
      for (let y = by; y < by + bh; y++) {
        for (let x = bx; x < bx + bw; x++) {
          const i = (y * w + x) * 4;
          const a = data[i + 3]!;
          if (a <= 0) continue;
          const aw = a / 255;
          r += data[i]! * aw;
          g += data[i + 1]! * aw;
          b += data[i + 2]! * aw;
          weight += aw;
        }
      }
      if (weight <= 0) continue;
      const cr = Math.round(r / weight);
      const cg = Math.round(g / weight);
      const cb = Math.round(b / weight);
      for (let y = by; y < by + bh; y++) {
        for (let x = bx; x < bx + bw; x++) {
          const i = (y * w + x) * 4;
          outData[i] = cr;
          outData[i + 1] = cg;
          outData[i + 2] = cb;
          outData[i + 3] = 255;
        }
      }
    }
  }

  octx.putImageData(outImage, 0, 0);
  return out;
}

async function createPixelatedDataUrl(image: HTMLImageElement, pixelSize: number): Promise<string> {
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;
  return createPixelatedCanvas(image, w, h, pixelSize).toDataURL('image/png');
}

async function createPixelatedDataUrlFromSource(
  source: CanvasImageSource,
  size: { width: number; height: number },
  pixelSize: number
): Promise<string> {
  return createPixelatedCanvas(source, size.width, size.height, pixelSize).toDataURL('image/png');
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

function renderDocBackgroundCanvas(
  bgImage: HTMLImageElement,
  bgOffset: { x: number; y: number },
  docW: number,
  docH: number,
  pixelRatio = 1
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(docW * pixelRatio));
  canvas.height = Math.max(1, Math.round(docH * pixelRatio));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.drawImage(bgImage, bgOffset.x, bgOffset.y);
  return canvas;
}

function normalizeCanvasToDocSize(canvas: HTMLCanvasElement, docW: number, docH: number): HTMLCanvasElement {
  if (canvas.width === docW && canvas.height === docH) return canvas;
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(docW));
  out.height = Math.max(1, Math.round(docH));
  const ctx = out.getContext('2d');
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  return out;
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
  /** Selection highlights + auto-detect boxes — hidden when exporting annotation-only image. */
  const annotationChromeGroupRef = useRef<Konva.Group | null>(null);
  const snapshotGroupRef = useRef<Konva.Group | null>(null);
  const spacePressedRef = useRef(false);

  const [tool, setTool] = useState<Tool>(props.options?.initialTool ?? { kind: 'select' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** Multi-select for mosaic rect/stroke only (Shift+click). Drag moves all selected together. */
  const [selectedMosaicIds, setSelectedMosaicIds] = useState<string[]>([]);
  const selectedMosaicSet = useMemo(() => new Set(selectedMosaicIds), [selectedMosaicIds]);
  const mosaicGroupNodeRefs = useRef<Map<string, Konva.Group>>(new Map());
  const mosaicDragIdsRef = useRef<string[]>([]);
  const mosaicDragLeaderRef = useRef<string | null>(null);
  const mosaicGroupDragBoxOriginRef = useRef({ x: 0, y: 0 });
  const suppressNextStageSelectionClearRef = useRef(false);
  const selectedIdRef = useRef<string | null>(null);
  const selectedMosaicIdsRef = useRef<string[]>([]);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);
  useEffect(() => {
    selectedMosaicIdsRef.current = selectedMosaicIds;
  }, [selectedMosaicIds]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextDraft, setEditingTextDraft] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const suppressNextTextCreateRef = useRef(false);
  const ignoreTextBlurRef = useRef(false);
  const suppressAnnotationClickRef = useRef(false);
  const onSelectionChangeRef = useRef(props.options?.onSelectionChange);
  onSelectionChangeRef.current = props.options?.onSelectionChange;
  const onMosaicSelectionChangeRef = useRef(props.options?.onMosaicSelectionChange);
  onMosaicSelectionChangeRef.current = props.options?.onMosaicSelectionChange;
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
  const templateApplyMergeExistingRef = useRef((props.options?.template?.applyMode ?? 'merge') === 'merge');
  useEffect(() => {
    templateApplyMergeExistingRef.current = (props.options?.template?.applyMode ?? 'merge') === 'merge';
  }, [props.options?.template?.applyMode]);
  const templateSaveTimerRef = useRef<number | null>(null);

  function loadTemplate(storageKeyOverride?: string | null): AnnotationTemplateV1 | null {
    const key = storageKeyOverride ?? templateKey;
    if (!key) return null;
    const raw = safeLocalStorageGet(key);
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

  function applyTemplateToDocument(
    doc: EditorDocument,
    tpl: AnnotationTemplateV1,
    opts?: { mergeExisting?: boolean }
  ): EditorDocument {
    const bw = tpl.base.width || 1;
    const bh = tpl.base.height || 1;
    const sx = doc.width / bw;
    const sy = doc.height / bh;
    const now = Date.now();
    const newNodes: EditorNode[] = tpl.nodes.map((n) => {
      const scaled = applyTemplateScale(n as any, sx, sy) as any;
      const id = createLocalId(n.kind === 'text' ? 'text' : n.kind === 'arrow' ? 'arrow' : 'mosaic');
      return { ...scaled, id, createdAt: now, updatedAt: now } as EditorNode;
    });
    if (opts?.mergeExisting) {
      return { ...doc, nodes: [...doc.nodes, ...newNodes] };
    }
    return { ...doc, nodes: newNodes };
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
    kind: 'arrow' | 'text' | 'mosaic';
  } | null>(null);

  type DetectedRegion = MosaicRectInput & { id: string; selected: boolean };
  const [detectedRegions, setDetectedRegionsState] = useState<DetectedRegion[]>([]);
  const detectedRegionsRef = useRef<DetectedRegion[]>([]);
  useEffect(() => {
    detectedRegionsRef.current = detectedRegions;
  }, [detectedRegions]);

  const [ocrRegionPickActive, setOcrRegionPickActive] = useState(false);
  const [ocrRegionPickPreview, setOcrRegionPickPreview] = useState<MosaicRectInput | null>(null);
  const ocrRegionPickActiveRef = useRef(false);
  const ocrRegionPickDrawingRef = useRef(false);
  const ocrRegionPickStartRef = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    ocrRegionPickActiveRef.current = ocrRegionPickActive;
  }, [ocrRegionPickActive]);

  useEffect(() => {
    if (!ocrRegionPickActive) return;
    const onWindowMouseUp = () => endOcrRegionPickDrag();
    window.addEventListener('mouseup', onWindowMouseUp);
    return () => window.removeEventListener('mouseup', onWindowMouseUp);
  }, [ocrRegionPickActive]);

  function resetOcrRegionPickState(notifyCancel = false) {
    ocrRegionPickActiveRef.current = false;
    ocrRegionPickDrawingRef.current = false;
    ocrRegionPickStartRef.current = null;
    setOcrRegionPickActive(false);
    setOcrRegionPickPreview(null);
    if (notifyCancel) props.options?.onOcrRegionPickCancelled?.();
  }

  function startOcrRegionPickDrag(docPos: { x: number; y: number }) {
    finishTextEditing();
    clearNodeSelection();
    setActiveMosaicId(null);
    isDrawingRef.current = false;
    drawingNodeIdRef.current = null;
    panStartRef.current = null;
    ocrRegionPickDrawingRef.current = true;
    ocrRegionPickStartRef.current = docPos;
    setOcrRegionPickPreview({ x: docPos.x, y: docPos.y, width: 1, height: 1 });
  }

  function updateOcrRegionPickDrag() {
    if (!ocrRegionPickDrawingRef.current) return;
    const start = ocrRegionPickStartRef.current;
    const docPos = getPointerInDocument();
    if (!start || !docPos) return;
    setOcrRegionPickPreview(normalizeRect(start, docPos));
  }

  function endOcrRegionPickDrag() {
    if (!ocrRegionPickDrawingRef.current) return;
    const start = ocrRegionPickStartRef.current;
    const pos = getPointerInDocument();
    ocrRegionPickDrawingRef.current = false;
    ocrRegionPickStartRef.current = null;
    if (!start || !pos) {
      cancelOcrRegionPickInternal();
      return;
    }
    finishOcrRegionPick(normalizeRect(start, pos));
  }

  function finishOcrRegionPick(region: MosaicRectInput | null) {
    resetOcrRegionPickState(false);
    if (region && region.width >= 8 && region.height >= 8) {
      props.options?.onOcrRegionPicked?.(region);
    } else {
      props.options?.onOcrRegionPickCancelled?.();
    }
  }

  function cancelOcrRegionPickInternal() {
    resetOcrRegionPickState(true);
  }

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

  // Background alignment: drag image under annotations (annotations stay fixed).
  const [bgOffsetDoc, setBgOffsetDoc] = useState({ x: 0, y: 0 });
  const [bgDragMode, setBgDragMode] = useState(false);
  const bgDragModeRef = useRef(false);
  type BackgroundDragKind = false | 'align';
  const bgDragKindRef = useRef<BackgroundDragKind>(false);
  const bgOffsetDocRef = useRef(bgOffsetDoc);
  const stageScaleRef = useRef(stageScale);
  const stagePositionRef = useRef(stagePosition);
  const stageTransformGroupRef = useRef<Konva.Group | null>(null);
  useEffect(() => {
    bgOffsetDocRef.current = bgOffsetDoc;
  }, [bgOffsetDoc]);
  useEffect(() => {
    stageScaleRef.current = stageScale;
  }, [stageScale]);
  useEffect(() => {
    stagePositionRef.current = stagePosition;
  }, [stagePosition]);

  /** Fit-to-view layout for current document size (not stale React state after crop). */
  function getDocumentStageLayout(docW?: number, docH?: number): { scale: number; position: { x: number; y: number } } {
    const doc = historyRef.current.present;
    const w = docW ?? doc.width;
    const h = docH ?? doc.height;
    const stage = stageRef.current;
    const sw = stage && stage.width() > 0 ? stage.width() : stageSize.width;
    const sh = stage && stage.height() > 0 ? stage.height() : stageSize.height;
    if (w <= 0 || h <= 0 || sw <= 0 || sh <= 0) {
      return { scale: stageScaleRef.current, position: { ...stagePositionRef.current } };
    }
    const scale = Math.min(sw / w, sh / h, 1);
    return {
      scale,
      position: { x: (sw - w * scale) / 2, y: (sh - h * scale) / 2 }
    };
  }

  function applyStageLayoutForDocument(docW: number, docH: number) {
    const layout = getDocumentStageLayout(docW, docH);
    stageScaleRef.current = layout.scale;
    stagePositionRef.current = layout.position;
    stageTransformGroupRef.current?.position(layout.position);
    stageTransformGroupRef.current?.scale({ x: layout.scale, y: layout.scale });
    setStageScale(layout.scale);
    setStagePosition(layout.position);
    stageRef.current?.batchDraw();
    return layout;
  }

  async function prepareStageForExport(): Promise<{ scale: number }> {
    await ensureBgImageSynced();
    const doc = historyRef.current.present;
    const layout = applyStageLayoutForDocument(doc.width, doc.height);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    return layout;
  }

  /** Map browser client coords → document coords (same space as crop box / annotations). */
  function pointerInDocumentFromClient(clientX: number, clientY: number): { x: number; y: number } | null {
    const stage = stageRef.current;
    const group = baseGroupRef.current;
    if (!stage || !group) return null;
    const container = stage.container();
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const sx = stage.width() / rect.width;
    const sy = stage.height() / rect.height;
    const stagePointer = {
      x: (clientX - rect.left) * sx,
      y: (clientY - rect.top) * sy
    };
    const transform = group.getAbsoluteTransform().copy().invert();
    return transform.point(stagePointer);
  }

  // Image-level transforms applied during export/display:
  // - crop: user drags a crop rectangle on the stage
  const [transformMode, setTransformModeState] = useState<'none' | 'crop'>('none');
  const [cropSelection, setCropSelection] = useState<CropSelection | null>(null);
  const [cropOptions, setCropOptionsState] = useState<CropOptions>({ ...DEFAULT_CROP_OPTIONS });
  const isCropDrawingRef = useRef(false);
  const [cropDrawing, setCropDrawing] = useState(false);
  const cropDrawStartRef = useRef<{ x: number; y: number } | null>(null);
  const cropNodeRef = useRef<Konva.Rect | Konva.Ellipse | Konva.Line | null>(null);
  const cropSelectionRef = useRef(cropSelection);
  useEffect(() => {
    cropSelectionRef.current = cropSelection;
  }, [cropSelection]);

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

  // Align drag with DOM listeners (not Konva bubbling), so annotations can't block dragging.
  useEffect(() => {
    if (!bgDragMode) return;
    const stageContainer = stageRef.current?.container();
    if (!stageContainer) return;
    let dragging = false;
    let startDoc = { x: 0, y: 0 };
    let startOffset = { x: 0, y: 0 };
    let lastDelta = { x: 0, y: 0 };

    const onPointerDown = (ev: PointerEvent) => {
      const target = ev.target as Node | null;
      if (!target || !stageContainer.contains(target)) return;
      const doc = pointerInDocumentFromClient(ev.clientX, ev.clientY);
      if (!doc) return;
      dragging = true;
      startDoc = doc;
      startOffset = { ...bgOffsetDocRef.current };
      lastDelta = { x: 0, y: 0 };
      ev.preventDefault();
    };
    const onPointerMove = (ev: PointerEvent) => {
      if (!dragging) return;
      const doc = pointerInDocumentFromClient(ev.clientX, ev.clientY);
      if (!doc) return;
      const dx = doc.x - startDoc.x;
      const dy = doc.y - startDoc.y;
      lastDelta = { x: dx, y: dy };
      setBgOffsetDoc({
        x: startOffset.x + dx,
        y: startOffset.y + dy
      });
      ev.preventDefault();
    };
    const onPointerUp = () => {
      if (dragging && bgDragKindRef.current === 'align') {
        const { x: dx, y: dy } = lastDelta;
        if (Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5) {
          commit(cloneDoc(historyRef.current.present));
        } else {
          setBgOffsetDoc(startOffset);
          bgOffsetDocRef.current = startOffset;
        }
      }
      dragging = false;
      lastDelta = { x: 0, y: 0 };
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
    setDetectedRegionsState((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r));
      detectedRegionsRef.current = next;
      return next;
    });
  }
  function setAllDetectedRegionsSelected(selected: boolean) {
    setDetectedRegionsState((prev) => {
      const next = prev.map((r) => ({ ...r, selected }));
      detectedRegionsRef.current = next;
      return next;
    });
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
          doc = applyTemplateToDocument(doc, props.options.initialAnnotations as any, { mergeExisting: false });
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
          if (tpl) doc = applyTemplateToDocument(doc, tpl, { mergeExisting: templateApplyMergeExistingRef.current });
        }

        // When restoring per-image annotations, keep at least one undo step:
        // base (no annotations) -> restored annotations.
        if (props.options?.initialAnnotations) {
          setHistory(pushHistory(createHistory(baseDoc), doc));
        } else {
          setHistory(createHistory(doc));
        }
        clearNodeSelection();
        setSelectedMosaicIds([]);
      }
    })().catch((err) => {
      if (cancelled) return;
      setBgImage(null);
      setImageLoadError(err instanceof Error ? err.message : String(err));
    });
    return () => {
      cancelled = true;
    };
  }, [bgSrc, templateAutoApply]);

  const bgImageMatchesDoc =
    !!bgImage &&
    bgImage.naturalWidth === history.present.width &&
    bgImage.naturalHeight === history.present.height;

  // Build a "base snapshot" canvas in DOCUMENT coordinates (no stage pan/zoom):
  // background only. Arrow/text are always rendered as top layer.
  useEffect(() => {
    if (!bgImage || !bgImageMatchesDoc) return;
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
    bgImageMatchesDoc,
    history.present.width,
    history.present.height,
    bgOffsetDoc.x,
    bgOffsetDoc.y
  ]);

  // IMPORTANT:
  // Mosaic caches must be invalidated whenever the background snapshot changes.
  const baseSnapshotKey = useMemo(() => {
    const imgKey = bgImage ? `${bgImage.naturalWidth}x${bgImage.naturalHeight}` : '0x0';
    // Only force-invalidate caches on explicit undo/redo, not on every history push,
    // otherwise mosaics can look like they "don't apply" while caches rebuild.
    return `${bgSrc ?? ''}|doc:${history.present.width}x${history.present.height}|img:${imgKey}|off:${bgOffsetDoc.x},${bgOffsetDoc.y}|${undoRedoKey}|${snapshotVersion}|px:v2`;
  }, [bgSrc, bgImage, history.present.width, history.present.height, bgOffsetDoc.x, bgOffsetDoc.y, undoRedoKey, snapshotVersion]);

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
    const docSize = { width: history.present.width, height: history.present.height };
    const imgW = bgImage.naturalWidth || bgImage.width || 0;
    const imgH = bgImage.naturalHeight || bgImage.height || 0;
    const sizesMatch = imgW === docSize.width && imgH === docSize.height;
    const canUseBaseCanvas =
      !!baseCanvas &&
      baseCanvasBgSrc === (bgSrc ?? null) &&
      !!baseCanvasOffset &&
      baseCanvasOffset.x === bgOffsetDoc.x &&
      baseCanvasOffset.y === bgOffsetDoc.y;
    const source: HTMLImageElement | HTMLCanvasElement =
      canUseBaseCanvas ? (baseCanvas as HTMLCanvasElement) : sizesMatch ? bgImage : renderDocBackgroundCanvas(bgImage, bgOffsetDoc, docSize.width, docSize.height, 1);
    let cancelled = false;
    (async () => {
      const next: Record<number, CachedImg> = { ...pixelCache };
      for (const px of pixelSizesNeeded) {
        if (next[px]?.key === baseSnapshotKey) continue;
        const dataUrl =
          source instanceof HTMLImageElement
            ? await createPixelatedDataUrl(source, px)
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

  function invalidateMosaicCaches() {
    setPixelCache({});
    setBlurCache({});
    setBaseCanvas(null);
    setBaseCanvasBgSrc(null);
    setBaseCanvasOffset(null);
  }

  useEffect(() => {
    if (!bgImage) return;
    const docSize = { width: history.present.width, height: history.present.height };
    const imgW = bgImage.naturalWidth || bgImage.width || 0;
    const imgH = bgImage.naturalHeight || bgImage.height || 0;
    const sizesMatch = imgW === docSize.width && imgH === docSize.height;
    const canUseBaseCanvas =
      !!baseCanvas &&
      baseCanvasBgSrc === (bgSrc ?? null) &&
      !!baseCanvasOffset &&
      baseCanvasOffset.x === bgOffsetDoc.x &&
      baseCanvasOffset.y === bgOffsetDoc.y;
    const source: HTMLImageElement | HTMLCanvasElement =
      canUseBaseCanvas ? (baseCanvas as HTMLCanvasElement) : sizesMatch ? bgImage : renderDocBackgroundCanvas(bgImage, bgOffsetDoc, docSize.width, docSize.height, 1);
    let cancelled = false;
    (async () => {
      const next: Record<number, CachedImg> = { ...blurCache };
      for (const radius of blurRadiiNeeded) {
        if (next[radius]?.key === baseSnapshotKey) continue;
        const dataUrl =
          source instanceof HTMLImageElement
            ? await createBlurredDataUrl(source, radius)
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
      if (cropNodeRef.current && cropSelection && cropSelection.shape !== 'freehand' && !cropDrawing) {
        transformer.keepRatio(cropSelection.shape === 'circle');
        transformer.nodes([cropNodeRef.current as unknown as Konva.Node]);
      } else {
        transformer.keepRatio(false);
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
      transformer.resizeEnabled(true);
      transformer.enabledAnchors([
        'top-left',
        'top-center',
        'top-right',
        'middle-left',
        'middle-right',
        'bottom-left',
        'bottom-center',
        'bottom-right'
      ]);
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
    if (selectedNode?.kind === 'arrow') {
      // Allow endpoint stretching, but keep arrow visual style controlled by tool params
      // (stroke/pointer size are not scaled in onTransformEnd).
      transformer.resizeEnabled(true);
      transformer.enabledAnchors([
        'top-left',
        'top-center',
        'top-right',
        'middle-left',
        'middle-right',
        'bottom-left',
        'bottom-center',
        'bottom-right'
      ]);
      transformer.nodes([node as unknown as Konva.Node]);
      transformer.getLayer()?.batchDraw();
      return;
    }
    transformer.resizeEnabled(true);
    transformer.enabledAnchors([
      'top-left',
      'top-center',
      'top-right',
      'middle-left',
      'middle-right',
      'bottom-left',
      'bottom-center',
      'bottom-right'
    ]);
    transformer.nodes([node as unknown as Konva.Node]);
    transformer.getLayer()?.batchDraw();
  }, [selectedId, history.present.nodes, editingTextId, transformMode, cropSelection, cropDrawing]);

  useEffect(() => {
    if (!editingTextId) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('.captureBar')) ignoreTextBlurRef.current = true;
    };
    document.addEventListener('mousedown', onDown, true);
    return () => document.removeEventListener('mousedown', onDown, true);
  }, [editingTextId]);

  useEffect(() => {
    const cb = onSelectionChangeRef.current;
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
          fontItalic: node.fontItalic,
          underline: node.underline,
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
          pointerSize: Math.max(node.pointerLength, node.pointerWidth),
          opacity: node.opacity ?? 1,
          shadow: !!node.shadow
        }
      });
      return;
    }
    cb(null);
  }, [history.present.nodes, selectedId]);

  useEffect(() => {
    const cb = onMosaicSelectionChangeRef.current;
    if (!cb) return;
    if (selectedMosaicIds.length > 0) {
      cb({ ids: selectedMosaicIds, primaryId: selectedId });
      return;
    }
    if (selectedId) {
      const node = history.present.nodes.find((n) => n.id === selectedId) ?? null;
      if (node && (node.kind === 'mosaicRect' || node.kind === 'mosaicStroke')) {
        cb({ ids: [selectedId], primaryId: selectedId });
        return;
      }
    }
    cb(null);
  }, [history.present.nodes, selectedId, selectedMosaicIds]);

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

  function clearNodeSelection() {
    setSelectedId(null);
    setSelectedMosaicIds([]);
  }

  function removeSelectedMosaics() {
    const ids =
      selectedMosaicIdsRef.current.length > 0
        ? [...selectedMosaicIdsRef.current]
        : (() => {
            const sid = selectedIdRef.current;
            if (!sid) return [] as string[];
            const n = historyRef.current.present.nodes.find((nn) => nn.id === sid);
            return n && (n.kind === 'mosaicRect' || n.kind === 'mosaicStroke') ? [sid] : [];
          })();
    if (ids.length === 0) return { ok: false as const, count: 0 };
    commit(removeNodesByIds(historyRef.current.present, new Set(ids)));
    clearNodeSelection();
    setContextMenu(null);
    return { ok: true as const, count: ids.length };
  }

  function deleteNodeById(id: string) {
    setHistory((h) => pushHistory(h, removeNode(h.present, id)));
    setSelectedMosaicIds((prev) => {
      const next = prev.filter((x) => x !== id);
      queueMicrotask(() =>
        setSelectedId((sid) => (sid === id ? (next.length ? next[next.length - 1]! : null) : sid))
      );
      return next;
    });
    if (editingTextId === id) setEditingTextId(null);
    setContextMenu(null);
  }

  /** Shift+click toggles; plain click on unselected replaces; re-clicking selected keeps multi-select. */
  function onSelectMosaicNode(mosaicId: string, shiftKey: boolean) {
    const node = history.present.nodes.find((nn) => nn.id === mosaicId) ?? null;
    if (!node || (node.kind !== 'mosaicRect' && node.kind !== 'mosaicStroke')) return;
    if ((node as any).locked) {
      clearNodeSelection();
      return;
    }
    if (shiftKey) {
      setSelectedMosaicIds((prev) => {
        const i = prev.indexOf(mosaicId);
        const next = i >= 0 ? prev.filter((x) => x !== mosaicId) : [...prev, mosaicId];
        const primary = next.length === 0 ? null : i >= 0 ? next[next.length - 1]! : mosaicId;
        queueMicrotask(() => setSelectedId(primary));
        return next;
      });
      return;
    }
    setSelectedMosaicIds((prev) => {
      if (prev.includes(mosaicId)) {
        queueMicrotask(() => setSelectedId(mosaicId));
        return prev;
      }
      queueMicrotask(() => setSelectedId(mosaicId));
      return [mosaicId];
    });
  }

  function pointerPositionFromClient(stage: Konva.Stage, clientX: number, clientY: number): { x: number; y: number } | null {
    const container = stage.container();
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function documentPositionFromStagePointer(pos: { x: number; y: number }) {
    return {
      x: (pos.x - stagePosition.x) / stageScale,
      y: (pos.y - stagePosition.y) / stageScale
    };
  }

  function isPointerOnAnnotationStagePos(stage: Konva.Stage, pos: { x: number; y: number }): boolean {
    const doc = historyRef.current.present;
    if (pickMosaicIdFromStageHit(stage, pos, doc)) return true;
    const docPos = documentPositionFromStagePointer(pos);
    if (pickTopMosaicAtDocPos(doc, docPos)) return true;
    const hit = stage.getIntersection(pos);
    let walk: Konva.Node | null = hit;
    while (walk && walk !== stage) {
      if (walk.name() === 'mosaic_multi_drag_box') return true;
      const cn = walk.getClassName?.();
      if (cn === 'Transformer') return true;
      const id = walk.id();
      if (id) {
        const node = doc.nodes.find((n) => n.id === id);
        if (
          node?.kind === 'arrow' ||
          node?.kind === 'text' ||
          node?.kind === 'mosaicRect' ||
          node?.kind === 'mosaicStroke'
        ) {
          return true;
        }
      }
      walk = walk.getParent();
    }
    return false;
  }

  function shouldClearSelectionOnStageClick(stage: Konva.Stage): boolean {
    const pos = stage.getPointerPosition();
    if (!pos) return true;
    return !isPointerOnAnnotationStagePos(stage, pos);
  }

  function isPointerOnAnnotationAtClient(stage: Konva.Stage, clientX: number, clientY: number): boolean {
    const pos = pointerPositionFromClient(stage, clientX, clientY);
    if (!pos) return false;
    return isPointerOnAnnotationStagePos(stage, pos);
  }

  function moveMosaicNodesInDoc(doc: EditorDocument, ids: readonly string[], dx: number, dy: number): EditorDocument {
    if (ids.length === 0 || (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01)) return doc;
    let next = doc;
    for (const id of ids) {
      const node = next.nodes.find((nn) => nn.id === id) ?? null;
      if (!node) continue;
      if (node.kind === 'mosaicRect') {
        next = updateNode(next, id, { x: node.x + dx, y: node.y + dy });
      } else if (node.kind === 'mosaicStroke') {
        next = updateNode(next, id, {
          points: node.points.map((p) => ({ x: p.x + dx, y: p.y + dy }))
        });
      }
    }
    return next;
  }

  function mosaicDragSelectionFor(mosaicId: string): string[] {
    const ids = selectedMosaicIdsRef.current;
    if (ids.length > 0 && ids.includes(mosaicId)) return [...ids];
    return [mosaicId];
  }

  function applyMosaicDragDelta(dx: number, dy: number) {
    for (const oid of mosaicDragIdsRef.current) {
      mosaicGroupNodeRefs.current.get(oid)?.position({ x: dx, y: dy });
    }
  }

  function resetMosaicGroupDragPositions() {
    for (const oid of mosaicDragIdsRef.current) {
      mosaicGroupNodeRefs.current.get(oid)?.position({ x: 0, y: 0 });
    }
  }

  function handleMosaicDragStart(mosaicId: string) {
    mosaicDragIdsRef.current = mosaicDragSelectionFor(mosaicId);
    mosaicDragLeaderRef.current = mosaicId;
  }

  function handleMosaicDragMove(mosaicId: string, ev: Konva.KonvaEventObject<DragEvent>) {
    if (mosaicDragLeaderRef.current !== mosaicId) return;
    const g = ev.target as unknown as Konva.Group;
    const dx = g.x();
    const dy = g.y();
    for (const oid of mosaicDragIdsRef.current) {
      if (oid === mosaicId) continue;
      mosaicGroupNodeRefs.current.get(oid)?.position({ x: dx, y: dy });
    }
  }

  function handleMosaicDragEnd(mosaicId: string, ev: Konva.KonvaEventObject<DragEvent>) {
    const g = ev.target as unknown as Konva.Group;
    const dx = g.x();
    const dy = g.y();
    g.position({ x: 0, y: 0 });
    const ids = mosaicDragIdsRef.current.length > 0 ? [...mosaicDragIdsRef.current] : [mosaicId];
    resetMosaicGroupDragPositions();
    mosaicDragIdsRef.current = [];
    mosaicDragLeaderRef.current = null;
    if (Math.abs(dx) >= 0.01 || Math.abs(dy) >= 0.01) suppressNextStageSelectionClearRef.current = true;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
    commit(moveMosaicNodesInDoc(historyRef.current.present, ids, dx, dy));
  }

  function handleMosaicGroupDragStart(boxX: number, boxY: number) {
    mosaicDragIdsRef.current = [...selectedMosaicIdsRef.current];
    mosaicDragLeaderRef.current = '__group__';
    mosaicGroupDragBoxOriginRef.current = { x: boxX, y: boxY };
  }

  function handleMosaicGroupDragMove(ev: Konva.KonvaEventObject<DragEvent>) {
    if (mosaicDragLeaderRef.current !== '__group__') return;
    const rect = ev.target as unknown as Konva.Rect;
    const dx = rect.x() - mosaicGroupDragBoxOriginRef.current.x;
    const dy = rect.y() - mosaicGroupDragBoxOriginRef.current.y;
    applyMosaicDragDelta(dx, dy);
  }

  function handleMosaicGroupDragEnd(ev: Konva.KonvaEventObject<DragEvent>) {
    if (mosaicDragLeaderRef.current !== '__group__') return;
    const rect = ev.target as unknown as Konva.Rect;
    const dx = rect.x() - mosaicGroupDragBoxOriginRef.current.x;
    const dy = rect.y() - mosaicGroupDragBoxOriginRef.current.y;
    rect.position({
      x: mosaicGroupDragBoxOriginRef.current.x,
      y: mosaicGroupDragBoxOriginRef.current.y
    });
    const ids = [...mosaicDragIdsRef.current];
    resetMosaicGroupDragPositions();
    mosaicDragIdsRef.current = [];
    mosaicDragLeaderRef.current = null;
    if (Math.abs(dx) >= 0.01 || Math.abs(dy) >= 0.01) suppressNextStageSelectionClearRef.current = true;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
    commit(moveMosaicNodesInDoc(historyRef.current.present, ids, dx, dy));
  }

  function markSuppressStageSelectionClear() {
    suppressNextStageSelectionClearRef.current = true;
  }

  function finishTextEditing() {
    if (!editingTextId) return;
    const id = editingTextId;
    const draft = editingTextDraft;
    const node = historyRef.current.present.nodes.find((n): n is TextNode => n.kind === 'text' && n.id === id);
    let doc = historyRef.current.present;
    if (node) {
      const measured = measureTextBlock(
        draft,
        node.fontSize,
        node.fontFamily,
        (node.padding ?? 0) + TEXT_RENDER_PADDING,
        node.lineHeight ?? 1.25,
        node.fontWeight,
        node.fontItalic
      );
      doc = {
        ...doc,
        nodes: doc.nodes.map((n) => {
          if (n.id !== id || n.kind !== 'text') return n;
          const { width: _w, mode: _m, ...rest } = n;
          return {
            ...rest,
            text: draft,
            mode: 'singleLine' as const,
            width: measured.width,
            updatedAt: Date.now()
          };
        })
      };
    } else {
      doc = updateNode(doc, id, { text: draft, mode: 'singleLine' });
    }
    commit(doc);
    setEditingTextId(null);
    setTool({ kind: 'select' });
  }

  function getPointer() {
    const stage = stageRef.current;
    if (!stage) return null;
    return stage.getPointerPosition();
  }

  function getPointerInDocument() {
    const group = baseGroupRef.current;
    if (group) {
      const rel = group.getRelativePointerPosition();
      if (rel) return rel;
    }
    const stage = stageRef.current;
    const p = getPointer();
    if (!stage || !p) return null;
    const rect = stage.container().getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const sx = stage.width() / rect.width;
    const sy = stage.height() / rect.height;
    return pointerInDocumentFromClient(rect.left + p.x / sx, rect.top + p.y / sy);
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

    if (absX !== 1) {
      patch.mode = 'singleLine';
      patch.width = Math.max(40, baseWidthNow * absX);
    }
    if (absY !== 1) {
      patch.fontSize = Math.max(10, baseFontSizeNow * absY);
      patch.padding = Math.max(0, Math.round((orig.padding ?? 0) * absY));
    }
    if (orig.letterSpacing != null && absX !== 1) patch.letterSpacing = orig.letterSpacing * absX;

    commit(updateNode(historyRef.current.present, textId, patch));
    markSuppressStageSelectionClear();
  }

  function commitArrowTransformEnd(arrowId: string, konvaArrow: Konva.Arrow) {
    const orig = historyRef.current.present.nodes.find((n): n is ArrowNode => n.kind === 'arrow' && n.id === arrowId);
    if (!orig) return;

    const sx = konvaArrow.scaleX();
    const sy = konvaArrow.scaleY();
    if (Math.abs(sx - 1) < 0.001 && Math.abs(sy - 1) < 0.001) {
      konvaArrow.scaleX(1);
      konvaArrow.scaleY(1);
      return;
    }

    const flat = konvaArrow.points();
    if (flat.length < 4) {
      konvaArrow.scaleX(1);
      konvaArrow.scaleY(1);
      return;
    }

    const absT = konvaArrow.getAbsoluteTransform();
    const localStart = { x: flat[0]!, y: flat[1]! };
    const localEnd = { x: flat[flat.length - 2]!, y: flat[flat.length - 1]! };
    const startAbs = absT.point(localStart);
    const endAbs = absT.point(localEnd);
    const sp = stagePosition;
    const sc = stageScale;
    const docStart = { x: (startAbs.x - sp.x) / sc, y: (startAbs.y - sp.y) / sc };
    const docEnd = { x: (endAbs.x - sp.x) / sc, y: (endAbs.y - sp.y) / sc };

    konvaArrow.scaleX(1);
    konvaArrow.scaleY(1);
    konvaArrow.rotation(0);
    konvaArrow.offsetX(0);
    konvaArrow.offsetY(0);
    konvaArrow.position({ x: 0, y: 0 });

    commit(
      updateNode(historyRef.current.present, arrowId, {
        points: [docStart, docEnd],
        strokeWidth: orig.strokeWidth,
        pointerLength: orig.pointerLength,
        pointerWidth: orig.pointerWidth,
        stroke: orig.stroke,
        arrowKind: orig.arrowKind,
        layer: (orig as any).layer,
        locked: (orig as any).locked
      } as Partial<ArrowNode>)
    );
    markSuppressStageSelectionClear();
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

    if (ocrRegionPickActiveRef.current) {
      if (!docPos) return;
      e.cancelBubble = true;
      startOcrRegionPickDrag(docPos);
      return;
    }

    // Crop mode: drag selection shape; affects only export output.
    if (transformMode === 'crop') {
      if (!docPos) return;
      finishTextEditing();
      clearNodeSelection();
      setActiveMosaicId(null);
      isDrawingRef.current = false;
      drawingNodeIdRef.current = null;
      if (isCropSelectionValid(cropSelection)) {
        return;
      }
      isCropDrawingRef.current = true;
      setCropDrawing(true);
      cropDrawStartRef.current = docPos;
      const shape = cropOptions.shape;
      if (shape === 'freehand') {
        setCropSelection({
          shape: 'freehand',
          box: { x: docPos.x, y: docPos.y, width: 1, height: 1 },
          freehandPoints: [{ x: docPos.x, y: docPos.y }],
          cornerRadius: cropOptions.cornerRadius
        });
      } else {
        setCropSelection(null);
      }
      return;
    }

    if (tool.kind === 'text') {
      const stage = stageRef.current;
      if (stage && pos) {
        const hit = pickArrowOrTextIdFromStageHit(stage, pos, historyRef.current.present);
        if (hit === 'transformer') return;
        if (hit) {
          onSelectNode(hit);
          return;
        }
      }
      if (docPos) {
        const nid = pickTopArrowOrTextAtDocPos(historyRef.current.present, docPos);
        if (nid) {
          onSelectNode(nid);
          return;
        }
      }
      const sid = selectedIdRef.current;
      if (sid) {
        const sel = historyRef.current.present.nodes.find((n) => n.id === sid);
        if (sel?.kind === 'arrow' || sel?.kind === 'text') return;
      }
      isTextCreatingRef.current = true;
      drawStartRef.current = docPos ?? pos;
      return;
    }

    if (tool.kind === 'select') {
      const stage = stageRef.current;
      const clickedOnEmpty = stage?.getIntersection(pos) == null;
      // Only allow panning when user holds Space (prevents accidental drags during editing workflows).
      if (clickedOnEmpty && spacePressedRef.current) {
        panStartRef.current = { pointer: pos, position: { ...stagePosition } };
      }
      return;
    }

    // Arrow tool: never start a new stroke on top of existing arrows/text or the transformer.
    if (tool.kind === 'arrow') {
      const stage = stageRef.current;
      if (stage && pos) {
        const hit = pickArrowOrTextIdFromStageHit(stage, pos, historyRef.current.present);
        if (hit === 'transformer') return;
        if (hit) {
          onSelectNode(hit);
          return;
        }
      }
      if (docPos) {
        const nid = pickTopArrowOrTextAtDocPos(historyRef.current.present, docPos);
        if (nid) {
          onSelectNode(nid);
          return;
        }
      }
      const sid = selectedIdRef.current;
      if (sid) {
        const sel = historyRef.current.present.nodes.find((n) => n.id === sid);
        if (sel?.kind === 'arrow' || sel?.kind === 'text') return;
      }
    }

    if (!docPos) return;

    if (tool.kind === 'mosaic') {
      const stage = stageRef.current;
      const hitId = stage ? pickMosaicIdFromStageHit(stage, pos, historyRef.current.present) : null;
      const mosaicId = hitId ?? pickTopMosaicAtDocPos(historyRef.current.present, docPos);
      if (mosaicId) {
        const shiftKey = !!(e.evt as MouseEvent).shiftKey;
        const prev = selectedMosaicIdsRef.current;
        const alreadySelected =
          prev.includes(mosaicId) || (prev.length === 0 && selectedIdRef.current === mosaicId);
        if (shiftKey || !alreadySelected) onSelectMosaicNode(mosaicId, shiftKey);
        return;
      }
    }

    isDrawingRef.current = true;
    drawStartRef.current = docPos;
    drawingNodeIdRef.current = null;

    if (tool.kind === 'mosaic' && (tool.mode ?? 'rect') === 'rect') {
      // Keep a fresh background snapshot at draw start.
      const snap = captureSnapshotCanvasNow();
      if (snap) {
        setBaseCanvas(snap);
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
      if (id) {
        setSelectedMosaicIds([id]);
        setSelectedId(id);
      }
      return;
    }

    if (tool.kind === 'mosaic' && (tool.mode ?? 'rect') === 'brush') {
      const snap = captureSnapshotCanvasNow();
      if (snap) {
        setBaseCanvas(snap);
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
      if (id) {
        setSelectedMosaicIds([id]);
        setSelectedId(id);
      }
      return;
    }

    if (tool.kind === 'arrow') {
      const next = addArrow(history.present, {
        arrowKind: tool.arrowKind ?? 'straight',
        points: [{ x: docPos.x, y: docPos.y }, { x: docPos.x, y: docPos.y }],
        stroke: tool.stroke,
        strokeWidth: tool.strokeWidth,
        pointerLength: tool.pointerLength,
        pointerWidth: tool.pointerWidth,
        opacity: tool.opacity ?? 1,
        shadow: tool.shadow ?? false
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
    if (ocrRegionPickActiveRef.current && ocrRegionPickDrawingRef.current) {
      updateOcrRegionPickDrag();
      return;
    }
    if (transformMode === 'crop' && isCropDrawingRef.current) {
      const start = cropDrawStartRef.current;
      const docPos = getPointerInDocument();
      if (!docPos) return;
      const shape = cropOptions.shape;
      if (shape === 'freehand') {
        if (!start) return;
        setCropSelection((prev) => {
          const pts = [...(prev?.freehandPoints ?? []), docPos];
          if (pts.length >= 2) {
            const last = pts[pts.length - 2]!;
            const dx = docPos.x - last.x;
            const dy = docPos.y - last.y;
            if (dx * dx + dy * dy < 4) return prev;
          }
          const box = clampCropBox(boundsFromPoints(pts));
          if (!box) return prev;
          return { shape: 'freehand', box, freehandPoints: pts, cornerRadius: cropOptions.cornerRadius };
        });
      } else if (start) {
        const box = cropBoxFromPointerDrag(start, docPos, shape, 1);
        setCropSelection({ shape, box, cornerRadius: cropOptions.cornerRadius });
      }
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
    if (ocrRegionPickActiveRef.current && ocrRegionPickDrawingRef.current) {
      endOcrRegionPickDrag();
      return;
    }
    if (transformMode === 'crop' && isCropDrawingRef.current) {
      const start = cropDrawStartRef.current;
      const end = getPointerInDocument();
      const shape = cropOptions.shape;
      isCropDrawingRef.current = false;
      setCropDrawing(false);
      cropDrawStartRef.current = null;
      if (start && end && shape !== 'freehand') {
        const raw = cropBoxFromPointerDrag(start, end, shape, 4);
        const c = clampCropBox(raw);
        if (c) {
          setCropSelection({ shape, box: c, cornerRadius: cropOptions.cornerRadius });
        } else {
          setCropSelection(null);
        }
      } else if (shape === 'freehand') {
        const sel = cropSelectionRef.current;
        if (sel?.shape === 'freehand') {
          const c = clampCropBox(sel.box);
          if (c) setCropSelection((prev) => (prev ? { ...prev, box: c } : null));
        }
      }
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
        if (hadPanStart) clearNodeSelection();
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
        fontWeight: tool.fontWeight,
        fontItalic: tool.fontItalic,
        underline: tool.underline,
        mode: 'singleLine' as const
      };

      // Always horizontal text; only Enter adds newlines (no narrow box auto-wrap).
      const place = dist < 4 ? pos : normalizeRect(start, pos);
      const nextDoc = addText(history.present, {
        x: place.x,
        y: place.y,
        ...baseTextProps
      });
      const last = nextDoc.nodes[nextDoc.nodes.length - 1] ?? null;
      const id = last?.id ?? null;
      commit(nextDoc);
      setSelectedMosaicIds([]);
      setSelectedId(id);
      if (last?.kind === 'text') {
        queueMicrotask(() => startEditingTextNode(last));
      }
      props.options?.onTextCreated?.();
      return;
    }

    if (hadPanStart) clearNodeSelection();

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
        clearNodeSelection();
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
        clearNodeSelection();
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
      // Stay in arrow tool: do not select the new arrow so the next drag creates another arrow.
      clearNodeSelection();
    }

    setActiveMosaicId(null);
  }

  function startEditingTextNode(node: TextNode) {
    setEditingTextId(node.id);
    setEditingTextDraft(node.text);
    setSelectedMosaicIds([]);
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
      if (!docPos || !cropSelection) return;

      if (!pointInCropSelection(docPos, cropSelection)) void applyCropNow();
      return;
    }
    if (tool.kind === 'select' || tool.kind === 'arrow' || tool.kind === 'text') {
      if (suppressNextStageSelectionClearRef.current) {
        suppressNextStageSelectionClearRef.current = false;
        return;
      }
      const stage = stageRef.current;
      if (stage && shouldClearSelectionOnStageClick(stage)) clearNodeSelection();
    }
  }

  function selectNodeCore(id: string) {
    setSelectedMosaicIds([]);
    const node = history.present.nodes.find((n) => n.id === id) ?? null;
    if ((node as any)?.locked) {
      clearNodeSelection();
      return;
    }
    setSelectedId(id);
  }

  function requestAnnotationEdit(kind: 'text' | 'arrow', id: string, edit?: () => void) {
    selectNodeCore(id);
    edit?.();
    props.options?.onAnnotationEditRequest?.({ kind, id });
    suppressAnnotationClickRef.current = true;
    window.setTimeout(() => {
      suppressAnnotationClickRef.current = false;
    }, 0);
  }

  function onSelectNode(id: string) {
    if (suppressAnnotationClickRef.current) return;
    selectNodeCore(id);
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

  function getExportDocumentRect(): { x: number; y: number; width: number; height: number } {
    const doc = historyRef.current.present;
    const docW = doc.width;
    const docH = doc.height;
    const img = bgImage;
    if (!img) return { x: 0, y: 0, width: docW, height: docH };
    const ox = bgOffsetDocRef.current.x;
    const oy = bgOffsetDocRef.current.y;
    const iw = img.naturalWidth || img.width || docW;
    const ih = img.naturalHeight || img.height || docH;
    return exportContentBoundsInDocument(docW, docH, iw, ih, ox, oy);
  }

  function applyExportTransforms(
    srcCanvas: HTMLCanvasElement,
    overrideCrop?: CropSelection | null,
    sourcePixelRatio = 1,
    opts?: { alreadyDocSized?: boolean; docSize?: { width: number; height: number } }
  ): HTMLCanvasElement {
    let outCanvas: HTMLCanvasElement = srcCanvas;

    if (!opts?.alreadyDocSized) {
      // Crop to the full document content rect (includes background drag offset).
      const exportRect = getExportDocumentRect();
      const { scale, position: pos } = getDocumentStageLayout();
      const docX = (pos.x + exportRect.x * scale) * sourcePixelRatio;
      const docY = (pos.y + exportRect.y * scale) * sourcePixelRatio;
      const docWidth = exportRect.width * scale * sourcePixelRatio;
      const docHeight = exportRect.height * scale * sourcePixelRatio;

      const dsx = clamp(Math.round(docX), 0, outCanvas.width - 1);
      const dsy = clamp(Math.round(docY), 0, outCanvas.height - 1);
      const dex = clamp(Math.round(docX + docWidth), 0, outCanvas.width);
      const dey = clamp(Math.round(docY + docHeight), 0, outCanvas.height);
      const dcw = Math.max(1, dex - dsx);
      const dch = Math.max(1, dey - dsy);

      const docCanvas = document.createElement('canvas');
      docCanvas.width = dcw;
      docCanvas.height = dch;
      const dctx = docCanvas.getContext('2d');
      if (!dctx) return outCanvas;
      dctx.drawImage(outCanvas, dsx, dsy, dcw, dch, 0, 0, dcw, dch);
      outCanvas = docCanvas;
    }

    const docW = opts?.docSize?.width ?? historyRef.current.present.width;
    const docH = opts?.docSize?.height ?? historyRef.current.present.height;
    const effectiveCrop = overrideCrop ?? cropSelection;
    const normalizedCrop =
      effectiveCrop && effectiveCrop.shape === 'circle'
        ? { ...effectiveCrop, box: toCircleBox(effectiveCrop.box) }
        : effectiveCrop;
    if (normalizedCrop && isCropSelectionValid(normalizedCrop)) {
      const { box } = normalizedCrop;
      const fx = outCanvas.width / Math.max(1, docW);
      const fy = outCanvas.height / Math.max(1, docH);
      const x = box.x * fx;
      const y = box.y * fy;
      const w = box.width * fx;
      const h = box.height * fy;

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
      outCanvas = applyCropShapeMask(cropCanvas, normalizedCrop, docW, docH);
    }

    return outCanvas;
  }

  async function ensureBgImageSynced(): Promise<HTMLImageElement | null> {
    const src = bgSrc;
    if (!src) return bgImage;
    const doc = historyRef.current.present;
    if (
      bgImage &&
      bgImage.src === src &&
      (bgImage.naturalWidth || bgImage.width) === doc.width &&
      (bgImage.naturalHeight || bgImage.height) === doc.height
    ) {
      return bgImage;
    }
    try {
      const img = await loadHtmlImage(src);
      setBgImage(img);
      return img;
    } catch {
      return bgImage;
    }
  }

  async function applyCropNow() {
    if (!isCropSelectionValid(cropSelection) || !bgImage) return;
    const exportCrop: CropSelection =
      cropSelection.shape === 'circle'
        ? { ...cropSelection, box: toCircleBox(cropSelection.box) }
        : cropSelection;
    const doc = historyRef.current.present;
    const docW = doc.width;
    const docH = doc.height;

    const exportPixelRatio = (() => {
      const maxDim = 16384;
      const maxPixels = 180_000_000;
      let ratio = 1;
      ratio = Math.min(ratio, maxDim / Math.max(1, docW), maxDim / Math.max(1, docH));
      const px = docW * ratio * docH * ratio;
      if (px > maxPixels) ratio *= Math.sqrt(maxPixels / px);
      return Math.max(1, ratio);
    })();

    const exportRect = getExportDocumentRect();
    const compositeCanvas = await renderDocCompositeWithMosaics(exportPixelRatio, exportRect);
    const relCrop: CropSelection = {
      ...exportCrop,
      box: {
        x: exportCrop.box.x - exportRect.x,
        y: exportCrop.box.y - exportRect.y,
        width: exportCrop.box.width,
        height: exportCrop.box.height
      },
      freehandPoints: exportCrop.freehandPoints?.map((p) => ({
        x: p.x - exportRect.x,
        y: p.y - exportRect.y
      }))
    };
    const transformedRaw = applyExportTransforms(compositeCanvas, relCrop, exportPixelRatio, {
      alreadyDocSized: true,
      docSize: { width: exportRect.width, height: exportRect.height }
    });
    const cropBox = exportCrop.box;
    const transformed = normalizeCanvasToDocSize(transformedRaw, cropBox.width, cropBox.height);
    const dataUrl = transformed.toDataURL('image/png');
    const croppedImg = await loadHtmlImage(dataUrl);

    // Mosaics are baked into the cropped background; keep arrows/text as editable nodes.
    const nonMosaicNodes = doc.nodes.filter((n) => n.kind !== 'mosaicRect' && n.kind !== 'mosaicStroke');
    const croppedDoc = cropDocumentToRegion(
      { ...doc, nodes: nonMosaicNodes, background: { kind: 'image', src: dataUrl } },
      cropBox
    );

    invalidateMosaicCaches();
    setHistory((h) => {
      const next = pushHistory(h, croppedDoc);
      historyRef.current = next;
      return next;
    });
    bgSrcUpdateOriginRef.current = 'history';
    setBgSrc(dataUrl);
    setBgImage(croppedImg);
    setBgOffsetDoc({ x: 0, y: 0 });
    setUndoRedoKey((k) => k + 1);
    applyStageLayoutForDocument(croppedDoc.width, croppedDoc.height);

    props.options?.onCropApplied?.({
      dataUrl,
      width: croppedDoc.width,
      height: croppedDoc.height
    });
    setTransformModeState('none');
    setCropSelection(null);
    clearNodeSelection();
    setActiveMosaicId(null);
  }

  function getCropClampBounds(): CropBox {
    return getExportDocumentRect();
  }

  function clampCropBox(next: { x: number; y: number; width: number; height: number }) {
    return clampCropBoxToBounds(next, getCropClampBounds(), 4);
  }

  function patchCropBox(box: { x: number; y: number; width: number; height: number }) {
    const shape = cropSelection?.shape ?? cropOptions.shape;
    const normalized = shape === 'circle' ? toCircleBox(box) : box;
    const clamped = clampCropBox(normalized);
    if (!clamped) return;
    setCropSelection((prev) => ({
      shape: prev?.shape ?? cropOptions.shape,
      box: clamped,
      cornerRadius: prev?.cornerRadius ?? cropOptions.cornerRadius,
      freehandPoints: prev?.freehandPoints
    }));
  }

  function shouldRenderCropOverlay(sel: CropSelection | null): sel is CropSelection {
    if (!sel) return false;
    if (cropDrawing) return true;
    if (sel.shape === 'freehand') return (sel.freehandPoints?.length ?? 0) >= 1;
    return sel.box.width >= 2 && sel.box.height >= 2;
  }

  /** Crop UI must sit above mosaic/arrow/text so handles stay draggable. */
  function renderCropSelectionOverlay(): React.ReactNode {
    if (transformMode !== 'crop' || !shouldRenderCropOverlay(cropSelection)) return null;
    const sel = cropSelection;
    const strokeProps = {
      stroke: 'rgba(76,159,254,0.95)' as const,
      strokeWidth: 2,
      fill: 'rgba(76,159,254,0.12)' as const,
      listening: true as const
    };

    if (sel.shape === 'freehand' && sel.freehandPoints && sel.freehandPoints.length > 0) {
      const pts = sel.freehandPoints;
      const closed = !cropDrawing && pts.length >= 3;
      if (pts.length === 1) {
        return (
          <Rect
            ref={() => {
              cropNodeRef.current = null;
            }}
            x={pts[0]!.x - 4}
            y={pts[0]!.y - 4}
            width={8}
            height={8}
            cornerRadius={4}
            {...strokeProps}
            dash={[]}
            draggable={false}
            listening={false}
          />
        );
      }
      return (
        <Line
          ref={(n) => {
            cropNodeRef.current = n;
          }}
          points={pts.flatMap((p) => [p.x, p.y])}
          closed={closed}
          dash={cropDrawing ? [] : [6, 4]}
          lineCap="round"
          lineJoin="round"
          strokeWidth={cropDrawing ? 2.5 : 2}
          hitStrokeWidth={20}
          fill={closed ? strokeProps.fill : 'transparent'}
          fillEnabled={closed}
          listening={!cropDrawing}
          draggable={false}
          stroke={strokeProps.stroke}
        />
      );
    }

    if (sel.shape === 'circle') {
      const c = toCircleBox(sel.box);
      const r = c.width / 2;
      return (
        <Ellipse
          ref={(n) => {
            cropNodeRef.current = n;
          }}
          x={c.x + r}
          y={c.y + r}
          radiusX={r}
          radiusY={r}
          dash={cropDrawing ? [] : [6, 4]}
          draggable={!cropDrawing}
          onDragMove={(ev) => {
            const node = ev.target as unknown as Konva.Ellipse;
            const rad = Math.max(node.radiusX(), node.radiusY());
            patchCropBox({
              x: node.x() - rad,
              y: node.y() - rad,
              width: rad * 2,
              height: rad * 2
            });
          }}
          onTransformEnd={(ev) => {
            const node = ev.target as unknown as Konva.Ellipse;
            const sx = node.scaleX();
            const sy = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            const rad = Math.max(node.radiusX() * sx, node.radiusY() * sy);
            patchCropBox({
              x: node.x() - rad,
              y: node.y() - rad,
              width: rad * 2,
              height: rad * 2
            });
          }}
          {...strokeProps}
        />
      );
    }

    return (
      <Rect
        ref={(n) => {
          cropNodeRef.current = n;
        }}
        x={sel.box.x}
        y={sel.box.y}
        width={Math.max(sel.box.width, cropDrawing ? 1 : 4)}
        height={Math.max(sel.box.height, cropDrawing ? 1 : 4)}
        cornerRadius={sel.shape === 'roundRect' ? (sel.cornerRadius ?? cropOptions.cornerRadius) : 0}
        dash={cropDrawing ? [] : [6, 4]}
        draggable={!cropDrawing}
        onDragMove={(ev) => {
          const node = ev.target as unknown as Konva.Rect;
          patchCropBox({
            x: node.x(),
            y: node.y(),
            width: node.width(),
            height: node.height()
          });
        }}
        onTransformEnd={(ev) => {
          const node = ev.target as unknown as Konva.Rect;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const newW = node.width() * scaleX;
          const newH = node.height() * scaleY;
          node.scaleX(1);
          node.scaleY(1);
          patchCropBox({
            x: node.x(),
            y: node.y(),
            width: newW,
            height: newH
          });
        }}
        {...strokeProps}
      />
    );
  }

  async function resolveMosaicLayerImage(
    style: 'pixel' | 'blur',
    pixelSize: number,
    blurRadius: number,
    docSize: { width: number; height: number },
    source: HTMLImageElement | HTMLCanvasElement
  ): Promise<HTMLImageElement | null> {
    if (style === 'blur') {
      const cached = pickNearestCachedMosaicImage(blurRadius, blurCache, baseSnapshotKey);
      if (cached) return cached;
      const dataUrl =
        source instanceof HTMLImageElement
          ? await createBlurredDataUrl(source, blurRadius)
          : await createBlurredDataUrlFromSource(source, docSize, blurRadius);
      return await loadHtmlImage(dataUrl);
    }
    const cached = pickNearestCachedMosaicImage(pixelSize, pixelCache, baseSnapshotKey);
    if (cached) return cached;
    const dataUrl =
      source instanceof HTMLImageElement
        ? await createPixelatedDataUrl(source, pixelSize)
        : await createPixelatedDataUrlFromSource(source, docSize, pixelSize);
    return await loadHtmlImage(dataUrl);
  }

  /** Background + mosaic effects at document resolution (what the user sees). */
  async function renderDocCompositeWithMosaics(
    pixelRatio = 1,
    bounds?: { x: number; y: number; width: number; height: number }
  ): Promise<HTMLCanvasElement> {
    if (!bgImage) throw new Error('Background not ready');
    const doc = historyRef.current.present;
    const docW = doc.width;
    const docH = doc.height;
    const exportRect = bounds ?? { x: 0, y: 0, width: docW, height: docH };
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(exportRect.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(exportRect.height * pixelRatio));
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.drawImage(bgImage, bgOffsetDoc.x - exportRect.x, bgOffsetDoc.y - exportRect.y);

    const docSize = { width: docW, height: docH };
    const canUseBaseCanvas =
      !!baseCanvas &&
      baseCanvasBgSrc === (bgSrc ?? null) &&
      !!baseCanvasOffset &&
      baseCanvasOffset.x === bgOffsetDoc.x &&
      baseCanvasOffset.y === bgOffsetDoc.y;
    const source: HTMLImageElement | HTMLCanvasElement = canUseBaseCanvas ? baseCanvas! : bgImage;
    const scale = pixelRatio;

    for (const n of mosaicNodesInOrder) {
      const style = ((n as any).style ?? 'pixel') as 'pixel' | 'blur';
      const pixelSize = ((n as any).pixelSize as number | undefined) ?? 12;
      const blurRadius = ((n as any).blurRadius as number | undefined) ?? 6;
      const mosaicImg = await resolveMosaicLayerImage(style, pixelSize, blurRadius, docSize, source);
      if (!mosaicImg) continue;

      const ox = (bgOffsetDoc.x - exportRect.x) * scale;
      const oy = (bgOffsetDoc.y - exportRect.y) * scale;
      const dw = docW * scale;
      const dh = docH * scale;

      if (n.kind === 'mosaicRect') {
        ctx.save();
        ctx.beginPath();
        ctx.rect((n.x - exportRect.x) * scale, (n.y - exportRect.y) * scale, n.width * scale, n.height * scale);
        ctx.clip();
        ctx.drawImage(mosaicImg, ox, oy, dw, dh);
        ctx.restore();
        continue;
      }

      const br = (n.brushSize / 2) * scale;
      for (const p of n.points) {
        ctx.save();
        ctx.beginPath();
        ctx.arc((p.x - exportRect.x) * scale, (p.y - exportRect.y) * scale, br, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(mosaicImg, ox, oy, dw, dh);
        ctx.restore();
      }
    }

    return canvas;
  }

  async function exportBlob(options: { format: 'png' | 'jpeg' | 'webp'; quality?: number }) {
    const stage = stageRef.current;
    if (!stage) throw new Error('Stage not ready');
    const layout = await prepareStageForExport();
    const exportPixelRatio = (() => {
      const scale = Math.max(0.0001, layout.scale);
      let ratio = 1 / scale;
      const maxDim = 16384;
      const maxPixels = 180_000_000;
      ratio = Math.min(ratio, maxDim / Math.max(1, stageSize.width), maxDim / Math.max(1, stageSize.height));
      const px = (stageSize.width * ratio) * (stageSize.height * ratio);
      if (px > maxPixels) ratio *= Math.sqrt(maxPixels / px);
      return Math.max(1, ratio);
    })();
    const canvas = stage.toCanvas({ pixelRatio: exportPixelRatio });
    const transformed = applyExportTransforms(canvas, undefined, exportPixelRatio);
    return await exportCanvasToBlob(transformed, options);
  }

  /** Mosaic / arrow / text only at document size; background omitted (transparent outside shapes). */
  async function exportAnnotationsLayerBlob(options: { format: 'png' | 'jpeg' | 'webp'; quality?: number }) {
    const stage = stageRef.current;
    if (!stage) throw new Error('Stage not ready');
    const base = baseGroupRef.current;
    const transformer = transformerRef.current;
    const chrome = annotationChromeGroupRef.current;
    const prevBase = base?.visible() ?? true;
    const prevTrans = transformer?.visible() ?? true;
    const prevChrome = chrome?.visible() ?? true;
    try {
      base?.visible(false);
      transformer?.visible(false);
      chrome?.visible(false);
      const layout = await prepareStageForExport();
      const exportPixelRatio = (() => {
        const scale = Math.max(0.0001, layout.scale);
        let ratio = 1 / scale;
        const maxDim = 16384;
        const maxPixels = 180_000_000;
        ratio = Math.min(ratio, maxDim / Math.max(1, stageSize.width), maxDim / Math.max(1, stageSize.height));
        const px = (stageSize.width * ratio) * (stageSize.height * ratio);
        if (px > maxPixels) ratio *= Math.sqrt(maxPixels / px);
        return Math.max(1, ratio);
      })();
      const canvas = stage.toCanvas({ pixelRatio: exportPixelRatio });
      const transformed = applyExportTransforms(canvas, undefined, exportPixelRatio);
      return await exportCanvasToBlob(transformed, options);
    } finally {
      base?.visible(prevBase);
      transformer?.visible(prevTrans);
      chrome?.visible(prevChrome);
      stage.batchDraw();
    }
  }

  useImperativeHandle(ref, () => ({
    setTool(nextTool) {
      if (nextTool.kind !== 'text') finishTextEditing();
      setTool(nextTool);
      if (nextTool.kind !== 'select') clearNodeSelection();
      if (nextTool.kind !== 'select') {
        setTransformModeState('none');
        setCropSelection(null);
      }
    },
    setTransformMode(mode) {
      if (mode === 'none') {
        setCropSelection(null);
        isCropDrawingRef.current = false;
        setCropDrawing(false);
        cropDrawStartRef.current = null;
      }
      if (mode === 'crop') {
        setCropSelection(null);
        isCropDrawingRef.current = false;
        setCropDrawing(false);
        cropDrawStartRef.current = null;
      }
      setTransformModeState(mode);
      clearNodeSelection();
    },
    setCropOptions(options: Partial<CropOptions>) {
      setCropOptionsState((prev) => ({
        shape: options.shape ?? prev.shape,
        cornerRadius: options.cornerRadius ?? prev.cornerRadius
      }));
      if (options.shape != null) {
        setCropSelection(null);
        isCropDrawingRef.current = false;
        setCropDrawing(false);
        cropDrawStartRef.current = null;
      }
    },
    getCropOptions() {
      return cropOptions;
    },
    clearCrop() {
      setCropSelection(null);
      isCropDrawingRef.current = false;
      setCropDrawing(false);
      cropDrawStartRef.current = null;
    },
    resetTransforms() {
      setCropSelection(null);
      isCropDrawingRef.current = false;
      setCropDrawing(false);
      cropDrawStartRef.current = null;
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
        if (style.fontItalic != null) patch.fontItalic = style.fontItalic;
        if (style.underline != null) patch.underline = style.underline;
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
        if (style.opacity != null) patch.opacity = style.opacity;
        if (style.shadow != null) patch.shadow = style.shadow;
        return pushHistory(h, updateNode(h.present, id, patch));
      });
    },
    applyMosaicStyle(style) {
      const ids =
        selectedMosaicIdsRef.current.length > 0
          ? [...selectedMosaicIdsRef.current]
          : (() => {
              const sid = selectedIdRef.current;
              if (!sid) return [] as string[];
              const n = historyRef.current.present.nodes.find((nn) => nn.id === sid) ?? null;
              if (n && (n.kind === 'mosaicRect' || n.kind === 'mosaicStroke')) return [sid];
              return [] as string[];
            })();
      if (ids.length === 0) return false;

      const px = Math.max(2, Math.round(style.pixelSize));
      const nextStyle = style.style;
      const br = Math.max(0, Math.round(style.blurRadius));
      const bs = Math.max(6, Math.min(48, Math.round(style.brushSize)));

      function rectVisualEqual(a: MosaicRectNode, patch: Partial<MosaicRectNode>) {
        const b = { ...a, ...patch } as MosaicRectNode;
        const aBlur = a.style === 'blur' ? (a.blurRadius ?? 6) : null;
        const bBlur = b.style === 'blur' ? (b.blurRadius ?? 6) : null;
        return a.pixelSize === b.pixelSize && a.style === b.style && aBlur === bBlur;
      }
      function strokeVisualEqual(a: MosaicStrokeNode, patch: Partial<MosaicStrokeNode>) {
        const b = { ...a, ...patch } as MosaicStrokeNode;
        const aBlur = a.style === 'blur' ? (a.blurRadius ?? 6) : null;
        const bBlur = b.style === 'blur' ? (b.blurRadius ?? 6) : null;
        return a.pixelSize === b.pixelSize && a.style === b.style && aBlur === bBlur && a.brushSize === b.brushSize;
      }

      setHistory((h) => {
        let next = h.present;
        let changed = false;
        for (const id of ids) {
          const node = next.nodes.find((n) => n.id === id) ?? null;
          if (!node) continue;
          if (node.kind === 'mosaicRect') {
            const patch: Partial<MosaicRectNode> = {
              pixelSize: px,
              style: nextStyle,
              blurRadius: nextStyle === 'blur' ? br : undefined
            };
            if (rectVisualEqual(node, patch)) continue;
            next = updateNode(next, id, patch);
            changed = true;
          } else if (node.kind === 'mosaicStroke') {
            const patch: Partial<MosaicStrokeNode> = {
              pixelSize: px,
              style: nextStyle,
              blurRadius: nextStyle === 'blur' ? br : undefined,
              brushSize: bs
            };
            if (strokeVisualEqual(node, patch)) continue;
            next = updateNode(next, id, patch);
            changed = true;
          }
        }
        if (!changed) return h;
        return pushHistory(h, next);
      });
      return true;
    },
    undo() {
      finishTextEditing();
      const next = undo(historyRef.current);
      invalidateMosaicCaches();
      bgSrcUpdateOriginRef.current = 'history';
      setBgSrc(next.present.background.src);
      setHistory(next);
      setUndoRedoKey((k) => k + 1);
      clearNodeSelection();
      setTransformModeState('none');
      setCropSelection(null);
    },
    redo() {
      finishTextEditing();
      const next = redo(historyRef.current);
      invalidateMosaicCaches();
      bgSrcUpdateOriginRef.current = 'history';
      setBgSrc(next.present.background.src);
      setHistory(next);
      setUndoRedoKey((k) => k + 1);
      clearNodeSelection();
      setTransformModeState('none');
      setCropSelection(null);
    },
    saveTemplate() {
      if (!templateKey) {
        props.options?.onTemplateEvent?.({ type: 'invalid_key', key: '' });
        return;
      }
      saveTemplateNow(historyRef.current.present);
    },
    applyTemplate() {
      applyTemplateByKey(props.options?.template?.key ?? '');
    },
    applyTemplateByKey(userKey: string) {
      const name = userKey.trim();
      if (!name) {
        props.options?.onTemplateEvent?.({ type: 'invalid_key', key: '' });
        return;
      }
      const storageKey = `screenshot_template_v1:${name}`;
      try {
        const tpl = loadTemplate(storageKey);
        if (!tpl) {
          props.options?.onTemplateEvent?.({ type: 'not_found', key: storageKey });
          return;
        }
        const mergeExisting = templateApplyMergeExistingRef.current;
        const nodeCount = tpl.nodes.length;
        setHistory((h) => pushHistory(h, applyTemplateToDocument(h.present, tpl, { mergeExisting })));
        clearNodeSelection();
        props.options?.onTemplateEvent?.({ type: 'apply', key: storageKey, nodeCount });
      } catch (e) {
        props.options?.onTemplateEvent?.({
          type: 'error',
          key: storageKey,
          message: e instanceof Error ? e.message : String(e)
        });
      }
    },
    clearTemplate() {
      clearTemplateNow();
      // Also clear current annotation layer so user can remove an applied template immediately.
      setHistory((h) => pushHistory(h, { ...h.present, nodes: [] }));
      clearNodeSelection();
      detectedRegionsRef.current = [];
      setDetectedRegionsState([]);
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
      setHistory((h) =>
        pushHistory(h, applyTemplateToDocument(h.present, snapshot as any, { mergeExisting: false }))
      );
      clearNodeSelection();
    },
    clearAnnotations() {
      setHistory((h) => pushHistory(h, { ...h.present, nodes: [] }));
      clearNodeSelection();
      detectedRegionsRef.current = [];
      setDetectedRegionsState([]);
      setActiveMosaicId(null);
    },
    setBackgroundDragMode(mode: boolean | 'align') {
      const kind: BackgroundDragKind = mode === true ? 'align' : mode === false ? false : mode;
      bgDragKindRef.current = kind;
      bgDragModeRef.current = kind !== false;
      setBgDragMode(kind !== false);
      clearNodeSelection();
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
      const next = rects.map((r, idx) => ({
        ...r,
        id: `det_${Date.now()}_${idx}`,
        selected: true
      }));
      detectedRegionsRef.current = next;
      setDetectedRegionsState(next);
    },
    clearDetectedRegions() {
      detectedRegionsRef.current = [];
      setDetectedRegionsState([]);
    },
    setAllDetectedRegionsSelected(selected: boolean) {
      setAllDetectedRegionsSelected(selected);
    },
    applyDetectedRegionsAsMosaic(options) {
      const regions = detectedRegionsRef.current;
      if (regions.length === 0) return;
      const pixelSize = options?.pixelSize ?? 14;
      const style = options?.style ?? 'pixel';
      const blurRadius = style === 'blur' ? (options?.blurRadius ?? 6) : undefined;
      const selected = regions.filter((r) => r.selected && r.width > 0 && r.height > 0);
      if (selected.length === 0) {
        detectedRegionsRef.current = [];
        setDetectedRegionsState([]);
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
      detectedRegionsRef.current = [];
      setDetectedRegionsState([]);
    },
    async getOcrInput(region?: MosaicRectInput) {
      const doc = historyRef.current.present;
      const dataUrl = await ensureDataUrlForOcr(doc.background.src);
      const img = await loadHtmlImage(dataUrl);
      const iw = img.naturalWidth || img.width || 1;
      const ih = img.naturalHeight || img.height || 1;
      if (!region || region.width <= 0 || region.height <= 0) {
        return {
          dataUrl,
          imageWidth: iw,
          imageHeight: ih,
          docWidth: doc.width,
          docHeight: doc.height
        };
      }
      const sx = iw / Math.max(1, doc.width);
      const sy = ih / Math.max(1, doc.height);
      const rx = clamp(Math.floor(region.x * sx), 0, Math.max(0, iw - 1));
      const ry = clamp(Math.floor(region.y * sy), 0, Math.max(0, ih - 1));
      const rw = clamp(Math.ceil(region.width * sx), 1, iw - rx);
      const rh = clamp(Math.ceil(region.height * sy), 1, ih - ry);
      const canvas = document.createElement('canvas');
      canvas.width = rw;
      canvas.height = rh;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not available');
      ctx.drawImage(img, rx, ry, rw, rh, 0, 0, rw, rh);
      return {
        dataUrl: canvas.toDataURL('image/png'),
        imageWidth: rw,
        imageHeight: rh,
        docWidth: region.width,
        docHeight: region.height,
        regionOffset: { x: region.x, y: region.y }
      };
    },
    beginOcrRegionPick() {
      ocrRegionPickActiveRef.current = true;
      ocrRegionPickDrawingRef.current = false;
      ocrRegionPickStartRef.current = null;
      setOcrRegionPickPreview(null);
      setOcrRegionPickActive(true);
      finishTextEditing();
      clearNodeSelection();
      setTool({ kind: 'select' });
    },
    cancelOcrRegionPick() {
      cancelOcrRegionPickInternal();
    },
    export: exportBlob,
    exportAnnotationsLayer: exportAnnotationsLayerBlob,
    selectMosaicsSameRow() {
      const doc = historyRef.current.present;
      const seed = findSeedMosaicId(selectedIdRef.current, selectedMosaicIdsRef.current, doc);
      if (!seed) return { ok: false as const, count: 0 };
      const ids = sortMosaicIdsByRowThenCol(doc, collectSameRowMosaicIds(doc, seed));
      setSelectedMosaicIds(ids);
      setSelectedId(seed);
      setTool({ kind: 'select' });
      return { ok: true as const, count: ids.length };
    },
    selectMosaicsSameColumn() {
      const doc = historyRef.current.present;
      const seed = findSeedMosaicId(selectedIdRef.current, selectedMosaicIdsRef.current, doc);
      if (!seed) return { ok: false as const, count: 0 };
      const ids = sortMosaicIdsByColThenRow(doc, collectSameColumnMosaicIds(doc, seed));
      setSelectedMosaicIds(ids);
      setSelectedId(seed);
      setTool({ kind: 'select' });
      return { ok: true as const, count: ids.length };
    },
    deleteSelectedMosaics() {
      return removeSelectedMosaics();
    },
    isPointerOnAnnotationAt(clientX: number, clientY: number) {
      const stage = stageRef.current;
      if (!stage) return false;
      return isPointerOnAnnotationAtClient(stage, clientX, clientY);
    },
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
      if (key === 'escape' && ocrRegionPickActiveRef.current) {
        e.preventDefault();
        cancelOcrRegionPickInternal();
        return;
      }
      if (key === ' ') spacePressedRef.current = true;
      if ((e.ctrlKey || e.metaKey) && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo(history)) {
            const next = redo(history);
            invalidateMosaicCaches();
            bgSrcUpdateOriginRef.current = 'history';
            setBgSrc(next.present.background.src);
            setHistory(next);
            setUndoRedoKey((k) => k + 1);
          }
        } else {
          if (canUndo(history)) {
            const next = undo(history);
            invalidateMosaicCaches();
            bgSrcUpdateOriginRef.current = 'history';
            setBgSrc(next.present.background.src);
            setHistory(next);
            setUndoRedoKey((k) => k + 1);
          }
        }
        clearNodeSelection();
        setTransformModeState('none');
        setCropSelection(null);
      }
      if ((e.ctrlKey || e.metaKey) && key === 'y') {
        e.preventDefault();
        if (canRedo(history)) {
          const next = redo(history);
          invalidateMosaicCaches();
          bgSrcUpdateOriginRef.current = 'history';
          setBgSrc(next.present.background.src);
          setHistory(next);
          setUndoRedoKey((k) => k + 1);
        }
        clearNodeSelection();
        setTransformModeState('none');
        setCropSelection(null);
      }
      if (key === 'delete' || key === 'backspace') {
        e.preventDefault();
        const mosaicIdsToRemove = selectedMosaicIds.filter((mid) => {
          const node = history.present.nodes.find((nn) => nn.id === mid);
          return node && (node.kind === 'mosaicRect' || node.kind === 'mosaicStroke');
        });
        if (mosaicIdsToRemove.length > 0) {
          if (editingTextId) setEditingTextId(null);
          commit(removeNodesByIds(history.present, new Set(mosaicIdsToRemove)));
          clearNodeSelection();
          setContextMenu(null);
          return;
        }
        if (!selectedId) return;
        if (selectedId === editingTextId) setEditingTextId(null);
        commit(removeNode(history.present, selectedId));
        clearNodeSelection();
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
  }, [container, history, selectedId, selectedMosaicIds, editingTextId]);

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
    if (!editingTextNode) return null;
    const measured = measureTextBlock(
      editingTextDraft || ' ',
      editingTextNode.fontSize,
      editingTextNode.fontFamily,
      (editingTextNode.padding ?? 0) + TEXT_RENDER_PADDING,
      editingTextNode.lineHeight ?? 1.25,
      editingTextNode.fontWeight,
      editingTextNode.fontItalic
    );
    return {
      x: editingTextNode.x * stageScale + stagePosition.x,
      y: editingTextNode.y * stageScale + stagePosition.y,
      width: measured.width * stageScale,
      height: measured.height * stageScale
    };
  }, [editingTextNode, editingTextDraft, stageScale, stagePosition.x, stagePosition.y]);

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
              ref={(n) => {
                stageTransformGroupRef.current = n;
              }}
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
                listening={false}
                draggable={false}
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
            </Group>
            {/* Multi-select group drag handle (below mosaic tiles so selected tiles stay draggable) */}
            {selectedMosaicIds.length > 1 && transformMode !== 'crop' && !bgDragMode
              ? (() => {
                  const union = unionMosaicBounds(history.present, selectedMosaicIds);
                  if (!union) return null;
                  return (
                    <Rect
                      key="mosaic_multi_drag_box"
                      name="mosaic_multi_drag_box"
                      x={union.x}
                      y={union.y}
                      width={union.width}
                      height={union.height}
                      fill="rgba(76,159,254,0.1)"
                      stroke="rgba(76,159,254,0.85)"
                      strokeWidth={1.5}
                      dash={[6, 4]}
                      hitStrokeWidth={20}
                      listening={true}
                      draggable={true}
                      onClick={(ev) => {
                        ev.cancelBubble = true;
                      }}
                      onDragStart={() => handleMosaicGroupDragStart(union.x, union.y)}
                      onDragMove={handleMosaicGroupDragMove}
                      onDragEnd={handleMosaicGroupDragEnd}
                    />
                  );
                })()
              : null}
            {/* Render mosaics above background, but below arrow/text layer */}
            {mosaicNodesInOrder.map((n) => {
                const isThisMosaicSelected =
                  selectedMosaicSet.has(n.id) || (selectedMosaicIds.length === 0 && selectedId === n.id);
                const canDragThisMosaic =
                  transformMode !== 'crop' &&
                  !bgDragMode &&
                  isThisMosaicSelected &&
                  (tool.kind === 'select' || tool.kind === 'mosaic');
                const style = (n as any).style ?? 'pixel';
                const w = history.present.width;
                const h = history.present.height;
                const fallbackSource = bgImage as any;
                const fallbackX = bgOffsetDoc.x;
                const fallbackY = bgOffsetDoc.y;

                const mosaicClipFunc = (ctx: Konva.Context) => {
                  if (n.kind === 'mosaicRect') {
                    ctx.rect(n.x, n.y, n.width, n.height);
                    return;
                  }
                  ctx.beginPath();
                  const br = n.brushSize / 2;
                  for (const p of n.points) {
                    ctx.moveTo(p.x + br, p.y);
                    ctx.arc(p.x, p.y, br, 0, Math.PI * 2);
                  }
                };

                if (style === 'blur') {
                  const radius = ((n as any).blurRadius as number | undefined) ?? 6;
                  const img = pickNearestCachedMosaicImage(radius, blurCache, baseSnapshotKey);
                  return (
                    <Group
                      key={n.id}
                      id={n.id}
                      ref={(node) => {
                        if (node) mosaicGroupNodeRefs.current.set(n.id, node);
                        else mosaicGroupNodeRefs.current.delete(n.id);
                      }}
                      listening={transformMode !== 'crop'}
                      draggable={canDragThisMosaic}
                      onClick={(ev) => {
                        ev.cancelBubble = true;
                        onSelectMosaicNode(n.id, !!(ev.evt as MouseEvent).shiftKey);
                      }}
                      onContextMenu={(ev) => {
                        ev.evt.preventDefault();
                        const pos = stageRef.current?.getPointerPosition();
                        if (!pos) return;
                        if (!selectedMosaicSet.has(n.id) && selectedMosaicIds.length === 0) {
                          onSelectMosaicNode(n.id, false);
                        }
                        setContextMenu({ x: pos.x, y: pos.y, nodeId: n.id, kind: 'mosaic' });
                      }}
                      onDragStart={() => handleMosaicDragStart(n.id)}
                      onDragMove={(ev) => handleMosaicDragMove(n.id, ev)}
                      onDragEnd={(ev) => handleMosaicDragEnd(n.id, ev)}
                      clipFunc={mosaicClipFunc}
                    >
                      {mosaicHitNode(n)}
                      <KonvaImage image={img ?? fallbackSource} x={fallbackX} y={fallbackY} width={w} height={h} listening={false} />
                    </Group>
                  );
                }

                const size = (n as any).pixelSize as number;
                const img = pickNearestCachedMosaicImage(size, pixelCache, baseSnapshotKey);
                return (
                  <Group
                    key={n.id}
                    id={n.id}
                    ref={(node) => {
                      if (node) mosaicGroupNodeRefs.current.set(n.id, node);
                      else mosaicGroupNodeRefs.current.delete(n.id);
                    }}
                    listening={transformMode !== 'crop'}
                    draggable={canDragThisMosaic}
                    onClick={(ev) => {
                      ev.cancelBubble = true;
                      onSelectMosaicNode(n.id, !!(ev.evt as MouseEvent).shiftKey);
                    }}
                    onContextMenu={(ev) => {
                      ev.evt.preventDefault();
                      const pos = stageRef.current?.getPointerPosition();
                      if (!pos) return;
                      if (!selectedMosaicSet.has(n.id) && selectedMosaicIds.length === 0) {
                        onSelectMosaicNode(n.id, false);
                      }
                      setContextMenu({ x: pos.x, y: pos.y, nodeId: n.id, kind: 'mosaic' });
                    }}
                    onDragStart={() => handleMosaicDragStart(n.id)}
                    onDragMove={(ev) => handleMosaicDragMove(n.id, ev)}
                    onDragEnd={(ev) => handleMosaicDragEnd(n.id, ev)}
                    clipFunc={mosaicClipFunc}
                  >
                    {mosaicHitNode(n)}
                    <KonvaImage image={img ?? fallbackSource} x={fallbackX} y={fallbackY} width={w} height={h} listening={false} />
                  </Group>
                );
              })}

            <Group ref={(n) => (annotationChromeGroupRef.current = n)}>
              {/* Mosaic selection box (tight bounds) */}
              {selectedMosaicIds.map((mid) => {
                const n = history.present.nodes.find((x) => x.id === mid) ?? null;
                if (!n || (n.kind !== 'mosaicRect' && n.kind !== 'mosaicStroke')) return null;
                const b =
                  n.kind === 'mosaicRect'
                    ? { x: n.x, y: n.y, width: n.width, height: n.height }
                    : strokeBounds(n);
                return (
                  <Rect
                    key={`mos_sel_${mid}`}
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
              })}

              {/* Auto-detect hint boxes */}
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
                  listening={transformMode !== 'crop'}
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    toggleDetectedRegion(r.id);
                  }}
                />
              ))}
            </Group>

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
                  opacity={a.opacity ?? 1}
                  {...arrowKonvaShadowProps(a.shadow)}
                  strokeScaleEnabled={false}
                  pointerLength={a.pointerLength}
                  pointerWidth={a.pointerWidth}
                  tension={disp.tension}
                  lineCap="round"
                  lineJoin="round"
                  onMouseDown={(e) => {
                    if (tool.kind !== 'arrow' && tool.kind !== 'text') return;
                    e.cancelBubble = true;
                    onSelectNode(a.id);
                  }}
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    onSelectNode(a.id);
                  }}
                  onDblClick={(ev) => {
                    ev.cancelBubble = true;
                    requestAnnotationEdit('arrow', a.id);
                  }}
                  onContextMenu={(ev) => {
                    ev.evt.preventDefault();
                    const pos = stageRef.current?.getPointerPosition();
                    if (!pos) return;
                    onSelectNode(a.id);
                    setContextMenu({ x: pos.x, y: pos.y, nodeId: a.id, kind: 'arrow' });
                  }}
                  hitStrokeWidth={Math.max(24, a.strokeWidth * 3)}
                  listening={transformMode !== 'crop'}
                  draggable={
                    transformMode !== 'crop' &&
                    !(a as any).locked &&
                    (tool.kind === 'select' || (selectedId === a.id && (tool.kind === 'arrow' || tool.kind === 'text')))
                  }
                  onTransformEnd={(e) => {
                    markSuppressStageSelectionClear();
                    commitArrowTransformEnd(a.id, e.target as Konva.Arrow);
                  }}
                  onDragEnd={(e) => {
                    const n = e.target;
                    const dx = n.x();
                    const dy = n.y();
                    n.position({ x: 0, y: 0 });
                    if (Math.abs(dx) >= 0.01 || Math.abs(dy) >= 0.01) markSuppressStageSelectionClear();
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
                  <Group key={`clip_top_${a.id}`} clipFunc={rectUnionClipFunc((a as any).clipRects)} listening={true}>
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
                  fontStyle={konvaFontStyle(t)}
                  textDecoration={konvaTextDecoration(t)}
                  fill={t.fill}
                  padding={(t.padding ?? 0) + TEXT_RENDER_PADDING}
                  width={textKonvaWidth(t)}
                  height={isEmpty ? minHeight : undefined}
                  wrap={textKonvaWrap(t)}
                  align={t.align ?? 'left'}
                  lineHeight={t.lineHeight ?? 1.25}
                  letterSpacing={t.letterSpacing ?? 0}
                  visible={t.id !== editingTextId}
                  onMouseDown={(e) => {
                    if (tool.kind !== 'arrow' && tool.kind !== 'text') return;
                    e.cancelBubble = true;
                    onSelectNode(t.id);
                  }}
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    onSelectNode(t.id);
                  }}
                  onDblClick={(ev) => {
                    ev.cancelBubble = true;
                    requestAnnotationEdit('text', t.id, () => startEditingText(t.id));
                  }}
                  onContextMenu={(ev) => {
                    ev.evt.preventDefault();
                    const pos = stageRef.current?.getPointerPosition();
                    if (!pos) return;
                    onSelectNode(t.id);
                    setContextMenu({ x: pos.x, y: pos.y, nodeId: t.id, kind: 'text' });
                  }}
                  listening={transformMode !== 'crop'}
                  draggable={
                    transformMode !== 'crop' &&
                    !editingTextId &&
                    !(t as any).locked &&
                    (tool.kind === 'select' || (selectedId === t.id && (tool.kind === 'arrow' || tool.kind === 'text')))
                  }
                  onDragEnd={(e) => {
                    const n = e.target;
                    if (Math.abs(n.x() - t.x) >= 0.01 || Math.abs(n.y() - t.y) >= 0.01) {
                      markSuppressStageSelectionClear();
                    }
                    commit(
                      updateNode(historyRef.current.present, t.id, { x: n.x(), y: n.y(), layer: 'top', locked: false } as any)
                    );
                  }}
                  onTransformEnd={(e) => {
                    markSuppressStageSelectionClear();
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

            {renderCropSelectionOverlay()}

            <Transformer
              ref={(n) => (transformerRef.current = n)}
              rotateEnabled={false}
              keepRatio={false}
              visible={!ocrRegionPickActive}
              onTransformStart={markSuppressStageSelectionClear}
              onTransformEnd={markSuppressStageSelectionClear}
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

            {ocrRegionPickActive ? (
              <Group listening={true}>
                <Rect
                  x={0}
                  y={0}
                  width={history.present.width}
                  height={history.present.height}
                  fill="rgba(76,159,254,0.06)"
                  stroke="rgba(76,159,254,0.35)"
                  strokeWidth={1}
                  dash={[8, 6]}
                  listening={true}
                  onMouseDown={(e) => {
                    e.cancelBubble = true;
                    const docPos = getPointerInDocument();
                    if (!docPos) return;
                    startOcrRegionPickDrag(docPos);
                  }}
                />
                {ocrRegionPickPreview ? (
                  <Rect
                    x={ocrRegionPickPreview.x}
                    y={ocrRegionPickPreview.y}
                    width={ocrRegionPickPreview.width}
                    height={ocrRegionPickPreview.height}
                    stroke="rgba(76,159,254,0.95)"
                    strokeWidth={2}
                    dash={[6, 4]}
                    fill="rgba(76,159,254,0.18)"
                    listening={false}
                  />
                ) : null}
              </Group>
            ) : null}
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
            onBlur={() => {
              if (ignoreTextBlurRef.current) {
                ignoreTextBlurRef.current = false;
                return;
              }
              finishTextEditing();
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Escape') {
                ev.preventDefault();
                finishTextEditing();
              }
            }}
            style={{
              position: 'absolute',
              left: editingTextRect.x,
              top: editingTextRect.y,
              zIndex: 5,
              minWidth: 120,
              width: Math.max(120, editingTextRect.width + 12),
              minHeight: 28,
              height: Math.max(28, editingTextRect.height + 8),
              padding: 6,
              borderRadius: 4,
              border: '1px solid rgba(76,159,254,0.9)',
              outline: 'none',
              resize: 'none',
              background: 'rgba(0,0,0,0.08)',
              color: editingTextNode.fill,
              fontSize: editingTextNode.fontSize * stageScale,
              fontFamily: editingTextNode.fontFamily,
              fontWeight: editingTextNode.fontWeight === 'bold' || editingTextNode.fontWeight === 700 ? 'bold' : 'normal',
              fontStyle: editingTextNode.fontItalic ? 'italic' : 'normal',
              textDecoration: editingTextNode.underline ? 'underline' : 'none',
              textAlign: editingTextNode.align ?? 'left',
              lineHeight: editingTextNode.lineHeight ?? 1.25,
              whiteSpace: 'pre-wrap',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              writingMode: 'horizontal-tb'
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
              onClick={() => {
                if (contextMenu.kind === 'mosaic') removeSelectedMosaics();
                else deleteNodeById(contextMenu.nodeId);
              }}
            >
              删除
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
});

