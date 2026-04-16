# ScreenShot Extension (Chrome/Edge MV3)

## Load extension

1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable Developer mode
3. Click "Load unpacked"
4. Select this folder: `apps/extension`

## Quick verification

1. Open any normal webpage (`http/https`, not `chrome://` / `edge://` store pages)
2. Click extension toolbar icon once
3. Browser may ask you to choose shared screen/window/tab (first time)
4. After selection, page should show dim overlay and selection box UI

## Shortcut

1. Open `chrome://extensions/shortcuts`
2. Find `ScreenShot (Ctrl+Shift+A)` -> command `Capture screen (show selection overlay)`
3. Set to `Ctrl+Shift+A` (or change manually to your preferred key)
4. If available, set to "Global"

## Known limitations

- On restricted pages (`chrome://*`, extension store, internal pages), content scripts cannot run.
- Browser screen-share picker cannot be bypassed for first-time capture.
- "Global" shortcut availability depends on browser/OS policy and conflicts with other apps.

