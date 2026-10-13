import type { TCurrency, TFeature, TSteppedPrice, TCatalogProductCategory } from './catalog';

export type TBasketMoney = {
  value: number;
  currency: TCurrency;
};

export type TBasketUnitPrice = {
  value: number;
  baseValue: number;
  currency: TCurrency;
};

export type TBasketSteppedPrice = TSteppedPrice;

export type TBasketLid = {
  basketItemId: number;
  productId: number;
  name: string;
  imageUrl?: string;
  weightKg?: number;
  selected: boolean;
  pricePerUnit: number;
  qty: number;
  totalPrice: number;
  isActive: boolean;
};

export type TBasketAvailableLid = {
  productId: number;
  name: string;
  model: string;
  imageUrl?: string;
  weightKg?: number;
  price: number;
  selected: boolean;
  isActive: boolean;
  features: TFeature[];
};

export type TBasketJarItem = {
  type: 'jar';
  basketItemId: number;
  productId: number;
  name: string;
  imageUrl: string;
  features: TFeature[];
  price: TBasketUnitPrice;
  steppedPrices?: TBasketSteppedPrice[];
  qty: number;
  minQty: number;
  alias: string;
  stepQty: number;
  totalPrice: TBasketMoney;
  isActive: boolean;
  lids: TBasketLid[];
  availableLids: TBasketAvailableLid[];
  category: TCatalogProductCategory;
};

export type TBasketEquipmentItem = {
  type: 'equipment';
  basketItemId: number;
  productId: number;
  name: string;
  imageUrl: string;
  features: TFeature[];
  price: TBasketUnitPrice;
  qty: number;
  maxQty: number;
  minQty: 1;
  stepQty: 1;
  totalPrice: TBasketMoney;
  isActive: boolean;
  alias: string;
};

export type TBasketItem = TBasketJarItem | TBasketEquipmentItem;

export type TBasketSummary = {
  totalQty: number;
  totalWeightKg: number;
  subtotalPrice: TBasketMoney;
  discount: TBasketMoney;
  totalPrice: TBasketMoney;
  jarTotalQty: number;
  jarMaxTotalQty: number;
};

export type TBasketData = {
  items: TBasketItem[];
  summary: TBasketSummary;
  hasDeactivatedItems: boolean;
};

export type TAddLidFromBasketRequest = {
  lidProductId: number;
  jarProductId: number;
  qty: number;
};

export type TRemoveLidFromBasketRequest = {
  lidProductId: number;
  jarProductId: number;
};

export type TAddToCartRequest = {
  productId: number;
  qty: number;
};

export type TAddToCartResponse = {
  success: boolean;
  basketItemId?: number;
  qty?: number;
};

export type TCartCountProduct = {
  id: number;
  count: number;
};

export type TCartCountResponse = {
  totalCount: number;
  productsInCart: TCartCountProduct[];
  jarTotalQty: number;
  jarMaxTotalQty: number;
};

export type TAddLidRequest = {
  lidProductId: number;
  jarProductId: number;
  qty?: number;
};

export type TAddLidResponse = {
  success: boolean;
  basketItemId?: number;
  qty?: number;
};

export type TBasketRemoveRequest = { productId: number };
export type TBasketClearResponse = { success: boolean };
