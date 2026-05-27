import type { CadastroDTO, LoginDTO } from "@/lib/contracts/auth/auth.types";
import type {
  PasswordRecoveryIdentifierDTO,
  PasswordRecoveryVerifyCodeDTO,
  ResetPasswordDTO,
} from "@/lib/contracts/auth/auth.types";
import {
  hasResetPasswordErrors,
  validateCadastroForm,
  validateLoginForm,
  validateRecoveryCodeForm,
  validateRecoveryIdentifierForm,
  validateResetPasswordForm,
  type LoginFormErrors,
  type ResetPasswordFormErrors,
} from "@/lib/auth/validate-auth-forms";
import type { CadastroFieldErrors } from "@/repositories/auth/AuthRepositoryMock";
import { AuthRepositoryMock } from "@/repositories/auth/AuthRepositoryMock";
import { PasswordRecoveryRepositoryMock } from "@/repositories/auth/PasswordRecoveryRepositoryMock";

export const AuthServiceMock = {
  getLoginConfig: () => AuthRepositoryMock.getLoginMock(),
  getCadastroConfig: () => AuthRepositoryMock.getCadastroMock(),
  validateLoginIdentifier: AuthRepositoryMock.getLoginIdentifierError,
  findAccountByIdentifier: AuthRepositoryMock.findAccountByIdentifier,
  parseLoginIdentifier: AuthRepositoryMock.parseLoginIdentifier,
  generateAvailableUsername: AuthRepositoryMock.generateAvailableUsername,
  formatCpf: AuthRepositoryMock.formatCpf,
  getCadastroFieldErrors: AuthRepositoryMock.getCadastroFieldErrors,
  hasCadastroFieldErrors: AuthRepositoryMock.hasCadastroFieldErrors,
  isUnder14: AuthRepositoryMock.isUnder14,
  isPasswordValid: AuthRepositoryMock.isPasswordValid,
  getPasswordRuleStatus: AuthRepositoryMock.getPasswordRuleStatus,
  getPasswordRuleLabels: AuthRepositoryMock.getPasswordRuleLabels,
  getFailedPasswordRuleLabels: AuthRepositoryMock.getFailedPasswordRuleLabels,
  validateLoginForm: (input: LoginDTO) => validateLoginForm(input),
  validateCadastroForm: (input: CadastroDTO) => validateCadastroForm(input),
  validateRecoveryIdentifierForm: (input: PasswordRecoveryIdentifierDTO) =>
    validateRecoveryIdentifierForm(input),
  validateRecoveryCodeForm: (input: PasswordRecoveryVerifyCodeDTO) =>
    validateRecoveryCodeForm(input),
  validateResetPasswordForm: (input: ResetPasswordDTO) =>
    validateResetPasswordForm(input),
  hasResetPasswordErrors,
  getRecoveryResendCooldownSeconds: () =>
    PasswordRecoveryRepositoryMock.getResendCooldownSeconds(),
  getRecoveryResetPath: () => PasswordRecoveryRepositoryMock.getResetPath(),
  resolveRecoveryAccount: PasswordRecoveryRepositoryMock.resolveRecoveryAccount,
  maskRecoveryTarget: PasswordRecoveryRepositoryMock.maskRecoveryTarget,
  setRecoveryVerified: PasswordRecoveryRepositoryMock.setRecoveryVerified,
  getRecoveryVerified: PasswordRecoveryRepositoryMock.getRecoveryVerified,
  clearRecoveryVerified: PasswordRecoveryRepositoryMock.clearRecoveryVerified,
  formatRecoveryCooldown: PasswordRecoveryRepositoryMock.formatCooldown,
  isValidRecoveryCode: PasswordRecoveryRepositoryMock.isValidRecoveryCode,
  getRecoveryIdentifierError:
    PasswordRecoveryRepositoryMock.getRecoveryIdentifierError,
};

export type { CadastroFieldErrors, LoginFormErrors, ResetPasswordFormErrors };
