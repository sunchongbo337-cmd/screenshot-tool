import React, { useEffect, useState } from 'react';
import { loadSavedAnnotationTemplate } from '../widget/template-storage.js';
import { renderTemplatePreviewDataUrl } from '../widget/template-preview.js';

export type TemplatePreviewDialogProps = {
  open: boolean;
  templateName: string;
  onClose: () => void;
};

export function TemplatePreviewDialog({ open, templateName, onClose }: TemplatePreviewDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ width: number; height: number; count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !templateName.trim()) {
      setPreviewUrl(null);
      setMeta(null);
      setError(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const tpl = loadSavedAnnotationTemplate(templateName);
      if (!tpl) {
        if (!cancelled) {
          setError('未找到该模板或模板为空');
          setPreviewUrl(null);
          setMeta(null);
        }
        return;
      }
      try {
        const url = await renderTemplatePreviewDataUrl(tpl);
        if (cancelled) return;
        setPreviewUrl(url);
        setMeta({ width: tpl.base.width, height: tpl.base.height, count: tpl.nodes.length });
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setPreviewUrl(null);
          setMeta(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, templateName]);

  if (!open) return null;

  return (
    <div className="fscSettingsOverlay" role="dialog" aria-modal="true" aria-label="查看模板">
      <div className="fscSettingsDialog templatePreviewDialog" style={{ width: 'min(520px, 100%)' }}>
        <div className="fscSettingsHeader">
          <strong>模板预览：{templateName}</strong>
        </div>
        <div className="fscSettingsBody templatePreviewBody">
          {error ? <p className="fscSettingsNote">{error}</p> : null}
          {meta ? (
            <p className="fscSettingsNote">
              基准尺寸 {meta.width}×{meta.height} · {meta.count} 个标注
            </p>
          ) : null}
          {previewUrl ? (
            <div className="templatePreviewFrame">
              <img src={previewUrl} alt="" className="templatePreviewImg" />
            </div>
          ) : !error ? (
            <p className="fscSettingsNote">正在生成预览…</p>
          ) : null}
          <p className="fscSettingsNote">预览为标注位置示意（马赛克/箭头/文字），不含实际底图。</p>
        </div>
        <div className="fscSettingsFooter">
          <button type="button" className="fscSettingsBtn primary" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
