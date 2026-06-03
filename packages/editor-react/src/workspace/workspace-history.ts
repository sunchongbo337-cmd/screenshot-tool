import type { AnnotationSnapshotV1, ImageSource } from '@screenshot/editor-react';
import type { PastedLayer } from './workspace-types.js';

export type WorkspaceSnapshot = {
  image: ImageSource;
  layers: PastedLayer[];
  annotations: AnnotationSnapshotV1 | null;
};

export function cloneWorkspaceSnapshot(item: {
  image: ImageSource;
  layers: PastedLayer[];
  annotations: AnnotationSnapshotV1 | null;
}): WorkspaceSnapshot {
  return {
    image: item.image,
    layers: item.layers.map((l) => ({ ...l, image: l.image })),
    annotations: item.annotations ? (structuredClone(item.annotations) as AnnotationSnapshotV1) : null
  };
}

type Stacks = { undo: WorkspaceSnapshot[]; redo: WorkspaceSnapshot[] };

export function createWorkspaceHistoryStore() {
  const byItemId = new Map<string, Stacks>();

  function stacks(itemId: string): Stacks {
    let s = byItemId.get(itemId);
    if (!s) {
      s = { undo: [], redo: [] };
      byItemId.set(itemId, s);
    }
    return s;
  }

  return {
    pushUndo(itemId: string, snapshot: WorkspaceSnapshot) {
      const s = stacks(itemId);
      s.undo.push(snapshot);
      s.redo = [];
    },
    undo(itemId: string, current: WorkspaceSnapshot): WorkspaceSnapshot | null {
      const s = stacks(itemId);
      if (s.undo.length === 0) return null;
      s.redo.push(current);
      return s.undo.pop() ?? null;
    },
    redo(itemId: string, current: WorkspaceSnapshot): WorkspaceSnapshot | null {
      const s = stacks(itemId);
      if (s.redo.length === 0) return null;
      s.undo.push(current);
      return s.redo.pop() ?? null;
    },
    canUndo(itemId: string) {
      return (byItemId.get(itemId)?.undo.length ?? 0) > 0;
    },
    canRedo(itemId: string) {
      return (byItemId.get(itemId)?.redo.length ?? 0) > 0;
    },
    clear(itemId: string) {
      byItemId.delete(itemId);
    }
  };
}
