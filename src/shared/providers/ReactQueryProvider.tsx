'use client';

import {
  defaultShouldDehydrateQuery,
  environmentManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AxiosError, isAxiosError, isCancel } from 'axios';

type TProps = React.PropsWithChildren;

const RETRYABLE_ERROR_CODES = new Set<string>([
  AxiosError.ERR_NETWORK,
  AxiosError.ECONNABORTED,
  AxiosError.ETIMEDOUT,
]);

const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
  if (failureCount >= 1 || !isAxiosError(error) || isCancel(error)) {
    return false;
  }

  const status = error.response?.status;

  if (status !== undefined) {
    return status >= 500 && status < 600;
  }

  return RETRYABLE_ERROR_CODES.has(error.code ?? '');
};

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();

  return browserQueryClient;
};

export const ReactQueryProvider = ({ children }: TProps) => (
  <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
);
