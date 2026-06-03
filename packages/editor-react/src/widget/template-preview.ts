import type { TextNode } from '@screenshot/editor-core';
import { canvasFontString } from '../text/text-style.js';
import type { AnnotationTemplateV1 } from './template-storage.js';

const TEXT_RENDER_PADDING = 6;

type Point = { x: number; y: number };

function normalizeArrowEndpoints(raw: Record<string, unknown>): [Point, Point] | null {
  const pts = raw.points;
  if (!Array.isArray(pts) || pts.length < 2) return null;
  const a = pts[0];
  const b = pts[1];
  if (a && typeof a === 'object' && 'x' in a && 'y' in b && typeof b === 'object' && 'x' in b) {
    return [
      { x: Number((a as Point).x), y: Number((a as Point).y) },
      { x: Number((b as Point).x), y: Number((b as Point).y) }
    ];
  }
  if (typeof pts[0] === 'number' && pts.length >= 4) {
    return [
      { x: pts[0], y: pts[1] },
      { x: pts[2], y: pts[3] }
    ];
  }
  return null;
}

/** Match editor arrow polyline (straight / elbow / curve). */
function arrowPreviewPath(a: Point, b: Point, arrowKind: string): Point[] {
  if (arrowKind === 'elbow') {
    return [a, { x: b.x, y: a.y }, b];
  }
  if (arrowKind === 'curve') {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const nx = -dy / dist;
    const ny = dx / dist;
    const bend = Math.min(120, dist * 0.25);
    return [a, { x: mx + nx * bend, y: my + ny * bend }, b];
  }
  return [a, b];
}

function drawArrowPreview(
  ctx: CanvasRenderingContext2D,
  n: Record<string, unknown>,
  sx: number,
  sy: number
) {
  const ends = normalizeArrowEndpoints(n);
  if (!ends) return;
  const [a, b] = ends;
  const kind = (n.arrowKind as string) ?? 'straight';
  const path = arrowPreviewPath(a, b, kind).map((p) => ({ x: p.x * sx, y: p.y * sy }));

  const stroke = (n.stroke as string) ?? '#ff3b30';
  const strokeWidth = Math.max(1, ((n.strokeWidth as number) ?? 4) * Math.min(sx, sy));
  const pointerLen = Math.max(6, ((n.pointerLength as number) ?? 16) * Math.min(sx, sy));
  const opacity = typeof n.opacity === 'number' ? n.opacity : 1;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = stroke;
  ctx.fillStyle = stroke;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(path[0]!.x, path[0]!.y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i]!.x, path[i]!.y);
  }
  ctx.stroke();

  const last = path[path.length - 1]!;
  const prev = path[path.length - 2] ?? path[0]!;
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.lineTo(
    last.x - pointerLen * Math.cos(angle - Math.PI / 6),
    last.y - pointerLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    last.x - pointerLen * Math.cos(angle + Math.PI / 6),
    last.y - pointerLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTextPreview(ctx: CanvasRenderingContext2D, n: Record<string, unknown>, sx: number, sy: number) {
  const text = String(n.text ?? '');
  if (!text.trim() && text !== ' ') return;

  const fontSize = Math.max(8, ((n.fontSize as number) ?? 16) * Math.min(sx, sy));
  const fontFamily = String(n.fontFamily ?? 'Microsoft YaHei');
  const padding = ((n.padding as number) ?? 0) + TEXT_RENDER_PADDING;
  const pad = padding * Math.min(sx, sy);
  const lineHeightMul = (n.lineHeight as number) ?? 1.25;
  const lh = lineHeightMul * fontSize;
  const x = (n.x as number) * sx;
  const y = (n.y as number) * sy;
  const fill = (n.fill as string) ?? '#ff3b30';
  const bg = n.backgroundFill as string | undefined;
  const align = (n.align as string) ?? 'left';
  const letterSpacing = ((n.letterSpacing as number) ?? 0) * sx;

  ctx.save();
  ctx.font = canvasFontString(fontSize, fontFamily, n.fontWeight as TextNode['fontWeight'], !!n.fontItalic);
  ctx.fillStyle = fill;
  ctx.textBaseline = 'top';

  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let maxW = 0;
  for (const line of lines) {
    maxW = Math.max(maxW, ctx.measureText(line || ' ').width + letterSpacing * Math.max(0, line.length - 1));
  }
  const boxW = n.width != null ? Math.max(maxW, (n.width as number) * sx) : maxW;
  const boxH = lines.length * lh + pad * 2;

  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, boxW + pad * 2, boxH);
    ctx.fillStyle = fill;
  }

  let lineY = y + pad;
  for (const line of lines) {
    const lineW = ctx.measureText(line || ' ').width;
    let lineX = x + pad;
    if (align === 'center') lineX = x + pad + (boxW - lineW) / 2;
    else if (align === 'right') lineX = x + pad + boxW - lineW;

    if (letterSpacing > 0 && line.length > 0) {
      let cx = lineX;
      for (const ch of line) {
        ctx.fillText(ch, cx, lineY);
        cx += ctx.measureText(ch).width + letterSpacing;
      }
    } else {
      ctx.fillText(line, lineX, lineY);
    }
    lineY += lh;
  }

  if (n.underline) {
    ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(1, fontSize / 14);
    const uy = lineY - lh + fontSize;
    ctx.beginPath();
    ctx.moveTo(x + pad, uy);
    ctx.lineTo(x + pad + boxW, uy);
    ctx.stroke();
  }

  ctx.restore();
}

export async function renderTemplatePreviewDataUrl(tpl: AnnotationTemplateV1, maxEdge = 420): Promise<string> {
  const bw = Math.max(1, tpl.base.width);
  const bh = Math.max(1, tpl.base.height);
  const scale = Math.min(1, maxEdge / Math.max(bw, bh));
  const w = Math.max(1, Math.round(bw * scale));
  const h = Math.max(1, Math.round(bh * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cell = 8;
  for (let py = 0; py < h; py += cell) {
    for (let px = 0; px < w; px += cell) {
      const odd = ((px / cell) | 0) + ((py / cell) | 0);
      ctx.fillStyle = odd % 2 === 0 ? '#2a2f3a' : '#1e222b';
      ctx.fillRect(px, py, cell, cell);
    }
  }

  const sx = w / bw;
  const sy = h / bh;

  const mosaics: Record<string, unknown>[] = [];
  const arrows: Record<string, unknown>[] = [];
  const texts: Record<string, unknown>[] = [];

  for (const raw of tpl.nodes) {
    const n = raw as Record<string, unknown>;
    if (n.kind === 'mosaicRect' || n.kind === 'mosaicStroke') mosaics.push(n);
    else if (n.kind === 'arrow') arrows.push(n);
    else if (n.kind === 'text') texts.push(n);
  }

  for (const n of mosaics) {
    if (n.kind === 'mosaicRect') {
      ctx.fillStyle = 'rgba(120, 120, 120, 0.85)';
      ctx.fillRect((n.x as number) * sx, (n.y as number) * sy, (n.width as number) * sx, (n.height as number) * sy);
      continue;
    }
    const pts = (n.points as Array<{ x: number; y: number }>) ?? [];
    const brush = ((n.brushSize as number) ?? 12) * Math.min(sx, sy);
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.85)';
    ctx.lineWidth = brush;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]!;
      if (i === 0) ctx.moveTo(p.x * sx, p.y * sy);
      else ctx.lineTo(p.x * sx, p.y * sy);
    }
    ctx.stroke();
  }

  for (const n of arrows) {
    drawArrowPreview(ctx, n, sx, sy);
  }

  for (const n of texts) {
    drawTextPreview(ctx, n, sx, sy);
  }

  return canvas.toDataURL('image/png');
}
