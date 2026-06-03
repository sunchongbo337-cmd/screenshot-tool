import React from 'react';

export type WorkspaceArrowNavProps = {
  activeIndex: number;
  total: number;
  name: string;
  onPrev: () => void;
  onNext: () => void;
  onAdd: () => void;
};

export function WorkspaceArrowNav({ activeIndex, total, name, onPrev, onNext, onAdd }: WorkspaceArrowNavProps) {
  return (
    <>
      <button
        type="button"
        className="workspaceArrowNavBtn workspaceArrowNavBtn--prev"
        onClick={onPrev}
        disabled={activeIndex <= 0}
        aria-label="上一张"
        title="上一张"
      >
        ‹
      </button>
      <button
        type="button"
        className="workspaceArrowNavBtn workspaceArrowNavBtn--next"
        onClick={onNext}
        disabled={activeIndex >= total - 1}
        aria-label="下一张"
        title="下一张"
      >
        ›
      </button>
      <div className="workspaceArrowNavBar" title={name}>
        <span>
          {activeIndex + 1}/{total} {name.replace(/\.[^.]+$/, '') || `捕获 ${activeIndex + 1}`}
        </span>
        <button type="button" className="workspaceArrowNavAdd" onClick={onAdd} title="打开更多图片" aria-label="打开更多图片">
          +
        </button>
      </div>
    </>
  );
}
