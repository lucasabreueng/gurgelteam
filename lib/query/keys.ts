import type { PayableQueryDTO, ReceivableQueryDTO } from "@/lib/contracts/finance/finance.types";

export const queryKeys = {
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
  },
  schedule: {
    all: ["schedule"] as const,
    events: () => [...queryKeys.schedule.all, "events"] as const,
    upcomingDays: () => [...queryKeys.schedule.all, "upcoming-days"] as const,
    meta: () => [...queryKeys.schedule.all, "meta"] as const,
    defaultDate: () => [...queryKeys.schedule.all, "default-date"] as const,
    eventDetail: (id: string) => [...queryKeys.schedule.all, "event", id] as const,
  },
  cashFlow: {
    all: ["cash-flow"] as const,
    kpis: () => [...queryKeys.cashFlow.all, "kpis"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
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
  },
  karts: {
    all: ["karts"] as const,
    fleet: () => [...queryKeys.karts.all, "fleet"] as const,
    kpis: () => [...queryKeys.karts.all, "kpis"] as const,
  },
  inventory: {
    all: ["inventory"] as const,
    kpis: () => [...queryKeys.inventory.all, "kpis"] as const,
    movements: () => [...queryKeys.inventory.all, "movements"] as const,
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
  },
} as const;
