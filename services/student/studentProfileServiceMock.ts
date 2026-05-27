import { RegisterPilotRepositoryMock } from "@/repositories/student/RegisterPilotRepositoryMock";
import { StudentProfileRepositoryMock } from "@/repositories/student/StudentProfileRepositoryMock";

export const StudentProfileServiceMock = {
  getProfileCategories: StudentProfileRepositoryMock.getProfileCategories,
  getProfileLevels: StudentProfileRepositoryMock.getProfileLevels,
  getBrazilStates: StudentProfileRepositoryMock.getBrazilStates,
  formatProfileName: StudentProfileRepositoryMock.formatProfileName,
  getCategoryLabel: StudentProfileRepositoryMock.getCategoryLabel,
  getLevelLabel: StudentProfileRepositoryMock.getLevelLabel,
  shouldShowPilotData: StudentProfileRepositoryMock.shouldShowPilotData,
  getAutoPilotCategory: StudentProfileRepositoryMock.getAutoPilotCategory,
  getDisplayPilotCategory: StudentProfileRepositoryMock.getDisplayPilotCategory,
  formatBirthDateDisplay: StudentProfileRepositoryMock.formatBirthDateDisplay,
  getProfileNavSections: StudentProfileRepositoryMock.getProfileNavSections,
  formatPhoneBr: StudentProfileRepositoryMock.formatPhoneBr,
  getAgeFromBirthDate: StudentProfileRepositoryMock.getAgeFromBirthDate,
  isMinorProfile: StudentProfileRepositoryMock.isMinorProfile,
  formatProfileAcceptedDate: StudentProfileRepositoryMock.formatProfileAcceptedDate,
  getProfileAccount: StudentProfileRepositoryMock.getProfileAccount,
  getSwitcherOptions: StudentProfileRepositoryMock.getSwitcherOptions,
  formatCpf: StudentProfileRepositoryMock.formatCpf,
  getRegisterPilotPath: RegisterPilotRepositoryMock.getRegisterPilotPath,
  getRelationshipDegreeOptions:
    RegisterPilotRepositoryMock.getRelationshipDegreeOptions,
  getRegisterPilotFieldErrors: RegisterPilotRepositoryMock.getRegisterPilotFieldErrors,
  hasRegisterPilotErrors: RegisterPilotRepositoryMock.hasRegisterPilotErrors,
  buildRegisterPilotUsername: RegisterPilotRepositoryMock.buildRegisterPilotUsername,
};
