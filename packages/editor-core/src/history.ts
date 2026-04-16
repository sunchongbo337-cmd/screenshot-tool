export type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function createHistory<T>(initial: T): HistoryState<T> {
  return { past: [], present: initial, future: [] };
}

export function pushHistory<T>(state: HistoryState<T>, next: T): HistoryState<T> {
  return {
    past: [...state.past, state.present],
    present: next,
    future: []
  };
}

export function canUndo<T>(state: HistoryState<T>): boolean {
  return state.past.length > 0;
}

export function canRedo<T>(state: HistoryState<T>): boolean {
  return state.future.length > 0;
}

export function undo<T>(state: HistoryState<T>): HistoryState<T> {
  if (!canUndo(state)) return state;
  const past = state.past.slice(0, -1);
  const previous = state.past[state.past.length - 1] as T;
  return { past, present: previous, future: [state.present, ...state.future] };
}

export function redo<T>(state: HistoryState<T>): HistoryState<T> {
  if (!canRedo(state)) return state;
  const [next, ...future] = state.future;
  return { past: [...state.past, state.present], present: next as T, future };
}

