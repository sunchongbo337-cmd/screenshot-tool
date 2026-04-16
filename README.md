# ScreenShot Tool (Desktop + Web)

Windows 桌面端（Electron exe）与 Web 端（npm 包 + UMD）共用同一套图片标注编辑器核心，实现“微信截图”风格的打码/文字/箭头与导出。

## Packages

- `packages/editor-core`: 平台无关的编辑器核心（状态/命令栈/导出）
- `packages/editor-react`: React UI（Konva 画布 + 工具栏）
- `packages/web-plugin`: 对外插件（npm + `screenShotPlugin.umd.js`）
- `apps/desktop`: Electron 桌面端（截图/热键/保存/剪贴板）

## Dev

```bash
npm install

# Web plugin demo
npm run dev:web

# Desktop app
npm run dev:desktop
```

