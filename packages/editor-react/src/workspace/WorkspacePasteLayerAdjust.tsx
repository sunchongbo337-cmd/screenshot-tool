import React, { useEffect, useRef, useState } from 'react';

export type PasteLayerAdjustResult = {
  imageDataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WorkspacePasteLayerAdjustProps = {
  pasteDataUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  displayWidth: number;
  displayHeight: number;
  onConfirm: (result: PasteLayerAdjustResult) => void;
  onCancel: () => void;
};

type DragMode = 'move' | 'resize-se' | null;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function WorkspacePasteLayerAdjust(props: WorkspacePasteLayerAdjustProps) {
  const { pasteDataUrl, canvasWidth, canvasHeight, displayWidth, displayHeight, onConfirm, onCancel } = props;
  const [sourceSize, setSourceSize] = useState({ width: 1, height: 1 });
  const [placement, setPlacement] = useState({ x: 0, y: 0, width: 1, height: 1 });
  const [keepAspect] = useState(true);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const dragStartRef = useRef<{ x: number; y: number; placement: typeof placement } | null>(null);

  const displayScale = displayWidth / Math.max(1, canvasWidth);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || img.width || 1;
      const h = img.naturalHeight || img.height || 1;
      setSourceSize({ width: w, height: h });
      const layerW = Math.min(w, canvasWidth);
      const layerH = Math.min(h, canvasHeight);
      setPlacement({
        x: Math.max(0, Math.round((canvasWidth - layerW) / 2)),
        y: Math.max(0, Math.round((canvasHeight - layerH) / 2)),
        width: layerW,
        height: layerH
      });
    };
    img.src = pasteDataUrl;
  }, [pasteDataUrl, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (!dragMode) return;
    const onMove = (e: PointerEvent) => {
      const start = dragStartRef.current;
      if (!start) return;
      const dx = (e.clientX - start.x) / displayScale;
      const dy = (e.clientY - start.y) / displayScale;
      if (dragMode === 'move') {
        setPlacement((p) => ({
          ...p,
          x: clamp(Math.round(start.placement.x + dx), 0, Math.max(0, canvasWidth - p.width)),
          y: clamp(Math.round(start.placement.y + dy), 0, Math.max(0, canvasHeight - p.height))
        }));
        return;
      }
      if (dragMode === 'resize-se') {
        const aspect = sourceSize.width / Math.max(1, sourceSize.height);
        let nextW = Math.max(16, Math.round(start.placement.width + dx));
        let nextH = Math.max(16, Math.round(start.placement.height + dy));
        if (keepAspect) {
          if (Math.abs(dx) >= Math.abs(dy)) nextH = Math.round(nextW / aspect);
          else nextW = Math.round(nextH * aspect);
        }
        nextW = Math.min(nextW, canvasWidth - start.placement.x);
        nextH = Math.min(nextH, canvasHeight - start.placement.y);
        setPlacement({ ...start.placement, width: nextW, height: nextH });
      }
    };
    const onUp = () => {
      setDragMode(null);
      dragStartRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragMode, displayScale, canvasWidth, canvasHeight, sourceSize.width, sourceSize.height, keepAspect]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        void handleConfirm();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, sourceSize, pasteDataUrl]);

  function beginDrag(mode: DragMode, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY, placement: { ...placement } };
    setDragMode(mode);
  }

  function handleConfirm() {
    onConfirm({
      imageDataUrl: pasteDataUrl,
      x: placement.x,
      y: placement.y,
      width: placement.width,
      height: placement.height
    });
  }

  return (
    <>
      <div
        className="workspacePasteOverlay"
        style={{
          width: displayWidth,
          height: displayHeight
        }}
      >
        <div
          className="pasteLayerOverlay workspacePasteLayer"
          style={{
            left: placement.x * displayScale,
            top: placement.y * displayScale,
            width: placement.width * displayScale,
            height: placement.height * displayScale
          }}
          onPointerDown={(e) => beginDrag('move', e)}
        >
          <div className="pasteLayerOverlayClip">
            <img src={pasteDataUrl} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
          </div>
          <span
            className="pasteLayerResizeHandle"
            onPointerDown={(e) => beginDrag('resize-se', e)}
            aria-hidden
          />
        </div>
      </div>
      <div className="workspacePasteBar" role="toolbar" aria-label="粘贴图层调整">
        <span className="workspacePasteBarHint">拖动图片调整位置，拖动右下角调整大小</span>
        <div className="workspacePasteBarActions">
          <button type="button" className="fscSettingsBtn primary" onClick={() => void handleConfirm()}>
            确定合并
          </button>
          <button type="button" className="fscSettingsBtn" onClick={onCancel}>
            取消
          </button>
        </div>
      </div>
    </>
  );
}
