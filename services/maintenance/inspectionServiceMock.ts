import { InspectionRepositoryMock } from "@/repositories/maintenance/InspectionRepositoryMock";

export const InspectionServiceMock = {
  getTypeOptions: () => InspectionRepositoryMock.getTypeOptions(),
  getModules: () => InspectionRepositoryMock.getModules(),
  getDiagramZones: () => InspectionRepositoryMock.getDiagramZones(),
  getTechnicalTimeline: () => InspectionRepositoryMock.getTechnicalTimeline(),
  getDefaultKart: () => InspectionRepositoryMock.getDefaultKart(),
  getMockDiagnosis: () => InspectionRepositoryMock.getMockDiagnosis(),
  getSignatureStaff: () => InspectionRepositoryMock.getSignatureStaff(),
  getGeneralConditionMeta: () => InspectionRepositoryMock.getGeneralConditionMeta(),
  buildInitialItemStates: InspectionRepositoryMock.buildInitialItemStates,
  computeInspectionResult: InspectionRepositoryMock.computeInspectionResult,
};
