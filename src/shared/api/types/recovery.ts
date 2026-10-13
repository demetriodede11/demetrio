export type TPasswordRecoveryStartRequest = {
  login: string;
};

export type TPasswordRecoveryStartResponse = {
  login: string;
  canResendCode: boolean;
  resendCodeAttempts: number;
  blocked: boolean;
};

export type TPasswordRecoveryVerifyCodeRequest = {
  login: string;
  code: string;
};

export type TPasswordRecoveryVerifyCodeResponse = {
  result: boolean;
  accessCodeAttempts?: number;
  canResendCode?: boolean;
  blocked?: boolean;
};

export type TPasswordRecoveryFinalizeRequest = {
  login: string;
  password: string;
  passwordConfirm: string;
};

export type TPasswordRecoveryFinalizeResponse = {
  result: boolean;
  message: string;
};
