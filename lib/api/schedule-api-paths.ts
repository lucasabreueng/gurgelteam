/** Caminhos da API de agenda — apontam para v1. */
import { v1ApiPaths } from "./v1-api-paths";

export const scheduleApiPaths = {
  events: v1ApiPaths.schedule.events,
  upcomingDays: v1ApiPaths.schedule.upcomingDays,
  meta: v1ApiPaths.schedule.meta,
  eventById: v1ApiPaths.schedule.eventById,
  blocks: v1ApiPaths.schedule.blocks,
  blockById: v1ApiPaths.schedule.blockById,
  eventReschedule: v1ApiPaths.schedule.eventReschedule,
  eventCancel: v1ApiPaths.schedule.eventCancel,
  eventSwapKart: v1ApiPaths.schedule.eventSwapKart,
  slots: v1ApiPaths.schedule.slots,
} as const;
