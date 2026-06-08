import type { PayableQueryDTO, ReceivableQueryDTO } from "@/lib/contracts/finance/finance.types";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    legalCompliance: () => [...queryKeys.auth.all, "legal-compliance"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    inbox: () => [...queryKeys.notifications.all, "inbox"] as const,
  },
  finance: {
    all: ["finance"] as const,
    overviewKpis: () => [...queryKeys.finance.all, "overview-kpis"] as const,
    receivablesKpis: () => [...queryKeys.finance.all, "receivables-kpis"] as const,
    payablesKpis: () => [...queryKeys.finance.all, "payables-kpis"] as const,
    receivables: (filters: ReceivableQueryDTO) =>
      [...queryKeys.finance.all, "receivables", filters] as const,
    payables: (filters: PayableQueryDTO) =>
      [...queryKeys.finance.all, "payables", filters] as const,
    revenueChart: () => [...queryKeys.finance.all, "revenue-chart"] as const,
    smartInsights: () => [...queryKeys.finance.all, "smart-insights"] as const,
    dreEntries: (accountId: string, filter: { key: string; customStart?: string; customEnd?: string }) =>
      [...queryKeys.finance.all, "dre-entries", accountId, filter] as const,
  },
  schedule: {
    all: ["schedule"] as const,
    events: () => [...queryKeys.schedule.all, "events"] as const,
    upcomingDays: () => [...queryKeys.schedule.all, "upcoming-days"] as const,
    meta: () => [...queryKeys.schedule.all, "meta"] as const,
    defaultDate: () => [...queryKeys.schedule.all, "default-date"] as const,
    eventDetail: (id: string) => [...queryKeys.schedule.all, "event", id] as const,
    week: () => [...queryKeys.schedule.all, "week"] as const,
    hoursConfig: () => [...queryKeys.schedule.all, "hours-config"] as const,
  },
  cashFlow: {
    all: ["cash-flow"] as const,
    kpis: () => [...queryKeys.cashFlow.all, "kpis"] as const,
    dataset: (filter: { key: string; customStart?: string; customEnd?: string }) =>
      [...queryKeys.cashFlow.all, "dataset", filter] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    summary: () => [...queryKeys.dashboard.all, "summary"] as const,
    kpis: () => [...queryKeys.dashboard.all, "kpis"] as const,
    agenda: () => [...queryKeys.dashboard.all, "agenda"] as const,
  },
  maintenance: {
    all: ["maintenance"] as const,
    orders: () => [...queryKeys.maintenance.all, "orders"] as const,
    kpis: () => [...queryKeys.maintenance.all, "kpis"] as const,
  },
  clients: {
    all: ["clients"] as const,
    list: () => [...queryKeys.clients.all, "list"] as const,
    kpis: () => [...queryKeys.clients.all, "kpis"] as const,
    pageBundle: () => [...queryKeys.clients.all, "page-bundle"] as const,
  },
  karts: {
    all: ["karts"] as const,
    terms: () => [...queryKeys.karts.all, "terms"] as const,
    categories: () => [...queryKeys.karts.all, "categories"] as const,
    fleet: () => [...queryKeys.karts.all, "fleet", "v2"] as const,
    kpis: () => [...queryKeys.karts.all, "kpis", "v2"] as const,
    pageBundle: () => [...queryKeys.karts.all, "page-bundle"] as const,
    detail: (kartId: string) =>
      [...queryKeys.karts.all, "detail", kartId] as const,
    technicalTimeline: (kartId: string) =>
      [...queryKeys.karts.all, "technical-timeline", kartId] as const,
  },
  inventory: {
    all: ["inventory"] as const,
    kpis: () => [...queryKeys.inventory.all, "kpis"] as const,
    movements: () => [...queryKeys.inventory.all, "movements"] as const,
    parts: () => [...queryKeys.inventory.all, "parts"] as const,
    suppliers: () => [...queryKeys.inventory.all, "suppliers"] as const,
  },
  team: {
    all: ["team"] as const,
    list: () => [...queryKeys.team.all, "list"] as const,
    kpis: () => [...queryKeys.team.all, "kpis"] as const,
  },
  settings: {
    all: ["settings"] as const,
    organization: () => [...queryKeys.settings.all, "organization"] as const,
    catalog: () => [...queryKeys.settings.all, "catalog"] as const,
    notifications: () => [...queryKeys.settings.all, "notifications"] as const,
    documents: () => [...queryKeys.settings.all, "documents"] as const,
    termsRegistry: () => [...queryKeys.settings.all, "terms-registry"] as const,
    users: () => [...queryKeys.settings.all, "users"] as const,
  },
  telemetry: {
    all: ["telemetry"] as const,
    sessions: () => [...queryKeys.telemetry.all, "sessions"] as const,
  },
  lessons: {
    all: ["lessons"] as const,
    sessions: (query: Record<string, unknown>) =>
      [...queryKeys.lessons.all, "sessions", query] as const,
  },
  student: {
    all: ["student"] as const,
    dashboardView: (pilotViewId: string) =>
      [...queryKeys.student.all, "dashboard-view", pilotViewId] as const,
    bookingSlots: (date: string) =>
      [...queryKeys.student.all, "booking-slots", date] as const,
  },
} as const;
