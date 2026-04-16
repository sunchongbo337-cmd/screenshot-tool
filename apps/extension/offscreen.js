let stream = null;
let videoEl = null;

function clearStream() {
  try {
    if (videoEl) {
      videoEl.pause?.();
      videoEl.srcObject = null;
    }
  } catch {}
  try {
    stream?.getTracks?.().forEach((t) => t.stop());
  } catch {}
  stream = null;
  videoEl = null;
}

function isStreamAlive(s) {
  if (!s) return false;
  const tracks = s.getVideoTracks?.() ?? [];
  if (!tracks.length) return false;
  return tracks.some((t) => t.readyState === "live");
}

async function ensureStream() {
  if (!isStreamAlive(stream)) clearStream();
  if (stream) return stream;
  // This will trigger the browser's picker at least once.
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: "always" },
    audio: false
  });
  for (const t of stream.getVideoTracks()) {
    t.addEventListener("ended", () => {
      clearStream();
    });
  }
  return stream;
}

async function captureFrameDataUrl() {
  const s = await ensureStream();
  const track = s.getVideoTracks()[0];
  if (!track || track.readyState !== "live") {
    clearStream();
    throw new Error("screen share stopped");
  }

  if (!videoEl || videoEl.srcObject !== s) {
    videoEl = document.createElement("video");
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.srcObject = s;
    await new Promise((resolve) => {
      videoEl.onloadedmetadata = () => resolve();
    });
    await videoEl.play().catch(() => {});
  }

  const w = videoEl.videoWidth || 0;
  const h = videoEl.videoHeight || 0;
  if (!w || !h) throw new Error("invalid video size");

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas ctx");
  ctx.drawImage(videoEl, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type !== "OFFSCREEN_CAPTURE_REQUEST") return;
  (async () => {
    try {
      const dataUrl = await captureFrameDataUrl();
      chrome.runtime.sendMessage({ type: "OFFSCREEN_CAPTURE_RESULT", dataUrl });
    } catch (e) {
      // If stream is stale, next request will trigger a fresh chooser flow.
      if (/stopped|ended|invalid video size/i.test(String(e?.message ?? e))) clearStream();
      const message = String(e?.message ?? e);
      const name = String(e?.name ?? "Error");
      chrome.runtime.sendMessage({ type: "OFFSCREEN_CAPTURE_ERROR", message, name, source: "offscreen" });
    }
  })();
});

