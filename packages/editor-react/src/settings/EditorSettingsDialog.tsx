import './editor-settings.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildDefaultTemplateName,
  buildSequentialTemplateNamePattern,
  guessTemplatePrefixForSequence,
  loadDefaultTemplatePrefs,
  parseSequentialTemplateNamePrefix,
  saveDefaultTemplatePrefs,
  templateNamePatternUsesSequence
} from '@screenshot/editor-react';
import {
  DEFAULT_HOTKEY_BROWSER_SCREEN_CAPTURE,
  DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT,
  DEFAULT_HOTKEY_REGION_CAPTURE,
  DEFAULT_HOTKEY_WEB_REGION_CAPTURE,
  formatHotkeyParts,
  hotkeysAreEqual,
  sanitizeHotkeyString
} from '@screenshot/editor-core';
import { HotkeyRecorder, HotkeyRecorderGroup } from '../hotkeys/HotkeyRecorder.js';

export type CapturePrefsState = {
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
  /** Multi-image navigation: tab strip vs left/right arrows. */
  multiImageNavMode: 'tabs' | 'arrows';
  autoSaveImages: boolean;
  finishButtonAction: 'save' | 'next';
  /** Auto-detect mosaic: per-character vs merged adjacent text. */
  ocrDetectGroupMode: 'char' | 'merged';
  /** When applying a template: replace all annotations or merge onto existing. */
  templateApplyMode: 'replace' | 'merge';
  /** Desktop global region capture (Electron). */
  hotkeyRegionCapture: string;
  /** js-web-screen-shot plugin capture. */
  hotkeyJsWebScreenShot: string;
  /** Browser getDisplayMedia capture. */
  hotkeyBrowserScreenCapture: string;
};

/** Full prefs snapshot — source of truth for settings UI reopen (written on every 确定). */
export const CAPTURE_PREFS_STORAGE_KEY = 'screenshot.capturePrefs.full.v1';

/** Legacy autosave-only backup. */
export const AUTOSAVE_PREFS_STORAGE_KEY = 'screenshot.autosavePrefs.v1';

export type AutosavePrefsSlice = Pick<
  CapturePrefsState,
  'defaultSaveDir' | 'openFolderAfterSave' | 'minimizeEditorAfterSave' | 'autoSaveImages' | 'finishButtonAction'
>;

export function loadAutosavePrefsFromLocal(): Partial<AutosavePrefsSlice> | null {
  try {
    const raw = window.localStorage.getItem(AUTOSAVE_PREFS_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<AutosavePrefsSlice>;
    if (!p || typeof p !== 'object') return null;
    const finish =
      p.finishButtonAction === 'next'
        ? 'next'
        : p.finishButtonAction === 'save' || p.finishButtonAction === 'copy'
          ? 'save'
          : undefined;
    return {
      defaultSaveDir: typeof p.defaultSaveDir === 'string' ? p.defaultSaveDir : undefined,
      openFolderAfterSave: typeof p.openFolderAfterSave === 'boolean' ? p.openFolderAfterSave : undefined,
      minimizeEditorAfterSave: typeof p.minimizeEditorAfterSave === 'boolean' ? p.minimizeEditorAfterSave : undefined,
      autoSaveImages: typeof p.autoSaveImages === 'boolean' ? p.autoSaveImages : undefined,
      finishButtonAction: finish
    };
  } catch {
    return null;
  }
}

export function saveAutosavePrefsToLocal(slice: AutosavePrefsSlice) {
  try {
    window.localStorage.setItem(AUTOSAVE_PREFS_STORAGE_KEY, JSON.stringify(slice));
  } catch {
    // ignore
  }
}

export function normalizeCapturePrefsState(draft: Partial<CapturePrefsState> | CapturePrefsState): CapturePrefsState {
  const pattern = (draft.defaultTemplateNamePattern ?? '').trim() || CAPTURE_PREFS_DEFAULTS.defaultTemplateNamePattern;
  const tplN = Number(draft.defaultTemplateNextNumber);
  const nextNumber =
    Number.isFinite(tplN) && tplN >= 1 ? Math.min(999_999, Math.floor(tplN)) : CAPTURE_PREFS_DEFAULTS.defaultTemplateNextNumber;
  const saveN = Number(draft.saveFilenameNextNumber);
  const saveFilenameNextNumber =
    Number.isFinite(saveN) && saveN >= 1 ? Math.min(999_999, Math.floor(saveN)) : CAPTURE_PREFS_DEFAULTS.saveFilenameNextNumber;
  const finishButtonAction =
    draft.finishButtonAction === 'next'
      ? 'next'
      : draft.finishButtonAction === 'save' || draft.finishButtonAction === 'copy'
        ? 'save'
        : CAPTURE_PREFS_DEFAULTS.finishButtonAction;
  const toolbarCloseButtonAction =
    draft.toolbarCloseButtonAction === 'close_current' ? 'close_current' : 'exit_editing';
  const multiImageNavMode = draft.multiImageNavMode === 'arrows' ? 'arrows' : 'tabs';
  const ocrDetectGroupMode = draft.ocrDetectGroupMode === 'char' ? 'char' : 'merged';
  const templateApplyMode = draft.templateApplyMode === 'replace' ? 'replace' : 'merge';
  let hotkeyRegionCapture = sanitizeHotkeyString(draft.hotkeyRegionCapture, DEFAULT_HOTKEY_REGION_CAPTURE);
  if (hotkeysAreEqual(hotkeyRegionCapture, DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT)) {
    hotkeyRegionCapture = DEFAULT_HOTKEY_REGION_CAPTURE;
  }
  if (hotkeysAreEqual(hotkeyRegionCapture, DEFAULT_HOTKEY_WEB_REGION_CAPTURE)) {
    hotkeyRegionCapture = DEFAULT_HOTKEY_REGION_CAPTURE;
  }
  return {
    ...CAPTURE_PREFS_DEFAULTS,
    ...draft,
    defaultTemplateNamePattern: pattern,
    defaultTemplateNextNumber: nextNumber,
    saveFilenameNextNumber,
    defaultSaveDir: typeof draft.defaultSaveDir === 'string' ? draft.defaultSaveDir.trim() : '',
    autoSaveImages: !!draft.autoSaveImages,
    finishButtonAction,
    toolbarCloseButtonAction,
    multiImageNavMode,
    ocrDetectGroupMode,
    templateApplyMode,
    hotkeyRegionCapture,
    hotkeyJsWebScreenShot: DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT,
    hotkeyBrowserScreenCapture: sanitizeHotkeyString(
      draft.hotkeyBrowserScreenCapture,
      DEFAULT_HOTKEY_BROWSER_SCREEN_CAPTURE
    )
  };
}

export function saveAllCapturePrefsToLocal(prefs: CapturePrefsState) {
  try {
    window.localStorage.setItem(CAPTURE_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function loadAllCapturePrefsFromLocal(): CapturePrefsState | null {
  try {
    const raw = window.localStorage.getItem(CAPTURE_PREFS_STORAGE_KEY);
    if (!raw) return null;
    return normalizeCapturePrefsState(JSON.parse(raw) as Partial<CapturePrefsState>);
  } catch {
    return null;
  }
}

export type MergeCapturePrefsOptions = {
  /** Desktop: disk/API prefs win and sync localStorage (fixes stale hotkeys in localStorage). */
  preferDisk?: boolean;
};

/** Merge disk IPC prefs with local snapshot. Web defaults to local wins; desktop should pass preferDisk. */
export function mergeCapturePrefsSources(
  disk: Partial<CapturePrefsState> | null | undefined,
  localFull: CapturePrefsState | null = loadAllCapturePrefsFromLocal(),
  options?: MergeCapturePrefsOptions
): CapturePrefsState {
  if (options?.preferDisk && disk && typeof disk === 'object') {
    const merged = normalizeCapturePrefsState({ ...CAPTURE_PREFS_DEFAULTS, ...disk });
    saveAllCapturePrefsToLocal(merged);
    return merged;
  }
  return normalizeCapturePrefsState({
    ...CAPTURE_PREFS_DEFAULTS,
    ...(disk && typeof disk === 'object' ? disk : {}),
    ...(localFull ?? {})
  });
}

export function mergeCapturePrefsWithLocalAutosave(prefs: CapturePrefsState): CapturePrefsState {
  const localFull = loadAllCapturePrefsFromLocal();
  if (localFull) return mergeCapturePrefsSources(prefs, localFull);
  const local = loadAutosavePrefsFromLocal();
  if (!local) return prefs;
  return normalizeCapturePrefsState({ ...prefs, ...local });
}

export const CAPTURE_PREFS_DEFAULTS: CapturePrefsState = {
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
  ocrDetectGroupMode: 'merged',
  templateApplyMode: 'merge',
  hotkeyRegionCapture: DEFAULT_HOTKEY_REGION_CAPTURE,
  hotkeyJsWebScreenShot: DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT,
  hotkeyBrowserScreenCapture: DEFAULT_HOTKEY_BROWSER_SCREEN_CAPTURE
};

function HotkeyKbdDisplay({ hotkey }: { hotkey: string }) {
  const parts = formatHotkeyParts(hotkey);
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={`${part}-${i}`}>
          {i > 0 ? <span className="fscHotkeyRecorderSep">+</span> : null}
          <kbd>{part}</kbd>
        </React.Fragment>
      ))}
    </>
  );
}

const SETTINGS_TABS = [
  { id: 'toolbar', label: '工具栏' },
  { id: 'capture', label: '捕获' },
  { id: 'hotkeys', label: '快捷键' },
  { id: 'filename', label: '文件名' },
  { id: 'autosave', label: '自动保存' },
  { id: 'editor', label: '编辑器' },
  { id: 'other', label: '其它' }
] as const;

type SettingsTabId = (typeof SETTINGS_TABS)[number]['id'];

const SETTINGS_FIELD: React.CSSProperties = {
  height: 34,
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e7eaf0',
  padding: '0 10px',
  width: '100%',
  boxSizing: 'border-box'
};

export function saveFilenamePatternUsesSequence(pattern: string): boolean {
  return /\{(?:n|seq)\}/.test(pattern);
}

function buildSequentialFilenamePattern(prefix: string): string {
  const p = prefix.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/\s+/g, '');
  return `${p || 'image'}{n}`;
}

function parseSequentialFilenamePrefix(pattern: string): string {
  const m = pattern.match(/^(.*)\{(?:n|seq)\}$/);
  return m ? m[1]! : pattern.replace(/\{(?:n|seq)\}/g, '');
}

export function previewSaveFilename(pattern: string, seqNumber = 1): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
  const seq = Math.max(1, Math.floor(seqNumber));
  const base = (pattern || 'screenshot_{timestamp}')
    .replace(/\{timestamp\}/g, String(Date.now()))
    .replace(/\{date\}/g, date)
    .replace(/\{time\}/g, time)
    .replace(/\{n\}/g, String(seq))
    .replace(/\{seq\}/g, String(seq));
  return `${base}.png`;
}

function CheckRow(props: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
      <span>{props.children}</span>
    </label>
  );
}

function FieldRow(props: { label: string; children: React.ReactNode }) {
  return (
    <div className="fscFieldRow">
      <span className="fscFieldLabel">{props.label}</span>
      <div className="fscFieldControl">{props.children}</div>
    </div>
  );
}

function FinishButtonActionField(props: {
  value: CapturePrefsState['finishButtonAction'];
  onChange: (v: CapturePrefsState['finishButtonAction']) => void;
  webMode?: boolean;
}) {
  return (
    <>
      <FieldRow label="点击工作区工具栏 [保存] 后">
        <select
          className="selectWithArrow"
          value={props.value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'save' || v === 'next') props.onChange(v);
          }}
          style={{ ...SETTINGS_FIELD, width: '100%', maxWidth: 280 }}
        >
          <option value="save">保存当前图片</option>
          <option value="next">保存并打开下一张（多图时）</option>
        </select>
      </FieldRow>
      <p className="fscSettingsNote">
        {props.webMode
          ? '网页端「保存」为浏览器下载；多图时「下一张」在保存后自动切换。复制请使用工具栏 [复制] 按钮。'
          : '可在自动保存开启时直接写入默认文件夹。复制请使用工作区 [复制] 按钮。'}
      </p>
    </>
  );
}

function FilenameSettingsFields(props: {
  captureDraft: CapturePrefsState;
  patchCapture: (patch: Partial<CapturePrefsState>) => void;
  filenameUsesSequence: boolean;
  filenamePreview: string;
  webMode?: boolean;
}) {
  const { captureDraft, patchCapture, filenameUsesSequence, filenamePreview, webMode } = props;
  return (
    <>
      {webMode ? (
        <p className="fscSettingsNote">浏览器下载图片时使用下列规则命名（不含扩展名）。</p>
      ) : (
        <p className="fscSettingsNote">桌面端另存为 / 自动保存时使用下列规则命名。</p>
      )}
      <FieldRow label="命名方式">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="filenameMode"
              checked={!filenameUsesSequence}
              onChange={() =>
                patchCapture({
                  saveFilenamePattern: saveFilenamePatternUsesSequence(captureDraft.saveFilenamePattern)
                    ? 'screenshot_{timestamp}'
                    : captureDraft.saveFilenamePattern || 'screenshot_{timestamp}'
                })
              }
            />
            <span>时间戳（如 screenshot_1735123456789）</span>
          </label>
          <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="filenameMode"
              checked={filenameUsesSequence}
              onChange={() =>
                patchCapture({
                  saveFilenamePattern: buildSequentialFilenamePattern(
                    parseSequentialFilenamePrefix(captureDraft.saveFilenamePattern) || 'hospital'
                  )
                })
              }
            />
            <span>顺序编号（如 hospital1、hospital2…）</span>
          </label>
        </div>
      </FieldRow>

      {filenameUsesSequence ? (
        <>
          <FieldRow label="名称前缀">
            <input
              value={parseSequentialFilenamePrefix(captureDraft.saveFilenamePattern)}
              onChange={(e) => patchCapture({ saveFilenamePattern: buildSequentialFilenamePattern(e.target.value) })}
              placeholder="hospital"
              style={SETTINGS_FIELD}
            />
          </FieldRow>
          <FieldRow label="下一个编号">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                min={1}
                max={999999}
                value={captureDraft.saveFilenameNextNumber}
                onChange={(e) => {
                  const v = Math.floor(Number(e.target.value));
                  patchCapture({ saveFilenameNextNumber: Number.isFinite(v) && v >= 1 ? v : 1 });
                }}
                style={{ ...SETTINGS_FIELD, width: 120, flex: '0 0 auto' }}
              />
              <button type="button" className="fscSettingsBtn" onClick={() => patchCapture({ saveFilenameNextNumber: 1 })}>
                重置为 1
              </button>
            </div>
          </FieldRow>
          <p className="fscSettingsNote">每次在编辑器中成功保存图片后，编号自动加 1。</p>
        </>
      ) : (
        <>
          <label style={{ fontSize: 13, display: 'block' }}>
            默认文件名（不含扩展名）
            <input
              value={captureDraft.saveFilenamePattern}
              onChange={(e) => patchCapture({ saveFilenamePattern: e.target.value })}
              placeholder="screenshot_{timestamp}"
              style={{ ...SETTINGS_FIELD, marginTop: 8 }}
            />
          </label>
          <p className="fscSettingsNote">
            占位符：{'{timestamp}'}、{'{date}'}、{'{time}'}；也可手写 {'{n}'} 做顺序编号
          </p>
        </>
      )}

      <p className="fscSettingsNote">
        文件名预览：<strong>{filenamePreview}</strong>
      </p>
    </>
  );
}

export type EditorSettingsDialogProps = {
  open: boolean;
  onClose: () => void;
  onApplied?: (saved: CapturePrefsState) => void;
  /** Live prefs from editor — used when reopening if local snapshot exists. */
  initialCapturePrefs?: CapturePrefsState;
  desktopApi: {
    getCapturePrefs?: () => Promise<CapturePrefsState>;
    setCapturePrefs?: (p: Partial<CapturePrefsState>) => Promise<CapturePrefsState>;
    pickDefaultSaveFolder?: () => Promise<{ ok: false } | { ok: true; path: string }>;
    setCaptureShortcutsSuspended?: (payload: { suspended: boolean }) => void;
  } | null;
  format: 'png' | 'jpeg' | 'webp';
  exportQuality: number;
  onCommit: (v: { format: 'png' | 'jpeg' | 'webp'; exportQuality: number }) => void | Promise<void>;
  authBaseUrl: string;
  onAuthBaseUrlChange: (v: string) => void;
  editorPanel: React.ReactNode;
};

export function EditorSettingsDialog(props: EditorSettingsDialogProps) {
  const { open, onClose, onApplied, initialCapturePrefs, desktopApi, format, exportQuality, onCommit, authBaseUrl, onAuthBaseUrlChange, editorPanel } = props;

  const [tab, setTab] = useState<SettingsTabId>('toolbar');
  const [captureDraft, setCaptureDraft] = useState<CapturePrefsState>(CAPTURE_PREFS_DEFAULTS);
  const [formatDraft, setFormatDraft] = useState(format);
  const [qualityDraft, setQualityDraft] = useState(exportQuality);
  const [authDraft, setAuthDraft] = useState(authBaseUrl);
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [saving, setSaving] = useState(false);
  const captureDraftRef = useRef(captureDraft);
  const prefsLoadSeqRef = useRef(0);
  const initialCapturePrefsRef = useRef(initialCapturePrefs);
  const savingRef = useRef(false);
  const [hotkeyRecording, setHotkeyRecording] = useState(false);

  captureDraftRef.current = captureDraft;

  useEffect(() => {
    if (open) initialCapturePrefsRef.current = initialCapturePrefs;
  }, [open, initialCapturePrefs]);

  const hasDesktopPrefs = typeof desktopApi?.getCapturePrefs === 'function';
  const isLossy = formatDraft === 'jpeg' || formatDraft === 'webp';

  // Sync export/auth drafts when dialog opens or parent values change — do NOT reload capture prefs here.
  useEffect(() => {
    if (!open) return;
    setFormatDraft(format);
    setQualityDraft(exportQuality);
    setAuthDraft(authBaseUrl);
  }, [open, format, exportQuality, authBaseUrl]);

  // Load prefs once when dialog opens (false→true). Never overwrite with async disk data if we already have a snapshot.
  useEffect(() => {
    if (!open) return;
    setTab('toolbar');
    const seq = ++prefsLoadSeqRef.current;

    const applyDraft = (draft: CapturePrefsState) => {
      if (seq !== prefsLoadSeqRef.current) return;
      const normalized = normalizeCapturePrefsState(draft);
      captureDraftRef.current = normalized;
      setCaptureDraft(normalized);
      setLoadingPrefs(false);
    };

    if (hasDesktopPrefs) {
      setLoadingPrefs(true);
      void desktopApi!
        .getCapturePrefs!()
        .then((p) => {
          applyDraft(mergeCapturePrefsSources(p, null, { preferDisk: true }));
        })
        .catch(() => {
          const fromParent = initialCapturePrefsRef.current;
          applyDraft(fromParent ? mergeCapturePrefsSources(fromParent, null) : CAPTURE_PREFS_DEFAULTS);
        });
      return;
    }

    const localFull = loadAllCapturePrefsFromLocal();
    if (localFull) {
      applyDraft(localFull);
      return;
    }

    const fromParent = initialCapturePrefsRef.current;
    if (fromParent) {
      applyDraft(fromParent);
      return;
    }

    const tpl = loadDefaultTemplatePrefs();
    applyDraft(
      mergeCapturePrefsSources({
        defaultTemplateNamePattern: tpl.pattern,
        defaultTemplateNextNumber: tpl.nextNumber
      }, null)
    );
  }, [open, hasDesktopPrefs, desktopApi]);

  useEffect(() => {
    if (!hasDesktopPrefs || typeof desktopApi?.setCaptureShortcutsSuspended !== 'function') return;
    desktopApi.setCaptureShortcutsSuspended({ suspended: open || hotkeyRecording });
  }, [open, hotkeyRecording, hasDesktopPrefs, desktopApi]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filenameUsesSequence = saveFilenamePatternUsesSequence(captureDraft.saveFilenamePattern);
  const filenamePreview = useMemo(
    () => previewSaveFilename(captureDraft.saveFilenamePattern, captureDraft.saveFilenameNextNumber),
    [captureDraft.saveFilenamePattern, captureDraft.saveFilenameNextNumber]
  );
  const templateUsesSequence = templateNamePatternUsesSequence(captureDraft.defaultTemplateNamePattern);
  const templateNamePreview = useMemo(
    () => buildDefaultTemplateName(captureDraft.defaultTemplateNamePattern, captureDraft.defaultTemplateNextNumber),
    [captureDraft.defaultTemplateNamePattern, captureDraft.defaultTemplateNextNumber]
  );

  function patchCapture(patch: Partial<CapturePrefsState>) {
    setCaptureDraft((prev) => {
      const next = { ...prev, ...patch };
      captureDraftRef.current = next;
      return next;
    });
  }

  function resetCurrentTab() {
    switch (tab) {
      case 'toolbar':
        patchCapture({
          editorAlwaysOnTop: CAPTURE_PREFS_DEFAULTS.editorAlwaysOnTop,
          closeButtonAction: CAPTURE_PREFS_DEFAULTS.closeButtonAction,
          toolbarCloseButtonAction: CAPTURE_PREFS_DEFAULTS.toolbarCloseButtonAction,
          multiImageNavMode: CAPTURE_PREFS_DEFAULTS.multiImageNavMode
        });
        break;
      case 'capture':
        patchCapture({
          copyToClipboardAfterCapture: CAPTURE_PREFS_DEFAULTS.copyToClipboardAfterCapture,
          playSoundAfterCapture: CAPTURE_PREFS_DEFAULTS.playSoundAfterCapture,
          captureDelaySeconds: CAPTURE_PREFS_DEFAULTS.captureDelaySeconds
        });
        break;
      case 'hotkeys':
        patchCapture({
          hotkeyRegionCapture: CAPTURE_PREFS_DEFAULTS.hotkeyRegionCapture,
          hotkeyBrowserScreenCapture: CAPTURE_PREFS_DEFAULTS.hotkeyBrowserScreenCapture
        });
        break;
      case 'filename':
        patchCapture({
          saveFilenamePattern: CAPTURE_PREFS_DEFAULTS.saveFilenamePattern,
          saveFilenameNextNumber: CAPTURE_PREFS_DEFAULTS.saveFilenameNextNumber
        });
        break;
      case 'autosave':
        patchCapture({
          defaultSaveDir: CAPTURE_PREFS_DEFAULTS.defaultSaveDir,
          openFolderAfterSave: CAPTURE_PREFS_DEFAULTS.openFolderAfterSave,
          minimizeEditorAfterSave: CAPTURE_PREFS_DEFAULTS.minimizeEditorAfterSave,
          autoSaveImages: CAPTURE_PREFS_DEFAULTS.autoSaveImages,
          finishButtonAction: CAPTURE_PREFS_DEFAULTS.finishButtonAction
        });
        break;
      case 'editor':
        setFormatDraft('png');
        setQualityDraft(0.95);
        patchCapture({
          defaultTemplateNamePattern: CAPTURE_PREFS_DEFAULTS.defaultTemplateNamePattern,
          defaultTemplateNextNumber: CAPTURE_PREFS_DEFAULTS.defaultTemplateNextNumber,
          ocrDetectGroupMode: CAPTURE_PREFS_DEFAULTS.ocrDetectGroupMode,
          templateApplyMode: CAPTURE_PREFS_DEFAULTS.templateApplyMode
        });
        break;
      case 'other':
        setAuthDraft('http://localhost:4177');
        break;
      default:
        break;
    }
  }

  async function onOk() {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);

    const active = document.activeElement;
    if (active instanceof HTMLElement) active.blur();
    captureDraftRef.current = captureDraft;

    const prefsPayload = normalizeCapturePrefsState(captureDraftRef.current);
    captureDraftRef.current = prefsPayload;

    saveAllCapturePrefsToLocal(prefsPayload);
    const autosaveSlice: AutosavePrefsSlice = {
      defaultSaveDir: prefsPayload.defaultSaveDir,
      openFolderAfterSave: prefsPayload.openFolderAfterSave,
      minimizeEditorAfterSave: prefsPayload.minimizeEditorAfterSave,
      autoSaveImages: prefsPayload.autoSaveImages,
      finishButtonAction: prefsPayload.finishButtonAction
    };
    saveAutosavePrefsToLocal(autosaveSlice);

    try {
      let saved = prefsPayload;
      if (hasDesktopPrefs && typeof desktopApi?.setCapturePrefs === 'function') {
        const fromDisk = await desktopApi.setCapturePrefs(prefsPayload);
        saved = mergeCapturePrefsSources(fromDisk, prefsPayload);
      }
      saveAllCapturePrefsToLocal(saved);
      saveAutosavePrefsToLocal({
        defaultSaveDir: saved.defaultSaveDir,
        openFolderAfterSave: saved.openFolderAfterSave,
        minimizeEditorAfterSave: saved.minimizeEditorAfterSave,
        autoSaveImages: saved.autoSaveImages,
        finishButtonAction: saved.finishButtonAction
      });
      saveDefaultTemplatePrefs({
        pattern: saved.defaultTemplateNamePattern,
        nextNumber: saved.defaultTemplateNextNumber
      });
      await onCommit({
        format: formatDraft,
        exportQuality: qualityDraft
      });
      onAuthBaseUrlChange(authDraft.trim());
      onApplied?.(saved);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      window.alert(`保存到系统配置失败：${msg}\n\n当前修改已保存在本机，编辑器会按新设置运行。`);
      onApplied?.(prefsPayload);
      onClose();
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fscSettingsOverlay"
      role="presentation"
      onClick={(e) => {
        if (saving) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="fscSettingsDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fsc-settings-title"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="fsc-settings-title" className="fscSettingsTitle">
          设置
        </h2>
        <div className="fscSettingsTabs" role="tablist">
          {SETTINGS_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`fscSettingsTab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="fscSettingsBody" role="tabpanel">
          {tab === 'toolbar' ? (
            <div className="fscSettingsSection">
              {hasDesktopPrefs && loadingPrefs ? (
                <p className="fscSettingsNote">正在加载…</p>
              ) : (
                <>
                  <FieldRow label="打开多张图片时">
                    <select
                      className="selectWithArrow"
                      value={captureDraft.multiImageNavMode}
                      onChange={(e) => {
                        const v = e.target.value as 'tabs' | 'arrows';
                        patchCapture({ multiImageNavMode: v });
                        if (desktopApi?.setCapturePrefs) void desktopApi.setCapturePrefs({ multiImageNavMode: v });
                      }}
                      style={{ ...SETTINGS_FIELD, width: '100%', maxWidth: 280 }}
                    >
                      <option value="tabs">标签页切换（顶部标签栏）</option>
                      <option value="arrows">左右箭头切换</option>
                    </select>
                  </FieldRow>
                  <FieldRow label="点击工作区工具栏 [关闭] 时">
                    <select
                      className="selectWithArrow"
                      value={captureDraft.toolbarCloseButtonAction}
                      onChange={(e) => {
                        const v = e.target.value as 'exit_editing' | 'close_current';
                        patchCapture({ toolbarCloseButtonAction: v });
                        if (desktopApi?.setCapturePrefs) void desktopApi.setCapturePrefs({ toolbarCloseButtonAction: v });
                      }}
                      style={{ ...SETTINGS_FIELD, width: '100%', maxWidth: 280 }}
                    >
                      <option value="exit_editing">退出编辑（返回首页）</option>
                      <option value="close_current">关闭当前图片（多图时仅关闭当前标签）</option>
                    </select>
                  </FieldRow>
                  {hasDesktopPrefs ? (
                    <>
                      <CheckRow checked={captureDraft.editorAlwaysOnTop} onChange={(v) => patchCapture({ editorAlwaysOnTop: v })}>
                        编辑器窗口总在最前
                      </CheckRow>
                      <FieldRow label="点击窗口标题栏 [×] 时">
                        <select
                          className="selectWithArrow"
                          value={captureDraft.closeButtonAction}
                          onChange={(e) => {
                            const v = e.target.value as 'quit' | 'minimize';
                            patchCapture({ closeButtonAction: v });
                            if (desktopApi?.setCapturePrefs) void desktopApi.setCapturePrefs({ closeButtonAction: v });
                          }}
                          style={{ ...SETTINGS_FIELD, width: '100%', maxWidth: 280 }}
                        >
                          <option value="quit">立即退出程序</option>
                          <option value="minimize">最小化到任务栏</option>
                        </select>
                      </FieldRow>
                      <p className="fscSettingsNote">
                        标题栏 [×] 与工作区 [关闭] 相互独立。多图时标签页 [×] 始终仅关闭对应图片；[关闭] 按钮行为见上项设置。切换后立即生效。
                      </p>
                    </>
                  ) : (
                    <p className="fscSettingsNote">窗口标题栏 [×]、总在最前等选项仅在桌面客户端可用。</p>
                  )}
                </>
              )}
            </div>
          ) : null}

          {tab === 'capture' ? (
            <div className="fscSettingsSection">
              {!hasDesktopPrefs ? (
                <p className="fscSettingsNote">捕获选项仅在桌面客户端可用。</p>
              ) : loadingPrefs ? (
                <p className="fscSettingsNote">正在加载…</p>
              ) : (
                <>
                  <CheckRow
                    checked={captureDraft.copyToClipboardAfterCapture}
                    onChange={(v) => patchCapture({ copyToClipboardAfterCapture: v })}
                  >
                    自动复制已捕捉图像到剪贴板
                  </CheckRow>
                  <FieldRow label="捕捉前延时">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step={1}
                        value={captureDraft.captureDelaySeconds}
                        onChange={(e) => patchCapture({ captureDelaySeconds: Math.max(0, Math.min(30, Number(e.target.value) || 0)) })}
                        style={{ ...SETTINGS_FIELD, width: 72 }}
                      />
                      <span style={{ fontSize: 13 }}>秒</span>
                    </div>
                  </FieldRow>
                  <CheckRow checked={captureDraft.playSoundAfterCapture} onChange={(v) => patchCapture({ playSoundAfterCapture: v })}>
                    播放声音通知
                  </CheckRow>
                </>
              )}
            </div>
          ) : null}

          {tab === 'hotkeys' ? (
            <div className="fscSettingsSection">
              <p className="fscSettingsNote">
                点击快捷键框后按下新组合键；再点同一框或按 Esc 取消录制。同一时间只能改一项。修改后需点「确定」保存。
              </p>
              {hasDesktopPrefs ? (
                <p className="fscSettingsNote">
                  桌面端有两套<strong>不同的</strong>截图：① Electron 原生（全局，绿框 + 底部「取消/确定」）；②{' '}
                  <a href="https://www.npmjs.com/package/js-web-screen-shot" target="_blank" rel="noreferrer">
                    js-web-screen-shot
                  </a>{' '}
                 （npm 库，带截图工具栏）。二者不是同一个 screenShotPlugin.umd.js（本仓库 dist 里的是标注编辑器）。
                </p>
              ) : (
                <p className="fscSettingsNote">
                  网页端与嵌入插件均使用{' '}
                  <a href="https://www.npmjs.com/package/js-web-screen-shot" target="_blank" rel="noreferrer">
                    js-web-screen-shot
                  </a>{' '}
                  做<strong>区域截图</strong>（快捷键 {DEFAULT_HOTKEY_WEB_REGION_CAPTURE}，与桌面端{' '}
                  {DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT} 区分）：浏览器会先弹出共享选择，确认后出现绿框与截图工具栏。
                </p>
              )}
              <HotkeyRecorderGroup onRecordingChange={setHotkeyRecording}>
              <table className="fscHotkeyTable">
                <thead>
                  <tr>
                    <th>动作</th>
                    <th>快捷键</th>
                  </tr>
                </thead>
                <tbody>
                  {hasDesktopPrefs ? (
                    <>
                      <tr>
                        <td>
                          Electron 原生区域截图
                          <div className="fscSettingsNote" style={{ margin: '4px 0 0', fontWeight: 400 }}>
                            全局生效；绿框 + 底部确定栏（非 js-web-screen-shot）
                          </div>
                        </td>
                        <td>
                          <HotkeyRecorder
                            value={captureDraft.hotkeyRegionCapture}
                            onChange={(v) => patchCapture({ hotkeyRegionCapture: v })}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          js-web-screen-shot（完整工具栏）
                          <div className="fscSettingsNote" style={{ margin: '4px 0 0', fontWeight: 400 }}>
                            npm 库；固定 {DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT}（网页/扩展为{' '}
                            {DEFAULT_HOTKEY_WEB_REGION_CAPTURE}）
                          </div>
                        </td>
                        <td>
                          <HotkeyKbdDisplay hotkey={DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT} />
                        </td>
                      </tr>
                    </>
              ) : (
                <tr>
                  <td>
                    区域截图（js-web-screen-shot）
                    <div className="fscSettingsNote" style={{ margin: '4px 0 0', fontWeight: 400 }}>
                      固定 {DEFAULT_HOTKEY_WEB_REGION_CAPTURE}；桌面端 js-web-screen-shot 为{' '}
                      {DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT}
                    </div>
                  </td>
                  <td>
                    <HotkeyKbdDisplay hotkey={DEFAULT_HOTKEY_WEB_REGION_CAPTURE} />
                  </td>
                </tr>
              )}
                  <tr>
                    <td>关闭设置</td>
                    <td>
                      <kbd>Esc</kbd>
                    </td>
                  </tr>
                </tbody>
              </table>
              </HotkeyRecorderGroup>
            </div>
          ) : null}

          {tab === 'filename' ? (
            <div className="fscSettingsSection">
              <FilenameSettingsFields
                captureDraft={captureDraft}
                patchCapture={patchCapture}
                filenameUsesSequence={filenameUsesSequence}
                filenamePreview={filenamePreview}
                webMode={!hasDesktopPrefs}
              />
            </div>
          ) : null}

          {tab === 'autosave' ? (
            <div className="fscSettingsSection">
              {hasDesktopPrefs && loadingPrefs ? (
                <p className="fscSettingsNote">正在加载…</p>
              ) : (
                <>
                  {hasDesktopPrefs ? (
                    <>
                      <FieldRow label="默认保存文件夹">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                          <button
                            type="button"
                            className="fscSettingsBtn"
                            onClick={() =>
                              void (async () => {
                                if (!desktopApi?.pickDefaultSaveFolder) return;
                                const r = await desktopApi.pickDefaultSaveFolder();
                                if (r.ok) {
                                  patchCapture({ defaultSaveDir: r.path });
                                  const next = normalizeCapturePrefsState({
                                    ...captureDraftRef.current,
                                    defaultSaveDir: r.path
                                  });
                                  captureDraftRef.current = next;
                                  saveAllCapturePrefsToLocal(next);
                                  saveAutosavePrefsToLocal({
                                    defaultSaveDir: r.path,
                                    openFolderAfterSave: next.openFolderAfterSave,
                                    minimizeEditorAfterSave: next.minimizeEditorAfterSave,
                                    autoSaveImages: next.autoSaveImages,
                                    finishButtonAction: next.finishButtonAction
                                  });
                                }
                              })()
                            }
                          >
                            浏览…
                          </button>
                          <button
                            type="button"
                            className="fscSettingsBtn"
                            disabled={!captureDraft.defaultSaveDir}
                            onClick={() => patchCapture({ defaultSaveDir: '' })}
                          >
                            清除
                          </button>
                        </div>
                        <div className="fscSettingsNote" style={{ marginTop: 6, wordBreak: 'break-all' }}>
                          {captureDraft.defaultSaveDir || '未设置'}
                        </div>
                      </FieldRow>
                      <CheckRow checked={captureDraft.openFolderAfterSave} onChange={(v) => patchCapture({ openFolderAfterSave: v })}>
                        保存后打开文件所在文件夹
                      </CheckRow>
                      <CheckRow checked={captureDraft.minimizeEditorAfterSave} onChange={(v) => patchCapture({ minimizeEditorAfterSave: v })}>
                        保存后最小化编辑器
                      </CheckRow>
                      <CheckRow checked={captureDraft.autoSaveImages} onChange={(v) => patchCapture({ autoSaveImages: v })}>
                        启用自动保存（工作区 [保存] 直接保存到默认文件夹，按「文件名」规则命名，不弹另存为）
                      </CheckRow>
                      <p className="fscSettingsNote">
                        须设置默认保存文件夹；命名规则在「文件名」标签页配置（含顺序编号 {'{n}'}）。
                        未勾选自动保存时，点工作区 [保存] 将弹出另存为对话框。[另存为] 始终弹出保存对话框。复制请使用工作区 [复制] 按钮。
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckRow checked={captureDraft.autoSaveImages} onChange={(v) => patchCapture({ autoSaveImages: v })}>
                        启用快速保存（工作区 [保存] 立即浏览器下载，按「文件名」规则命名）
                      </CheckRow>
                      <p className="fscSettingsNote">
                        网页端无法指定本地文件夹；关闭时行为与「保存」相同。命名规则在「文件名」标签页配置。
                      </p>
                    </>
                  )}
                  <FinishButtonActionField
                    value={captureDraft.finishButtonAction}
                    onChange={(v) => patchCapture({ finishButtonAction: v })}
                    webMode={!hasDesktopPrefs}
                  />
                </>
              )}
            </div>
          ) : null}

          {tab === 'editor' ? (
            <div className="fscSettingsSection fscSettingsSectionEditor">
              <FieldRow label="保存格式">
                <select
                  className="selectWithArrow"
                  value={formatDraft}
                  onChange={(e) => setFormatDraft(e.target.value as 'png' | 'jpeg' | 'webp')}
                  style={{ ...SETTINGS_FIELD, maxWidth: 220 }}
                >
                  <option value="png">PNG（无损）</option>
                  <option value="jpeg">JPEG（有损）</option>
                  <option value="webp">WebP（有损）</option>
                </select>
              </FieldRow>
              {isLossy ? (
                <FieldRow label={`压缩质量 ${Math.round(qualityDraft * 100)}%`}>
                  <input
                    type="range"
                    min={0.5}
                    max={1}
                    step={0.05}
                    value={qualityDraft}
                    onChange={(e) => setQualityDraft(Number(e.target.value))}
                    style={{ width: '100%', maxWidth: 280 }}
                  />
                </FieldRow>
              ) : null}
              <FieldRow label="默认模版名">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
                  <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="templateNameMode"
                      checked={!templateUsesSequence}
                      onChange={() =>
                        patchCapture({
                          defaultTemplateNamePattern: templateNamePatternUsesSequence(captureDraft.defaultTemplateNamePattern)
                            ? 'hospital_record_v1'
                            : captureDraft.defaultTemplateNamePattern || 'hospital_record_v1'
                        })
                      }
                    />
                    <span>固定名称（每次新建预填相同名称）</span>
                  </label>
                  <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="templateNameMode"
                      checked={templateUsesSequence}
                      onChange={() =>
                        patchCapture({
                          defaultTemplateNamePattern: buildSequentialTemplateNamePattern(
                            guessTemplatePrefixForSequence(captureDraft.defaultTemplateNamePattern)
                          )
                        })
                      }
                    />
                    <span>顺序编号（如 hospital_record1、hospital_record2…）</span>
                  </label>
                </div>
              </FieldRow>
              {templateUsesSequence ? (
                <>
                  <FieldRow label="名称前缀">
                    <input
                      value={parseSequentialTemplateNamePrefix(captureDraft.defaultTemplateNamePattern)}
                      onChange={(e) =>
                        patchCapture({ defaultTemplateNamePattern: buildSequentialTemplateNamePattern(e.target.value) })
                      }
                      placeholder="hospital_record"
                      style={{ ...SETTINGS_FIELD, maxWidth: 280 }}
                    />
                  </FieldRow>
                  <FieldRow label="下一个编号">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <input
                        type="number"
                        min={1}
                        max={999999}
                        value={captureDraft.defaultTemplateNextNumber}
                        onChange={(e) => {
                          const v = Math.floor(Number(e.target.value));
                          patchCapture({
                            defaultTemplateNextNumber: Number.isFinite(v) && v >= 1 ? v : 1
                          });
                        }}
                        style={{ ...SETTINGS_FIELD, width: 120, flex: '0 0 auto' }}
                      />
                      <button
                        type="button"
                        className="fscSettingsBtn"
                        onClick={() => patchCapture({ defaultTemplateNextNumber: 1 })}
                      >
                        重置为 1
                      </button>
                    </div>
                  </FieldRow>
                  <p className="fscSettingsNote">每次在编辑器中新建模板成功后，编号自动加 1，并更新「新建」输入框的预填名称。</p>
                </>
              ) : (
                <FieldRow label="模板名称">
                  <input
                    value={captureDraft.defaultTemplateNamePattern}
                    onChange={(e) => patchCapture({ defaultTemplateNamePattern: e.target.value })}
                    placeholder="hospital_record_v1"
                    style={{ ...SETTINGS_FIELD, maxWidth: 280 }}
                  />
                </FieldRow>
              )}
              <p className="fscSettingsNote">
                新建模板时将自动预填：<strong>{templateNamePreview}</strong>
              </p>
              <FieldRow label="套用模板时">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
                  <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="templateApplyMode"
                      checked={captureDraft.templateApplyMode === 'replace'}
                      onChange={() => patchCapture({ templateApplyMode: 'replace' })}
                    />
                    <span>覆盖现有标注（清空后套用模板位置）</span>
                  </label>
                  <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="templateApplyMode"
                      checked={captureDraft.templateApplyMode === 'merge'}
                      onChange={() => patchCapture({ templateApplyMode: 'merge' })}
                    />
                    <span>保留现有标注（在已有打码/箭头/文字基础上叠加模板）</span>
                  </label>
                </div>
              </FieldRow>
              <p className="fscSettingsNote">适用于工具栏「套用模板」及开启自动套用时的行为。</p>
              <FieldRow label="自动检测打码">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
                  <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="ocrDetectGroupMode"
                      checked={captureDraft.ocrDetectGroupMode === 'merged'}
                      onChange={() => patchCapture({ ocrDetectGroupMode: 'merged' })}
                    />
                    <span>连续字符合并（同一行相邻文字合并为一块）</span>
                  </label>
                  <label className="fscCheckRow" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="ocrDetectGroupMode"
                      checked={captureDraft.ocrDetectGroupMode === 'char'}
                      onChange={() => patchCapture({ ocrDetectGroupMode: 'char' })}
                    />
                    <span>逐字打码（每个字单独一块）</span>
                  </label>
                </div>
              </FieldRow>
              <p className="fscSettingsNote">全图检测与框选检测均使用此规则。逐字模式更精细，合并模式更省事。</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 12, paddingTop: 12 }}>{editorPanel}</div>
            </div>
          ) : null}

          {tab === 'other' ? (
            <div className="fscSettingsSection">
              <FieldRow label="认证服务地址">
                <input
                  value={authDraft}
                  onChange={(e) => setAuthDraft(e.target.value)}
                  placeholder="http://localhost:4177"
                  style={{ ...SETTINGS_FIELD, maxWidth: 320 }}
                />
              </FieldRow>
              <p className="fscSettingsNote">修改后点击「确定」保存。本地开发需确保认证服务已启动。</p>
            </div>
          ) : null}
        </div>

        <div className="fscSettingsFooter">
          <button type="button" className="fscSettingsBtn" onClick={resetCurrentTab}>
            重置
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="fscSettingsBtn fscSettingsBtnPrimary"
              disabled={saving}
              onClick={(e) => {
                e.stopPropagation();
                void onOk();
              }}
            >
              {saving ? '保存中…' : '确定'}
            </button>
            <button type="button" className="fscSettingsBtn" onClick={onClose}>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
