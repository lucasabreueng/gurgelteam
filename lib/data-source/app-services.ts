import { AuthServiceMock } from "@/services/auth/authServiceMock";
import { createCashFlowService } from "@/services/cashflow/cashFlowService";
import { createClientsService } from "@/services/clients/clientsService";
import { createDashboardService } from "@/services/dashboard/dashboardService";
import { createFinancialService } from "@/services/finance/financialService";
import { createInventoryService } from "@/services/inventory/inventoryService";
import { createKartsService } from "@/services/karts/kartsService";
import { createLessonsService } from "@/services/lessons/lessonsService";
import { createChecklistService } from "@/services/maintenance/checklistService";
import { createInspectionService } from "@/services/maintenance/inspectionService";
import { createMaintenanceService } from "@/services/maintenance/maintenanceService";
import { createNewMaintenanceService } from "@/services/maintenance/newMaintenanceService";
import { PartsServiceMock } from "@/services/parts/partsServiceMock";
import { createNotificationsService } from "@/services/notifications/notificationsService";
import { createNewClassService } from "@/services/schedule/newClassService";
import { createScheduleBlocksService } from "@/services/schedule/scheduleBlocksService";
import { createScheduleKartsService } from "@/services/schedule/scheduleKartsService";
import { createScheduleRescheduleService } from "@/services/schedule/scheduleRescheduleService";
import {
  createScheduleService,
  type ScheduleService,
} from "@/services/schedule/scheduleService";
import { createWeekScheduleService } from "@/services/schedule/weekScheduleService";
import { createSettingsService } from "@/services/settings/settingsService";
import { createTeamService } from "@/services/team/teamService";
import { createStudentAreaService } from "@/services/student/studentAreaService";
import {
  createStudentDashboardService,
  createStudentProfileService,
} from "@/services/student/studentServices";
import { createTelemetryService } from "@/services/telemetry/telemetryService";
import { createPilotBookingService } from "@/services/student/pilotBookingService";

export type AppServices = {
  auth: typeof AuthServiceMock;
  cashFlow: ReturnType<typeof createCashFlowService>;
  clients: ReturnType<typeof createClientsService>;
  dashboard: ReturnType<typeof createDashboardService>;
  finance: ReturnType<typeof createFinancialService>;
  inventory: ReturnType<typeof createInventoryService>;
  karts: ReturnType<typeof createKartsService>;
  lessons: ReturnType<typeof createLessonsService>;
  maintenance: ReturnType<typeof createMaintenanceService>;
  checklist: ReturnType<typeof createChecklistService>;
  inspection: ReturnType<typeof createInspectionService>;
  newMaintenance: ReturnType<typeof createNewMaintenanceService>;
  parts: typeof PartsServiceMock;
  schedule: ScheduleService;
  scheduleBlocks: ReturnType<typeof createScheduleBlocksService>;
  scheduleKarts: ReturnType<typeof createScheduleKartsService>;
  scheduleReschedule: ReturnType<typeof createScheduleRescheduleService>;
  notifications: ReturnType<typeof createNotificationsService>;
  newClass: ReturnType<typeof createNewClassService>;
  weekSchedule: ReturnType<typeof createWeekScheduleService>;
  settings: ReturnType<typeof createSettingsService>;
  team: ReturnType<typeof createTeamService>;
  studentArea: ReturnType<typeof createStudentAreaService>;
  studentDashboard: ReturnType<typeof createStudentDashboardService>;
  studentProfile: ReturnType<typeof createStudentProfileService>;
  telemetry: ReturnType<typeof createTelemetryService>;
  pilotBooking: ReturnType<typeof createPilotBookingService>;
};

const appServices: AppServices = {
  auth: AuthServiceMock,
  cashFlow: createCashFlowService(),
  clients: createClientsService(),
  dashboard: createDashboardService(),
  finance: createFinancialService(),
  inventory: createInventoryService(),
  karts: createKartsService(),
  lessons: createLessonsService(),
  maintenance: createMaintenanceService(),
  checklist: createChecklistService(),
  inspection: createInspectionService(),
  newMaintenance: createNewMaintenanceService(),
  parts: PartsServiceMock,
  schedule: createScheduleService(),
  scheduleBlocks: createScheduleBlocksService(),
  scheduleKarts: createScheduleKartsService(),
  scheduleReschedule: createScheduleRescheduleService(),
  notifications: createNotificationsService(),
  newClass: createNewClassService(),
  weekSchedule: createWeekScheduleService(),
  settings: createSettingsService(),
  team: createTeamService(),
  studentArea: createStudentAreaService(),
  studentDashboard: createStudentDashboardService(),
  studentProfile: createStudentProfileService(),
  telemetry: createTelemetryService(),
  pilotBooking: createPilotBookingService(),
};

/**
 * Registry de services — mock ou HTTP conforme `NEXT_PUBLIC_DATA_SOURCE`.
 */
export function getAppServices(): AppServices {
  return appServices;
}
