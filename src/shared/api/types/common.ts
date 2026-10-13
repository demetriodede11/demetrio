export type TApiError = {
  message: string;
  code: string | number;
  customData?: Record<string, unknown> | null;
};

export type TBitrixResponse<TData, TErrorData = unknown> =
  | { status: 'success'; data: TData; errors: TApiError[] }
  | { status: 'error'; data: TErrorData | null; errors: TApiError[] };

export type TMeta = { title: string; metaDesc: string; metaKeys: string };
export type TPagination = { page: number; pageSize: number; total: number; totalPages: number };
