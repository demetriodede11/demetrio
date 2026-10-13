import { API_ENDPOINT, isValidPathSegment } from '../endpoints';
import type { TApiEndpoint } from '../types';
import { getAppOrigin, getBackendConfig } from './config';
import type { TBackendConfig } from './config';
import { adaptBackendCookie } from './cookies';
import { createBackendHeaders } from './headers';

const MAX_BODY_BYTES = 2 * 1024 * 1024;
const RESPONSE_HEADERS = ['content-type', 'content-disposition'];

const REQUEST_HEADERS = ['accept', 'content-type'];

const ALLOWED_STATUSES = new Set([200, 400, 401, 403, 404, 429, 500]);

const endpoints: TApiEndpoint[] = Object.values(API_ENDPOINT);

const createPathPattern = (path: string): RegExp => {
  const pattern = path
    .replace(/\/$/, '')
    .split(/(\{\w+\})/)
    .map((part) => (part.startsWith('{') ? '[^/]+' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    .join('');

  return new RegExp(`^${pattern}$`);
};

const routes = endpoints.map((endpoint) => ({
  endpoint,
  pattern: createPathPattern(endpoint.path),
}));

const errorResponse = (status: number, code: string, message: string) =>
  Response.json({ code, message }, { status, headers: { 'Cache-Control': 'no-store' } });

const readLimitedBody = async (
  request: Request,
  signal: AbortSignal,
): Promise<ArrayBuffer | undefined> => {
  if (!request.body) {
    return undefined;
  }

  const reader = request.body.getReader();

  const cancel = () => {
    void reader.cancel();
  };

  signal.addEventListener('abort', cancel, { once: true });
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      signal.throwIfAborted();
      const { done, value } = await reader.read();
      signal.throwIfAborted();

      if (done) {
        break;
      }

      size += value.byteLength;

      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error('BODY_TOO_LARGE');
      }

      chunks.push(value);
    }
  } finally {
    signal.removeEventListener('abort', cancel);
    reader.releaseLock();
  }

  const body = new Uint8Array(size);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return body.buffer;
};

const findEndpoint = (path: string[], method: string): TApiEndpoint | undefined => {
  const requestPath = `/${path.join('/')}`;

  const matches = routes
    .filter(({ pattern }) => pattern.test(requestPath))
    .map(({ endpoint }) => endpoint);

  // Точный маршрут имеет приоритет: order/history не должен стать order/{id}.
  return (
    matches.find((endpoint) => endpoint.method === method && !endpoint.path.includes('{')) ??
    matches.find((endpoint) => endpoint.method === method)
  );
};

const validateProxyRequest = (request: Request, endpoint: TApiEndpoint): Response | null => {
  if (endpoint.availability) {
    return errorResponse(404, 'ENDPOINT_DISABLED', endpoint.note ?? 'Эндпоинт не подключён');
  }

  if (request.method !== 'GET') {
    let appOrigin: string;

    try {
      appOrigin = getAppOrigin(request.url);
    } catch {
      return errorResponse(500, 'APP_NOT_CONFIGURED', 'Публичный адрес приложения не настроен');
    }

    if (request.headers.get('origin') !== appOrigin) {
      return errorResponse(403, 'INVALID_ORIGIN', 'Запрос должен идти с домена приложения');
    }
  }

  const contentType = request.headers.get('content-type');

  if (
    request.method === 'POST' &&
    contentType &&
    !/^(application\/json|application\/x-www-form-urlencoded|multipart\/form-data)(;|$)/i.test(
      contentType,
    )
  ) {
    return errorResponse(400, 'INVALID_CONTENT_TYPE', 'Формат тела запроса не поддерживается');
  }

  return null;
};

const createUpstreamUrl = (
  incomingUrl: string,
  path: string[],
  endpoint: TApiEndpoint,
  backend: TBackendConfig,
): URL => {
  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join('/');

  const url = new URL(
    `/bxapi/v1/${encodedPath}${endpoint.path.endsWith('/') ? '/' : ''}`,
    backend.origin,
  );

  url.search = new URL(incomingUrl).search;

  return url;
};

const normalizeResponseStatus = (status: number): number => {
  if (ALLOWED_STATUSES.has(status)) {
    return status;
  }

  if (status >= 400 && status < 500) {
    return 400;
  }

  return status < 300 ? 200 : 500;
};

const createProxyResponse = async (
  upstream: Response,
  sessionCookieName: string,
): Promise<Response> => {
  if (upstream.status >= 300 && upstream.status < 400) {
    await upstream.body?.cancel();

    return errorResponse(500, 'BACKEND_REDIRECT', 'Backend вернул неожиданный redirect');
  }

  const responseHeaders = new Headers({ 'Cache-Control': 'no-store' });

  for (const name of RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);

    if (value) {
      responseHeaders.set(name, value);
    }
  }

  for (const cookie of upstream.headers.getSetCookie()) {
    const adapted = adaptBackendCookie(cookie, sessionCookieName);

    if (adapted) {
      responseHeaders.append('set-cookie', adapted);
    }
  }

  return new Response(upstream.body, {
    status: normalizeResponseStatus(upstream.status),
    headers: responseHeaders,
  });
};

export const proxyBackendRequest = async (request: Request, path: string[]): Promise<Response> => {
  if (path.length === 0 || path.some((segment) => !isValidPathSegment(segment))) {
    return errorResponse(400, 'INVALID_PATH', 'Некорректный путь API');
  }

  const endpoint = findEndpoint(path, request.method);

  if (!endpoint) {
    return errorResponse(404, 'ENDPOINT_NOT_FOUND', 'Эндпоинт или HTTP-метод не поддерживается');
  }

  const validationError = validateProxyRequest(request, endpoint);

  if (validationError) {
    return validationError;
  }

  let backend: TBackendConfig;

  try {
    backend = getBackendConfig();
  } catch {
    return errorResponse(500, 'BACKEND_NOT_CONFIGURED', 'Backend не настроен на сервере');
  }

  const url = createUpstreamUrl(request.url, path, endpoint, backend);
  const headers = createBackendHeaders(request.headers, backend, REQUEST_HEADERS);
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(backend.timeout)]);

  try {
    const body = request.method === 'GET' ? undefined : await readLimitedBody(request, signal);

    const upstream = await fetch(url, {
      method: request.method,
      headers,
      body,
      signal,
      cache: 'no-store',
      redirect: 'manual',
    });

    return await createProxyResponse(upstream, backend.sessionCookieName);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'BODY_TOO_LARGE') {
      return errorResponse(400, 'BODY_TOO_LARGE', 'Тело запроса превышает 2 МБ');
    }

    return errorResponse(
      500,
      signal.aborted ? 'REQUEST_ABORTED' : 'BACKEND_UNAVAILABLE',
      signal.aborted ? 'Запрос отменён или превышен таймаут' : 'Backend недоступен',
    );
  }
};
