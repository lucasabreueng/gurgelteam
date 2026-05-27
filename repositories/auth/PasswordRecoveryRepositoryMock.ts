import * as recoveryMocks from "@/lib/password-recovery-mocks";

export const PasswordRecoveryRepositoryMock = {
  getResendCooldownSeconds: () => recoveryMocks.RESEND_COOLDOWN_SECONDS,
  getMockRecoveryCode: () => recoveryMocks.MOCK_RECOVERY_CODE,
  getResetPath: () => recoveryMocks.RECOVERY_RESET_PATH,
  getSessionKey: () => recoveryMocks.RECOVERY_SESSION_KEY,
  setRecoveryVerified: recoveryMocks.setRecoveryVerified,
  getRecoveryVerified: recoveryMocks.getRecoveryVerified,
  clearRecoveryVerified: recoveryMocks.clearRecoveryVerified,
  isValidRecoveryIdentifier: recoveryMocks.isValidRecoveryIdentifier,
  resolveRecoveryAccount: recoveryMocks.resolveRecoveryAccount,
  isRegisteredRecoveryIdentifier: recoveryMocks.isRegisteredRecoveryIdentifier,
  getRecoveryIdentifierError: recoveryMocks.getRecoveryIdentifierError,
  maskRecoveryTarget: recoveryMocks.maskRecoveryTarget,
  isValidRecoveryCode: recoveryMocks.isValidRecoveryCode,
  formatCooldown: recoveryMocks.formatCooldown,
};
