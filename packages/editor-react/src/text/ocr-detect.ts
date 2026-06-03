export type OcrBBox = { x0: number; y0: number; x1: number; y1: number };

export type OcrDetectGroupMode = 'char' | 'merged';

export type OcrDetectRect = { x: number; y: number; width: number; height: number };

export type CollectTextBboxesOptions = {
  padding?: number;
  minConfidence?: number;
  /** `char` = one mosaic per character; `merged` = merge adjacent text on same line. */
  groupMode?: OcrDetectGroupMode;
  /** Preprocessed OCR image size (for filtering block-level false positives). */
  imageWidth?: number;
  imageHeight?: number;
};

export type OcrRecognizeConfig = {
  workerPath: string;
  corePath: string;
};

export type OcrInputSlice = {
  dataUrl: string;
  imageWidth: number;
  imageHeight: number;
  docWidth: number;
  docHeight: number;
  regionOffset?: { x: number; y: number };
};

export type TesseractWorkerLike = {
  recognize: (image: string) => Promise<{ data: TesseractData }>;
  setParameters: (params: Record<string, string | number>) => Promise<void>;
  terminate: () => Promise<void>;
};

export type TesseractModuleLike = {
  createWorker: (
    langs?: string,
    oem?: number,
    options?: { workerPath?: string; corePath?: string }
  ) => Promise<TesseractWorkerLike>;
};

async function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function computeOcrScale(w: number, h: number): number {
  const longEdge = Math.max(w, h);
  const shortEdge = Math.min(w, h);
  let scale = 1;
  if (longEdge < 2400) scale = Math.max(scale, 2400 / longEdge);
  if (shortEdge < 1200) scale = Math.max(scale, 1200 / shortEdge);
  if (longEdge < 1600) scale = Math.max(scale, 2);
  return Math.min(scale, 4);
}

function stretchContrastPx(px: Uint8ClampedArray, channels: 1 | 3) {
  let lo = 255;
  let hi = 0;
  for (let i = 0; i < px.length; i += 4) {
    const lum = channels === 1 ? px[i]! : 0.299 * px[i]! + 0.587 * px[i + 1]! + 0.114 * px[i + 2]!;
    if (lum < lo) lo = lum;
    if (lum > hi) hi = lum;
  }
  const span = Math.max(1, hi - lo);
  for (let i = 0; i < px.length; i += 4) {
    if (channels === 1) {
      px[i] = Math.round(((px[i]! - lo) / span) * 255);
      px[i + 1] = px[i]!;
      px[i + 2] = px[i]!;
    } else {
      for (let c = 0; c < 3; c++) {
        px[i + c] = Math.round(((px[i + c]! - lo) / span) * 255);
      }
    }
  }
}

function otsuThreshold(gray: Uint8ClampedArray): number {
  const hist = new Array<number>(256).fill(0);
  for (let i = 0; i < gray.length; i += 4) hist[gray[i]!]!++;
  const total = gray.length / 4;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i]!;
  let sumB = 0;
  let wB = 0;
  let maxVar = 0;
  let threshold = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t]!;
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t]!;
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const varBetween = wB * wF * (mB - mF) * (mB - mF);
    if (varBetween > maxVar) {
      maxVar = varBetween;
      threshold = t;
    }
  }
  return threshold;
}

function renderProcessedCanvas(
  img: HTMLImageElement,
  scale: number,
  mode: 'color' | 'binary'
): HTMLCanvasElement {
  const w = img.naturalWidth || img.width || 1;
  const h = img.naturalHeight || img.height || 1;
  const nw = Math.max(1, Math.round(w * scale));
  const nh = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement('canvas');
  canvas.width = nw;
  canvas.height = nh;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, nw, nh);

  const imgData = ctx.getImageData(0, 0, nw, nh);
  const px = imgData.data;
  if (mode === 'color') {
    stretchContrastPx(px, 3);
  } else {
    for (let i = 0; i < px.length; i += 4) {
      const lum = Math.round(0.299 * px[i]! + 0.587 * px[i + 1]! + 0.114 * px[i + 2]!);
      px[i] = lum;
      px[i + 1] = lum;
      px[i + 2] = lum;
    }
    stretchContrastPx(px, 1);
    const th = otsuThreshold(px);
    for (let i = 0; i < px.length; i += 4) {
      const v = px[i]! >= th ? 255 : 0;
      px[i] = v;
      px[i + 1] = v;
      px[i + 2] = v;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/** Upscale + contrast stretch so small UI text is easier for Tesseract. */
export async function preprocessOcrDataUrl(dataUrl: string): Promise<{ dataUrl: string; scale: number }> {
  const img = await loadHtmlImage(dataUrl);
  const w = img.naturalWidth || img.width || 1;
  const h = img.naturalHeight || img.height || 1;
  const scale = computeOcrScale(w, h);
  const canvas = renderProcessedCanvas(img, scale, 'color');
  return { dataUrl: canvas.toDataURL('image/png'), scale };
}

async function buildOcrVariantDataUrls(dataUrl: string, scale: number): Promise<string[]> {
  const img = await loadHtmlImage(dataUrl);
  const w = img.naturalWidth || img.width || 1;
  const h = img.naturalHeight || img.height || 1;
  const s = scale || computeOcrScale(w, h);
  const color = renderProcessedCanvas(img, s, 'color').toDataURL('image/png');
  const binary = renderProcessedCanvas(img, s, 'binary').toDataURL('image/png');
  return color === binary ? [color] : [color, binary];
}

function bboxToRect(b: OcrBBox, padding: number): OcrDetectRect {
  const x = Math.max(0, b.x0 - padding);
  const y = Math.max(0, b.y0 - padding);
  const width = Math.max(1, b.x1 - b.x0 + padding * 2);
  const height = Math.max(1, b.y1 - b.y0 + padding * 2);
  return { x, y, width, height };
}

function unionBboxes(boxes: OcrBBox[]): OcrBBox {
  return {
    x0: Math.min(...boxes.map((b) => b.x0)),
    y0: Math.min(...boxes.map((b) => b.y0)),
    x1: Math.max(...boxes.map((b) => b.x1)),
    y1: Math.max(...boxes.map((b) => b.y1))
  };
}

function bboxArea(b: OcrBBox) {
  return Math.max(0, b.x1 - b.x0) * Math.max(0, b.y1 - b.y0);
}

function bboxIoU(a: OcrBBox, b: OcrBBox): number {
  const x0 = Math.max(a.x0, b.x0);
  const y0 = Math.max(a.y0, b.y0);
  const x1 = Math.min(a.x1, b.x1);
  const y1 = Math.min(a.y1, b.y1);
  const inter = Math.max(0, x1 - x0) * Math.max(0, y1 - y0);
  if (inter <= 0) return 0;
  return inter / (bboxArea(a) + bboxArea(b) - inter);
}

function dedupeBboxes(boxes: OcrBBox[], iouThreshold = 0.55): OcrBBox[] {
  const sorted = [...boxes].sort((a, b) => bboxArea(b) - bboxArea(a));
  const kept: OcrBBox[] = [];
  for (const box of sorted) {
    if (kept.some((k) => bboxIoU(k, box) >= iouThreshold)) continue;
    kept.push(box);
  }
  return kept;
}

/** Prefer smaller boxes when overlapping — keeps individual glyphs instead of dropping them for word boxes. */
function dedupeBboxesPreferSmaller(boxes: OcrBBox[], iouThreshold = 0.45): OcrBBox[] {
  const sorted = [...boxes].sort((a, b) => bboxArea(a) - bboxArea(b));
  const kept: OcrBBox[] = [];
  for (const box of sorted) {
    if (kept.some((k) => bboxIoU(k, box) >= iouThreshold)) continue;
    kept.push(box);
  }
  return kept;
}

function groupBboxesIntoLines(boxes: OcrBBox[]): OcrBBox[][] {
  if (boxes.length === 0) return [];
  const sorted = [...boxes].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const lines: OcrBBox[][] = [];

  for (const box of sorted) {
    const h = Math.max(1, box.y1 - box.y0);
    const cy = (box.y0 + box.y1) / 2;
    let placed = false;
    for (const line of lines) {
      const ref = line[0]!;
      const rh = Math.max(1, ref.y1 - ref.y0);
      const rcy = (ref.y0 + ref.y1) / 2;
      const threshold = Math.max(h, rh) * 0.65;
      if (Math.abs(cy - rcy) <= threshold) {
        line.push(box);
        placed = true;
        break;
      }
    }
    if (!placed) lines.push([box]);
  }

  for (const line of lines) {
    line.sort((a, b) => a.x0 - b.x0);
  }
  return lines;
}

function isReasonableTextBox(b: OcrBBox, imgW: number, imgH: number): boolean {
  const w = Math.max(1, b.x1 - b.x0);
  const h = Math.max(1, b.y1 - b.y0);
  const imgArea = Math.max(1, imgW * imgH);
  const area = w * h;
  if (area / imgArea > 0.07) return false;
  if (w / Math.max(1, imgW) > 0.55 && h / Math.max(1, imgH) > 0.12) return false;
  if (h / Math.max(1, imgH) > 0.35) return false;
  if (w / Math.max(1, imgW) > 0.85) return false;
  return true;
}

function filterReasonableBoxes(boxes: OcrBBox[], imgW: number, imgH: number): OcrBBox[] {
  if (imgW <= 0 || imgH <= 0) return boxes;
  return boxes.filter((b) => isReasonableTextBox(b, imgW, imgH));
}

function maxMergeWidth(imgW: number): number {
  return Math.max(48, imgW * 0.42);
}

/** Merge horizontally adjacent boxes on the same line (helps CJK symbol chains). */
function mergeAdjacentOnLine(line: OcrBBox[], gapFactor = 1.25, imgW = 0): OcrBBox[] {
  if (line.length === 0) return [];
  const sorted = [...line].sort((a, b) => a.x0 - b.x0);
  const out: OcrBBox[] = [];
  let cur = { ...sorted[0]! };
  const mergeLimit = imgW > 0 ? maxMergeWidth(imgW) : Infinity;

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i]!;
    const curW = Math.max(1, cur.x1 - cur.x0);
    const gap = next.x0 - cur.x1;
    const merged = unionBboxes([cur, next]);
    const mergedW = merged.x1 - merged.x0;
    if (gap <= curW * gapFactor && mergedW <= mergeLimit) {
      cur = merged;
    } else {
      out.push(cur);
      cur = { ...next };
    }
  }
  out.push(cur);
  return out;
}

function normalizeLineHeights(boxes: OcrBBox[], mergeAdjacent: boolean, imgW = 0): OcrBBox[] {
  const lines = groupBboxesIntoLines(boxes);
  const out: OcrBBox[] = [];
  for (const line of lines) {
    const chunks = mergeAdjacent ? mergeAdjacentOnLine(line, 1.25, imgW) : [...line].sort((a, b) => a.x0 - b.x0);
    const heights = chunks.map((b) => Math.max(1, b.y1 - b.y0));
    heights.sort((a, b) => a - b);
    const medianH = heights[Math.floor(heights.length / 2)] ?? heights[0] ?? 12;
    for (const b of chunks) {
      const boxH = Math.max(1, b.y1 - b.y0);
      const targetH = mergeAdjacent ? Math.max(boxH, medianH * 0.9) : Math.max(boxH, medianH * 0.85);
      const cy = (b.y0 + b.y1) / 2;
      const half = targetH / 2;
      out.push({
        x0: b.x0,
        x1: b.x1,
        y0: cy - half,
        y1: cy + half
      });
    }
  }
  return out;
}

function extractBboxesFromItems(
  items: Array<{ bbox?: OcrBBox; confidence?: number; text?: string }> | undefined,
  minConfidence: number
): OcrBBox[] {
  const out: OcrBBox[] = [];
  for (const it of items ?? []) {
    const b = it.bbox;
    if (!b || b.x0 == null || b.y0 == null || b.x1 == null || b.y1 == null) continue;
    if (b.x1 <= b.x0 || b.y1 <= b.y0) continue;
    const conf = it.confidence;
    if (conf != null && conf >= 0 && conf < minConfidence) continue;
    out.push(b);
  }
  return out;
}

function collectMergedModeBoxes(data: TesseractData, minConfidence: number, imgW: number, imgH: number): OcrBBox[] {
  const symbols = filterReasonableBoxes(
    dedupeBboxesPreferSmaller(extractBboxesFromItems(data.symbols, minConfidence), 0.32),
    imgW,
    imgH
  );
  const boxes = [...symbols];
  for (const w of extractBboxesFromItems(data.words, minConfidence)) {
    if (!isReasonableTextBox(w, imgW, imgH)) continue;
    if (boxes.some((s) => bboxIoU(s, w) >= 0.18)) continue;
    boxes.push(w);
  }
  return filterReasonableBoxes(dedupeBboxesPreferSmaller(boxes, 0.38), imgW, imgH);
}

type TesseractData = {
  words?: Array<{ bbox?: OcrBBox; confidence?: number; text?: string }>;
  symbols?: Array<{ bbox?: OcrBBox; confidence?: number; text?: string }>;
  lines?: Array<{ bbox?: OcrBBox; confidence?: number; text?: string }>;
  paragraphs?: Array<{ bbox?: OcrBBox; confidence?: number; text?: string }>;
};

/**
 * Build mosaic candidate rects from Tesseract output.
 * Uses symbols + words for recall; normalizes row height for consistent masks.
 */
export function collectTextBboxesFromTesseract(data: TesseractData, options?: CollectTextBboxesOptions): OcrDetectRect[] {
  const padding = options?.padding ?? 6;
  const minConfidence = options?.minConfidence ?? 0;
  const groupMode = options?.groupMode ?? 'merged';
  const mergeAdjacent = groupMode === 'merged';
  const imgW = options?.imageWidth ?? 0;
  const imgH = options?.imageHeight ?? 0;

  let boxes: OcrBBox[] = [];
  if (groupMode === 'char') {
    boxes = filterReasonableBoxes(
      dedupeBboxesPreferSmaller(extractBboxesFromItems(data.symbols, minConfidence), 0.28),
      imgW,
      imgH
    );
    if (boxes.length < 3) {
      boxes = filterReasonableBoxes(
        dedupeBboxesPreferSmaller(extractBboxesFromItems(data.lines, minConfidence), 0.35),
        imgW,
        imgH
      );
    }
  } else {
    boxes = collectMergedModeBoxes(data, minConfidence, imgW, imgH);
  }

  if (boxes.length === 0) return [];

  const normalized = normalizeLineHeights(boxes, mergeAdjacent, imgW);
  return filterReasonableBoxes(normalized, imgW, imgH).map((b) => bboxToRect(b, padding));
}

export function scaleRectsToDocument(
  rects: OcrDetectRect[],
  docW: number,
  docH: number,
  imgW: number,
  imgH: number
): OcrDetectRect[] {
  const sx = docW / Math.max(1, imgW);
  const sy = docH / Math.max(1, imgH);
  return rects.map((r) => {
    const x = Math.max(0, Math.min(docW - 1, r.x * sx));
    const y = Math.max(0, Math.min(docH - 1, r.y * sy));
    const width = Math.max(1, Math.min(docW - x, r.width * sx));
    const height = Math.max(1, Math.min(docH - y, r.height * sy));
    return { x, y, width, height };
  });
}

export function offsetDetectedRects(rects: OcrDetectRect[], offset?: { x: number; y: number }): OcrDetectRect[] {
  if (!offset) return rects;
  return rects.map((r) => ({ ...r, x: r.x + offset.x, y: r.y + offset.y }));
}

/** Page segmentation modes tried for screenshot / form text. */
export const TESSERACT_OCR_PSM_MODES = ['11', '13', '6'] as const;

export const TESSERACT_OCR_OPTIONS = {
  tessedit_pageseg_mode: '3'
} as const;

export type RecognizeTextRegionsOptions = {
  groupMode?: OcrDetectGroupMode;
};

function rectsToBoxes(rects: OcrDetectRect[]): OcrBBox[] {
  return rects.map((r) => ({ x0: r.x, y0: r.y, x1: r.x + r.width, y1: r.y + r.height }));
}

function mergePassRects(
  all: OcrDetectRect[],
  groupMode: OcrDetectGroupMode,
  padding: number,
  imgW: number,
  imgH: number
): OcrDetectRect[] {
  if (all.length === 0) return [];
  const deduped = filterReasonableBoxes(
    groupMode === 'char'
      ? dedupeBboxesPreferSmaller(rectsToBoxes(all), 0.32)
      : dedupeBboxesPreferSmaller(rectsToBoxes(all), 0.36),
    imgW,
    imgH
  );
  return deduped.map((b) => bboxToRect(b, padding));
}

/**
 * Run Tesseract (multi-PSM when needed) and return document-space mosaic rects.
 */
export async function recognizeTextRegions(
  ocrInput: OcrInputSlice,
  config: OcrRecognizeConfig,
  tesseractModule: TesseractModuleLike,
  options?: RecognizeTextRegionsOptions
): Promise<OcrDetectRect[]> {
  const prepared = await preprocessOcrDataUrl(ocrInput.dataUrl);
  const variantUrls = await buildOcrVariantDataUrls(ocrInput.dataUrl, prepared.scale);
  const groupMode = options?.groupMode ?? 'merged';
  const docPadding = 6;
  const prepImg = await loadHtmlImage(prepared.dataUrl);
  const ocrW = prepImg.naturalWidth || prepImg.width || 1;
  const ocrH = prepImg.naturalHeight || prepImg.height || 1;
  const collectOpts: CollectTextBboxesOptions = {
    padding: docPadding,
    minConfidence: 0,
    groupMode,
    imageWidth: ocrW,
    imageHeight: ocrH
  };

  const worker = await tesseractModule.createWorker('chi_sim+eng', 1, {
    workerPath: config.workerPath,
    corePath: config.corePath
  });

  const allRects: OcrDetectRect[] = [];
  try {
    await worker.setParameters({
      user_defined_dpi: '300',
      preserve_interword_spaces: '1'
    });

    for (const imageUrl of variantUrls) {
      for (const psm of TESSERACT_OCR_PSM_MODES) {
        await worker.setParameters({ tessedit_pageseg_mode: psm });
        const { data } = await worker.recognize(imageUrl);
        allRects.push(...collectTextBboxesFromTesseract(data, collectOpts));
      }
    }
  } finally {
    await worker.terminate();
  }

  let rects = mergePassRects(allRects, groupMode, docPadding, ocrW, ocrH);

  const scaledDown = rects.map((r) => ({
    x: r.x / prepared.scale,
    y: r.y / prepared.scale,
    width: r.width / prepared.scale,
    height: r.height / prepared.scale
  }));

  const inDoc = scaleRectsToDocument(
    scaledDown,
    ocrInput.docWidth,
    ocrInput.docHeight,
    ocrInput.imageWidth,
    ocrInput.imageHeight
  );
  return offsetDetectedRects(inDoc, ocrInput.regionOffset);
}
