/** localStorage key prefix for {@link AnnotationTemplateV1} blobs. */
export const ANNOTATION_TEMPLATE_STORAGE_PREFIX = 'screenshot_template_v1:';

export const DEFAULT_TEMPLATE_NAME_PATTERN_KEY = 'screenshot.defaultTemplateNamePattern';
export const DEFAULT_TEMPLATE_NEXT_NUMBER_KEY = 'screenshot.defaultTemplateNextNumber';

export const DEFAULT_TEMPLATE_NAME_PATTERN = 'hospital_record_v1';
export const DEFAULT_TEMPLATE_NEXT_NUMBER = 1;

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

/** Infer a reasonable sequence prefix from a fixed template name (e.g. hospital_record_v1 → hospital_record). */
export function guessTemplatePrefixForSequence(pattern: string): string {
  const t = (pattern || '').trim();
  if (!t) return 'hospital_record';
  if (templateNamePatternUsesSequence(t)) return parseSequentialTemplateNamePrefix(t);
  const versioned = t.match(/^(.*)_v\d+$/i);
  if (versioned?.[1]?.trim()) return versioned[1].trim();
  return t;
}

export function buildDefaultTemplateName(pattern: string, seqNumber = 1): string {
  const seq = Math.max(1, Math.floor(seqNumber));
  let base = (pattern || DEFAULT_TEMPLATE_NAME_PATTERN).trim() || DEFAULT_TEMPLATE_NAME_PATTERN;
  base = base.replace(/\{n\}/g, String(seq)).replace(/\{seq\}/g, String(seq));
  base = base.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/\s+/g, '_').trim();
  return base || `template${seq}`;
}

export function loadDefaultTemplatePrefs(): { pattern: string; nextNumber: number } {
  try {
    const pattern = window.localStorage.getItem(DEFAULT_TEMPLATE_NAME_PATTERN_KEY);
    const rawN = window.localStorage.getItem(DEFAULT_TEMPLATE_NEXT_NUMBER_KEY);
    const n = rawN ? Number(rawN) : DEFAULT_TEMPLATE_NEXT_NUMBER;
    return {
      pattern: pattern && pattern.trim() ? pattern.trim() : DEFAULT_TEMPLATE_NAME_PATTERN,
      nextNumber: Number.isFinite(n) && n >= 1 ? Math.floor(n) : DEFAULT_TEMPLATE_NEXT_NUMBER
    };
  } catch {
    return { pattern: DEFAULT_TEMPLATE_NAME_PATTERN, nextNumber: DEFAULT_TEMPLATE_NEXT_NUMBER };
  }
}

export function saveDefaultTemplatePrefs(partial: { pattern?: string; nextNumber?: number }): void {
  try {
    if (partial.pattern != null) {
      const p = partial.pattern.trim() || DEFAULT_TEMPLATE_NAME_PATTERN;
      window.localStorage.setItem(DEFAULT_TEMPLATE_NAME_PATTERN_KEY, p);
    }
    if (partial.nextNumber != null) {
      const n = Math.max(1, Math.min(999_999, Math.floor(partial.nextNumber)));
      window.localStorage.setItem(DEFAULT_TEMPLATE_NEXT_NUMBER_KEY, String(n));
    }
  } catch {
    // ignore
  }
}

export function annotationTemplateStorageKey(userKey: string): string {
  return `${ANNOTATION_TEMPLATE_STORAGE_PREFIX}${userKey}`;
}

function isValidTemplateBlob(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as { version?: number; base?: { width?: number; height?: number }; nodes?: unknown };
    return (
      !!parsed &&
      parsed.version === 1 &&
      !!parsed.base &&
      typeof parsed.base.width === 'number' &&
      typeof parsed.base.height === 'number' &&
      Array.isArray(parsed.nodes)
    );
  } catch {
    return false;
  }
}

/** All user template names that have been saved at least once (sorted). */
export function listSavedAnnotationTemplateKeys(): string[] {
  const names: string[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const fullKey = window.localStorage.key(i);
      if (!fullKey?.startsWith(ANNOTATION_TEMPLATE_STORAGE_PREFIX)) continue;
      const name = fullKey.slice(ANNOTATION_TEMPLATE_STORAGE_PREFIX.length).trim();
      if (!name) continue;
      const raw = window.localStorage.getItem(fullKey);
      if (!raw || !isValidTemplateBlob(raw)) continue;
      names.push(name);
    }
  } catch {
    // ignore quota / privacy errors
  }
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

/** Ensure a template name appears in {@link listSavedAnnotationTemplateKeys} (empty placeholder until editor saves). */
export function registerAnnotationTemplatePlaceholder(userKey: string): void {
  const name = userKey.trim();
  if (!name || hasSavedAnnotationTemplate(name)) return;
  try {
    window.localStorage.setItem(
      annotationTemplateStorageKey(name),
      JSON.stringify({ version: 1, base: { width: 1, height: 1 }, nodes: [] })
    );
  } catch {
    // ignore quota / privacy errors
  }
}

export type AnnotationTemplateV1 = {
  version: 1;
  base: { width: number; height: number };
  nodes: unknown[];
};

export function loadSavedAnnotationTemplate(userKey: string): AnnotationTemplateV1 | null {
  const name = userKey.trim();
  if (!name) return null;
  try {
    const raw = window.localStorage.getItem(annotationTemplateStorageKey(name));
    if (!raw || !isValidTemplateBlob(raw)) return null;
    return JSON.parse(raw) as AnnotationTemplateV1;
  } catch {
    return null;
  }
}

export function hasSavedAnnotationTemplate(userKey: string): boolean {
  const name = userKey.trim();
  if (!name) return false;
  try {
    const raw = window.localStorage.getItem(annotationTemplateStorageKey(name));
    return !!raw && isValidTemplateBlob(raw);
  } catch {
    return false;
  }
}

export type RenameAnnotationTemplateResult = 'ok' | 'empty' | 'same' | 'not_found' | 'exists';

/** Rename a saved template blob; returns status without throwing. */
export function renameSavedAnnotationTemplate(fromKey: string, toKey: string): RenameAnnotationTemplateResult {
  const from = fromKey.trim();
  const to = toKey.trim();
  if (!to) return 'empty';
  if (from === to) return 'same';
  try {
    const oldStorage = annotationTemplateStorageKey(from);
    const newStorage = annotationTemplateStorageKey(to);
    const raw = window.localStorage.getItem(oldStorage);
    if (!raw || !isValidTemplateBlob(raw)) return 'not_found';
    const existing = window.localStorage.getItem(newStorage);
    if (existing && isValidTemplateBlob(existing)) return 'exists';
    window.localStorage.setItem(newStorage, raw);
    window.localStorage.removeItem(oldStorage);
    return 'ok';
  } catch {
    return 'not_found';
  }
}
