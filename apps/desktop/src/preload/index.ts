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

type CaptureAppPrefsBridge = {
  copyToClipboardAfterCapture: boolean;
  playSoundAfterCapture: boolean;
  editorAlwaysOnTop: boolean;
  openFolderAfterSave: boolean;
  minimizeEditorAfterSave: boolean;
  defaultSaveDir: string;
  saveFilenamePattern: string;
  saveFilenameNextNumber: number;
  defaultTemplateNamePattern: string;
  defaultTemplateNextNumber: number;
  captureDelaySeconds: number;
  closeButtonAction: 'quit' | 'minimize';
  toolbarCloseButtonAction: 'exit_editing' | 'close_current';
  multiImageNavMode: 'tabs' | 'arrows';
  autoSaveImages: boolean;
  finishButtonAction: 'save' | 'next';
  hotkeyRegionCapture: string;
  hotkeyJsWebScreenShot: string;
  hotkeyBrowserScreenCapture: string;
};

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
  /** Title-bar [X] or toolbar ✕ — honors closeButtonAction pref. */
  closeEditorWindow() {
    ipcRenderer.send('desktop:closeEditor');
  },
  async getCapturePrefs(): Promise<CaptureAppPrefsBridge> {
    return await ipcRenderer.invoke('desktop:getCapturePrefs');
  },
  async setCapturePrefs(partial: Partial<CaptureAppPrefsBridge>): Promise<CaptureAppPrefsBridge> {
    return await ipcRenderer.invoke('desktop:setCapturePrefs', partial);
  },
  onCapturePrefsChanged(cb: (prefs: CaptureAppPrefsBridge) => void) {
    const handler = (_evt: unknown, payload: CaptureAppPrefsBridge) => cb(payload);
    ipcRenderer.on('desktop:capturePrefsChanged', handler);
    return () => ipcRenderer.removeListener('desktop:capturePrefsChanged', handler);
  },
  completePluginShot(params: { dataUrl: string }) {
    ipcRenderer.send('desktop:completePluginShot', params);
  },
  cancelPluginShot() {
    ipcRenderer.send('desktop:cancelPluginShot');
  },
  showPluginShotWindow() {
    ipcRenderer.send('desktop:showPluginShotWindow');
  },
  setCaptureShortcutsSuspended(payload: { suspended: boolean }) {
    ipcRenderer.send('desktop:setCaptureShortcutsSuspended', payload);
  },
  async pickDefaultSaveFolder(): Promise<{ ok: false } | { ok: true; path: string }> {
    return await ipcRenderer.invoke('desktop:pickDefaultSaveFolder');
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
  async saveFile(params: {
    dataUrl: string;
    format: 'png' | 'jpeg' | 'webp';
    /** When true, write to default folder without save dialog (editor:saveFileAuto). */
    auto?: boolean;
    defaultSaveDir?: string;
    saveFilenamePattern?: string;
    saveFilenameNextNumber?: number;
  }) {
    if (params.auto) {
      return await ipcRenderer.invoke('editor:saveFileAuto', params);
    }
    return await ipcRenderer.invoke('editor:saveFile', params);
  },
  async saveFileAuto(params: {
    dataUrl: string;
    format: 'png' | 'jpeg' | 'webp';
    defaultSaveDir?: string;
    saveFilenamePattern?: string;
    saveFilenameNextNumber?: number;
  }) {
    return await ipcRenderer.invoke('editor:saveFileAuto', params);
  },
  /** Escape hatch when desktopApi is missing newer methods after preload hot-reload. */
  async invoke(channel: string, payload?: unknown) {
    return await ipcRenderer.invoke(channel, payload);
  },
  async copyClipboard(params: { dataUrl: string }) {
    return await ipcRenderer.invoke('editor:copyClipboard', params);
  },
  async readClipboardImage() {
    return await ipcRenderer.invoke('editor:readClipboardImage');
  },
  async getScreenCaptureSource(params?: { displayId?: number }) {
    return await ipcRenderer.invoke('desktop:getScreenCaptureSource', params ?? {});
  },
  async getPluginShotWorkAreaSnapshot() {
    return await ipcRenderer.invoke('desktop:getPluginShotWorkAreaSnapshot');
  },
  async openImageFile() {
    return await ipcRenderer.invoke('editor:openFile');
  },
  async openImageFiles() {
    return await ipcRenderer.invoke('editor:openImageFiles');
  },
  async readImageFile(params: { path: string }) {
    return await ipcRenderer.invoke('editor:readImageFile', params);
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

