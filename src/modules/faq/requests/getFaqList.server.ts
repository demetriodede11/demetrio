import { queryOptions } from '@tanstack/react-query';

import { serverApiClient } from '$shared/api/server';
import { API_ENDPOINT, unwrapBitrixResponse } from '$shared/api';

import { getFaqListKey } from './helpers';

export const getFaqList = queryOptions({
  queryKey: getFaqListKey(),
  queryFn: async ({ signal }) => {
    const { data } = await serverApiClient.get(API_ENDPOINT.faq, { signal });

    return unwrapBitrixResponse(data);
  },
});
