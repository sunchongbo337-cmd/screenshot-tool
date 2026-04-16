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
  function recognize(image: string, lang?: string): Promise<RecognizeResult>;
  const defaultExport: { recognize: typeof recognize };
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
      saveFile(params: { dataUrl: string; format: 'png' | 'jpeg' | 'webp' }): Promise<any>;
      copyClipboard(params: { dataUrl: string }): Promise<any>;
      openImageFile(): Promise<{ ok: true; dataUrl: string } | { ok: false }>;
      auth: {
        getSession(): Promise<any>;
        login(config: { issuer: string; clientId: string; scopes: string[]; audience?: string }): Promise<any>;
        logout(): Promise<any>;
      };
    };
  }
}

