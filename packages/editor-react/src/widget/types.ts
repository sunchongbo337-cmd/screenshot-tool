import type { ExportOptions, Tool } from '@screenshot/editor-core';
import type { EditorNode } from '@screenshot/editor-core';

export type ImageSource =
  | { kind: 'url'; url: string }
  | { kind: 'dataUrl'; dataUrl: string }
  | { kind: 'blob'; blob: Blob };

export type EditorWidgetOptions = {
  initialTool?: Tool;
  /**
   * Per-image annotation snapshot.
   * Use this for multi-image queue: keep annotations with each image and restore when switching.
   */
  initialAnnotations?: AnnotationSnapshotV1 | null;
  /**
   * Annotation template persistence.
   * Used for medical records where mosaic positions are mostly fixed across images.
   *
   * - When enabled, editor will auto-load the last saved template and apply it to new images.
   * - It will also auto-save template when annotations change (debounced).
   */
  template?: {
    /** Storage key for the template. Use different keys for different document types. */
    key: string;
    /** Default true. Auto-apply template when a new image is loaded. */
    autoApply?: boolean;
    /** Default true. Auto-save template when annotations change. */
    autoSave?: boolean;
  };
  /** Emits template status for UI feedback / debugging. */
  onTemplateEvent?: (ev:
    | { type: 'save'; key: string; nodeCount: number }
    | { type: 'apply'; key: string; nodeCount: number }
    | { type: 'not_found'; key: string }
    | { type: 'cleared'; key: string }
    | { type: 'invalid_key'; key: string }
    | { type: 'error'; key: string; message: string }
  ) => void;
  /**
   * Called when a new text node is created (single click or drag area).
   * Parent can use this to switch active tool/icon back to "select".
   */
  onTextCreated?: () => void;
  /**
   * Called when user finishes a crop selection and the editor replaces the
   * background with the cropped output (like the screenshot crop flow).
   */
  onCropApplied?: () => void;
  onSelectionChange?: (sel:
    | null
    | {
        kind: 'text';
        id: string;
        style: {
          fill: string;
          fontSize: number;
          fontFamily?: string;
          fontWeight?: 'normal' | 'bold' | number;
          align?: 'left' | 'center' | 'right' | 'justify';
          lineHeight?: number;
          letterSpacing?: number;
        };
      }
    | {
        kind: 'arrow';
        id: string;
        style: {
          arrowKind?: 'straight' | 'elbow' | 'curve';
          stroke: string;
          strokeWidth: number;
          pointerSize: number;
        };
      }
  ) => void;
};

export type MosaicRectInput = { x: number; y: number; width: number; height: number };

export type AnnotationSnapshotV1 = {
  version: 1;
  base: { width: number; height: number };
  /** Background image offset in document coordinates (for template alignment). */
  bgOffset?: { x: number; y: number };
  nodes: Array<Omit<EditorNode, 'id' | 'createdAt' | 'updatedAt'>>;
};

export type EditorWidgetHandle = {
  setTool(tool: Tool): void;
  /**
   * Controls additional image-level transforms that affect export/copy/save:
   * - `crop`: let user drag a crop rectangle on the stage; export will crop to it.
   * - `none`: disable crop drag mode (keeps last crop rect if any).
   */
  setTransformMode(mode: 'none' | 'crop'): void;
  /** Clear current crop rectangle. */
  clearCrop(): void;
  /** Reset crop to defaults. */
  resetTransforms(): void;
  addMosaicRects(rects: MosaicRectInput[]): void;
  setDetectedRegions(rects: MosaicRectInput[]): void;
  clearDetectedRegions(): void;
  setAllDetectedRegionsSelected(selected: boolean): void;
  applyDetectedRegionsAsMosaic(options?: { pixelSize?: number; style?: 'pixel' | 'blur'; blurRadius?: number }): void;
  applyTextStyle(style: {
    fill?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | number;
    align?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
  }): void;
  applyArrowStyle(style: {
    arrowKind?: 'straight' | 'elbow' | 'curve';
    stroke?: string;
    strokeWidth?: number;
    pointerSize?: number;
  }): void;
  undo(): void;
  redo(): void;
  /** Save current annotations (mosaic/arrow/text) as a reusable template. */
  saveTemplate(): void;
  /** Apply the last saved template onto the current image (scaled to current size). */
  applyTemplate(): void;
  /** Clear the saved template for current key. */
  clearTemplate(): void;
  /** Export current annotations (for per-image queue restore). */
  exportAnnotations(): AnnotationSnapshotV1;
  /** Replace current annotations with the given snapshot (scaled to current size). */
  importAnnotations(snapshot: AnnotationSnapshotV1): void;
  /** Clear current annotations (mosaic/arrow/text) only. */
  clearAnnotations(): void;
  /** Toggle background drag mode (align template by dragging image only). */
  setBackgroundDragMode(enabled: boolean): void;
  /** Reset background offset to (0,0). */
  resetBackgroundOffset(): void;
  export(options: ExportOptions): Promise<Blob>;
  destroy(): void;
};

