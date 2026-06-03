import { createId } from './id.js';
import type {
  ArrowNode,
  EditorDocument,
  EditorNode,
  MosaicRectNode,
  MosaicStrokeNode,
  TextNode
} from './types.js';

let lastTs = 0;
function monotonicNow(): number {
  const t = Date.now();
  lastTs = t > lastTs ? t : lastTs + 1;
  return lastTs;
}

export function createEmptyDocument(params: {
  width: number;
  height: number;
  backgroundSrc: string;
}): EditorDocument {
  return {
    version: 1,
    width: params.width,
    height: params.height,
    background: { kind: 'image', src: params.backgroundSrc },
    nodes: []
  };
}

export function addMosaicRect(
  doc: EditorDocument,
  rect: Omit<MosaicRectNode, keyof { id: never; kind: never; createdAt: never; updatedAt: never }>
): EditorDocument {
  const now = monotonicNow();
  const node: MosaicRectNode = {
    id: createId('mosaic'),
    kind: 'mosaicRect',
    createdAt: now,
    updatedAt: now,
    ...rect
  };
  return { ...doc, nodes: [...doc.nodes, node] };
}

export function addMosaicStroke(
  doc: EditorDocument,
  stroke: Omit<MosaicStrokeNode, keyof { id: never; kind: never; createdAt: never; updatedAt: never }>
): EditorDocument {
  const now = monotonicNow();
  const node: MosaicStrokeNode = {
    id: createId('mosaicStroke'),
    kind: 'mosaicStroke',
    createdAt: now,
    updatedAt: now,
    ...stroke
  };
  return { ...doc, nodes: [...doc.nodes, node] };
}

export function addArrow(
  doc: EditorDocument,
  arrow: Omit<ArrowNode, keyof { id: never; kind: never; createdAt: never; updatedAt: never }>
): EditorDocument {
  const now = monotonicNow();
  const node: ArrowNode = {
    id: createId('arrow'),
    kind: 'arrow',
    createdAt: now,
    updatedAt: now,
    layer: (arrow as any).layer ?? 'top',
    locked: (arrow as any).locked ?? false,
    ...arrow
  };
  return { ...doc, nodes: [...doc.nodes, node] };
}

export function addText(
  doc: EditorDocument,
  text: Omit<TextNode, keyof { id: never; kind: never; createdAt: never; updatedAt: never }>
): EditorDocument {
  const now = monotonicNow();
  const node: TextNode = {
    id: createId('text'),
    kind: 'text',
    createdAt: now,
    updatedAt: now,
    layer: (text as any).layer ?? 'top',
    locked: (text as any).locked ?? false,
    ...text
  };
  return { ...doc, nodes: [...doc.nodes, node] };
}

export function updateNode(
  doc: EditorDocument,
  nodeId: string,
  patch: Partial<EditorNode>
): EditorDocument {
  const now = monotonicNow();
  return {
    ...doc,
    nodes: doc.nodes.map((n) => (n.id === nodeId ? ({ ...n, ...patch, updatedAt: now } as EditorNode) : n))
  };
}

export function removeNode(doc: EditorDocument, nodeId: string): EditorDocument {
  return { ...doc, nodes: doc.nodes.filter((n) => n.id !== nodeId) };
}

export function removeNodesByIds(doc: EditorDocument, ids: ReadonlySet<string>): EditorDocument {
  if (ids.size === 0) return doc;
  return { ...doc, nodes: doc.nodes.filter((n) => !ids.has(n.id)) };
}

type CropRect = { x: number; y: number; width: number; height: number };

function intersectCropRect(node: CropRect, crop: CropRect): CropRect | null {
  const x0 = Math.max(node.x, crop.x);
  const y0 = Math.max(node.y, crop.y);
  const x1 = Math.min(node.x + node.width, crop.x + crop.width);
  const y1 = Math.min(node.y + node.height, crop.y + crop.height);
  if (x1 <= x0 || y1 <= y0) return null;
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

function pointInsideCrop(p: { x: number; y: number }, crop: CropRect) {
  return p.x >= crop.x && p.x <= crop.x + crop.width && p.y >= crop.y && p.y <= crop.y + crop.height;
}

function strokeIntersectsCrop(points: Array<{ x: number; y: number }>, brushSize: number, crop: CropRect): boolean {
  const pad = brushSize / 2;
  const expanded = {
    x: crop.x - pad,
    y: crop.y - pad,
    width: crop.width + pad * 2,
    height: crop.height + pad * 2
  };
  return points.some((p) => pointInsideCrop(p, expanded));
}

function translateClipRects(
  rects: Array<{ x: number; y: number; width: number; height: number }> | undefined,
  dx: number,
  dy: number
) {
  if (!rects) return undefined;
  return rects.map((r) => ({ ...r, x: r.x + dx, y: r.y + dy }));
}

/** Shift all annotation nodes by `(dx, dy)` in document coordinates. */
export function translateDocumentNodes(doc: EditorDocument, dx: number, dy: number): EditorDocument {
  if (dx === 0 && dy === 0) return doc;
  const nodes = doc.nodes.map((n): EditorNode => {
    if (n.kind === 'mosaicRect') {
      return { ...n, x: n.x + dx, y: n.y + dy };
    }
    if (n.kind === 'mosaicStroke') {
      return { ...n, points: n.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) };
    }
    if (n.kind === 'arrow') {
      return {
        ...n,
        points: [
          { x: n.points[0].x + dx, y: n.points[0].y + dy },
          { x: n.points[1].x + dx, y: n.points[1].y + dy }
        ],
        clipRects: translateClipRects(n.clipRects, dx, dy)
      };
    }
    if (n.kind === 'text') {
      return { ...n, x: n.x + dx, y: n.y + dy, clipRects: translateClipRects(n.clipRects, dx, dy) };
    }
    return n;
  });
  return { ...doc, nodes };
}

/** Shift and clip annotation nodes when cropping the document to `crop` (document coords). */
export function cropDocumentToRegion(doc: EditorDocument, crop: CropRect): EditorDocument {
  const { x: ox, y: oy, width: cw, height: ch } = crop;
  const nodes: EditorNode[] = [];

  for (const n of doc.nodes) {
    if (n.kind === 'mosaicRect') {
      const clipped = intersectCropRect(n, crop);
      if (!clipped) continue;
      nodes.push({
        ...n,
        x: clipped.x - ox,
        y: clipped.y - oy,
        width: clipped.width,
        height: clipped.height
      });
      continue;
    }

    if (n.kind === 'mosaicStroke') {
      if (!strokeIntersectsCrop(n.points, n.brushSize, crop)) continue;
      const points = n.points
        .filter((p) => pointInsideCrop(p, crop))
        .map((p) => ({ x: p.x - ox, y: p.y - oy }));
      if (points.length === 0) {
        // Keep at least one point so partial brush strokes inside crop remain visible.
        const firstInside = n.points.find((p) => pointInsideCrop(p, crop));
        if (!firstInside) continue;
        points.push({ x: firstInside.x - ox, y: firstInside.y - oy });
      }
      nodes.push({ ...n, points });
      continue;
    }

    if (n.kind === 'arrow') {
      const [a, b] = n.points;
      const ax = a.x - ox;
      const ay = a.y - oy;
      const bx = b.x - ox;
      const by = b.y - oy;
      const aIn = ax >= 0 && ay >= 0 && ax <= cw && ay <= ch;
      const bIn = bx >= 0 && by >= 0 && bx <= cw && by <= ch;
      if (!aIn && !bIn) continue;
      nodes.push({
        ...n,
        points: [
          { x: clampPoint(ax, cw), y: clampPoint(ay, ch) },
          { x: clampPoint(bx, cw), y: clampPoint(by, ch) }
        ]
      });
      continue;
    }

    if (n.kind === 'text') {
      if (!pointInsideCrop({ x: n.x, y: n.y }, crop)) continue;
      nodes.push({ ...n, x: n.x - ox, y: n.y - oy });
    }
  }

  return { ...doc, width: cw, height: ch, nodes };
}

function clampPoint(v: number, max: number) {
  return Math.max(0, Math.min(max, v));
}

