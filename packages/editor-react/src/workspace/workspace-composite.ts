import type { ImageSource } from '@screenshot/editor-react';
import type { PastedLayer, QueueItem } from './workspace-types.js';

async function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

export async function imageSourceToDataUrl(src: ImageSource): Promise<string> {
  if (src.kind === 'dataUrl') return src.dataUrl;
  if (src.kind === 'blob') {
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error('Failed to read blob'));
      r.readAsDataURL(src.blob);
    });
  }
  const res = await fetch(src.url);
  const blob = await res.blob();
  return await imageSourceToDataUrl({ kind: 'blob', blob });
}

export async function loadImageDimensions(src: ImageSource): Promise<{ width: number; height: number }> {
  const dataUrl = await imageSourceToDataUrl(src);
  const img = await loadHtmlImage(dataUrl);
  return {
    width: img.naturalWidth || img.width || 1,
    height: img.naturalHeight || img.height || 1
  };
}

export type CompositeResult = {
  dataUrl: string;
  width: number;
  height: number;
};

export async function compositeQueueItem(item: QueueItem): Promise<CompositeResult> {
  const baseUrl = await imageSourceToDataUrl(item.image);
  const baseImg = await loadHtmlImage(baseUrl);
  const width = baseImg.naturalWidth || baseImg.width || 1;
  const height = baseImg.naturalHeight || baseImg.height || 1;

  if (item.layers.length === 0) {
    return { dataUrl: baseUrl, width, height };
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { dataUrl: baseUrl, width, height };

  ctx.drawImage(baseImg, 0, 0, width, height);
  for (const layer of item.layers) {
    const layerUrl = await imageSourceToDataUrl(layer.image);
    const layerImg = await loadHtmlImage(layerUrl);
    ctx.drawImage(layerImg, layer.x, layer.y, layer.width, layer.height);
  }

  return { dataUrl: canvas.toDataURL('image/png'), width, height };
}

export async function resizeImageDataUrl(
  dataUrl: string,
  newWidth: number,
  newHeight: number,
  antialias: boolean
): Promise<string> {
  const img = await loadHtmlImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(newWidth));
  canvas.height = Math.max(1, Math.round(newHeight));
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.imageSmoothingEnabled = antialias;
  ctx.imageSmoothingQuality = antialias ? 'high' : 'low';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

export async function cropImageDataUrl(
  dataUrl: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const img = await loadHtmlImage(dataUrl);
  const sw = Math.max(1, Math.round(crop.width));
  const sh = Math.max(1, Math.round(crop.height));
  const sx = Math.max(0, Math.round(crop.x));
  const sy = Math.max(0, Math.round(crop.y));
  const canvas = document.createElement('canvas');
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas.toDataURL('image/png');
}

export function createQueueItem(params: {
  name: string;
  image: ImageSource;
  id?: string;
}): QueueItem {
  return {
    id: params.id ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    name: params.name,
    image: params.image,
    layers: [],
    annotations: null
  };
}

export function createPastedLayer(image: ImageSource, canvasW: number, canvasH: number, layerW: number, layerH: number): PastedLayer {
  return {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    image,
    x: Math.max(0, Math.round((canvasW - layerW) / 2)),
    y: Math.max(0, Math.round((canvasH - layerH) / 2)),
    width: layerW,
    height: layerH
  };
}
