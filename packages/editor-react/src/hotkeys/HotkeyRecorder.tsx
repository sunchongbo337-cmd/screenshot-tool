import React, { createContext, useContext, useEffect, useId, useState } from 'react';
import { formatHotkeyParts, hotkeyFromKeyboardEvent, parseHotkeyString } from '@screenshot/editor-core';

export type HotkeyRecorderProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Optional stable id; auto-generated when omitted. */
  id?: string;
};

type HotkeyRecorderGroupContextValue = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const HotkeyRecorderGroupContext = createContext<HotkeyRecorderGroupContextValue | null>(null);

export function HotkeyRecorderGroup(props: { children: React.ReactNode; onRecordingChange?: (recording: boolean) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    props.onRecordingChange?.(activeId != null);
  }, [activeId, props.onRecordingChange]);

  return (
    <HotkeyRecorderGroupContext.Provider value={{ activeId, setActiveId }}>
      {props.children}
    </HotkeyRecorderGroupContext.Provider>
  );
}

function HotkeyDisplay({ value }: { value: string }) {
  const parts = formatHotkeyParts(value);
  if (!parseHotkeyString(value)) {
    return <span className="fscHotkeyRecorderInvalid">{value || '无效快捷键'}</span>;
  }
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={`${part}-${i}`}>
          {i > 0 ? <span className="fscHotkeyRecorderSep">+</span> : null}
          <kbd>{part}</kbd>
        </React.Fragment>
      ))}
    </>
  );
}

export function HotkeyRecorder({ value, onChange, disabled, id: idProp }: HotkeyRecorderProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const group = useContext(HotkeyRecorderGroupContext);
  const [soloRecording, setSoloRecording] = useState(false);
  const recording = group ? group.activeId === id : soloRecording;

  const setRecording = (next: boolean) => {
    if (group) {
      group.setActiveId(next ? id : null);
      return;
    }
    setSoloRecording(next);
  };

  useEffect(() => {
    if (!recording) return;
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        setRecording(false);
        return;
      }
      const next = hotkeyFromKeyboardEvent(e);
      if (!next) return;
      onChange(next);
      setRecording(false);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [recording, onChange, id, group]);

  return (
    <button
      type="button"
      className={`fscHotkeyRecorder${recording ? ' recording' : ''}`}
      onClick={() => {
        if (disabled) return;
        if (recording) {
          setRecording(false);
          return;
        }
        setRecording(true);
      }}
      disabled={disabled}
      title={recording ? '再点一次或按 Esc 取消' : '点击后按下新的快捷键'}
    >
      {recording ? '请按下快捷键…' : <HotkeyDisplay value={value} />}
    </button>
  );
}
