import React, { useEffect, useMemo, useState } from 'react';
import { OverlayScreen } from './OverlayScreen.js';
import { EditorScreen } from './EditorScreen.js';

function parseHash() {
  const hash = window.location.hash || '#/editor';
  const [path, query] = hash.replace(/^#/, '').split('?');
  const params = new URLSearchParams(query ?? '');
  return { path: path || '/editor', params };
}

export function App() {
  const [route, setRoute] = useState(() => parseHash());

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const displayId = useMemo(() => {
    const v = route.params.get('displayId');
    return v ? Number(v) : null;
  }, [route.params]);

  if (route.path.startsWith('/overlay')) {
    return <OverlayScreen displayId={displayId ?? 0} />;
  }
  return <EditorScreen />;
}

