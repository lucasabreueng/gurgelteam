import { AuthServiceMock } from "@/services/auth/authServiceMock";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import { KartsServiceMock } from "@/services/karts/kartsServiceMock";
import { LessonServiceMock } from "@/services/lessons/lessonServiceMock";
import { ChecklistServiceMock } from "@/services/maintenance/checklistServiceMock";
import { InspectionServiceMock } from "@/services/maintenance/inspectionServiceMock";
import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";
import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";
import { PartsServiceMock } from "@/services/parts/partsServiceMock";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";
import { ScheduleBlocksServiceMock } from "@/services/schedule/scheduleBlocksServiceMock";
import { ScheduleKartsServiceMock } from "@/services/schedule/scheduleKartsServiceMock";
import { ScheduleRescheduleServiceMock } from "@/services/schedule/scheduleRescheduleServiceMock";
import {
  createScheduleService,
  type ScheduleService,
} from "@/services/schedule/scheduleService";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";
import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";
import { StudentDashboardServiceMock } from "@/services/student/studentDashboardServiceMock";
import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";
import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";

export type AppServices = {
  auth: typeof AuthServiceMock;
  cashFlow: typeof CashFlowServiceMock;
  clients: typeof ClientsServiceMock;
  dashboard: typeof DashboardServiceMock;
  finance: typeof FinancialServiceMock;
  inventory: typeof InventoryServiceMock;
  karts: typeof KartsServiceMock;
  lessons: typeof LessonServiceMock;
  maintenance: typeof MaintenanceServiceMock;
  checklist: typeof ChecklistServiceMock;
  inspection: typeof InspectionServiceMock;
  newMaintenance: typeof NewMaintenanceServiceMock;
  parts: typeof PartsServiceMock;
  schedule: ScheduleService;
  scheduleBlocks: typeof ScheduleBlocksServiceMock;
  scheduleKarts: typeof ScheduleKartsServiceMock;
  scheduleReschedule: typeof ScheduleRescheduleServiceMock;
  newClass: typeof NewClassServiceMock;
  settings: typeof SettingsServiceMock;
  studentArea: typeof StudentAreaServiceMock;
  studentDashboard: typeof StudentDashboardServiceMock;
  studentProfile: typeof StudentProfileServiceMock;
  telemetry: typeof TelemetryServiceMock;
};

const mockServices: AppServices = {
  auth: AuthServiceMock,
  cashFlow: CashFlowServiceMock,
  clients: ClientsServiceMock,
  dashboard: DashboardServiceMock,
  finance: FinancialServiceMock,
  inventory: InventoryServiceMock,
  karts: KartsServiceMock,
  lessons: LessonServiceMock,
  maintenance: MaintenanceServiceMock,
  checklist: ChecklistServiceMock,
  inspection: InspectionServiceMock,
  newMaintenance: NewMaintenanceServiceMock,
  parts: PartsServiceMock,
  schedule: createScheduleService(),
  scheduleBlocks: ScheduleBlocksServiceMock,
  scheduleKarts: ScheduleKartsServiceMock,
  scheduleReschedule: ScheduleRescheduleServiceMock,
  newClass: NewClassServiceMock,
  settings: SettingsServiceMock,
  studentArea: StudentAreaServiceMock,
  studentDashboard: StudentDashboardServiceMock,
  studentProfile: StudentProfileServiceMock,
  telemetry: TelemetryServiceMock,
};

/**
 * Retorna a fachada de services da aplicação conforme `NEXT_PUBLIC_DATA_SOURCE`.
 * Em modo `http`, ainda não há implementação — falha de forma explícita.
 */
export function getAppServices(): AppServices {
  return mockServices;
}
