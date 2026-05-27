/**
 * @deprecated Use `scheduleService` ou `getAppServices().schedule`.
 * Mantido para compatibilidade com imports existentes.
 */
export {
  scheduleService as ScheduleServiceMock,
  createScheduleService,
  type ScheduleService,
} from "./scheduleService";
