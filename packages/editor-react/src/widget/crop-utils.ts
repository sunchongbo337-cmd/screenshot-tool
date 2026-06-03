export type CropShapeKind = 'rect' | 'roundRect' | 'circle' | 'freehand';

export type CropBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CropSelection = {
  shape: CropShapeKind;
  box: CropBox;
  /** Used when shape is roundRect (document pixels). */
  cornerRadius?: number;
  /** Used when shape is freehand (document pixels). */
  freehandPoints?: Array<{ x: number; y: number }>;
};

export type CropOptions = {
  shape: CropShapeKind;
  cornerRadius: number;
};

export const DEFAULT_CROP_OPTIONS: CropOptions = {
  shape: 'rect',
  cornerRadius: 24
};

export function normalizeRect(
  a: { x: number; y: number },
  b: { x: number; y: number }
): CropBox {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const width = Math.abs(a.x - b.x);
  const height = Math.abs(a.y - b.y);
  return { x, y, width, height };
}

/** Rect/roundRect drag: keep `start` as a fixed corner (matches freehand pointer trail). */
export function rectBoxFromDrag(
  start: { x: number; y: number },
  end: { x: number; y: number },
  minSize = 1
): CropBox {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const width = Math.max(minSize, Math.abs(dx));
  const height = Math.max(minSize, Math.abs(dy));
  const x = dx >= 0 ? start.x : start.x - width;
  const y = dy >= 0 ? start.y : start.y - height;
  return { x, y, width, height };
}

/** Drag from center-to-edge: start = center, current = edge → circle through both points. */
export function circleBoxFromDrag(
  a: { x: number; y: number },
  b: { x: number; y: number },
  minDiameter = 4
): CropBox {
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const diameter = Math.max(minDiameter, Math.hypot(dx, dy));
  const r = diameter / 2;
  return { x: cx - r, y: cy - r, width: diameter, height: diameter };
}

export function cropBoxFromPointerDrag(
  start: { x: number; y: number },
  end: { x: number; y: number },
  shape: CropShapeKind,
  minSize = 1
): CropBox {
  if (shape === 'circle') return circleBoxFromDrag(start, end, minSize);
  return rectBoxFromDrag(start, end, minSize);
}

/** Force a square box so ellipse render/export is a true circle. */
export function toCircleBox(box: CropBox): CropBox {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const r = Math.max(2, Math.min(box.width, box.height) / 2);
  const d = r * 2;
  return { x: cx - r, y: cy - r, width: d, height: d };
}

export function boundsFromPoints(points: readonly { x: number; y: number }[]): CropBox {
  if (points.length === 0) return { x: 0, y: 0, width: 1, height: 1 };
  let minX = points[0]!.x;
  let minY = points[0]!.y;
  let maxX = minX;
  let maxY = minY;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function pointInPolygon(p: { x: number; y: number }, poly: readonly { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i]!.x;
    const yi = poly[i]!.y;
    const xj = poly[j]!.x;
    const yj = poly[j]!.y;
    const intersect = yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function pointInCropSelection(
  p: { x: number; y: number },
  sel: CropSelection
): boolean {
  const { box, shape, freehandPoints } = sel;
  if (shape === 'freehand' && freehandPoints && freehandPoints.length > 0) {
    if (freehandPoints.length >= 3) return pointInPolygon(p, freehandPoints);
    const b = boundsFromPoints(freehandPoints);
    return p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height;
  }
  if (shape === 'circle') {
    const c = toCircleBox(box);
    const cx = c.x + c.width / 2;
    const cy = c.y + c.height / 2;
    const r = c.width / 2;
    const nx = (p.x - cx) / r;
    const ny = (p.y - cy) / r;
    return nx * nx + ny * ny <= 1;
  }
  return p.x >= box.x && p.x <= box.x + box.width && p.y >= box.y && p.y <= box.y + box.height;
}

export function isCropSelectionValid(sel: CropSelection | null | undefined): sel is CropSelection {
  if (!sel) return false;
  return sel.box.width >= 4 && sel.box.height >= 4;
}

/** Clamp crop box into a bounds rect by trimming edges (does not jump away from pointer path). */
export function clampCropBoxToBounds(
  box: CropBox,
  bounds: CropBox,
  minSize = 4
): CropBox | null {
  const bx = bounds.x;
  const by = bounds.y;
  const bx2 = bounds.x + bounds.width;
  const by2 = bounds.y + bounds.height;
  if (bounds.width <= 0 || bounds.height <= 0) return null;

  let { x, y, width, height } = box;
  width = Math.max(minSize, width);
  height = Math.max(minSize, height);

  if (x < bx) {
    width -= bx - x;
    x = bx;
  }
  if (y < by) {
    height -= by - y;
    y = by;
  }
  if (x + width > bx2) width = bx2 - x;
  if (y + height > by2) height = by2 - y;

  if (width < minSize || height < minSize) return null;
  return { x, y, width, height };
}

/** Clamp crop box into document bounds by trimming edges (does not jump away from pointer path). */
export function clampCropBoxToDocument(
  box: CropBox,
  docW: number,
  docH: number,
  minSize = 4
): CropBox | null {
  if (docW <= 0 || docH <= 0) return null;
  return clampCropBoxToBounds(box, { x: 0, y: 0, width: docW, height: docH }, minSize);
}

/** Visible image region within the document (respects background drag offset). */
export function visibleImageBoundsInDocument(
  docW: number,
  docH: number,
  imageWidth: number,
  imageHeight: number,
  offsetX: number,
  offsetY: number
): CropBox {
  const x = Math.max(0, offsetX);
  const y = Math.max(0, offsetY);
  const x2 = Math.min(docW, offsetX + imageWidth);
  const y2 = Math.min(docH, offsetY + imageHeight);
  return {
    x,
    y,
    width: Math.max(1, x2 - x),
    height: Math.max(1, y2 - y)
  };
}

/** Full drawable/export bounds: document frame union background image extent (after drag offset). */
export function exportContentBoundsInDocument(
  docW: number,
  docH: number,
  imageWidth: number,
  imageHeight: number,
  offsetX: number,
  offsetY: number
): CropBox {
  const x0 = Math.min(0, Math.round(offsetX));
  const y0 = Math.min(0, Math.round(offsetY));
  const x1 = Math.max(docW, Math.round(offsetX + imageWidth));
  const y1 = Math.max(docH, Math.round(offsetY + imageHeight));
  return {
    x: x0,
    y: y0,
    width: Math.max(1, x1 - x0),
    height: Math.max(1, y1 - y0)
  };
}

/** Apply shape mask inside an already bbox-cropped canvas (local 0..w, 0..h). */
export function applyCropShapeMask(
  bboxCanvas: HTMLCanvasElement,
  sel: CropSelection,
  docW: number,
  docH: number
): HTMLCanvasElement {
  const { shape, cornerRadius = DEFAULT_CROP_OPTIONS.cornerRadius, freehandPoints } = sel;
  if (shape === 'rect') return bboxCanvas;

  const w = bboxCanvas.width;
  const h = bboxCanvas.height;
  const fx = w / Math.max(1, sel.box.width);
  const fy = h / Math.max(1, sel.box.height);

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d');
  if (!ctx) return bboxCanvas;

  ctx.drawImage(bboxCanvas, 0, 0);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = '#000';
  ctx.beginPath();

  switch (shape) {
    case 'roundRect':
      roundRectPath(ctx, 0, 0, w, h, Math.min(cornerRadius * Math.min(fx, fy), w / 2, h / 2));
      break;
    case 'circle': {
      const r = Math.min(w, h) / 2;
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      break;
    }
    case 'freehand': {
      const pts = freehandPoints ?? [];
      if (pts.length < 3) {
        ctx.rect(0, 0, w, h);
        break;
      }
      const ox = sel.box.x;
      const oy = sel.box.y;
      ctx.moveTo((pts[0]!.x - ox) * fx, (pts[0]!.y - oy) * fy);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo((pts[i]!.x - ox) * fx, (pts[i]!.y - oy) * fy);
      }
      ctx.closePath();
      break;
    }
    default:
      ctx.rect(0, 0, w, h);
  }
  ctx.fill();
  return out;
}
