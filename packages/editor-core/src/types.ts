export type ExportFormat = 'png' | 'jpeg' | 'webp';

export type Point = { x: number; y: number };

export type ColorString = string;

export type BaseNode = {
  id: string;
  kind: 'mosaicRect' | 'mosaicStroke' | 'arrow' | 'text';
  createdAt: number;
  updatedAt: number;
};

export type MosaicRectNode = BaseNode & {
  kind: 'mosaicRect';
  x: number;
  y: number;
  width: number;
  height: number;
  pixelSize: number;
  style: 'pixel' | 'blur';
  blurRadius?: number;
};

export type MosaicStrokeNode = BaseNode & {
  kind: 'mosaicStroke';
  points: Point[];
  brushSize: number;
  pixelSize: number;
  style: 'pixel' | 'blur';
  blurRadius?: number;
};

export type ArrowNode = BaseNode & {
  kind: 'arrow';
  /** Rendering layer: base (below mosaics) or top (above mosaics). */
  layer?: 'base' | 'top';
  /** If true, this node is locked and won't participate in selection/editing. */
  locked?: boolean;
  /**
   * Optional clip rects (union). When present, this arrow will only render inside these rects.
   * Used to "split" an arrow into mosaiced and non-mosaiced parts.
   */
  clipRects?: Array<{ x: number; y: number; width: number; height: number }>;
  points: [Point, Point];
  /** Arrow shape type. */
  arrowKind?: 'straight' | 'elbow' | 'curve';
  stroke: ColorString;
  strokeWidth: number;
  pointerLength: number;
  pointerWidth: number;
};

export type TextNode = BaseNode & {
  kind: 'text';
  /** Rendering layer: base (below mosaics) or top (above mosaics). */
  layer?: 'base' | 'top';
  /** If true, this node is locked and won't participate in selection/editing. */
  locked?: boolean;
  /**
   * Optional clip rects (union). When present, this text will only render inside these rects.
   * Used to "split" a text node into mosaiced and non-mosaiced parts.
   */
  clipRects?: Array<{ x: number; y: number; width: number; height: number }>;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: ColorString;
  backgroundFill?: ColorString;
  padding: number;
  /**
   * Text layout mode.
   * - 'singleLine': horizontal, no wrapping.
   * - 'area': fixed-width text box with wrapping.
   */
  mode?: 'singleLine' | 'area';
  /** Fixed width for area text. */
  width?: number;
  /** Paragraph alignment. */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Line height multiplier. */
  lineHeight?: number;
  /** Additional letter spacing in pixels. */
  letterSpacing?: number;
  /** Font weight for the whole text node. */
  fontWeight?: 'normal' | 'bold' | number;
};

export type EditorNode = MosaicRectNode | MosaicStrokeNode | ArrowNode | TextNode;

export type EditorDocument = {
  version: 1;
  width: number;
  height: number;
  background: {
    kind: 'image';
    src: string;
  };
  nodes: EditorNode[];
};

export type Tool =
  | { kind: 'select' }
  | {
      kind: 'mosaic';
      pixelSize: number;
      mode?: 'rect' | 'brush';
      style?: 'pixel' | 'blur';
      brushSize?: number;
      /** Blur strength when style is 'blur'. */
      blurRadius?: number;
    }
  | {
      kind: 'arrow';
      arrowKind?: ArrowKind;
      stroke: ColorString;
      strokeWidth: number;
      pointerLength: number;
      pointerWidth: number;
    }
  | {
      kind: 'text';
      fill: ColorString;
      fontSize: number;
      fontFamily: string;
      backgroundFill?: ColorString;
      padding: number;
      align?: 'left' | 'center' | 'right' | 'justify';
      lineHeight?: number;
      letterSpacing?: number;
      fontWeight?: 'normal' | 'bold' | number;
    };

export type ExportOptions = {
  format: ExportFormat;
  quality?: number;
};

