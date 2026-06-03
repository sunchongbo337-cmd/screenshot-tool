import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { App } from 'electron';
import {
  DEFAULT_HOTKEY_BROWSER_SCREEN_CAPTURE,
  DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT,
  DEFAULT_HOTKEY_REGION_CAPTURE,
  DEFAULT_HOTKEY_WEB_REGION_CAPTURE,
  hotkeysAreEqual,
  sanitizeHotkeyString
} from '@screenshot/editor-core';

export type CaptureAppPrefs = {
  copyToClipboardAfterCapture: boolean;
  playSoundAfterCapture: boolean;
  editorAlwaysOnTop: boolean;
  openFolderAfterSave: boolean;
  minimizeEditorAfterSave: boolean;
  defaultSaveDir: string;
  saveFilenamePattern: string;
  /** Next value for `{n}` / `{seq}` in saveFilenamePattern (incremented after each successful save). */
  saveFilenameNextNumber: number;
  /** Default name for「新建模板」; use `{n}` / `{seq}` for sequential names (e.g. hospital_record{n}). */
  defaultTemplateNamePattern: string;
  /** Next number for defaultTemplateNamePattern when it uses `{n}` / `{seq}`. */
  defaultTemplateNextNumber: number;
  captureDelaySeconds: number;
  closeButtonAction: 'quit' | 'minimize';
  /** Toolbar ✕: exit all editing vs close current image when queue has multiple. */
  toolbarCloseButtonAction: 'exit_editing' | 'close_current';
  /** Multi-image navigation: tab strip vs left/right arrows. */
  multiImageNavMode: 'tabs' | 'arrows';
  /** Save to default folder with patterned filename (no dialog) when possible. */
  autoSaveImages: boolean;
  /** Toolbar ✓ button: save current / go to next. */
  finishButtonAction: 'save' | 'next';
  hotkeyRegionCapture: string;
  hotkeyJsWebScreenShot: string;
  hotkeyBrowserScreenCapture: string;
};

export const DEFAULT_CAPTURE_PREFS: CaptureAppPrefs = {
  copyToClipboardAfterCapture: true,
  playSoundAfterCapture: false,
  editorAlwaysOnTop: false,
  openFolderAfterSave: false,
  minimizeEditorAfterSave: false,
  defaultSaveDir: '',
  saveFilenamePattern: 'screenshot_{timestamp}',
  saveFilenameNextNumber: 1,
  defaultTemplateNamePattern: 'hospital_record_v1',
  defaultTemplateNextNumber: 1,
  captureDelaySeconds: 0,
  closeButtonAction: 'quit',
  toolbarCloseButtonAction: 'exit_editing',
  multiImageNavMode: 'tabs',
  autoSaveImages: false,
  finishButtonAction: 'save',
  hotkeyRegionCapture: DEFAULT_HOTKEY_REGION_CAPTURE,
  hotkeyJsWebScreenShot: DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT,
  hotkeyBrowserScreenCapture: DEFAULT_HOTKEY_BROWSER_SCREEN_CAPTURE
};

function prefsPath(app: App) {
  return join(app.getPath('userData'), 'capture-app-prefs.json');
}

function sanitizeCapturePrefs(raw: Partial<CaptureAppPrefs> | Record<string, unknown> | null | undefined): CaptureAppPrefs {
  const p = raw && typeof raw === 'object' ? raw : {};
  const d = DEFAULT_CAPTURE_PREFS;
  const num = (v: unknown, fallback: number, min: number, max: number) => {
    const n = typeof v === 'number' ? v : Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  };
  const close = p.closeButtonAction === 'minimize' ? 'minimize' : 'quit';
  const toolbarClose =
    p.toolbarCloseButtonAction === 'close_current' ? 'close_current' : 'exit_editing';
  const multiImageNavMode = p.multiImageNavMode === 'arrows' ? 'arrows' : 'tabs';
  let hotkeyRegionCapture = sanitizeHotkeyString(
    typeof p.hotkeyRegionCapture === 'string' ? p.hotkeyRegionCapture : undefined,
    d.hotkeyRegionCapture
  );
  if (hotkeysAreEqual(hotkeyRegionCapture, DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT)) {
    hotkeyRegionCapture = d.hotkeyRegionCapture;
  }
  if (hotkeysAreEqual(hotkeyRegionCapture, DEFAULT_HOTKEY_WEB_REGION_CAPTURE)) {
    hotkeyRegionCapture = d.hotkeyRegionCapture;
  }
  return {
    copyToClipboardAfterCapture: typeof p.copyToClipboardAfterCapture === 'boolean' ? p.copyToClipboardAfterCapture : d.copyToClipboardAfterCapture,
    playSoundAfterCapture: typeof p.playSoundAfterCapture === 'boolean' ? p.playSoundAfterCapture : d.playSoundAfterCapture,
    editorAlwaysOnTop: typeof p.editorAlwaysOnTop === 'boolean' ? p.editorAlwaysOnTop : d.editorAlwaysOnTop,
    openFolderAfterSave: typeof p.openFolderAfterSave === 'boolean' ? p.openFolderAfterSave : d.openFolderAfterSave,
    minimizeEditorAfterSave: typeof p.minimizeEditorAfterSave === 'boolean' ? p.minimizeEditorAfterSave : d.minimizeEditorAfterSave,
    defaultSaveDir: typeof p.defaultSaveDir === 'string' ? p.defaultSaveDir : d.defaultSaveDir,
    saveFilenamePattern: typeof p.saveFilenamePattern === 'string' && p.saveFilenamePattern.trim() ? p.saveFilenamePattern.trim() : d.saveFilenamePattern,
    saveFilenameNextNumber: num(p.saveFilenameNextNumber, d.saveFilenameNextNumber, 1, 999_999),
    defaultTemplateNamePattern:
      typeof p.defaultTemplateNamePattern === 'string' && p.defaultTemplateNamePattern.trim()
        ? p.defaultTemplateNamePattern.trim()
        : d.defaultTemplateNamePattern,
    defaultTemplateNextNumber: num(p.defaultTemplateNextNumber, d.defaultTemplateNextNumber, 1, 999_999),
    captureDelaySeconds: num(p.captureDelaySeconds, d.captureDelaySeconds, 0, 30),
    closeButtonAction: close,
    toolbarCloseButtonAction: toolbarClose,
    multiImageNavMode,
    autoSaveImages: typeof p.autoSaveImages === 'boolean' ? p.autoSaveImages : d.autoSaveImages,
    finishButtonAction:
      p.finishButtonAction === 'next'
        ? 'next'
        : p.finishButtonAction === 'copy'
          ? 'save'
          : p.finishButtonAction === 'save'
            ? 'save'
            : d.finishButtonAction,
    hotkeyRegionCapture,
    hotkeyJsWebScreenShot: DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT,
    hotkeyBrowserScreenCapture: sanitizeHotkeyString(
      typeof p.hotkeyBrowserScreenCapture === 'string' ? p.hotkeyBrowserScreenCapture : undefined,
      d.hotkeyBrowserScreenCapture
    )
  };
}

export function mergeCapturePrefs(partial: Partial<CaptureAppPrefs> | null | undefined): CaptureAppPrefs {
  return sanitizeCapturePrefs({ ...DEFAULT_CAPTURE_PREFS, ...(partial && typeof partial === 'object' ? partial : {}) });
}

export async function loadCapturePrefs(app: App): Promise<CaptureAppPrefs> {
  const path = prefsPath(app);
  try {
    if (!existsSync(path)) return { ...DEFAULT_CAPTURE_PREFS };
    const raw = await readFile(path, 'utf-8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return sanitizeCapturePrefs(parsed);
  } catch {
    return { ...DEFAULT_CAPTURE_PREFS };
  }
}

export async function saveCapturePrefs(app: App, partial: Partial<CaptureAppPrefs>): Promise<CaptureAppPrefs> {
  const next = sanitizeCapturePrefs({ ...(await loadCapturePrefs(app)), ...partial });
  await writeFile(prefsPath(app), JSON.stringify(next, null, 2), 'utf-8');
  return next;
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function saveFilenamePatternUsesSequence(pattern: string): boolean {
  return /\{(?:n|seq)\}/.test(pattern);
}

export function templateNamePatternUsesSequence(pattern: string): boolean {
  return /\{(?:n|seq)\}/.test(pattern);
}

export function buildSequentialTemplateNamePattern(prefix: string): string {
  const p = prefix.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/\s+/g, '_');
  return `${p || 'template'}{n}`;
}

export function parseSequentialTemplateNamePrefix(pattern: string): string {
  const m = pattern.match(/^(.*)\{(?:n|seq)\}$/);
  return m ? m[1]! : pattern.replace(/\{(?:n|seq)\}/g, '');
}

export function buildDefaultTemplateName(pattern: string, seqNumber = 1): string {
  const seq = Math.max(1, Math.floor(seqNumber));
  let base = (pattern || DEFAULT_CAPTURE_PREFS.defaultTemplateNamePattern).trim();
  base = base.replace(/\{n\}/g, String(seq)).replace(/\{seq\}/g, String(seq));
  base = base.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/\s+/g, '_').trim();
  return base || `template${seq}`;
}

export function buildSequentialFilenamePattern(prefix: string): string {
  const p = prefix.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/\s+/g, '');
  return `${p || 'image'}{n}`;
}

export function parseSequentialFilenamePrefix(pattern: string): string {
  const m = pattern.match(/^(.*)\{(?:n|seq)\}$/);
  return m ? m[1]! : pattern.replace(/\{(?:n|seq)\}/g, '');
}

export function buildSaveDefaultFilename(pattern: string, ext: string, seqNumber = 1): string {
  const d = new Date();
  const date = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const time = `${pad2(d.getHours())}-${pad2(d.getMinutes())}-${pad2(d.getSeconds())}`;
  const timestamp = String(Date.now());
  const seq = Math.max(1, Math.floor(seqNumber));
  let base = (pattern || DEFAULT_CAPTURE_PREFS.saveFilenamePattern).trim() || 'screenshot_{timestamp}';
  base = base
    .replace(/\{timestamp\}/g, timestamp)
    .replace(/\{date\}/g, date)
    .replace(/\{time\}/g, time)
    .replace(/\{n\}/g, String(seq))
    .replace(/\{seq\}/g, String(seq));
  base = base.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/\s+/g, ' ').trim();
  if (!base) base = 'screenshot_' + timestamp;
  const e = ext.startsWith('.') ? ext.slice(1) : ext;
  return `${base}.${e}`;
}

/** Increment sequence counter when pattern uses `{n}` / `{seq}` and save was successful. */
export async function bumpSaveFilenameSequenceIfNeeded(app: App, prefs: CaptureAppPrefs): Promise<CaptureAppPrefs> {
  if (!saveFilenamePatternUsesSequence(prefs.saveFilenamePattern)) return prefs;
  return await saveCapturePrefs(app, { saveFilenameNextNumber: prefs.saveFilenameNextNumber + 1 });
}

export async function bumpDefaultTemplateNumberIfNeeded(app: App, prefs: CaptureAppPrefs): Promise<CaptureAppPrefs> {
  if (!templateNamePatternUsesSequence(prefs.defaultTemplateNamePattern)) return prefs;
  return await saveCapturePrefs(app, { defaultTemplateNextNumber: prefs.defaultTemplateNextNumber + 1 });
}
