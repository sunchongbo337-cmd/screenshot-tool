import React, { useEffect, useMemo, useState } from 'react';

export type ResizeImageDialogProps = {
  open: boolean;
  originalWidth: number;
  originalHeight: number;
  onConfirm: (result: { width: number; height: number; antialias: boolean }) => void;
  onCancel: () => void;
};

function mpLabel(w: number, h: number) {
  return `${((w * h) / 1_000_000).toFixed(2)}MP`;
}

export function ResizeImageDialog(props: ResizeImageDialogProps) {
  const { open, originalWidth, originalHeight, onConfirm, onCancel } = props;
  const [mode, setMode] = useState<'pixels' | 'percent'>('pixels');
  const [width, setWidth] = useState(originalWidth);
  const [height, setHeight] = useState(originalHeight);
  const [keepAspect, setKeepAspect] = useState(true);
  const [antialias, setAntialias] = useState(true);
  const aspect = originalWidth / Math.max(1, originalHeight);

  useEffect(() => {
    if (!open) return;
    setMode('pixels');
    setWidth(originalWidth);
    setHeight(originalHeight);
    setKeepAspect(true);
    setAntialias(true);
  }, [open, originalWidth, originalHeight]);

  const newSize = useMemo(() => {
    if (mode === 'percent') {
      const w = Math.max(1, Math.round((originalWidth * width) / 100));
      const h = Math.max(1, Math.round((originalHeight * height) / 100));
      return { width: w, height: h };
    }
    return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) };
  }, [mode, width, height, originalWidth, originalHeight]);

  if (!open) return null;

  function patchWidth(next: number) {
    const v = Math.max(1, Math.round(next));
    setWidth(v);
    if (keepAspect && mode === 'pixels') setHeight(Math.max(1, Math.round(v / aspect)));
  }

  function patchHeight(next: number) {
    const v = Math.max(1, Math.round(next));
    setHeight(v);
    if (keepAspect && mode === 'pixels') setWidth(Math.max(1, Math.round(v * aspect)));
  }

  return (
    <div className="fscSettingsOverlay" role="dialog" aria-modal="true" aria-label="调整大小">
      <div className="fscSettingsDialog resizeDialog" style={{ width: 'min(520px, 100%)' }}>
        <div className="fscSettingsHeader">
          <strong>调整大小</strong>
        </div>
        <div className="fscSettingsBody">
          <table className="resizeInfoTable">
            <thead>
              <tr>
                <th />
                <th>宽度</th>
                <th>高度</th>
                <th>大小</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>原始大小</td>
                <td>{originalWidth}</td>
                <td>{originalHeight}</td>
                <td>{mpLabel(originalWidth, originalHeight)}</td>
              </tr>
              <tr>
                <td>新大小</td>
                <td>{newSize.width}</td>
                <td>{newSize.height}</td>
                <td>{mpLabel(newSize.width, newSize.height)}</td>
              </tr>
            </tbody>
          </table>

          <div className="resizeModeBlock">
            <label className="fscCheckRow">
              <input type="radio" name="resizeMode" checked={mode === 'pixels'} onChange={() => setMode('pixels')} />
              <span>像素</span>
            </label>
            <div className="resizeFieldRow">
              <label>
                宽度
                <input
                  type="number"
                  min={1}
                  disabled={mode !== 'pixels'}
                  value={mode === 'pixels' ? width : newSize.width}
                  onChange={(e) => patchWidth(Number(e.target.value))}
                />
              </label>
              <label>
                高度
                <input
                  type="number"
                  min={1}
                  disabled={mode !== 'pixels'}
                  value={mode === 'pixels' ? height : newSize.height}
                  onChange={(e) => patchHeight(Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="resizeModeBlock">
            <label className="fscCheckRow">
              <input type="radio" name="resizeMode" checked={mode === 'percent'} onChange={() => setMode('percent')} />
              <span>百分比</span>
            </label>
            <div className="resizeFieldRow">
              <label>
                宽度
                <input
                  type="number"
                  min={1}
                  max={1000}
                  disabled={mode !== 'percent'}
                  value={mode === 'percent' ? width : 100}
                  onChange={(e) => {
                    const v = Math.max(1, Math.round(Number(e.target.value)));
                    setWidth(v);
                    if (keepAspect) setHeight(v);
                  }}
                />
                %
              </label>
              <label>
                高度
                <input
                  type="number"
                  min={1}
                  max={1000}
                  disabled={mode !== 'percent'}
                  value={mode === 'percent' ? height : 100}
                  onChange={(e) => {
                    const v = Math.max(1, Math.round(Number(e.target.value)));
                    setHeight(v);
                    if (keepAspect) setWidth(v);
                  }}
                />
                %
              </label>
            </div>
          </div>

          <label className="fscCheckRow">
            <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} />
            <span>保持外观比例</span>
          </label>
          <label className="fscCheckRow">
            <input type="checkbox" checked={antialias} onChange={(e) => setAntialias(e.target.checked)} />
            <span>启用消除锯齿</span>
          </label>
        </div>
        <div className="fscSettingsFooter">
          <button type="button" className="fscSettingsBtn primary" onClick={() => onConfirm({ ...newSize, antialias })}>
            确定
          </button>
          <button type="button" className="fscSettingsBtn" onClick={onCancel}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
