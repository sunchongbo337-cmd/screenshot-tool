import React, { useEffect, useMemo, useRef, useState } from 'react';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rectFromPoints(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
}

async function captureByMediaDevices(): Promise<{ dataUrl: string }> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('当前环境不支持屏幕捕获（getDisplayMedia 不可用）');
  }

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: 'always' } as any,
    audio: false
  });

  try {
    const track = stream.getVideoTracks()[0];
    if (!track) throw new Error('没有可用的视频轨道');

    const video = document.createElement('video');
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    await new Promise<void>((resolve) => {
      video.onloadedmetadata = () => {
        video.play().then(() => resolve()).catch(() => resolve());
      };
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 0;
    canvas.height = video.videoHeight || 0;
    if (!canvas.width || !canvas.height) {
      throw new Error('获取到的画面尺寸为 0');
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法创建画布上下文');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    return { dataUrl };
  } finally {
    stream.getTracks().forEach((t) => t.stop());
  }
}

export function OverlayScreen(props: { displayId: number }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [displayScale, setDisplayScale] = useState<number>(1);

  const selection = useMemo(() => {
    if (!dragStart || !dragEnd) return null;
    return rectFromPoints(dragStart, dragEnd);
  }, [dragStart, dragEnd]);

  const hostSize = useMemo(() => {
    const host = hostRef.current;
    if (!host) return { w: window.innerWidth, h: window.innerHeight };
    const r = host.getBoundingClientRect();
    return { w: r.width || window.innerWidth, h: r.height || window.innerHeight };
  }, [dataUrl, imgEl, selection, confirmOpen]);

  const selectionPx = useMemo(() => {
    const host = hostRef.current;
    const img = imgEl;
    if (!host || !img || !selection) return null;
    const hr = host.getBoundingClientRect();
    const sx = img.naturalWidth / hr.width;
    const sy = img.naturalHeight / hr.height;
    const srcW = clamp(Math.round(selection.w * sx), 1, img.naturalWidth);
    const srcH = clamp(Math.round(selection.h * sy), 1, img.naturalHeight);
    return { w: srcW, h: srcH };
  }, [imgEl, selection]);

  useEffect(() => {
    // Background screenshot is provided by MAIN before overlay shows.
    const api = (window as any).desktopApi;
    if (typeof api?.onOverlayBackground !== 'function') {
      setError('desktopApi 未注入，无法接收截图背景');
      return;
    }
    // Get display scaleFactor for correct background sizing on HiDPI.
    if (typeof api?.getDisplays === 'function') {
      void api
        .getDisplays()
        .then((ds: any[]) => {
          const d = ds?.find?.((x: any) => Number(x?.id) === Number(props.displayId));
          const sf = Number(d?.scaleFactor);
          if (Number.isFinite(sf) && sf > 0) setDisplayScale(sf);
        })
        .catch(() => {});
    }
    const off = api.onOverlayBackground((p: { displayId: number; dataUrl: string }) => {
      if (!p?.dataUrl) return;
      if (Number(p.displayId) !== Number(props.displayId)) return;
      setDataUrl(p.dataUrl);
      const img = new Image();
      img.onload = () => setImgEl(img);
      img.onerror = () => setError('加载截图失败');
      img.src = p.dataUrl;
    });
    return () => off();
  }, [props.displayId]);

  useEffect(() => {
    // 自动获取焦点，让 Esc 能立即生效
    hostRef.current?.focus();
  }, []);

  useEffect(() => {
    // 兜底：不依赖 focus 的全局 Esc 退出
    const requestCancel = () => {
      const api = (window as any).desktopApi;
      if (api?.cancelCapture) api.cancelCapture();
      else window.close();
    };
    const requestConfirm = async () => {
      if (!confirmOpen) return;
      await doConfirm();
    };
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        requestCancel();
        return;
      }
      if (ev.key === 'Enter') {
        ev.preventDefault();
        void requestConfirm();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmOpen, imgEl, dragStart, dragEnd]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return;
      const host = hostRef.current;
      if (!host) return;
      const r = host.getBoundingClientRect();
      setDragEnd({ x: ev.clientX - r.left, y: ev.clientY - r.top });
    };
    const onUp = (ev: MouseEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      const host = hostRef.current;
      if (!host || !dragStart) return;
      const r = host.getBoundingClientRect();
      const end = { x: ev.clientX - r.left, y: ev.clientY - r.top };
      setDragEnd(end);
      const { w, h } = rectFromPoints(dragStart, end);
      if (w < 4 || h < 4) {
        setDragStart(null);
        setDragEnd(null);
        return;
      }
      setConfirmOpen(true);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, dragStart]);

  function getLocalPoint(e: React.MouseEvent) {
    const host = hostRef.current;
    if (!host) return null;
    const r = host.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onMouseDown(e: React.MouseEvent) {
    // Clicking toolbar should not reset selection.
    const t = e.target as HTMLElement | null;
    if (t && toolbarRef.current && toolbarRef.current.contains(t)) return;
    // 右键直接退出（兜底）
    if (e.button === 2) {
      e.preventDefault();
      const api = (window as any).desktopApi;
      if (api?.cancelCapture) api.cancelCapture();
      else window.close();
      return;
    }
    if (e.button !== 0) return;
    if (confirmOpen) {
      // click outside to close selection and restart
      setConfirmOpen(false);
      setDragStart(null);
      setDragEnd(null);
    }
    const p = getLocalPoint(e);
    if (!p) return;
    draggingRef.current = true;
    setIsDragging(true);
    setDragStart(p);
    setDragEnd(p);
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragStart) return;
    if (!draggingRef.current) return;
    const p = getLocalPoint(e);
    if (!p) return;
    setDragEnd(p);
  }

  async function onMouseUp(e: React.MouseEvent) {
    if (!dragStart) return;
    draggingRef.current = false;
    setIsDragging(false);
    const p = getLocalPoint(e);
    if (!p) return;
    const end = p;
    setDragEnd(end);

    const { x, y, w, h } = rectFromPoints(dragStart, end);
    if (w < 4 || h < 4) {
      setDragStart(null);
      setDragEnd(null);
      return;
    }
    setConfirmOpen(true);
  }

  async function doConfirm() {
    const host = hostRef.current;
    const img = imgEl;
    if (!host || !img || !dragStart || !dragEnd) return;
    const { x, y, w, h } = rectFromPoints(dragStart, dragEnd);
    const hr = host.getBoundingClientRect();
    const sx = img.naturalWidth / hr.width;
    const sy = img.naturalHeight / hr.height;
    const srcX = clamp(Math.round(x * sx), 0, img.naturalWidth - 1);
    const srcY = clamp(Math.round(y * sy), 0, img.naturalHeight - 1);
    const srcW = clamp(Math.round(w * sx), 1, img.naturalWidth - srcX);
    const srcH = clamp(Math.round(h * sy), 1, img.naturalHeight - srcY);
    const canvas = document.createElement('canvas');
    canvas.width = srcW;
    canvas.height = srcH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    const cropped = canvas.toDataURL('image/png');
    setConfirmOpen(false);
    window.desktopApi.completeCapture(cropped);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      const api = (window as any).desktopApi;
      if (api?.cancelCapture) api.cancelCapture();
      else window.close();
    }
  }

  return (
    <div
      ref={hostRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'crosshair',
        outline: 'none',
        userSelect: 'none',
        backgroundColor: '#000',
        backgroundImage: dataUrl ? `url(${dataUrl})` : undefined,
        // Correct sizing in CSS pixels (window is DIP; captured image is physical pixels)
        backgroundSize: imgEl ? `${Math.max(1, Math.round(imgEl.naturalWidth / displayScale))}px ${Math.max(1, Math.round(imgEl.naturalHeight / displayScale))}px` : undefined,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // WeChat-like dim layer
          background: 'rgba(0,0,0,0.38)'
        }}
      />

      {selection ? (
        <div
          style={{
            position: 'absolute',
            left: selection.x,
            top: selection.y,
            width: selection.w,
            height: selection.h,
            border: '2px solid rgba(38, 220, 98, 0.98)',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.42)',
            background: 'rgba(0,0,0,0.0)'
          }}
        />
      ) : null}

      {selection && confirmOpen ? (
        <div
          ref={toolbarRef}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: clamp(selection.x + selection.w - 182, 12, hostSize.w - 200),
            top: clamp(selection.y + selection.h + 10, 12, hostSize.h - 52),
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            borderRadius: 12,
            background: 'rgba(16,18,25,0.88)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            fontSize: 12,
            zIndex: 50
          }}
        >
          <div style={{ opacity: 0.9, minWidth: 84 }}>
            {selectionPx ? `${selectionPx.w}×${selectionPx.h}` : ''}
          </div>
          <button
            type="button"
            onClick={() => {
              const api = (window as any).desktopApi;
              if (api?.cancelCapture) api.cancelCapture();
              else window.close();
            }}
            style={{
              height: 28,
              padding: '0 10px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(255,255,255,0.06)',
              color: '#e7eaf0',
              cursor: 'pointer'
            }}
          >
            取消(Esc)
          </button>
          <button
            type="button"
            onClick={() => void doConfirm()}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 10,
              border: '1px solid rgba(38, 220, 98, 0.45)',
              background: 'rgba(38, 220, 98, 0.92)',
              color: '#07160c',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            确定(Enter)
          </button>
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 16,
          padding: '6px 10px',
          borderRadius: 10,
          background: 'rgba(16,18,25,0.7)',
          border: '1px solid rgba(255,255,255,0.14)',
          fontSize: 12,
          maxWidth: 520,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.35
        }}
      >
        {error
          ? `${error}\n\n解决方法：Windows 设置 → 隐私和安全性 → 屏幕截图（或“屏幕录制/屏幕捕获”）→ 允许桌面应用访问。\n\n按 Esc 或右键退出。`
          : confirmOpen
            ? '拖拽已完成。按 Enter 确定，或按 Esc 取消。'
            : '按住左键拖拽选择区域，按 Esc 取消'}
      </div>
    </div>
  );
}

