import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Tool, ExportOptions } from '@screenshot/editor-core';
import { EditorWidget } from '@screenshot/editor-react';
import type {
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
    onCropApplied?: () => void;
    onSelectionChange?: EditorWidgetOptions['onSelectionChange'];
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
  clearCrop(): void;
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
  saveTemplate(): void;
  applyTemplate(): void;
  clearTemplate(): void;
  exportAnnotations(): AnnotationSnapshotV1;
  importAnnotations(snapshot: AnnotationSnapshotV1): void;
  clearAnnotations(): void;
  setBackgroundDragMode(enabled: boolean): void;
  resetBackgroundOffset(): void;
  export(options: ExportOptions): Promise<Blob>;
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
        onCropApplied: params.options?.onCropApplied,
        onSelectionChange: params.options?.onSelectionChange,
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
    applyTextStyle(style) {
      handleRef.current?.applyTextStyle(style);
    },
    applyArrowStyle(style) {
      handleRef.current?.applyArrowStyle(style);
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
    getAuth() {
      return auth;
    },
    destroy() {
      root.unmount();
    }
  };
}

