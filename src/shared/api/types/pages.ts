import type { TMeta } from './common';

export type TDocumentType = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx';

export type TDocumentCategory = {
  label: string;
  value: string;
};

export type TDocumentCard = {
  title: string;
  type: TDocumentType;
  url: string;
  date_from?: string;
  date_to?: string;
  category: TDocumentCategory;
};

export type TDocumentListResponse = {
  meta?: TMeta;
  items: TDocumentCard[];
};

export type TFaqItem = {
  question: string;
  answer: string;
};

export type TFaqListResponse = {
  items: TFaqItem[];
  meta: TMeta;
};

export type TContactItem = {
  type: 'phone' | 'email';
  value: string;
};

export type TWorkSchedule = {
  workDays: string;
  dinnerTime: string;
  workTime: string;
};

export type TContactsData = {
  meta?: TMeta;
  address: string;
  workTime: TWorkSchedule;
  mapScript: string;
  contacts: TContactItem[];
  coordinare: {
    lat: number;
    lon: number;
  };
};

export type TContactsResponse = TContactsData;

export type TStaticPageResponse = {
  NAME: string;
  DETAIL_TEXT: string;
  meta: TMeta;
};

export type TBitrixBlockName =
  | 'mainBanner'
  | 'marketLeader'
  | 'capsTypes'
  | 'whoWeAre'
  | 'team'
  | 'ideal'
  | 'brands';

export type TMainBannerBlock = {
  blockName: 'mainBanner';
  title: string;
  description: string;
  /** URL превью для desktop */
  previewFrameDesktop?: string;
  /** URL превью для mobile */
  previewFrameMobile?: string;
};

export type TMarketLeaderBlockProduct = {
  name: string;
  image: string;
  link: string;
};

export type TMarketLeaderBlock = {
  blockName: 'marketLeader';
  blockTitle: string;
  title: string;
  products: TMarketLeaderBlockProduct[];
};

export type TCapsTypesBlockItem = {
  name: string;
  description: string;
  video: string;
};

export type TCapsTypesBlock = {
  blockName: 'capsTypes';
  items: TCapsTypesBlockItem[];
};

export type TWhoWeAreBlockAdvantage = {
  title: string;
  text: string;
};

export type TWhoWeAreBlock = {
  blockName: 'whoWeAre';
  blockTitle: string;
  title: string;
  logo: string;
  advantages: TWhoWeAreBlockAdvantage[];
};

export type TTeamBlock = {
  blockName: 'team';
  title: string;
  link: string;
  fullName: string;
  position: string;
  backgroundImage: string;
  foregroundImage?: string;
};

export type TIdealBlock = {
  blockName: 'ideal';
  blockTitle: string;
  title: string;
  video: string;
};

export type TBrandsBlockItem = {
  name: string;
  image: string;
};

export type TBrandsBlock = {
  blockName: 'brands';
  title: string;
  items: TBrandsBlockItem[];
};

export type TMainPageBlock =
  | TMainBannerBlock
  | TMarketLeaderBlock
  | TCapsTypesBlock
  | TWhoWeAreBlock
  | TTeamBlock
  | TIdealBlock
  | TBrandsBlock;

export type TMainPageResponse = {
  meta: TMeta;
  blocks: TMainPageBlock[];
};

export type TAboutBlockName =
  | 'aboutBanner'
  | 'aboutCompanyOverview'
  | 'aboutTeam'
  | 'aboutAdvantages'
  | 'aboutProduction'
  | 'aboutIndividualSolutions'
  | 'aboutEco'
  | 'aboutCertificates';

export type TAboutBannerBlock = {
  blockName: 'aboutBanner';
  title: string;
  image: string;
};

export type TAboutCompanyOverviewAdvantage = {
  title: string;
  text: string;
};

export type TAboutCompanyOverviewBlock = {
  blockName: 'aboutCompanyOverview';
  blockTitle: string;
  title: string;
  textWhite: string;
  textGray: string;
  advantages: TAboutCompanyOverviewAdvantage[];
};

export type TAboutTeamMember = {
  fullName: string;
  position: string;
  photo: string;
};

export type TAboutTeamBlock = {
  blockName: 'aboutTeam';
  blockTitle: string;
  title: string;
  textWhite: string;
  textGray: string;
  members: TAboutTeamMember[];
};

export type TAboutAdvantagesItem = {
  icon: string;
  title: string;
  text: string;
};

export type TAboutAdvantagesBlock = {
  blockName: 'aboutAdvantages';
  blockTitle: string;
  title: string;
  items: TAboutAdvantagesItem[];
};

export type TAboutProductionBlock = {
  blockName: 'aboutProduction';
  blockTitle: string;
  title: string;
  image: string;
};

export type TAboutIndividualSolutionsCard = {
  image: string;
  link: string;
  buttonText: string;
};

export type TAboutIndividualSolutionsBlock = {
  blockName: 'aboutIndividualSolutions';
  blockTitle: string;
  title: string;
  cards: TAboutIndividualSolutionsCard[];
};

export type TAboutEcoItem = {
  icon: string;
  title: string;
  text: string;
};

export type TAboutEcoBlock = {
  blockName: 'aboutEco';
  blockTitle: string;
  title: string;
  items: TAboutEcoItem[];
};

export type TAboutCertificatesItem = {
  name: string;
  file: string;
};

export type TAboutCertificatesBlock = {
  blockName: 'aboutCertificates';
  blockTitle: string;
  title: string;
  items: TAboutCertificatesItem[];
};

export type TAboutPageBlock =
  | TAboutBannerBlock
  | TAboutCompanyOverviewBlock
  | TAboutTeamBlock
  | TAboutAdvantagesBlock
  | TAboutProductionBlock
  | TAboutIndividualSolutionsBlock
  | TAboutEcoBlock
  | TAboutCertificatesBlock;

export type TAboutPageResponse = {
  meta: TMeta;
  blocks: TAboutPageBlock[];
};
