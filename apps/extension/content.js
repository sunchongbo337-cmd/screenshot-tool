let root = null;
let bg = null;
let selectionEl = null;
let toolbar = null;
let hint = null;

let img = null;
let imgW = 0;
let imgH = 0;

let dragging = false;
let start = null;
let end = null;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function rectFromPoints(a, b) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
}

async function ensureCss() {
  const href = chrome.runtime.getURL("overlay.css");
  if (document.querySelector(`link[data-sshot-css="1"][href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.sshotCss = "1";
  document.documentElement.appendChild(link);
}

function cleanup() {
  if (root) root.remove();
  root = null;
  bg = null;
  selectionEl = null;
  toolbar = null;
  hint = null;
  dragging = false;
  start = null;
  end = null;
}

function render() {
  if (!root || !selectionEl || !toolbar || !hint) return;
  if (!start || !end) {
    selectionEl.style.display = "none";
    toolbar.style.display = "none";
    hint.textContent = "按住左键拖拽选择区域，按 Esc 取消";
    return;
  }
  const r = rectFromPoints(start, end);
  if (r.w < 4 || r.h < 4) {
    selectionEl.style.display = "none";
    toolbar.style.display = "none";
    hint.textContent = "按住左键拖拽选择区域，按 Esc 取消";
    return;
  }
  selectionEl.style.display = "block";
  selectionEl.style.left = `${r.x}px`;
  selectionEl.style.top = `${r.y}px`;
  selectionEl.style.width = `${r.w}px`;
  selectionEl.style.height = `${r.h}px`;

  toolbar.style.display = "flex";
  const hostW = window.innerWidth;
  const hostH = window.innerHeight;
  const left = clamp(r.x + r.w - 240, 12, hostW - 260);
  const top = clamp(r.y + r.h + 10, 12, hostH - 56);
  toolbar.style.left = `${left}px`;
  toolbar.style.top = `${top}px`;

  hint.textContent = "拖拽已完成。点“确定”导出，Esc 取消。";
}

async function copyOrDownload(dataUrl) {
  // Clipboard is best-effort; may require HTTPS / user gesture.
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    if (navigator.clipboard?.write && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      return { ok: true, method: "clipboard" };
    }
  } catch {}
  try {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `screenshot_${Date.now()}.png`;
    a.click();
    return { ok: true, method: "download" };
  } catch (e) {
    return { ok: false, message: String(e?.message ?? e) };
  }
}

async function confirmCapture() {
  if (!img || !start || !end) return;
  const r = rectFromPoints(start, end);
  if (r.w < 4 || r.h < 4) return;

  // Map CSS pixels -> source pixels
  const sx = imgW / window.innerWidth;
  const sy = imgH / window.innerHeight;
  const srcX = clamp(Math.round(r.x * sx), 0, imgW - 1);
  const srcY = clamp(Math.round(r.y * sy), 0, imgH - 1);
  const srcW = clamp(Math.round(r.w * sx), 1, imgW - srcX);
  const srcH = clamp(Math.round(r.h * sy), 1, imgH - srcY);

  const canvas = document.createElement("canvas");
  canvas.width = srcW;
  canvas.height = srcH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
  const dataUrl = canvas.toDataURL("image/png");
  await copyOrDownload(dataUrl);
  cleanup();
}

async function openOverlayWithFrame(dataUrl) {
  await ensureCss();
  cleanup();

  root = document.createElement("div");
  root.className = "sshot-overlay-root";
  root.tabIndex = -1;

  bg = document.createElement("div");
  bg.className = "sshot-overlay-bg";
  bg.style.backgroundImage = `url(${dataUrl})`;

  const dim = document.createElement("div");
  dim.className = "sshot-overlay-dim";

  selectionEl = document.createElement("div");
  selectionEl.className = "sshot-selection";

  toolbar = document.createElement("div");
  toolbar.className = "sshot-toolbar";
  toolbar.style.display = "none";

  const btnCancel = document.createElement("button");
  btnCancel.className = "sshot-btn";
  btnCancel.textContent = "取消(Esc)";
  btnCancel.addEventListener("click", (e) => {
    e.stopPropagation();
    cleanup();
  });

  const btnOk = document.createElement("button");
  btnOk.className = "sshot-btn sshot-btn-ok";
  btnOk.textContent = "确定";
  btnOk.addEventListener("click", (e) => {
    e.stopPropagation();
    void confirmCapture();
  });

  toolbar.appendChild(btnCancel);
  toolbar.appendChild(btnOk);

  hint = document.createElement("div");
  hint.className = "sshot-hint";
  hint.textContent = "按住左键拖拽选择区域，按 Esc 取消";

  root.appendChild(bg);
  root.appendChild(dim);
  root.appendChild(selectionEl);
  root.appendChild(toolbar);
  root.appendChild(hint);
  document.documentElement.appendChild(root);
  root.focus();

  img = new Image();
  await new Promise((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = dataUrl;
  });
  imgW = img.naturalWidth || 0;
  imgH = img.naturalHeight || 0;

  const onKeyDown = (ev) => {
    if (ev.key === "Escape") {
      ev.preventDefault();
      cleanup();
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      void confirmCapture();
    }
  };

  const onDown = (ev) => {
    if (ev.button !== 0) return;
    // Ignore toolbar clicks
    if (toolbar.contains(ev.target)) return;
    dragging = true;
    start = { x: ev.clientX, y: ev.clientY };
    end = { x: ev.clientX, y: ev.clientY };
    render();
  };
  const onMove = (ev) => {
    if (!dragging) return;
    end = { x: ev.clientX, y: ev.clientY };
    render();
  };
  const onUp = (ev) => {
    if (!dragging) return;
    dragging = false;
    end = { x: ev.clientX, y: ev.clientY };
    render();
  };

  root.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  window.addEventListener("keydown", onKeyDown, true);

  const oldCleanup = cleanup;
  cleanup = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("keydown", onKeyDown, true);
    oldCleanup();
  };
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "SCREENSHOT_FRAME") {
    void openOverlayWithFrame(msg.dataUrl);
  }
  if (msg?.type === "CAPTURE_REQUEST") {
    (async () => {
      try {
        console.log("[sshot] CAPTURE_REQUEST received, starting openOverlayFromCapture()");
        await openOverlayFromCapture();
      } catch (e) {
        const message = String(e?.message ?? e);
        const name = String(e?.name ?? "Error");
        console.warn("[sshot] capture failed in content", { name, message });
        // In some browsers (e.g. 360) getDisplayMedia() in a command/background context
        // fails unless it's triggered from an explicit user click.
        // So we show a prompt button to re-trigger capture with user gesture.
        if (
          /permission denied|notallowederror|not allowed|not\s+allowed|user gesture/i.test(
            `${name} ${message}`
          )
        ) {
          const promptRoot = document.createElement("div");
          promptRoot.style.position = "fixed";
          promptRoot.style.inset = "0";
          promptRoot.style.zIndex = "2147483647";
          promptRoot.style.background = "rgba(0,0,0,0.55)";
          promptRoot.style.display = "grid";
          promptRoot.style.placeItems = "center";
          promptRoot.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif";

          const card = document.createElement("div");
          card.style.width = "420px";
          card.style.maxWidth = "calc(100vw - 24px)";
          card.style.background = "rgba(16,18,25,0.96)";
          card.style.border = "1px solid rgba(255,255,255,0.14)";
          card.style.borderRadius = "14px";
          card.style.padding = "16px";
          card.style.color = "#e7eaf0";
          card.style.boxShadow = "0 30px 80px rgba(0,0,0,0.55)";
          card.innerHTML = `
            <div style="font-size:16px;font-weight:700;margin-bottom:8px;">需要你点击允许屏幕共享</div>
            <div style="font-size:12px;opacity:0.85;line-height:1.4;margin-bottom:14px;white-space:pre-wrap;">
              浏览器拦截：${message}
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;">
              <button style="height:32px;padding:0 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.06);color:#e7eaf0;cursor:pointer;">
                取消
              </button>
              <button style="height:32px;padding:0 14px;border-radius:10px;border:1px solid rgba(38,220,98,0.45);background:rgba(38,220,98,0.92);color:#07160c;font-weight:800;cursor:pointer;">
                点击开始
              </button>
            </div>
          `;

          const buttons = card.querySelectorAll("button");
          const btnCancel = buttons[0];
          const btnStart = buttons[1];

          btnCancel.addEventListener("click", () => {
            promptRoot.remove();
          });

          btnStart.addEventListener("click", async () => {
            promptRoot.remove();
            try {
              await openOverlayFromCapture();
            } catch (e2) {
              const message2 = String(e2?.message ?? e2);
              const name2 = String(e2?.name ?? "Error");
                chrome.runtime.sendMessage({ type: "SCREENSHOT_ERROR", message: message2, name: name2, source: "content" });
            }
          });

          document.documentElement.appendChild(promptRoot);
          return;
        }

        chrome.runtime.sendMessage({ type: "SCREENSHOT_ERROR", message, name, source: "content" });
      }
    })();
  }
  if (msg?.type === "SCREENSHOT_ERROR") {
    const message = msg?.message ?? "";
    const name = msg?.name ?? "";
    console.warn("screenshot error:", msg?.source ?? "unknown", name, message);
    if (
      /permission denied|notallowederror|not allowed|not\s+allowed|user gesture/i.test(
        `${name} ${message}`
      )
    ) {
      showPermissionPrompt(message, name);
    }
  }
});

let pageStream = null;
let pageVideoEl = null;

function showPermissionPrompt(message, name) {
  if (document.getElementById("__sshot_perm_prompt")) return;

  const promptRoot = document.createElement("div");
  promptRoot.id = "__sshot_perm_prompt";
  promptRoot.style.position = "fixed";
  promptRoot.style.inset = "0";
  promptRoot.style.zIndex = "2147483647";
  promptRoot.style.background = "rgba(0,0,0,0.55)";
  promptRoot.style.display = "grid";
  promptRoot.style.placeItems = "center";
  promptRoot.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif";

  const card = document.createElement("div");
  card.style.width = "420px";
  card.style.maxWidth = "calc(100vw - 24px)";
  card.style.background = "rgba(16,18,25,0.96)";
  card.style.border = "1px solid rgba(255,255,255,0.14)";
  card.style.borderRadius = "14px";
  card.style.padding = "16px";
  card.style.color = "#e7eaf0";
  card.style.boxShadow = "0 30px 80px rgba(0,0,0,0.55)";
  card.innerHTML = `
    <div style="font-size:16px;font-weight:700;margin-bottom:8px;">需要你点击允许屏幕共享</div>
    <div style="font-size:12px;opacity:0.85;line-height:1.4;margin-bottom:14px;white-space:pre-wrap;">
      浏览器拦截：${message}
    </div>
    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button style="height:32px;padding:0 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.06);color:#e7eaf0;cursor:pointer;">取消</button>
      <button style="height:32px;padding:0 14px;border-radius:10px;border:1px solid rgba(38,220,98,0.45);background:rgba(38,220,98,0.92);color:#07160c;font-weight:800;cursor:pointer;">点击开始</button>
    </div>
  `;

  const buttons = card.querySelectorAll("button");
  const btnCancel = buttons[0];
  const btnStart = buttons[1];

  btnCancel.addEventListener("click", () => promptRoot.remove());
  btnStart.addEventListener("click", async () => {
    promptRoot.remove();
    try {
      await openOverlayFromCapture();
    } catch (e2) {
      const message2 = String(e2?.message ?? e2);
      const name2 = String(e2?.name ?? "Error");
      chrome.runtime.sendMessage({ type: "SCREENSHOT_ERROR", message: message2, name: name2, source: "content" });
    }
  });

  promptRoot.appendChild(card);
  document.documentElement.appendChild(promptRoot);
}

function clearPageStream() {
  try {
    if (pageVideoEl) {
      pageVideoEl.pause?.();
      pageVideoEl.srcObject = null;
    }
  } catch {}
  try {
    pageStream?.getTracks?.().forEach((t) => t.stop());
  } catch {}
  pageStream = null;
  pageVideoEl = null;
}

function isPageStreamAlive(s) {
  if (!s) return false;
  const tracks = s.getVideoTracks?.() ?? [];
  if (!tracks.length) return false;
  return tracks.some((t) => t.readyState === "live");
}

async function ensurePageStream() {
  if (!isPageStreamAlive(pageStream)) clearPageStream();
  if (pageStream) return pageStream;
  console.log("[sshot] calling navigator.mediaDevices.getDisplayMedia() in content");
  pageStream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: "always" },
    audio: false
  });
  for (const t of pageStream.getVideoTracks?.() ?? []) {
    t.addEventListener("ended", () => {
      clearPageStream();
    });
  }
  return pageStream;
}

async function captureFrameDataUrl() {
  const s = await ensurePageStream();
  const tracks = s.getVideoTracks?.() ?? [];
  const track = tracks[0];
  if (!track || track.readyState !== "live") {
    clearPageStream();
    throw new Error("screen share stopped");
  }
  if (!pageVideoEl || pageVideoEl.srcObject !== s) {
    pageVideoEl = document.createElement("video");
    pageVideoEl.muted = true;
    pageVideoEl.playsInline = true;
    pageVideoEl.srcObject = s;
    await new Promise((resolve) => {
      pageVideoEl.onloadedmetadata = () => resolve();
    });
    await pageVideoEl.play().catch(() => {});
  }
  const w = pageVideoEl.videoWidth || 0;
  const h = pageVideoEl.videoHeight || 0;
  if (!w || !h) throw new Error("invalid video size");
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas ctx");
  ctx.drawImage(pageVideoEl, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

async function openOverlayFromCapture() {
  const dataUrl = await captureFrameDataUrl();
  await openOverlayWithFrame(dataUrl);
}

