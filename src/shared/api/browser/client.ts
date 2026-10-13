import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { throwIfBitrixError } from '../errors';
import { getEndpointPath } from '../path';
import type {
  TEndpointContract,
  TGetEndpoint,
  TPostArgs,
  TPostEndpoint,
  TRequestConfigArgs,
} from '../types';

const prepareBrowserRequest = (request: InternalAxiosRequestConfig) => {
  if (typeof window === 'undefined') {
    throw new Error('apiClient предназначен для браузера; относительный URL недоступен при SSR');
  }

  request.baseURL = '/api/backend';
  request.allowAbsoluteUrls = false;

  return request;
};

const handleBrowserResponse = (response: AxiosResponse<unknown>) => {
  throwIfBitrixError(response.data);

  return response;
};

const client = axios.create({
  baseURL: '/api/backend',
  timeout: 15_000,
  withCredentials: true,
  allowAbsoluteUrls: false,
  headers: { Accept: 'application/json' },
});

client.interceptors.request.use(prepareBrowserRequest);
client.interceptors.response.use(handleBrowserResponse);

// Контракт выбирается по endpoint; NoInfer не позволяет неверным настройкам расширить его тип.
const get = <TEndpoint extends TGetEndpoint>(
  endpoint: TEndpoint,
  ...[config]: TRequestConfigArgs<NoInfer<TEndpoint>>
) => {
  const { pathParams, ...requestConfig } = config ?? {};

  return client.get<TEndpointContract<TEndpoint>['response']>(
    getEndpointPath(endpoint, pathParams),
    requestConfig,
  );
};

const post = <TEndpoint extends TPostEndpoint>(
  endpoint: TEndpoint,
  ...[body, config]: TPostArgs<NoInfer<TEndpoint>>
) => {
  const { pathParams, ...requestConfig } = config ?? {};

  return client.post<TEndpointContract<TEndpoint>['response']>(
    getEndpointPath(endpoint, pathParams),
    body,
    requestConfig,
  );
};

export const apiClient = { get, post };
