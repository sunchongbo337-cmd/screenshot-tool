import './text-style-controls.css';
import React from 'react';
import { getTextFontSelectGroups } from './text-fonts.js';
import type { TextAlignOption, TextStyleUi } from './text-style.js';

export type TextStylePatch = {
  color?: string;
  size?: number;
  font?: string;
  weight?: 'normal' | 'bold';
  italic?: boolean;
  underline?: boolean;
  align?: TextAlignOption;
};

export type TextStyleControlsProps = {
  ui: TextStyleUi;
  onApply: (patch: TextStylePatch) => void;
  /** Optional size controls rendered above font row. */
  sizeSection?: React.ReactNode;
  /** Optional color section rendered above font row. */
  colorSection?: React.ReactNode;
};

function AlignIcon(props: { kind: 'left' | 'center' | 'right' }) {
  const lines =
    props.kind === 'left'
      ? [14, 10, 12]
      : props.kind === 'center'
        ? [12, 14, 12]
        : [10, 14, 12];
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      {lines.map((w, i) => (
        <rect key={i} x={props.kind === 'right' ? 16 - w : props.kind === 'center' ? (16 - w) / 2 : 0} y={3 + i * 4} width={w} height={2} rx={1} fill="currentColor" />
      ))}
    </svg>
  );
}

export function TextStyleControls(props: TextStyleControlsProps) {
  const { ui, onApply, sizeSection, colorSection } = props;
  const { common, groups } = getTextFontSelectGroups();

  return (
    <>
      {colorSection}
      {sizeSection}
      <div className="menuSection">
        <div className="menuTitle">字体</div>
        <select
          className="selectWithArrow textFontSelect"
          value={ui.fontFamily}
          onChange={(e) => onApply({ font: e.target.value })}
          style={{ width: '100%' }}
          title="选择字体"
        >
          <optgroup label="常用">
            {common.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </optgroup>
          {groups.map((g) => (
            <optgroup key={g.letter} label={g.letter}>
              {g.fonts.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="menuSection">
        <div className="menuTitle">格式</div>
        <div className="textFmtRow">
          <button
            type="button"
            className={`textFmtBtn${ui.fontWeight === 'bold' ? ' active' : ''}`}
            title="加粗"
            aria-label="加粗"
            aria-pressed={ui.fontWeight === 'bold'}
            onClick={() => onApply({ weight: ui.fontWeight === 'bold' ? 'normal' : 'bold' })}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className={`textFmtBtn${ui.fontItalic ? ' active' : ''}`}
            title="斜体"
            aria-label="斜体"
            aria-pressed={ui.fontItalic}
            onClick={() => onApply({ italic: !ui.fontItalic })}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className={`textFmtBtn textFmtBtnUnderline${ui.underline ? ' active' : ''}`}
            title="下划线"
            aria-label="下划线"
            aria-pressed={ui.underline}
            onClick={() => onApply({ underline: !ui.underline })}
          >
            <span>U</span>
          </button>
          <span className="textFmtSep" aria-hidden="true" />
          <button
            type="button"
            className={`textFmtBtn${ui.align === 'left' ? ' active' : ''}`}
            title="左对齐"
            aria-label="左对齐"
            aria-pressed={ui.align === 'left'}
            onClick={() => onApply({ align: 'left' })}
          >
            <AlignIcon kind="left" />
          </button>
          <button
            type="button"
            className={`textFmtBtn${ui.align === 'center' ? ' active' : ''}`}
            title="居中对齐"
            aria-label="居中对齐"
            aria-pressed={ui.align === 'center'}
            onClick={() => onApply({ align: 'center' })}
          >
            <AlignIcon kind="center" />
          </button>
          <button
            type="button"
            className={`textFmtBtn${ui.align === 'right' ? ' active' : ''}`}
            title="右对齐"
            aria-label="右对齐"
            aria-pressed={ui.align === 'right'}
            onClick={() => onApply({ align: 'right' })}
          >
            <AlignIcon kind="right" />
          </button>
        </div>
      </div>
    </>
  );
}
