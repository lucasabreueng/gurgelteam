/** Caminhos da API de agenda (admin). */
export const scheduleApiPaths = {
  events: "/api/admin/schedule/events",
  upcomingDays: "/api/admin/schedule/upcoming-days",
  meta: "/api/admin/schedule/meta",
  eventById: (eventId: string) =>
    `/api/admin/schedule/events/${encodeURIComponent(eventId)}`,
} as const;
