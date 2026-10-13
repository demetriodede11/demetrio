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
