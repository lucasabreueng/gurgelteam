/** Caminhos da API v1 — base relativa (mesma origem Next.js). */
export const v1ApiPaths = {
  auth: {
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
    session: "/api/v1/auth/session",
    register: "/api/v1/auth/register",
    registerLegalDocuments: "/api/v1/auth/register/legal-documents",
    registerSuggestUsername: "/api/v1/auth/register/suggest-username",
    registerVerify: "/api/v1/auth/register/verify",
    registerResend: "/api/v1/auth/register/resend",
    passwordRecovery: "/api/v1/auth/password-recovery",
    passwordRecoveryVerify: "/api/v1/auth/password-recovery/verify",
    passwordRecoveryReset: "/api/v1/auth/password-recovery/reset",
    changePassword: "/api/v1/auth/change-password",
    legalCompliance: "/api/v1/auth/legal-compliance",
  },
  notifications: {
    inbox: "/api/v1/notifications/inbox",
  },
  reference: {
    catalog: "/api/v1/reference/catalog",
  },
  schedule: {
    meta: "/api/v1/schedule/meta",
    events: "/api/v1/schedule/events",
    eventById: (eventId: string) =>
      `/api/v1/schedule/events/${encodeURIComponent(eventId)}`,
    upcomingDays: "/api/v1/schedule/upcoming-days",
    blocks: "/api/v1/schedule/blocks",
    blockById: (blockId: string) =>
      `/api/v1/schedule/blocks/${encodeURIComponent(blockId)}`,
    eventReschedule: (eventId: string) =>
      `/api/v1/schedule/events/${encodeURIComponent(eventId)}/reschedule`,
    eventCancel: (eventId: string) =>
      `/api/v1/schedule/events/${encodeURIComponent(eventId)}/cancel`,
    eventSwapKart: (eventId: string) =>
      `/api/v1/schedule/events/${encodeURIComponent(eventId)}/swap-kart`,
    slots: "/api/v1/schedule/slots",
    week: "/api/v1/schedule/week",
  },
  clients: {
    list: "/api/v1/clients",
    rankings: "/api/v1/clients/rankings",
    byId: (clientId: string) =>
      `/api/v1/clients/${encodeURIComponent(clientId)}`,
    guardians: (clientId: string) =>
      `/api/v1/clients/${encodeURIComponent(clientId)}/guardians`,
    stats: (clientId: string) =>
      `/api/v1/clients/${encodeURIComponent(clientId)}/stats`,
    timeline: (clientId: string) =>
      `/api/v1/clients/${encodeURIComponent(clientId)}/timeline`,
  },
  lessons: {
    sessions: "/api/v1/lessons/sessions",
    sessionById: (sessionId: string) =>
      `/api/v1/lessons/sessions/${encodeURIComponent(sessionId)}`,
    start: (sessionId: string) =>
      `/api/v1/lessons/sessions/${encodeURIComponent(sessionId)}/start`,
    register: (sessionId: string) =>
      `/api/v1/lessons/sessions/${encodeURIComponent(sessionId)}/register`,
    ocr: "/api/v1/lessons/ocr",
  },
  karts: {
    list: "/api/v1/karts",
    photo: "/api/v1/karts/photo",
    paddock: "/api/v1/karts/paddock",
    byId: (kartId: string) => `/api/v1/karts/${encodeURIComponent(kartId)}`,
    detail: (kartId: string) =>
      `/api/v1/karts/${encodeURIComponent(kartId)}/detail`,
    technicalTimeline: (kartId: string) =>
      `/api/v1/karts/${encodeURIComponent(kartId)}/technical-timeline`,
    status: (kartId: string) =>
      `/api/v1/karts/${encodeURIComponent(kartId)}/status`,
    assignClient: (kartId: string) =>
      `/api/v1/karts/${encodeURIComponent(kartId)}/assign-client`,
  },
  finance: {
    receivables: "/api/v1/finance/receivables",
    payables: "/api/v1/finance/payables",
    overview: "/api/v1/finance/overview",
    dre: "/api/v1/finance/dre",
    dreEntries: "/api/v1/finance/dre/entries",
    cashFlow: "/api/v1/finance/cash-flow",
    charts: "/api/v1/finance/charts",
    insights: "/api/v1/finance/insights",
    meta: "/api/v1/finance/meta",
    payments: "/api/v1/finance/payments",
  },
  inventory: {
    parts: "/api/v1/inventory/parts",
    partById: (partId: string) =>
      `/api/v1/inventory/parts/${encodeURIComponent(partId)}`,
    suppliers: "/api/v1/inventory/suppliers",
    supplierById: (supplierId: string) =>
      `/api/v1/inventory/suppliers/${encodeURIComponent(supplierId)}`,
    movements: "/api/v1/inventory/movements",
    stats: "/api/v1/inventory/stats",
    purchaseOrders: "/api/v1/inventory/purchase-orders",
    history: "/api/v1/inventory/history",
    charts: "/api/v1/inventory/charts",
  },
  maintenance: {
    orders: "/api/v1/maintenance/orders",
    orderById: (orderId: string) =>
      `/api/v1/maintenance/orders/${encodeURIComponent(orderId)}`,
    orderChecklist: (orderId: string) =>
      `/api/v1/maintenance/orders/${encodeURIComponent(orderId)}/checklist`,
    checklistTemplate: "/api/v1/maintenance/checklists/template",
    checklistContext: "/api/v1/maintenance/checklists/context",
    checklistMedia: "/api/v1/maintenance/checklists/media",
    inspections: "/api/v1/maintenance/inspections",
    inspectionTemplate: "/api/v1/maintenance/inspections/template",
    inspectionMedia: "/api/v1/maintenance/inspections/media",
    stats: "/api/v1/maintenance/stats",
    fleet: "/api/v1/maintenance/fleet",
  },
  dashboard: {
    summary: "/api/v1/dashboard",
  },
  team: {
    list: "/api/v1/team",
    kpis: "/api/v1/team/kpis",
    byId: (userId: string) => `/api/v1/team/${encodeURIComponent(userId)}`,
  },
  settings: {
    organization: "/api/v1/settings/organization",
    catalog: "/api/v1/settings/catalog",
    notifications: "/api/v1/settings/notifications",
    documents: "/api/v1/settings/documents",
    termsRegistry: "/api/v1/settings/terms-registry",
    integrations: "/api/v1/settings/integrations",
    appearance: "/api/v1/settings/appearance",
    security: "/api/v1/settings/security",
    users: "/api/v1/settings/users",
    userPermissions: (userId: string) =>
      `/api/v1/settings/users/${encodeURIComponent(userId)}/permissions`,
    profileAssignees: (profileId: string) =>
      `/api/v1/settings/permission-profiles/${encodeURIComponent(profileId)}/assignees`,
  },
  telemetry: {
    sessions: "/api/v1/telemetry/sessions",
    sessionById: (sessionId: string) =>
      `/api/v1/telemetry/sessions/${encodeURIComponent(sessionId)}`,
  },
  pilot: {
    dashboard: "/api/v1/pilot/dashboard",
    account: "/api/v1/pilot/account",
    linkedPilots: "/api/v1/pilot/linked-pilots",
    linkedPilotPassword: (clientId: string) =>
      `/api/v1/pilot/linked-pilots/${encodeURIComponent(clientId)}/password`,
    linkedPilotProfile: (clientId: string) =>
      `/api/v1/pilot/linked-pilots/${encodeURIComponent(clientId)}/profile`,
    profile: "/api/v1/pilot/profile",
    consents: "/api/v1/pilot/consents",
    sessionById: (sessionId: string) =>
      `/api/v1/pilot/sessions/${encodeURIComponent(sessionId)}`,
    evolution: "/api/v1/pilot/evolution",
    achievements: "/api/v1/pilot/achievements",
    home: "/api/v1/pilot/home",
    bookingSlots: (date: string) =>
      `/api/v1/pilot/booking/slots?date=${encodeURIComponent(date)}`,
    booking: "/api/v1/pilot/booking",
  },
} as const;
