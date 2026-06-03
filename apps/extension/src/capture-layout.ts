export type CaptureCanvasLayout = {
  canvasWidth: number;
  canvasHeight: number;
  render: 'browser-frame' | 'window-frame';
};

export async function measureStreamVideoPixels(
  stream: MediaStream
): Promise<{ width: number; height: number }> {
  const track = stream.getVideoTracks()[0];
  const settings = track?.getSettings();
  let width = settings?.width ?? 0;
  let height = settings?.height ?? 0;
  if (width > 0 && height > 0) return { width, height };

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  try {
    await video.play().catch(() => undefined);
    for (let i = 0; i < 80 && (!video.videoWidth || !video.videoHeight); i++) {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
    }
    return { width: video.videoWidth, height: video.videoHeight };
  } finally {
    video.pause();
    video.srcObject = null;
  }
}

export function pickRenderForDisplayStream(stream: MediaStream): 'browser-frame' | 'window-frame' {
  const track = stream.getVideoTracks()[0];
  const settings = track?.getSettings();
  const surface = settings?.displaySurface;
  if (surface === 'monitor' || surface === 'window') return 'window-frame';
  if (surface === 'browser') return 'browser-frame';

  const vw = settings?.width ?? 0;
  const vh = settings?.height ?? 0;
  if (vw <= 0 || vh <= 0) return 'browser-frame';

  const dpr = window.devicePixelRatio || 1;
  const screenW = window.screen.width * dpr;
  const screenH = window.screen.height * dpr;
  const viewW = window.innerWidth * dpr;
  const viewH = window.innerHeight * dpr;

  const coversScreen = vw >= screenW * 0.88 && vh >= screenH * 0.88;
  if (coversScreen) return 'window-frame';

  const matchesViewport =
    Math.abs(vw - viewW) <= viewW * 0.12 && Math.abs(vh - viewH) <= viewH * 0.12;
  if (matchesViewport) return 'window-frame';

  return 'browser-frame';
}

/** Canvas size aligned to shared video — avoids top/bottom letterbox gaps; does not touch toolbar DOM. */
export async function resolveInjectedStreamCanvasLayout(
  stream: MediaStream
): Promise<CaptureCanvasLayout> {
  const render = pickRenderForDisplayStream(stream);
  const { width: pxW, height: pxH } = await measureStreamVideoPixels(stream);
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  if (!pxW || !pxH) {
    return { canvasWidth: winW, canvasHeight: winH, render: 'window-frame' };
  }

  const surface = stream.getVideoTracks()[0]?.getSettings()?.displaySurface;
  const dpr = window.devicePixelRatio || 1;
  const videoCssW = pxW / dpr;
  const videoCssH = pxH / dpr;
  const videoAspect = videoCssW / Math.max(1, videoCssH);
  const winAspect = winW / Math.max(1, winH);
  const aspectClose = Math.abs(videoAspect - winAspect) <= 0.1;

  if (
    render === 'window-frame' ||
    surface === 'monitor' ||
    surface === 'window' ||
    aspectClose ||
    (pxW >= winW * dpr * 0.9 && pxH >= winH * dpr * 0.9)
  ) {
    return { canvasWidth: winW, canvasHeight: winH, render: 'window-frame' };
  }

  let canvasWidth = winW;
  let canvasHeight = Math.round(winW / videoAspect);
  if (canvasHeight > winH) {
    canvasHeight = winH;
    canvasWidth = Math.round(winH * videoAspect);
  }

  return { canvasWidth, canvasHeight, render: 'browser-frame' };
}
