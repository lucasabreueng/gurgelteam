import {
  findAccountByIdentifier,
  generateAvailableUsername,
  parseLoginIdentifier,
} from "@/lib/auth-accounts-mocks";
import {
  CADASTRO_MOCK,
  formatCpf,
  getCadastroFieldErrors,
  getPasswordRuleLabels,
  getFailedPasswordRuleLabels,
  getPasswordRuleStatus,
  hasCadastroFieldErrors,
  isPasswordValid,
  isUnder14,
  type CadastroFieldErrors,
} from "@/lib/cadastro-mocks";
import { getLoginIdentifierError, LOGIN_MOCK } from "@/lib/login-mocks";

export const AuthRepositoryMock = {
  getLoginMock: () => LOGIN_MOCK,
  getCadastroMock: () => CADASTRO_MOCK,
  getLoginIdentifierError,
  findAccountByIdentifier,
  parseLoginIdentifier,
  generateAvailableUsername,
  formatCpf,
  getCadastroFieldErrors,
  hasCadastroFieldErrors,
  isUnder14,
  isPasswordValid,
  getPasswordRuleStatus,
  getPasswordRuleLabels,
  getFailedPasswordRuleLabels,
};

export type { CadastroFieldErrors };
