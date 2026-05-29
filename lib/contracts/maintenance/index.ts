export type {
  MaintenanceTabKey,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceType,
  ChecklistItemStatus,
  MaintenanceKpi,
  MaintenanceOrderListItem,
  MaintenanceAlert,
  ChecklistGroup,
  MaintenancePart,
  MaintenanceOrderDetail,
} from "@/lib/admin-maintenance-mocks";

export type {
  InspectionItemStatus,
  ChecklistTypeKey,
  OverallInspectionStatus,
  ChecklistKartContext,
  InspectionItemDef,
  InspectionSectionDef,
  ChecklistMediaPreview,
  DiagramMark,
} from "./checklist";

export type {
  InspectionTypeKey,
  ItemStatus,
  ItemSeverity,
  GeneralCondition,
  FinalResultStatus,
  AutoRecommendation,
  InspectionItemState,
  InspectionModuleItemDef,
  InspectionModuleDef,
  InspectionTypeOption,
  DiagramZoneKey,
  DiagramMark as InspectionDiagramMark,
} from "./inspection";

export type {
  KartOperationalStatus,
  InspectionItemKey,
  InspectionItemRating,
  MaintenanceCategory,
  SimpleMaintenanceType,
  SimpleMaintenanceStatus,
  MaintenanceSimpleKpi,
  MaintenanceSummaryKpi,
  MaintenanceFleetKart,
  MaintenanceActivityKind,
  MaintenanceActivity,
  MaintenancePartLine,
  SimpleInspectionForm,
  SimpleMaintenanceForm,
  MaintenanceDraftFromInspection,
  MaintenanceSimpleFilterState,
} from "./simple";

export {
  INSPECTION_ITEM_LABELS,
  KART_STATUS_LABELS,
} from "./simple";

export type {
  MaintenancePageTabKey,
  CompleteChecklistType,
  ChecklistItemRating,
  ChecklistFinalStatus,
  ChecklistTemplateItem,
  ChecklistTemplateGroup,
  ChecklistItemEvaluation,
  CompleteChecklistRecord,
  ChecklistHistoryRow,
  SimpleInspectionRow,
  SimpleMaintenanceRow,
  KartTechnicalTimelineEntry,
  InspectionListFilterState,
  MaintenanceListFilterState,
  ChecklistListFilterState,
} from "./complete-checklist";

export {
  COMPLETE_CHECKLIST_TYPE_LABELS,
  CHECKLIST_FINAL_STATUS_LABELS,
  CHECKLIST_ITEM_RATING_LABELS,
  COMPLETE_CHECKLIST_TEMPLATE,
  getAllChecklistTemplateItems,
  computeChecklistFinalStatus,
  getFailedChecklistItems,
} from "./complete-checklist";

export type {
  NewMaintenanceTypeKey,
  NewMaintenancePriority,
  MaintenanceOriginKey,
  OperationalStatusKey,
  DiagnosisAreaKey,
  DiagnosisAreaState,
  MaintenanceKartOption,
  PredictedPartLine,
  PlannedServiceKey,
} from "./new-maintenance";
