import * as profileMocks from "@/lib/student-profile-mocks";

export const StudentProfileRepositoryMock = {
  getProfileCategories: () => profileMocks.PROFILE_CATEGORIES,
  getProfileLevels: () => profileMocks.PROFILE_LEVELS,
  getBrazilStates: () => profileMocks.BRAZIL_STATES,
  formatProfileName: profileMocks.formatProfileName,
  getCategoryLabel: profileMocks.getCategoryLabel,
  getLevelLabel: profileMocks.getLevelLabel,
  shouldShowPilotData: profileMocks.shouldShowPilotData,
  getAutoPilotCategory: profileMocks.getAutoPilotCategory,
  getDisplayPilotCategory: profileMocks.getDisplayPilotCategory,
  formatBirthDateDisplay: profileMocks.formatBirthDateDisplay,
  formatBirthDateBrazil: profileMocks.formatBirthDateBrazil,
  getProfileNavSections: profileMocks.getProfileNavSections,
  formatPhoneBr: profileMocks.formatPhoneBr,
  getAgeFromBirthDate: profileMocks.getAgeFromBirthDate,
  isMinorProfile: profileMocks.isMinorProfile,
  formatProfileAcceptedDate: profileMocks.formatProfileAcceptedDate,
  formatProfileConsentDateTime: profileMocks.formatProfileConsentDateTime,
  getProfileAccount: profileMocks.getProfileAccount,
  getSwitcherOptions: profileMocks.getSwitcherOptions,
  formatCpf: profileMocks.formatCpf,
};
