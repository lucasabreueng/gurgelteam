export type LoginDTO = {
  identifier: string;
  password: string;
  remember: boolean;
};

export type CadastroDTO = {
  firstName: string;
  lastName: string;
  birthDate: string;
  cpf: string;
  email: string;
  password: string;
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
  acceptedImageUsage: boolean;
};

export type PasswordRecoveryIdentifierDTO = {
  identifier: string;
};

export type PasswordRecoveryVerifyCodeDTO = {
  code: string; // 6 digits
};

export type ResetPasswordDTO = {
  password: string;
  confirmPassword: string;
};

