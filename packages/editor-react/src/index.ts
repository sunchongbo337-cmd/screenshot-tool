export * from './widget/EditorWidget.js';
export type { CropShapeKind, CropOptions, CropSelection } from './widget/crop-utils.js';
export {
  ANNOTATION_TEMPLATE_STORAGE_PREFIX,
  annotationTemplateStorageKey,
  buildDefaultTemplateName,
  buildSequentialTemplateNamePattern,
  guessTemplatePrefixForSequence,
  DEFAULT_TEMPLATE_NAME_PATTERN,
  DEFAULT_TEMPLATE_NEXT_NUMBER,
  hasSavedAnnotationTemplate,
  loadSavedAnnotationTemplate,
  listSavedAnnotationTemplateKeys,
  loadDefaultTemplatePrefs,
  parseSequentialTemplateNamePrefix,
  registerAnnotationTemplatePlaceholder,
  renameSavedAnnotationTemplate,
  saveDefaultTemplatePrefs,
  templateNamePatternUsesSequence
} from './widget/template-storage.js';
export type { AnnotationTemplateV1, RenameAnnotationTemplateResult } from './widget/template-storage.js';
export { TemplatePreviewDialog } from './settings/TemplatePreviewDialog.js';
export type { TemplatePreviewDialogProps } from './settings/TemplatePreviewDialog.js';
export * from './widget/types.js';
export {
  CAPTURE_PREFS_DEFAULTS,
  CAPTURE_PREFS_STORAGE_KEY,
  AUTOSAVE_PREFS_STORAGE_KEY,
  EditorSettingsDialog,
  loadAllCapturePrefsFromLocal,
  loadAutosavePrefsFromLocal,
  mergeCapturePrefsSources,
  mergeCapturePrefsWithLocalAutosave,
  normalizeCapturePrefsState,
  previewSaveFilename,
  saveAllCapturePrefsToLocal,
  saveAutosavePrefsToLocal,
  saveFilenamePatternUsesSequence
} from './settings/EditorSettingsDialog.js';
export type { CapturePrefsState, AutosavePrefsSlice, EditorSettingsDialogProps } from './settings/EditorSettingsDialog.js';
export { TextStyleControls } from './text/TextStyleControls.js';
export type { TextStyleControlsProps, TextStylePatch } from './text/TextStyleControls.js';
export { getTextFontCommon, getTextFontSelectGroups, getTextFontsFlat } from './text/text-fonts.js';
export type { TextFontEntry, TextFontSelectGroup } from './text/text-fonts.js';
export { canvasFontString, isTextBold, konvaFontStyle, konvaTextDecoration } from './text/text-style.js';
export type { TextAlignOption, TextStyleUi } from './text/text-style.js';
export {
  collectTextBboxesFromTesseract,
  offsetDetectedRects,
  preprocessOcrDataUrl,
  recognizeTextRegions,
  scaleRectsToDocument,
  TESSERACT_OCR_OPTIONS,
  TESSERACT_OCR_PSM_MODES
} from './text/ocr-detect.js';
export type { CollectTextBboxesOptions, OcrBBox, OcrDetectGroupMode, OcrDetectRect, OcrInputSlice, OcrRecognizeConfig, RecognizeTextRegionsOptions, TesseractModuleLike } from './text/ocr-detect.js';
export {
  JsWebScreenShotCancelledError,
  JsWebScreenShotClosedError,
  JS_WEB_SCREEN_SHOT_GREEN_BORDER,
  buildDisplayMediaCaptureConfig,
  buildInjectedStreamCaptureConfig,
  buildStaticImageCaptureConfig,
  pickRenderForDisplayStream,
  resolveInjectedStreamCanvasLayout,
  waitForDisplayStreamReady,
  buildWebRtcOverlayOptions,
  normalizeJsWebScreenShotBase64,
  resolveJsWebScreenShotPluginCtor,
  startJsWebScreenShotCapture
} from './capture/js-web-screen-shot.js';
export type { JsWebScreenShotStartOptions, JsWebScreenShotDesktopBridge } from './capture/js-web-screen-shot.js';
export {
  installWebRegionCaptureHotkey,
  startWebRegionCapture,
  startWebRegionCaptureFromGesture
} from './capture/web-region-capture.js';
export type { WebRegionCaptureHotkeyOptions } from './capture/web-region-capture.js';
export {
  cloneWorkspaceSnapshot,
  compositeQueueItem,
  createPastedLayer,
  createQueueItem,
  createWorkspaceHistoryStore,
  loadImageDimensions,
  ResizeImageDialog,
  resizeImageDataUrl,
  WORKSPACE_ZOOM_PRESETS,
  WorkspaceArrowNav,
  WorkspacePasteLayerAdjust,
  WorkspaceTabStrip,
  WorkspaceToolbar,
  WorkspaceViewer
} from './workspace/index.js';
export type {
  CompositeResult,
  PasteLayerAdjustResult,
  PastedLayer,
  QueueItem,
  ResizeImageDialogProps,
  ViewMode,
  WorkspaceArrowNavProps,
  WorkspacePasteLayerAdjustProps,
  WorkspaceSnapshot,
  WorkspaceToolbarProps,
  WorkspaceViewerProps
} from './workspace/index.js';
export { captureScreenByMediaDevices } from './capture/native-screen-capture.js';
export { HotkeyRecorder, HotkeyRecorderGroup } from './hotkeys/HotkeyRecorder.js';
export type { HotkeyRecorderProps } from './hotkeys/HotkeyRecorder.js';
export {
  DEFAULT_HOTKEY_BROWSER_SCREEN_CAPTURE,
  DEFAULT_HOTKEY_JS_WEB_SCREEN_SHOT,
  DEFAULT_HOTKEY_REGION_CAPTURE,
  DEFAULT_HOTKEY_WEB_REGION_CAPTURE,
  formatHotkeyParts,
  formatHotkeyString,
  hotkeyFromKeyboardEvent,
  hotkeyToElectronAccelerator,
  hotkeysAreEqual,
  eventKeyToken,
  matchesHotkeyEvent,
  parseHotkeyString,
  sanitizeHotkeyString
} from '@screenshot/editor-core';
export type { HotkeyChord } from '@screenshot/editor-core';

