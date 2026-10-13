import type { TApiError, TBitrixResponse } from './types/common';

const isFailedBitrixResponse = (
  value: unknown,
): value is { status: 'error'; data?: unknown; errors?: unknown } =>
  typeof value === 'object' && value !== null && 'status' in value && value.status === 'error';

export const isApiError = (value: unknown): value is TApiError =>
  typeof value === 'object' &&
  value !== null &&
  'message' in value &&
  typeof value.message === 'string' &&
  'code' in value &&
  (typeof value.code === 'number' || typeof value.code === 'string') &&
  (!('customData' in value) ||
    value.customData == null ||
    (typeof value.customData === 'object' && !Array.isArray(value.customData)));

export class BitrixApiError<TData = unknown> extends Error {
  readonly errors: TApiError[];
  readonly data: TData | null;

  constructor(errors: TApiError[], data: TData | null) {
    super(errors[0]?.message ?? 'Backend вернул ошибку');
    this.name = 'BitrixApiError';
    this.errors = errors;
    this.data = data;
  }
}

// Бизнес-ошибка Bitrix может приходить даже при HTTP 200.
export const throwIfBitrixError = (payload: unknown): void => {
  if (!isFailedBitrixResponse(payload)) {
    return;
  }

  const errors = Array.isArray(payload.errors) ? payload.errors.filter(isApiError) : [];

  throw new BitrixApiError(errors, 'data' in payload ? payload.data : null);
};

export const unwrapBitrixResponse = <TData, TErrorData = unknown>(
  response: TBitrixResponse<TData, TErrorData>,
): TData => {
  if (response.status === 'error') {
    throw new BitrixApiError(response.errors, response.data);
  }

  return response.data;
};
