import { isValidPathSegment } from './endpoints';
import type { TRegisteredEndpoint } from './types';

const URL_PARAMS_REGEX = /\{(\w+)\}/g;

// Подставляет параметры в путь и проверяет их при выполнении, затем кодирует для URL.
export const getEndpointPath = (
  endpoint: TRegisteredEndpoint,
  params: Record<string, string | number> = {},
): string =>
  endpoint.path.replace(URL_PARAMS_REGEX, (_, name: string) => {
    const value = params[name];

    if (value === undefined || !isValidPathSegment(String(value))) {
      throw new Error(`Некорректный параметр пути: ${name}`);
    }

    return encodeURIComponent(String(value));
  });
