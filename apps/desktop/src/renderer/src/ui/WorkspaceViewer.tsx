import React, { useEffect, useRef, useState } from 'react';
import { WorkspacePasteLayerAdjust } from './WorkspacePasteLayerAdjust.js';
import type { PasteLayerAdjustResult } from './WorkspacePasteLayerAdjust.js';

export type WorkspacePasteLayerAdjustConfig = {
  pasteDataUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  onConfirm: (result: PasteLayerAdjustResult) => void;
  onCancel: () => void;
};

export type WorkspaceViewerProps = {
  dataUrl: string | null;
  zoom: number;
  onZoomChange?: (zoom: number) => void;
  pasteLayerAdjust?: WorkspacePasteLayerAdjustConfig | null;
};

export function WorkspaceViewer({ dataUrl, zoom, pasteLayerAdjust }: WorkspaceViewerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [natural, setNatural] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!dataUrl) {
      setNatural({ width: 0, height: 0 });
      return;
    }
    const img = new Image();
    img.onload = () => setNatural({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    img.src = dataUrl;
  }, [dataUrl]);

  if (!dataUrl) {
    return (
      <div className="workspaceViewer workspaceViewer--empty">
        <p>请选择或打开一张图片</p>
      </div>
    );
  }

  const displayWidth = Math.max(1, Math.round(natural.width * zoom));
  const displayHeight = Math.max(1, Math.round(natural.height * zoom));

  return (
    <div className={`workspaceViewer${pasteLayerAdjust ? ' workspaceViewer--pasteAdjust' : ''}`} ref={hostRef}>
      <div
        className="workspaceViewerInner"
        style={{
          width: displayWidth,
          height: displayHeight
        }}
      >
        <img
          src={dataUrl}
          alt=""
          draggable={false}
          className="workspaceViewerImg"
          width={displayWidth}
          height={displayHeight}
        />
        {pasteLayerAdjust ? (
          <WorkspacePasteLayerAdjust
            pasteDataUrl={pasteLayerAdjust.pasteDataUrl}
            canvasWidth={pasteLayerAdjust.canvasWidth}
            canvasHeight={pasteLayerAdjust.canvasHeight}
            displayWidth={displayWidth}
            displayHeight={displayHeight}
            onConfirm={pasteLayerAdjust.onConfirm}
            onCancel={pasteLayerAdjust.onCancel}
          />
        ) : null}
      </div>
    </div>
  );
}
