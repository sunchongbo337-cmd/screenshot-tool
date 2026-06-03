import React from 'react';

export const WORKSPACE_ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4] as const;

export type WorkspaceToolbarProps = {
  disabled?: boolean;
  zoom: number;
  settingsOpen?: boolean;
  onOpen: () => void;
  onSaveAs: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomSelect: (zoom: number) => void;
  onZoomFit: () => void;
  onEdit: () => void;
  onResize: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onCopy: () => void;
  onPaste: () => void;
  onSettings: () => void;
  onClose: () => void;
  onSave: () => void;
};

function ToolBtn(props: {
  label: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`workspaceToolBtn${props.active ? ' workspaceToolBtn--active' : ''}`}
      title={props.title}
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <span className="workspaceToolIcon" aria-hidden>
        {props.children}
      </span>
      <span className="workspaceToolLabel">{props.label}</span>
    </button>
  );
}

function zoomLabel(zoom: number) {
  const preset = WORKSPACE_ZOOM_PRESETS.find((z) => Math.abs(z - zoom) < 0.001);
  if (preset != null) return `${Math.round(preset * 100)}%`;
  return `${Math.round(zoom * 100)}%`;
}

export function WorkspaceToolbar(props: WorkspaceToolbarProps) {
  const d = !!props.disabled;
  return (
    <div className="workspaceToolbar" role="toolbar" aria-label="工作区工具栏">
      <ToolBtn label="打开" title="打开图片" disabled={d} onClick={props.onOpen}>
        📂
      </ToolBtn>
      <ToolBtn label="另存为" title="另存为" disabled={d} onClick={props.onSaveAs}>
        📥
      </ToolBtn>
      <span className="workspaceToolSep" aria-hidden />
      <ToolBtn label="放大" title="放大" disabled={d} onClick={props.onZoomIn}>
        🔍+
      </ToolBtn>
      <ToolBtn label="缩小" title="缩小" disabled={d} onClick={props.onZoomOut}>
        🔍−
      </ToolBtn>
      <details className="workspaceZoomMenu">
        <summary className="workspaceZoomSummary" title="缩放比例">
          <span className="workspaceToolIcon" aria-hidden>
            🔍
          </span>
          <span className="workspaceToolLabel">{zoomLabel(props.zoom)}</span>
        </summary>
        <div className="workspaceZoomPanel">
          {WORKSPACE_ZOOM_PRESETS.map((z) => (
            <button
              key={z}
              type="button"
              className={`workspaceZoomOption${Math.abs(props.zoom - z) < 0.001 ? ' active' : ''}`}
              onClick={() => props.onZoomSelect(z)}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
          <button type="button" className="workspaceZoomOption" onClick={props.onZoomFit}>
            适应窗口
          </button>
        </div>
      </details>
      <span className="workspaceToolSep" aria-hidden />
      <ToolBtn label="编辑" title="进入标注编辑器" disabled={d} onClick={props.onEdit}>
        🖌
      </ToolBtn>
      <ToolBtn label="调整大小" title="调整图片大小" disabled={d} onClick={props.onResize}>
        ↔
      </ToolBtn>
      <span className="workspaceToolSep" aria-hidden />
      <ToolBtn label="撤销" title="撤销" disabled={d || !props.canUndo} onClick={props.onUndo}>
        ↶
      </ToolBtn>
      <ToolBtn label="重做" title="重做" disabled={d || !props.canRedo} onClick={props.onRedo}>
        ↷
      </ToolBtn>
      <span className="workspaceToolSep" aria-hidden />
      <ToolBtn label="复制" title="复制到剪贴板" disabled={d} onClick={props.onCopy}>
        📋
      </ToolBtn>
      <ToolBtn label="粘贴" title="粘贴剪贴板图片为新图层" disabled={d} onClick={props.onPaste}>
        📌
      </ToolBtn>
      <span className="workspaceToolSep" aria-hidden />
      <ToolBtn
        label="设置"
        title="设置（截图工作流、导出与各工具默认属性）"
        disabled={d}
        active={props.settingsOpen}
        onClick={props.onSettings}
      >
        ⚙
      </ToolBtn>
      <ToolBtn label="关闭" title="关闭并返回首页" disabled={d} onClick={props.onClose}>
        ✕
      </ToolBtn>
      <ToolBtn label="保存" title="保存（自动保存或另存为）" disabled={d} onClick={props.onSave}>
        💾
      </ToolBtn>
    </div>
  );
}
