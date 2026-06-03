import { DEFAULT_HOTKEY_WEB_REGION_CAPTURE, matchesHotkeyEvent } from '@screenshot/editor-core';
import { resolveInjectedStreamCanvasLayout } from './capture-stream-layout.js';
import {
  JsWebScreenShotCancelledError,
  JsWebScreenShotClosedError,
  startJsWebScreenShotCapture,
  buildDisplayMediaCaptureConfig,
  buildInjectedStreamCaptureConfig,
  waitForDisplayStreamReady,
  type JsWebScreenShotStartOptions
} from './js-web-screen-shot.js';

export type WebRegionCaptureHotkeyOptions = {
  hotkey?: string;
  shouldHandle?: () => boolean;
  beforeCapture?: () => boolean;
  isBusy?: () => boolean;
  setBusy?: (busy: boolean) => void;
  onCapture: (dataUrl: string) => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function startWebRegionCapture(
  options: Omit<JsWebScreenShotStartOptions, 'capture'> = {}
): Promise<string> {
  return startJsWebScreenShotCapture({
    ...options,
    capture: buildDisplayMediaCaptureConfig()
  });
}

export function startWebRegionCaptureFromGesture(
  options: Omit<JsWebScreenShotStartOptions, 'capture'> = {}
): Promise<string> {
  return navigator.mediaDevices
    .getDisplayMedia({
      video: { cursor: 'never' } as MediaTrackConstraints,
      audio: false
    })
    .then(async (stream) => {
      await waitForDisplayStreamReady(stream);
      const layout = await resolveInjectedStreamCanvasLayout(stream);
      return startJsWebScreenShotCapture({
        ...options,
        canvasWidth: layout.canvasWidth,
        canvasHeight: layout.canvasHeight,
        imgAutoFit: true,
        capture: buildInjectedStreamCaptureConfig(stream, { render: layout.render })
      });
    });
}

export function installWebRegionCaptureHotkey(options: WebRegionCaptureHotkeyOptions): () => void {
  const hotkey = options.hotkey ?? DEFAULT_HOTKEY_WEB_REGION_CAPTURE;

  const onKeyDown = (e: KeyboardEvent) => {
    if (options.shouldHandle?.() === false) return;
    if (!matchesHotkeyEvent(e, hotkey)) return;
    if (options.beforeCapture?.() === false) return;
    e.preventDefault();
    if (options.isBusy?.()) return;

    options.setBusy?.(true);
    void startWebRegionCaptureFromGesture()
      .then((url) => options.onCapture(url))
      .catch((err) => {
        if (err instanceof JsWebScreenShotCancelledError || err instanceof JsWebScreenShotClosedError) return;
        if (err instanceof DOMException && err.name === 'NotAllowedError') return;
        options.onError?.(err);
      })
      .finally(() => options.setBusy?.(false));
  };

  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}
