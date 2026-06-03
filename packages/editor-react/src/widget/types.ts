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
    /** replace = clear annotations then apply; merge = keep existing and add template nodes. Default merge. */
    applyMode?: 'replace' | 'merge';
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
  /** Double-click an existing arrow/text: parent opens the style menu and enters edit. */
  onAnnotationEditRequest?: (target: { kind: 'text' | 'arrow'; id: string }) => void;
  /** User finished dragging an OCR detection region on the canvas. */
  onOcrRegionPicked?: (region: MosaicRectInput) => void;
  /** User cancelled OCR region pick (Esc or too-small drag). */
  onOcrRegionPickCancelled?: () => void;
  /**
   * Called when user finishes a crop selection and the editor replaces the
   * background with the cropped output (like the screenshot crop flow).
   */
  onCropApplied?: (result: { dataUrl: string; width: number; height: number }) => void;
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
          fontItalic?: boolean;
          underline?: boolean;
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
          opacity?: number;
          shadow?: boolean;
        };
      }
  ) => void;
  /** Fired when mosaic rect/stroke selection changes (including multi-select). */
  onMosaicSelectionChange?: (sel: { ids: string[]; primaryId: string | null } | null) => void;
};

export type MosaicRectInput = { x: number; y: number; width: number; height: number };

export type { CropShapeKind, CropSelection, CropOptions } from './crop-utils.js';

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
  /** Crop shape: rect, roundRect, circle, freehand. */
  setCropOptions(options: Partial<import('./crop-utils.js').CropOptions>): void;
  getCropOptions(): import('./crop-utils.js').CropOptions;
  /** Clear current crop selection. */
  clearCrop(): void;
  /** Reset crop to defaults. */
  resetTransforms(): void;
  addMosaicRects(rects: MosaicRectInput[]): void;
  setDetectedRegions(rects: MosaicRectInput[]): void;
  clearDetectedRegions(): void;
  setAllDetectedRegionsSelected(selected: boolean): void;
  applyDetectedRegionsAsMosaic(options?: { pixelSize?: number; style?: 'pixel' | 'blur'; blurRadius?: number }): void;
  /**
   * Current document background as a data URL plus sizes for OCR / auto-mosaic.
   * Uses the edited image (e.g. after crop), not necessarily the original file.
   */
  getOcrInput(region?: MosaicRectInput): Promise<{
    dataUrl: string;
    imageWidth: number;
    imageHeight: number;
    docWidth: number;
    docHeight: number;
    regionOffset?: { x: number; y: number };
  }>;
  /** Enter canvas drag mode to pick a rectangle for regional OCR. */
  beginOcrRegionPick(): void;
  cancelOcrRegionPick(): void;
  applyTextStyle(style: {
    fill?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | number;
    fontItalic?: boolean;
    underline?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
  }): void;
  applyArrowStyle(style: {
    arrowKind?: 'straight' | 'elbow' | 'curve';
    stroke?: string;
    strokeWidth?: number;
    pointerSize?: number;
    opacity?: number;
    shadow?: boolean;
  }): void;
  /**
   * Apply mosaic appearance to the current mosaic selection (multi-select supported).
   * Returns true if any mosaic nodes were selected (even when values unchanged).
   * Caller should keep the editor in `select` tool so selection is not cleared.
   */
  applyMosaicStyle(style: {
    pixelSize: number;
    style: 'pixel' | 'blur';
    blurRadius: number;
    brushSize: number;
  }): boolean;
  undo(): void;
  redo(): void;
  /** Save current annotations (mosaic/arrow/text) as a reusable template. */
  saveTemplate(): void;
  /** Apply the last saved template onto the current image (scaled to current size). */
  applyTemplate(): void;
  /** Apply a named template without reloading the editor image. */
  applyTemplateByKey(userKey: string): void;
  /** Clear the saved template for current key. */
  clearTemplate(): void;
  /** Export current annotations (for per-image queue restore). */
  exportAnnotations(): AnnotationSnapshotV1;
  /** Replace current annotations with the given snapshot (scaled to current size). */
  importAnnotations(snapshot: AnnotationSnapshotV1): void;
  /** Clear current annotations (mosaic/arrow/text) only. */
  clearAnnotations(): void;
  /** Toggle background drag mode: `align` moves image only (for template alignment). */
  setBackgroundDragMode(mode: false | 'align'): void;
  /** Reset background offset to (0,0). */
  resetBackgroundOffset(): void;
  export(options: ExportOptions): Promise<Blob>;
  /**
   * Export only the annotation layer (mosaic, arrows, text) at document pixel size.
   * The background image is omitted; empty pixels are transparent — prefer PNG or WebP.
   */
  exportAnnotationsLayer(options: ExportOptions): Promise<Blob>;
  /**
   * Select all mosaics whose vertical span is crossed by the seed mosaic's horizontal midline (same "row").
   * Seed = current mosaic selection (primary `selectedId` if mosaic, else first in multi-select).
   */
  selectMosaicsSameRow(): { ok: boolean; count: number };
  /** Same as row but using vertical midline (same "column"). */
  selectMosaicsSameColumn(): { ok: boolean; count: number };
  /** Delete currently selected mosaic(s). Returns count removed. */
  deleteSelectedMosaics(): { ok: boolean; count: number };
  /**
   * Whether viewport/client coordinates hit an annotation (mosaic, arrow, text) or its transformer.
   * Used by toolbar to close dropdowns only on blank-canvas clicks.
   */
  isPointerOnAnnotationAt(clientX: number, clientY: number): boolean;
  destroy(): void;
};

