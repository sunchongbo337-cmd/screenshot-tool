import type { ImageSource } from '@screenshot/editor-react';
import type { AnnotationSnapshotV1 } from '@screenshot/editor-react';

export type PastedLayer = {
  id: string;
  image: ImageSource;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type QueueItem = {
  id: string;
  name: string;
  image: ImageSource;
  /** Clipboard / pasted images as overlay layers (Level-1 workspace). */
  layers: PastedLayer[];
  annotations: AnnotationSnapshotV1 | null;
};

export type ViewMode = 'workspace' | 'editing';
