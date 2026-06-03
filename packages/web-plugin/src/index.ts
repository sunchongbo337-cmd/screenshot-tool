import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Tool, ExportOptions } from '@screenshot/editor-core';
import { EditorWidget } from '@screenshot/editor-react';
import type {
  CropOptions,
  EditorWidgetHandle,
  EditorWidgetOptions,
  ImageSource,
  MosaicRectInput,
  AnnotationSnapshotV1
} from '@screenshot/editor-react';

export type CreateEditorParams = {
  container: HTMLElement;
  image: ImageSource | { kind: 'file'; file: File } | { kind: 'base64'; base64: string } | { kind: 'url'; url: string };
  options?: {
    initialTool?: Tool;
    initialAnnotations?: EditorWidgetOptions['initialAnnotations'];
    onTextCreated?: () => void;
    onAnnotationEditRequest?: EditorWidgetOptions['onAnnotationEditRequest'];
    onOcrRegionPicked?: EditorWidgetOptions['onOcrRegionPicked'];
    onOcrRegionPickCancelled?: EditorWidgetOptions['onOcrRegionPickCancelled'];
    onCropApplied?: (result?: { dataUrl: string; width: number; height: number }) => void;
    onSelectionChange?: EditorWidgetOptions['onSelectionChange'];
    onMosaicSelectionChange?: EditorWidgetOptions['onMosaicSelectionChange'];
    onTemplateEvent?: EditorWidgetOptions['onTemplateEvent'];
    template?: EditorWidgetOptions['template'];
  };
  auth?: {
    token?: string;
    userId?: string;
  };
};

export type EditorInstance = {
  setTool(tool: Tool): void;
  setTransformMode(mode: 'none' | 'crop'): void;
  setCropOptions(options: Partial<CropOptions>): void;
  getCropOptions(): CropOptions;
  clearCrop(): void;
  resetTransforms(): void;
  addMosaicRects(rects: MosaicRectInput[]): void;
  setDetectedRegions(rects: MosaicRectInput[]): void;
  clearDetectedRegions(): void;
  setAllDetectedRegionsSelected(selected: boolean): void;
  applyDetectedRegionsAsMosaic(options?: { pixelSize?: number; style?: 'pixel' | 'blur'; blurRadius?: number }): void;
  getOcrInput(region?: MosaicRectInput): Promise<{
    dataUrl: string;
    imageWidth: number;
    imageHeight: number;
    docWidth: number;
    docHeight: number;
    regionOffset?: { x: number; y: number };
  }>;
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
  applyMosaicStyle(style: {
    pixelSize: number;
    style: 'pixel' | 'blur';
    blurRadius: number;
    brushSize: number;
  }): boolean;
  isPointerOnAnnotationAt(clientX: number, clientY: number): boolean;
  undo(): void;
  redo(): void;
  saveTemplate(): void;
  applyTemplate(): void;
  applyTemplateByKey(userKey: string): void;
  clearTemplate(): void;
  exportAnnotations(): AnnotationSnapshotV1;
  importAnnotations(snapshot: AnnotationSnapshotV1): void;
  clearAnnotations(): void;
  setBackgroundDragMode(mode: false | 'align'): void;
  resetBackgroundOffset(): void;
  export(options: ExportOptions): Promise<Blob>;
  exportAnnotationsLayer(options: ExportOptions): Promise<Blob>;
  selectMosaicsSameRow(): { ok: boolean; count: number };
  selectMosaicsSameColumn(): { ok: boolean; count: number };
  deleteSelectedMosaics(): { ok: boolean; count: number };
  getAuth(): { token?: string; userId?: string } | undefined;
  destroy(): void;
};

function normalizeImage(image: CreateEditorParams['image']): ImageSource {
  if ((image as any).kind === 'file') return { kind: 'blob', blob: (image as any).file };
  if ((image as any).kind === 'base64') return { kind: 'dataUrl', dataUrl: (image as any).base64 };
  if ((image as any).kind === 'url') return { kind: 'url', url: (image as any).url };
  return image as ImageSource;
}

export function createEditor(params: CreateEditorParams): EditorInstance {
  const root = createRoot(params.container);
  const handleRef = React.createRef<EditorWidgetHandle>();

  const image = normalizeImage(params.image);
  const auth = params.auth;

  root.render(
    React.createElement(EditorWidget, {
      ref: handleRef,
      container: params.container,
      image,
      options: {
        initialTool: params.options?.initialTool,
        initialAnnotations: params.options?.initialAnnotations,
        onTextCreated: params.options?.onTextCreated,
        onAnnotationEditRequest: params.options?.onAnnotationEditRequest,
        onOcrRegionPicked: params.options?.onOcrRegionPicked,
        onOcrRegionPickCancelled: params.options?.onOcrRegionPickCancelled,
        onCropApplied: params.options?.onCropApplied,
        onSelectionChange: params.options?.onSelectionChange,
        onMosaicSelectionChange: params.options?.onMosaicSelectionChange,
        onTemplateEvent: params.options?.onTemplateEvent,
        template: params.options?.template
      }
    })
  );

  return {
    setTool(tool) {
      handleRef.current?.setTool(tool);
    },
    setTransformMode(mode) {
      handleRef.current?.setTransformMode(mode);
    },
    setCropOptions(options) {
      handleRef.current?.setCropOptions(options);
    },
    getCropOptions() {
      return handleRef.current?.getCropOptions() ?? { shape: 'rect', cornerRadius: 24 };
    },
    clearCrop() {
      handleRef.current?.clearCrop();
    },
    resetTransforms() {
      handleRef.current?.resetTransforms();
    },
    addMosaicRects(rects) {
      handleRef.current?.addMosaicRects(rects);
    },
    setDetectedRegions(rects) {
      handleRef.current?.setDetectedRegions(rects);
    },
    clearDetectedRegions() {
      handleRef.current?.clearDetectedRegions();
    },
    setAllDetectedRegionsSelected(selected) {
      handleRef.current?.setAllDetectedRegionsSelected(selected);
    },
    applyDetectedRegionsAsMosaic(options) {
      handleRef.current?.applyDetectedRegionsAsMosaic(options);
    },
    async getOcrInput(region) {
      if (!handleRef.current) throw new Error('Editor not ready');
      return handleRef.current.getOcrInput(region);
    },
    beginOcrRegionPick() {
      handleRef.current?.beginOcrRegionPick();
    },
    cancelOcrRegionPick() {
      handleRef.current?.cancelOcrRegionPick();
    },
    applyTextStyle(style) {
      handleRef.current?.applyTextStyle(style);
    },
    applyArrowStyle(style) {
      handleRef.current?.applyArrowStyle(style);
    },
    applyMosaicStyle(style) {
      return handleRef.current?.applyMosaicStyle(style) ?? false;
    },
    isPointerOnAnnotationAt(clientX, clientY) {
      return handleRef.current?.isPointerOnAnnotationAt(clientX, clientY) ?? false;
    },
    undo() {
      handleRef.current?.undo();
    },
    redo() {
      handleRef.current?.redo();
    },
    saveTemplate() {
      handleRef.current?.saveTemplate();
    },
    applyTemplate() {
      handleRef.current?.applyTemplate();
    },
    applyTemplateByKey(userKey: string) {
      handleRef.current?.applyTemplateByKey(userKey);
    },
    clearTemplate() {
      handleRef.current?.clearTemplate();
    },
    exportAnnotations() {
      if (!handleRef.current) throw new Error('Editor not ready');
      return handleRef.current.exportAnnotations();
    },
    importAnnotations(snapshot) {
      handleRef.current?.importAnnotations(snapshot);
    },
    clearAnnotations() {
      handleRef.current?.clearAnnotations();
    },
    setBackgroundDragMode(enabled) {
      handleRef.current?.setBackgroundDragMode(enabled);
    },
    resetBackgroundOffset() {
      handleRef.current?.resetBackgroundOffset();
    },
    export(options) {
      if (!handleRef.current) throw new Error('Editor not ready');
      return handleRef.current.export(options);
    },
    exportAnnotationsLayer(options) {
      if (!handleRef.current) throw new Error('Editor not ready');
      return handleRef.current.exportAnnotationsLayer(options);
    },
    selectMosaicsSameRow() {
      if (!handleRef.current) throw new Error('Editor not ready');
      return handleRef.current.selectMosaicsSameRow();
    },
    selectMosaicsSameColumn() {
      if (!handleRef.current) throw new Error('Editor not ready');
      return handleRef.current.selectMosaicsSameColumn();
    },
    deleteSelectedMosaics() {
      if (!handleRef.current) throw new Error('Editor not ready');
      return handleRef.current.deleteSelectedMosaics();
    },
    getAuth() {
      return auth;
    },
    destroy() {
      root.unmount();
    }
  };
}

export {
  installWebRegionCaptureHotkey,
  startWebRegionCapture,
  startJsWebScreenShotCapture,
  JsWebScreenShotCancelledError,
  JsWebScreenShotClosedError,
  buildDisplayMediaCaptureConfig
} from '@screenshot/editor-react';
export type { WebRegionCaptureHotkeyOptions, JsWebScreenShotStartOptions } from '@screenshot/editor-react';
export {
  DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT,
  DEFAULT_HOTKEY_WEB_REGION_CAPTURE
} from '@screenshot/editor-core';
