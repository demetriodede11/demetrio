import type { AxiosRequestConfig } from 'axios';

import type { TEndpointContract, TRegisteredEndpoint } from './endpoint';

// never запрещает параметры пути, остальные типы делают pathParams обязательными.
type TPathOptions<TParams> = [TParams] extends [never]
  ? { pathParams?: never }
  : { pathParams: TParams };

// Query можно опустить, если у него нет обязательных полей.
type TQueryOptions<TQuery> = [TQuery] extends [never]
  ? { params?: never }
  : {} extends TQuery
    ? { params?: TQuery }
    : { params: TQuery };

// URL и HTTP-метод задаёт эндпоинт; тело передаётся аргументом post.
export type TRequestConfig<TEndpoint extends TRegisteredEndpoint> = Omit<
  AxiosRequestConfig<TEndpointContract<TEndpoint>['body']>,
  'url' | 'method' | 'baseURL' | 'allowAbsoluteUrls' | 'data' | 'params'
> &
  TPathOptions<TEndpointContract<TEndpoint>['params']> &
  TQueryOptions<TEndpointContract<TEndpoint>['query']>;

// Если настройки допускают пустой объект, аргумент config необязателен.
// Иначе config нужен: в нём должны быть обязательные параметры пути или query.
export type TRequestConfigArgs<TEndpoint extends TRegisteredEndpoint> =
  {} extends TRequestConfig<TEndpoint>
    ? [config?: TRequestConfig<TEndpoint>]
    : [config: TRequestConfig<TEndpoint>];

// Аргументы после эндпоинта в post: тело и настройки. Тело обязательно, если есть в контракте.
// Для POST без тела его можно опустить или передать undefined перед настройками.
export type TPostArgs<TEndpoint extends TRegisteredEndpoint> = [
  TEndpointContract<TEndpoint>['body'],
] extends [never]
  ? [body?: never, ...TRequestConfigArgs<TEndpoint>]
  : [body: TEndpointContract<TEndpoint>['body'], ...TRequestConfigArgs<TEndpoint>];
