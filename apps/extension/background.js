const CAPTURE_PAGE_BASE = chrome.runtime.getURL('capture.html');
const PENDING_STREAM_KEY = 'sshotPendingStreamId';

function isRestrictedUrl(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('chrome://') ||
    lower.startsWith('chrome-extension://') ||
    lower.startsWith('chrome-search://') ||
    lower.startsWith('edge://') ||
    lower.startsWith('about:') ||
    lower.startsWith('devtools://') ||
    lower.startsWith('view-source:')
  );
}

function isCapturableUrl(url) {
  if (!url || isRestrictedUrl(url)) return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('file://') ||
    lower.startsWith('ftp://')
  );
}

async function setBadge(text, color) {
  try {
    await chrome.action.setBadgeText({ text });
    if (color) await chrome.action.setBadgeBackgroundColor({ color });
  } catch {
    // ignore
  }
}

function waitTabComplete(tabId, timeoutMs = 12000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(onUpdated);
      resolve(false);
    }, timeoutMs);

    const onUpdated = (updatedId, info) => {
      if (updatedId !== tabId) return;
      if (info.status === 'complete') {
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(onUpdated);
        resolve(true);
      }
    };

    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.get(tabId).then((tab) => {
      if (tab?.status === 'complete') {
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(onUpdated);
        resolve(true);
      }
    });
  });
}

async function pingTab(tabId) {
  try {
    const resp = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    return resp?.ok === true;
  } catch {
    return false;
  }
}

async function ensureContentScript(tabId) {
  if (await pingTab(tabId)) return true;
  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      files: ['content.js']
    });
    return await pingTab(tabId);
  } catch (e) {
    console.warn('[sshot] inject content.js failed', e);
    return false;
  }
}

async function sendCaptureMessage(tabId, payload) {
  try {
    const resp = await chrome.tabs.sendMessage(tabId, payload);
    return resp?.ok === true;
  } catch {
    return false;
  }
}

async function startCaptureOnTab(tabId, options = {}) {
  if (!(await ensureContentScript(tabId))) return false;

  if (options.streamId) {
    if (await sendCaptureMessage(tabId, { type: 'CAPTURE_STREAM_ID', streamId: options.streamId })) {
      return true;
    }
  }

  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      world: 'ISOLATED',
      func: (streamId) => {
        if (streamId && typeof globalThis.__sshotStartCaptureWithStreamId === 'function') {
          globalThis.__sshotStartCaptureWithStreamId(streamId);
          return 'stream-started';
        }
        const start = globalThis.__sshotStartCapture;
        if (typeof start !== 'function') return 'missing';
        start();
        return 'started';
      },
      args: [options.streamId ?? null]
    });
    const status = result?.result;
    if (status === 'started' || status === 'stream-started') return true;
    console.warn('[sshot] capture hook not ready:', status);
  } catch (e) {
    console.warn('[sshot] executeScript (ISOLATED) failed', e);
  }

  if (options.streamId) {
    return sendCaptureMessage(tabId, { type: 'CAPTURE_STREAM_ID', streamId: options.streamId });
  }

  return sendCaptureMessage(tabId, { type: 'CAPTURE_REQUEST' });
}

async function ensureCaptureTab({ activate = true, reason = 'restricted' } = {}) {
  const url = `${CAPTURE_PAGE_BASE}?reason=${encodeURIComponent(reason)}`;
  const existing = await chrome.tabs.query({ url: `${CAPTURE_PAGE_BASE}*` });
  let tabId;

  if (existing[0]?.id) {
    tabId = existing[0].id;
    await chrome.tabs.update(tabId, { url, active: activate });
  } else {
    const created = await chrome.tabs.create({ url, active: activate });
    tabId = created.id;
  }

  if (!tabId) return null;
  await waitTabComplete(tabId);
  return tabId;
}

async function storePendingStreamId(streamId) {
  try {
    await chrome.storage.session.set({ [PENDING_STREAM_KEY]: streamId });
  } catch {
    // ignore
  }
}

async function openExtensionCapturePageFallback(reason = 'restricted') {
  const tabId = await ensureCaptureTab({ activate: true, reason });
  if (!tabId) return false;
  return startCaptureOnTab(tabId);
}

function chooseDesktopStream(tab) {
  return new Promise((resolve) => {
    if (!chrome.desktopCapture?.chooseDesktopMedia) {
      resolve(null);
      return;
    }
    try {
      chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab'], tab, (streamId) => {
        if (chrome.runtime.lastError) {
          console.warn('[sshot] desktopCapture error', chrome.runtime.lastError.message);
          resolve(null);
          return;
        }
        resolve(streamId || null);
      });
    } catch (e) {
      console.warn('[sshot] desktopCapture threw', e);
      resolve(null);
    }
  });
}

/** Open extension capture hub (capture.html) — user picks share target from the page button. */
async function openCaptureHub(reason = 'hub') {
  const tabId = await ensureCaptureTab({ activate: true, reason });
  if (!tabId) return false;
  return ensureContentScript(tabId);
}

function triggerCapture() {
  void setBadge('', undefined);
  void openCaptureHub('hub').then((ok) => {
    if (!ok) void setBadge('!', '#b42828');
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'capture') return;
  triggerCapture();
});

chrome.action.onClicked.addListener(() => {
  triggerCapture();
});

function dataUrlToBlob(dataUrl) {
  const raw = String(dataUrl ?? '').trim();
  if (!raw) return null;
  const normalized = raw.startsWith('data:')
    ? raw
    : raw.startsWith('base64,')
      ? `data:image/png;base64,${raw.replace(/^base64,/i, '')}`
      : `data:image/png;base64,${raw}`;
  const comma = normalized.indexOf(',');
  if (comma < 0) return null;
  const b64 = normalized.slice(comma + 1).trim();
  if (!b64) return null;
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: 'image/png' });
  } catch {
    return null;
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'CLIPBOARD_IMAGE') {
    void (async () => {
      try {
        const blob = dataUrlToBlob(msg.dataUrl);
        if (!blob || blob.size < 1024) {
          sendResponse({ ok: false, error: '无效的图片数据' });
          return;
        }
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': Promise.resolve(blob)
          })
        ]);
        sendResponse({ ok: true });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.warn('[sshot] clipboard write failed', message);
        sendResponse({ ok: false, error: message });
      }
    })();
    return true;
  }

  if (msg?.type === 'SCREENSHOT_ERROR') {
    console.warn('[sshot]', msg?.source ?? 'unknown', msg?.name, msg?.message);
    void setBadge('!', '#b42828');
  }
});
