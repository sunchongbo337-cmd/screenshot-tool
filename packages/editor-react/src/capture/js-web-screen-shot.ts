import type {
  ScreenShotCaptureOptions,
  ScreenShotOptions
} from 'js-web-screen-shot/dist/lib/type/components/screenshot.js';
import {
  buildDisplayLayoutFromSource,
  createElectronDesktopMediaStream,
  cropAndFreezeDesktopStreamToWorkArea,
  stopMediaStream,
  waitForMediaStreamReady,
  type ElectronScreenCaptureSource
} from './electron-screen-stream.js';

/** Options exposed to app code (official `capture` API; no deprecated enableWebRtc/screenFlow). */
export type JsWebScreenShotStartOptions = Pick<
  ScreenShotOptions,
  | 'capture'
  | 'hiddenToolIco'
  | 'writeBase64'
  | 'level'
  | 'clickCutFullScreen'
  | 'cutBoxBdColor'
  | 'menuBarHeight'
  | 'exportOptions'
  | 'showScreenData'
  | 'canvasWidth'
  | 'canvasHeight'
  | 'imgAutoFit'
  | 'wrcReplyTime'
  | 'wrcImgPosition'
>;

/** Match desktop native overlay selection color (WeChat-like green). */
export const JS_WEB_SCREEN_SHOT_GREEN_BORDER = 'rgba(38, 220, 98, 0.98)';

type ScreenShotPluginCtor = new (options: ScreenShotOptions) => {
  destroyComponents?: () => void;
};

const JS_WEB_SCREEN_SHOT_CTOR_KEY = '__jsWebScreenShotCtor__';

let cachedCtor: ScreenShotPluginCtor | null = null;

export function normalizeJsWebScreenShotBase64(base64: string): string {
  if (base64.startsWith('data:')) return base64;
  if (/^base64,/i.test(base64)) return `data:image/png,${base64.replace(/^base64,/i, '')}`;
  return `data:image/png;base64,${base64}`;
}

function readCachedJsWebScreenShotCtor(): ScreenShotPluginCtor | null {
  if (typeof window === 'undefined') return null;
  const g = (window as unknown as Record<string, unknown>)[JS_WEB_SCREEN_SHOT_CTOR_KEY];
  return typeof g === 'function' ? (g as ScreenShotPluginCtor) : null;
}

/** Resolve js-web-screen-shot constructor from npm bundle (never the repo annotation UMD). */
export async function resolveJsWebScreenShotPluginCtor(): Promise<ScreenShotPluginCtor> {
  const cached = readCachedJsWebScreenShotCtor();
  if (cached) return cached;
  if (cachedCtor) return cachedCtor;

  const mod = await import('js-web-screen-shot');
  const ctor = (mod as { default?: ScreenShotPluginCtor }).default;
  if (typeof ctor !== 'function') {
    throw new Error('js-web-screen-shot: invalid default export');
  }
  cachedCtor = ctor;
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>)[JS_WEB_SCREEN_SHOT_CTOR_KEY] = ctor;
  }
  return ctor;
}

const DEFAULT_HIDDEN_TOOL_ICO: NonNullable<ScreenShotOptions['hiddenToolIco']> = {
  square: true,
  round: true,
  brush: true,
  separateLine: true
};

/** Use full js-web-screen-shot toolbar (OCR / translate / etc.) unless caller opts into hiddenToolIco. */
export const JS_WEB_SCREEN_SHOT_USE_FULL_TOOLBAR = true;

export class JsWebScreenShotCancelledError extends Error {
  constructor(message = '截图已取消') {
    super(message);
    this.name = 'JsWebScreenShotCancelledError';
  }
}

export class JsWebScreenShotClosedError extends Error {
  constructor(message = '截图已关闭') {
    super(message);
    this.name = 'JsWebScreenShotClosedError';
  }
}

export type JsWebScreenShotDesktopBridge = {
  getScreenCaptureSource?: (params?: { displayId?: number }) => Promise<ElectronScreenCaptureSource>;
  /** Pre-captured work-area bitmap from main process (desktopCapturer; no system cursor). */
  getPluginShotWorkAreaSnapshot?: () => Promise<string | null>;
  /** Called after screen stream is ready and plugin UI is mounted — safe to show capture window. */
  onPluginReady?: () => void | Promise<void>;
};

type DesktopAcquireResult =
  | { kind: 'image'; imageSrc: string; desktopSource?: ElectronScreenCaptureSource }
  | { kind: 'stream'; stream: MediaStream; desktopSource?: ElectronScreenCaptureSource };

function buildDesktopPluginOverlayOptions(
  source: ElectronScreenCaptureSource
): Pick<ScreenShotOptions, 'canvasWidth' | 'canvasHeight' | 'imgAutoFit' | 'wrcReplyTime' | 'menuBarHeight'> {
  const wa = source.workArea;
  return {
    canvasWidth: wa?.width ?? (typeof window !== 'undefined' ? window.innerWidth : 0),
    canvasHeight: wa?.height ?? (typeof window !== 'undefined' ? window.innerHeight : 0),
    imgAutoFit: true,
    wrcReplyTime: 120,
    menuBarHeight: 0
  };
}

async function acquireDesktopScreenFlow(
  bridge: JsWebScreenShotDesktopBridge | null | undefined
): Promise<{ stream: MediaStream; desktopSource?: ElectronScreenCaptureSource } | undefined> {
  if (!bridge?.getScreenCaptureSource) return undefined;
  const source = await bridge.getScreenCaptureSource();
  if (!source?.sourceId) throw new Error('无法获取屏幕捕获源');

  const raw = await createElectronDesktopMediaStream(source.sourceId);
  await waitForMediaStreamReady(raw);

  const layout = buildDisplayLayoutFromSource(source);
  const stream = layout
    ? await cropAndFreezeDesktopStreamToWorkArea(raw, layout)
    : raw;

  return { stream, desktopSource: source };
}

async function acquireDesktopCapture(
  bridge: JsWebScreenShotDesktopBridge | null | undefined
): Promise<DesktopAcquireResult | undefined> {
  if (!bridge?.getScreenCaptureSource && !bridge?.getPluginShotWorkAreaSnapshot) return undefined;

  const snapshot = await bridge.getPluginShotWorkAreaSnapshot?.().catch(() => null);
  if (typeof snapshot === 'string' && snapshot.length > 100) {
    const desktopSource = bridge.getScreenCaptureSource
      ? await bridge.getScreenCaptureSource()
      : undefined;
    return { kind: 'image', imageSrc: snapshot, desktopSource };
  }

  const streamResult = await acquireDesktopScreenFlow(bridge);
  if (!streamResult) return undefined;
  return { kind: 'stream', stream: streamResult.stream, desktopSource: streamResult.desktopSource };
}

/** Wait until display-media track / video element report stable dimensions. */
export async function waitForDisplayStreamReady(stream: MediaStream, timeoutMs = 2500): Promise<void> {
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

    const { width = 0, height = 0 } = track.getSettings();
    if (width > 0 && height > 0) return;

    await new Promise<void>((resolve) => {
      const finish = () => window.setTimeout(resolve, 120);
      const timer = window.setTimeout(finish, Math.max(0, deadline - Date.now()));
      track.onunmute = () => {
        if ((track.getSettings().width ?? 0) > 0) {
          window.clearTimeout(timer);
          finish();
        }
      };
    });
  } finally {
    cleanup();
  }
}

/** Fix mask vs capture scale (DPR / scroll size); use with display-media / injected-stream. */
export function buildWebRtcOverlayOptions(
  partial?: Pick<ScreenShotOptions, 'canvasWidth' | 'canvasHeight' | 'imgAutoFit' | 'wrcReplyTime'>
): Pick<ScreenShotOptions, 'canvasWidth' | 'canvasHeight' | 'imgAutoFit' | 'wrcReplyTime'> {
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 0;
  return {
    canvasWidth: viewportW,
    canvasHeight: viewportH,
    imgAutoFit: true,
    wrcReplyTime: 800,
    ...partial
  };
}

export { pickRenderForDisplayStream, resolveInjectedStreamCanvasLayout } from './capture-stream-layout.js';
export type { CaptureCanvasLayout } from './capture-stream-layout.js';

/** Browser: display-media; window-frame so shared screen/window fills the mask (not the live tab). */
export function buildDisplayMediaCaptureConfig(
  partial?: Partial<ScreenShotCaptureOptions>
): ScreenShotCaptureOptions {
  return {
    source: 'display-media',
    render: 'window-frame',
    cursor: 'never',
    ...partial
  };
}

/** Electron: official injected-stream capture (caller supplies desktop MediaStream). */
export function buildInjectedStreamCaptureConfig(
  stream: MediaStream,
  partial?: Partial<ScreenShotCaptureOptions>
): ScreenShotCaptureOptions {
  return {
    source: 'injected-stream',
    stream,
    render: 'window-frame',
    cursor: 'never',
    ...partial
  };
}

/** Electron: static work-area snapshot (no live stream; avoids system cursor in bitmap). */
export function buildStaticImageCaptureConfig(
  imageSrc: string,
  partial?: Partial<ScreenShotCaptureOptions>
): ScreenShotCaptureOptions {
  return {
    source: 'image',
    imageSrc,
    render: 'browser-frame',
    ...partial
  };
}

function resolveCaptureConfig(
  options: JsWebScreenShotStartOptions,
  injectedStream?: MediaStream,
  desktopWorkAreaCapture = false
): ScreenShotCaptureOptions {
  if (injectedStream) {
    return buildInjectedStreamCaptureConfig(injectedStream, {
      render: desktopWorkAreaCapture ? 'browser-frame' : 'window-frame',
      ...options.capture
    });
  }
  if (options.capture?.source) {
    return { ...options.capture };
  }
  return buildDisplayMediaCaptureConfig(options.capture);
}

function buildPluginOptions(
  options: JsWebScreenShotStartOptions,
  capture: ScreenShotCaptureOptions,
  handlers: Pick<ScreenShotOptions, 'completeCallback' | 'closeCallback' | 'cancelCallback'>,
  desktopSource?: ElectronScreenCaptureSource
): ScreenShotOptions {
  const usesWebRtc =
    capture.source === 'display-media' ||
    capture.source === 'injected-stream' ||
    Boolean(capture.stream);

  const desktopOverlay = desktopSource ? buildDesktopPluginOverlayOptions(desktopSource) : null;

  return {
    writeBase64: false,
    showScreenData: true,
    clickCutFullScreen: true,
    level: 99999,
    cutBoxBdColor: JS_WEB_SCREEN_SHOT_GREEN_BORDER,
    ...(JS_WEB_SCREEN_SHOT_USE_FULL_TOOLBAR ? {} : { hiddenToolIco: DEFAULT_HIDDEN_TOOL_ICO }),
    ...(desktopOverlay ?? (usesWebRtc ? buildWebRtcOverlayOptions() : {})),
    ...options,
    capture,
    ...handlers
  };
}

/** Start js-web-screen-shot and resolve with a PNG data URL when the user confirms. */
export function startJsWebScreenShotCapture(
  options: JsWebScreenShotStartOptions = {},
  desktopBridge?: JsWebScreenShotDesktopBridge | null
): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let plugin: { destroyComponents?: () => void } | null = null;
    let screenFlow: MediaStream | undefined;

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const cleanup = async () => {
      stopMediaStream(screenFlow);
      screenFlow = undefined;
      try {
        plugin?.destroyComponents?.();
      } catch {
        // ignore
      }
    };

    void (async () => {
      try {
        const desktopCapture = await acquireDesktopCapture(desktopBridge);
        let desktopSource: ElectronScreenCaptureSource | undefined;
        let capture: ScreenShotCaptureOptions;

        if (desktopCapture?.kind === 'image') {
          desktopSource = desktopCapture.desktopSource;
          capture = buildStaticImageCaptureConfig(desktopCapture.imageSrc, options.capture);
        } else if (desktopCapture?.kind === 'stream') {
          screenFlow = desktopCapture.stream;
          desktopSource = desktopCapture.desktopSource;
          capture = resolveCaptureConfig(
            options,
            screenFlow,
            Boolean(desktopSource?.workArea)
          );
        } else {
          capture = resolveCaptureConfig(options, undefined, false);
        }

        const PluginCtor = await resolveJsWebScreenShotPluginCtor();
        plugin = new PluginCtor(
          buildPluginOptions(
            options,
            capture,
            {
            completeCallback: (res) => {
              finish(() => {
                void (async () => {
                  try {
                    const raw = res?.base64 ?? '';
                    if (!raw) throw new Error('js-web-screen-shot completeCallback: missing base64');
                    resolve(normalizeJsWebScreenShotBase64(String(raw)));
                  } catch (err) {
                    reject(err);
                  } finally {
                    await cleanup();
                  }
                })();
              });
            },
            closeCallback: () => {
              finish(() => {
                void cleanup().finally(() => reject(new JsWebScreenShotClosedError()));
              });
            },
            cancelCallback: () => {
              finish(() => {
                void cleanup().finally(() => reject(new JsWebScreenShotCancelledError()));
              });
            }
          },
            desktopSource
          )
        );
        await new Promise<void>((r) => {
          window.requestAnimationFrame(() => window.requestAnimationFrame(() => r()));
        });
        await desktopBridge?.onPluginReady?.();
      } catch (err) {
        finish(() => {
          void cleanup().finally(() => reject(err));
        });
      }
    })();
  });
}
