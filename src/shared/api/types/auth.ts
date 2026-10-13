export type TAuthRequest = {
  login: string;
  password: string;
};

export type TAuthResponse = {
  sessid: string;
  blocked: boolean;
  result: boolean;
  remainingAttempts: number;
};

export type TUserInfo = {
  id: number;
  fio: string;
  sessid: string;
  samplesRequested: boolean;
};
