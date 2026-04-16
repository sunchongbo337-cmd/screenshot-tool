import type { ExportOptions, ExportFormat } from './types.js';

function toMime(format: ExportFormat): string {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
  }
}

export async function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  options: ExportOptions
): Promise<Blob> {
  const mime = toMime(options.format);
  const quality = options.quality;

  return await new Promise<Blob>((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob returned null'));
            return;
          }
          resolve(blob);
        },
        mime,
        quality
      );
    } catch (e) {
      reject(e);
    }
  });
}

