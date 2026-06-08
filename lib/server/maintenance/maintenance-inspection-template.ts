import {
  DIAGRAM_INSPECTION_ZONES,
  GENERAL_CONDITION_META,
  INSPECTION_MODULES,
  INSPECTION_TYPE_OPTIONS,
  MOCK_DIAGNOSIS,
  SIGNATURE_STAFF,
  TECHNICAL_TIMELINE,
} from "@/lib/admin-inspection-mocks";

export const maintenanceInspectionTemplateRepository = {
  getTemplate() {
    return {
      typeOptions: INSPECTION_TYPE_OPTIONS,
      modules: INSPECTION_MODULES,
      diagramZones: DIAGRAM_INSPECTION_ZONES,
      generalConditionMeta: GENERAL_CONDITION_META,
      signatureStaff: SIGNATURE_STAFF,
      technicalTimeline: TECHNICAL_TIMELINE,
      mockDiagnosis: MOCK_DIAGNOSIS,
    };
  },
};
