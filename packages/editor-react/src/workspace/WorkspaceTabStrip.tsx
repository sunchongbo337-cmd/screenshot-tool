import React from 'react';
import type { QueueItem } from './workspace-types.js';

export type WorkspaceTabStripProps = {
  items: QueueItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onClose: (index: number) => void;
  onAdd: () => void;
};

export function WorkspaceTabStrip({ items, activeIndex, onSelect, onClose, onAdd }: WorkspaceTabStripProps) {
  return (
    <div className="workspaceTabStrip" role="tablist" aria-label="图片标签">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          className={`workspaceTab${index === activeIndex ? ' workspaceTab--active' : ''}`}
          onClick={() => onSelect(index)}
          title={item.name}
        >
          <span className="workspaceTabDiamond" aria-hidden />
          <span className="workspaceTabLabel">{item.name.replace(/\.[^.]+$/, '') || `捕获 ${index + 1}`}</span>
          <span
            className="workspaceTabClose"
            role="button"
            aria-label="关闭标签"
            onClick={(e) => {
              e.stopPropagation();
              onClose(index);
            }}
          >
            ×
          </span>
        </button>
      ))}
      <button type="button" className="workspaceTabAdd" onClick={onAdd} title="打开更多图片" aria-label="新建标签">
        +
      </button>
    </div>
  );
}
