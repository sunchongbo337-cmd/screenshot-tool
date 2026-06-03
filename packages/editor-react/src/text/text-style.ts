import type { TextNode } from '@screenshot/editor-core';

export type TextAlignOption = 'left' | 'center' | 'right';

export type TextStyleUi = {
  fill: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontItalic: boolean;
  underline: boolean;
  align: TextAlignOption;
};

export function isTextBold(fontWeight?: TextNode['fontWeight']): boolean {
  return fontWeight === 'bold' || fontWeight === 700;
}

/** Konva `fontStyle`: normal | bold | italic | italic bold */
export function konvaFontStyle(node: Pick<TextNode, 'fontWeight' | 'fontItalic'>): string {
  const bold = isTextBold(node.fontWeight);
  const italic = !!node.fontItalic;
  if (bold && italic) return 'italic bold';
  if (bold) return 'bold';
  if (italic) return 'italic';
  return 'normal';
}

export function konvaTextDecoration(node: Pick<TextNode, 'underline'>): string {
  return node.underline ? 'underline' : '';
}

export function canvasFontString(
  fontSize: number,
  fontFamily: string,
  fontWeight?: TextNode['fontWeight'],
  fontItalic?: boolean
): string {
  const bold = isTextBold(fontWeight);
  const italic = !!fontItalic;
  const parts: string[] = [];
  if (italic) parts.push('italic');
  if (bold) parts.push('bold');
  parts.push(`${fontSize}px`);
  parts.push(fontFamily);
  return parts.join(' ');
}
