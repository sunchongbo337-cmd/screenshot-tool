declare module 'tesseract.js' {
  interface Bbox {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }
  interface Word {
    text: string;
    bbox?: Bbox;
  }
  interface RecognizeResult {
    data: { words?: Word[] };
  }
  interface Worker {
    recognize(image: string): Promise<RecognizeResult>;
    setParameters(params: Record<string, string | number>): Promise<void>;
    terminate(): Promise<void>;
  }
  function recognize(image: string, lang?: string): Promise<RecognizeResult>;
  function createWorker(
    langs?: string,
    oem?: number,
    options?: { workerPath?: string; corePath?: string }
  ): Promise<Worker>;
  const defaultExport: { recognize: typeof recognize; createWorker: typeof createWorker };
  export default defaultExport;
}

declare global {
  interface Window {
    desktopApi: {
      getDisplays(): Promise<
        {
          id: number;
          bounds: { x: number; y: number; width: number; height: number };
          size: { width: number; height: number };
          scaleFactor: number;
        }[]
      >;
      captureDisplay(params: { displayId: number }): Promise<{ dataUrl: string }>;
      startCapture(): void;
      completeCapture(dataUrl: string): void;
      cancelCapture(): void;
      onLoadImage(cb: (payload: { dataUrl: string }) => void): () => void;
      onRequireLogin(cb: () => void): () => void;
      setAuthGatePassed(passed: boolean): void;
      getCapturePrefs(): Promise<Record<string, unknown>>;
      setCapturePrefs(partial: Record<string, unknown>): Promise<Record<string, unknown>>;
      onCapturePrefsChanged(cb: (prefs: Record<string, unknown>) => void): () => void;
      completePluginShot(params: { dataUrl: string }): void;
      cancelPluginShot(): void;
      showPluginShotWindow(): void;
      setCaptureShortcutsSuspended(payload: { suspended: boolean }): void;
      pickDefaultSaveFolder(): Promise<{ ok: false } | { ok: true; path: string }>;
      closeEditorWindow(): void;
      saveFile(params: {
        dataUrl: string;
        format: 'png' | 'jpeg' | 'webp';
        auto?: boolean;
        defaultSaveDir?: string;
        saveFilenamePattern?: string;
        saveFilenameNextNumber?: number;
      }): Promise<
        | { saved: false; reason?: string; message?: string }
        | { saved: true; filePath: string; saveFilenameNextNumber?: number }
      >;
      invoke(channel: string, payload?: unknown): Promise<unknown>;
      saveFileAuto(params: {
        dataUrl: string;
        format: 'png' | 'jpeg' | 'webp';
        defaultSaveDir?: string;
        saveFilenamePattern?: string;
        saveFilenameNextNumber?: number;
      }): Promise<
        | { saved: false; reason?: 'no_dir' | 'write_failed'; message?: string }
        | { saved: true; filePath: string; saveFilenameNextNumber?: number }
      >;
      copyClipboard(params: { dataUrl: string }): Promise<{ ok: true }>;
      readClipboardImage(): Promise<{ ok: false } | { ok: true; dataUrl: string }>;
      getScreenCaptureSource(params?: { displayId?: number }): Promise<{
        sourceId: string;
        displayId: number;
        bounds?: { x: number; y: number; width: number; height: number };
        workArea?: { x: number; y: number; width: number; height: number };
        scaleFactor?: number;
      }>;
      getPluginShotWorkAreaSnapshot(): Promise<string | null>;
      openImageFile(): Promise<{ ok: true; dataUrl: string } | { ok: false }>;
      openImageFiles(): Promise<
        | { ok: false; files: [] }
        | { ok: true; files: { name: string; path: string }[] }
      >;
      readImageFile(params: { path: string }): Promise<
        | { ok: false }
        | { ok: true; dataUrl: string; name: string }
      >;
      auth: {
        getSession(): Promise<any>;
        login(config: { issuer: string; clientId: string; scopes: string[]; audience?: string }): Promise<any>;
        logout(): Promise<any>;
      };
    };
  }
}

