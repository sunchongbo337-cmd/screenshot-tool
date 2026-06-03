const STYLE_ID = '__sshot_toolbar_preserve';

/** Keep js-web-screen-shot toolbar visible; only cursor overrides (no container sizing). */
export function applyCaptureToolbarPreserveStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
#toolPanel,
#optionIcoController,
#optionPanel,
#cutBoxSizePanel {
  z-index: 2147483647 !important;
  visibility: visible !important;
  pointer-events: auto !important;
}
body.no-cursor #toolPanel,
body.no-cursor #toolPanel *,
body.no-cursor #optionIcoController,
body.no-cursor #optionIcoController *,
body.no-cursor #optionPanel,
body.no-cursor #optionPanel *,
body.no-cursor #cutBoxSizePanel {
  cursor: default !important;
}
`;
  document.documentElement.appendChild(el);
}

export function removeCaptureToolbarPreserveStyles(): void {
  document.getElementById(STYLE_ID)?.remove();
}
