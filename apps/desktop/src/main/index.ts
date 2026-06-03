
import { execFile } from 'node:child_process';
import { app, BrowserWindow, clipboard, desktopCapturer, dialog, globalShortcut, ipcMain, nativeImage, screen, session, shell } from 'electron';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import {
  buildSaveDefaultFilename,
  bumpSaveFilenameSequenceIfNeeded,
  DEFAULT_CAPTURE_PREFS,
  loadCapturePrefs,
  saveCapturePrefs,
  type CaptureAppPrefs
} from './capture-prefs.js';
import { hotkeyToElectronAccelerator } from '@screenshot/editor-core';
import { randomBytes } from 'node:crypto';
import { loginWithLoopback, loadSession, saveSession, type OidcConfig } from './auth/oidc.js';

ipcMain.on('desktop:log', (_evt, payload: { source?: string; message: string }) => {
  const src = payload?.source ? String(payload.source) : 'unknown';
  const msg = payload?.message ? String(payload.message) : '';
  console.log(`[${src}] ${msg}`);
});

ipcMain.handle('desktop:ping', () => {
  return { ok: true as const, ts: Date.now() };
});

let editorWindow: BrowserWindow | null = null;
let cachedCapturePrefs: CaptureAppPrefs | null = null;
/** Explicit quit in progress — do not treat title-bar close as minimize. */
let appQuitting = false;
let closeButtonActionCache: 'quit' | 'minimize' = DEFAULT_CAPTURE_PREFS.closeButtonAction;
let overlayWindows: BrowserWindow[] = [];
let overlayWindowsByDisplayId: Map<number, BrowserWindow> = new Map();
let pluginShotWindow: BrowserWindow | null = null;
let pluginShotActive = false;
/** Pre-captured work-area PNG (no mouse cursor); taken before plugin overlay window exists. */
let pluginShotWorkAreaSnapshot: string | null = null;
let editorMinimizedForPluginShot = false;
let authGatePassed = false;
let captureShortcutRegistered = false;
let activeCaptureAccelerator: string | null = null;
let jsWebShotShortcutRegistered = false;
let activeJsWebShotAccelerator: string | null = null;
/** Previously registered accelerators — unregister on refresh to avoid stale Alt+A etc. */
const registeredHotkeyAccelerators = new Set<string>();
let captureShortcutsSuspended = false;
const AUTH_CHECK_CACHE_MS = 8_000;
let lastAuthCheckToken: string | null = null;
let lastAuthCheckOkAt = 0;

// Avoid multiple Electron main instances competing for the same global shortcut.
try {
  const gotLock = app.requestSingleInstanceLock();
  if (!gotLock) {
    app.quit();
  } else {
    app.on('second-instance', () => {
      try {
        if (editorWindow && !editorWindow.isDestroyed()) {
          if (editorWindow.isMinimized()) editorWindow.restore();
          editorWindow.focus();
          editorWindow.moveTop();
        }
      } catch {
        // ignore
      }
    });
  }
} catch {
  // ignore
}

const AUTH_SERVER_PORT = Number(process.env.AUTH_SERVER_PORT ?? 4177);
const AUTH_SERVER_BASE_URL = `http://127.0.0.1:${AUTH_SERVER_PORT}`;
const AUTH_SERVER_HEALTH_URL = `${AUTH_SERVER_BASE_URL}/api/health`;
let authServerStartPromise: Promise<void> | null = null;
let authServerStarting = false;

async function checkAuthServerHealthy(timeoutMs = 800): Promise<boolean> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(AUTH_SERVER_HEALTH_URL, { method: 'GET', signal: controller.signal });
    return r.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

async function ensureAuthServerRunning() {
  // Default: on. Set `AUTO_START_AUTH_SERVER=0` to disable.
  if (process.env.AUTO_START_AUTH_SERVER === '0') return;
  if (await checkAuthServerHealthy()) {
    console.log('[desktop] auth server already healthy; skip auto-start');
    return;
  }
  if (authServerStarting && authServerStartPromise) return await authServerStartPromise;
  if (authServerStartPromise) return await authServerStartPromise;
  authServerStarting = true;

  authServerStartPromise = (async () => {
    try {
      // Ensure auth-server can start without requiring an external `.env`.
      // The server requires JWT_SECRET and uses DB_PATH for persistence.
      const userDataDir = app.getPath('userData');
      const jwtSecretPath = join(userDataDir, 'jwt_secret.txt');
      const dbPath = join(userDataDir, 'auth.json');

      // JWT_SECRET
      if (!process.env.JWT_SECRET) {
        if (existsSync(jwtSecretPath)) {
          const s = await readFile(jwtSecretPath, 'utf-8');
          process.env.JWT_SECRET = s.trim();
        } else {
          const secret = randomBytes(32).toString('base64url');
          await writeFile(jwtSecretPath, secret, 'utf-8');
          process.env.JWT_SECRET = secret;
        }
      }

      // DB_PATH
      if (!process.env.DB_PATH) {
        process.env.DB_PATH = dbPath;
      }

      process.env.PORT = String(AUTH_SERVER_PORT);

      console.log('[desktop] starting auth server in-process...');

      // Import server entry (it starts listening on import).
      // Ensure vite/electron-vite includes server dependencies by bundling them into the main process.
      await import('../../../server/src/index');

      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        if (await checkAuthServerHealthy(600)) return;
        await new Promise((r) => setTimeout(r, 250));
      }
      console.warn('[desktop] auth server did not become healthy in time');
    } finally {
      authServerStarting = false;
    }
  })();

  return await authServerStartPromise;
}

function isDev() {
  return !!(process.env.ELECTRON_RENDERER_URL ?? process.env.VITE_DEV_SERVER_URL ?? '') || process.env.NODE_ENV === 'development';
}

// Electron 32+ / some environments may effectively sandbox renderers, which removes APIs
// like desktopCapturer from the preload "electron" module surface. In dev we explicitly
// disable sandbox so screen capture can work.
if (isDev()) {
  try {
    app.commandLine.appendSwitch('no-sandbox');
    app.commandLine.appendSwitch('disable-gpu-sandbox');
  } catch {
    // ignore
  }
}

function attachRendererLogging(win: BrowserWindow, label: string) {
  win.webContents.on('console-message', (_e, level, message) => {
    const tag = level >= 3 ? 'error' : level === 2 ? 'warn' : 'log';
    console.log(`[${label}:${tag}] ${message}`);
  });
  win.webContents.on('render-process-gone', (_e, details) => {
    console.warn(`[${label}:warn] render-process-gone`, details);
  });
  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.warn(`[${label}:warn] did-fail-load ${code} ${desc} ${url}`);
  });
}

function tryUnregisterAccelerator(accel: string | null | undefined) {
  if (!accel) return;
  try {
    globalShortcut.unregister(accel);
  } catch {
    // ignore
  }
}

function unregisterKnownHotkeyAccelerators(extra: Array<string | null | undefined> = []) {
  const prefs = cachedCapturePrefs ?? DEFAULT_CAPTURE_PREFS;
  const candidates = [
    ...registeredHotkeyAccelerators,
    activeCaptureAccelerator,
    activeJsWebShotAccelerator,
    hotkeyToElectronAccelerator(prefs.hotkeyRegionCapture),
    hotkeyToElectronAccelerator(prefs.hotkeyJsWebScreenShot, DEFAULT_CAPTURE_PREFS.hotkeyJsWebScreenShot),
    hotkeyToElectronAccelerator(DEFAULT_CAPTURE_PREFS.hotkeyRegionCapture),
    hotkeyToElectronAccelerator(DEFAULT_CAPTURE_PREFS.hotkeyJsWebScreenShot, DEFAULT_CAPTURE_PREFS.hotkeyJsWebScreenShot),
    ...extra
  ];
  for (const accel of new Set(candidates.filter(Boolean) as string[])) {
    tryUnregisterAccelerator(accel);
  }
}

function registerCaptureShortcut() {
  activeCaptureAccelerator = null;
  captureShortcutRegistered = false;

  if (!isDev() && !authGatePassed) return;

  const prefs = cachedCapturePrefs ?? DEFAULT_CAPTURE_PREFS;
  const accel = hotkeyToElectronAccelerator(prefs.hotkeyRegionCapture);
  const ok = globalShortcut.register(accel, () => {
    if (captureShortcutsSuspended) return;
    console.log(`[desktop] globalShortcut fired: ${accel}`);
    void (async () => {
      try {
        const okAuth = await isAuthedForCapture();
        console.log('[desktop] capture auth check:', okAuth ? 'ok' : 'not authed');
        if (!okAuth) {
          await requireLoginUi();
          return;
        }
        await startCaptureFlow();
      } catch (err) {
        console.error('[desktop] capture handler failed', err);
      }
    })();
  });
  if (ok) {
    captureShortcutRegistered = true;
    activeCaptureAccelerator = accel;
    registeredHotkeyAccelerators.add(accel);
    console.log(`[desktop] globalShortcut registered: ${accel}`);
  } else {
    console.warn(`[desktop] globalShortcut register failed: ${accel} (already taken or unavailable)`);
  }
}

function unregisterCaptureShortcut() {
  if (activeCaptureAccelerator) {
    try {
      globalShortcut.unregister(activeCaptureAccelerator);
    } catch {
      // ignore
    }
  }
  captureShortcutRegistered = false;
  activeCaptureAccelerator = null;
}

function registerJsWebScreenShotShortcut() {
  jsWebShotShortcutRegistered = false;
  activeJsWebShotAccelerator = null;

  if (!isDev() && !authGatePassed) return;

  const prefs = cachedCapturePrefs ?? DEFAULT_CAPTURE_PREFS;
  const accel = hotkeyToElectronAccelerator(DEFAULT_CAPTURE_PREFS.hotkeyJsWebScreenShot);
  const ok = globalShortcut.register(accel, () => {
    if (captureShortcutsSuspended || pluginShotActive) return;
    console.log(`[desktop] js-web-screen-shot globalShortcut fired: ${accel}`);
    void startJsWebScreenShotFlow().catch((err) => {
      pluginShotActive = false;
      console.error('[desktop] js-web-screen-shot shortcut handler failed', err);
    });
  });
  if (ok) {
    jsWebShotShortcutRegistered = true;
    activeJsWebShotAccelerator = accel;
    registeredHotkeyAccelerators.add(accel);
    console.log(`[desktop] js-web-screen-shot globalShortcut registered: ${accel}`);
  } else {
    console.warn(`[desktop] js-web-screen-shot globalShortcut register failed: ${accel}`);
  }
}

function unregisterJsWebScreenShotShortcut() {
  if (activeJsWebShotAccelerator) {
    try {
      globalShortcut.unregister(activeJsWebShotAccelerator);
    } catch {
      // ignore
    }
  }
  jsWebShotShortcutRegistered = false;
  activeJsWebShotAccelerator = null;
}

function registerAllCaptureShortcuts() {
  unregisterKnownHotkeyAccelerators();
  activeCaptureAccelerator = null;
  activeJsWebShotAccelerator = null;
  captureShortcutRegistered = false;
  jsWebShotShortcutRegistered = false;
  registerCaptureShortcut();
  registerJsWebScreenShotShortcut();
}

function refreshCaptureShortcutRegistration() {
  registerAllCaptureShortcuts();
}

function unregisterAllCaptureShortcuts() {
  unregisterKnownHotkeyAccelerators();
  captureShortcutRegistered = false;
  jsWebShotShortcutRegistered = false;
  activeCaptureAccelerator = null;
  activeJsWebShotAccelerator = null;
}

function notifyRendererCapturePrefs(prefs: CaptureAppPrefs) {
  if (!editorWindow || editorWindow.isDestroyed()) return;
  try {
    editorWindow.webContents.send('desktop:capturePrefsChanged', prefs);
  } catch {
    // ignore
  }
}

function resolvePreloadPath(): string {
  const candidates = [
    // electron-vite dev/prod output relative to main bundle (preferred: CJS preload)
    join(__dirname, '../preload/index.cjs'),
    // electron-vite dev/prod output relative to main bundle
    join(__dirname, '../preload/index.mjs'),
    // running from workspace / unpacked app directory
    join(app.getAppPath(), 'dist/preload/index.cjs'),
    join(app.getAppPath(), 'dist/preload/index.mjs'),
    // packaged variants
    join(process.resourcesPath, 'app.asar/dist/preload/index.cjs'),
    join(process.resourcesPath, 'app.asar/dist/preload/index.mjs'),
    join(process.resourcesPath, 'app/dist/preload/index.cjs'),
    join(process.resourcesPath, 'app/dist/preload/index.mjs')
  ];
  const found = candidates.find((p) => existsSync(p));
  return found ?? candidates[0]!;
}

function getRendererUrl(hash?: string) {
  const devUrl = process.env.ELECTRON_RENDERER_URL ?? process.env.VITE_DEV_SERVER_URL;
  if (devUrl) return `${devUrl}${hash ?? ''}`;
  const indexHtml = join(__dirname, '../renderer/index.html');
  return `file://${indexHtml}${hash ?? ''}`;
}

function applyCapturePrefsToRuntime(prefs: CaptureAppPrefs) {
  cachedCapturePrefs = prefs;
  closeButtonActionCache = prefs.closeButtonAction === 'minimize' ? 'minimize' : 'quit';
  registerAllCaptureShortcuts();
  notifyRendererCapturePrefs(prefs);
}

function resolveCloseButtonAction(): 'quit' | 'minimize' {
  return closeButtonActionCache;
}

function quitApplication() {
  if (appQuitting) return;
  appQuitting = true;
  unregisterAllCaptureShortcuts();
  closeOverlayWindows();
  closePluginShotWindow();
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) {
      try {
        w.destroy();
      } catch {
        // ignore
      }
    }
  }
  editorWindow = null;
  app.quit();
}

/** Title-bar [X] and renderer toolbar ✕ both use this. */
function handleEditorCloseIntent() {
  const win = editorWindow;
  if (!win || win.isDestroyed()) return;
  if (resolveCloseButtonAction() === 'minimize') {
    try {
      if (win.isFullScreen()) win.setFullScreen(false);
    } catch {
      // ignore
    }
    win.minimize();
    return;
  }
  quitApplication();
}

function attachEditorCloseHandler(win: BrowserWindow) {
  win.removeAllListeners('close');
  win.on('close', (e) => {
    if (appQuitting) return;
    e.preventDefault();
    handleEditorCloseIntent();
  });
}

function createEditorWindow() {
  const preloadPath = resolvePreloadPath();
  // Helps diagnose "desktopApi not injected" issues.
  console.log('[desktop] preload:', preloadPath);
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      // Ensure preload has full Electron renderer APIs (e.g. desktopCapturer).
      sandbox: false
    }
  });

  attachRendererLogging(win, 'editor');
  attachEditorCloseHandler(win);

  win.loadURL(getRendererUrl('#/editor'));
  return win;
}

function createOverlayWindows() {
  const preloadPath = resolvePreloadPath();
  const displays = screen.getAllDisplays();
  overlayWindowsByDisplayId = new Map();
  overlayWindows = displays.map((d) => {
    const w = new BrowserWindow({
      x: d.bounds.x,
      y: d.bounds.y,
      width: d.bounds.width,
      height: d.bounds.height,
      frame: false,
      transparent: true,
      resizable: false,
      movable: false,
      focusable: true,
      alwaysOnTop: true,
      fullscreenable: false,
      skipTaskbar: true,
      show: false,
      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        // Ensure preload has full Electron renderer APIs (e.g. desktopCapturer).
        sandbox: false
      }
    });
    attachRendererLogging(w, `overlay:${d.id}`);
    w.setAlwaysOnTop(true, 'screen-saver');
    w.loadURL(getRendererUrl(`#/overlay?displayId=${d.id}`));
    overlayWindowsByDisplayId.set(d.id, w);
    return w;
  });
}

function restoreEditorAfterPluginShot() {
  if (!editorWindow || editorWindow.isDestroyed()) return;
  if (!editorMinimizedForPluginShot) return;
  editorMinimizedForPluginShot = false;
  try {
    editorWindow.restore();
    editorWindow.show();
    editorWindow.focus();
  } catch {
    // ignore
  }
}

function disposePluginShotWindow() {
  if (pluginShotWindow && !pluginShotWindow.isDestroyed()) {
    try {
      pluginShotWindow.close();
    } catch {
      // ignore
    }
  }
  pluginShotWindow = null;
}

function closePluginShotWindow() {
  pluginShotActive = false;
  pluginShotWorkAreaSnapshot = null;
  disposePluginShotWindow();
  restoreEditorAfterPluginShot();
}

function createPluginShotWindow() {
  disposePluginShotWindow();
  const preloadPath = resolvePreloadPath();
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) ?? screen.getPrimaryDisplay();
  const area = display.workArea;
  const win = new BrowserWindow({
    x: area.x,
    y: area.y,
    width: area.width,
    height: area.height,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    focusable: true,
    show: false,
    fullscreenable: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      sandbox: false
    }
  });
  attachRendererLogging(win, 'plugin-shot');
  win.setAlwaysOnTop(true, 'screen-saver');
  win.on('closed', () => {
    pluginShotActive = false;
    if (pluginShotWindow === win) pluginShotWindow = null;
  });
  win.loadURL(getRendererUrl('#/plugin-shot'));
  pluginShotWindow = win;
  return win;
}

async function deliverCapturedImageToEditor(dataUrl: string) {
  const prefs = await loadCapturePrefs(app);
  if (prefs.copyToClipboardAfterCapture) {
    try {
      const img = nativeImage.createFromDataURL(dataUrl);
      clipboard.writeImage(img);
    } catch {
      // ignore
    }
  }
  if (prefs.playSoundAfterCapture) playCaptureDoneSound();
  if (!editorWindow || editorWindow.isDestroyed()) editorWindow = createEditorWindow();
  editorMinimizedForPluginShot = false;
  editorWindow.show();
  editorWindow.focus();
  editorWindow.webContents.send('editor:loadImage', { dataUrl });
}

async function startJsWebScreenShotFlow() {
  if (pluginShotActive) {
    if (pluginShotWindow && !pluginShotWindow.isDestroyed()) pluginShotWindow.focus();
    return;
  }
  const okAuth = await isAuthedForCapture();
  if (!okAuth) {
    await requireLoginUi();
    return;
  }
  editorMinimizedForPluginShot = false;
  if (editorWindow && !editorWindow.isDestroyed() && !editorWindow.isMinimized()) {
    editorMinimizedForPluginShot = true;
    try {
      editorWindow.minimize();
    } catch {
      editorMinimizedForPluginShot = false;
    }
  }
  pluginShotActive = true;
  pluginShotWorkAreaSnapshot = null;
  if (editorMinimizedForPluginShot) {
    await new Promise((r) => setTimeout(r, 60));
  }
  try {
    pluginShotWorkAreaSnapshot = await captureWorkAreaSnapshotInMain();
  } catch (e) {
    console.warn('[desktop] work-area snapshot failed, renderer will fallback to desktop stream', e);
  }
  createPluginShotWindow();
}

function showPluginShotWindow() {
  const win = pluginShotWindow;
  if (!win || win.isDestroyed()) return;
  if (!win.isVisible()) win.show();
  win.focus();
}

async function resolveScreenCaptureSource(displayId?: number) {
  const display =
    displayId != null
      ? screen.getAllDisplays().find((d) => d.id === displayId) ?? screen.getPrimaryDisplay()
      : screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) ?? screen.getPrimaryDisplay();

  const targetW = Math.max(1, Math.round(display.size.width * display.scaleFactor));
  const targetH = Math.max(1, Math.round(display.size.height * display.scaleFactor));
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: targetW, height: targetH },
    fetchWindowIcons: false
  });
  const source =
    sources.find((s: any) => Number((s as any).display_id) === display.id) ??
    sources.find((s) => String((s as any)?.id ?? '').startsWith('screen:')) ??
    sources[0];
  if (!source?.id) throw new Error('No desktop capture source');
  return {
    sourceId: source.id,
    displayId: display.id,
    bounds: {
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height
    },
    workArea: {
      x: display.workArea.x,
      y: display.workArea.y,
      width: display.workArea.width,
      height: display.workArea.height
    },
    scaleFactor: display.scaleFactor
  };
}

function cropSnapshotToWorkArea(fullDataUrl: string, display: Electron.Display): string {
  const img = nativeImage.createFromDataURL(fullDataUrl);
  if (img.isEmpty()) throw new Error('Captured snapshot is empty');

  const { width: imgW, height: imgH } = img.getSize();
  const scaleX = imgW / Math.max(1, display.bounds.width);
  const scaleY = imgH / Math.max(1, display.bounds.height);

  const x = Math.round((display.workArea.x - display.bounds.x) * scaleX);
  const y = Math.round((display.workArea.y - display.bounds.y) * scaleY);
  const w = Math.round(display.workArea.width * scaleX);
  const h = Math.round(display.workArea.height * scaleY);

  const cropX = Math.max(0, Math.min(x, imgW - 1));
  const cropY = Math.max(0, Math.min(y, imgH - 1));
  const cropW = Math.max(1, Math.min(w, imgW - cropX));
  const cropH = Math.max(1, Math.min(h, imgH - cropY));

  const cropped = img.crop({ x: cropX, y: cropY, width: cropW, height: cropH });
  if (cropped.isEmpty()) throw new Error('Work-area crop is empty');
  return cropped.toDataURL();
}

async function captureWorkAreaSnapshotInMain(displayId?: number): Promise<string> {
  const display =
    displayId != null
      ? screen.getAllDisplays().find((d) => d.id === displayId) ?? screen.getPrimaryDisplay()
      : screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) ?? screen.getPrimaryDisplay();

  const fullDataUrl = await captureDisplayInMain(display.id);
  return cropSnapshotToWorkArea(fullDataUrl, display);
}

async function captureDisplayInMain(displayId: number) {
  const display = screen.getAllDisplays().find((d) => d.id === displayId) ?? screen.getPrimaryDisplay();
  const targetW = Math.max(1, Math.round(display.size.width * display.scaleFactor));
  const targetH = Math.max(1, Math.round(display.size.height * display.scaleFactor));
  const attemptSizes = [
    { width: targetW, height: targetH },
    { width: Math.min(1920, targetW), height: Math.min(1080, targetH) },
    { width: 640, height: 360 }
  ];
  let lastErr: unknown = null;
  for (const sz of attemptSizes) {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: sz, fetchWindowIcons: false });
      const source =
        sources.find((s: any) => Number((s as any).display_id) === displayId) ??
        sources.find((s) => (s as any)?.id?.startsWith?.('screen:')) ??
        sources[0];
      if (!source) throw new Error('No desktop sources');
      if (source.thumbnail.isEmpty()) throw new Error(`Captured thumbnail is empty (${sz.width}x${sz.height})`);
      return source.thumbnail.toDataURL();
    } catch (e) {
      lastErr = e;
    }
  }
  throw (lastErr instanceof Error ? lastErr : new Error(String(lastErr ?? 'Capture failed')));
}

async function startCaptureFlow() {
  closeOverlayWindows();
  const prefs = await loadCapturePrefs(app);
  const delaySec = Math.max(0, Math.min(30, Number(prefs.captureDelaySeconds) || 0));
  if (delaySec > 0) {
    await new Promise((r) => setTimeout(r, delaySec * 1000));
  }

  // Capture BEFORE creating overlays to avoid capturing overlay itself.
  const displays = screen.getAllDisplays();
  const captured = await Promise.all(
    displays.map(async (d) => ({
      id: d.id,
      dataUrl: await captureDisplayInMain(d.id)
    }))
  );
  const bgByDisplayId = new Map<number, string>(captured.map((x) => [x.id, x.dataUrl]));

  createOverlayWindows();
  for (const d of displays) {
    const w = overlayWindowsByDisplayId.get(d.id);
    const bg = bgByDisplayId.get(d.id);
    if (!w || !bg) continue;
    w.webContents.once('did-finish-load', () => {
      w.webContents.send('overlay:bg', { displayId: d.id, dataUrl: bg });
      // Show only after background is set, so it won't flash black.
      try {
        w.show();
        w.focus();
      } catch {
        // ignore
      }
    });
  }
}

function closeOverlayWindows() {
  for (const w of overlayWindows) {
    if (!w.isDestroyed()) w.close();
  }
  overlayWindows = [];
  overlayWindowsByDisplayId = new Map();
}

function playCaptureDoneSound() {
  try {
    if (process.platform === 'win32') {
      execFile('powershell.exe', ['-NoProfile', '-Command', '[console]::beep(880,120)'], { windowsHide: true }, () => {});
    } else if (process.platform === 'darwin') {
      execFile('afplay', ['/System/Library/Sounds/Pop.aiff'], () => {});
    } else {
      execFile('paplay', ['/usr/share/sounds/freedesktop/stereo/complete.oga'], () => {});
    }
  } catch {
    // ignore
  }
}

async function saveImageFile(params: {
  buffer: Buffer;
  defaultName: string;
  filters: { name: string; extensions: string[] }[];
  /** Prefer full path (directory + filename) when directory exists. */
  defaultFullPath?: string;
}) {
  const win = BrowserWindow.getFocusedWindow() ?? editorWindow ?? null;
  let defaultPath = params.defaultFullPath?.trim() || '';
  if (defaultPath) {
    const dir = dirname(defaultPath);
    if (!existsSync(dir)) defaultPath = params.defaultName;
  } else {
    defaultPath = params.defaultName;
  }
  const opts = { defaultPath, filters: params.filters };
  const { canceled, filePath } = win ? await dialog.showSaveDialog(win, opts) : await dialog.showSaveDialog(opts);
  if (canceled || !filePath) return { saved: false as const };
  await writeFile(filePath, params.buffer);
  return { saved: true as const, filePath };
}

async function afterImageSavedToDisk(prefs: CaptureAppPrefs, filePath: string) {
  if (prefs.openFolderAfterSave) {
    try {
      shell.showItemInFolder(filePath);
    } catch {
      // ignore
    }
  }
  if (prefs.minimizeEditorAfterSave && editorWindow && !editorWindow.isDestroyed()) {
    try {
      editorWindow.minimize();
    } catch {
      // ignore
    }
  }
}

function startCapture() {
  void startCaptureFlow();
}

async function getAuthInfoFromEditor(): Promise<{ baseUrl: string; token: string; expiresAt?: number } | null> {
  if (!editorWindow || editorWindow.isDestroyed()) return null;
  if (!authGatePassed) return null;
  try {
    const v = await editorWindow.webContents.executeJavaScript(
      `
      (function () {
        try {
          const baseUrl = localStorage.getItem('screenshot.authBaseUrl') || 'http://localhost:4177';
          const raw = localStorage.getItem('screenshot.session');
          if (!raw) return null;
          const s = JSON.parse(raw);
          if (!s || !s.token) return null;
          return { baseUrl, token: s.token, expiresAt: s.expiresAt };
        } catch {
          return null;
        }
      })();
      `,
      true
    );
    if (!v || !v.baseUrl || !v.token) return null;
    const expiresAtRaw = (v as any).expiresAt;
    const expiresAt = typeof expiresAtRaw === 'number' ? expiresAtRaw : Number(expiresAtRaw);
    return {
      baseUrl: String(v.baseUrl),
      token: String(v.token),
      ...(Number.isFinite(expiresAt) ? { expiresAt } : {})
    };
  } catch {
    return null;
  }
}

async function isAuthedForCapture(): Promise<boolean> {
  const info = await getAuthInfoFromEditor();
  if (!info) return false;
  const now = Date.now();
  if (lastAuthCheckToken === info.token && now - lastAuthCheckOkAt < AUTH_CHECK_CACHE_MS) {
    return true;
  }
  try {
    const res = await fetch(`${info.baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: { authorization: `Bearer ${info.token}` }
    });
    if (res.ok) {
      lastAuthCheckToken = info.token;
      lastAuthCheckOkAt = now;
      return true;
    }
    lastAuthCheckToken = null;
    lastAuthCheckOkAt = 0;
    return false;
  } catch {
    // Offline mode: if we have a remembered, unexpired token, allow capture.
    if (typeof info.expiresAt === 'number' && Number.isFinite(info.expiresAt)) {
      const ok = info.expiresAt > Date.now() + 30_000;
      if (ok) {
        lastAuthCheckToken = info.token;
        lastAuthCheckOkAt = now;
      }
      return ok;
    }
    return false;
  }
}

async function requireLoginUi() {
  console.log('[desktop] requireLoginUi()');
  closeOverlayWindows();
  authGatePassed = false;
  if (!editorWindow || editorWindow.isDestroyed()) editorWindow = createEditorWindow();
  // 防止窗口跑到屏幕外（多显示器/分辨率变化后常见）
  try {
    const wa = screen.getPrimaryDisplay().workArea;
    const [w, h] = editorWindow.getSize();
    const nextW = Math.min(Math.max(w ?? 0, 900), Math.max(900, wa.width));
    const nextH = Math.min(Math.max(h ?? 0, 640), Math.max(640, wa.height));
    editorWindow.setBounds(
      {
        x: Math.round(wa.x + (wa.width - nextW) / 2),
        y: Math.round(wa.y + (wa.height - nextH) / 2),
        width: nextW,
        height: nextH
      },
      false
    );
  } catch {
    // ignore
  }
  if (editorWindow.isMinimized()) editorWindow.restore();
  // Windows 有时会阻止后台进程抢焦点；dev 下给一个短暂置顶兜底，保证可见。
  if (isDev()) {
    editorWindow.setAlwaysOnTop(true, 'screen-saver');
    setTimeout(() => {
      try {
        editorWindow?.setAlwaysOnTop(false);
      } catch {
        // ignore
      }
    }, 1500);
  }
  editorWindow.show();
  editorWindow.focus();
  editorWindow.moveTop();
  editorWindow.flashFrame(true);
  const wc = editorWindow.webContents;
  const sendRequireLogin = () => {
    try {
      wc.send('auth:requireLogin');
    } catch (e) {
      console.warn('[desktop] auth:requireLogin send failed', e);
    }
  };
  // 如果窗口刚创建/正在加载，等加载完成再发，避免 renderer 还没注册监听而丢消息。
  if (wc.isLoadingMainFrame()) {
    console.log('[desktop] editor is loading; wait did-finish-load to send auth:requireLogin');
    wc.once('did-fail-load', (_e, code, desc) => {
      console.warn('[desktop] editor did-fail-load', code, desc);
    });
    wc.once('did-finish-load', () => {
      console.log('[desktop] editor did-finish-load; sending auth:requireLogin');
      sendRequireLogin();
    });
  } else {
    sendRequireLogin();
  }

  if (isDev()) {
    try {
      await dialog.showMessageBox(editorWindow, {
        type: 'info',
        title: '需要登录',
        message: '检测到未登录（Ctrl+Alt+A 被触发）。已尝试打开登录界面。',
        detail: '如果你没看到编辑器窗口，请检查它是否在屏幕外或被其它窗口遮挡。',
        buttons: ['知道了']
      });
    } catch {
      // ignore
    }
  }
}

app.whenReady().then(async () => {
  // Ensure local auth server exists before login/capture flows.
  await ensureAuthServerRunning().catch((e) => console.warn('[desktop] ensureAuthServerRunning failed', e));

  // Allow getDisplayMedia in renderer/overlay without picker (dev convenience).
  try {
    session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
      if (permission === 'media' || permission === 'display-capture') return callback(true);
      callback(false);
    });
  } catch {
    // ignore
  }

  try {
    session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
      try {
        const { sourceId } = await resolveScreenCaptureSource();
        const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1, height: 1 } });
        const source = sources.find((s) => s.id === sourceId) ?? sources[0];
        callback({ video: source, audio: undefined });
      } catch (e) {
        console.warn('[desktop] setDisplayMediaRequestHandler failed', e);
        callback({ video: undefined, audio: undefined });
      }
    });
  } catch {
    // ignore
  }

  try {
    applyCapturePrefsToRuntime(await loadCapturePrefs(app));
  } catch {
    applyCapturePrefsToRuntime({ ...DEFAULT_CAPTURE_PREFS });
  }
  try {
    app.setLoginItemSettings({ openAtLogin: false, path: process.execPath });
  } catch {
    // ignore — clear legacy login-item if user had enabled it before
  }
  editorWindow = createEditorWindow();
  if (editorWindow && !editorWindow.isDestroyed()) {
    editorWindow.setAlwaysOnTop(!!cachedCapturePrefs.editorAlwaysOnTop);
  }
  authGatePassed = false;

  // In dev, always register the shortcut so it can bring up login UI.
  // In prod, keep the original "auth gate" behavior.
  if (isDev()) {
    registerAllCaptureShortcuts();
  } else {
    // Important: do NOT register global shortcut until login/auth gate passed.
    unregisterAllCaptureShortcuts();
  }

  ipcMain.handle('desktop:getDisplays', () => {
    return screen.getAllDisplays().map((d) => ({
      id: d.id,
      bounds: d.bounds,
      size: d.size,
      scaleFactor: d.scaleFactor
    }));
  });

  ipcMain.handle('desktop:getScreenCaptureSource', async (_evt, payload?: { displayId?: number }) => {
    const displayId = payload?.displayId != null ? Number(payload.displayId) : undefined;
    return await resolveScreenCaptureSource(Number.isFinite(displayId) ? displayId : undefined);
  });

  ipcMain.handle('desktop:getPluginShotWorkAreaSnapshot', () => {
    const snapshot = pluginShotWorkAreaSnapshot;
    pluginShotWorkAreaSnapshot = null;
    return snapshot;
  });

  ipcMain.on('desktop:completePluginShot', (_evt, payload: { dataUrl?: string }) => {
    const dataUrl = typeof payload?.dataUrl === 'string' ? payload.dataUrl : '';
    closePluginShotWindow();
    if (!dataUrl) return;
    void deliverCapturedImageToEditor(dataUrl).catch((err) => {
      console.error('[desktop] deliver plugin shot failed', err);
    });
  });

  ipcMain.on('desktop:cancelPluginShot', () => {
    closePluginShotWindow();
  });

  ipcMain.on('desktop:showPluginShotWindow', () => {
    showPluginShotWindow();
  });

  // Capture screen image in MAIN (reliable even when preload is sandbox-limited).
  ipcMain.handle('desktop:captureDisplay', async (_evt, payload: { displayId: number }) => {
    const displayId = Number(payload?.displayId);
    const display = screen.getAllDisplays().find((d) => d.id === displayId) ?? screen.getPrimaryDisplay();

    const targetW = Math.max(1, Math.round(display.size.width * display.scaleFactor));
    const targetH = Math.max(1, Math.round(display.size.height * display.scaleFactor));

    async function getSources(thumbnailSize: { width: number; height: number }) {
      return await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize,
        fetchWindowIcons: false
      });
    }

    // Windows 上 thumbnailSize=0x0 有时会返回空图；优先用显示器真实像素尺寸。
    const attemptSizes = [
      { width: targetW, height: targetH },
      // fallback: cap to a reasonable size
      { width: Math.min(1920, targetW), height: Math.min(1080, targetH) },
      // last resort: tiny thumbnail (still should be non-empty)
      { width: 640, height: 360 }
    ];

    let lastErr: unknown = null;
    for (const sz of attemptSizes) {
      try {
        const sources = await getSources(sz);
        const source =
          sources.find((s: any) => Number((s as any).display_id) === displayId) ??
          sources.find((s) => (s as any)?.id?.startsWith?.('screen:')) ??
          sources[0];
        if (!source) throw new Error('No desktop sources');
        if (source.thumbnail.isEmpty()) {
          throw new Error(`Captured thumbnail is empty (thumbnailSize=${sz.width}x${sz.height}, sources=${sources.length})`);
        }
        return { dataUrl: source.thumbnail.toDataURL() };
      } catch (e) {
        lastErr = e;
      }
    }
    throw (lastErr instanceof Error ? lastErr : new Error(String(lastErr ?? 'Capture failed')));
  });

  ipcMain.handle('desktop:getCapturePrefs', async () => await loadCapturePrefs(app));

  ipcMain.handle('desktop:setCapturePrefs', async (_evt, partial: Partial<CaptureAppPrefs>) => {
    const next = await saveCapturePrefs(app, partial);
    applyCapturePrefsToRuntime(next);
    try {
      if (editorWindow && !editorWindow.isDestroyed()) {
        editorWindow.setAlwaysOnTop(!!next.editorAlwaysOnTop);
      }
    } catch {
      // ignore
    }
    return next;
  });

  ipcMain.on('desktop:closeEditor', () => {
    handleEditorCloseIntent();
  });

  ipcMain.on('desktop:setCaptureShortcutsSuspended', (_evt, payload: { suspended?: boolean }) => {
    captureShortcutsSuspended = !!payload?.suspended;
  });

  ipcMain.handle('desktop:pickDefaultSaveFolder', async () => {
    const win = BrowserWindow.getFocusedWindow() ?? editorWindow ?? null;
    const r = win
      ? await dialog.showOpenDialog(win, { properties: ['openDirectory'] })
      : await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (r.canceled || !r.filePaths[0]) return { ok: false as const };
    return { ok: true as const, path: r.filePaths[0] };
  });

  ipcMain.handle('auth:getSession', async () => {
    return await loadSession();
  });

  ipcMain.handle('auth:login', async (_evt, config: OidcConfig) => {
    return await loginWithLoopback(config);
  });

  ipcMain.handle('auth:logout', async () => {
    await saveSession(null);
    authGatePassed = false;
    lastAuthCheckToken = null;
    lastAuthCheckOkAt = 0;
    if (!isDev()) unregisterAllCaptureShortcuts();
    return { ok: true as const };
  });

  ipcMain.on('auth:gate', (_evt, payload: { passed: boolean }) => {
    authGatePassed = !!payload?.passed;
    if (!authGatePassed) {
      lastAuthCheckToken = null;
      lastAuthCheckOkAt = 0;
      if (!isDev()) unregisterAllCaptureShortcuts();
      return;
    }
    // Double-check auth before registering global shortcut.
    (async () => {
      const okAuth = await isAuthedForCapture();
      if (okAuth) registerAllCaptureShortcuts();
      else if (!isDev()) unregisterAllCaptureShortcuts();
    })();
  });

  ipcMain.on('overlay:complete', async (_evt, payload: { dataUrl: string }) => {
    closeOverlayWindows();
    const okAuth = await isAuthedForCapture();
    if (!okAuth) {
      await requireLoginUi();
      return;
    }
    await deliverCapturedImageToEditor(payload.dataUrl);
  });

  ipcMain.on('overlay:cancel', () => {
    closeOverlayWindows();
    if (editorWindow && !editorWindow.isDestroyed()) editorWindow.show();
  });

  ipcMain.on('editor:startCapture', async () => {
    const okAuth = await isAuthedForCapture();
    if (!okAuth) {
      await requireLoginUi();
      return;
    }
    startCapture();
  });

  ipcMain.handle(
    'editor:saveFile',
    async (_evt, payload: { dataUrl: string; format: 'png' | 'jpeg' | 'webp' }) => {
      const m = /^data:([^;]+);base64,(.+)$/.exec(payload.dataUrl);
      if (!m) throw new Error('Invalid dataUrl');
      const b64 = m[2]!;
      const buffer = Buffer.from(b64, 'base64');

      const ext = payload.format === 'jpeg' ? 'jpg' : payload.format;
      const prefs = await loadCapturePrefs(app);
      const defaultFile = buildSaveDefaultFilename(prefs.saveFilenamePattern, ext, prefs.saveFilenameNextNumber);
      const defaultFullPath = prefs.defaultSaveDir ? join(prefs.defaultSaveDir, defaultFile) : undefined;
      const result = await saveImageFile({
        buffer,
        defaultName: defaultFile,
        defaultFullPath,
        filters: [{ name: 'Image', extensions: [ext] }]
      });
      if (result.saved) {
        const bumped = await bumpSaveFilenameSequenceIfNeeded(app, prefs);
        await afterImageSavedToDisk(prefs, result.filePath);
        return { ...result, saveFilenameNextNumber: bumped.saveFilenameNextNumber };
      }
      return result;
    }
  );

  ipcMain.handle(
    'editor:saveFileAuto',
    async (
      _evt,
      payload: {
        dataUrl: string;
        format: 'png' | 'jpeg' | 'webp';
        defaultSaveDir?: string;
        saveFilenamePattern?: string;
        saveFilenameNextNumber?: number;
      }
    ) => {
      const m = /^data:([^;]+);base64,(.+)$/.exec(payload.dataUrl);
      if (!m) throw new Error('Invalid dataUrl');
      const b64 = m[2]!;
      const buffer = Buffer.from(b64, 'base64');
      const diskPrefs = await loadCapturePrefs(app);
      const prefs: CaptureAppPrefs = {
        ...diskPrefs,
        ...(typeof payload.defaultSaveDir === 'string' ? { defaultSaveDir: payload.defaultSaveDir.trim() } : {}),
        ...(typeof payload.saveFilenamePattern === 'string' && payload.saveFilenamePattern.trim()
          ? { saveFilenamePattern: payload.saveFilenamePattern.trim() }
          : {}),
        ...(typeof payload.saveFilenameNextNumber === 'number' && Number.isFinite(payload.saveFilenameNextNumber)
          ? { saveFilenameNextNumber: payload.saveFilenameNextNumber }
          : {})
      };
      const dir = prefs.defaultSaveDir?.trim() ?? '';
      if (!dir || !existsSync(dir)) return { saved: false as const, reason: 'no_dir' as const };
      const ext = payload.format === 'jpeg' ? 'jpg' : payload.format;
      const filename = buildSaveDefaultFilename(prefs.saveFilenamePattern, ext, prefs.saveFilenameNextNumber);
      const filePath = join(dir, filename);
      try {
        await writeFile(filePath, buffer);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { saved: false as const, reason: 'write_failed' as const, message: msg };
      }
      const bumped = await bumpSaveFilenameSequenceIfNeeded(app, prefs);
      await afterImageSavedToDisk(prefs, filePath);
      return {
        saved: true as const,
        filePath,
        saveFilenameNextNumber: bumped.saveFilenameNextNumber
      };
    }
  );

  ipcMain.handle('editor:copyClipboard', async (_evt, payload: { dataUrl: string }) => {
    const img = nativeImage.createFromDataURL(payload.dataUrl);
    clipboard.writeImage(img);
    return { ok: true as const };
  });

  ipcMain.handle('editor:readClipboardImage', async () => {
    const img = clipboard.readImage();
    if (img.isEmpty()) return { ok: false as const };
    return { ok: true as const, dataUrl: img.toDataURL() };
  });

  ipcMain.handle('editor:openFile', async () => {
    const win = BrowserWindow.getFocusedWindow() ?? editorWindow ?? null;
    const opts = {
      properties: ['openFile'] as Array<'openFile'>,
      filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp'] }]
    };
    const { canceled, filePaths } = win ? await dialog.showOpenDialog(win, opts) : await dialog.showOpenDialog(opts);
    if (canceled || !filePaths[0]) return { ok: false as const };
    const filePath = filePaths[0];
    const buffer = await readFile(filePath);
    const img = nativeImage.createFromBuffer(buffer);
    return { ok: true as const, dataUrl: img.toDataURL() };
  });

  ipcMain.handle('editor:openImageFiles', async () => {
    const win = BrowserWindow.getFocusedWindow() ?? editorWindow ?? null;
    const opts = {
      properties: ['openFile', 'multiSelections'] as Array<'openFile' | 'multiSelections'>,
      filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'] }]
    };
    const { canceled, filePaths } = win ? await dialog.showOpenDialog(win, opts) : await dialog.showOpenDialog(opts);
    if (canceled || !filePaths.length) return { ok: false as const, files: [] as { name: string; path: string }[] };
    return {
      ok: true as const,
      files: filePaths.map((filePath) => ({ name: basename(filePath), path: filePath }))
    };
  });

  ipcMain.handle('editor:readImageFile', async (_evt, payload: { path: string }) => {
    const filePath = typeof payload?.path === 'string' ? payload.path.trim() : '';
    if (!filePath || !existsSync(filePath)) return { ok: false as const };
    const buffer = await readFile(filePath);
    const img = nativeImage.createFromBuffer(buffer);
    return { ok: true as const, dataUrl: img.toDataURL(), name: basename(filePath) };
  });
});

app.on('window-all-closed', () => {
  const alive = BrowserWindow.getAllWindows().some((w) => !w.isDestroyed());
  if (!alive && process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  unregisterAllCaptureShortcuts();
  // auth-server is started in-process, so nothing to kill here.
});

