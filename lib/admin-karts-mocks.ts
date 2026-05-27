/** Dados mockados — Gestão de frota / paddock Gurgel Team */

import { KART_CATEGORIES } from "./admin-settings-mocks";

export type KartOwnership = "rental" | "client";

export type KartStatus =
  | "disponivel"
  | "em_treino"
  | "reservado"
  | "manutencao"
  | "aguardando_peca"
  | "indisponivel"
  | "preparacao"
  | "lavagem";

export type KartTabKey =
  | "todos"
  | "proprios"
  | "clientes"
  | "disponiveis"
  | "em_treino"
  | "manutencao"
  | "historico";

export const KART_STATUS_LABELS: Record<KartStatus, string> = {
  disponivel: "Disponível",
  em_treino: "Em treino",
  reservado: "Reservado",
  manutencao: "Em manutenção",
  aguardando_peca: "Aguardando peça",
  indisponivel: "Indisponível",
  preparacao: "Em preparação",
  lavagem: "Lavagem / checklist",
};

export const KART_FILTER_CATEGORIES = [
  { id: "f400", name: "F400" },
  { id: "125cc", name: "125cc" },
  { id: "cadete", name: "Cadete" },
  { id: "mirim", name: "Mirim" },
  { id: "rental", name: "Rental" },
  { id: "competicao", name: "Competição" },
] as const;

export const KART_FILTER_STATUSES = Object.entries(KART_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as KartStatus, label })
);

export const KART_MAINTENANCE_WINDOWS = [
  { value: "", label: "Próxima manutenção" },
  { value: "7", label: "Até 7 dias" },
  { value: "30", label: "Até 30 dias" },
  { value: "overdue", label: "Atrasada" },
] as const;

export const KART_OWNERSHIP_TYPE_OPTIONS = [
  { value: "", label: "Selecione o tipo…" },
  { value: "rental", label: "Próprio" },
  { value: "client", label: "Cliente" },
] as const;

export type NewKartFormData = {
  ownershipType: "" | KartOwnership;
  clientId: string;
  number: string;
  motor: string;
  engineHours: string;
  lastMaintenanceDate: string;
  lastMaintenanceUnknown: boolean;
};

export type RegisteredMotor = {
  id: string;
  name: string;
};

/** Motores cadastrados no sistema (Configurações / frota). */
export const REGISTERED_MOTORS: RegisteredMotor[] = [
  { id: "iame-x30", name: "IAME X30" },
  { id: "iame-mini", name: "IAME Mini" },
  { id: "iame-kz", name: "IAME KZ" },
  { id: "iame-cadet", name: "IAME Cadet" },
  { id: "iame-rental", name: "IAME Rental" },
  { id: "rotax-max", name: "Rotax Max" },
  { id: "rotax-dd2", name: "Rotax DD2" },
  { id: "rotax-micro", name: "Rotax Micro" },
  { id: "vortex-rok", name: "Vortex ROK" },
  { id: "vortex-rok-mini", name: "Vortex ROK Mini" },
];

export type KartKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
};

export const KARTS_KPIS: KartKpi[] = [
  { id: "total", label: "Total de karts", value: "32", delta: "+2 no mês", deltaPositive: true },
  { id: "disp", label: "Disponíveis", value: "18", delta: "56% da frota", deltaPositive: true },
  { id: "manut", label: "Em manutenção", value: "4", delta: "-1 vs ontem", deltaPositive: true },
  { id: "prop", label: "Karts próprios", value: "20", delta: "Frota Gurgel", deltaPositive: true },
  { id: "cli", label: "Karts de clientes", value: "12", delta: "Guardados", deltaPositive: true },
  { id: "pend", label: "Pendências", value: "7", delta: "3 urgentes", deltaPositive: false },
];

export const KARTS_TABLE_PAGE_SIZES = [10, 25, 50] as const;

export type FleetKartListItem = {
  id: string;
  number: number;
  photo: string;
  categoryId: string;
  categoryName: string;
  ownership: KartOwnership;
  ownerName?: string;
  status: KartStatus;
  motor: string;
  chassis: string;
  lastUse: string;
  nextMaintenance: string;
  nextMaintenanceDays: number;
  usageHours: number;
  fuel: string;
  tires: string;
  score: number;
  boxSlot?: string;
};

export const FLEET_KARTS: FleetKartListItem[] = [
  { id: "k05", number: 5, photo: "/images/gallery-3.jpg", categoryId: "f400", categoryName: "F400", ownership: "rental", status: "disponivel", motor: "IAME X30", chassis: "CRG Road Rebel", lastUse: "Hoje, 09:20", nextMaintenance: "12 jun", nextMaintenanceDays: 18, usageHours: 412, fuel: "98", tires: "MG-Wet", score: 92 },
  { id: "k07", number: 7, photo: "/images/gallery-4.jpg", categoryId: "125cc", categoryName: "125cc", ownership: "rental", status: "em_treino", motor: "Rotax Max", chassis: "Birel ART", lastUse: "Agora", nextMaintenance: "28 mai", nextMaintenanceDays: 3, usageHours: 528, fuel: "98", tires: "Vega Red", score: 88 },
  { id: "k12", number: 12, photo: "/images/gallery-5.jpg", categoryId: "competicao", categoryName: "Competição", ownership: "rental", status: "manutencao", motor: "IAME KZ", chassis: "OTK EVO", lastUse: "Ontem, 17:40", nextMaintenance: "Atrasada", nextMaintenanceDays: -2, usageHours: 690, fuel: "—", tires: "Troca pend.", score: 71 },
  { id: "k18", number: 18, photo: "/images/gallery-6.jpg", categoryId: "f400", categoryName: "F400", ownership: "client", ownerName: "João Silva", status: "disponivel", motor: "IAME Mini", chassis: "Birel C28", lastUse: "18 mai", nextMaintenance: "20 jun", nextMaintenanceDays: 26, usageHours: 198, fuel: "95", tires: "Dunlop SL", score: 85, boxSlot: "Box 2" },
  { id: "k03", number: 3, photo: "/images/gallery-1.jpg", categoryId: "cadete", categoryName: "Cadete", ownership: "rental", status: "reservado", motor: "IAME Cadet", chassis: "CRG Hero", lastUse: "19 mai", nextMaintenance: "05 jun", nextMaintenanceDays: 11, usageHours: 156, fuel: "95", tires: "MG-SM", score: 90 },
  { id: "k21", number: 21, photo: "/images/gallery-2.jpg", categoryId: "125cc", categoryName: "125cc", ownership: "rental", status: "aguardando_peca", motor: "Rotax DD2", chassis: "Tony Kart", lastUse: "08 mai", nextMaintenance: "Em andamento", nextMaintenanceDays: 0, usageHours: 445, fuel: "—", tires: "—", score: 62 },
  { id: "k09", number: 9, photo: "/images/gallery-7.jpg", categoryId: "mirim", categoryName: "Mirim", ownership: "rental", status: "lavagem", motor: "IAME Mini", chassis: "Birel", lastUse: "Hoje, 08:00", nextMaintenance: "15 jul", nextMaintenanceDays: 51, usageHours: 89, fuel: "95", tires: "Novo", score: 94 },
  { id: "k14", number: 14, photo: "/images/gallery-8.jpg", categoryId: "rental", categoryName: "Rental", ownership: "rental", status: "disponivel", motor: "IAME Rental", chassis: "CRG Rental", lastUse: "17 mai", nextMaintenance: "10 jun", nextMaintenanceDays: 16, usageHours: 312, fuel: "95", tires: "MG-Wet", score: 87 },
  { id: "k22", number: 22, photo: "/images/gallery-9.jpg", categoryId: "competicao", categoryName: "Competição", ownership: "client", ownerName: "Equipe Velocity", status: "preparacao", motor: "IAME KZ", chassis: "Parolin", lastUse: "16 mai", nextMaintenance: "22 mai", nextMaintenanceDays: -3, usageHours: 520, fuel: "98", tires: "Vega XH", score: 79, boxSlot: "Box 5" },
  { id: "k06", number: 6, photo: "/images/project-1.jpg", categoryId: "f400", categoryName: "F400", ownership: "rental", status: "em_treino", motor: "IAME X30", chassis: "Birel ART", lastUse: "Agora", nextMaintenance: "30 mai", nextMaintenanceDays: 5, usageHours: 378, fuel: "98", tires: "MG-Wet", score: 91 },
  { id: "k17", number: 17, photo: "/images/project-2.jpg", categoryId: "125cc", categoryName: "125cc", ownership: "rental", status: "indisponivel", motor: "Rotax Max", chassis: "Tony Kart", lastUse: "02 mai", nextMaintenance: "Revisão motor", nextMaintenanceDays: -12, usageHours: 601, fuel: "—", tires: "—", score: 55 },
  { id: "k31", number: 31, photo: "/images/project-3.jpg", categoryId: "f400", categoryName: "F400", ownership: "client", ownerName: "Marina Costa", status: "disponivel", motor: "IAME X30", chassis: "CRG", lastUse: "20 mai", nextMaintenance: "01 jul", nextMaintenanceDays: 37, usageHours: 244, fuel: "98", tires: "Dunlop", score: 83, boxSlot: "Box 8" },
];

export type KartUsageEvent = {
  id: string;
  date: string;
  type: "aula" | "treino" | "campeonato" | "incidente";
  title: string;
  pilot: string;
  duration?: string;
  note?: string;
};

export type MaintenanceItem = {
  id: string;
  area: string;
  kind: "preventiva" | "corretiva";
  lastDone: string;
  nextDue: string;
  cost: string;
  responsible: string;
  status: string;
  notes: string;
};

export type KartAlert = {
  id: string;
  message: string;
  severity: "info" | "warn" | "urgent";
  kartNumber?: number;
};

export const FLEET_ALERTS: KartAlert[] = [
  { id: "a1", message: "Kart 12 precisa trocar pneus em 3 sessões", severity: "warn", kartNumber: 12 },
  { id: "a2", message: "Kart 05 apresentou queda de desempenho", severity: "urgent", kartNumber: 5 },
  { id: "a3", message: "Motor do Kart 18 próximo da revisão", severity: "info", kartNumber: 18 },
  { id: "a4", message: "Kart 07 está com checklist pendente", severity: "warn", kartNumber: 7 },
];

export type PaddockBox = {
  slot: string;
  kartId?: string;
  status: KartStatus | "empty";
};

export const PADLOCK_BOXES: PaddockBox[] = [
  { slot: "A1", kartId: "k05", status: "disponivel" },
  { slot: "A2", kartId: "k07", status: "em_treino" },
  { slot: "A3", kartId: "k12", status: "manutencao" },
  { slot: "A4", status: "empty" },
  { slot: "B1", kartId: "k03", status: "reservado" },
  { slot: "B2", kartId: "k18", status: "disponivel" },
  { slot: "B3", kartId: "k21", status: "aguardando_peca" },
  { slot: "B4", kartId: "k09", status: "lavagem" },
];

export type KartDetail = {
  list: FleetKartListItem;
  heroBg: string;
  reliabilityScore: number;
  availability: string;
  usageHistory: KartUsageEvent[];
  maintenance: MaintenanceItem[];
  tires: {
    model: string;
    compound: string;
    wear: number;
    cycles: number;
    changedAt: string;
    idealPressure: string;
    replaceAlert: string;
  };
  engine: {
    hours: number;
    lastRevision: string;
    prep: string;
    tuning: string;
    performance: string;
    interventions: string[];
  };
  checklist: { item: string; status: "ok" | "warn" | "fail" }[];
  schedule: { day: string; slots: { time: string; label: string; tone: string }[] }[];
  financial: {
    revenue: string;
    maintenanceCost: string;
    parts: string;
    profit: string;
    pending: string;
    margin: string;
  };
  clientInfo?: {
    phone: string;
    whatsapp: string;
    box: string;
    authorizedServices: string[];
    pending: string;
    contact: string;
    internalNotes: string;
    entryDate: string;
    pickupEstimate: string;
  };
  documents: { id: string; label: string; date: string; fileUrl: string }[];
  telemetry: {
    avgLap: string;
    bestLap: string;
    lapTrend: { date: string; lapTime: number }[];
  };
};

function buildMaintenance(): MaintenanceItem[] {
  return [
    { id: "m1", area: "Motor", kind: "preventiva", lastDone: "10 abr", nextDue: "10 jun", cost: "R$ 1.200", responsible: "Oficina Gurgel", status: "Em dia", notes: "Óleo e filtro trocados." },
    { id: "m2", area: "Carburador", kind: "corretiva", lastDone: "15 mai", nextDue: "—", cost: "R$ 380", responsible: "Ricardo", status: "Concluído", notes: "Limpeza e rejunte." },
    { id: "m3", area: "Freio", kind: "preventiva", lastDone: "01 mai", nextDue: "01 jul", cost: "R$ 220", responsible: "Felipe", status: "Em dia", notes: "" },
    { id: "m4", area: "Pneus", kind: "corretiva", lastDone: "18 mai", nextDue: "Em 3 sessões", cost: "R$ 1.800", responsible: "Paddock", status: "Atenção", notes: "Desgaste lateral S2." },
    { id: "m5", area: "Alinhamento", kind: "preventiva", lastDone: "20 abr", nextDue: "20 jun", cost: "R$ 150", responsible: "Oficina", status: "Em dia", notes: "" },
    { id: "m6", area: "Relação", kind: "preventiva", lastDone: "12 mai", nextDue: "12 ago", cost: "R$ 90", responsible: "Felipe", status: "Em dia", notes: "" },
    { id: "m7", area: "Corrente", kind: "preventiva", lastDone: "05 mai", nextDue: "05 jul", cost: "R$ 110", responsible: "Paddock", status: "Em dia", notes: "" },
    { id: "m8", area: "Chassi", kind: "corretiva", lastDone: "22 mar", nextDue: "Inspeção ago", cost: "R$ 0", responsible: "—", status: "OK", notes: "Sem trincas." },
    { id: "m9", area: "Carenagem", kind: "corretiva", lastDone: "30 abr", nextDue: "—", cost: "R$ 450", responsible: "Oficina", status: "Concluído", notes: "Paralama dianteiro." },
  ];
}

export function getKartDetail(kartId: string): KartDetail | null {
  const list = FLEET_KARTS.find((k) => k.id === kartId);
  if (!list) return null;

  return {
    list,
    heroBg: "/images/hero-image.jpg",
    reliabilityScore: list.score,
    availability: list.status === "disponivel" ? "Pronto para pista" : list.status === "em_treino" ? "Em uso agora" : "Indisponível temporariamente",
    usageHistory: [
      { id: "u1", date: "Hoje, 10:30", type: "treino", title: "Treino avançado", pilot: "Lucas Mendes", duration: "42min de pista" },
      { id: "u2", date: "Ontem, 16:00", type: "aula", title: "Aula técnica", pilot: "Marina Souza", duration: "50min" },
      { id: "u3", date: "18 mai", type: "campeonato", title: "Copa Gurgel — Etapa 2", pilot: "Beatriz Lima", note: "P2 na categoria" },
      { id: "u4", date: "15 mai", type: "incidente", title: "Toque leve na chicane", pilot: "Rafael Dias", note: "Carenagem — sem downtime" },
    ],
    maintenance: buildMaintenance(),
    tires: {
      model: "MG-Wet",
      compound: "Wet",
      wear: list.number === 12 ? 78 : 34,
      cycles: 14,
      changedAt: "18 mai 2025",
      idealPressure: "0,65 bar",
      replaceAlert: list.number === 12 ? "Troca em até 3 sessões" : "Dentro do intervalo",
    },
    engine: {
      hours: list.usageHours,
      lastRevision: "10 abr 2025",
      prep: "Padrão competição",
      tuning: "Agulha 165 · escape curto",
      performance: list.score > 85 ? "Estável" : "Queda nas últimas sessões",
      interventions: ["Troca de óleo abr/25", "Limpeza carburador mai/25", "Revisão ignição mar/25"],
    },
    checklist: [
      { item: "Freio", status: "ok" },
      { item: "Pneus", status: list.number === 12 ? "warn" : "ok" },
      { item: "Corrente", status: "ok" },
      { item: "Combustível", status: "ok" },
      { item: "Banco", status: "ok" },
      { item: "Volante", status: "ok" },
      { item: "Parafusos", status: "ok" },
      { item: "Carenagem", status: "warn" },
      { item: "Vazamentos", status: "ok" },
    ],
    schedule: [
      { day: "Seg", slots: [{ time: "10:00", label: "Aula", tone: "sky" }, { time: "14:00", label: "Treino", tone: "navy" }] },
      { day: "Ter", slots: [{ time: "09:00", label: "Reservado", tone: "amber" }] },
      { day: "Qua", slots: [{ time: "—", label: "Manutenção", tone: "red" }] },
      { day: "Qui", slots: [{ time: "16:00", label: "Campeonato", tone: "violet" }] },
      { day: "Sex", slots: [{ time: "11:00", label: "Treino", tone: "navy" }, { time: "15:00", label: "Aula", tone: "sky" }] },
    ],
    financial: {
      revenue: list.ownership === "client" ? "R$ 0" : "R$ 12.400",
      maintenanceCost: "R$ 2.180",
      parts: "R$ 890",
      profit: list.ownership === "client" ? "—" : "R$ 9.330",
      pending: list.ownership === "client" ? "Guarda mensal R$ 450" : "—",
      margin: list.ownership === "client" ? "—" : "75%",
    },
    clientInfo: list.ownership === "client" ? {
      phone: "(61) 99999-1234",
      whatsapp: "(61) 99999-1234",
      box: list.boxSlot ?? "Box cliente",
      authorizedServices: ["Lavagem", "Checklist", "Guarda"],
      pending: "Autorizar troca de pneus",
      contact: list.ownerName ?? "—",
      internalNotes: "Cliente prefere contato por WhatsApp após 14h.",
      entryDate: "12 jan 2025",
      pickupEstimate: "Sem previsão",
    } : undefined,
    documents: [
      { id: "d1", label: "Fotos do kart", date: "20 mai", fileUrl: "/images/gallery-3.jpg" },
      { id: "d2", label: "NF peças abr/25", date: "15 abr", fileUrl: "/images/project-1.jpg" },
      { id: "d3", label: "Ordem de serviço #1842", date: "10 abr", fileUrl: "/images/project-2.jpg" },
      { id: "d4", label: "Setup pista seca", date: "01 mai", fileUrl: "/images/project-3.jpg" },
      { id: "d5", label: "Regulagem motor", date: "10 abr", fileUrl: "/images/gallery-5.jpg" },
    ],
    telemetry: {
      avgLap: list.categoryName === "125cc" ? "54,2s" : "56,8s",
      bestLap: list.categoryName === "125cc" ? "52,9s" : "55,1s",
      lapTrend: [
        { date: "14 mai", lapTime: 56.2 },
        { date: "16 mai", lapTime: 55.8 },
        { date: "18 mai", lapTime: 55.4 },
        { date: "19 mai", lapTime: 55.1 },
        { date: "20 mai", lapTime: 54.9 },
        { date: "21 mai", lapTime: 54.6 },
      ],
    },
  };
}

export function filterKartsByTab(
  karts: FleetKartListItem[],
  tab: KartTabKey
): FleetKartListItem[] {
  switch (tab) {
    case "proprios":
      return karts.filter((k) => k.ownership === "rental");
    case "clientes":
      return karts.filter((k) => k.ownership === "client");
    case "disponiveis":
      return karts.filter((k) => k.status === "disponivel");
    case "em_treino":
      return karts.filter((k) => k.status === "em_treino");
    case "manutencao":
      return karts.filter(
        (k) =>
          k.status === "manutencao" ||
          k.status === "aguardando_peca" ||
          k.status === "lavagem"
      );
    case "historico":
      return karts;
    default:
      return karts;
  }
}

export const KART_CATEGORY_NAMES = KART_CATEGORIES;
