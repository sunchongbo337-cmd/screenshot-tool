import {
  beginCaptureFromUserGesture,
  beginCaptureWithStreamId,
  registerCaptureRuntime
} from './capture-core.js';

const isExtensionCapturePage =
  location.protocol === 'chrome-extension:' && /\/capture\.html$/i.test(location.pathname);

const PENDING_STREAM_KEY = 'sshotPendingStreamId';

async function tryConsumePendingStreamId() {
  try {
    const data = await chrome.storage.session.get(PENDING_STREAM_KEY);
    const streamId = data?.[PENDING_STREAM_KEY];
    if (typeof streamId === 'string' && streamId) {
      await chrome.storage.session.remove(PENDING_STREAM_KEY);
      beginCaptureWithStreamId(streamId);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

function updateCapturePageHint(params: URLSearchParams) {
  const hint = document.getElementById('sshot-hint');
  if (!hint) return;

  const reason = params.get('reason');
  if (reason === 'restricted') {
    hint.textContent =
      '当前是浏览器内置页（新标签 / 搜索页），无法在原页截图。请点下方按钮，在共享窗口中选择「窗口」「整个屏幕」或要截的标签页。';
    return;
  }
  if (reason === 'picker-cancelled') {
    hint.textContent = '未选择共享内容。请点下方按钮，重新选择「Chrome 标签页」「窗口」或「整个屏幕」。';
    return;
  }
  hint.textContent =
    '请点下方按钮，在共享窗口中选择「Chrome 标签页」「窗口」或「整个屏幕」，然后开始区域截图。';
}

if (window === window.top) {
  registerCaptureRuntime();

  if (isExtensionCapturePage) {
    const params = new URLSearchParams(location.search);

    const bindStartButton = () => {
      document.getElementById('sshot-start-btn')?.addEventListener('click', () => {
        beginCaptureFromUserGesture();
      });
    };

    const bootCapturePage = async () => {
      updateCapturePageHint(params);
      bindStartButton();
      if (await tryConsumePendingStreamId()) return;
      if (params.get('autostart') === '1') {
        beginCaptureFromUserGesture();
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        void bootCapturePage();
      });
    } else {
      void bootCapturePage();
    }
  }
}
