export interface THeaderLink {
  /**
   * URL-адрес ссылки.
   */
  url: string;
  /**
   * Текст ссылки, отображаемый пользователю.
   */
  title: string;
  /**
   * URL изображения категории.
   */
  imageUrl?: string;
  /**
   * Дочерние ссылки.
   */
  childs?: THeaderLink[];
}

export interface THeader {
  /**
   * Массив ссылок для меню хедера.
   */
  menu: THeaderLink[];
  /**
   * Массив ссылок для каталога.
   */
  catalog: THeaderLink[];
  /**
   * Телефон для хедера.
   */
  phone: string;
}

export interface TFooter {
  /**
   * @property {Array<{url: string, title: string}>} menu - Массив объектов для пунктов меню футера.
   */
  menu: {
    url: string;
    title: string;
  }[];
  /**
   * @property {object} contacts - Объект с контактной информацией.
   */
  contacts: {
    phone: string;
    email: string;
    workDays: string;
    workTime: string;
  };
  /**
   * @property {Array<{url: string, title: string}>} policyLinks - Массив объектов для ссылок на политику конфиденциальности и другие документы.
   */
  policyLinks: {
    url: string;
    title: string;
  }[];
  /**
   * @property {Array<{name: string, value: string}>} requisites - Массив объектов для реквизитов компании.
   */
  requisites: {
    name: string;
    value: string;
  }[];
  /**
   * @property {string} companyName - Название компании.
   */
  companyName: string;
}
