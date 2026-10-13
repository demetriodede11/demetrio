import type { TMeta, TPagination } from './common';

export type TCurrency = string;
export type TBadge = { title: string; backgroundColor: string; textColor: string };
export type TFeature = { name: string; value: string };
export type TSteppedPrice = { from: number; to: number | null; price: number };
export type TCatalogProductCategory = { id: string; alias: string; name: string };
export type TCatalogCategoryTab = TCatalogProductCategory & {
  code: string;
  url: string;
  imageUrl: string;
};

export type TProductLid = {
  id: string;
  title: string;
  pricePerUnit: number;
  currency: TCurrency;
  imageUrl: string;
  isActive: boolean;
  capType: string;
  description: string | null;
  features: TFeature[];
};

export type TCatalogProductCard = {
  id: string;
  alias: string;
  type: 'pack';
  sku: string;
  name: string;
  category: TCatalogProductCategory;
  imageUrl: string;
  images: string[];
  badges: TBadge[];
  pricePerUnit: number;
  currency: TCurrency;
  steppedPrices: TSteppedPrice[];
  features: TFeature[];
  minQty: number;
  stepQty: number;
  lids?: TProductLid[];
};

export type TCatalogEquipmentCard = {
  id: string;
  alias: string;
  type: 'equipment';
  name: string;
  imageUrl: string;
  images: string[];
  pricePerUnit: number;
  currency: TCurrency;
  isAvailable: boolean;
};

export type TCatalogFilter =
  | {
      type: 'range';
      label: string;
      name: string;
      min: number;
      max: number;
      from_value?: number;
      to_value?: number;
    }
  | {
      type: 'select';
      label: string;
      name: string;
      options: { value: number | string; label: string }[];
      selectedValue: number | string | null;
    };

export type TCatalogSortOption = { id: string; name: string };

export type TCatalogCategoryResponse = {
  items: TCatalogProductCard[];
  categories: TCatalogCategoryTab[];
  filters: TCatalogFilter[];
  pagination: TPagination;
  sortOptions: TCatalogSortOption[];
  sort: TCatalogSortOption | null;
  search: string;
  meta: TMeta;
  exportCatalogVisible: boolean;
  hasFiltersEmptyResult: boolean;
  emptyResultMessage?: string;
};

export type TCatalogEquipmentResponse = {
  items: TCatalogEquipmentCard[];
  pagination: TPagination;
  meta: TMeta;
};

export type TJarDetailResponse = {
  id: string;
  sectionCode: string;
  alias: string;
  type: 'pack';
  sku: string;
  name: string;
  imageUrl: string;
  images: string[];
  categoryName: string;
  pricePerUnit: number;
  currency: TCurrency;
  steppedPrices: TSteppedPrice[];
  minQty: number;
  stepQty: number;
  isAvailable: boolean;
  isNew: boolean;
  badges: TBadge[];
  features: TFeature[];
  lids: TProductLid[];
  selectedLidIds: string[];
  schemeSvgUrl: string | null;
  contacts: { phone: string; email: string };
  meta: TMeta;
  samplesOrderFormVisible: boolean;
};

export type TEquipmentDetailResponse = {
  id: string;
  alias: string;
  type: 'equipment';
  name: string;
  imageUrl: string;
  images: string[];
  categoryName: string;
  pricePerUnit: number;
  currency: TCurrency;
  isAvailable: boolean;
  features: TFeature[];
  description: string | null;
  contacts: { phone: string; email: string };
  instructionFileUrl: string | null;
  certificateFileUrl: string | null;
  meta: TMeta;
};

// Имена query-параметров соответствуют backend, а не состоянию фильтров UI.
export type TCatalogQuery = {
  search?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  filter?: Partial<
    Record<
      'price' | 'volume' | 'diameter' | 'height' | 'minQty',
      {
        from_value?: number;
        to_value?: number;
      }
    >
  > & { minParty?: number | string };
};

export type TEquipmentQuery = Pick<TCatalogQuery, 'search' | 'page' | 'perPage'>;
export type TJarCode = { elementCode: string; sectionCode: string };
export type TSamplesAvailabilityResponse = { canSubmit: boolean; reason?: string };

export type TRequestSamples = {
  fio: string;
  email: string;
  phone: string;
  consent: boolean;
  jars: { productId: string; withLid: boolean }[];
  deliveryType: 'pickup' | 'delivery';
  deliveryCity: string;
  deliveryStreet: string;
  deliveryHouse: string;
  deliveryFlat: string;
  deliveryPointType: 'pvz' | 'door';
  captchaToken: string;
};
