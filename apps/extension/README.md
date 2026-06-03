# ScreenShot 浏览器扩展

在任意 **http(s) 网页** 上按 **Alt+Shift+A** 区域截图（选屏 → 绿框 → 工具栏 → 剪贴板），**不需要**打开网页 demo（`localhost:5185`）。

| 环境 | 快捷键 | 截图后 |
|------|--------|--------|
| **本扩展** | Alt+Shift+A | 复制到剪贴板 |
| **网页 demo** | Alt+Shift+A | 进入编辑器工作区 |
| **桌面端** | Alt+A | 进入桌面编辑器 |

---

## 一、首次安装（开发者模式）

### 步骤 1：构建扩展脚本

在仓库根目录或扩展目录执行：

```bash
cd e:\ScreenShot\apps\extension
npm run build
```

成功时应看到类似：

```text
✓ built in …ms
./content.js  … kB
```

确认 `apps/extension` 目录下存在：

- `manifest.json`
- `background.js`
- `capture.html`（新标签页等受限页面的回退页）
- `content.js`（由构建生成，约 500KB+）

> 黄色提示 `build.outDir must not be the same directory…` 可忽略，不影响使用。

### 步骤 2：在 Chrome / Edge 中加载扩展

1. 打开 `chrome://extensions`（Edge 用 `edge://extensions`）
2. 右上角打开 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择文件夹：`e:\ScreenShot\apps\extension`（不要选整个 `ScreenShot` 根目录）
5. 列表中应出现 **ScreenShot (Alt+Shift+A)**，版本 **0.1.6+**，且无红色「无法加载」错误

若提示 **无法加载此扩展**：检查 `manifest.json` 是否合法；重新 `git pull` 或确认未手动加入非法的 `exclude_matches`（如 `chrome://*/*`）。

### 步骤 3：设置快捷键

1. 打开 `chrome://extensions/shortcuts`（Edge：`edge://extensions/shortcuts`）
2. 找到 **ScreenShot (Alt+Shift+A)**
3. 将「Region screenshot」设为 **Alt+Shift+A**（若与别的扩展冲突，可改成其他组合）

### 步骤 4：验证是否加载成功

1. 打开任意普通网站，例如 `https://www.baidu.com`
2. 按 **Alt+Shift+A**（或点击工具栏上的扩展图标）
3. 应弹出 **选择要共享的内容**（标签页 / 窗口 / 屏幕）
4. 确认后：出现半透明遮罩 + **绿框**，可拖动选区，底部有截图工具栏
5. 点 **√** 后，到画图 / Word / 聊天里 **粘贴**，应有正常图片（非空白）

---

## 二、日常使用

1. 按 **Alt+Shift+A** 或点扩展图标 → 打开扩展 **截图页**（`capture.html`）
2. 点击 **「选择共享并开始截图」**
3. 在系统对话框中选择：
   - **Chrome 标签页**：共享某个网页标签
   - **窗口**：共享某个应用窗口
   - **整个屏幕**：共享整块显示器
4. 拖动绿框选定区域，用工具栏标注（可选）
5. 点 **√** 完成 → 图片已写入剪贴板（页面底部提示「已复制到剪贴板」）

---

## 三、修改代码后更新扩展

1. 修改 `apps/extension/src/` 下源码
2. 重新构建：

   ```bash
   cd e:\ScreenShot\apps\extension
   npm run build
   ```

3. 打开 `chrome://extensions`
4. 找到 ScreenShot → 点击 **重新加载**（↻）
5. **关闭**之前打开的标签页再新开，或刷新当前页后重试快捷键

---

## 四、与网页 demo 的关系

- **未安装扩展**：在 `npm run dev:web` 页面按 Alt+Shift+A，截图进网页编辑器。
- **已安装扩展**：快捷键通常由扩展接管，在普通网站上截图为 **剪贴板**；若要进网页编辑器，可暂时禁用扩展，或从 demo 里「选择图片」导入。

---

## 五、常见问题

| 现象 | 处理 |
|------|------|
| **无法加载此扩展** | 确认加载的是 `apps/extension` 文件夹；`manifest.json` 中不要有非法 `exclude_matches` |
| 按快捷键没反应 | 检查 `chrome://extensions/shortcuts` 是否已绑定；刷新当前网页 |
| 只能选屏、没有绿框 | 重新 `npm run build` 并重新加载扩展（需 0.1.4+） |
| 点 √ 后是空白图 | 换共享「窗口」或「整个屏幕」试；或换「Chrome 标签页」并确保该标签内容已加载完 |
| 扩展图标显示红色 **!** | 回退页也未能启动；点 capture 页上的「开始区域截图」或换普通 https 页面 |
| 选屏后画面比例偏大/对不齐 | 0.1.7+ 使用视口尺寸 + `imgAutoFit`；仍异常时可拖一下绿框或换共享「Chrome 标签页」 |
| 新标签页 / 搜索页没反应 | 0.1.8+ 会先弹出**共享选择**（`desktopCapture`），再进框选；若未弹出，点扩展图标或 capture 页按钮 |
| 内置页只能截窗口/整屏 | 浏览器禁止在内置页注入脚本，无法像 b站 那样直接截当前 DOM，只能选「窗口 / 屏幕 / 标签页」 |
| `npm` 显示版本 0.1.0 | 以 `manifest.json` 里的版本为准，与 `package.json` 无关 |

---

## 六、从仓库根目录构建（可选）

```bash
cd e:\ScreenShot
npm install
npm run build:extension
```

效果与进入 `apps/extension` 执行 `npm run build` 相同。
