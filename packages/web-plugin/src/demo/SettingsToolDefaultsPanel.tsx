import React from 'react';
import { TextStyleControls } from '@screenshot/editor-react';
import type { TextStylePatch } from '@screenshot/editor-react';

const SETTINGS_FIELD: React.CSSProperties = {
  height: 34,
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.16)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e7eaf0',
  padding: '0 10px',
  width: '100%',
  boxSizing: 'border-box'
};

export type SettingsToolDefaultsPanelProps = {
  mosaicMode: 'rect' | 'brush';
  mosaicStyle: 'pixel' | 'blur';
  mosaicLevel: string;
  mosaicPixelSize: number;
  mosaicBlurRadius: number;
  mosaicBrushSize: number;
  mosaicPixelSizeDraft: string;
  mosaicBlurRadiusDraft: string;
  setMosaicPixelSizeDraft: (v: string) => void;
  setMosaicBlurRadiusDraft: (v: string) => void;
  arrowColor: string;
  arrowKind: 'straight' | 'elbow' | 'curve';
  arrowStrokeWidth: number;
  arrowPointerSize: number;
  arrowOpacity: number;
  arrowShadow: boolean;
  arrowStrokeWidthDraft: string;
  arrowPointerSizeDraft: string;
  setArrowStrokeWidthDraft: (v: string) => void;
  setArrowPointerSizeDraft: (v: string) => void;
  textColor: string;
  textSize: number;
  textFont: string;
  textWeight: 'normal' | 'bold';
  textItalic: boolean;
  textUnderline: boolean;
  textAlign: 'left' | 'center' | 'right';
  mosaicLevels: readonly { name: string; pixelSize: number; blurRadius: number }[];
  mosaicPixelMin: number;
  mosaicPixelMax: number;
  mosaicBlurMin: number;
  mosaicBlurMax: number;
  mosaicBrushSizes: readonly { name: string; value: number }[];
  arrowColors: readonly { name: string; value: string }[];
  textColors: readonly { name: string; value: string }[];
  commonTextSizes: readonly number[];
  applyMosaic: (
    next: {
      mode?: 'rect' | 'brush';
      style?: 'pixel' | 'blur';
      brushSize?: number;
      level?: string;
      pixelSize?: number;
      blurRadius?: number;
    },
    opts?: { defaultsOnly?: boolean }
  ) => void;
  applyArrow: (
    next: {
      kind?: 'straight' | 'elbow' | 'curve';
      color?: string;
      strokeWidth?: number;
      pointerSize?: number;
      opacity?: number;
      shadow?: boolean;
    },
    opts?: { defaultsOnly?: boolean }
  ) => void;
  applyText: (
    next: {
      color?: string;
      size?: number;
      weight?: 'normal' | 'bold';
      italic?: boolean;
      underline?: boolean;
      align?: 'left' | 'center' | 'right';
      font?: string;
    },
    opts?: { defaultsOnly?: boolean }
  ) => void;
  saveCommonStylePrefs: () => void;
  applySavedCommonStylePrefs: (showToast?: boolean) => void;
};

export function SettingsToolDefaultsPanel(props: SettingsToolDefaultsPanelProps) {
  const p = props;
  return (
    <>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 8 }}>马赛克默认</div>
        <div className="menuSection" style={{ marginTop: 0 }}>
          <div className="menuTitle">形状</div>
          <div className="menuRow">
            <button type="button" className={p.mosaicMode === 'rect' ? 'active' : ''} onClick={() => p.applyMosaic({ mode: 'rect' }, { defaultsOnly: true })}>
              框选
            </button>
            <button type="button" className={p.mosaicMode === 'brush' ? 'active' : ''} onClick={() => p.applyMosaic({ mode: 'brush' }, { defaultsOnly: true })}>
              笔刷
            </button>
          </div>
        </div>
        <div className="menuSection">
          <div className="menuTitle">效果</div>
          <div className="menuRow">
            <button type="button" className={p.mosaicStyle === 'pixel' ? 'active' : ''} onClick={() => p.applyMosaic({ style: 'pixel' }, { defaultsOnly: true })}>
              像素
            </button>
            <button type="button" className={p.mosaicStyle === 'blur' ? 'active' : ''} onClick={() => p.applyMosaic({ style: 'blur' }, { defaultsOnly: true })}>
              模糊
            </button>
          </div>
        </div>
        <div className="menuSection">
          <div className="menuTitle">打码程度</div>
          <div className="menuRow">
            {p.mosaicLevels.map((l) => (
              <button
                key={l.name}
                type="button"
                className={p.mosaicLevel === l.name ? 'active' : ''}
                onClick={() => p.applyMosaic({ level: l.name }, { defaultsOnly: true })}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
        <div className="menuSection">
          <div className="menuTitle">参数</div>
          <div className="paramStack">
            <div className="paramLabel">
              <span>像素块</span>
              <span>{p.mosaicPixelSize}</span>
            </div>
            <input
              type="range"
              className="paramSlider"
              min={p.mosaicPixelMin}
              max={p.mosaicPixelMax}
              step={1}
              value={p.mosaicPixelSize}
              onChange={(e) => p.applyMosaic({ pixelSize: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
              aria-label="像素块滑动"
            />
          </div>
          {p.mosaicStyle === 'blur' ? (
            <div className="paramStack" style={{ marginTop: 10 }}>
              <div className="paramLabel">
                <span>模糊半径</span>
                <span>{p.mosaicBlurRadius}</span>
              </div>
              <input
                type="range"
                className="paramSlider"
                min={p.mosaicBlurMin}
                max={p.mosaicBlurMax}
                step={1}
                value={p.mosaicBlurRadius}
                onChange={(e) => p.applyMosaic({ blurRadius: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                aria-label="模糊半径滑动"
              />
            </div>
          ) : null}
        </div>
        {p.mosaicMode === 'brush' ? (
          <div className="menuSection">
            <div className="menuTitle">笔刷粗细</div>
            <div className="paramStack" style={{ marginBottom: 8 }}>
              <div className="paramLabel">
                <span>拖动调节</span>
                <span>{p.mosaicBrushSize}px</span>
              </div>
              <input
                type="range"
                className="paramSlider"
                min={6}
                max={48}
                step={1}
                value={p.mosaicBrushSize}
                onChange={(e) => p.applyMosaic({ brushSize: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                aria-label="笔刷粗细滑动"
              />
            </div>
            <div className="menuRow brushSizeRow">
              {p.mosaicBrushSizes.map(({ value }) => (
                <button
                  key={value}
                  type="button"
                  className={`brushSizeBtn ${p.mosaicBrushSize === value ? 'active' : ''}`}
                  onClick={() => p.applyMosaic({ brushSize: value }, { defaultsOnly: true })}
                  title={`粗细 ${value}`}
                  style={{ width: value + 12, height: value + 12, borderRadius: '50%', padding: 0 }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 8 }}>箭头默认</div>
        <div className="menuSection" style={{ marginTop: 0 }}>
          <div className="menuTitle">颜色</div>
          <div className="menuRow" style={{ gap: 6 }}>
            {p.arrowColors.map((c) => (
              <button
                key={c.value}
                type="button"
                className={p.arrowColor === c.value ? 'active' : ''}
                onClick={() => p.applyArrow({ color: c.value }, { defaultsOnly: true })}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: c.value,
                  border: p.arrowColor === c.value ? '2px solid #4c9ffe' : '1px solid rgba(255,255,255,0.2)'
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>
        <div className="menuSection">
          <div className="menuTitle">形态</div>
          <div className="menuRow">
            <button type="button" className={p.arrowKind === 'straight' ? 'active' : ''} onClick={() => p.applyArrow({ kind: 'straight' }, { defaultsOnly: true })}>
              →
            </button>
            <button type="button" className={p.arrowKind === 'elbow' ? 'active' : ''} onClick={() => p.applyArrow({ kind: 'elbow' }, { defaultsOnly: true })}>
              ⤷
            </button>
            <button type="button" className={p.arrowKind === 'curve' ? 'active' : ''} onClick={() => p.applyArrow({ kind: 'curve' }, { defaultsOnly: true })}>
              ↷
            </button>
          </div>
        </div>
        <div className="menuSection">
          <div className="menuTitle">粗细 / 箭头大小</div>
          <div className="paramStack" style={{ marginBottom: 8 }}>
            <div className="paramLabel">
              <span>线宽</span>
              <span>{p.arrowStrokeWidth}px</span>
            </div>
            <input
              type="range"
              className="paramSlider"
              min={1}
              max={60}
              step={1}
              value={p.arrowStrokeWidth}
              onChange={(e) => p.applyArrow({ strokeWidth: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
              aria-label="箭头线宽滑动"
            />
          </div>
          <div className="paramStack" style={{ marginBottom: 8 }}>
            <div className="paramLabel">
              <span>箭头尖</span>
              <span>{p.arrowPointerSize}px</span>
            </div>
            <input
              type="range"
              className="paramSlider"
              min={6}
              max={120}
              step={1}
              value={p.arrowPointerSize}
              onChange={(e) => p.applyArrow({ pointerSize: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
              aria-label="箭头大小滑动"
            />
          </div>
        </div>
        <div className="menuSection">
          <div className="menuTitle">不透明度</div>
          <div className="paramStack" style={{ marginBottom: 8 }}>
            <div className="paramLabel">
              <span>拖动调节</span>
              <span>{Math.round(p.arrowOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              className="paramSlider"
              min={0}
              max={100}
              step={1}
              value={Math.round(p.arrowOpacity * 100)}
              onChange={(e) => p.applyArrow({ opacity: Math.round(Number(e.target.value)) / 100 }, { defaultsOnly: true })}
              aria-label="箭头不透明度滑动"
            />
          </div>
        </div>
        <div className="menuSection">
          <div className="menuTitle">效果</div>
          <div className="menuRow">
            <button
              type="button"
              className={p.arrowShadow ? 'active' : ''}
              onClick={() => p.applyArrow({ shadow: !p.arrowShadow }, { defaultsOnly: true })}
              title="阴影"
              aria-label="阴影"
              aria-pressed={p.arrowShadow}
            >
              阴影
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 8 }}>文字默认</div>
        <div className="menuSection" style={{ marginTop: 0 }}>
          <div className="menuTitle">颜色</div>
          <div className="menuRow" style={{ gap: 6 }}>
            {p.textColors.map((c) => (
              <button
                key={c.value}
                type="button"
                className={p.textColor === c.value ? 'active' : ''}
                onClick={() => p.applyText({ color: c.value }, { defaultsOnly: true })}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: c.value,
                  border: p.textColor === c.value ? '2px solid #4c9ffe' : '1px solid rgba(255,255,255,0.2)'
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>
        <TextStyleControls
          ui={{
            fill: p.textColor,
            fontSize: p.textSize,
            fontFamily: p.textFont,
            fontWeight: p.textWeight,
            fontItalic: p.textItalic,
            underline: p.textUnderline,
            align: p.textAlign
          }}
          onApply={(patch: TextStylePatch) => p.applyText(patch, { defaultsOnly: true })}
          sizeSection={
            <div className="menuSection">
              <div className="menuTitle">字号</div>
              <div className="paramStack" style={{ marginBottom: 8 }}>
                <div className="paramLabel">
                  <span>拖动调节</span>
                  <span>{p.textSize}px</span>
                </div>
                <input
                  type="range"
                  className="paramSlider"
                  min={8}
                  max={200}
                  step={1}
                  value={p.textSize}
                  onChange={(e) => p.applyText({ size: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                  aria-label="字号滑动"
                />
              </div>
              <select
                className="selectWithArrow"
                value={String(p.textSize)}
                onChange={(e) => p.applyText({ size: Number(e.target.value) }, { defaultsOnly: true })}
                style={{ ...SETTINGS_FIELD, height: 36 }}
              >
                {p.commonTextSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          }
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 8 }}>常用属性（本地）</div>
        <p style={{ margin: '0 0 10px', fontSize: 12, opacity: 0.82, lineHeight: 1.45 }}>
          把当前马赛克、箭头、文字的默认样式存到本机；下次可一键套用。
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="secondary" onClick={() => p.saveCommonStylePrefs()}>
            保存为常用属性
          </button>
          <button type="button" className="secondary" onClick={() => p.applySavedCommonStylePrefs(true)}>
            应用常用属性
          </button>
        </div>
      </div>
    </>
  );
}
