import * as inspectionMocks from "@/lib/admin-inspection-mocks";

export const InspectionRepositoryMock = {
  getTypeOptions: () => inspectionMocks.INSPECTION_TYPE_OPTIONS,
  getModules: () => inspectionMocks.INSPECTION_MODULES,
  getDiagramZones: () => inspectionMocks.DIAGRAM_INSPECTION_ZONES,
  getTechnicalTimeline: () => inspectionMocks.TECHNICAL_TIMELINE,
  getDefaultKart: () => inspectionMocks.DEFAULT_INSPECTION_KART,
  getMockDiagnosis: () => inspectionMocks.MOCK_DIAGNOSIS,
  getSignatureStaff: () => inspectionMocks.SIGNATURE_STAFF,
  getGeneralConditionMeta: () => inspectionMocks.GENERAL_CONDITION_META,
  buildInitialItemStates: inspectionMocks.buildInitialItemStates,
  computeInspectionResult: inspectionMocks.computeInspectionResult,
};
