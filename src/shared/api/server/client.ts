// Next.js обрабатывает server-only встроенно; отдельная npm-зависимость не требуется.
// eslint-disable-next-line import/no-unresolved -- Служебный импорт разрешает сборщик Next.js.
import 'server-only';
import axios from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { headers } from 'next/headers';

import { getEndpointPath } from '../path';
import type { TEndpointContract, TGetEndpoint, TRequestConfigArgs } from '../types';
import { getBackendConfig } from './config';
import { createBackendHeaders } from './headers';

const prepareServerRequest = (request: InternalAxiosRequestConfig, backendHeaders: Headers) => {
  request.headers.set('Accept', 'application/json');

  // Авторизация и cookies берутся только из серверной конфигурации и входящего запроса.
  request.headers.delete('cookie');
  request.headers.delete('authorization');
  backendHeaders.forEach((value, name) => request.headers.set(name, value));

  return request;
};

// Отдельный экземпляр на запрос: cookies одного пользователя не попадут в запрос другого.
const createServerAxios = async (requestConfig: AxiosRequestConfig) => {
  const backend = getBackendConfig();
  const incomingHeaders = await headers();
  const backendHeaders = createBackendHeaders(incomingHeaders, backend);

  const client = axios.create({
    ...requestConfig,
    baseURL: `${backend.origin}/bxapi/v1`,
    allowAbsoluteUrls: false,
    timeout: backend.timeout,
    maxRedirects: 0,
  });

  client.interceptors.request.use((request) => prepareServerRequest(request, backendHeaders));

  return client;
};

// Только чтение: изменения данных выполняются браузером через прокси с проверкой Origin.
const get = async <TEndpoint extends TGetEndpoint>(
  endpoint: TEndpoint,
  ...[config]: TRequestConfigArgs<NoInfer<TEndpoint>>
) => {
  if (endpoint.availability) {
    throw new Error(endpoint.note ?? `Эндпоинт ${endpoint.path} не подключён`);
  }

  const { pathParams, ...requestConfig } = config ?? {};
  const path = getEndpointPath(endpoint, pathParams);
  const client = await createServerAxios(requestConfig);

  return client.get<TEndpointContract<TEndpoint>['response']>(path);
};

export const serverApiClient = { get };
