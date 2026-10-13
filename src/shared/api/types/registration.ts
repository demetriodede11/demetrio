import type { TAuthResponse } from './auth';

export type TCounterpartyType = 'individual' | 'company';

export type TRegistrationStageData = {
  INN: string | null;
  PHONE: string | null;
  COUNTERPARTY: string | null;
  COUNTERPARTY_TYPE: string | null;
  EMAIL: string | null;
  FULL_NAME: string | null;
};

export type TRegistrationStageRequest = { login: string };

export type TRegistrationStageResponse = {
  login: string;
  stage: number;
  canResendCode: boolean;
  resendCodeAttempts: number;
  blocked: boolean;
  stageData: TRegistrationStageData | null;
};

export type TRegistrationFirstStageRequest = {
  phoneNumber: string;
  inn: string;
  counterpartyType: TCounterpartyType;
  agreement: boolean;
};
export type TRegistrationFirstStageResponse = TRegistrationStageResponse;
export type TRegistrationSecondStageRequest = { code: string; login: string };
export type TRegistrationSecondStageResponse = TRegistrationStageResponse;
export type TRegistrationSecondStageErrorData = {
  login: string;
  stage: number;
  result: boolean;
  accessCodeAttempts: number;
  blocked: boolean;
  stageData: TRegistrationStageData | null;
};
export type TRegistrationThirdStageRequest = {
  phoneNumber: string;
  email: string;
  fullName: string;
};
export type TRegistrationThirdStageResponse = TRegistrationStageResponse;
export type TRegistrationFourthStageRequest = {
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
};
export type TRegistrationFourthStageResponse = TAuthResponse;
