import { useEffect, useRef } from 'react';
import {
  JsWebScreenShotCancelledError,
  JsWebScreenShotClosedError,
  startJsWebScreenShotCapture
} from '@screenshot/editor-react';
import {
  applyPluginShotCursorFix,
  removePluginShotCursorFix,
  schedulePluginShotCursorFix
} from './plugin-shot-cursor-fix.js';

export function PluginShotScreen() {
  const startedRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add('plugin-shot-mode');
    applyPluginShotCursorFix();

    return () => {
      document.documentElement.classList.remove('plugin-shot-mode');
      removePluginShotCursorFix();
    };
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const api = window.desktopApi;
    if (
      typeof api?.getScreenCaptureSource !== 'function' ||
      typeof api?.completePluginShot !== 'function' ||
      typeof api?.showPluginShotWindow !== 'function'
    ) {
      console.error('[PluginShotScreen] desktopApi missing plugin-shot handlers');
      void api?.cancelPluginShot?.();
      return;
    }

    const bridge = {
      getScreenCaptureSource: (params?: { displayId?: number }) => api.getScreenCaptureSource!(params),
      getPluginShotWorkAreaSnapshot: () =>
        typeof api.getPluginShotWorkAreaSnapshot === 'function'
          ? api.getPluginShotWorkAreaSnapshot()
          : Promise.resolve(null),
      onPluginReady: () => {
        schedulePluginShotCursorFix();
        api.showPluginShotWindow!();
      }
    };

    void startJsWebScreenShotCapture({}, bridge)
      .then((dataUrl) => {
        api.completePluginShot({ dataUrl });
      })
      .catch((err) => {
        if (err instanceof JsWebScreenShotCancelledError || err instanceof JsWebScreenShotClosedError) {
          api.cancelPluginShot();
          return;
        }
        console.error('[PluginShotScreen] capture failed', err);
        api.cancelPluginShot();
      });
  }, []);

  return null;
}
