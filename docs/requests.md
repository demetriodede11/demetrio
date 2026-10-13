# Написание запросов

[К основной документации](../README.md)

## Размещение и типы

- URL, метод и контракт добавляйте в [каталог](../src/shared/api/endpoints.ts).
  Для Bitrix используйте `TBitrixContract`, для обычного ответа — `THttpContract`.
- Модели данных размещайте в `src/shared/api/types/`.
- Функции запросов пишите в `src/modules/<модуль>/requests/<имя>.ts`.
  Передавайте в `apiClient` эндпоинт из `API_ENDPOINT`: типы ответа и параметров
  определяются автоматически. Для аргументов функций используйте модели из `types/`.
  Для React Query можно экспортировать объект `queryOptions` с ключом и `queryFn`.

`apiClient` предназначен для браузера. Для серверного GET используйте
`serverApiClient` из `$shared/api/server`; пример —
[getFaqList.server.ts](../src/modules/faq/requests/getFaqList.server.ts).
Параметры пути передавайте через `pathParams`, параметры строки URL — через `params`,
тело браузерного POST — вторым аргументом `post`.
HTTP-метод должен соответствовать эндпоинту; произвольные строки URL не принимаются.

## Пример запроса

[getFaqList.ts](../src/modules/faq/requests/getFaqList.ts):

```ts
import { queryOptions } from '@tanstack/react-query';

import { apiClient, API_ENDPOINT, unwrapBitrixResponse } from '$shared/api';

import { getFaqListKey } from './helpers';

export const getFaqList = queryOptions({
  queryKey: getFaqListKey(),
  queryFn: async ({ signal }) => {
    const { data } = await apiClient.get(API_ENDPOINT.faq, { signal });

    return unwrapBitrixResponse(data);
  },
});
```

Путь с параметром и POST:

```ts
await apiClient.get(API_ENDPOINT.staticPage, {
  pathParams: { code: 'privacy' },
  signal,
});

await apiClient.post(API_ENDPOINT.login, { login, password }, { signal });
await apiClient.post(API_ENDPOINT.logout, undefined, { signal });
```

## Использование в React Query

Хуки запросов используйте в клиентских компонентах. Передавайте `signal`,
чтобы React Query мог отменять ненужные запросы:

```ts
'use client';

import { useQuery } from '@tanstack/react-query';

import { getFaqList } from '$modules/faq/requests/getFaqList';

export const useFaq = () => useQuery(getFaqList);
```

Для изменений данных используйте `useMutation` и соответствующий POST из каталога.

На `/questions` сервер загружает FAQ через `queryClient.query(getFaqList)`
с объектом из `getFaqList.server.ts` и передаёт кэш через `dehydrate` и
`HydrationBoundary`. React `cache` объединяет загрузку для страницы и метаданных
в рамках одного серверного рендера. Общий ключ задаётся в `requests/helpers.ts`;
браузер считает данные свежими 60 секунд.
Если предзагрузка не удалась, клиент сам запросит список и покажет ошибку с повтором.
Метаданные в этом случае используют резервные значения. Серверная загрузка находится
под `Suspense`, который показывает «Загрузка»; `io()` исключает её из статической оболочки.

## Ответы и ошибки

`unwrapBitrixResponse` возвращает данные успешного ответа. Клиент отклоняет
ответы Bitrix с `status: 'error'`, даже при HTTP 200: `BitrixApiError` сохраняет
поля `errors` и `data`. HTTP-ошибки приходят как `AxiosError`; ошибки прокси
содержат `{ code, message }` в теле ответа. Не заменяйте ошибку пустыми данными.

Ответы DaData используйте без `unwrapBitrixResponse`. Для скачивания файлов
задавайте `responseType: 'blob'`. Типы TypeScript описывают контракт и не
проверяют содержимое ответа при выполнении запроса.
