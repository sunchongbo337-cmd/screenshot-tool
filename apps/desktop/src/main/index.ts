
import { app, BrowserWindow, clipboard, desktopCapturer, dialog, globalShortcut, ipcMain, nativeImage, screen, session } from 'electron';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
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
let overlayWindows: BrowserWindow[] = [];
let overlayWindowsByDisplayId: Map<number, BrowserWindow> = new Map();
let authGatePassed = false;
let captureShortcutRegistered = false;
let activeCaptureAccelerator: string | null = null;

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

function registerCaptureShortcut() {
  if (captureShortcutRegistered) return;
  // In some environments/dev reloads, the accelerator can be "taken" even if our
  // previous registration didn't succeed. Clear our own record first.
  try {
    globalShortcut.unregisterAll();
  } catch {
    // ignore
  }

  // Desktop app capture hotkey (keep web-plugin Alt+A independent).
  // Register only Ctrl+Alt+A.
  const accelerators = ['Ctrl+Alt+A'];
  for (const accel of accelerators) {
    const ok = globalShortcut.register(accel, () => {
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
      console.log(`[desktop] globalShortcut registered: ${accel}`);
      break;
    } else {
      console.warn(`[desktop] globalShortcut register failed: ${accel} (already taken or unavailable)`);
    }
  }
}

function unregisterCaptureShortcut() {
  if (!captureShortcutRegistered) return;
  try {
    if (activeCaptureAccelerator) globalShortcut.unregister(activeCaptureAccelerator);
    else globalShortcut.unregister('Ctrl+Alt+A');
  } finally {
    captureShortcutRegistered = false;
    activeCaptureAccelerator = null;
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

  // Capture BEFORE creating overlays to avoid capturing overlay itself.
  const displays = screen.getAllDisplays();
  const bgByDisplayId = new Map<number, string>();
  for (const d of displays) {
    bgByDisplayId.set(d.id, await captureDisplayInMain(d.id));
  }

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

async function saveImageFile(params: { buffer: Buffer; defaultName: string; filters: { name: string; extensions: string[] }[] }) {
  const win = BrowserWindow.getFocusedWindow() ?? editorWindow ?? null;
  const opts = { defaultPath: params.defaultName, filters: params.filters };
  const { canceled, filePath } = win ? await dialog.showSaveDialog(win, opts) : await dialog.showSaveDialog(opts);
  if (canceled || !filePath) return { saved: false as const };
  await writeFile(filePath, params.buffer);
  return { saved: true as const, filePath };
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
  try {
    const res = await fetch(`${info.baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: { authorization: `Bearer ${info.token}` }
    });
    return res.ok;
  } catch {
    // Offline mode: if we have a remembered, unexpired token, allow capture.
    if (typeof info.expiresAt === 'number' && Number.isFinite(info.expiresAt)) {
      return info.expiresAt > Date.now() + 30_000;
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
        const sources = await desktopCapturer.getSources({ types: ['screen'] });
        callback({ video: sources[0], audio: undefined });
      } catch (e) {
        console.warn('[desktop] setDisplayMediaRequestHandler failed', e);
        callback({ video: undefined, audio: undefined });
      }
    });
  } catch {
    // ignore
  }

  editorWindow = createEditorWindow();
  authGatePassed = false;

  // In dev, always register the shortcut so it can bring up login UI.
  // In prod, keep the original "auth gate" behavior.
  if (isDev()) {
    registerCaptureShortcut();
  } else {
    // Important: do NOT register global shortcut until login/auth gate passed.
    unregisterCaptureShortcut();
  }

  ipcMain.handle('desktop:getDisplays', () => {
    return screen.getAllDisplays().map((d) => ({
      id: d.id,
      bounds: d.bounds,
      size: d.size,
      scaleFactor: d.scaleFactor
    }));
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

  ipcMain.handle('auth:getSession', async () => {
    return await loadSession();
  });

  ipcMain.handle('auth:login', async (_evt, config: OidcConfig) => {
    return await loginWithLoopback(config);
  });

  ipcMain.handle('auth:logout', async () => {
    await saveSession(null);
    authGatePassed = false;
    if (!isDev()) unregisterCaptureShortcut();
    return { ok: true as const };
  });

  ipcMain.on('auth:gate', (_evt, payload: { passed: boolean }) => {
    authGatePassed = !!payload?.passed;
    if (!authGatePassed) {
      if (!isDev()) unregisterCaptureShortcut();
      return;
    }
    // Double-check auth before registering global shortcut.
    (async () => {
      const okAuth = await isAuthedForCapture();
      if (okAuth) registerCaptureShortcut();
      else if (!isDev()) unregisterCaptureShortcut();
    })();
  });

  ipcMain.on('overlay:complete', async (_evt, payload: { dataUrl: string }) => {
    closeOverlayWindows();
    const okAuth = await isAuthedForCapture();
    if (!okAuth) {
      await requireLoginUi();
      return;
    }
    try {
      const img = nativeImage.createFromDataURL(payload.dataUrl);
      clipboard.writeImage(img);
    } catch {
      // ignore clipboard failures; editor can still open the image
    }
    if (!editorWindow || editorWindow.isDestroyed()) editorWindow = createEditorWindow();
    editorWindow.show();
    editorWindow.webContents.send('editor:loadImage', payload);
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
      return await saveImageFile({
        buffer,
        defaultName: `screenshot_${Date.now()}.${ext}`,
        filters: [{ name: 'Image', extensions: [ext] }]
      });
    }
  );

  ipcMain.handle('editor:copyClipboard', async (_evt, payload: { dataUrl: string }) => {
    const img = nativeImage.createFromDataURL(payload.dataUrl);
    clipboard.writeImage(img);
    return { ok: true as const };
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
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  unregisterCaptureShortcut();
  // auth-server is started in-process, so nothing to kill here.
});

