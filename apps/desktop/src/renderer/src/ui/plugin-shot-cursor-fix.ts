/** Keep toolbar pointer visible; canvas keeps crosshair. Does not touch capture logic. */
export const PLUGIN_SHOT_CURSOR_FIX_ID = 'plugin-shot-cursor-fix';

export const PLUGIN_SHOT_CURSOR_CSS = `
html.plugin-shot-mode #screenShotContainer {
  cursor: crosshair !important;
}

html.plugin-shot-mode #toolPanel,
html.plugin-shot-mode #toolPanel .item-panel,
html.plugin-shot-mode #optionIcoController,
html.plugin-shot-mode #optionIcoController .ico-panel,
html.plugin-shot-mode #optionPanel,
html.plugin-shot-mode #optionPanel .item-panel,
html.plugin-shot-mode #optionPanel .text-size-panel,
html.plugin-shot-mode #optionPanel .text-item,
html.plugin-shot-mode #optionPanel .brush-select-panel .item-panel,
html.plugin-shot-mode #optionPanel .color-item,
html.plugin-shot-mode #optionPanel .pull-down-arrow,
html.plugin-shot-mode #cutBoxSizePanel,
html.plugin-shot-mode #textInputPanel {
  cursor: pointer !important;
}

html.plugin-shot-mode #textInputPanel[contenteditable="true"] {
  cursor: text !important;
}

html.plugin-shot-mode body.no-cursor #toolPanel,
html.plugin-shot-mode body.no-cursor #toolPanel *,
html.plugin-shot-mode body.no-cursor #optionIcoController,
html.plugin-shot-mode body.no-cursor #optionIcoController *,
html.plugin-shot-mode body.no-cursor #optionPanel,
html.plugin-shot-mode body.no-cursor #optionPanel *,
html.plugin-shot-mode body.no-cursor #cutBoxSizePanel {
  cursor: pointer !important;
}

html.plugin-shot-mode body.no-cursor #textInputPanel {
  cursor: text !important;
}
`;

export function applyPluginShotCursorFix() {
  let el = document.getElementById(PLUGIN_SHOT_CURSOR_FIX_ID);
  if (!el) {
    el = document.createElement('style');
    el.id = PLUGIN_SHOT_CURSOR_FIX_ID;
    document.head.appendChild(el);
  }
  el.textContent = PLUGIN_SHOT_CURSOR_CSS;
  document.head.appendChild(el);
}

export function removePluginShotCursorFix() {
  document.getElementById(PLUGIN_SHOT_CURSOR_FIX_ID)?.remove();
}

/** Re-apply after js-web-screen-shot injects its stylesheet (no MutationObserver). */
export function schedulePluginShotCursorFix() {
  applyPluginShotCursorFix();
  requestAnimationFrame(() => {
    applyPluginShotCursorFix();
    requestAnimationFrame(applyPluginShotCursorFix);
  });
}
