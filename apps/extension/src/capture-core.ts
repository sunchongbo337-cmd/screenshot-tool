import ScreenShot from 'js-web-screen-shot';
import { pickRenderForDisplayStream, resolveInjectedStreamCanvasLayout } from './capture-layout.js';
import {
  applyCaptureToolbarPreserveStyles,
  removeCaptureToolbarPreserveStyles
} from './capture-toolbar-preserve.js';

const GREEN_BORDER = 'rgba(38, 220, 98, 0.98)';

async function waitForDisplayStreamReady(stream: MediaStream, timeoutMs = 2500): Promise<void> {
  const track = stream.getVideoTracks()[0];
  if (!track) return;

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;

  const cleanup = () => {
    video.pause();
    video.removeAttribute('src');
    video.srcObject = null;
  };

  try {
    await video.play().catch(() => undefined);

    let lastW = 0;
    let lastH = 0;
    let stableFrames = 0;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w > 0 && h > 0) {
        if (w === lastW && h === lastH) stableFrames += 1;
        else {
          lastW = w;
          lastH = h;
          stableFrames = 0;
        }
        if (stableFrames >= 2) return;
      }
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
    }
  } finally {
    cleanup();
  }
}

export class CaptureCancelledError extends Error {
  constructor() {
    super('cancelled');
    this.name = 'CaptureCancelledError';
  }
}

/** User closed the share picker or dismissed capture — not a failure. */
function isBenignCaptureDismissal(err: unknown): boolean {
  if (err instanceof CaptureCancelledError) return true;
  if (err instanceof DOMException) {
    const name = err.name;
    if (name === 'NotAllowedError' || name === 'AbortError' || name === 'NotFoundError') {
      return true;
    }
  }
  const message = err instanceof Error ? err.message : String(err ?? '');
  return /cancel|aborted|denied|dismiss|not allowed|permission/i.test(message);
}

export function normalizeBase64(base64: string): string {
  const raw = String(base64 ?? '').trim();
  if (!raw) return '';
  if (raw.startsWith('data:')) return raw;
  if (/^base64,/i.test(raw)) return `data:image/png;base64,${raw.replace(/^base64,/i, '')}`;
  return `data:image/png;base64,${raw}`;
}

export function dataUrlToBlob(dataUrl: string): Blob | null {
  const normalized = normalizeBase64(dataUrl);
  const comma = normalized.indexOf(',');
  if (comma < 0) return null;
  const header = normalized.slice(0, comma);
  const b64 = normalized.slice(comma + 1).trim();
  if (!b64) return null;
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? 'image/png';
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  } catch {
    return null;
  }
}

function stopStream(stream: MediaStream | null | undefined) {
  stream?.getTracks().forEach((t) => {
    try {
      t.stop();
    } catch {
      // ignore
    }
  });
}

async function assertBlobHasVisiblePixels(blob: Blob): Promise<void> {
  if (typeof createImageBitmap !== 'function') return;

  const bmp = await createImageBitmap(blob);
  const w = Math.min(48, bmp.width);
  const h = Math.min(48, bmp.height);
  if (w < 2 || h < 2) {
    bmp.close();
    throw new Error('截图尺寸无效');
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    bmp.close();
    throw new Error('无法校验截图');
  }
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  const { data } = ctx.getImageData(0, 0, w, h);
  let hits = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]!;
    const lum = data[i]! + data[i + 1]! + data[i + 2]!;
    if (a > 12 && lum > 24) hits++;
  }
  if (hits < 4) {
    throw new Error('截图为空白，请换共享「窗口」或「整个屏幕」后重试');
  }
}

function startRegionCaptureWithStream(stream: MediaStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let plugin: { destroyComponents?: () => void } | null = null;

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const cleanup = () => {
      stopStream(stream);
      try {
        plugin?.destroyComponents?.();
      } catch {
        // ignore
      }
      plugin = null;
      document.body.classList.remove('no-cursor');
      document.documentElement.style.overflow = '';
      removeCaptureToolbarPreserveStyles();
    };

    void (async () => {
      try {
        await waitForDisplayStreamReady(stream);
        const layout = await resolveInjectedStreamCanvasLayout(stream);

        window.scrollTo(0, 0);
        document.documentElement.style.overflow = 'hidden';
        applyCaptureToolbarPreserveStyles();

        plugin = new ScreenShot({
          capture: {
            source: 'injected-stream',
            stream,
            render: layout.render,
            cursor: 'never'
          },
          writeBase64: false,
          showScreenData: true,
          clickCutFullScreen: true,
          canvasWidth: layout.canvasWidth,
          canvasHeight: layout.canvasHeight,
          imgAutoFit: true,
          wrcReplyTime: 800,
          level: 99999,
          cutBoxBdColor: GREEN_BORDER,
          completeCallback: (res) => {
            finish(() => {
              void (async () => {
                try {
                  const dataUrl = normalizeBase64(String(res?.base64 ?? ''));
                  const blob = dataUrlToBlob(dataUrl);
                  if (!blob || blob.size < 1024) {
                    throw new Error('截图数据无效，请重新框选后再点确定');
                  }
                  await assertBlobHasVisiblePixels(blob);
                  await copyImageToClipboard(dataUrl, blob);
                  cleanup();
                  resolve(dataUrl);
                } catch (err) {
                  cleanup();
                  reject(err);
                }
              })();
            });
          },
          closeCallback: () => {
            finish(() => {
              cleanup();
              reject(new CaptureCancelledError());
            });
          },
          cancelCallback: () => {
            finish(() => {
              cleanup();
              reject(new CaptureCancelledError());
            });
          }
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    })();
  });
}

async function copyImageToClipboard(dataUrl: string, blob: Blob) {
  try {
    const resp = await chrome.runtime.sendMessage({
      type: 'CLIPBOARD_IMAGE',
      dataUrl
    });
    if (resp?.ok) return;
    if (resp?.error) throw new Error(String(resp.error));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!/receiving end does not exist/i.test(msg)) {
      console.warn('[sshot] background clipboard failed, fallback in page', msg);
    }
  }

  const pngBlob = blob.type === 'image/png' ? blob : dataUrlToBlob(dataUrl);
  if (!pngBlob) throw new Error('无法生成 PNG');

  if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': Promise.resolve(pngBlob)
      })
    ]);
    return;
  }

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `screenshot_${Date.now()}.png`;
  a.click();
  throw new Error('无法写入剪贴板，已改为下载 PNG');
}

function showToast(message: string, isError = false) {
  const root = document.documentElement ?? document.body;
  if (!root) return;
  const id = '__sshot_toast';
  document.getElementById(id)?.remove();
  const el = document.createElement('div');
  el.id = id;
  el.textContent = message;
  el.style.cssText = [
    'position:fixed',
    'left:50%',
    'bottom:24px',
    'transform:translateX(-50%)',
    'z-index:2147483647',
    'padding:10px 16px',
    'border-radius:10px',
    'font:13px/1.4 system-ui,sans-serif',
    'color:#e7eaf0',
    isError ? 'background:rgba(180,40,40,0.95)' : 'background:rgba(24,28,36,0.96)',
    'border:1px solid rgba(255,255,255,0.12)',
    'box-shadow:0 12px 40px rgba(0,0,0,0.35)',
    'max-width:min(420px,calc(100vw - 32px))',
    'text-align:center'
  ].join(';');
  root.appendChild(el);
  window.setTimeout(() => el.remove(), isError ? 6000 : 3000);
}

let captureBusy = false;

async function runCapturePipeline(streamPromise: Promise<MediaStream>) {
  if (captureBusy) return;
  captureBusy = true;
  let stream: MediaStream | null = null;
  try {
    stream = await streamPromise;
    await waitForDisplayStreamReady(stream);
    await startRegionCaptureWithStream(stream);
    stream = null;
    showToast('已复制到剪贴板');
  } catch (err) {
    stopStream(stream);
    if (isBenignCaptureDismissal(err)) return;
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[sshot] capture failed', message);
    showToast(`截图失败：${message}`, true);
    try {
      chrome.runtime.sendMessage({ type: 'SCREENSHOT_ERROR', message, source: 'content' });
    } catch {
      // ignore
    }
  } finally {
    captureBusy = false;
  }
}

function getStreamFromDesktopCaptureId(streamId: string): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: streamId,
        maxFrameRate: 30
      }
    } as MediaTrackConstraints
  });
}

export function beginCaptureWithStreamId(streamId: string) {
  if (captureBusy || !streamId) return;
  void runCapturePipeline(getStreamFromDesktopCaptureId(streamId));
}

export function beginCaptureFromUserGesture() {
  if (captureBusy) return;
  if (!navigator.mediaDevices?.getDisplayMedia) {
    showToast('当前环境不支持屏幕共享', true);
    return;
  }
  const streamPromise = navigator.mediaDevices.getDisplayMedia({
    video: { cursor: 'never' } as MediaTrackConstraints,
    audio: false
  });
  void runCapturePipeline(streamPromise);
}

export function registerCaptureRuntime() {
  const g = globalThis as typeof globalThis & {
    __sshotStartCapture?: () => void;
    __sshotStartCaptureWithStreamId?: (streamId: string) => void;
    __sshotCaptureBooted?: boolean;
  };

  g.__sshotStartCapture = beginCaptureFromUserGesture;
  g.__sshotStartCaptureWithStreamId = beginCaptureWithStreamId;

  if (g.__sshotCaptureBooted) return;
  g.__sshotCaptureBooted = true;

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.dataset.sshotExtension = '1';
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === 'PING') {
      sendResponse({ ok: true });
      return;
    }
    if (msg?.type === 'CAPTURE_REQUEST') {
      beginCaptureFromUserGesture();
      sendResponse({ ok: true });
      return;
    }
    if (msg?.type === 'CAPTURE_STREAM_ID' && typeof msg.streamId === 'string') {
      beginCaptureWithStreamId(msg.streamId);
      sendResponse({ ok: true });
      return;
    }
  });
}
