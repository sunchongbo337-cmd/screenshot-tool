import { contextBridge, ipcRenderer } from 'electron';

function logToMain(message: string) {
  try {
    ipcRenderer.send('desktop:log', { source: 'preload', message });
  } catch {
    // ignore
  }
}

logToMain('loaded');
try {
  // Diagnose Electron renderer module surface in preload.
  // Some environments may omit desktopCapturer.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const e = require('electron') as any;
  const keys = e ? Object.keys(e).sort() : [];
  logToMain(`electron keys: ${keys.slice(0, 60).join(',')}${keys.length > 60 ? ` ...(+${keys.length - 60})` : ''}`);
  logToMain(`typeof desktopCapturer: ${typeof e?.desktopCapturer}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logToMain(`process.sandboxed: ${String((process as any).sandboxed)}`);
} catch (err) {
  logToMain(`electron diagnostics failed: ${err instanceof Error ? `${err.name}: ${err.message}` : String(err)}`);
}
try {
  void ipcRenderer.invoke('desktop:ping').then((r) => logToMain(`ping->${JSON.stringify(r)}`));
} catch {
  // ignore
}

type DisplayInfo = {
  id: number;
  bounds: { x: number; y: number; width: number; height: number };
  size: { width: number; height: number };
  scaleFactor: number;
};

async function getDisplays(): Promise<DisplayInfo[]> {
  return await ipcRenderer.invoke('desktop:getDisplays');
}

async function captureDisplay(params: { displayId: number }): Promise<{ dataUrl: string }> {
  return await ipcRenderer.invoke('desktop:captureDisplay', params);
}

function parseDataUrl(dataUrl: string): { mime: string; buffer: Uint8Array } {
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!m) throw new Error('Invalid dataUrl');
  const mime = m[1]!;
  const b64 = m[2]!;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { mime, buffer: bytes };
}

const desktopApi = {
  getDisplays,
  captureDisplay,
  onOverlayBackground(cb: (payload: { displayId: number; dataUrl: string }) => void) {
    ipcRenderer.on('overlay:bg', (_evt, payload) => cb(payload));
    return () => ipcRenderer.removeAllListeners('overlay:bg');
  },
  startCapture() {
    ipcRenderer.send('editor:startCapture');
  },
  completeCapture(dataUrl: string) {
    ipcRenderer.send('overlay:complete', { dataUrl });
  },
  cancelCapture() {
    ipcRenderer.send('overlay:cancel');
  },
  auth: {
    getSession() {
      return ipcRenderer.invoke('auth:getSession');
    },
    login(config: { issuer: string; clientId: string; scopes: string[]; audience?: string }) {
      return ipcRenderer.invoke('auth:login', config);
    },
    logout() {
      return ipcRenderer.invoke('auth:logout');
    }
  },
  onLoadImage(cb: (payload: { dataUrl: string }) => void) {
    ipcRenderer.on('editor:loadImage', (_evt, payload) => cb(payload));
    return () => ipcRenderer.removeAllListeners('editor:loadImage');
  },
  onRequireLogin(cb: () => void) {
    ipcRenderer.on('auth:requireLogin', () => {
      logToMain('received auth:requireLogin');
      cb();
    });
    return () => ipcRenderer.removeAllListeners('auth:requireLogin');
  },
  setAuthGatePassed(passed: boolean) {
    ipcRenderer.send('auth:gate', { passed: !!passed });
  },
  async saveFile(params: { dataUrl: string; format: 'png' | 'jpeg' | 'webp' }) {
    // Keep payload as dataUrl; main will write bytes.
    return await ipcRenderer.invoke('editor:saveFile', params);
  },
  async copyClipboard(params: { dataUrl: string }) {
    return await ipcRenderer.invoke('editor:copyClipboard', params);
  },
  async openImageFile() {
    return await ipcRenderer.invoke('editor:openFile');
  },
  parseDataUrl
};

try {
  // Preferred secure path when contextIsolation is enabled.
  contextBridge.exposeInMainWorld('desktopApi', desktopApi);
} catch {
  // Fallback for misconfigured builds where contextIsolation gets turned off.
  (globalThis as any).desktopApi = desktopApi;
}

export {};

