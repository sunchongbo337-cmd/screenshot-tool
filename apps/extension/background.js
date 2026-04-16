const OFFSCREEN_URL = chrome.runtime.getURL("offscreen.html");

let captureTarget = { tabId: null, windowId: null };

async function ensureOffscreen() {
  // Chrome/Edge MV3 offscreen document
  const has = await chrome.offscreen.hasDocument?.();
  if (has) return;
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: ["USER_MEDIA", "DISPLAY_MEDIA"],
    justification: "Capture screen frames for Alt+A screenshot."
  });
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab ?? null;
}

async function sendToTab(tabId, payload) {
  try {
    await chrome.tabs.sendMessage(tabId, payload);
    return true;
  } catch {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      });
      await chrome.tabs.sendMessage(tabId, payload);
      return true;
    } catch (e) {
      console.warn("sendToTab failed", e);
      return false;
    }
  }
}

async function triggerCapture() {
  const tab = await getActiveTab();
  captureTarget = { tabId: tab?.id ?? null, windowId: tab?.windowId ?? null };

  // If the browser window is covered by other apps, bring it to front
  // so injected overlay can be interacted with.
  try {
    if (captureTarget.windowId != null) await chrome.windows.update(captureTarget.windowId, { focused: true });
    if (captureTarget.tabId != null) await chrome.tabs.update(captureTarget.tabId, { active: true });
  } catch {}

  // Prefer capture inside the page context (more compatible with some browsers like 360).
  if (tab?.id) {
    const ok = await sendToTab(tab.id, { type: "CAPTURE_REQUEST" });
    if (ok) return;
  }

  // Fallback to offscreen capture.
  await ensureOffscreen();
  chrome.runtime.sendMessage({ type: "OFFSCREEN_CAPTURE_REQUEST" });
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "capture") return;
  try {
    await triggerCapture();
  } catch (e) {
    console.warn("Failed to start capture", e);
    const tab = await getActiveTab();
    if (tab?.id) await sendToTab(tab.id, { type: "SCREENSHOT_ERROR", message: String(e?.message ?? e) });
  }
});

chrome.action.onClicked.addListener(async () => {
  try {
    await triggerCapture();
  } catch (e) {
    console.warn("Action trigger failed", e);
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
  if (msg?.type === "OFFSCREEN_CAPTURE_RESULT") {
    (async () => {
      const tabId = captureTarget?.tabId ?? (await getActiveTab())?.id;
      if (!tabId) return;
      await sendToTab(tabId, { type: "SCREENSHOT_FRAME", dataUrl: msg.dataUrl });
    })();
    return;
  }
  if (msg?.type === "OFFSCREEN_CAPTURE_ERROR") {
    (async () => {
      const tabId = captureTarget?.tabId ?? (await getActiveTab())?.id;
      if (!tabId) return;
      await sendToTab(tabId, {
        type: "SCREENSHOT_ERROR",
        message: msg.message ?? "capture failed",
        name: msg.name,
        source: msg.source ?? "offscreen"
      });
    })();
    return;
  }

  // Forward errors from content-script captures back to the tab.
  if (msg?.type === "SCREENSHOT_ERROR") {
    (async () => {
      const tabId = captureTarget?.tabId ?? (await getActiveTab())?.id;
      if (!tabId) return;
      await sendToTab(tabId, {
        type: "SCREENSHOT_ERROR",
        message: msg.message ?? "capture failed",
        name: msg.name,
        source: msg.source
      });
    })();
    return;
  }
});

