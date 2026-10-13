import type { TCurrency } from './catalog';

export type TProfileUserData = {
  fio: string;
  email: string;
  phone: string;
};

export type TProfileCompanyData = {
  inn: string;
  companyName: string;
};

export type TPersonalProfile = {
  userData: TProfileUserData;
  companyData: TProfileCompanyData;
  emailConfirmed: boolean;
  samplesRequested: boolean;
};

export type TPersonalProfileEditRequest = {
  fio: string;
  email: string;
  /** Старый фронтенд передаёт это поле, но текущий backend его не обновляет. */
  phone?: string;
};

export type THeaderNotification = { count: number } | '99+';

export type TNotification = {
  id: string;
  title: string;
  text: string;
  date: string;
  isRead: boolean;
};

export type TNotificationList = {
  items: TNotification[];
};

export type TNotificationMarkAsReadRequest = {
  ids: string[];
};

export type TNotificationDeleteRequest = {
  ids: string[];
};

export type TPasswordChangeRequest = {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
};

export type TProfileEmailConfirmRequest = {
  email: string;
};

export type TProfileEmailConfirmSuccessRequest = {
  code: string;
};

export type TOrderStatus = {
  code: string;
  name: string;
};

export type TOrderCard = {
  id: string;
  createdAt: string | null;
  number: string;
  uniqueItemsCount: number;
  canDownloadInvoice: boolean;
  totalItemsCount: number;
  totalWeightKg: number;
  status: TOrderStatus;
  productImageUrls: string[];
  totalPrice: {
    value: number;
    currency: string;
  };
  invoice: TOrderInvoice | null;
};

export type TOrdersListResponse = {
  items: TOrderCard[];
  statuses: { CURRENT_STATUSES: TOrderStatus[]; HISTORY_STATUSES: TOrderStatus[] };
};

export type TCancelOrderRequest = {
  id: string;
};

export type TRepeatOrderRequest = {
  id: string;
};

export type TRepeatOrderResponse = {
  success: boolean;
  /** Количество добавленных в корзину позиций. */
  addedItemsCount: number;
};

export type TDownloadOrderInvoiceRequest = {
  id: string;
};

export type TOrderMoney = {
  value: number;
  currency: TCurrency;
};

export type TOrderItem = {
  productId: string;
  name: string;
  imageUrl: string;
  price: {
    value: number;
    baseValue: number;
    currency: TCurrency;
  };
  qty: number;
  weightKg: number;
  totalPrice: TOrderMoney;
};

export type TCheckoutUserInfo = {
  fio: string;
  email: string;
  phone: string;
  emailConfirmed: boolean;
};

export type TCheckoutCompanyInfo = {
  inn: string;
  companyName: string;
  bik: string;
  checkingAccount: string;
  legalAddress: string;
  consigneeAddress: string;
};

export type TOrderSummary = {
  totalQty: number;
  totalWeightKg: number;
  subtotalPrice: TOrderMoney;
  discount: TOrderMoney;
  totalPrice: TOrderMoney;
};

export type TOrderDetail = {
  items: TOrderItem[];
  userInfo: TCheckoutUserInfo;
  companyInfo: TCheckoutCompanyInfo;
  orderSummary: TOrderSummary;
};

export type TOrderDetailResponse = TOrderDetail;

export type TMakeOrderRequest = {
  fio: string;
  email: string;
  bik: string;
  checkingAccount: string;
  legalAddress: string;
  consigneeAddress: string;
  comment: string;
  pdConsent: boolean;
};

export type TMakeOrderResponseData = {
  orderId: string;
  orderNumber: string;
};

export type TMakeOrderResponse = TMakeOrderResponseData;

export type TPersonalOrderItem = {
  basePricePerUnit: number;
  currency: TCurrency;
  imageUrl: string;
  name: string;
  pricePerUnit: number;
  productId: string;
  qty: number;
  total: number;
  weightKgPerUnit: number;
};

export type TPersonalOrderSummary = {
  currency: TCurrency;
  discount: number;
  subtotal: number;
  total: number;
  totalItemsCount: number;
  totalWeightKg: number;
};

export type TPersonalOrder = {
  canDownloadInvoice: boolean;
  canRepeat: boolean;
  createdAt: string | null;
  id: string;
  invoice: TOrderInvoice | null;
  isCancellable: boolean;
  items: TPersonalOrderItem[];
  number: string;
  recipient: {
    fio: string;
    phone: string;
  };
  status: {
    code: string;
    name: string;
  };
  summary: TPersonalOrderSummary;
  comment: string;
};

export type TOrderInvoice = {
  documentNumber: string;
  documentDate: string | null;
  documentLink: string;
};
