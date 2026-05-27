import * as registerMocks from "@/lib/register-pilot-mocks";

export const RegisterPilotRepositoryMock = {
  getRegisterPilotPath: () => registerMocks.REGISTER_PILOT_PATH,
  getRelationshipDegreeOptions: () => registerMocks.RELATIONSHIP_DEGREE_OPTIONS,
  getRegisterPilotFieldErrors: registerMocks.getRegisterPilotFieldErrors,
  hasRegisterPilotErrors: registerMocks.hasRegisterPilotErrors,
  buildRegisterPilotUsername: registerMocks.buildRegisterPilotUsername,
  formatCpf: registerMocks.formatCpf,
  formatPhoneBr: registerMocks.formatPhoneBr,
  getAutoPilotCategory: registerMocks.getAutoPilotCategory,
};
