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

