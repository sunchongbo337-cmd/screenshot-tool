export type HotkeyChord = {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  key: string;
};

export const DEFAULT_HOTKEY_REGION_CAPTURE = 'Ctrl+Alt+A';
/** Desktop Electron global js-web-screen-shot region capture. */
export const DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT = 'Alt+A';
/** Web demo / embed / browser extension (page-scoped) region capture. */
export const DEFAULT_HOTKEY_WEB_REGION_CAPTURE = 'Alt+Shift+A';
/** @deprecated Alias of {@link DEFAULT_HOTKEY_WEB_REGION_CAPTURE}. */
export const DEFAULT_HOTKEY_BROWSER_SCREEN_CAPTURE = DEFAULT_HOTKEY_WEB_REGION_CAPTURE;

const MODIFIER_TOKENS = new Set(['ctrl', 'control', 'alt', 'shift', 'meta', 'win', 'command', 'cmd', 'super']);

function normalizeKeyToken(raw: string): string | null {
  const token = raw.trim();
  if (!token) return null;
  const lower = token.toLowerCase();
  if (lower === 'esc' || lower === 'escape') return 'Esc';
  if (lower === 'space' || lower === ' ') return 'Space';
  if (lower === 'enter' || lower === 'return') return 'Enter';
  if (lower === 'tab') return 'Tab';
  if (lower === 'backspace') return 'Backspace';
  if (lower === 'delete' || lower === 'del') return 'Delete';
  if (/^f\d{1,2}$/i.test(token)) return token.toUpperCase();
  if (token.length === 1) return token.toUpperCase();
  if (/^[a-z0-9]$/i.test(token)) return token.toUpperCase();
  return token.length <= 12 ? token : null;
}

/** Prefer e.key; fall back to e.code for stable matching across layouts/IME. */
export function eventKeyToken(e: KeyboardEvent): string | null {
  const fromKey = normalizeKeyToken(e.key);
  if (fromKey) {
    if (fromKey.length === 1 || /^F\d+$/.test(fromKey)) return fromKey;
    if (['Esc', 'Space', 'Enter', 'Tab', 'Backspace', 'Delete'].includes(fromKey)) return fromKey;
  }
  const keyCode = e.code.match(/^Key([A-Z0-9])$/);
  if (keyCode) return keyCode[1]!;
  const digitCode = e.code.match(/^Digit([0-9])$/);
  if (digitCode) return digitCode[1]!;
  const fCode = e.code.match(/^(F\d+)$/);
  if (fCode) return fCode[1]!;
  return fromKey;
}

export function parseHotkeyString(raw: string | null | undefined): HotkeyChord | null {
  if (!raw || typeof raw !== 'string') return null;
  const parts = raw
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return null;

  const chord: HotkeyChord = { ctrl: false, alt: false, shift: false, meta: false, key: '' };
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower === 'ctrl' || lower === 'control') {
      chord.ctrl = true;
      continue;
    }
    if (lower === 'alt') {
      chord.alt = true;
      continue;
    }
    if (lower === 'shift') {
      chord.shift = true;
      continue;
    }
    if (lower === 'meta' || lower === 'win' || lower === 'command' || lower === 'cmd' || lower === 'super') {
      chord.meta = true;
      continue;
    }
    if (MODIFIER_TOKENS.has(lower)) continue;
    const key = normalizeKeyToken(part);
    if (!key) return null;
    if (chord.key) return null;
    chord.key = key;
  }
  if (!chord.key) return null;
  return chord;
}

export function sanitizeHotkeyString(raw: string | null | undefined, fallback: string): string {
  const chord = parseHotkeyString(raw);
  if (chord) return formatHotkeyString(chord);
  return fallback;
}

export function formatHotkeyString(chord: HotkeyChord): string {
  const parts: string[] = [];
  if (chord.ctrl) parts.push('Ctrl');
  if (chord.alt) parts.push('Alt');
  if (chord.shift) parts.push('Shift');
  if (chord.meta) parts.push('Win');
  parts.push(chord.key);
  return parts.join('+');
}

export function formatHotkeyParts(raw: string): string[] {
  const chord = parseHotkeyString(raw);
  if (!chord) return [raw];
  const parts: string[] = [];
  if (chord.ctrl) parts.push('Ctrl');
  if (chord.alt) parts.push('Alt');
  if (chord.shift) parts.push('Shift');
  if (chord.meta) parts.push('Win');
  parts.push(chord.key);
  return parts;
}

export function hotkeyFromKeyboardEvent(e: KeyboardEvent): string | null {
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return null;
  const key = eventKeyToken(e);
  if (!key) return null;
  return formatHotkeyString({
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey,
    key
  });
}

export function matchesHotkeyEvent(e: KeyboardEvent, hotkey: string): boolean {
  const chord = parseHotkeyString(hotkey);
  if (!chord) return false;
  const key = eventKeyToken(e);
  if (!key) return false;
  return (
    !!e.ctrlKey === chord.ctrl &&
    !!e.altKey === chord.alt &&
    !!e.shiftKey === chord.shift &&
    !!e.metaKey === chord.meta &&
    key.toUpperCase() === chord.key.toUpperCase()
  );
}

/** Electron globalShortcut accelerator (cross-platform). */
export function hotkeyToElectronAccelerator(hotkey: string, fallback = DEFAULT_HOTKEY_REGION_CAPTURE): string {
  const chord = parseHotkeyString(hotkey) ?? parseHotkeyString(fallback);
  if (!chord) return fallback.replace(/Ctrl/g, 'CommandOrControl');
  const parts: string[] = [];
  if (chord.ctrl) parts.push('CommandOrControl');
  if (chord.alt) parts.push('Alt');
  if (chord.shift) parts.push('Shift');
  if (chord.meta) parts.push('Super');
  parts.push(chord.key.length === 1 ? chord.key.toUpperCase() : chord.key);
  return parts.join('+');
}

export function hotkeysAreEqual(a: string, b: string): boolean {
  const ca = parseHotkeyString(a);
  const cb = parseHotkeyString(b);
  if (!ca || !cb) return false;
  return (
    ca.ctrl === cb.ctrl &&
    ca.alt === cb.alt &&
    ca.shift === cb.shift &&
    ca.meta === cb.meta &&
    ca.key.toUpperCase() === cb.key.toUpperCase()
  );
}
