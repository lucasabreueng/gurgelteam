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
