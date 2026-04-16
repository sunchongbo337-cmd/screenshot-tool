import React, { useEffect, useRef, useState } from 'react';
import { EditorWidget } from '@screenshot/editor-react';
import type { AnnotationSnapshotV1, EditorWidgetHandle, EditorWidgetOptions, ImageSource } from '@screenshot/editor-react';
import type { Tool } from '@screenshot/editor-core';
import workerUrl from 'tesseract.js/dist/worker.min.js?url';
import coreSimdLstmUrl from 'tesseract.js-core/tesseract-core-simd-lstm.wasm.js?url';

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

const TEXT_FONTS = [
  { label: '微软雅黑', value: 'Microsoft YaHei' },
  { label: '宋体', value: 'SimSun' },
  { label: '黑体', value: 'SimHei' },
  { label: '楷体', value: 'KaiTi' },
  { label: '仿宋', value: 'FangSong' },
  { label: '幼圆', value: 'YouYuan' },
  { label: '隶书', value: 'LiSu' },
  { label: '苹方', value: 'PingFang SC' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Arial Black', value: 'Arial Black' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Tahoma', value: 'Tahoma' },
  { label: 'Segoe UI', value: 'Segoe UI' },
  { label: '等宽 Courier', value: 'Courier New' },
  { label: '等宽 Consolas', value: 'Consolas' },
  { label: 'Comic Sans', value: 'Comic Sans MS' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS' }
] as const;

const MOSAIC_BRUSH_SIZES = [
  { name: '细', value: 10 },
  { name: '中', value: 18 },
  { name: '粗', value: 28 }
] as const;

const MOSAIC_LEVELS = [
  { name: '轻', pixelSize: 10, blurRadius: 4 },
  { name: '中', pixelSize: 14, blurRadius: 6 },
  { name: '重', pixelSize: 18, blurRadius: 8 }
] as const;

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
    fontWeight: 'normal'
  } as Tool
};

type Selection = Parameters<NonNullable<EditorWidgetOptions['onSelectionChange']>>[0];

async function blobToDataUrl(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Failed to read blob'));
    r.readAsDataURL(blob);
  });
}

export function EditorScreen() {
  const desktopApi = (window as any).desktopApi as any;
  useEffect(() => {
    console.log('[renderer] EditorScreen mounted. desktopApi:', desktopApi ? 'ok' : 'missing');
  }, []);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorWidgetHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hostReady, setHostReady] = useState(false);
  type QueueItem = { id: string; name: string; image: ImageSource; annotations: AnnotationSnapshotV1 | null };
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = queue[activeIndex] ?? null;
  const image = activeItem?.image ?? null;
  function addToQueueFromDataUrl(dataUrl: string, name = `pasted_${Date.now()}.png`) {
    setQueue((prev) => {
      const item = {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        name,
        image: { kind: 'dataUrl', dataUrl } as ImageSource,
        annotations: null
      };
      const next = [...prev, item];
      // jump to the newly added item
      setActiveIndex(next.length - 1);
      return next;
    });
    setActive('select');
    editorRef.current?.setTool(baseTools.select);
  }
  const [active, setActive] = useState<'select' | 'mosaic' | 'arrow' | 'text'>('select');
  const [cropMode, setCropMode] = useState(false);
  const [alignMode, setAlignMode] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
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
  const [openMenu, setOpenMenu] = useState<null | 'arrow' | 'mosaic' | 'text'>(null);
  const [hintTool, setHintTool] = useState<null | 'arrow' | 'mosaic' | 'text'>(null);
  const [mosaicMode, setMosaicMode] = useState<'rect' | 'brush'>('rect');
  const [mosaicStyle, setMosaicStyle] = useState<'pixel' | 'blur'>('pixel');
  const [mosaicBrushSize, setMosaicBrushSize] = useState(18);
  const [mosaicLevel, setMosaicLevel] = useState<(typeof MOSAIC_LEVELS)[number]['name']>('中');
  const [arrowColor, setArrowColor] = useState('#ff3b30');
  const [arrowStrokeWidth, setArrowStrokeWidth] = useState(6);
  const [arrowPointerSize, setArrowPointerSize] = useState(16);
  const [arrowKind, setArrowKind] = useState<'straight' | 'elbow' | 'curve'>('straight');

  const [textColor, setTextColor] = useState('#ff3b30');
  const [textSize, setTextSize] = useState(24);
  const [textWeight, setTextWeight] = useState<'normal' | 'bold'>('normal');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  // Template key for reusing annotation positions across similar medical record images.
  const [templateKey, setTemplateKey] = useState(() => {
    const raw = window.localStorage.getItem('screenshot.templateKey');
    return raw && raw.trim() ? raw : 'hospital_record_v1';
  });
  const templateKeyNormalized = templateKey.trim();
  useEffect(() => {
    window.localStorage.setItem('screenshot.templateKey', templateKeyNormalized || 'hospital_record_v1');
  }, [templateKeyNormalized]);
  const [textFont, setTextFont] = useState('Microsoft YaHei');
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedArrowId, setSelectedArrowId] = useState<string | null>(null);
  const [autoDetectLoading, setAutoDetectLoading] = useState(false);
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
          addToQueueFromDataUrl(dataUrl);
          return;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [image]);

  const isAuthed = !!session?.token;
  useEffect(() => {
    isAuthedRef.current = isAuthed;
    authVerifiedRef.current = authVerified;
  }, [isAuthed, authVerified]);
  const canRender = hostReady && !!image && authVerified;

  function getTool(kind: 'select' | 'mosaic' | 'arrow' | 'text'): Tool {
    if (kind === 'select') return baseTools.select;
    if (kind === 'arrow')
      return {
        kind: 'arrow',
        arrowKind,
        stroke: arrowColor,
        strokeWidth: arrowStrokeWidth,
        pointerLength: arrowPointerSize,
        pointerWidth: arrowPointerSize
      };
    if (kind === 'text')
      return {
        kind: 'text',
        fill: textColor,
        fontSize: textSize,
        fontFamily: textFont,
        padding: 6,
        align: textAlign,
        lineHeight: 1.25,
        letterSpacing: 0,
        fontWeight: textWeight
      };
    return {
      kind: 'mosaic',
      pixelSize: MOSAIC_LEVELS.find((l) => l.name === mosaicLevel)?.pixelSize ?? 14,
      mode: mosaicMode,
      style: mosaicStyle,
      brushSize: mosaicBrushSize,
      blurRadius: MOSAIC_LEVELS.find((l) => l.name === mosaicLevel)?.blurRadius ?? 6
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

  function applyMosaic(next: {
    mode?: 'rect' | 'brush';
    style?: 'pixel' | 'blur';
    brushSize?: number;
    level?: (typeof MOSAIC_LEVELS)[number]['name'];
  }) {
    const nextMode = next.mode ?? mosaicMode;
    const nextStyle = next.style ?? mosaicStyle;
    const nextBrushSize = next.brushSize ?? mosaicBrushSize;
    const nextLevel = next.level ?? mosaicLevel;
    setMosaicMode(nextMode);
    setMosaicStyle(nextStyle);
    if (next.brushSize != null) setMosaicBrushSize(next.brushSize);
    if (next.level != null) setMosaicLevel(nextLevel);
    setActive('mosaic');
    const levelConf = MOSAIC_LEVELS.find((l) => l.name === nextLevel);
    editorRef.current?.setTool({
      kind: 'mosaic',
      pixelSize: levelConf?.pixelSize ?? 14,
      mode: nextMode,
      style: nextStyle,
      brushSize: nextBrushSize,
      blurRadius: levelConf?.blurRadius ?? 6
    });
  }

  function applyArrow(next: {
    kind?: 'straight' | 'elbow' | 'curve';
    color?: string;
    strokeWidth?: number;
    pointerSize?: number;
  }) {
    if (next.kind != null) setArrowKind(next.kind);
    if (next.color != null) setArrowColor(next.color);
    if (next.strokeWidth != null) setArrowStrokeWidth(next.strokeWidth);
    if (next.pointerSize != null) setArrowPointerSize(next.pointerSize);
    const stylePatch = {
      arrowKind: next.kind ?? arrowKind,
      stroke: next.color ?? arrowColor,
      strokeWidth: next.strokeWidth ?? arrowStrokeWidth,
      pointerSize: next.pointerSize ?? arrowPointerSize
    } as const;
    if (selectedArrowId) {
      editorRef.current?.applyArrowStyle(stylePatch);
      editorRef.current?.setTool({ kind: 'select' });
      setActive('arrow');
      return;
    }
    setActive('arrow');
    editorRef.current?.setTool({
      kind: 'arrow',
      arrowKind: stylePatch.arrowKind,
      stroke: stylePatch.stroke,
      strokeWidth: stylePatch.strokeWidth,
      pointerLength: stylePatch.pointerSize,
      pointerWidth: stylePatch.pointerSize
    });
  }

  function applyText(next: {
    color?: string;
    size?: number;
    weight?: 'normal' | 'bold';
    align?: 'left' | 'center' | 'right';
    font?: string;
  }) {
    if (next.color != null) setTextColor(next.color);
    if (next.size != null) setTextSize(next.size);
    if (next.weight != null) setTextWeight(next.weight);
    if (next.align != null) setTextAlign(next.align);
    if (next.font != null) setTextFont(next.font);
    // If a text node is selected, treat this panel as a style editor (do not switch into create mode).
    if (selectedTextId) {
      const stylePatch = {
        fill: next.color ?? textColor,
        fontSize: next.size ?? textSize,
        fontFamily: next.font ?? textFont,
        fontWeight: next.weight ?? textWeight,
        align: next.align ?? textAlign,
        lineHeight: 1.25,
        letterSpacing: 0
      } as const;
      editorRef.current?.applyTextStyle(stylePatch);
      // Keep tool as select so clicks won't create new boxes.
      editorRef.current?.setTool({ kind: 'select' });
      setActive('text');
      return;
    }
    const stylePatch = {
      fill: next.color ?? textColor,
      fontSize: next.size ?? textSize,
      fontFamily: next.font ?? textFont,
      fontWeight: next.weight ?? textWeight,
      align: next.align ?? textAlign,
      lineHeight: 1.25,
      letterSpacing: 0
    } as const;
    editorRef.current?.setTool({
      kind: 'text',
      padding: 6,
      ...stylePatch
    });
    editorRef.current?.applyTextStyle(stylePatch);
  }

  async function onSave() {
    if (!editorRef.current) return;
    const blob = await editorRef.current.export({
      format,
      quality: isLossyFormat ? 0.95 : undefined
    });
    const dataUrl = await blobToDataUrl(blob);

    // 优先走桌面端原生保存
    if (typeof desktopApi?.saveFile === 'function') {
      await desktopApi.saveFile({ dataUrl, format });
      return;
    }

    // 兜底：浏览器里用下载链接保存
    const ext = format === 'jpeg' ? 'jpg' : format;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screenshot_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onCopy() {
    if (!editorRef.current) return;
    const blob = await editorRef.current.export({ format: 'png' });
    const dataUrl = await blobToDataUrl(blob);

    // 优先走桌面端原生剪贴板
    if (typeof desktopApi?.copyClipboard === 'function') {
      await desktopApi.copyClipboard({ dataUrl });
      return;
    }

    // 兜底：浏览器剪贴板 / 下载
    const anyNav = navigator as any;
    if (anyNav.clipboard?.write && typeof (window as any).ClipboardItem !== 'undefined') {
      await anyNav.clipboard.write([new (window as any).ClipboardItem({ 'image/png': blob })]);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screenshot_${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
    setCopyOk(true);
    setTimeout(() => setCopyOk(false), 1500);
  }

  async function onFinish() {
    await onCopy();
    setPasteHint(true);
    setTimeout(() => setPasteHint(false), 2000);
  }

  function onPickImage() {
    if (!canUseAuthedFeatures()) return;
    // 优先用系统文件选择（与网页端一致，不依赖 IPC）
    fileInputRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;
    (async () => {
      const items: QueueItem[] = [];
      for (const f of files) {
        const dataUrl = await blobToDataUrl(f);
        items.push({ id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, name: f.name, image: { kind: 'dataUrl', dataUrl }, annotations: null });
      }
      setQueue((prev) => {
        const next = [...prev, ...items];
        return next;
      });
      // If nothing is open, jump to first newly added item.
      setActiveIndex((idx) => (queue.length === 0 ? 0 : idx));
      setActive('select');
      editorRef.current?.setTool(baseTools.select);
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

  async function onCloseImage() {
    setQueue([]);
    setActiveIndex(0);
    setSelectedTextId(null);
    setSelectedArrowId(null);
    setActive('select');
    setOpenMenu(null);
    editorRef.current?.setTool(baseTools.select);
  }

  function switchTo(index: number) {
    if (index < 0 || index >= queue.length) return;
    // Persist current annotations into current item before switching.
    if (queue[activeIndex] && editorRef.current) {
      const snap = editorRef.current.exportAnnotations();
      setQueue((prev) => prev.map((it, i) => (i === activeIndex ? { ...it, annotations: snap } : it)));
    }
    setActiveIndex(index);
    setSelectedTextId(null);
    setSelectedArrowId(null);
    setActive('select');
    setOpenMenu(null);
    setHintTool(null);
    editorRef.current?.setTool(baseTools.select);
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
      editorRef.current?.setBackgroundDragMode(false);
    };
    window.addEventListener('mousedown', onMouseDownCapture, true);
    return () => window.removeEventListener('mousedown', onMouseDownCapture, true);
  }, [alignMode, activeIndex, queue]);

  async function getImageDataUrl(src: ImageSource): Promise<string> {
    if (src.kind === 'dataUrl') return src.dataUrl;
    if (src.kind === 'blob') return blobToDataUrl(src.blob);
    const res = await fetch(src.url);
    return blobToDataUrl(await res.blob());
  }

  async function onAutoDetectMosaic() {
    if (!image || !editorRef.current) return;
    setAutoDetectLoading(true);
    try {
      const dataUrl = await getImageDataUrl(image);
      const Tesseract = (await import('tesseract.js')).default;
      const TesseractAny = Tesseract as any;
      const { data } = await TesseractAny.recognize(dataUrl, 'chi_sim+eng', { workerPath: workerUrl, corePath: coreSimdLstmUrl });
      const rects: Array<{ x: number; y: number; width: number; height: number }> = [];
      const padding = 4;
      const expand = 0.25;
      for (const word of data.words ?? []) {
        const b = word.bbox;
        if (!b || b.x0 == null || b.y0 == null || b.x1 == null || b.y1 == null) continue;
        const wRaw = b.x1 - b.x0;
        const hRaw = b.y1 - b.y0;
        const cx = (b.x0 + b.x1) / 2;
        const cy = (b.y0 + b.y1) / 2;
        const width = Math.max(1, wRaw * (1 + expand) + padding * 2);
        const height = Math.max(1, hRaw * (1 + expand) + padding * 2);
        const x = Math.max(0, cx - width / 2);
        const y = Math.max(0, cy - height / 2);
        rects.push({ x, y, width, height });
      }
      if (rects.length > 0) {
        editorRef.current.setDetectedRegions(rects);
        setHasDetectedRegions(true);
      } else {
        editorRef.current.clearDetectedRegions();
        setHasDetectedRegions(false);
        alert('自动检测未找到可打码的文字区域（可以换一张更清晰的图试试）');
      }
    } catch (err) {
      editorRef.current?.clearDetectedRegions();
      setHasDetectedRegions(false);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`自动检测失败：${msg || '未知错误'}`);
    } finally {
      setAutoDetectLoading(false);
    }
  }

  function onApplyDetectedMosaic() {
    if (!editorRef.current || !hasDetectedRegions) return;
    const levelConf = MOSAIC_LEVELS.find((l) => l.name === mosaicLevel);
    editorRef.current.applyDetectedRegionsAsMosaic({
      style: mosaicStyle,
      pixelSize: levelConf?.pixelSize ?? 14,
      blurRadius: levelConf?.blurRadius ?? 6
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
      {image ? (
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
                editorRef.current?.setBackgroundDragMode(false);
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
                editorRef.current?.setBackgroundDragMode(next);
              }}
              disabled={!image}
              title="对齐底图（开启后可拖动底层图片与模板对齐）"
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

            <span className="captureSep" aria-hidden="true" />

            <button
              className={`iconBtn ${cropMode ? 'active' : ''}`}
              type="button"
              onClick={() => {
                const next = !cropMode;
                setCropMode(next);
                setAlignMode(false);
                editorRef.current?.setBackgroundDragMode(false);
                // Always use select tool while cropping.
                setTool('select');
                editorRef.current?.setTransformMode(next ? 'crop' : 'none');
              }}
              title="裁剪（拖拽框选，空白处完成）"
              aria-label="裁剪"
            >
              ✂
            </button>

            <button
              className="iconBtn"
              type="button"
              onClick={() => {
                setCropMode(false);
                editorRef.current?.setTransformMode('none');
                editorRef.current?.clearCrop();
              }}
              disabled={!image}
              title="清除裁剪"
              aria-label="清除裁剪"
            >
              ⌫
            </button>

            <span className="captureSep" aria-hidden="true" />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginLeft: 8,
                paddingLeft: 8,
                borderLeft: '1px solid rgba(255,255,255,0.12)'
              }}
              title="模板：用于复用上一张病历的打码/标注位置"
            >
              <input
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                placeholder="模板名"
                style={{
                  width: 140,
                  height: 28,
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(0,0,0,0.25)',
                  color: '#fff',
                  padding: '0 8px',
                  outline: 'none'
                }}
              />
              <button
                className="iconBtn"
                type="button"
                onClick={() => editorRef.current?.applyTemplate()}
                disabled={!image || !templateKeyNormalized}
                title="套用模板（把上一次保存的打码/箭头/文字位置加载到当前图片）"
                aria-label="套用模板"
              >
                ⇩
              </button>
              <button
                className="iconBtn"
                type="button"
                onClick={() => editorRef.current?.saveTemplate()}
                disabled={!image || !templateKeyNormalized}
                title="保存模板（把当前打码/箭头/文字位置保存，下次可直接套用）"
                aria-label="保存模板"
              >
                💾
              </button>
              <button
                className="iconBtn danger"
                type="button"
                onClick={() => editorRef.current?.clearTemplate()}
                disabled={!image || !templateKeyNormalized}
                title="清除模板（删除该模板名对应的已保存位置）"
                aria-label="清除模板"
              >
                🗑
              </button>
            </div>

            <span className="captureSep" aria-hidden="true" />

            <details className="menu" open={openMenu === 'arrow'}>
              <summary
                className={`iconBtn ${openMenu === 'arrow' ? 'active' : hintTool === 'arrow' ? 'hint' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCropMode(false);
                  editorRef.current?.setTransformMode('none');
                  if (openMenu === 'arrow') {
                    setOpenMenu(null);
                    setTool('select');
                    setHintTool('arrow');
                    return;
                  }
                  if (active !== 'arrow') setTool('arrow');
                  setOpenMenu('arrow');
                  setHintTool(null);
                }}
                title="箭头"
                aria-label="箭头"
              >
                ↗
              </summary>
              <div className="menuPanel" onMouseDown={(e) => e.preventDefault()}>
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
                  <div className="menuRow">
                    {[{ name: '细', w: 4 }, { name: '中', w: 6 }, { name: '粗', w: 10 }].map(({ name, w }) => (
                      <button key={w} className={arrowStrokeWidth === w ? 'active' : ''} onClick={() => applyArrow({ strokeWidth: w })}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">箭头大小</div>
                  <div className="menuRow">
                    {[{ name: '小', s: 12 }, { name: '中', s: 16 }, { name: '大', s: 20 }].map(({ name, s }) => (
                      <button key={s} className={arrowPointerSize === s ? 'active' : ''} onClick={() => applyArrow({ pointerSize: s })}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </details>

            <details className="menu" open={openMenu === 'mosaic'}>
              <summary
                className={`iconBtn ${openMenu === 'mosaic' ? 'active' : hintTool === 'mosaic' ? 'hint' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCropMode(false);
                  editorRef.current?.setTransformMode('none');
                  if (openMenu === 'mosaic') {
                    setOpenMenu(null);
                    setTool('select');
                    setHintTool('mosaic');
                    return;
                  }
                  if (active !== 'mosaic') setTool('mosaic');
                  setOpenMenu('mosaic');
                  setHintTool(null);
                }}
                title="马赛克"
                aria-label="马赛克"
              >
                ▦
              </summary>
              <div className="menuPanel" onMouseDown={(e) => e.preventDefault()}>
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
                      disabled={!image || autoDetectLoading}
                      title="自动检测打码"
                      aria-label="自动检测打码"
                    >
                      自动检测
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
                {mosaicMode === 'brush' ? (
                  <div className="menuSection">
                    <div className="menuTitle">笔刷粗细</div>
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

            <details className="menu" open={openMenu === 'text'}>
              <summary
                className={`iconBtn ${openMenu === 'text' ? 'active' : hintTool === 'text' ? 'hint' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCropMode(false);
                  editorRef.current?.setTransformMode('none');
                  if (openMenu === 'text') {
                    setOpenMenu(null);
                    setTool('select');
                    setHintTool('text');
                    return;
                  }
                  if (active !== 'text') setTool('text');
                  setOpenMenu('text');
                  setHintTool(null);
                }}
                title="文字"
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
                <div className="menuSection">
                  <div className="menuTitle">颜色</div>
                  <div className="menuRow" style={{ gap: 6 }}>
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.value}
                        className={textColor === c.value ? 'active' : ''}
                        onClick={() => applyText({ color: c.value })}
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
                <div className="menuSection">
                  <div className="menuTitle">字号</div>
                  <div className="menuRow">
                    {[12, 14, 16, 18, 20, 24, 28, 32, 40].map((s) => (
                      <button key={s} className={textSize === s ? 'active' : ''} onClick={() => applyText({ size: s })}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">字体</div>
                  <select className="selectWithArrow" value={textFont} onChange={(e) => applyText({ font: e.target.value })} style={{ width: '100%' }} title="点击选择字体">
                    {TEXT_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">字重</div>
                  <div className="menuRow">
                    <button className={textWeight === 'normal' ? 'active' : ''} onClick={() => applyText({ weight: 'normal' })}>
                      常规
                    </button>
                    <button className={textWeight === 'bold' ? 'active' : ''} onClick={() => applyText({ weight: 'bold' })}>
                      加粗
                    </button>
                  </div>
                </div>
                <div className="menuSection">
                  <div className="menuTitle">对齐</div>
                  <div className="menuRow">
                    <button className={textAlign === 'left' ? 'active' : ''} onClick={() => applyText({ align: 'left' })}>
                      左
                    </button>
                    <button className={textAlign === 'center' ? 'active' : ''} onClick={() => applyText({ align: 'center' })}>
                      中
                    </button>
                    <button className={textAlign === 'right' ? 'active' : ''} onClick={() => applyText({ align: 'right' })}>
                      右
                    </button>
                  </div>
                </div>
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

            <button className="iconBtn" onClick={onSave} disabled={!image} title="保存" aria-label="保存">
              ⬇
            </button>
            <button className="iconBtn" onClick={onCopy} disabled={!image} title="复制" aria-label="复制">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
                <rect x="9" y="9" width="11" height="11" />
                <rect x="4" y="4" width="11" height="11" />
              </svg>
            </button>
            <select className="formatSelect" value={format} onChange={(e) => setFormat(e.target.value as any)} title="格式" aria-label="格式">
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
            {isLossyFormat ? (
              <span style={{ fontSize: 11, opacity: 0.75, color: '#ffd28a' }} title="JPEG/WebP 为有损压缩，病历场景建议优先使用 PNG">
                有损压缩
              </span>
            ) : null}

            <span className="captureSep" aria-hidden="true" />

            <button
              className="iconBtn"
              type="button"
              onClick={session ? onLogout : onLogin}
              title={session ? `退出登录（${session.user.displayName}）` : '登录'}
              aria-label={session ? '退出登录' : '登录'}
            >
              {session ? '⎋' : '👤'}
            </button>

            <button className="iconBtn danger" onClick={onCloseImage} title="关闭" aria-label="关闭">
              ✕
            </button>
            <button className="iconBtn ok" onClick={onFinish} disabled={!image} title="完成并复制" aria-label="完成并复制">
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
              <div className="emptySubtitle">按 Ctrl+Alt+A 截图，或选择一张图片开始标注。</div>
              <div className="emptyActions">
                <button className="secondary" onClick={onPickImage}>
                  选择图片编辑
                </button>
                <button className="secondary" onClick={session ? onLogout : onLogin}>
                  {session ? `退出登录（${session.user.displayName}）` : '登录'}
                </button>
              </div>
              <div className="emptyHint">提示：在任何时刻按 Ctrl+Alt+A 截图，然后回到这里按 Ctrl+V 即可把图片贴进编辑器。</div>
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
            {queue.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => switchTo(activeIndex - 1)}
                  disabled={activeIndex <= 0}
                  aria-label="上一张"
                  title="上一张"
                  style={{
                    position: 'fixed',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(16,18,25,0.72)',
                    color: '#fff',
                    fontSize: 20,
                    zIndex: 50,
                    opacity: activeIndex <= 0 ? 0.35 : 1,
                    pointerEvents: activeIndex <= 0 ? 'none' : 'auto'
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => switchTo(activeIndex + 1)}
                  disabled={activeIndex >= queue.length - 1}
                  aria-label="下一张"
                  title="下一张"
                  style={{
                    position: 'fixed',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(16,18,25,0.72)',
                    color: '#fff',
                    fontSize: 20,
                    zIndex: 50,
                    opacity: activeIndex >= queue.length - 1 ? 0.35 : 1,
                    pointerEvents: activeIndex >= queue.length - 1 ? 'none' : 'auto'
                  }}
                >
                  ›
                </button>
                <div
                  style={{
                    position: 'fixed',
                    left: '50%',
                    bottom: 16,
                    transform: 'translateX(-50%)',
                    padding: '6px 10px',
                    borderRadius: 10,
                    background: 'rgba(16,18,25,0.72)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                    fontSize: 12,
                    zIndex: 50,
                    maxWidth: '80%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={activeItem?.name ?? ''}
                >
                  {activeIndex + 1}/{queue.length} {activeItem?.name ?? ''}
                  <span style={{ opacity: 0.7, marginLeft: 10 }}>|</span>
                  <button
                    className="secondary"
                    onClick={onPickImage}
                    style={{ marginLeft: 10 }}
                    title="继续导入"
                    aria-label="继续导入"
                  >
                    继续导入
                  </button>
                </div>
              </>
            ) : null}
            {canRender ? (
                <EditorWidget
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
                      autoSave: false
                    },
                    onTemplateEvent: (ev: any) => {
                      if (ev.type === 'save') setTemplateToast(`模板已保存（${ev.nodeCount} 个标注）`);
                      else if (ev.type === 'apply') setTemplateToast(`模板已套用（${ev.nodeCount} 个标注）`);
                      else if (ev.type === 'not_found') setTemplateToast('未找到模板：请先保存模板');
                      else if (ev.type === 'cleared') setTemplateToast('模板已清除');
                      else if (ev.type === 'invalid_key') setTemplateToast('模板名无效');
                      else if (ev.type === 'error') setTemplateToast(`模板操作失败：${ev.message}`);
                    },
                    onCropApplied: () => {
                      setCropMode(false);
                      editorRef.current?.setTransformMode('none');
                    },
                    onSelectionChange: (sel: Selection) => {
                      if (!sel) {
                        setSelectedTextId(null);
                        setSelectedArrowId(null);
                        return;
                      }
                      if (sel.kind === 'text') {
                        setSelectedArrowId(null);
                        setSelectedTextId(sel.id);
                        setTextColor(sel.style.fill);
                        setTextSize(sel.style.fontSize);
                        if (sel.style.fontFamily) setTextFont(sel.style.fontFamily);
                        setTextWeight(
                          (sel.style.fontWeight as any) === 'bold' || sel.style.fontWeight === 700 ? 'bold' : 'normal'
                        );
                        setTextAlign((sel.style.align as any) ?? 'left');
                        setActive('text');
                        editorRef.current?.setTool({ kind: 'select' });
                        return;
                      }
                      if (sel.kind === 'arrow') {
                        setSelectedTextId(null);
                        setSelectedArrowId(sel.id);
                        setArrowKind((sel.style.arrowKind as any) ?? 'straight');
                        setArrowColor(sel.style.stroke);
                        setArrowStrokeWidth(sel.style.strokeWidth);
                        setArrowPointerSize(sel.style.pointerSize);
                        setActive('arrow');
                        editorRef.current?.setTool({ kind: 'select' });
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

