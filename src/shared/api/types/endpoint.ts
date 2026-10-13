import type { TBitrixResponse } from './common';
import type { API_ENDPOINT } from '../endpoints';

// params — подстановка в путь, например { id: string }; query — параметры после '?'.
// never означает, что тело или соответствующие параметры для операции не предусмотрены.
export type THttpContract<TResponse, TBody = never, TParams = never, TQuery = never> = {
  response: TResponse;
  body: TBody;
  params: TParams;
  query: TQuery;
};

// Тот же контракт, но ответ обёрнут в формат Bitrix: status, data и errors.
export type TBitrixContract<
  TData,
  TBody = never,
  TParams = never,
  TQuery = never,
  TErrorData = unknown,
> = THttpContract<TBitrixResponse<TData, TErrorData>, TBody, TParams, TQuery>;

export type TRegisteredEndpoint = (typeof API_ENDPOINT)[keyof typeof API_ENDPOINT];

// Метаданные, которые действительно присутствуют в объекте эндпоинта.
export type TApiEndpoint = {
  method: 'GET' | 'POST';
  path: string;
  availability?: 'unverified' | 'disabled';
  note?: string;
};

// Уникальный скрытый ключ связывает эндпоинт с его контрактом в системе типов.
// declare не создаёт Symbol при выполнении; defineEndpoint не добавляет этот ключ в объект.
declare const endpointContract: unique symbol;

// Обязательная метка не позволяет передать в клиент обычный объект { method, path }.
export type TTypedApiEndpoint<TContract> = TApiEndpoint & {
  readonly [endpointContract]: TContract;
};

// Получает контракт по скрытому ключу: например, TEndpointContract<typeof endpoint>['response'].
export type TEndpointContract<TEndpoint extends TTypedApiEndpoint<unknown>> =
  TEndpoint[typeof endpointContract];

// Разрешённые операции выбранного HTTP-метода.
export type TGetEndpoint = Extract<TRegisteredEndpoint, { method: 'GET' }>;
export type TPostEndpoint = Extract<TRegisteredEndpoint, { method: 'POST' }>;
