import React, { useEffect, useRef, useState } from 'react';
import {
  buildDefaultTemplateName,
  EditorWidget,
  hasSavedAnnotationTemplate,
  listSavedAnnotationTemplateKeys,
  loadDefaultTemplatePrefs,
  parseSequentialTemplateNamePrefix,
  registerAnnotationTemplatePlaceholder,
  renameSavedAnnotationTemplate,
  saveDefaultTemplatePrefs,
  templateNamePatternUsesSequence,
  TextStyleControls,
  isTextBold,
  recognizeTextRegions,
} from '@screenshot/editor-react';
import type { AnnotationSnapshotV1, EditorWidgetHandle, EditorWidgetOptions, ImageSource, TextStylePatch } from '@screenshot/editor-react';
import type { Tool } from '@screenshot/editor-core';
import { DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT } from '@screenshot/editor-core';
import {
  CAPTURE_PREFS_DEFAULTS,
  EditorSettingsDialog,
  TemplatePreviewDialog,
  type EditorSettingsDialogProps,
  mergeCapturePrefsSources,
  mergeCapturePrefsWithLocalAutosave,
  saveAllCapturePrefsToLocal,
  type CapturePrefsState
} from '@screenshot/editor-react';
import '@screenshot/editor-react/src/text/text-style-controls.css';
import {
  WorkspaceToolbar,
  WorkspaceViewer,
  WorkspaceTabStrip,
  WorkspaceArrowNav,
  ResizeImageDialog,
  cloneWorkspaceSnapshot,
  createWorkspaceHistoryStore,
  compositeQueueItem,
  createPastedLayer,
  createQueueItem,
  loadImageDimensions,
  resizeImageDataUrl
} from '@screenshot/editor-react';
import type { PasteLayerAdjustResult } from '@screenshot/editor-react';
import type { QueueItem, ViewMode, WorkspaceSnapshot } from '@screenshot/editor-react';

const ARROW_COLORS = [
  { name: '红', value: '#ff3b30' },
  { name: '橙', value: '#ff9500' },
  { name: '黄', value: '#ffcc00' },
  { name: '绿', value: '#34c759' },
  { name: '蓝', value: '#007aff' },
  { name: '黑', value: '#1a1a1a' },
  { name: '白', value: '#ffffff' }
] as const;

const TEXT_COLORS = ARROW_COLORS;

const MOSAIC_BRUSH_SIZES = [
  { name: '超细', value: 8 },
  { name: '细', value: 12 },
  { name: '中', value: 18 },
  { name: '粗', value: 26 },
  { name: '超粗', value: 36 }
] as const;

const MOSAIC_LEVELS = [
  { name: '极轻', pixelSize: 6, blurRadius: 2 },
  { name: '轻', pixelSize: 10, blurRadius: 4 },
  { name: '中', pixelSize: 14, blurRadius: 6 },
  { name: '重', pixelSize: 18, blurRadius: 8 },
  { name: '极重', pixelSize: 26, blurRadius: 12 }
] as const;

const MOSAIC_PIXEL_MIN = 2;
const MOSAIC_PIXEL_MAX = MOSAIC_LEVELS[MOSAIC_LEVELS.length - 1]!.pixelSize;
const MOSAIC_BLUR_MIN = 0;
const MOSAIC_BLUR_MAX = MOSAIC_LEVELS[MOSAIC_LEVELS.length - 1]!.blurRadius;

function clampMosaicPixel(v: number) {
  return Math.min(MOSAIC_PIXEL_MAX, Math.max(MOSAIC_PIXEL_MIN, Math.round(v)));
}

function clampMosaicBlur(v: number) {
  return Math.min(MOSAIC_BLUR_MAX, Math.max(MOSAIC_BLUR_MIN, Math.round(v)));
}

const COMMON_TEXT_SIZES = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 64] as const;
const COMMON_STYLE_PREFS_KEY = 'screenshot.commonStylePrefs.v1';

const CROP_SHAPES = [
  { id: 'rect' as const, icon: '▭', title: '矩形裁剪', ariaLabel: '矩形裁剪' },
  { id: 'roundRect' as const, icon: '▢', title: '圆角矩形裁剪', ariaLabel: '圆角矩形裁剪' },
  { id: 'circle' as const, icon: '○', title: '圆形裁剪', ariaLabel: '圆形裁剪' },
  { id: 'freehand' as const, icon: '✎', title: '手绘裁剪', ariaLabel: '手绘裁剪' }
] as const;

type ToolbarMenuId = 'arrow' | 'mosaic' | 'text' | 'crop' | 'template';

function menuToolIconClass(openMenu: ToolbarMenuId | null, menu: ToolbarMenuId, toolActive: boolean): string {
  if (openMenu === menu) return 'iconBtn menuOpen';
  if (toolActive) return 'iconBtn toolActive';
  return 'iconBtn';
}

function menuToolSummaryTitle(
  label: string,
  openMenu: ToolbarMenuId | null,
  menu: ToolbarMenuId,
  toolActive: boolean,
  defaultTitle?: string
): string {
  if (openMenu === menu) return `${label}（点击图标收起菜单）`;
  if (toolActive) return `${label}已启用（再次点击图标关闭）`;
  return defaultTitle ?? label;
}

function toggleMenuToolOnSummaryClick(
  menu: ToolbarMenuId,
  openMenu: ToolbarMenuId | null,
  toolActive: boolean,
  callbacks: {
    setOpenMenu: (next: ToolbarMenuId | null) => void;
    setHintTool: (next: ToolbarMenuId | null) => void;
    onActivate: () => void;
    onDeactivate: () => void;
    beforeActivate?: () => void;
  }
): void {
  callbacks.beforeActivate?.();
  if (openMenu === menu) {
    callbacks.setOpenMenu(null);
    return;
  }
  if (toolActive) {
    callbacks.onDeactivate();
    callbacks.setOpenMenu(null);
    callbacks.setHintTool(null);
    return;
  }
  callbacks.onActivate();
  callbacks.setOpenMenu(menu);
  callbacks.setHintTool(null);
}

function loadStoredExportFormat(): 'png' | 'jpeg' | 'webp' {
  try {
    const raw = window.localStorage.getItem('screenshot.exportFormat');
    if (raw === 'png' || raw === 'jpeg' || raw === 'webp') return raw;
  } catch {
    // ignore
  }
  return 'png';
}

function loadStoredExportQuality(): number {
  try {
    const q = Number(window.localStorage.getItem('screenshot.exportQuality'));
    if (Number.isFinite(q) && q >= 0.5 && q <= 1) return q;
  } catch {
    // ignore
  }
  return 0.95;
}

const SETTINGS_FIELD: React.CSSProperties = {
  height: 34,
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.16)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e7eaf0',
  padding: '0 10px',
  width: '100%',
  boxSizing: 'border-box'
};

const baseTools = {
  select: { kind: 'select' } as Tool,
  text: {
    kind: 'text',
    fill: '#ff3b30',
    fontSize: 24,
    fontFamily: 'Microsoft YaHei',
    padding: 6,
    align: 'left',
    lineHeight: 1.25,
    letterSpacing: 0,
    fontWeight: 'normal',
    fontItalic: false,
    underline: false
  } as Tool
};

type Selection = Parameters<NonNullable<EditorWidgetOptions['onSelectionChange']>>[0];
type CommonStylePrefs = {
  mosaicMode: 'rect' | 'brush';
  mosaicStyle: 'pixel' | 'blur';
  mosaicBrushSize: number;
  mosaicLevel: (typeof MOSAIC_LEVELS)[number]['name'];
  mosaicPixelSize: number;
  mosaicBlurRadius: number;
  arrowColor: string;
  arrowStrokeWidth: number;
  arrowPointerSize: number;
  arrowKind: 'straight' | 'elbow' | 'curve';
  arrowOpacity: number;
  arrowShadow: boolean;
  textColor: string;
  textSize: number;
  textWeight: 'normal' | 'bold';
  textItalic: boolean;
  textUnderline: boolean;
  textAlign: 'left' | 'center' | 'right';
  textFont: string;
};

async function blobToDataUrl(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Failed to read blob'));
    r.readAsDataURL(blob);
  });
}

/** Worker/core must be http(s) or file URLs — not Vite `/@fs/...` (invalid in `importScripts`). */
function getTesseractAssetUrls(): { workerPath: string; corePath: string } {
  const u = new URL(window.location.href);
  u.hash = '';
  u.search = '';
  if (!u.pathname.endsWith('/')) {
    u.pathname = u.pathname.replace(/\/[^/]*$/, '/') || '/';
  }
  return {
    workerPath: new URL('tesseract/worker.min.js', u).href,
    corePath: new URL('tesseract-core/tesseract-core-simd-lstm.wasm.js', u).href
  };
}

const TOOLBAR_CLUSTER: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  paddingLeft: 8,
  marginLeft: 8,
  borderLeft: '1px solid rgba(255,255,255,0.17)'
};

function ToolbarVSep() {
  return (
    <span
      aria-hidden
      style={{
        width: 1,
        minWidth: 1,
        height: 20,
        background: 'rgba(255,255,255,0.14)',
        flexShrink: 0,
        margin: '0 4px'
      }}
    />
  );
}

function getDesktopApi(): Record<string, unknown> | null {
  const api = (window as typeof window & { desktopApi?: Record<string, unknown> }).desktopApi;
  return api && typeof api === 'object' ? api : null;
}

export function EditorScreen() {
  const desktopApi = getDesktopApi();
  useEffect(() => {
    const api = getDesktopApi();
    const keys = api ? Object.keys(api).sort().join(',') : '';
    console.log('[renderer] EditorScreen mounted. desktopApi:', api ? 'ok' : 'missing', keys ? `keys=${keys}` : '');
  }, []);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorWidgetHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hostReady, setHostReady] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('workspace');
  const [workspaceZoom, setWorkspaceZoom] = useState(1);
  const [workspacePreview, setWorkspacePreview] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const [resizeOpen, setResizeOpen] = useState(false);
  const [pasteAdjust, setPasteAdjust] = useState<{
    dataUrl: string;
    baseDataUrl: string;
    canvasWidth: number;
    canvasHeight: number;
  } | null>(null);
  const workspaceStageRef = useRef<HTMLDivElement | null>(null);
  const workspaceHistoryRef = useRef(createWorkspaceHistoryStore());
  const [workspaceCanUndo, setWorkspaceCanUndo] = useState(false);
  const [workspaceCanRedo, setWorkspaceCanRedo] = useState(false);
  const queueLengthRef = useRef(0);
  useEffect(() => {
    queueLengthRef.current = queue.length;
  }, [queue.length]);
  const activeItem = queue[activeIndex] ?? null;
  const image = activeItem?.image ?? null;

  function syncWorkspaceHistoryFlags() {
    const id = activeItem?.id;
    if (!id || viewMode !== 'workspace') {
      setWorkspaceCanUndo(false);
      setWorkspaceCanRedo(false);
      return;
    }
    const store = workspaceHistoryRef.current;
    setWorkspaceCanUndo(store.canUndo(id));
    setWorkspaceCanRedo(store.canRedo(id));
  }

  function pushWorkspaceHistory() {
    if (!activeItem || viewMode !== 'workspace') return;
    workspaceHistoryRef.current.pushUndo(activeItem.id, cloneWorkspaceSnapshot(activeItem));
    syncWorkspaceHistoryFlags();
  }

  function applyWorkspaceSnapshot(snap: WorkspaceSnapshot) {
    setQueue((prev) =>
      prev.map((it, i) =>
        i === activeIndex
          ? { ...it, image: snap.image, layers: snap.layers, annotations: snap.annotations }
          : it
      )
    );
  }

  function onWorkspaceUndo() {
    if (!activeItem || viewMode !== 'workspace') return;
    const current = cloneWorkspaceSnapshot(activeItem);
    const prev = workspaceHistoryRef.current.undo(activeItem.id, current);
    if (!prev) return;
    applyWorkspaceSnapshot(prev);
    syncWorkspaceHistoryFlags();
    void refreshWorkspacePreview();
  }

  function onWorkspaceRedo() {
    if (!activeItem || viewMode !== 'workspace') return;
    const current = cloneWorkspaceSnapshot(activeItem);
    const next = workspaceHistoryRef.current.redo(activeItem.id, current);
    if (!next) return;
    applyWorkspaceSnapshot(next);
    syncWorkspaceHistoryFlags();
    void refreshWorkspacePreview();
  }

  useEffect(() => {
    syncWorkspaceHistoryFlags();
  }, [activeItem?.id, activeIndex, viewMode]);

  async function refreshWorkspacePreview() {
    if (!activeItem) {
      setWorkspacePreview(null);
      setPreviewSize({ width: 0, height: 0 });
      return;
    }
    try {
      const composite = await compositeQueueItem(activeItem);
      setWorkspacePreview(composite.dataUrl);
      setPreviewSize({ width: composite.width, height: composite.height });
    } catch (err) {
      console.warn('[EditorScreen] composite preview failed', err);
    }
  }

  useEffect(() => {
    if (viewMode !== 'workspace' || !activeItem) return;
    void refreshWorkspacePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, activeItem?.id, activeItem?.image, activeItem?.layers, activeIndex]);

  useEffect(() => {
    if (viewMode !== 'workspace' || !previewSize.width || !previewSize.height) return;
    const t = window.setTimeout(() => onWorkspaceZoomFit(), 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, previewSize.width, previewSize.height, activeItem?.id]);

  function isImageLikeFile(f: File) {
    if (f.type.startsWith('image/')) return true;
    return /\.(png|jpe?g|webp|bmp|gif)$/i.test(f.name);
  }

  function appendQueueItems(items: QueueItem[]) {
    if (items.length === 0) return;
    const firstNewIndex = queueLengthRef.current === 0 ? 0 : queueLengthRef.current;
    setQueue((prev) => [...prev, ...items]);
    setActiveIndex(firstNewIndex);
    setViewMode('workspace');
    setActive('select');
    editorRef.current?.setTool(baseTools.select);
  }

  function addToQueueFromDataUrl(dataUrl: string, name = `pasted_${Date.now()}.png`) {
    appendQueueItems([createQueueItem({ name, image: { kind: 'dataUrl', dataUrl } })]);
  }

  async function loadQueueItemsFromDesktopDialog(): Promise<QueueItem[] | null> {
    if (typeof desktopApi?.openImageFiles !== 'function') return null;
    try {
      const r = await desktopApi.openImageFiles();
      if (!r.ok || !r.files?.length) return [];
      const items: QueueItem[] = [];
      for (let i = 0; i < r.files.length; i++) {
        const f = r.files[i]!;
        let dataUrl: string | undefined;
        if (f.path && typeof desktopApi.readImageFile === 'function') {
          const loaded = await desktopApi.readImageFile({ path: f.path });
          if (!loaded.ok) continue;
          dataUrl = loaded.dataUrl;
        } else if ('dataUrl' in f && typeof (f as { dataUrl?: string }).dataUrl === 'string') {
          dataUrl = (f as { dataUrl: string }).dataUrl;
        }
        if (!dataUrl) continue;
        items.push(createQueueItem({ name: f.name || `image_${i + 1}.png`, image: { kind: 'dataUrl', dataUrl } }));
      }
      return items;
    } catch (err) {
      console.warn('[EditorScreen] openImageFiles failed', err);
      return null;
    }
  }
  const [active, setActive] = useState<'select' | 'mosaic' | 'arrow' | 'text'>('select');
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  const [cropMode, setCropMode] = useState(false);
  const [cropShape, setCropShape] = useState<'rect' | 'roundRect' | 'circle' | 'freehand'>('rect');
  const [alignMode, setAlignMode] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>(() => loadStoredExportFormat());
  const [exportQuality, setExportQuality] = useState(() => loadStoredExportQuality());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [capturePrefs, setCapturePrefs] = useState<CapturePrefsState>(CAPTURE_PREFS_DEFAULTS);
  const capturePrefsRef = useRef(capturePrefs);
  useEffect(() => {
    capturePrefsRef.current = capturePrefs;
  }, [capturePrefs]);
  const skipPrefsReloadOnCloseRef = useRef(false);

  const reloadCapturePrefsFromDesktop = async (): Promise<CapturePrefsState | null> => {
    if (typeof desktopApi?.getCapturePrefs !== 'function') {
      const localOnly = mergeCapturePrefsWithLocalAutosave(CAPTURE_PREFS_DEFAULTS);
      capturePrefsRef.current = localOnly;
      setCapturePrefs(localOnly);
      return localOnly;
    }
    const p = await desktopApi.getCapturePrefs();
    const merged = mergeCapturePrefsSources(p, null, { preferDisk: true });
    capturePrefsRef.current = merged;
    setCapturePrefs(merged);
    return merged;
  };

  const applyCapturePrefs = (prefs: CapturePrefsState) => {
    const merged = mergeCapturePrefsSources(prefs, prefs);
    saveAllCapturePrefsToLocal(merged);
    capturePrefsRef.current = merged;
    setCapturePrefs(merged);
    return merged;
  };

  const isLossyFormat = format === 'jpeg' || format === 'webp';
  type LocalSession = {
    token: string;
    expiresAt: number;
    user: {
      id: number;
      displayName: string;
      provider: 'local';
      role: string;
      phone?: string | null;
      email?: string | null;
    };
  };
  const [session, setSession] = useState<LocalSession | null>(null);
  const [openMenu, setOpenMenu] = useState<null | ToolbarMenuId>(null);
  const [hintTool, setHintTool] = useState<null | ToolbarMenuId>(null);
  const [mosaicMode, setMosaicMode] = useState<'rect' | 'brush'>('rect');
  const [mosaicStyle, setMosaicStyle] = useState<'pixel' | 'blur'>('pixel');
  const [mosaicBrushSize, setMosaicBrushSize] = useState(18);
  const [mosaicLevel, setMosaicLevel] = useState<(typeof MOSAIC_LEVELS)[number]['name']>('中');
  const [mosaicPixelSize, setMosaicPixelSize] = useState<number>(() =>
    clampMosaicPixel(MOSAIC_LEVELS.find((l) => l.name === '中')?.pixelSize ?? 14)
  );
  const [mosaicBlurRadius, setMosaicBlurRadius] = useState<number>(() =>
    clampMosaicBlur(MOSAIC_LEVELS.find((l) => l.name === '中')?.blurRadius ?? 6)
  );
  const [mosaicPixelSizeDraft, setMosaicPixelSizeDraft] = useState(() => String(mosaicPixelSize));
  const [mosaicBlurRadiusDraft, setMosaicBlurRadiusDraft] = useState(() => String(mosaicBlurRadius));
  useEffect(() => setMosaicPixelSizeDraft(String(mosaicPixelSize)), [mosaicPixelSize]);
  useEffect(() => setMosaicBlurRadiusDraft(String(mosaicBlurRadius)), [mosaicBlurRadius]);
  const [arrowColor, setArrowColor] = useState('#ff3b30');
  const [arrowStrokeWidth, setArrowStrokeWidth] = useState(6);
  const [arrowPointerSize, setArrowPointerSize] = useState(16);
  const [arrowStrokeWidthDraft, setArrowStrokeWidthDraft] = useState(() => '6');
  const [arrowPointerSizeDraft, setArrowPointerSizeDraft] = useState(() => '16');
  useEffect(() => setArrowStrokeWidthDraft(String(arrowStrokeWidth)), [arrowStrokeWidth]);
  useEffect(() => setArrowPointerSizeDraft(String(arrowPointerSize)), [arrowPointerSize]);
  const [arrowKind, setArrowKind] = useState<'straight' | 'elbow' | 'curve'>('straight');
  const [arrowOpacity, setArrowOpacity] = useState(1);
  const [arrowShadow, setArrowShadow] = useState(false);

  const [textColor, setTextColor] = useState('#ff3b30');
  const [textSize, setTextSize] = useState(24);
  const [textSizeDraft, setTextSizeDraft] = useState(() => '24');
  const [textWeight, setTextWeight] = useState<'normal' | 'bold'>('normal');
  const [textItalic, setTextItalic] = useState(false);
  const [textUnderline, setTextUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  // Template key for reusing annotation positions across similar medical record images.
  const [templateKey, setTemplateKey] = useState(() => {
    const raw = window.localStorage.getItem('screenshot.templateKey');
    return raw && raw.trim() ? raw : 'hospital_record_v1';
  });
  const templateKeyNormalized = templateKey.trim();
  const [savedTemplateKeys, setSavedTemplateKeys] = useState<string[]>(() => listSavedAnnotationTemplateKeys());
  const [newTemplateDraft, setNewTemplateDraft] = useState('');
  const [renameTemplateDraft, setRenameTemplateDraft] = useState('');
  const [defaultTemplatePrefs, setDefaultTemplatePrefs] = useState(() => loadDefaultTemplatePrefs());
  /** Set when user picks a name from「已保存模板」; drives whether「重命名」is shown. */
  const [selectedSavedTemplateKey, setSelectedSavedTemplateKey] = useState<string | null>(null);
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);
  const pendingNewTemplateSaveRef = useRef<string | null>(null);
  const refreshSavedTemplateKeys = () => setSavedTemplateKeys(listSavedAnnotationTemplateKeys());
  const showRenameTemplate =
    selectedSavedTemplateKey != null && savedTemplateKeys.includes(selectedSavedTemplateKey);

  useEffect(() => {
    window.localStorage.setItem('screenshot.templateKey', templateKeyNormalized || 'hospital_record_v1');
  }, [templateKeyNormalized]);

  const reloadDefaultTemplatePrefs = async () => {
    if (typeof desktopApi?.getCapturePrefs === 'function') {
      const p = await desktopApi.getCapturePrefs();
      const prefs = {
        pattern: p.defaultTemplateNamePattern ?? 'hospital_record_v1',
        nextNumber: p.defaultTemplateNextNumber ?? 1
      };
      saveDefaultTemplatePrefs(prefs);
      setDefaultTemplatePrefs(prefs);
      return;
    }
    setDefaultTemplatePrefs(loadDefaultTemplatePrefs());
  };

  useEffect(() => {
    void reloadDefaultTemplatePrefs();
  }, []);

  useEffect(() => {
    if (openMenu !== 'template') return;
    setNewTemplateDraft(
      buildDefaultTemplateName(defaultTemplatePrefs.pattern, defaultTemplatePrefs.nextNumber)
    );
  }, [openMenu, defaultTemplatePrefs.pattern, defaultTemplatePrefs.nextNumber]);

  useEffect(() => {
    if (openMenu !== 'template') return;
    refreshSavedTemplateKeys();
    const keys = listSavedAnnotationTemplateKeys();
    if (keys.includes(templateKeyNormalized)) {
      setSelectedSavedTemplateKey(templateKeyNormalized);
      setRenameTemplateDraft(templateKeyNormalized);
    } else {
      setSelectedSavedTemplateKey(null);
    }
  }, [openMenu, templateKeyNormalized]);

  async function bumpDefaultTemplateNumberAfterNew(usedName: string) {
    const pattern = defaultTemplatePrefs.pattern;
    if (!templateNamePatternUsesSequence(pattern)) return;
    let next = defaultTemplatePrefs.nextNumber + 1;
    const prefix = parseSequentialTemplateNamePrefix(pattern);
    if (prefix) {
      const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const m = usedName.match(new RegExp(`^${escaped}(\\d+)$`));
      if (m) next = Math.max(next, parseInt(m[1]!, 10) + 1);
    }
    const prefs = { pattern, nextNumber: next };
    if (typeof desktopApi?.setCapturePrefs === 'function') {
      await desktopApi.setCapturePrefs({ defaultTemplateNextNumber: next });
    }
    saveDefaultTemplatePrefs(prefs);
    setDefaultTemplatePrefs(prefs);
    setNewTemplateDraft(buildDefaultTemplateName(pattern, next));
  }

  useEffect(() => {
    const pending = pendingNewTemplateSaveRef.current;
    if (!pending || templateKeyNormalized !== pending || !image || !editorRef.current) return;
    pendingNewTemplateSaveRef.current = null;
    editorRef.current.saveTemplate();
    refreshSavedTemplateKeys();
  }, [templateKeyNormalized, image]);

  async function applyNewTemplateName() {
    const name = newTemplateDraft.trim();
    if (!name) {
      setTemplateToast('请输入新模板名称');
      return;
    }
    const isNew = !hasSavedAnnotationTemplate(name);
    if (isNew) registerAnnotationTemplatePlaceholder(name);
    refreshSavedTemplateKeys();
    setTemplateKey(name);
    setSelectedSavedTemplateKey(name);
    setRenameTemplateDraft(name);
    pendingNewTemplateSaveRef.current = name;
    if (templateNamePatternUsesSequence(defaultTemplatePrefs.pattern)) {
      await bumpDefaultTemplateNumberAfterNew(name);
    } else {
      setNewTemplateDraft('');
    }
    setTemplateToast(isNew ? `已新建模板「${name}」` : `已切换到模板「${name}」`);
  }

  function applyRenameTemplate() {
    const from = templateKeyNormalized;
    const to = renameTemplateDraft.trim();
    if (!to) {
      setTemplateToast('请输入重命名后的名称');
      return;
    }
    if (from === to) {
      setTemplateToast('名称未变化');
      return;
    }
    const wasSaved = savedTemplateKeys.includes(from);
    if (wasSaved) {
      const result = renameSavedAnnotationTemplate(from, to);
      if (result === 'exists') {
        setTemplateToast(`名称「${to}」已存在`);
        return;
      }
      if (result === 'not_found') {
        setTemplateToast('未找到要重命名的模板');
        return;
      }
      refreshSavedTemplateKeys();
    }
    setTemplateKey(to);
    setRenameTemplateDraft(to);
    setSelectedSavedTemplateKey(wasSaved ? to : null);
    setTemplateToast(wasSaved ? `已重命名为「${to}」` : `当前模板名已改为「${to}」`);
  }

  useEffect(() => {
    void reloadCapturePrefsFromDesktop();
  }, []);

  useEffect(() => {
    if (typeof desktopApi?.onCapturePrefsChanged !== 'function') return;
    const off = desktopApi.onCapturePrefsChanged((disk) => {
      const merged = mergeCapturePrefsSources(disk, null, { preferDisk: true });
      capturePrefsRef.current = merged;
      setCapturePrefs(merged);
    });
    return () => off();
  }, []);

  useEffect(() => {
    if (settingsOpen) return;
    if (skipPrefsReloadOnCloseRef.current) {
      skipPrefsReloadOnCloseRef.current = false;
      return;
    }
    void reloadCapturePrefsFromDesktop();
  }, [settingsOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem('screenshot.exportFormat', format);
    } catch {
      // ignore
    }
  }, [format]);

  useEffect(() => {
    try {
      window.localStorage.setItem('screenshot.exportQuality', String(exportQuality));
    } catch {
      // ignore
    }
  }, [exportQuality]);

  const [textFont, setTextFont] = useState('Microsoft YaHei');
  /** Style of the currently selected text node (toolbar only; does not change new-text defaults). */
  const [selectedTextStyle, setSelectedTextStyle] = useState<{
    fill: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    fontItalic: boolean;
    underline: boolean;
    align: 'left' | 'center' | 'right';
  } | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  function getTextToolbarStyle() {
    if (selectedTextId && selectedTextStyle) return selectedTextStyle;
    return {
      fill: textColor,
      fontSize: textSize,
      fontFamily: textFont,
      fontWeight: textWeight,
      fontItalic: textItalic,
      underline: textUnderline,
      align: textAlign
    };
  }
  function getNewTextTool(): Extract<Tool, { kind: 'text' }> {
    return {
      kind: 'text',
      fill: textColor,
      fontSize: textSize,
      fontFamily: textFont,
      padding: 6,
      align: textAlign,
      lineHeight: 1.25,
      letterSpacing: 0,
      fontWeight: textWeight,
      fontItalic: textItalic,
      underline: textUnderline
    };
  }
  useEffect(() => {
    setTextSizeDraft(String(getTextToolbarStyle().fontSize));
  }, [textSize, textColor, textFont, textWeight, textItalic, textUnderline, textAlign, selectedTextId, selectedTextStyle]);
  const [selectedArrowId, setSelectedArrowId] = useState<string | null>(null);
  const [autoDetectLoading, setAutoDetectLoading] = useState(false);
  const [ocrRegionPickMode, setOcrRegionPickMode] = useState(false);
  const ocrRegionPickModeRef = useRef(false);
  useEffect(() => {
    ocrRegionPickModeRef.current = ocrRegionPickMode;
  }, [ocrRegionPickMode]);
  const [hasDetectedRegions, setHasDetectedRegions] = useState(false);
  const [copyOk, setCopyOk] = useState(false);
  const [pasteHint, setPasteHint] = useState(false);
  const [templateToast, setTemplateToast] = useState<string | null>(null);
  useEffect(() => {
    if (!templateToast) return;
    const t = window.setTimeout(() => setTemplateToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [templateToast]);

  const [toolbarX, setToolbarX] = useState(() => {
    try {
      const raw = window.localStorage.getItem('screenshot.toolbarX');
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  });
  const toolbarDraggingRef = useRef(false);
  const toolbarDragStartXRef = useRef(0);
  const toolbarDragStartToolbarXRef = useRef(0);

  useEffect(() => {
    try {
      window.localStorage.setItem('screenshot.toolbarX', String(toolbarX));
    } catch {
      // ignore
    }
  }, [toolbarX]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!toolbarDraggingRef.current) return;
      const dx = e.clientX - toolbarDragStartXRef.current;
      setToolbarX(toolbarDragStartToolbarXRef.current + dx);
    };
    const onUp = () => {
      if (!toolbarDraggingRef.current) return;
      toolbarDraggingRef.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  // Always use latest auth state inside event callbacks.
  const isAuthedRef = useRef(false);
  const authVerifiedRef = useRef(false);
  function canUseAuthedFeatures(): boolean {
    // Single source of truth: must have a non-expired remembered session.
    return hasUsableStoredSession();
  }
  function markAuthVerified(v: boolean) {
    authVerifiedRef.current = v;
    setAuthVerified(v);
    try {
      if (typeof desktopApi?.setAuthGatePassed === 'function') desktopApi.setAuthGatePassed(!!v);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (typeof desktopApi?.onLoadImage !== 'function') return;
    const off = desktopApi.onLoadImage((p: { dataUrl: string }) => {
      if (!canUseAuthedFeatures()) return;
      addToQueueFromDataUrl(p.dataUrl, `capture_${Date.now()}.png`);
    });
    return () => off();
  }, []);

  useEffect(() => {
    if (typeof desktopApi?.onRequireLogin !== 'function') {
      console.warn('[renderer] desktopApi.onRequireLogin missing');
      return;
    }
    console.log('[renderer] registering onRequireLogin');
    const off = desktopApi.onRequireLogin(() => {
      console.log('[renderer] onRequireLogin fired');
      markAuthVerified(false);
      setLoginOpen(true);
    });
    return () => off();
  }, []);

  const [authBaseUrl, setAuthBaseUrl] = useState(() => {
    try {
      return window.localStorage.getItem('screenshot.authBaseUrl') ?? 'http://localhost:4177';
    } catch {
      return 'http://localhost:4177';
    }
  });

  function parseJwtExpiresAt(token: string): number {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return Date.now() + 30 * 60_000;
      const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/'))) as any;
      const exp = typeof payload.exp === 'number' ? payload.exp : 0;
      return exp > 0 ? exp * 1000 : Date.now() + 30 * 60_000;
    } catch {
      return Date.now() + 30 * 60_000;
    }
  }

  async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
    try {
      const res = await fetch(`${authBaseUrl}${path}`, {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...(init?.headers ?? {})
        }
      });
      const txt = await res.text();
      const data = txt ? (JSON.parse(txt) as any) : null;
      if (!res.ok) throw new Error(data?.error ?? `HTTP_${res.status}`);
      return data as T;
    } catch (e) {
      if (e instanceof Error && /fetch|network|Failed to fetch/i.test(e.message)) {
        throw new Error(`AUTH_SERVER_UNREACHABLE:${authBaseUrl}`);
      }
      throw e;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const raw = window.localStorage.getItem('screenshot.session');
        if (!raw) {
          setSession(null);
          markAuthVerified(false);
          setLoginOpen(true);
          return;
        }
        const s = JSON.parse(raw) as LocalSession;
        if (!s?.token) {
          setSession(null);
          markAuthVerified(false);
          setLoginOpen(true);
          return;
        }
        const tokenAtStart = s.token;
        const me = await apiJson<{ ok: true; user: LocalSession['user'] }>('/api/auth/me', {
          method: 'GET',
          headers: { authorization: `Bearer ${tokenAtStart}` }
        });
        // Ignore stale verify results if token changed during request.
        try {
          const rawNow = window.localStorage.getItem('screenshot.session');
          const tokenNow = rawNow ? (JSON.parse(rawNow) as any)?.token : null;
          if (!tokenNow || tokenNow !== tokenAtStart) return;
        } catch {
          // ignore
        }
        const next: LocalSession = { token: s.token, expiresAt: parseJwtExpiresAt(s.token), user: me.user };
        window.localStorage.setItem('screenshot.session', JSON.stringify(next));
        setSession(next);
        markAuthVerified(true);
        setLoginOpen(false);
      } catch (e) {
        // If server is temporarily unreachable, keep local token/session
        // so user is not blocked (e.g. Ctrl+V) by an online check.
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.startsWith('AUTH_SERVER_UNREACHABLE:')) {
          try {
            const raw = window.localStorage.getItem('screenshot.session');
            if (raw) {
              const parsed = JSON.parse(raw) as LocalSession;
              setSession(parsed);
              // Allow offline usage only when token is unexpired.
              if (typeof (parsed as any)?.expiresAt === 'number' && (parsed as any).expiresAt > Date.now() + 30_000) {
                markAuthVerified(true);
                setLoginOpen(false);
                return;
              }
            }
          } catch {
            // ignore
          }
          markAuthVerified(false);
          setLoginOpen(true);
          return;
        }
        // If token changed while we were verifying, ignore this failure.
        try {
          const rawNow = window.localStorage.getItem('screenshot.session');
          const tokenNow = rawNow ? (JSON.parse(rawNow) as any)?.token : null;
          if (tokenNow) return;
        } catch {
          // ignore
        }
        window.localStorage.removeItem('screenshot.session');
        setSession(null);
        markAuthVerified(false);
        setLoginOpen(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authBaseUrl]);

  function normalizePhone(raw: string): string {
    const digits = raw.replace(/[^\d]/g, '');
    if (digits.length === 13 && digits.startsWith('86')) return digits.slice(2);
    return digits;
  }

  function normalizeEmail(raw: string): string {
    return raw.trim().toLowerCase();
  }

  function getStoredSessionSummary(): { token: string; expiresAt?: number } | null {
    try {
      const raw = window.localStorage.getItem('screenshot.session');
      if (!raw) return null;
      const s = JSON.parse(raw) as any;
      if (!s?.token) return null;
      const expiresAtRaw = s.expiresAt;
      const expiresAt = typeof expiresAtRaw === 'number' ? expiresAtRaw : Number(expiresAtRaw);
      return {
        token: String(s.token),
        ...(Number.isFinite(expiresAt) ? { expiresAt } : {})
      };
    } catch {
      return null;
    }
  }

  function hasUsableStoredSession(): boolean {
    const s = getStoredSessionSummary();
    if (!s?.token) return false;
    if (typeof s.expiresAt === 'number' && Number.isFinite(s.expiresAt)) {
      // small skew buffer
      return s.expiresAt > Date.now() + 30_000;
    }
    // If expiresAt is missing, treat as not-remembered to be safe.
    return false;
  }

  const [loginOpen, setLoginOpen] = useState(() => {
    return !hasUsableStoredSession();
  });
  const [authVerified, setAuthVerified] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneMode, setPhoneMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerPassword2, setRegisterPassword2] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailCooldownUntil, setEmailCooldownUntil] = useState(0);
  const [emailTick, setEmailTick] = useState(0);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    if (!emailCooldownUntil) return;
    const t = window.setInterval(() => setEmailTick((v) => v + 1), 250);
    return () => window.clearInterval(t);
  }, [emailCooldownUntil]);

  const emailRemainSec = Math.max(0, Math.ceil((emailCooldownUntil - Date.now()) / 1000));

  function formatAuthError(err: unknown): string {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith('AUTH_SERVER_UNREACHABLE:')) {
      const base = msg.slice('AUTH_SERVER_UNREACHABLE:'.length);
      return `无法连接认证服务（${base}）。请先启动后端：npm run dev:server`;
    }
    if (msg === 'INVALID_INPUT') return '手机号或密码格式不正确（手机号需为 11 位，密码至少 6 位）';
    if (msg === 'PHONE_EXISTS') return '该手机号已注册，请直接登录';
    if (msg === 'INVALID_CREDENTIALS') return '手机号或密码错误';
    if (msg === 'TOO_MANY_ATTEMPTS') return '尝试次数过多，请稍后再试';
    if (msg === 'UNAUTHORIZED') return '登录已过期，请重新登录';
    if (msg === 'TOO_FREQUENT') return '验证码发送太频繁，请稍后再试';
    if (msg === 'INVALID_CODE') return '验证码错误或已过期';
    if (msg === 'PHONE_NOT_FOUND') return '该手机号未注册';
    if (msg === 'EMAIL_EXISTS') return '该邮箱已注册，请直接登录';
    if (msg === 'EMAIL_NOT_FOUND') return '该邮箱未注册';
    if (msg === 'EMAIL_DOMAIN_INVALID') return '邮箱域名不存在或无法接收邮件，请检查邮箱是否真实有效';
    return `操作失败：${msg}`;
  }

  function persistSession(s: LocalSession | null) {
    try {
      if (!s) window.localStorage.removeItem('screenshot.session');
      else window.localStorage.setItem('screenshot.session', JSON.stringify(s));
    } catch {
      // ignore
    }
    setSession(s);
  }

  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      if (!canUseAuthedFeatures()) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (!blob) return;
          const dataUrl = await blobToDataUrl(blob);
          if (activeItem && viewMode === 'workspace') {
            await addPastedLayerFromDataUrl(dataUrl);
          } else {
            addToQueueFromDataUrl(dataUrl);
          }
          return;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [activeItem, viewMode]);

  const isAuthed = !!session?.token;
  useEffect(() => {
    isAuthedRef.current = isAuthed;
    authVerifiedRef.current = authVerified;
  }, [isAuthed, authVerified]);
  const canRenderEditor = hostReady && !!image && authVerified && viewMode === 'editing';

  function getTool(kind: 'select' | 'mosaic' | 'arrow' | 'text'): Tool {
    if (kind === 'select') return baseTools.select;
    if (kind === 'arrow')
      return {
        kind: 'arrow',
        arrowKind,
        stroke: arrowColor,
        strokeWidth: arrowStrokeWidth,
        pointerLength: arrowPointerSize,
        pointerWidth: arrowPointerSize,
        opacity: arrowOpacity,
        shadow: arrowShadow
      };
    if (kind === 'text') return getNewTextTool();
    return {
      kind: 'mosaic',
      pixelSize: mosaicPixelSize,
      mode: mosaicMode,
      style: mosaicStyle,
      brushSize: mosaicBrushSize,
      blurRadius: mosaicBlurRadius
    };
  }

  function setTool(kind: 'select' | 'mosaic' | 'arrow' | 'text') {
    setActive(kind);
    editorRef.current?.setTool(getTool(kind));
    if (kind === 'select') return;
    setHintTool(null);
  }

  function handleTextCreated() {
    // After creating a text box, automatically switch back to select tool
    setTool('select');
  }

  function applyMosaic(
    next: {
      mode?: 'rect' | 'brush';
      style?: 'pixel' | 'blur';
      brushSize?: number;
      level?: (typeof MOSAIC_LEVELS)[number]['name'];
      pixelSize?: number;
      blurRadius?: number;
    },
    opts?: { defaultsOnly?: boolean }
  ) {
    const defaultsOnly = !!opts?.defaultsOnly;
    const nextMode = next.mode ?? mosaicMode;
    const nextStyle = next.style ?? mosaicStyle;
    const nextBrushSize = next.brushSize ?? mosaicBrushSize;
    const nextLevel = next.level ?? mosaicLevel;
    const levelConf = MOSAIC_LEVELS.find((l) => l.name === nextLevel);
    const nextPixelSize =
      typeof next.pixelSize === 'number'
        ? next.pixelSize
        : next.level != null
          ? (levelConf?.pixelSize ?? mosaicPixelSize)
          : mosaicPixelSize;
    const nextBlurRadius =
      typeof next.blurRadius === 'number'
        ? next.blurRadius
        : next.level != null
          ? (levelConf?.blurRadius ?? mosaicBlurRadius)
          : mosaicBlurRadius;
    setMosaicMode(nextMode);
    setMosaicStyle(nextStyle);
    if (next.brushSize != null) setMosaicBrushSize(next.brushSize);
    if (next.level != null) setMosaicLevel(nextLevel);
    if (Number.isFinite(nextPixelSize)) setMosaicPixelSize(clampMosaicPixel(nextPixelSize));
    if (Number.isFinite(nextBlurRadius)) setMosaicBlurRadius(clampMosaicBlur(nextBlurRadius));
    const px = Number.isFinite(nextPixelSize) ? clampMosaicPixel(nextPixelSize) : mosaicPixelSize;
    const br = Number.isFinite(nextBlurRadius) ? clampMosaicBlur(nextBlurRadius) : mosaicBlurRadius;
    const toolPayload = {
      kind: 'mosaic' as const,
      pixelSize: px,
      mode: nextMode,
      style: nextStyle,
      brushSize: nextBrushSize,
      blurRadius: br
    };
    if (!defaultsOnly) {
      const hadMosaicSelection =
        editorRef.current?.applyMosaicStyle({
          pixelSize: px,
          style: nextStyle,
          blurRadius: br,
          brushSize: nextBrushSize
        }) ?? false;
      if (hadMosaicSelection) {
        editorRef.current?.setTool({ kind: 'select' });
        setActive('mosaic');
        return;
      }
      setActive('mosaic');
      editorRef.current?.setTool(toolPayload);
    } else if (activeRef.current === 'mosaic') {
      editorRef.current?.setTool(toolPayload);
    }
  }

  function applyArrow(
    next: {
      kind?: 'straight' | 'elbow' | 'curve';
      color?: string;
      strokeWidth?: number;
      pointerSize?: number;
      opacity?: number;
      shadow?: boolean;
    },
    opts?: { defaultsOnly?: boolean }
  ) {
    const defaultsOnly = !!opts?.defaultsOnly;
    if (next.kind != null) setArrowKind(next.kind);
    if (next.color != null) setArrowColor(next.color);
    if (next.strokeWidth != null) setArrowStrokeWidth(next.strokeWidth);
    if (next.pointerSize != null) setArrowPointerSize(next.pointerSize);
    if (next.opacity != null) setArrowOpacity(next.opacity);
    if (next.shadow != null) setArrowShadow(next.shadow);
    const stylePatch = {
      arrowKind: next.kind ?? arrowKind,
      stroke: next.color ?? arrowColor,
      strokeWidth: next.strokeWidth ?? arrowStrokeWidth,
      pointerSize: next.pointerSize ?? arrowPointerSize,
      opacity: next.opacity ?? arrowOpacity,
      shadow: next.shadow ?? arrowShadow
    } as const;
    if (defaultsOnly) {
      if (selectedArrowId) return;
      if (activeRef.current === 'arrow') {
        editorRef.current?.setTool({
          kind: 'arrow',
          arrowKind: stylePatch.arrowKind,
          stroke: stylePatch.stroke,
          strokeWidth: stylePatch.strokeWidth,
          pointerLength: stylePatch.pointerSize,
          pointerWidth: stylePatch.pointerSize,
          opacity: stylePatch.opacity,
          shadow: stylePatch.shadow
        });
      }
      return;
    }
    if (selectedArrowId) {
      editorRef.current?.applyArrowStyle(stylePatch);
      return;
    }
    setActive('arrow');
    editorRef.current?.setTool({
      kind: 'arrow',
      arrowKind: stylePatch.arrowKind,
      stroke: stylePatch.stroke,
      strokeWidth: stylePatch.strokeWidth,
      pointerLength: stylePatch.pointerSize,
      pointerWidth: stylePatch.pointerSize,
      opacity: stylePatch.opacity,
      shadow: stylePatch.shadow
    });
  }

  function applyText(
    next: {
      color?: string;
      size?: number;
      weight?: 'normal' | 'bold';
      italic?: boolean;
      underline?: boolean;
      align?: 'left' | 'center' | 'right';
      font?: string;
    },
    opts?: { defaultsOnly?: boolean }
  ) {
    const defaultsOnly = !!opts?.defaultsOnly;
    const editingSelected = !!selectedTextId && !defaultsOnly;
    const ui = getTextToolbarStyle();
    const fill = next.color ?? ui.fill;
    const fontSize = next.size ?? ui.fontSize;
    const fontFamily = next.font ?? ui.fontFamily;
    const fontWeight = next.weight ?? ui.fontWeight;
    const fontItalic = next.italic ?? ui.fontItalic;
    const underline = next.underline ?? ui.underline;
    const align = next.align ?? ui.align;

    const stylePatch = {
      fill,
      fontSize,
      fontFamily,
      fontWeight,
      fontItalic,
      underline,
      align,
      lineHeight: 1.25,
      letterSpacing: 0
    } as const;

    if (!editingSelected) {
      if (next.color != null) setTextColor(next.color);
      if (next.size != null) setTextSize(next.size);
      if (next.weight != null) setTextWeight(next.weight);
      if (next.italic != null) setTextItalic(next.italic);
      if (next.underline != null) setTextUnderline(next.underline);
      if (next.align != null) setTextAlign(next.align);
      if (next.font != null) setTextFont(next.font);
    } else if (selectedTextStyle) {
      setSelectedTextStyle({
        ...selectedTextStyle,
        ...(next.color != null ? { fill: next.color } : {}),
        ...(next.size != null ? { fontSize: next.size } : {}),
        ...(next.font != null ? { fontFamily: next.font } : {}),
        ...(next.weight != null ? { fontWeight: next.weight } : {}),
        ...(next.italic != null ? { fontItalic: next.italic } : {}),
        ...(next.underline != null ? { underline: next.underline } : {}),
        ...(next.align != null ? { align: next.align } : {})
      });
    }

    if (defaultsOnly) {
      if (editingSelected) return;
      if (activeRef.current === 'text') editorRef.current?.setTool(getNewTextTool());
      return;
    }

    if (selectedTextId) {
      editorRef.current?.applyTextStyle(stylePatch);
      return;
    }
    editorRef.current?.setTool(getNewTextTool());
  }

  function buildCommonStylePrefs(): CommonStylePrefs {
    return {
      mosaicMode,
      mosaicStyle,
      mosaicBrushSize,
      mosaicLevel,
      mosaicPixelSize,
      mosaicBlurRadius,
      arrowColor,
      arrowStrokeWidth,
      arrowPointerSize,
      arrowKind,
      arrowOpacity,
      arrowShadow,
      textColor,
      textSize,
      textWeight,
      textItalic,
      textUnderline,
      textAlign,
      textFont
    };
  }

  function applyCommonStylePrefs(prefs: Partial<CommonStylePrefs>) {
    applyMosaic({
      mode: prefs.mosaicMode,
      style: prefs.mosaicStyle,
      brushSize: prefs.mosaicBrushSize,
      level: prefs.mosaicLevel,
      pixelSize: prefs.mosaicPixelSize,
      blurRadius: prefs.mosaicBlurRadius
    });
    applyArrow({
      kind: prefs.arrowKind,
      color: prefs.arrowColor,
      strokeWidth: prefs.arrowStrokeWidth,
      pointerSize: prefs.arrowPointerSize,
      opacity: prefs.arrowOpacity,
      shadow: prefs.arrowShadow
    });
    applyText({
      color: prefs.textColor,
      size: prefs.textSize,
      weight: prefs.textWeight,
      italic: prefs.textItalic,
      underline: prefs.textUnderline,
      align: prefs.textAlign,
      font: prefs.textFont
    });
    setTool('select');
  }

  function loadCommonStylePrefs(): Partial<CommonStylePrefs> | null {
    try {
      const raw = window.localStorage.getItem(COMMON_STYLE_PREFS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<CommonStylePrefs>;
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  function saveCommonStylePrefs() {
    try {
      window.localStorage.setItem(COMMON_STYLE_PREFS_KEY, JSON.stringify(buildCommonStylePrefs()));
      setTemplateToast('常用属性已保存');
    } catch {
      setTemplateToast('常用属性保存失败');
    }
  }

  function applySavedCommonStylePrefs(showToast = false) {
    const prefs = loadCommonStylePrefs();
    if (!prefs) {
      if (showToast) setTemplateToast('未找到常用属性，请先保存');
      return;
    }
    applyCommonStylePrefs(prefs);
    if (showToast) setTemplateToast('已应用常用属性');
  }

  useEffect(() => {
    applySavedCommonStylePrefs(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastAppliedCommonStyleTokenRef = useRef<string | null>(null);
  useEffect(() => {
    if (!authVerified || !session?.token) return;
    if (lastAppliedCommonStyleTokenRef.current === session.token) return;
    lastAppliedCommonStyleTokenRef.current = session.token;
    applySavedCommonStylePrefs(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authVerified, session?.token]);

  async function getExportDataUrl(): Promise<string | null> {
    if (viewMode === 'editing' && editorRef.current) {
      return exportCurrentDataUrl();
    }
    if (!activeItem) return null;
    const composite = await compositeQueueItem(activeItem);
    return composite.dataUrl;
  }

  async function beginPasteLayerAdjust(dataUrl: string) {
    if (!activeItem || viewMode !== 'workspace') return;
    const composite = await compositeQueueItem(activeItem);
    setPasteAdjust({
      dataUrl,
      baseDataUrl: composite.dataUrl,
      canvasWidth: composite.width,
      canvasHeight: composite.height
    });
  }

  async function confirmPasteLayer(result: PasteLayerAdjustResult) {
    if (!activeItem || !pasteAdjust) return;
    pushWorkspaceHistory();
    const layer = createPastedLayer(
      { kind: 'dataUrl', dataUrl: result.imageDataUrl },
      pasteAdjust.canvasWidth,
      pasteAdjust.canvasHeight,
      result.width,
      result.height
    );
    layer.x = result.x;
    layer.y = result.y;
    layer.width = result.width;
    layer.height = result.height;
    const mergedItem = { ...activeItem, layers: [...activeItem.layers, layer] };
    const composite = await compositeQueueItem(mergedItem);
    setQueue((prev) =>
      prev.map((it, i) =>
        i === activeIndex ? { ...it, image: { kind: 'dataUrl', dataUrl: composite.dataUrl }, layers: [] } : it
      )
    );
    setPasteAdjust(null);
    setTemplateToast('已合并粘贴图层');
  }

  async function addPastedLayerFromDataUrl(dataUrl: string) {
    await beginPasteLayerAdjust(dataUrl);
  }

  async function copyDataUrlToClipboard(dataUrl: string) {
    if (typeof desktopApi?.copyClipboard === 'function') {
      await desktopApi.copyClipboard({ dataUrl });
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
      return;
    }
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const anyNav = navigator as any;
    if (anyNav.clipboard?.write && typeof (window as any).ClipboardItem !== 'undefined') {
      await anyNav.clipboard.write([new (window as any).ClipboardItem({ 'image/png': blob })]);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    }
  }

  async function onWorkspaceCopy() {
    const dataUrl = await getExportDataUrl();
    if (!dataUrl) return;
    await copyDataUrlToClipboard(dataUrl);
  }

  async function onWorkspacePaste() {
    if (!activeItem || viewMode !== 'workspace') return;
    if (typeof desktopApi?.readClipboardImage === 'function') {
      const res = await desktopApi.readClipboardImage();
      if (res.ok && res.dataUrl) {
        await addPastedLayerFromDataUrl(res.dataUrl);
        return;
      }
    }
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const dataUrl = await blobToDataUrl(blob);
            await addPastedLayerFromDataUrl(dataUrl);
            return;
          }
        }
      }
      setTemplateToast('剪贴板中没有图片，请使用 Ctrl+V');
    } catch {
      setTemplateToast('请使用 Ctrl+V 粘贴剪贴板图片');
    }
  }

  async function enterEditingMode() {
    if (!activeItem) return;
    if (activeItem.layers.length > 0) {
      const composite = await compositeQueueItem(activeItem);
      setQueue((prev) =>
        prev.map((it, i) =>
          i === activeIndex
            ? { ...it, image: { kind: 'dataUrl', dataUrl: composite.dataUrl }, layers: [] }
            : it
        )
      );
    }
    setViewMode('editing');
    setActive('select');
    setOpenMenu(null);
    setHintTool(null);
  }

  function templateKeyForApply(): string {
    return (selectedSavedTemplateKey ?? templateKeyNormalized).trim();
  }

  async function exitEditingAndMerge() {
    if (!editorRef.current || !activeItem) return;
    await persistCurrentAnnotations();
    const dataUrl = await exportCurrentDataUrl();
    if (!dataUrl) return;
    setQueue((prev) =>
      prev.map((it, i) =>
        i === activeIndex ? { ...it, image: { kind: 'dataUrl', dataUrl }, layers: [], annotations: null } : it
      )
    );
    setWorkspacePreview(dataUrl);
    try {
      const dims = await loadImageDimensions({ kind: 'dataUrl', dataUrl });
      setPreviewSize(dims);
    } catch {
      // preview refresh below will retry
    }
    setSelectedTextId(null);
    setSelectedArrowId(null);
    setActive('select');
    setOpenMenu(null);
    setHintTool(null);
    setCropMode(false);
    setAlignMode(false);
    const ed = editorRef.current;
    ed.setTransformMode('none');
    ed.clearCrop();
    ed.setBackgroundDragMode(false);
    ed.resetBackgroundOffset();
    ed.clearAnnotations();
    ed.setTool(baseTools.select);
    setViewMode('workspace');
    setWorkspaceZoom(1);
    workspaceHistoryRef.current.clear(activeItem.id);
    syncWorkspaceHistoryFlags();
    setTemplateToast('已合并图层并返回工作区');
    requestAnimationFrame(() => onWorkspaceZoomFit());
  }

  async function onResizeConfirm(result: { width: number; height: number; antialias: boolean }) {
    if (!activeItem) return;
    pushWorkspaceHistory();
    const composite = await compositeQueueItem(activeItem);
    const resized = await resizeImageDataUrl(composite.dataUrl, result.width, result.height, result.antialias);
    setQueue((prev) =>
      prev.map((it, i) =>
        i === activeIndex
          ? { ...it, image: { kind: 'dataUrl', dataUrl: resized }, layers: [], annotations: null }
          : it
      )
    );
    setResizeOpen(false);
    setTemplateToast('已调整大小');
  }

  function onWorkspaceZoomIn() {
    setWorkspaceZoom((z) => Math.min(8, Math.round((z + 0.25) * 100) / 100));
  }

  function onWorkspaceZoomOut() {
    setWorkspaceZoom((z) => Math.max(0.1, Math.round((z - 0.25) * 100) / 100));
  }

  function onWorkspaceZoomSelect(zoom: number) {
    setWorkspaceZoom(Math.min(8, Math.max(0.1, Math.round(zoom * 100) / 100)));
  }

  function onWorkspaceZoomFit() {
    const stage = workspaceStageRef.current;
    if (!stage || !previewSize.width || !previewSize.height) {
      onWorkspaceZoomSelect(1);
      return;
    }
    const pad = 48;
    const scale = Math.min(
      (stage.clientWidth - pad) / previewSize.width,
      (stage.clientHeight - pad) / previewSize.height
    );
    onWorkspaceZoomSelect(Math.max(0.1, Math.round(scale * 100) / 100));
  }

  async function onSaveAs() {
    await saveCurrentImage({ forceDialog: true });
  }

  async function onSave() {
    await saveCurrentImage({ forceDialog: !capturePrefs.autoSaveImages });
  }

  async function onWorkspaceSave() {
    const action = capturePrefs.finishButtonAction;
    const saved = await saveCurrentImage({ forceDialog: !capturePrefs.autoSaveImages });
    if (saved && action === 'next' && queue.length > 1) {
      const nextIndex = activeIndex >= queue.length - 1 ? 0 : activeIndex + 1;
      switchTo(nextIndex);
    }
  }

  async function onExportAnnotationsLayerImage() {
    if (!editorRef.current || !image) return;
    try {
      const blob = await editorRef.current.exportAnnotationsLayer({ format: 'png' });
      const dataUrl = await blobToDataUrl(blob);
      if (typeof desktopApi?.saveFile === 'function') {
        await desktopApi.saveFile({ dataUrl, format: 'png' });
        setTemplateToast('已导出模版图层（PNG，透明背景）');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `annotations_layer_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setTemplateToast('已下载模版图层 PNG');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setTemplateToast(`导出模版图层失败：${msg}`);
    }
  }

  async function persistCurrentAnnotations() {
    if (!queue[activeIndex] || !editorRef.current) return;
    const snap = editorRef.current.exportAnnotations();
    setQueue((prev) => prev.map((it, i) => (i === activeIndex ? { ...it, annotations: snap } : it)));
  }

  async function exportCurrentDataUrl(): Promise<string | null> {
    if (viewMode === 'editing' && editorRef.current) {
      const blob = await editorRef.current.export({
        format,
        quality: isLossyFormat ? exportQuality : undefined
      });
      return blobToDataUrl(blob);
    }
    if (!activeItem) return null;
    const composite = await compositeQueueItem(activeItem);
    return composite.dataUrl;
  }

  async function saveCurrentImage(opts?: { forceDialog?: boolean }): Promise<boolean> {
    const dataUrl = await exportCurrentDataUrl();
    if (!dataUrl) return false;
    const useAutoSave = !opts?.forceDialog && !!capturePrefs.autoSaveImages;

    if (useAutoSave) {
      if (!capturePrefs.defaultSaveDir.trim()) {
        setTemplateToast('请先在设置 → 自动保存 中指定默认保存文件夹');
      } else {
        const autoPayload = {
          dataUrl,
          format,
          auto: true as const,
          defaultSaveDir: capturePrefs.defaultSaveDir,
          saveFilenamePattern: capturePrefs.saveFilenamePattern,
          saveFilenameNextNumber: capturePrefs.saveFilenameNextNumber
        };
        try {
          let r: {
            saved?: boolean;
            filePath?: string;
            saveFilenameNextNumber?: number;
            reason?: string;
            message?: string;
          } | null = null;
          const api = getDesktopApi();
          if (typeof api?.saveFile === 'function') {
            r = await (api.saveFile as (p: typeof autoPayload) => Promise<typeof r>)(autoPayload);
          } else if (typeof api?.saveFileAuto === 'function') {
            r = await (api.saveFileAuto as (p: typeof autoPayload) => Promise<typeof r>)(autoPayload);
          } else if (typeof api?.invoke === 'function') {
            r = await (api.invoke as (ch: string, p: unknown) => Promise<typeof r>)('editor:saveFileAuto', autoPayload);
          }
          if (r?.saved) {
            const nextSeq =
              typeof r.saveFilenameNextNumber === 'number' ? r.saveFilenameNextNumber : capturePrefs.saveFilenameNextNumber;
            setCapturePrefs((prev) => {
              const next = { ...prev, saveFilenameNextNumber: nextSeq };
              saveAllCapturePrefsToLocal(next);
              return next;
            });
            const leaf = r.filePath ? r.filePath.replace(/^.*[/\\]/, '') : '';
            setTemplateToast(leaf ? `已自动保存：${leaf}` : '已自动保存');
            return true;
          }
          if (r?.reason === 'no_dir') {
            setTemplateToast('默认保存文件夹无效，将打开另存为…');
          } else if (r?.reason === 'write_failed') {
            setTemplateToast(`自动保存失败：${r.message ?? '写入失败'}，将打开另存为…`);
          } else if (r) {
            setTemplateToast('自动保存失败，将打开另存为…');
          } else {
            setTemplateToast('无法连接保存服务，请完全退出后重启应用');
          }
        } catch (err) {
          console.warn('[EditorScreen] auto save failed', err);
          setTemplateToast('自动保存失败，将打开另存为…');
        }
      }
    }
    const api = getDesktopApi();
    if (typeof api?.saveFile === 'function') {
      const r = await (api.saveFile as (p: { dataUrl: string; format: typeof format }) => Promise<{ saved?: boolean; filePath?: string; saveFilenameNextNumber?: number }>)({
        dataUrl,
        format
      });
      if (r?.saved) {
        if (typeof r.saveFilenameNextNumber === 'number') {
          setCapturePrefs((prev) => ({ ...prev, saveFilenameNextNumber: r.saveFilenameNextNumber }));
        } else {
          void reloadCapturePrefsFromDesktop();
        }
        const leaf = r.filePath ? r.filePath.replace(/^.*[/\\]/, '') : '';
        setTemplateToast(leaf ? `已保存：${leaf}` : '已保存');
        return true;
      }
      return false;
    }
    const ext = format === 'jpeg' ? 'jpg' : format;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `screenshot_${Date.now()}.${ext}`;
    a.click();
    return true;
  }

  async function onToolbarFinish() {
    await exitEditingAndMerge();
  }

  async function onImportMoreImages() {
    if (!canUseAuthedFeatures()) return;
    const items = await loadQueueItemsFromDesktopDialog();
    if (items !== null) {
      if (items.length > 0) appendQueueItems(items);
      return;
    }
    fileInputRef.current?.click();
  }

  async function onPickImage() {
    if (!canUseAuthedFeatures()) return;
    const items = await loadQueueItemsFromDesktopDialog();
    if (items !== null) {
      if (items.length > 0) appendQueueItems(items);
      return;
    }
    fileInputRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter(isImageLikeFile);
    if (files.length === 0) return;
    (async () => {
      const items: QueueItem[] = [];
      for (const f of files) {
        const dataUrl = await blobToDataUrl(f);
        items.push(createQueueItem({ name: f.name, image: { kind: 'dataUrl', dataUrl } }));
      }
      appendQueueItems(items);
    })();
    e.target.value = '';
  }

  async function onLogin() {
    setLoginOpen(true);
  }

  async function onLogout() {
    try {
      if (session?.token) await apiJson('/api/auth/logout', { method: 'POST', headers: { authorization: `Bearer ${session.token}` } });
    } catch {
      // ignore
    }
    persistSession(null);
    markAuthVerified(false);
  }

  function exitImageEditing() {
    setSelectedTextId(null);
    setSelectedArrowId(null);
    setActive('select');
    setOpenMenu(null);
    setHintTool(null);
    setCropMode(false);
    setAlignMode(false);
    setSettingsOpen(false);
    setViewMode('workspace');
    setWorkspaceZoom(1);
    setResizeOpen(false);
    const ed = editorRef.current;
    if (ed) {
      ed.setTransformMode('none');
      ed.clearCrop();
      ed.setBackgroundDragMode(false);
      ed.resetBackgroundOffset();
      ed.clearAnnotations();
      ed.setTool(baseTools.select);
    }
    setQueue([]);
    setActiveIndex(0);
  }

  /** Remove current image from queue; exit editing when only one image left. */
  function closeCurrentImageInQueue() {
    if (queue.length <= 1) {
      exitImageEditing();
      return;
    }
    const newIndex = activeIndex >= queue.length - 1 ? activeIndex - 1 : activeIndex;
    setQueue((prev) => prev.filter((_, i) => i !== activeIndex));
    setActiveIndex(newIndex);
    setViewMode('workspace');
    setWorkspaceZoom(1);
    setSelectedTextId(null);
    setSelectedArrowId(null);
    setActive('select');
    setOpenMenu(null);
    setHintTool(null);
    setCropMode(false);
    setAlignMode(false);
    setHasDetectedRegions(false);
    const ed = editorRef.current;
    if (ed) {
      ed.setTransformMode('none');
      ed.clearCrop();
      ed.clearDetectedRegions();
      ed.setBackgroundDragMode(false);
      ed.resetBackgroundOffset();
      ed.setTool(baseTools.select);
    }
  }

  /** Close one tab by index; only exits to home when it was the last image. */
  function closeTabAtIndex(index: number) {
    if (index < 0 || index >= queue.length) return;
    if (queue.length <= 1) {
      exitImageEditing();
      return;
    }
    if (index === activeIndex) {
      closeCurrentImageInQueue();
      return;
    }
    setQueue((prev) => prev.filter((_, i) => i !== index));
    if (index < activeIndex) setActiveIndex(activeIndex - 1);
  }

  /** Toolbar [关闭] — behavior from settings (exit all vs close current when multiple). */
  function onCloseImage() {
    if (capturePrefs.toolbarCloseButtonAction === 'close_current') {
      closeCurrentImageInQueue();
      return;
    }
    exitImageEditing();
  }

  function switchTo(index: number) {
    if (index < 0 || index >= queue.length) return;
    if (viewMode === 'editing' && queue[activeIndex] && editorRef.current) {
      const snap = editorRef.current.exportAnnotations();
      setQueue((prev) => prev.map((it, i) => (i === activeIndex ? { ...it, annotations: snap } : it)));
    }
    setActiveIndex(index);
    setSelectedTextId(null);
    setSelectedArrowId(null);
    setActive('select');
    setOpenMenu(null);
    setHintTool(null);
    setWorkspaceZoom(1);
    if (viewMode === 'editing') {
      editorRef.current?.setTool(baseTools.select);
    }
  }

  // Align mode UX: click on blank/canvas to finish, auto-save and exit align mode.
  useEffect(() => {
    if (!alignMode) return;
    const onMouseDownCapture = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      // Ignore clicks on toolbar/buttons/menus.
      if (target.closest('.captureBar') || target.closest('button') || target.closest('details') || target.closest('input') || target.closest('select')) {
        return;
      }
      // Treat clicks inside editor host (except toolbar/menu controls) as finish.
      const host = hostRef.current;
      if (!host || !host.contains(target)) return;

      // Persist current per-image annotations (including bgOffset) then exit.
      if (editorRef.current && queue[activeIndex]) {
        const snap = editorRef.current.exportAnnotations();
        setQueue((prev) => prev.map((it, i) => (i === activeIndex ? { ...it, annotations: snap } : it)));
      }
      setAlignMode(false);
    };
    window.addEventListener('mousedown', onMouseDownCapture, true);
    return () => window.removeEventListener('mousedown', onMouseDownCapture, true);
  }, [alignMode, activeIndex, queue]);

  // Close toolbar dropdown on blank canvas click only (not when clicking annotations to edit).
  useEffect(() => {
    if (!openMenu) return;
    const menuTool = openMenu;
    const onMouseDownCapture = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('.captureBar') ||
        target.closest('.fscSettingsOverlay') ||
        target.closest('.fscSettingsDialog')
      ) {
        return;
      }
      const host = hostRef.current;
      if (!host || !host.contains(target)) return;
      if (editorRef.current?.isPointerOnAnnotationAt(ev.clientX, ev.clientY)) return;
      setOpenMenu(null);
      if (menuTool === 'template') setHintTool('template');
    };
    window.addEventListener('mousedown', onMouseDownCapture, true);
    return () => window.removeEventListener('mousedown', onMouseDownCapture, true);
  }, [openMenu]);

  useEffect(() => {
    editorRef.current?.setBackgroundDragMode(alignMode ? 'align' : false);
  }, [alignMode]);

  async function getImageDataUrl(src: ImageSource): Promise<string> {
    if (src.kind === 'dataUrl') return src.dataUrl;
    if (src.kind === 'blob') return blobToDataUrl(src.blob);
    const res = await fetch(src.url);
    return blobToDataUrl(await res.blob());
  }

  async function runAutoDetectMosaic(region?: { x: number; y: number; width: number; height: number }) {
    if (!editorRef.current) return;
    setAutoDetectLoading(true);
    try {
      const ocr = await editorRef.current.getOcrInput(region);
      const Tesseract = (await import('tesseract.js')).default;
      const { workerPath, corePath } = getTesseractAssetUrls();
      const rects = await recognizeTextRegions(ocr, { workerPath, corePath }, Tesseract as any, {
        groupMode: capturePrefs.ocrDetectGroupMode
      });
      if (rects.length > 0) {
        editorRef.current.setDetectedRegions(rects);
        setHasDetectedRegions(true);
      } else {
        editorRef.current.clearDetectedRegions();
        setHasDetectedRegions(false);
        alert(region ? '框选区域内未找到可打码的文字（可换更大区域或更清晰的图试试）' : '自动检测未找到可打码的文字区域（可以换一张更清晰的图试试）');
      }
    } catch (err) {
      editorRef.current?.clearDetectedRegions();
      setHasDetectedRegions(false);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`自动检测失败：${msg || '未知错误'}`);
    } finally {
      setAutoDetectLoading(false);
      ocrRegionPickModeRef.current = false;
      setOcrRegionPickMode(false);
    }
  }

  async function onAutoDetectMosaic() {
    await runAutoDetectMosaic();
  }

  function onAutoDetectMosaicInRegion() {
    if (!editorRef.current || autoDetectLoading) return;
    ocrRegionPickModeRef.current = true;
    setOcrRegionPickMode(true);
    setOpenMenu('mosaic');
    setTemplateToast('在图上拖动框选检测区域，Esc 取消');
    editorRef.current.beginOcrRegionPick();
  }

  function onOcrRegionPicked(region: { x: number; y: number; width: number; height: number }) {
    void runAutoDetectMosaic(region);
  }

  function onOcrRegionPickCancelled() {
    ocrRegionPickModeRef.current = false;
    setOcrRegionPickMode(false);
  }

  function onApplyDetectedMosaic() {
    if (!editorRef.current || !hasDetectedRegions) return;
    editorRef.current.applyDetectedRegionsAsMosaic({
      style: mosaicStyle,
      pixelSize: mosaicPixelSize,
      blurRadius: mosaicBlurRadius
    });
    editorRef.current.clearDetectedRegions();
    setHasDetectedRegions(false);
  }

  function onCancelDetectedMosaic() {
    if (!editorRef.current) return;
    editorRef.current.clearDetectedRegions();
    setHasDetectedRegions(false);
  }

  return (
    <div className="page">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={onFileSelected}
      />
      {image && viewMode === 'editing' ? (
        <div className="topbar">
          <div
            className={`captureBar draggable ${toolbarDraggingRef.current ? 'dragging' : ''}`}
            role="toolbar"
            aria-label="编辑工具栏"
            style={{ transform: `translateX(${toolbarX}px)` }}
            onPointerDown={(e) => {
              const target = e.target as HTMLElement | null;
              if (
                target &&
                (target.closest('button') ||
                  target.closest('summary') ||
                  target.closest('select') ||
                  target.closest('input') ||
                  target.closest('textarea') ||
                  target.closest('details'))
              ) {
                return;
              }
              toolbarDraggingRef.current = true;
              toolbarDragStartXRef.current = e.clientX;
              toolbarDragStartToolbarXRef.current = toolbarX;
            }}
          >
            <button
              className={`iconBtn ${active === 'select' ? 'active' : ''}`}
              onClick={() => {
                setAlignMode(false);
                setCropMode(false);
                editorRef.current?.setTransformMode('none');
                setTool('select');
                setOpenMenu(null);
                setHintTool(null);
              }}
              title="选择"
              aria-label="选择"
            >
              ▢
            </button>

            <span className="captureSep" aria-hidden="true" />

            <div
              style={TOOLBAR_CLUSTER}
              title="马赛克：笔刷/框选、自动检测、选区应用"
            >
            <details className="menu" open={openMenu === 'mosaic'}>
              <summary
                className={menuToolIconClass(openMenu, 'mosaic', active === 'mosaic')}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenuToolOnSummaryClick('mosaic', openMenu, active === 'mosaic', {
                    setOpenMenu,
                    setHintTool,
                    beforeActivate: () => {
                      setCropMode(false);
                      editorRef.current?.setTransformMode('none');
                    },
                    onActivate: () => {
                      if (active !== 'mosaic') setTool('mosaic');
                    },
                    onDeactivate: () => setTool('select')
                  });
                }}
                title={menuToolSummaryTitle('马赛克', openMenu, 'mosaic', active === 'mosaic')}
                aria-label="马赛克"
              >
                ▦
              </summary>
              <div
                className="menuPanel"
                onMouseDown={(e) => {
                  const tag = (e.target as HTMLElement).tagName;
                  if (tag === 'SELECT' || tag === 'OPTION' || tag === 'INPUT' || tag === 'TEXTAREA') return;
                  e.preventDefault();
                }}
              >
                <div className="menuSection">
                  <div className="menuTitle">形状</div>
                  <div className="menuRow">
                    <button className={mosaicMode === 'rect' ? 'active' : ''} onClick={() => applyMosaic({ mode: 'rect' })}>
                      框选
                    </button>
                    <button className={mosaicMode === 'brush' ? 'active' : ''} onClick={() => applyMosaic({ mode: 'brush' })}>
                      笔刷
                    </button>
                    <button
                      type="button"
                      onClick={onAutoDetectMosaic}
                      disabled={!image || autoDetectLoading || ocrRegionPickMode}
                      title="自动检测全图文字区域"
                      aria-label="自动检测全图"
                    >
                      全图检测
                    </button>
                    <button
                      type="button"
                      className={ocrRegionPickMode ? 'active' : ''}
                      onClick={onAutoDetectMosaicInRegion}
                      disabled={!image || autoDetectLoading}
                      title="在图上框选区域后检测文字"
                      aria-label="框选检测"
                    >
                      框选检测
                    </button>
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">效果</div>
                  <div className="menuRow">
                    <button className={mosaicStyle === 'pixel' ? 'active' : ''} onClick={() => applyMosaic({ style: 'pixel' })}>
                      像素
                    </button>
                    <button className={mosaicStyle === 'blur' ? 'active' : ''} onClick={() => applyMosaic({ style: 'blur' })}>
                      模糊
                    </button>
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">打码程度</div>
                  <div className="menuRow">
                    {MOSAIC_LEVELS.map((l) => (
                      <button key={l.name} className={mosaicLevel === l.name ? 'active' : ''} onClick={() => applyMosaic({ level: l.name })}>
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">同行 / 同列</div>
                  <div className="menuRow" style={{ gap: 8 }}>
                    <button
                      type="button"
                      style={{ flex: 1, fontSize: 13 }}
                      disabled={!image}
                      onClick={() => {
                        const r = editorRef.current?.selectMosaicsSameRow();
                        if (!r?.ok) setTemplateToast('请先选中一块马赛克');
                        else {
                          setTool('select');
                          setTemplateToast(`已选同行 ${r.count} 块，拖动任一块可整体移动`);
                        }
                      }}
                      title="选同一行：水平中线穿过当前马赛克中心线的所有马赛克"
                    >
                      同行
                    </button>
                    <button
                      type="button"
                      style={{ flex: 1, fontSize: 13 }}
                      disabled={!image}
                      onClick={() => {
                        const r = editorRef.current?.selectMosaicsSameColumn();
                        if (!r?.ok) setTemplateToast('请先选中一块马赛克');
                        else {
                          setTool('select');
                          setTemplateToast(`已选同列 ${r.count} 块，拖动任一块可整体移动`);
                        }
                      }}
                      title="选同一列：垂直中线穿过当前马赛克中心线的所有马赛克"
                    >
                      同列
                    </button>
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">参数</div>
                  <div className="paramStack">
                    <div className="paramLabel">
                      <span>像素块</span>
                      <span>{mosaicPixelSize}</span>
                    </div>
                    <input
                      type="range"
                      className="paramSlider"
                      min={MOSAIC_PIXEL_MIN}
                      max={MOSAIC_PIXEL_MAX}
                      step={1}
                      value={mosaicPixelSize}
                      onChange={(e) => applyMosaic({ pixelSize: Math.round(Number(e.target.value)) })}
                      aria-label="像素块大小滑动"
                    />
                    <input
                      value={mosaicPixelSizeDraft}
                      inputMode="numeric"
                      type="number"
                      min={MOSAIC_PIXEL_MIN}
                      max={MOSAIC_PIXEL_MAX}
                      step={1}
                      onChange={(e) => setMosaicPixelSizeDraft(e.target.value)}
                      onBlur={() => {
                        const v = Number(mosaicPixelSizeDraft);
                        if (!Number.isFinite(v) || v <= 0) {
                          setMosaicPixelSizeDraft(String(mosaicPixelSize));
                          return;
                        }
                        applyMosaic({ pixelSize: v });
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        (e.target as HTMLInputElement).blur();
                      }}
                      style={{ width: '100%', maxWidth: 120 }}
                      title="自定义像素块大小（回车或失焦应用）"
                      aria-label="自定义像素块大小"
                    />
                  </div>
                  {mosaicStyle === 'blur' ? (
                    <div className="paramStack" style={{ marginTop: 10 }}>
                      <div className="paramLabel">
                        <span>模糊半径</span>
                        <span>{mosaicBlurRadius}</span>
                      </div>
                      <input
                        type="range"
                        className="paramSlider"
                        min={MOSAIC_BLUR_MIN}
                        max={MOSAIC_BLUR_MAX}
                        step={1}
                        value={mosaicBlurRadius}
                        onChange={(e) => applyMosaic({ blurRadius: Math.round(Number(e.target.value)) })}
                        aria-label="模糊半径滑动"
                      />
                      <input
                        value={mosaicBlurRadiusDraft}
                        inputMode="numeric"
                        type="number"
                        min={MOSAIC_BLUR_MIN}
                        max={MOSAIC_BLUR_MAX}
                        step={1}
                        onChange={(e) => setMosaicBlurRadiusDraft(e.target.value)}
                        onBlur={() => {
                          const v = Number(mosaicBlurRadiusDraft);
                          if (!Number.isFinite(v) || v < 0) {
                            setMosaicBlurRadiusDraft(String(mosaicBlurRadius));
                            return;
                          }
                          applyMosaic({ blurRadius: v });
                        }}
                        onKeyDown={(e) => {
                          if (e.key !== 'Enter') return;
                          (e.target as HTMLInputElement).blur();
                        }}
                        style={{ width: '100%', maxWidth: 120 }}
                        title="自定义模糊半径（回车或失焦应用）"
                        aria-label="自定义模糊半径"
                      />
                    </div>
                  ) : null}
                </div>
                {mosaicMode === 'brush' ? (
                  <div className="menuSection">
                    <div className="menuTitle">笔刷粗细</div>
                    <div className="paramStack" style={{ marginBottom: 8 }}>
                      <div className="paramLabel">
                        <span>拖动调节</span>
                        <span>{mosaicBrushSize}px</span>
                      </div>
                      <input
                        type="range"
                        className="paramSlider"
                        min={6}
                        max={48}
                        step={1}
                        value={mosaicBrushSize}
                        onChange={(e) => applyMosaic({ brushSize: Math.round(Number(e.target.value)) })}
                        aria-label="笔刷粗细滑动"
                      />
                    </div>
                    <div className="menuRow brushSizeRow">
                      {MOSAIC_BRUSH_SIZES.map(({ value }) => (
                        <button
                          key={value}
                          type="button"
                          className={`brushSizeBtn ${mosaicBrushSize === value ? 'active' : ''}`}
                          onClick={() => applyMosaic({ brushSize: value })}
                          title={`粗细 ${value}`}
                          aria-label={`笔刷粗细 ${value}`}
                          style={{
                            width: value + 12,
                            height: value + 12,
                            borderRadius: '50%',
                            padding: 0
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </details>

            {hasDetectedRegions ? (
              <>
                <ToolbarVSep />
                <button
                  className="iconBtn"
                  type="button"
                  onClick={() => editorRef.current?.setAllDetectedRegionsSelected(true)}
                  title="全选建议区域"
                  aria-label="全选建议区域"
                >
                  全选
                </button>
                <button
                  className="iconBtn"
                  type="button"
                  onClick={() => editorRef.current?.setAllDetectedRegionsSelected(false)}
                  title="全不选建议区域"
                  aria-label="全不选建议区域"
                >
                  清
                </button>
                <button
                  className="iconBtn"
                  type="button"
                  onClick={onApplyDetectedMosaic}
                  title="应用自动打码"
                  aria-label="应用自动打码"
                >
                  ✓
                </button>
                <button
                  className="iconBtn"
                  type="button"
                  onClick={onCancelDetectedMosaic}
                  title="取消自动打码"
                  aria-label="取消自动打码"
                >
                  ✕
                </button>
              </>
            ) : null}
            </div>

            <span className="captureSep" aria-hidden="true" />

            <div style={TOOLBAR_CLUSTER} title="底图对齐与裁剪">
            <button
              className={`iconBtn ${alignMode ? 'active' : ''}`}
              type="button"
              onClick={() => {
                const next = !alignMode;
                setAlignMode(next);
                setCropMode(false);
                editorRef.current?.setTransformMode('none');
                // Align mode should not draw; use select tool.
                setTool('select');
                setOpenMenu(null);
                setHintTool(null);
              }}
              disabled={!image}
              title="对齐底图（开启后可拖动底层图片与模板对齐；点画布空白结束）"
              aria-label="对齐底图"
            >
              ⊕
            </button>

            <button
              className="iconBtn"
              type="button"
              onClick={() => editorRef.current?.resetBackgroundOffset()}
              disabled={!image}
              title="重置底图位置"
              aria-label="重置底图位置"
            >
              ⟲
            </button>

            </div>

            <span className="captureSep" aria-hidden="true" />

            <details className="menu" open={openMenu === 'crop'}>
              <summary
                className={menuToolIconClass(openMenu, 'crop', cropMode)}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenuToolOnSummaryClick('crop', openMenu, cropMode, {
                    setOpenMenu,
                    setHintTool,
                    beforeActivate: () => {
                      setAlignMode(false);
                    },
                    onActivate: () => {
                      setCropMode(true);
                      editorRef.current?.setCropOptions({ shape: cropShape });
                      editorRef.current?.setTransformMode('crop');
                      setTool('select');
                    },
                    onDeactivate: () => {
                      setCropMode(false);
                      editorRef.current?.setTransformMode('none');
                      setTool('select');
                    }
                  });
                }}
                title={menuToolSummaryTitle(
                  '裁剪',
                  openMenu,
                  'crop',
                  cropMode,
                  '裁剪（在画布拖动绘制选区，选区外点击完成）'
                )}
                aria-label="裁剪"
              >
                ✂
              </summary>
              <div
                className="menuPanel"
                onMouseDown={(e) => {
                  const tag = (e.target as HTMLElement).tagName;
                  if (tag === 'SELECT' || tag === 'OPTION' || tag === 'INPUT' || tag === 'TEXTAREA') return;
                  e.preventDefault();
                }}
              >
                <div className="menuSection">
                  <div className="menuTitle">裁剪形状</div>
                  <div className="menuRow">
                    {CROP_SHAPES.map(({ id, icon, title, ariaLabel }) => (
                      <button
                        key={id}
                        type="button"
                        className={`iconBtn ${cropShape === id ? 'active' : ''}`}
                        disabled={!image}
                        title={title}
                        aria-label={ariaLabel}
                        onClick={() => {
                          setCropShape(id);
                          editorRef.current?.setCropOptions({ shape: id });
                          if (!cropMode) {
                            setAlignMode(false);
                            setCropMode(true);
                            setTool('select');
                            editorRef.current?.setTransformMode('crop');
                          }
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="menuSection" style={{ opacity: 0.8, fontSize: 12, lineHeight: 1.45 }}>
                  在画布按住拖动绘制选区；圆形拖出为正圆；手绘沿路径勾勒；选区外点击完成裁剪。
                </div>
              </div>
            </details>

            <span className="captureSep" aria-hidden="true" />

            <details className="menu" open={openMenu === 'template'}>
              <summary
                className={menuToolIconClass(openMenu, 'template', hintTool === 'template')}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenuToolOnSummaryClick('template', openMenu, hintTool === 'template', {
                    setOpenMenu,
                    setHintTool,
                    beforeActivate: () => {
                      setCropMode(false);
                      editorRef.current?.setTransformMode('none');
                    },
                    onActivate: () => {},
                    onDeactivate: () => {}
                  });
                }}
                title={menuToolSummaryTitle(
                  '模板',
                  openMenu,
                  'template',
                  hintTool === 'template',
                  '模板（套用/保存标注位置、导出标注层）'
                )}
                aria-label="模板"
              >
                💾
              </summary>
              <div
                className="menuPanel"
                onMouseDown={(e) => {
                  const el = e.target as HTMLElement;
                  if (el.closest('select, input, textarea, [data-menu-form]')) return;
                  e.preventDefault();
                }}
              >
                <div
                  className="menuSection"
                  data-menu-form
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="menuTitle">已保存模板</div>
                  {savedTemplateKeys.length === 0 ? (
                    <div style={{ fontSize: 12, opacity: 0.72, lineHeight: 1.45 }}>暂无已保存模板，可在下方新建</div>
                  ) : (
                    <div className="menuRow">
                      {savedTemplateKeys.map((name) => (
                        <button
                          key={name}
                          type="button"
                          className={selectedSavedTemplateKey === name ? 'active' : ''}
                          onClick={() => {
                            setSelectedSavedTemplateKey(name);
                            setRenameTemplateDraft(name);
                          }}
                          title={name}
                          aria-label={`模板 ${name}`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="menuTitle" style={{ marginTop: 8 }}>
                    新建
                  </div>
                  <div className="menuRow" style={{ alignItems: 'stretch', gap: 6 }}>
                    <input
                      value={newTemplateDraft}
                      onChange={(e) => setNewTemplateDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyNewTemplateName();
                        }
                      }}
                      placeholder="新模板名称"
                      style={{ ...SETTINGS_FIELD, flex: 1, minWidth: 0 }}
                      aria-label="新模板名称"
                    />
                    <button
                      type="button"
                      className="iconBtn"
                      onClick={applyNewTemplateName}
                      title="新建模板（立即加入列表并保存当前标注）"
                      aria-label="新建模板"
                    >
                      ➕
                    </button>
                  </div>
                  {showRenameTemplate ? (
                    <>
                      <div className="menuTitle" style={{ marginTop: 8 }}>
                        重命名
                      </div>
                      <div className="menuRow" style={{ alignItems: 'stretch', gap: 6 }}>
                        <input
                          value={renameTemplateDraft}
                          onChange={(e) => setRenameTemplateDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              applyRenameTemplate();
                            }
                          }}
                          placeholder={selectedSavedTemplateKey ? `当前：${selectedSavedTemplateKey}` : '重命名后的名称'}
                          style={{ ...SETTINGS_FIELD, flex: 1, minWidth: 0 }}
                          aria-label="重命名模板"
                        />
                        <button
                          type="button"
                          className="iconBtn"
                          disabled={!renameTemplateDraft.trim()}
                          onClick={applyRenameTemplate}
                          title="重命名已选模板"
                          aria-label="重命名模板"
                        >
                          ✎
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="menuSection">
                  <div className="menuRow">
                    <button
                      type="button"
                      className="iconBtn"
                      disabled={!image || !templateKeyForApply()}
                      onClick={() => {
                        const key = templateKeyForApply();
                        if (!key) return;
                        editorRef.current?.applyTemplateByKey(key);
                      }}
                      title="套用模板（在现有标注基础上叠加；可在设置中改为覆盖）"
                      aria-label="套用模板"
                    >
                      ⇩
                    </button>
                    <button
                      type="button"
                      className="iconBtn"
                      disabled={!selectedSavedTemplateKey || !hasSavedAnnotationTemplate(selectedSavedTemplateKey)}
                      onClick={() => setTemplatePreviewOpen(true)}
                      title="查看所选模板标注位置预览"
                      aria-label="查看模板"
                    >
                      👁
                    </button>
                    <button
                      type="button"
                      className="iconBtn"
                      disabled={!image || !templateKeyNormalized}
                      onClick={() => editorRef.current?.saveTemplate()}
                      title="保存模板（把当前打码/箭头/文字位置保存，下次可直接套用）"
                      aria-label="保存模板"
                    >
                      💾
                    </button>
                    <button
                      type="button"
                      className="iconBtn danger"
                      disabled={!image || !templateKeyNormalized}
                      onClick={() => editorRef.current?.clearTemplate()}
                      title="清除模板（删除该模板名对应的已保存位置）"
                      aria-label="清除模板"
                    >
                      🗑
                    </button>
                    <button
                      type="button"
                      className="iconBtn"
                      disabled={!image}
                      onClick={() => void onExportAnnotationsLayerImage()}
                      title="将当前打码/箭头/文字单独导出为 PNG（无底图，空白处透明）"
                      aria-label="导出模版图层为图片"
                    >
                      🖼
                    </button>
                  </div>
                </div>
              </div>
            </details>

            <span className="captureSep" aria-hidden="true" />

            <details className="menu" open={openMenu === 'arrow'}>
              <summary
                className={menuToolIconClass(openMenu, 'arrow', active === 'arrow')}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenuToolOnSummaryClick('arrow', openMenu, active === 'arrow', {
                    setOpenMenu,
                    setHintTool,
                    beforeActivate: () => {
                      setCropMode(false);
                      editorRef.current?.setTransformMode('none');
                    },
                    onActivate: () => {
                      if (active !== 'arrow') setTool('arrow');
                    },
                    onDeactivate: () => setTool('select')
                  });
                }}
                title={menuToolSummaryTitle('箭头', openMenu, 'arrow', active === 'arrow')}
                aria-label="箭头"
              >
                ↗
              </summary>
              <div
                className="menuPanel"
                onMouseDown={(e) => {
                  const tag = (e.target as HTMLElement).tagName;
                  if (tag === 'SELECT' || tag === 'OPTION' || tag === 'INPUT' || tag === 'TEXTAREA') return;
                  e.preventDefault();
                }}
              >
                <div className="menuSection">
                  <div className="menuTitle">颜色</div>
                  <div className="menuRow" style={{ gap: 6 }}>
                    {ARROW_COLORS.map((c) => (
                      <button
                        key={c.value}
                        className={arrowColor === c.value ? 'active' : ''}
                        onClick={() => applyArrow({ color: c.value })}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: c.value,
                          border: arrowColor === c.value ? '2px solid #4c9ffe' : '1px solid rgba(255,255,255,0.2)'
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">形态</div>
                  <div className="menuRow">
                    <button className={arrowKind === 'straight' ? 'active' : ''} onClick={() => applyArrow({ kind: 'straight' })}>
                      →
                    </button>
                    <button className={arrowKind === 'elbow' ? 'active' : ''} onClick={() => applyArrow({ kind: 'elbow' })}>
                      ⤷
                    </button>
                    <button className={arrowKind === 'curve' ? 'active' : ''} onClick={() => applyArrow({ kind: 'curve' })}>
                      ↷
                    </button>
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">粗细</div>
                  <div className="paramStack" style={{ marginBottom: 8 }}>
                    <div className="paramLabel">
                      <span>拖动调节</span>
                      <span>{arrowStrokeWidth}px</span>
                    </div>
                    <input
                      type="range"
                      className="paramSlider"
                      min={1}
                      max={60}
                      step={1}
                      value={arrowStrokeWidth}
                      onChange={(e) => applyArrow({ strokeWidth: Math.round(Number(e.target.value)) })}
                      aria-label="箭头线宽滑动"
                    />
                  </div>
                  <div className="menuRow" style={{ gap: 8, alignItems: 'center' }}>
                    {[{ name: '细', w: 4 }, { name: '中', w: 6 }, { name: '粗', w: 10 }].map(({ name, w }) => (
                      <button key={w} className={arrowStrokeWidth === w ? 'active' : ''} onClick={() => applyArrow({ strokeWidth: w })}>
                        {name}
                      </button>
                    ))}
                    <input
                      value={arrowStrokeWidthDraft}
                      inputMode="numeric"
                      type="number"
                      min={1}
                      max={60}
                      step={1}
                      onChange={(e) => setArrowStrokeWidthDraft(e.target.value)}
                      onBlur={() => {
                        const v = Number(arrowStrokeWidthDraft);
                        if (!Number.isFinite(v) || v <= 0) {
                          setArrowStrokeWidthDraft(String(arrowStrokeWidth));
                          return;
                        }
                        applyArrow({ strokeWidth: Math.round(v) });
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        (e.target as HTMLInputElement).blur();
                      }}
                      style={{ width: 86 }}
                      title="自定义箭头粗细（回车或失焦应用）"
                      aria-label="自定义箭头粗细"
                    />
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">箭头大小</div>
                  <div className="paramStack" style={{ marginBottom: 8 }}>
                    <div className="paramLabel">
                      <span>拖动调节</span>
                      <span>{arrowPointerSize}px</span>
                    </div>
                    <input
                      type="range"
                      className="paramSlider"
                      min={6}
                      max={120}
                      step={1}
                      value={arrowPointerSize}
                      onChange={(e) => applyArrow({ pointerSize: Math.round(Number(e.target.value)) })}
                      aria-label="箭头尖端大小滑动"
                    />
                  </div>
                  <div className="menuRow" style={{ gap: 8, alignItems: 'center' }}>
                    {[{ name: '小', s: 12 }, { name: '中', s: 16 }, { name: '大', s: 20 }].map(({ name, s }) => (
                      <button key={s} className={arrowPointerSize === s ? 'active' : ''} onClick={() => applyArrow({ pointerSize: s })}>
                        {name}
                      </button>
                    ))}
                    <input
                      value={arrowPointerSizeDraft}
                      inputMode="numeric"
                      type="number"
                      min={6}
                      max={120}
                      step={1}
                      onChange={(e) => setArrowPointerSizeDraft(e.target.value)}
                      onBlur={() => {
                        const v = Number(arrowPointerSizeDraft);
                        if (!Number.isFinite(v) || v <= 0) {
                          setArrowPointerSizeDraft(String(arrowPointerSize));
                          return;
                        }
                        applyArrow({ pointerSize: Math.round(v) });
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        (e.target as HTMLInputElement).blur();
                      }}
                      style={{ width: 86 }}
                      title="自定义箭头大小（回车或失焦应用）"
                      aria-label="自定义箭头大小"
                    />
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">不透明度</div>
                  <div className="paramStack">
                    <div className="paramLabel">
                      <span>拖动调节</span>
                      <span>{Math.round(arrowOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      className="paramSlider"
                      min={0}
                      max={100}
                      step={1}
                      value={Math.round(arrowOpacity * 100)}
                      onChange={(e) => applyArrow({ opacity: Math.round(Number(e.target.value)) / 100 })}
                      aria-label="箭头不透明度滑动"
                    />
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">效果</div>
                  <div className="menuRow">
                    <button
                      type="button"
                      className={arrowShadow ? 'active' : ''}
                      onClick={() => applyArrow({ shadow: !arrowShadow })}
                      title="阴影"
                      aria-label="阴影"
                      aria-pressed={arrowShadow}
                    >
                      阴影
                    </button>
                  </div>
                </div>
              </div>
            </details>

            <details className="menu" open={openMenu === 'text'}>
              <summary
                className={menuToolIconClass(openMenu, 'text', active === 'text')}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenuToolOnSummaryClick('text', openMenu, active === 'text', {
                    setOpenMenu,
                    setHintTool,
                    beforeActivate: () => {
                      setCropMode(false);
                      editorRef.current?.setTransformMode('none');
                    },
                    onActivate: () => {
                      if (active !== 'text') setTool('text');
                    },
                    onDeactivate: () => setTool('select')
                  });
                }}
                title={menuToolSummaryTitle('文字', openMenu, 'text', active === 'text')}
                aria-label="文字"
              >
                T
              </summary>
              <div
                className="menuPanel"
                onMouseDown={(e) => {
                  const tag = (e.target as HTMLElement).tagName;
                  // 允许在下拉框等表单控件内正常点击/展开
                  if (tag === 'SELECT' || tag === 'OPTION' || tag === 'INPUT' || tag === 'TEXTAREA') return;
                  e.preventDefault();
                }}
              >
                {(() => {
                  const textUi = getTextToolbarStyle();
                  return (
                    <TextStyleControls
                      ui={textUi}
                      onApply={(patch: TextStylePatch) => applyText(patch)}
                      colorSection={
                        <div className="menuSection">
                          <div className="menuTitle">颜色</div>
                          <div className="menuRow" style={{ gap: 6 }}>
                            {TEXT_COLORS.map((c) => (
                              <button
                                key={c.value}
                                className={textUi.fill === c.value ? 'active' : ''}
                                onClick={() => applyText({ color: c.value })}
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 4,
                                  backgroundColor: c.value,
                                  border: textUi.fill === c.value ? '2px solid #4c9ffe' : '1px solid rgba(255,255,255,0.2)'
                                }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>
                      }
                      sizeSection={
                        <div className="menuSection">
                          <div className="menuTitle">字号</div>
                          <div className="paramStack" style={{ marginBottom: 8 }}>
                            <div className="paramLabel">
                              <span>拖动调节</span>
                              <span>{textUi.fontSize}px</span>
                            </div>
                            <input
                              type="range"
                              className="paramSlider"
                              min={8}
                              max={200}
                              step={1}
                              value={textUi.fontSize}
                              onChange={(e) => applyText({ size: Math.round(Number(e.target.value)) })}
                              aria-label="字号滑动"
                            />
                          </div>
                          <div className="menuRow" style={{ gap: 8, alignItems: 'center' }}>
                            <select
                              className="selectWithArrow"
                              value={COMMON_TEXT_SIZES.includes(textUi.fontSize as any) ? String(textUi.fontSize) : ''}
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                if (!Number.isFinite(v) || v <= 0) return;
                                applyText({ size: v });
                              }}
                              title="常用字号"
                              aria-label="常用字号"
                            >
                              <option value="">常用</option>
                              {COMMON_TEXT_SIZES.map((s) => (
                                <option key={s} value={String(s)}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <input
                              value={textSizeDraft}
                              inputMode="numeric"
                              type="number"
                              min={8}
                              max={200}
                              step={1}
                              onChange={(e) => setTextSizeDraft(e.target.value)}
                              onBlur={() => {
                                const v = Number(textSizeDraft);
                                if (!Number.isFinite(v) || v <= 0) {
                                  setTextSizeDraft(String(textUi.fontSize));
                                  return;
                                }
                                applyText({ size: Math.round(v) });
                              }}
                              onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                (e.target as HTMLInputElement).blur();
                              }}
                              style={{ width: 86 }}
                              title="自定义字号（回车或失焦应用）"
                              aria-label="自定义字号"
                            />
                          </div>
                        </div>
                      }
                    />
                  );
                })()}
              </div>
            </details>

            <span className="captureSep" aria-hidden="true" />

            <button className="iconBtn" onClick={() => editorRef.current?.undo()} disabled={!image} title="撤销" aria-label="撤销">
              ↶
            </button>
            <button className="iconBtn" onClick={() => editorRef.current?.redo()} disabled={!image} title="重做" aria-label="重做">
              ↷
            </button>

            <span className="captureSep" aria-hidden="true" />

            <button
              className="iconBtn ok"
              onClick={() => void onToolbarFinish()}
              disabled={!image}
              title="完成编辑并返回工作区（合并图层）"
              aria-label="完成编辑"
            >
              ✓
            </button>
          </div>
        </div>
      ) : null}

      <div className="content">
        {!isAuthed ? (
          <div className="empty">
            <div className="emptyCard">
              <div className="emptyTitle">请先登录</div>
              <div className="emptySubtitle">登录成功后才能截图、选择图片并开始标注。</div>
              <div className="emptyActions">
                <button className="secondary" onClick={onLogin}>
                  去登录
                </button>
              </div>
            </div>
          </div>
        ) : !image ? (
          <div className="empty">
            <div className="emptyCard">
              <div className="emptyTitle">ScreenShot 截图工具</div>
              <div className="emptySubtitle">
                按 {capturePrefs.hotkeyRegionCapture} 或 {DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT} 截图，或选择一张图片开始标注。
              </div>
              <div className="emptyActions">
                <button className="secondary" onClick={onPickImage}>
                  选择图片编辑
                </button>
                <button className="secondary" onClick={() => setSettingsOpen(true)}>
                  设置
                </button>
                <button className="secondary" onClick={session ? onLogout : onLogin}>
                  {session ? `退出登录（${session.user.displayName}）` : '登录'}
                </button>
              </div>
              <div className="emptyHint">
                提示：{DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT} = 桌面 js-web-screen-shot（全局）；{capturePrefs.hotkeyRegionCapture} = Electron 原生截图（可改）。网页/扩展区域截图为 Alt+Shift+A，与桌面 Alt+A 已区分。
              </div>
            </div>
          </div>
        ) : viewMode === 'workspace' ? (
          <div className="workspaceLayout">
            <div className="workspaceTop">
              <WorkspaceToolbar
                disabled={!isAuthed}
                zoom={workspaceZoom}
                settingsOpen={settingsOpen}
                onOpen={() => void onPickImage()}
                onSaveAs={() => void onSaveAs()}
                onZoomIn={onWorkspaceZoomIn}
                onZoomOut={onWorkspaceZoomOut}
                onZoomSelect={onWorkspaceZoomSelect}
                onZoomFit={onWorkspaceZoomFit}
                onEdit={() => void enterEditingMode()}
                onResize={() => void refreshWorkspacePreview().then(() => setResizeOpen(true))}
                onUndo={onWorkspaceUndo}
                onRedo={onWorkspaceRedo}
                canUndo={workspaceCanUndo}
                canRedo={workspaceCanRedo}
                onCopy={() => void onWorkspaceCopy()}
                onPaste={() => void onWorkspacePaste()}
                onSettings={() => setSettingsOpen(true)}
                onClose={onCloseImage}
                onSave={() => void onWorkspaceSave()}
              />
              {queue.length > 1 && capturePrefs.multiImageNavMode === 'tabs' ? (
                <WorkspaceTabStrip
                  items={queue}
                  activeIndex={activeIndex}
                  onSelect={switchTo}
                  onClose={closeTabAtIndex}
                  onAdd={() => void onImportMoreImages()}
                />
              ) : null}
            </div>
            <div className="workspaceStage" ref={workspaceStageRef}>
              <WorkspaceViewer
                dataUrl={pasteAdjust ? pasteAdjust.baseDataUrl : workspacePreview}
                zoom={workspaceZoom}
                pasteLayerAdjust={
                  pasteAdjust
                    ? {
                        pasteDataUrl: pasteAdjust.dataUrl,
                        canvasWidth: pasteAdjust.canvasWidth,
                        canvasHeight: pasteAdjust.canvasHeight,
                        onConfirm: (result) => void confirmPasteLayer(result),
                        onCancel: () => setPasteAdjust(null)
                      }
                    : null
                }
              />
              {queue.length > 1 && capturePrefs.multiImageNavMode === 'arrows' ? (
                <WorkspaceArrowNav
                  activeIndex={activeIndex}
                  total={queue.length}
                  name={activeItem?.name ?? ''}
                  onPrev={() => switchTo(activeIndex - 1)}
                  onNext={() => switchTo(activeIndex + 1)}
                  onAdd={() => void onImportMoreImages()}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div
            className="editorHost"
            ref={(el) => {
              hostRef.current = el;
              setHostReady(!!el);
            }}
          >
            {canRenderEditor ? (
                <EditorWidget
                  key={activeItem?.id ?? 'editor'}
                  ref={(n: EditorWidgetHandle | null) => (editorRef.current = n)}
                  container={hostRef.current!}
                  image={image}
                  options={{
                    initialTool: getTool('select'),
                    initialAnnotations: activeItem?.annotations ?? null,
                    onTextCreated: handleTextCreated,
                    template: {
                      key: templateKeyNormalized || 'hospital_record_v1',
                      autoApply: false,
                      autoSave: false,
                      applyMode: capturePrefs.templateApplyMode
                    },
                    onTemplateEvent: (ev: any) => {
                      if (ev.type === 'save') {
                        refreshSavedTemplateKeys();
                        setTemplateToast(`模板已保存（${ev.nodeCount} 个标注）`);
                      } else if (ev.type === 'apply') setTemplateToast(`模板已套用（${ev.nodeCount} 个标注）`);
                      else if (ev.type === 'not_found') setTemplateToast('未找到模板：请先保存模板');
                      else if (ev.type === 'cleared') {
                        refreshSavedTemplateKeys();
                        setSelectedSavedTemplateKey(null);
                        setTemplateToast('模板已清除');
                      } else if (ev.type === 'invalid_key') setTemplateToast('模板名无效');
                      else if (ev.type === 'error') setTemplateToast(`模板操作失败：${ev.message}`);
                    },
                    onCropApplied: ({ width, height }) => {
                      setCropMode(false);
                      setPreviewSize({ width, height });
                      editorRef.current?.setTransformMode('none');
                    },
                    onAnnotationEditRequest: ({ kind }) => {
                      setOpenMenu(kind);
                      setHintTool(null);
                      setActive('select');
                      editorRef.current?.setTool(baseTools.select);
                    },
                    onOcrRegionPicked,
                    onOcrRegionPickCancelled,
                    onSelectionChange: (sel: Selection) => {
                      if (!sel) {
                        setSelectedTextId(null);
                        setSelectedTextStyle(null);
                        setSelectedArrowId(null);
                        if (ocrRegionPickModeRef.current) return;
                        if (activeRef.current === 'arrow') {
                          editorRef.current?.setTool(getTool('arrow'));
                        } else if (activeRef.current === 'text') {
                          editorRef.current?.setTool(getTool('text'));
                        }
                        return;
                      }
                      if (sel.kind === 'text') {
                        setSelectedArrowId(null);
                        setSelectedTextId(sel.id);
                        setSelectedTextStyle({
                          fill: sel.style.fill,
                          fontSize: sel.style.fontSize,
                          fontFamily: sel.style.fontFamily ?? textFont,
                          fontWeight: isTextBold(sel.style.fontWeight) ? 'bold' : 'normal',
                          fontItalic: !!sel.style.fontItalic,
                          underline: !!sel.style.underline,
                          align: (sel.style.align as any) ?? 'left'
                        });
                        return;
                      }
                      if (sel.kind === 'arrow') {
                        setSelectedTextId(null);
                        setSelectedArrowId(sel.id);
                        setArrowKind((sel.style.arrowKind as any) ?? 'straight');
                        setArrowColor(sel.style.stroke);
                        setArrowStrokeWidth(sel.style.strokeWidth);
                        setArrowPointerSize(sel.style.pointerSize);
                        setArrowOpacity(sel.style.opacity ?? 1);
                        setArrowShadow(!!sel.style.shadow);
                        return;
                      }
                    }
                  }}
                />
              ) : null}
            </div>
        )}
      </div>
      {copyOk ? (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(16,18,25,0.9)',
            border: '1px solid rgba(255,255,255,0.18)',
            fontSize: 12
          }}
        >
          复制成功
        </div>
      ) : null}
      {templateToast ? (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 88,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(16,18,25,0.9)',
            border: '1px solid rgba(255,255,255,0.18)',
            fontSize: 12
          }}
        >
          {templateToast}
        </div>
      ) : null}
      {pasteHint ? (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 52,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(16,18,25,0.9)',
            border: '1px solid rgba(255,255,255,0.18)',
            fontSize: 12
          }}
        >
          已复制到剪贴板，在目标页面 Ctrl+V 即可粘贴。
        </div>
      ) : null}
      <ResizeImageDialog
        open={resizeOpen}
        originalWidth={previewSize.width || 1}
        originalHeight={previewSize.height || 1}
        onConfirm={(result) => void onResizeConfirm(result)}
        onCancel={() => setResizeOpen(false)}
      />
      <TemplatePreviewDialog
        open={templatePreviewOpen}
        templateName={selectedSavedTemplateKey ?? ''}
        onClose={() => setTemplatePreviewOpen(false)}
      />
      <EditorSettingsDialog
        open={settingsOpen}
        initialCapturePrefs={capturePrefs}
        onClose={() => setSettingsOpen(false)}
        onApplied={(saved) => {
          skipPrefsReloadOnCloseRef.current = true;
          const p = applyCapturePrefs(saved);
          setDefaultTemplatePrefs({
            pattern: p.defaultTemplateNamePattern ?? 'hospital_record_v1',
            nextNumber: p.defaultTemplateNextNumber ?? 1
          });
          const autoHint = p.autoSaveImages
            ? `自动保存已开启${p.defaultSaveDir ? '' : '（请设置默认保存文件夹）'}`
            : '设置已保存';
          setTemplateToast(autoHint);
        }}
        desktopApi={desktopApi as EditorSettingsDialogProps['desktopApi']}
        format={format}
        exportQuality={exportQuality}
        authBaseUrl={authBaseUrl}
        onAuthBaseUrlChange={(v) => {
          setAuthBaseUrl(v);
          try {
            window.localStorage.setItem('screenshot.authBaseUrl', v);
          } catch {
            // ignore
          }
        }}
        onCommit={async ({ format: nextFormat, exportQuality: nextQuality }) => {
          setFormat(nextFormat);
          setExportQuality(nextQuality);
        }}
        editorPanel={
          <>
<div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 8 }}>马赛克默认</div>
                <div className="menuSection" style={{ marginTop: 0 }}>
                  <div className="menuTitle">形状</div>
                  <div className="menuRow">
                    <button type="button" className={mosaicMode === 'rect' ? 'active' : ''} onClick={() => applyMosaic({ mode: 'rect' }, { defaultsOnly: true })}>
                      框选
                    </button>
                    <button type="button" className={mosaicMode === 'brush' ? 'active' : ''} onClick={() => applyMosaic({ mode: 'brush' }, { defaultsOnly: true })}>
                      笔刷
                    </button>
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">效果</div>
                  <div className="menuRow">
                    <button type="button" className={mosaicStyle === 'pixel' ? 'active' : ''} onClick={() => applyMosaic({ style: 'pixel' }, { defaultsOnly: true })}>
                      像素
                    </button>
                    <button type="button" className={mosaicStyle === 'blur' ? 'active' : ''} onClick={() => applyMosaic({ style: 'blur' }, { defaultsOnly: true })}>
                      模糊
                    </button>
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">打码程度</div>
                  <div className="menuRow">
                    {MOSAIC_LEVELS.map((l) => (
                      <button
                        key={l.name}
                        type="button"
                        className={mosaicLevel === l.name ? 'active' : ''}
                        onClick={() => applyMosaic({ level: l.name }, { defaultsOnly: true })}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">参数</div>
                  <div className="paramStack">
                    <div className="paramLabel">
                      <span>像素块</span>
                      <span>{mosaicPixelSize}</span>
                    </div>
                    <input
                      type="range"
                      className="paramSlider"
                      min={MOSAIC_PIXEL_MIN}
                      max={MOSAIC_PIXEL_MAX}
                      step={1}
                      value={mosaicPixelSize}
                      onChange={(e) => applyMosaic({ pixelSize: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                      aria-label="像素块滑动"
                    />
                    <input
                      value={mosaicPixelSizeDraft}
                      inputMode="numeric"
                      type="number"
                      min={MOSAIC_PIXEL_MIN}
                      max={MOSAIC_PIXEL_MAX}
                      step={1}
                      onChange={(e) => setMosaicPixelSizeDraft(e.target.value)}
                      onBlur={() => {
                        const v = Number(mosaicPixelSizeDraft);
                        if (!Number.isFinite(v) || v <= 0) {
                          setMosaicPixelSizeDraft(String(mosaicPixelSize));
                          return;
                        }
                        applyMosaic({ pixelSize: v }, { defaultsOnly: true });
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        (e.target as HTMLInputElement).blur();
                      }}
                      style={{ ...SETTINGS_FIELD, width: '100%', maxWidth: 200, height: 32 }}
                    />
                  </div>
                  {mosaicStyle === 'blur' ? (
                    <div className="paramStack" style={{ marginTop: 10 }}>
                      <div className="paramLabel">
                        <span>模糊半径</span>
                        <span>{mosaicBlurRadius}</span>
                      </div>
                      <input
                        type="range"
                        className="paramSlider"
                        min={MOSAIC_BLUR_MIN}
                        max={MOSAIC_BLUR_MAX}
                        step={1}
                        value={mosaicBlurRadius}
                        onChange={(e) => applyMosaic({ blurRadius: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                        aria-label="模糊半径滑动"
                      />
                      <input
                        value={mosaicBlurRadiusDraft}
                        inputMode="numeric"
                        type="number"
                        min={MOSAIC_BLUR_MIN}
                        max={MOSAIC_BLUR_MAX}
                        step={1}
                        onChange={(e) => setMosaicBlurRadiusDraft(e.target.value)}
                        onBlur={() => {
                          const v = Number(mosaicBlurRadiusDraft);
                          if (!Number.isFinite(v) || v < 0) {
                            setMosaicBlurRadiusDraft(String(mosaicBlurRadius));
                            return;
                          }
                          applyMosaic({ blurRadius: v }, { defaultsOnly: true });
                        }}
                        onKeyDown={(e) => {
                          if (e.key !== 'Enter') return;
                          (e.target as HTMLInputElement).blur();
                        }}
                        style={{ ...SETTINGS_FIELD, width: '100%', maxWidth: 200, height: 32 }}
                      />
                    </div>
                  ) : null}
                </div>
                {mosaicMode === 'brush' ? (
                  <div className="menuSection">
                    <div className="menuTitle">笔刷粗细</div>
                    <div className="paramStack" style={{ marginBottom: 8 }}>
                      <div className="paramLabel">
                        <span>拖动调节</span>
                        <span>{mosaicBrushSize}px</span>
                      </div>
                      <input
                        type="range"
                        className="paramSlider"
                        min={6}
                        max={48}
                        step={1}
                        value={mosaicBrushSize}
                        onChange={(e) => applyMosaic({ brushSize: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                        aria-label="笔刷粗细滑动"
                      />
                    </div>
                    <div className="menuRow brushSizeRow">
                      {MOSAIC_BRUSH_SIZES.map(({ value }) => (
                        <button
                          key={value}
                          type="button"
                          className={`brushSizeBtn ${mosaicBrushSize === value ? 'active' : ''}`}
                          onClick={() => applyMosaic({ brushSize: value }, { defaultsOnly: true })}
                          title={`粗细 ${value}`}
                          style={{
                            width: value + 12,
                            height: value + 12,
                            borderRadius: '50%',
                            padding: 0
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 8 }}>箭头默认</div>
                <div className="menuSection" style={{ marginTop: 0 }}>
                  <div className="menuTitle">颜色</div>
                  <div className="menuRow" style={{ gap: 6 }}>
                    {ARROW_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={arrowColor === c.value ? 'active' : ''}
                        onClick={() => applyArrow({ color: c.value }, { defaultsOnly: true })}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: c.value,
                          border: arrowColor === c.value ? '2px solid #4c9ffe' : '1px solid rgba(255,255,255,0.2)'
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">形态</div>
                  <div className="menuRow">
                    <button type="button" className={arrowKind === 'straight' ? 'active' : ''} onClick={() => applyArrow({ kind: 'straight' }, { defaultsOnly: true })}>
                      →
                    </button>
                    <button type="button" className={arrowKind === 'elbow' ? 'active' : ''} onClick={() => applyArrow({ kind: 'elbow' }, { defaultsOnly: true })}>
                      ⤷
                    </button>
                    <button type="button" className={arrowKind === 'curve' ? 'active' : ''} onClick={() => applyArrow({ kind: 'curve' }, { defaultsOnly: true })}>
                      ↷
                    </button>
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">粗细 / 箭头大小</div>
                  <div className="paramStack" style={{ marginBottom: 8 }}>
                    <div className="paramLabel">
                      <span>线宽</span>
                      <span>{arrowStrokeWidth}px</span>
                    </div>
                    <input
                      type="range"
                      className="paramSlider"
                      min={1}
                      max={60}
                      step={1}
                      value={arrowStrokeWidth}
                      onChange={(e) => applyArrow({ strokeWidth: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                      aria-label="箭头线宽滑动"
                    />
                  </div>
                  <div className="paramStack" style={{ marginBottom: 8 }}>
                    <div className="paramLabel">
                      <span>箭头尖</span>
                      <span>{arrowPointerSize}px</span>
                    </div>
                    <input
                      type="range"
                      className="paramSlider"
                      min={6}
                      max={120}
                      step={1}
                      value={arrowPointerSize}
                      onChange={(e) => applyArrow({ pointerSize: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                      aria-label="箭头大小滑动"
                    />
                  </div>
                  <div className="menuRow" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      value={arrowStrokeWidthDraft}
                      inputMode="numeric"
                      type="number"
                      min={1}
                      max={60}
                      step={1}
                      onChange={(e) => setArrowStrokeWidthDraft(e.target.value)}
                      onBlur={() => {
                        const v = Number(arrowStrokeWidthDraft);
                        if (!Number.isFinite(v) || v <= 0) {
                          setArrowStrokeWidthDraft(String(arrowStrokeWidth));
                          return;
                        }
                        applyArrow({ strokeWidth: Math.round(v) }, { defaultsOnly: true });
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        (e.target as HTMLInputElement).blur();
                      }}
                      style={{ ...SETTINGS_FIELD, width: 88, height: 32 }}
                      title="线宽"
                      aria-label="箭头线宽"
                    />
                    <input
                      value={arrowPointerSizeDraft}
                      inputMode="numeric"
                      type="number"
                      min={6}
                      max={120}
                      step={1}
                      onChange={(e) => setArrowPointerSizeDraft(e.target.value)}
                      onBlur={() => {
                        const v = Number(arrowPointerSizeDraft);
                        if (!Number.isFinite(v) || v <= 0) {
                          setArrowPointerSizeDraft(String(arrowPointerSize));
                          return;
                        }
                        applyArrow({ pointerSize: Math.round(v) }, { defaultsOnly: true });
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        (e.target as HTMLInputElement).blur();
                      }}
                      style={{ ...SETTINGS_FIELD, width: 88, height: 32 }}
                      title="箭头尖端大小"
                      aria-label="箭头大小"
                    />
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">不透明度</div>
                  <div className="paramStack" style={{ marginBottom: 8 }}>
                    <div className="paramLabel">
                      <span>拖动调节</span>
                      <span>{Math.round(arrowOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      className="paramSlider"
                      min={0}
                      max={100}
                      step={1}
                      value={Math.round(arrowOpacity * 100)}
                      onChange={(e) => applyArrow({ opacity: Math.round(Number(e.target.value)) / 100 }, { defaultsOnly: true })}
                      aria-label="箭头不透明度滑动"
                    />
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">效果</div>
                  <div className="menuRow">
                    <button
                      type="button"
                      className={arrowShadow ? 'active' : ''}
                      onClick={() => applyArrow({ shadow: !arrowShadow }, { defaultsOnly: true })}
                      title="阴影"
                      aria-label="阴影"
                      aria-pressed={arrowShadow}
                    >
                      阴影
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 8 }}>文字默认</div>
                <div className="menuSection" style={{ marginTop: 0 }}>
                  <div className="menuTitle">颜色</div>
                  <div className="menuRow" style={{ gap: 6 }}>
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={textColor === c.value ? 'active' : ''}
                        onClick={() => applyText({ color: c.value }, { defaultsOnly: true })}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: c.value,
                          border: textColor === c.value ? '2px solid #4c9ffe' : '1px solid rgba(255,255,255,0.2)'
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <TextStyleControls
                  ui={{
                    fill: textColor,
                    fontSize: textSize,
                    fontFamily: textFont,
                    fontWeight: textWeight,
                    fontItalic: textItalic,
                    underline: textUnderline,
                    align: textAlign
                  }}
                  onApply={(patch) => applyText(patch, { defaultsOnly: true })}
                  sizeSection={
                    <div className="menuSection">
                      <div className="menuTitle">字号</div>
                      <div className="paramStack" style={{ marginBottom: 8 }}>
                        <div className="paramLabel">
                          <span>拖动调节</span>
                          <span>{textSize}px</span>
                        </div>
                        <input
                          type="range"
                          className="paramSlider"
                          min={8}
                          max={200}
                          step={1}
                          value={textSize}
                          onChange={(e) => applyText({ size: Math.round(Number(e.target.value)) }, { defaultsOnly: true })}
                          aria-label="字号滑动"
                        />
                      </div>
                      <select className="selectWithArrow" value={String(textSize)} onChange={(e) => applyText({ size: Number(e.target.value) }, { defaultsOnly: true })} style={{ ...SETTINGS_FIELD, height: 36 }}>
                        {COMMON_TEXT_SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  }
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 8 }}>常用属性（本地）</div>
                <p style={{ margin: '0 0 10px', fontSize: 12, opacity: 0.82, lineHeight: 1.45 }}>
                  把当前马赛克、箭头、文字的默认样式存到本机；下次可一键套用。与上方各工具默认项一致。
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => saveCommonStylePrefs()}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.22)',
                      background: 'rgba(255,255,255,0.07)',
                      color: '#e7eaf0',
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    保存为常用属性
                  </button>
                  <button
                    type="button"
                    onClick={() => applySavedCommonStylePrefs(true)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.22)',
                      background: 'rgba(255,255,255,0.07)',
                      color: '#e7eaf0',
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    应用常用属性
                  </button>
                </div>
              </div>
          </>
        }
      />
      {loginOpen ? (
        <div
          onMouseDown={() => {
            if (!canUseAuthedFeatures()) return;
            setLoginOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 9999
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: 420,
              maxWidth: 'calc(100vw - 24px)',
              borderRadius: 14,
              background: 'rgba(16,18,25,0.96)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
              padding: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>登录</div>
              <button
                className="iconBtn"
                type="button"
                onClick={() => {
                  if (!canUseAuthedFeatures()) return;
                  setLoginOpen(false);
                }}
                title={canUseAuthedFeatures() ? '关闭' : '请先登录'}
                aria-label="关闭"
                disabled={!canUseAuthedFeatures()}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.85 }}>认证服务地址</div>
              <input
                value={authBaseUrl}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  setAuthBaseUrl(v);
                  try {
                    window.localStorage.setItem('screenshot.authBaseUrl', v);
                  } catch {
                    // ignore
                  }
                }}
                placeholder="http://localhost:4177"
                style={{
                  height: 34,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#e7eaf0',
                  padding: '0 10px'
                }}
              />
            </div>

            {true ? (
              <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                <input
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="手机号"
                  style={{
                    height: 36,
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.16)',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#e7eaf0',
                    padding: '0 10px'
                  }}
                />
                <input
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder={phoneMode === 'register' ? '设置密码（至少 6 位）' : '密码'}
                  type={showPwd ? 'text' : 'password'}
                  style={{ display: 'none' }}
                />
                <div style={{ position: 'relative' }}>
                  <input
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={phoneMode === 'register' ? '设置密码（至少 6 位）' : '密码'}
                    type={showPwd ? 'text' : 'password'}
                    style={{
                      width: '100%',
                      height: 36,
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.16)',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e7eaf0',
                      padding: '0 38px 0 10px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    title={showPwd ? '隐藏密码' : '显示密码'}
                    aria-label={showPwd ? '隐藏密码' : '显示密码'}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.16)',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e7eaf0',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    {showPwd ? '🙈' : '👁'}
                  </button>
                </div>
                {phoneMode === 'forgot' || phoneMode === 'reset' ? (
                  <>
                    <input
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="邮箱"
                      inputMode="email"
                      style={{
                        height: 36,
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.16)',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#e7eaf0',
                        padding: '0 10px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        placeholder="验证码（6 位）"
                        inputMode="numeric"
                        style={{
                          flex: 1,
                          height: 36,
                          borderRadius: 10,
                          border: '1px solid rgba(255,255,255,0.16)',
                          background: 'rgba(255,255,255,0.06)',
                          color: '#e7eaf0',
                          padding: '0 10px'
                        }}
                      />
                      <button
                        type="button"
                        disabled={emailSending || emailRemainSec > 0}
                        onClick={async () => {
                          const email = normalizeEmail(loginEmail);
                          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                            alert('请输入正确的邮箱');
                            return;
                          }
                          setEmailSending(true);
                          try {
                            await apiJson('/api/auth/email/send_reset_password', {
                              method: 'POST',
                              body: JSON.stringify({ email })
                            });
                            setEmailCooldownUntil(Date.now() + 60_000);
                            setPhoneMode('forgot');
                          } catch (e) {
                            alert(formatAuthError(e));
                          } finally {
                            setEmailSending(false);
                          }
                        }}
                        style={{
                          width: 120,
                          height: 36,
                          borderRadius: 10,
                          border: '1px solid rgba(255,255,255,0.16)',
                          background: '#4c9ffe',
                          color: '#0b1120',
                          cursor: 'pointer',
                          fontWeight: 700,
                          opacity: emailSending || emailRemainSec > 0 ? 0.7 : 1
                        }}
                      >
                        {emailRemainSec > 0 ? `${emailRemainSec}s` : '发送获取验证码'}
                      </button>
                    </div>
                  </>
                ) : null}

                {phoneMode === 'register' || phoneMode === 'reset' ? (
                  <div style={{ position: 'relative' }}>
                    <input
                      value={registerPassword2}
                      onChange={(e) => setRegisterPassword2(e.target.value)}
                      placeholder={phoneMode === 'reset' ? '确认新密码' : '确认密码'}
                      type={showPwd ? 'text' : 'password'}
                      style={{
                        width: '100%',
                        height: 36,
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.16)',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#e7eaf0',
                        padding: '0 38px 0 10px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      title={showPwd ? '隐藏密码' : '显示密码'}
                      aria-label={showPwd ? '隐藏密码' : '显示密码'}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.16)',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#e7eaf0',
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      {showPwd ? '🙈' : '👁'}
                    </button>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={async () => {
                    const pwd = loginPassword;
                    if (phoneMode === 'forgot' || phoneMode === 'reset') {
                      const email = normalizeEmail(loginEmail);
                      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        alert('请输入正确的邮箱');
                        return;
                      }
                      if (!emailCode || !/^\d{6}$/.test(emailCode)) {
                        alert('请输入 6 位验证码');
                        return;
                      }
                      if (phoneMode === 'forgot') {
                        try {
                          const r = await apiJson<{ ok: true; resetToken: string }>('/api/auth/email/verify_reset_password', {
                            method: 'POST',
                            body: JSON.stringify({ email, code: emailCode })
                          });
                          setResetToken(r.resetToken);
                          setPhoneMode('reset');
                        } catch (e) {
                          alert(formatAuthError(e));
                        }
                        return;
                      }
                      if (!resetToken) {
                        alert('请先验证验证码');
                        return;
                      }
                      if (!pwd || pwd.length < 6) {
                        alert('新密码至少 6 位');
                        return;
                      }
                      if (!registerPassword2) {
                        alert('请再次输入新密码');
                        return;
                      }
                      if (pwd !== registerPassword2) {
                        alert('两次输入的新密码不一致');
                        return;
                      }
                    } else if (!pwd || pwd.length < 6) {
                      alert('密码至少 6 位');
                      return;
                    } else if (phoneMode === 'register') {
                      if (!registerPassword2) {
                        alert('请再次输入密码');
                        return;
                      }
                      if (pwd !== registerPassword2) {
                        alert('两次输入的密码不一致');
                        return;
                      }
                    }
                    try {
                      if (phoneMode === 'reset') {
                        await apiJson('/api/auth/password/reset_by_email', {
                          method: 'POST',
                          body: JSON.stringify({ resetToken, newPassword: pwd })
                        });
                        setPhoneMode('login');
                        setEmailCode('');
                        setEmailCooldownUntil(0);
                        setResetToken(null);
                        setLoginPassword('');
                        setRegisterPassword2('');
                        alert('密码已重置，请用新密码登录');
                        return;
                      }
                      if (phoneMode === 'register') {
                        if (loginMethod === 'phone') {
                          const phone = normalizePhone(loginPhone);
                          if (!/^1\d{10}$/.test(phone)) {
                            alert('请输入正确的 11 位手机号');
                            return;
                          }
                          await apiJson('/api/auth/register/phone', { method: 'POST', body: JSON.stringify({ phone, password: pwd }) });
                        } else {
                          const email = normalizeEmail(loginEmail);
                          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                            alert('请输入正确的邮箱');
                            return;
                          }
                          await apiJson('/api/auth/register/email', { method: 'POST', body: JSON.stringify({ email, password: pwd }) });
                        }
                      }
                      const r =
                        loginMethod === 'phone'
                          ? await apiJson<{ ok: true; token: string; user: LocalSession['user'] }>('/api/auth/login/phone', {
                              method: 'POST',
                              body: JSON.stringify({ phone: normalizePhone(loginPhone), password: pwd })
                            })
                          : await apiJson<{ ok: true; token: string; user: LocalSession['user'] }>('/api/auth/login/email', {
                              method: 'POST',
                              body: JSON.stringify({ email: normalizeEmail(loginEmail), password: pwd })
                            });
                      const next: LocalSession = { token: r.token, expiresAt: parseJwtExpiresAt(r.token), user: r.user };
                      persistSession(next);
                      markAuthVerified(true);
                      setLoginOpen(false);
                      setLoginPassword('');
                      setRegisterPassword2('');
                      setEmailCode('');
                      setEmailCooldownUntil(0);
                      setResetToken(null);
                      setPhoneMode('login');
                    } catch (e) {
                      alert(formatAuthError(e));
                    }
                  }}
                  style={{
                    height: 36,
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.16)',
                    background: '#4c9ffe',
                    color: '#0b1120',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {phoneMode === 'register'
                    ? '注册并登录'
                    : phoneMode === 'forgot'
                      ? '验证验证码'
                      : phoneMode === 'reset'
                        ? '重置密码'
                        : '登录'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12, opacity: 0.9 }}>
                  {phoneMode === 'login' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneMode('register');
                          setLoginPassword('');
                          setRegisterPassword2('');
                          setEmailCode('');
                          setEmailCooldownUntil(0);
                          setResetToken(null);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#9cc3ff', cursor: 'pointer', padding: 0 }}
                      >
                        注册新账号
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneMode('forgot');
                          setLoginPassword('');
                          setRegisterPassword2('');
                          setEmailCode('');
                          setEmailCooldownUntil(0);
                          setResetToken(null);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#9cc3ff', cursor: 'pointer', padding: 0 }}
                      >
                        忘记密码？
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneMode('login');
                        setLoginPassword('');
                        setRegisterPassword2('');
                        setEmailCode('');
                        setEmailCooldownUntil(0);
                        setResetToken(null);
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#9cc3ff', cursor: 'pointer', padding: 0 }}
                    >
                      返回登录
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8, lineHeight: 1.4 }}>
              说明：当前登录使用本地后端认证服务（JWT）。确保 `dev:server` 已运行。
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

