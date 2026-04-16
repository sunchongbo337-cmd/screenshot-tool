export function createId(prefix: string): string {
  // Not cryptographically secure; sufficient for local editor nodes.
  const rand = Math.random().toString(16).slice(2);
  return `${prefix}_${Date.now().toString(16)}_${rand}`;
}

