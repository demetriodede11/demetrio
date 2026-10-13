// Backend проксирует ответ DaData без обёртки Bitrix.
export type TDadataSuggestion<TData> = {
  value: string;
  unrestricted_value: string;
  data: TData;
};

export type TDadataResponse<TData> = { suggestions: TDadataSuggestion<TData>[] };
export type TDadataBankQuery = { query: string; count?: number };
export type TDadataBankData = {
  bic: string;
  name: { payment: string | null; short: string | null; full: string | null };
  correspondent_account: string | null;
  [key: string]: unknown;
};

export type TDadataAddressData = {
  city: string | null;
  street: string | null;
  house: string | null;
  flat: string | null;
  postal_code: string | null;
  [key: string]: unknown;
};

export type TDadataAddressQuery = {
  query: string;
  count?: number;
  locations?: Record<string, string>[];
  locations_boost?: Record<string, string>[];
  restrict_value?: boolean;
  from_bound?: { value: string };
  to_bound?: { value: string };
  language?: string;
};
