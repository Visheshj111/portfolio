export type Algorithm = "token_bucket" | "sliding_window";
export type DemoState = { tokens: number; updatedAt: number; acceptedAt: number[] };
export const capacity = 5;
export const windowMs = 10000;

export function freshDemo(now: number): DemoState {
  return { tokens: capacity, updatedAt: now, acceptedAt: [] };
}

export function advanceDemo(state: DemoState, now: number): DemoState {
  return {
    tokens: Math.min(capacity, state.tokens + Math.max(0, now - state.updatedAt) * capacity / windowMs),
    updatedAt: Math.max(now, state.updatedAt),
    acceptedAt: state.acceptedAt.filter(time => time > now - windowMs),
  };
}

export function sendDemo(state: DemoState, algorithm: Algorithm, count: number, now: number) {
  const next = advanceDemo(state, now);
  const available = algorithm === "token_bucket" ? Math.floor(next.tokens) : capacity - next.acceptedAt.length;
  const admitted = Math.min(count, available);
  return {
    state: algorithm === "token_bucket" ? { ...next, tokens: next.tokens - admitted } : { ...next, acceptedAt: [...next.acceptedAt, ...Array(admitted).fill(now)] },
    admitted,
    blocked: count - admitted,
  };
}
