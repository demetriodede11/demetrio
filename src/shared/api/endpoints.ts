import type {
  TAboutPageResponse,
  TAddLidRequest,
  TAddLidResponse,
  TAddToCartRequest,
  TAddToCartResponse,
  TApiEndpoint,
  TAuthRequest,
  TAuthResponse,
  TBasketClearResponse,
  TBasketData,
  TBasketRemoveRequest,
  TBitrixContract,
  TCancelOrderRequest,
  TCartCountResponse,
  TCatalogCategoryResponse,
  TCatalogEquipmentResponse,
  TCatalogQuery,
  TContactsResponse,
  TDadataAddressData,
  TDadataAddressQuery,
  TDadataBankData,
  TDadataBankQuery,
  TDadataResponse,
  TDocumentListResponse,
  TDownloadOrderInvoiceRequest,
  TEquipmentDetailResponse,
  TEquipmentQuery,
  TFaqListResponse,
  TFooter,
  THeader,
  THeaderNotification,
  THttpContract,
  TJarCode,
  TJarDetailResponse,
  TMainPageResponse,
  TMakeOrderRequest,
  TMakeOrderResponse,
  TNotificationDeleteRequest,
  TNotificationList,
  TNotificationMarkAsReadRequest,
  TOrderDetailResponse,
  TOrdersListResponse,
  TPasswordChangeRequest,
  TPasswordRecoveryFinalizeRequest,
  TPasswordRecoveryFinalizeResponse,
  TPasswordRecoveryStartRequest,
  TPasswordRecoveryStartResponse,
  TPasswordRecoveryVerifyCodeRequest,
  TPasswordRecoveryVerifyCodeResponse,
  TPersonalOrder,
  TPersonalProfile,
  TPersonalProfileEditRequest,
  TProfileEmailConfirmRequest,
  TRegistrationFirstStageRequest,
  TRegistrationFirstStageResponse,
  TRegistrationFourthStageRequest,
  TRegistrationFourthStageResponse,
  TRegistrationSecondStageErrorData,
  TRegistrationSecondStageRequest,
  TRegistrationSecondStageResponse,
  TRegistrationStageRequest,
  TRegistrationStageResponse,
  TRegistrationThirdStageRequest,
  TRegistrationThirdStageResponse,
  TRemoveLidFromBasketRequest,
  TRepeatOrderRequest,
  TRepeatOrderResponse,
  TRequestSamples,
  TSamplesAvailabilityResponse,
  TStaticPageResponse,
  TTypedApiEndpoint,
  TUserInfo,
} from './types';

const defineEndpoint =
  <TContract extends THttpContract<unknown, unknown, unknown, unknown>>() =>
  <const TEndpoint extends TApiEndpoint>(endpoint: TEndpoint) =>
    endpoint as TEndpoint & TTypedApiEndpoint<TContract>;

// Все пути относительны к /bxapi/v1. Метод, путь и контракт операции объявляются вместе.
export const API_ENDPOINT = {
  header: defineEndpoint<TBitrixContract<THeader>>()({ method: 'GET', path: '/layout/header' }),
  footer: defineEndpoint<TBitrixContract<TFooter>>()({ method: 'GET', path: '/layout/footer' }),
  documents: defineEndpoint<TBitrixContract<TDocumentListResponse>>()({
    method: 'GET',
    path: '/document/list',
  }),
  faq: defineEndpoint<TBitrixContract<TFaqListResponse>>()({ method: 'GET', path: '/faq' }),
  contacts: defineEndpoint<TBitrixContract<TContactsResponse>>()({
    method: 'GET',
    path: '/contacts',
  }),
  staticPage: defineEndpoint<TBitrixContract<TStaticPageResponse, never, { code: string }>>()({
    method: 'GET',
    path: '/pages/{code}',
  }),
  main: defineEndpoint<TBitrixContract<TMainPageResponse>>()({ method: 'GET', path: '/main' }),
  about: defineEndpoint<TBitrixContract<TAboutPageResponse>>()({ method: 'GET', path: '/about' }),
  login: defineEndpoint<
    TBitrixContract<TAuthResponse, TAuthRequest, never, never, TAuthResponse>
  >()({ method: 'POST', path: '/auth/login' }),
  logout: defineEndpoint<TBitrixContract<boolean>>()({ method: 'POST', path: '/auth/logout' }),
  userInfo: defineEndpoint<TBitrixContract<TUserInfo | null>>()({
    method: 'GET',
    path: '/auth/user.info',
  }),
  registrationCurrent: defineEndpoint<
    TBitrixContract<TRegistrationStageResponse, TRegistrationStageRequest>
  >()({ method: 'POST', path: '/registration/stage/current' }),
  registrationFirst: defineEndpoint<
    TBitrixContract<TRegistrationFirstStageResponse, TRegistrationFirstStageRequest>
  >()({ method: 'POST', path: '/registration/stage/first' }),
  registrationSecond: defineEndpoint<
    TBitrixContract<
      TRegistrationSecondStageResponse,
      TRegistrationSecondStageRequest,
      never,
      never,
      TRegistrationSecondStageErrorData
    >
  >()({ method: 'POST', path: '/registration/stage/second' }),
  registrationThird: defineEndpoint<
    TBitrixContract<TRegistrationThirdStageResponse, TRegistrationThirdStageRequest>
  >()({ method: 'POST', path: '/registration/stage/third' }),
  registrationFourth: defineEndpoint<
    TBitrixContract<
      TRegistrationFourthStageResponse,
      TRegistrationFourthStageRequest,
      never,
      never,
      TAuthResponse
    >
  >()({ method: 'POST', path: '/registration/stage/fourth' }),
  recoveryStart: defineEndpoint<
    TBitrixContract<TPasswordRecoveryStartResponse, TPasswordRecoveryStartRequest>
  >()({ method: 'POST', path: '/recovery/start' }),
  recoveryVerify: defineEndpoint<
    TBitrixContract<
      TPasswordRecoveryVerifyCodeResponse,
      TPasswordRecoveryVerifyCodeRequest,
      never,
      never,
      TPasswordRecoveryVerifyCodeResponse
    >
  >()({ method: 'POST', path: '/recovery/verify' }),
  recoveryFinalize: defineEndpoint<
    TBitrixContract<TPasswordRecoveryFinalizeResponse, TPasswordRecoveryFinalizeRequest>
  >()({ method: 'POST', path: '/recovery/finalize' }),
  basketGet: defineEndpoint<TBitrixContract<TBasketData>>()({ method: 'GET', path: '/basket/' }),
  basketCount: defineEndpoint<TBitrixContract<TCartCountResponse>>()({
    method: 'GET',
    path: '/basket/count',
  }),
  basketAdd: defineEndpoint<TBitrixContract<TAddToCartResponse, TAddToCartRequest>>()({
    method: 'POST',
    path: '/basket/add',
  }),
  basketAddLid: defineEndpoint<TBitrixContract<TAddLidResponse, TAddLidRequest>>()({
    method: 'POST',
    path: '/basket/add-lid',
  }),
  basketRemove: defineEndpoint<TBitrixContract<TBasketClearResponse, TBasketRemoveRequest>>()({
    method: 'POST',
    path: '/basket/remove',
  }),
  basketRemoveLid: defineEndpoint<
    TBitrixContract<TBasketClearResponse, TRemoveLidFromBasketRequest>
  >()({
    method: 'POST',
    path: '/basket/remove-lid',
  }),
  basketClear: defineEndpoint<TBitrixContract<TBasketClearResponse>>()({
    method: 'POST',
    path: '/basket/clear',
  }),
  category: defineEndpoint<
    TBitrixContract<TCatalogCategoryResponse, never, { id: string }, TCatalogQuery>
  >()({ method: 'GET', path: '/catalog/category/{id}' }),
  allCategories: defineEndpoint<
    TBitrixContract<TCatalogCategoryResponse, never, never, TCatalogQuery>
  >()({
    method: 'GET',
    path: '/catalog/category',
    availability: 'unverified',
    note: 'Объявлен во фронтенде, но отсутствует в проверенном backend-роутинге',
  }),
  equipment: defineEndpoint<
    TBitrixContract<TCatalogEquipmentResponse, never, never, TEquipmentQuery>
  >()({ method: 'GET', path: '/catalog/equipment' }),
  equipmentDetail: defineEndpoint<
    TBitrixContract<TEquipmentDetailResponse, never, { code: string }>
  >()({ method: 'GET', path: '/catalog/equipment/{code}' }),
  jarDetail: defineEndpoint<
    TBitrixContract<TJarDetailResponse, never, { sectionCode: string; elementCode: string }>
  >()({ method: 'GET', path: '/catalog/jars/{sectionCode}/{elementCode}' }),
  jarCodes: defineEndpoint<TBitrixContract<TJarCode[]>>()({
    method: 'GET',
    path: '/catalog/all/jars',
  }),
  equipmentCodes: defineEndpoint<TBitrixContract<string[]>>()({
    method: 'GET',
    path: '/catalog/all/equipment',
  }),
  priceList: defineEndpoint<THttpContract<Blob>>()({
    method: 'GET',
    path: '/catalog/export/price-list',
  }),
  requestSamples: defineEndpoint<
    TBitrixContract<{ success: boolean; resultId: number }, TRequestSamples>
  >()({ method: 'POST', path: '/catalog/samples/request' }),
  samplesAvailability: defineEndpoint<TBitrixContract<TSamplesAvailabilityResponse>>()({
    method: 'GET',
    path: '/catalog/samples/can-submit',
    availability: 'unverified',
    note: 'Объявлен во фронтенде, но отсутствует в проверенном backend-роутинге',
  }),
  profile: defineEndpoint<TBitrixContract<TPersonalProfile>>()({
    method: 'GET',
    path: '/personal/profile',
  }),
  profileEdit: defineEndpoint<TBitrixContract<TPersonalProfile>>()({
    method: 'GET',
    path: '/personal/profile/edit',
  }),
  updateProfile: defineEndpoint<TBitrixContract<null, TPersonalProfileEditRequest>>()({
    method: 'POST',
    path: '/personal/profile/edit',
  }),
  updatePassword: defineEndpoint<TBitrixContract<null, TPasswordChangeRequest>>()({
    method: 'POST',
    path: '/personal/profile-password-update',
  }),
  notifications: defineEndpoint<TBitrixContract<TNotificationList>>()({
    method: 'GET',
    path: '/personal/notification',
  }),
  deleteNotifications: defineEndpoint<TBitrixContract<null, TNotificationDeleteRequest>>()({
    method: 'POST',
    path: '/personal/notification',
  }),
  notificationCount: defineEndpoint<TBitrixContract<THeaderNotification>>()({
    method: 'GET',
    path: '/personal/notification-header',
  }),
  markNotificationsAsRead: defineEndpoint<TBitrixContract<null, TNotificationMarkAsReadRequest>>()({
    method: 'POST',
    path: '/personal/notification-header',
  }),
  requestEmailConfirmation: defineEndpoint<TBitrixContract<null, TProfileEmailConfirmRequest>>()({
    method: 'POST',
    path: '/personal/profile-email-confirm',
  }),
  confirmEmail: defineEndpoint<TBitrixContract<null, never, never, { check: string }>>()({
    method: 'GET',
    path: '/personal/mailconfirm/',
    availability: 'disabled',
    note: 'GET изменяет email; требуется отдельное решение о POST на backend',
  }),
  orders: defineEndpoint<TBitrixContract<TOrdersListResponse>>()({
    method: 'GET',
    path: '/personal/order',
  }),
  orderHistory: defineEndpoint<TBitrixContract<TOrdersListResponse>>()({
    method: 'GET',
    path: '/personal/order/history',
  }),
  orderDetail: defineEndpoint<TBitrixContract<TPersonalOrder, never, { id: string }>>()({
    method: 'GET',
    path: '/personal/order/{id}',
  }),
  checkout: defineEndpoint<TBitrixContract<TOrderDetailResponse>>()({
    method: 'GET',
    path: '/personal/order/make',
  }),
  makeOrder: defineEndpoint<TBitrixContract<TMakeOrderResponse, TMakeOrderRequest>>()({
    method: 'POST',
    path: '/personal/order/make',
  }),
  cancelOrder: defineEndpoint<TBitrixContract<{ success: boolean }, TCancelOrderRequest>>()({
    method: 'POST',
    path: '/personal/order/cancel',
  }),
  repeatOrder: defineEndpoint<TBitrixContract<TRepeatOrderResponse, TRepeatOrderRequest>>()({
    method: 'POST',
    path: '/personal/order/repeat',
  }),
  invoice: defineEndpoint<THttpContract<Blob, never, never, TDownloadOrderInvoiceRequest>>()({
    method: 'GET',
    path: '/personal/order/invoice',
  }),
  dadataAddress: defineEndpoint<
    THttpContract<TDadataResponse<TDadataAddressData>, TDadataAddressQuery>
  >()({ method: 'POST', path: '/dadata/suggest/address' }),
  dadataBank: defineEndpoint<THttpContract<TDadataResponse<TDadataBankData>, TDadataBankQuery>>()({
    method: 'POST',
    path: '/dadata/suggest/bank',
  }),
} as const;

export const isValidPathSegment = (value: string): boolean =>
  value !== '' &&
  !['.', '..'].includes(value) &&
  !/[/\\%]/.test(value) &&
  ![...value].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
