// Next.js обрабатывает server-only встроенно; отдельная npm-зависимость не требуется.
// eslint-disable-next-line import/no-unresolved -- Служебный импорт разрешает сборщик Next.js.
import 'server-only';
import { isIP } from 'node:net';

// Адрес браузера может отличаться от внутреннего адреса Next.js за обратным прокси.
export const getAppOrigin = (requestUrl: string): string => {
  const value = process.env.APP_ORIGIN;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!value) {
    if (isProduction) {
      throw new Error('Не найден APP_ORIGIN');
    }

    return new URL(requestUrl).origin;
  }

  const origin = new URL(value);
  const hostname = origin.hostname.replace(/^\[|\]$/g, '');

  // HTTP в production допускается только для временного запуска по IP.
  const allowedProtocol =
    origin.protocol === 'https:' ||
    (origin.protocol === 'http:' && (!isProduction || isIP(hostname) !== 0));

  if (
    !allowedProtocol ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash ||
    origin.pathname !== '/'
  ) {
    throw new Error(
      'APP_ORIGIN должен быть HTTP(S) origin без пути и credentials; HTTP в production — только IP',
    );
  }

  return origin.origin;
};

export const getBackendConfig = () => {
  const value = process.env.API_BASE_URL;

  if (!value) {
    throw new Error('Не найден API_BASE_URL');
  }

  const origin = new URL(value);

  if (
    origin.protocol !== 'https:' ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash ||
    origin.pathname !== '/'
  ) {
    throw new Error('API_BASE_URL должен быть HTTPS origin без пути и credentials');
  }

  return {
    origin: origin.origin,
    // Если требуется Basic Auth, значение внедряется в runtime из Vault.
    authorization: process.env.API_UPSTREAM_AUTHORIZATION,
    sessionCookieName: process.env.API_SESSION_COOKIE_NAME ?? 'PHPSESSID',
    timeout: 10_000,
  };
};

export type TBackendConfig = ReturnType<typeof getBackendConfig>;
