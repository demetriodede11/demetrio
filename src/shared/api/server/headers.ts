import type { TBackendConfig } from './config';
import { getBackendCookieHeader } from './cookies';

const TRACE_HEADERS = ['traceparent', 'tracestate', 'baggage'];
const EXCLUDED_O3_HEADERS = new Set(['x-o3-app-name', 'x-o3-app-version', 'x-o3-s2s']);

// Общие правила для SSR и прокси. Прокси дополнительно передаёт Accept и Content-Type.
export const createBackendHeaders = (
  incomingHeaders: Headers,
  backend: TBackendConfig,
  additionalHeaderNames: readonly string[] = [],
): Headers => {
  const outgoingHeaders = new Headers();

  for (const name of [...TRACE_HEADERS, ...additionalHeaderNames]) {
    const value = incomingHeaders.get(name);

    if (value) {
      outgoingHeaders.set(name, value);
    }
  }

  incomingHeaders.forEach((value, name) => {
    if (name.startsWith('x-o3-') && !EXCLUDED_O3_HEADERS.has(name)) {
      outgoingHeaders.set(name, value);
    }
  });

  const cookies = getBackendCookieHeader(incomingHeaders.get('cookie'), backend.sessionCookieName);

  if (cookies) {
    outgoingHeaders.set('cookie', cookies);
  }

  if (backend.authorization) {
    outgoingHeaders.set('authorization', backend.authorization);
  }

  return outgoingHeaders;
};
