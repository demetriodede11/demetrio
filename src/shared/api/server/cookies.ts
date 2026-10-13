const isBackendCookie = (name: string, sessionCookieName: string): boolean =>
  name === sessionCookieName || name.startsWith('BITRIX_SM_');

// Передаём backend только его cookies, без остальных cookies приложения.
export const getBackendCookieHeader = (
  cookieHeader: string | null,
  sessionCookieName: string,
): string | undefined =>
  cookieHeader
    ?.split(';')
    .filter((pair) => isBackendCookie(pair.slice(0, pair.indexOf('=')).trim(), sessionCookieName))
    .join(';');

export const adaptBackendCookie = (cookie: string, sessionCookieName: string): string | null => {
  const [pair, ...attributes] = cookie.split(';');
  const name = pair.slice(0, pair.indexOf('=')).trim();

  if (!isBackendCookie(name, sessionCookieName)) {
    return null;
  }

  // Cookie получает домен приложения и Path=/; остальные атрибуты сохраняются.
  const preserved = attributes.filter((attribute) => !/^\s*(domain|path)\s*=/i.test(attribute));

  return [pair, ...preserved, ' Path=/'].join(';');
};
