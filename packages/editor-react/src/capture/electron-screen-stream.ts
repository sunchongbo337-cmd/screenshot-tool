export type ElectronScreenCaptureSource = {
  sourceId: string;
  displayId: number;
  bounds?: { x: number; y: number; width: number; height: number };
  workArea?: { x: number; y: number; width: number; height: number };
  scaleFactor?: number;
};

export type DisplayLayout = {
  bounds: { x: number; y: number; width: number; height: number };
  workArea: { x: number; y: number; width: number; height: number };
  scaleFactor: number;
};

type ElectronDesktopVideoConstraints = MediaTrackConstraints & {
  chromeMediaSource?: 'desktop';
  chromeMediaSourceId?: string;
  maxWidth?: number;
  maxHeight?: number;
  maxFrameRate?: number;
  cursor?: 'never' | 'always' | 'motion';
};

function workAreaCropRect(
  layout: DisplayLayout,
  videoWidth: number,
  videoHeight: number
): { sx: number; sy: number; sw: number; sh: number } {
  const { bounds, workArea } = layout;
  const scaleX = videoWidth / Math.max(1, bounds.width);
  const scaleY = videoHeight / Math.max(1, bounds.height);
  return {
    sx: Math.max(0, (workArea.x - bounds.x) * scaleX),
    sy: Math.max(0, (workArea.y - bounds.y) * scaleY),
    sw: Math.max(1, workArea.width * scaleX),
    sh: Math.max(1, workArea.height * scaleY)
  };
}

/** Acquire a desktop MediaStream from an Electron desktopCapturer source id. */
export async function createElectronDesktopMediaStream(sourceId: string): Promise<MediaStream> {
  if (!sourceId) throw new Error('Missing desktop capture source id');

  const attempts: ElectronDesktopVideoConstraints[] = [
    {
      chromeMediaSource: 'desktop',
      chromeMediaSourceId: sourceId,
      maxWidth: 7680,
      maxHeight: 4320,
      maxFrameRate: 30,
      cursor: 'never'
    },
    {
      // Legacy Chromium/Electron constraint shape.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceId,
        maxWidth: 7680,
        maxHeight: 4320,
        maxFrameRate: 30,
        cursor: 'never'
      }
    } as any
  ];

  let lastErr: unknown = null;
  for (const video of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: false, video });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr ?? 'getUserMedia failed'));
}

/** Wait until the desktop stream produces a non-empty video frame. */
export async function waitForMediaStreamReady(stream: MediaStream, timeoutMs = 8000): Promise<void> {
  const track = stream.getVideoTracks()[0];
  if (!track) throw new Error('No video track in desktop stream');

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;

  try {
    await video.play().catch(() => undefined);

    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('等待屏幕画面超时')), timeoutMs);
      const done = () => {
        if (video.videoWidth <= 0 || video.videoHeight <= 0) return;
        window.clearTimeout(timer);
        resolve();
      };

      video.onloadeddata = done;
      video.onloadedmetadata = done;
      if (track.readyState === 'live') {
        window.requestAnimationFrame(() => done());
      }
      track.onunmute = () => done();
    });
  } finally {
    video.pause();
    video.srcObject = null;
  }
}

/**
 * Crop full-screen desktop capture to work area (excludes taskbar) and freeze to a still stream
 * so the overlay UI / cursor never pollutes the captured bitmap.
 */
export async function cropAndFreezeDesktopStreamToWorkArea(
  stream: MediaStream,
  layout: DisplayLayout
): Promise<MediaStream> {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;

  try {
    await video.play().catch(() => undefined);
    await waitForMediaStreamReady(stream);

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw <= 0 || vh <= 0) throw new Error('Invalid desktop frame size');

    const { sx, sy, sw, sh } = workAreaCropRect(layout, vw, vh);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot crop desktop frame');

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    stopMediaStream(stream);

    const frozen = canvas.captureStream(1);
    const track = frozen.getVideoTracks()[0];
    track?.addEventListener('ended', () => {
      try {
        track.stop();
      } catch {
        // ignore
      }
    });
    return frozen;
  } finally {
    video.pause();
    video.srcObject = null;
  }
}

export function stopMediaStream(stream: MediaStream | null | undefined) {
  stream?.getTracks().forEach((track) => {
    try {
      track.stop();
    } catch {
      // ignore
    }
  });
}

export function buildDisplayLayoutFromSource(source: ElectronScreenCaptureSource): DisplayLayout | null {
  if (!source.bounds || !source.workArea) return null;
  return {
    bounds: source.bounds,
    workArea: source.workArea,
    scaleFactor: source.scaleFactor ?? 1
  };
}
