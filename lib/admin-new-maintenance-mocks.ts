/** Dados mockados — Nova manutenção (OS) */

import { FLEET_KARTS } from "./admin-karts-mocks";
import { KART_STATUS_LABELS, type KartStatus } from "./admin-karts-mocks";
import { PARTS_CATALOG, type PartCatalogItem } from "./admin-parts-mocks";
import { MAINTENANCE_MECHANICS } from "./admin-maintenance-mocks";

export type NewMaintenanceTypeKey =
  | "preventiva"
  | "corretiva"
  | "emergencial"
  | "revisao"
  | "setup"
  | "pos_incidente"
  | "pre_campeonato";

export type NewMaintenancePriority = "baixa" | "media" | "alta" | "critica";

export type MaintenanceOriginKey =
  | "manual"
  | "checklist"
  | "inspecao"
  | "alerta"
  | "reclamacao"
  | "pos_incidente";

export type OperationalStatusKey = "normal" | "restrito" | "bloqueado";

export type DiagnosisAreaKey =
  | "motor"
  | "freio"
  | "pneus"
  | "chassi"
  | "relacao"
  | "combustivel"
  | "eletrica"
  | "carenagem";

export type ItemSeverity = "leve" | "moderada" | "critica" | null;
export type DiagnosisAreaStatus = "ok" | "warn" | "fail" | null;

export type DiagnosisAreaState = {
  status: DiagnosisAreaStatus;
  severity: ItemSeverity;
  note: string;
};

export type MaintenanceKartOption = {
  id: string;
  number: number;
  photo: string;
  categoryName: string;
  ownerName: string;
  status: KartStatus;
  statusLabel: string;
  engineHours: number;
  lastMaintenance: string;
  reliabilityScore: number;
  ownership: "rental" | "client";
};

export type PredictedPartLine = {
  partId: string;
  quantity: number;
};

export type PlannedServiceKey =
  | "revisar_motor"
  | "trocar_pneus"
  | "ajustar_freio"
  | "conferir_corrente"
  | "alinhar_chassi"
  | "limpar_carburador"
  | "revisao_geral"
  | "teste_pista";

export type SmartAlert = {
  id: string;
  message: string;
  tone: "info" | "warn" | "urgent";
};

export type AffectedBooking = {
  id: string;
  date: string;
  title: string;
  pilot?: string;
};

export const DEFAULT_RESPONSIBLE = MAINTENANCE_MECHANICS[0].name;

export function generateOsNumber(): string {
  return `OS-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

export const NOW_MAINTENANCE_LABEL = "21 mai 2026, 16:08";

export const MAINTENANCE_KART_OPTIONS: MaintenanceKartOption[] = FLEET_KARTS.map(
  (k) => ({
    id: k.id,
    number: k.number,
    photo: k.photo,
    categoryName: k.categoryName,
    ownerName:
      k.ownership === "client" ? (k.ownerName ?? "Cliente") : "Frota Gurgel",
    status: k.status,
    statusLabel: KART_STATUS_LABELS[k.status],
    engineHours: k.usageHours,
    lastMaintenance: k.nextMaintenance,
    reliabilityScore: k.score,
    ownership: k.ownership,
  })
);

export function searchMaintenanceKarts(query: string): MaintenanceKartOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return MAINTENANCE_KART_OPTIONS.slice(0, 6);
  return MAINTENANCE_KART_OPTIONS.filter((k) => {
    const hay = [
      String(k.number),
      k.categoryName,
      k.ownerName,
      k.statusLabel,
      k.status,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export const MAINTENANCE_TYPE_OPTIONS: {
  key: NewMaintenanceTypeKey;
  label: string;
  description: string;
  icon: "shield" | "bolt" | "fire" | "wrench" | "cog" | "flag" | "trophy";
}[] = [
  {
    key: "preventiva",
    label: "Preventiva",
    description: "Manutenção programada por horas ou calendário.",
    icon: "shield",
  },
  {
    key: "corretiva",
    label: "Corretiva",
    description: "Correção após falha ou desgaste identificado.",
    icon: "wrench",
  },
  {
    key: "emergencial",
    label: "Emergencial",
    description: "Intervenção imediata — kart fora de operação.",
    icon: "fire",
  },
  {
    key: "revisao",
    label: "Revisão",
    description: "Revisão técnica completa do sistema.",
    icon: "cog",
  },
  {
    key: "setup",
    label: "Setup",
    description: "Ajustes de chassi, pneus e geometria.",
    icon: "bolt",
  },
  {
    key: "pos_incidente",
    label: "Pós-incidente",
    description: "Análise após impacto ou anomalia em pista.",
    icon: "flag",
  },
  {
    key: "pre_campeonato",
    label: "Pré-campeonato",
    description: "Preparação homologada para evento.",
    icon: "trophy",
  },
];

export const PRIORITY_OPTIONS: {
  key: NewMaintenancePriority;
  label: string;
  color: string;
  ring: string;
}[] = [
  { key: "baixa", label: "Baixa", color: "bg-sky-500", ring: "ring-sky-300" },
  {
    key: "media",
    label: "Média",
    color: "bg-amber-500",
    ring: "ring-amber-300",
  },
  {
    key: "alta",
    label: "Alta",
    color: "bg-orange-500",
    ring: "ring-orange-300",
  },
  {
    key: "critica",
    label: "Crítica",
    color: "bg-red-500",
    ring: "ring-red-300",
  },
];

export const ORIGIN_OPTIONS: {
  key: MaintenanceOriginKey;
  label: string;
  linkable?: boolean;
}[] = [
  { key: "manual", label: "Manual" },
  { key: "checklist", label: "Checklist", linkable: true },
  { key: "inspecao", label: "Inspeção", linkable: true },
  { key: "alerta", label: "Alerta automático", linkable: true },
  { key: "reclamacao", label: "Reclamação do piloto" },
  { key: "pos_incidente", label: "Pós-incidente" },
];

export const ORIGIN_LINK_MOCK: Partial<
  Record<MaintenanceOriginKey, { ref: string; detail: string }>
> = {
  checklist: { ref: "CHK-2841", detail: "Pós-treino — 2 itens em atenção" },
  inspecao: { ref: "INS-1092", detail: "Revisão corretiva — kart #12" },
  alerta: { ref: "ALT-FREIO-12", detail: "3 ocorrências de freio em 14 dias" },
};

export const DIAGNOSIS_AREAS: { key: DiagnosisAreaKey; label: string }[] = [
  { key: "motor", label: "Motor" },
  { key: "freio", label: "Freio" },
  { key: "pneus", label: "Pneus" },
  { key: "chassi", label: "Chassi" },
  { key: "relacao", label: "Relação" },
  { key: "combustivel", label: "Combustível" },
  { key: "eletrica", label: "Elétrica" },
  { key: "carenagem", label: "Carenagem" },
];

export function buildInitialDiagnosis(): Record<
  DiagnosisAreaKey,
  DiagnosisAreaState
> {
  const state = {} as Record<DiagnosisAreaKey, DiagnosisAreaState>;
  for (const a of DIAGNOSIS_AREAS) {
    state[a.key] = { status: null, severity: null, note: "" };
  }
  state.relacao = { status: "warn", severity: "moderada", note: "" };
  state.freio = { status: "warn", severity: "leve", note: "" };
  return state;
}

export const MOCK_PROBLEM =
  "Perda de eficiência de frenagem e desgaste excessivo da corrente.";

export const PLANNED_SERVICES: {
  key: PlannedServiceKey;
  label: string;
}[] = [
  { key: "revisar_motor", label: "Revisar motor" },
  { key: "trocar_pneus", label: "Trocar pneus" },
  { key: "ajustar_freio", label: "Ajustar freio" },
  { key: "conferir_corrente", label: "Conferir corrente" },
  { key: "alinhar_chassi", label: "Alinhar chassi" },
  { key: "limpar_carburador", label: "Limpar carburador" },
  { key: "revisao_geral", label: "Revisão geral" },
  { key: "teste_pista", label: "Teste em pista" },
];

export const DEFAULT_PLANNED_SERVICES: PlannedServiceKey[] = [
  "ajustar_freio",
  "conferir_corrente",
];

export const LABOR_RATE_MOCK = 180;

export const MAINTENANCE_TIMELINE = [
  {
    id: "mt1",
    date: "12 mai 2026",
    title: "Preventiva 400h",
    detail: "Troca óleo e pastilhas",
  },
  {
    id: "mt2",
    date: "28 abr 2026",
    title: "Inspeção pós-treino",
    detail: "Restrito — corrente",
  },
  {
    id: "mt3",
    date: "15 abr 2026",
    title: "Peça trocada",
    detail: "Coroa 72 dentes",
  },
];

export const SMART_MAINTENANCE_ALERTS: SmartAlert[] = [
  {
    id: "sa1",
    message:
      "Esse kart apresentou 3 problemas de freio nas últimas semanas.",
    tone: "urgent",
  },
  {
    id: "sa2",
    message: "Motor próximo da revisão preventiva.",
    tone: "warn",
  },
  {
    id: "sa3",
    message: "Corrente apresenta desgaste recorrente.",
    tone: "warn",
  },
  {
    id: "sa4",
    message: "Kart parado acima da média operacional.",
    tone: "info",
  },
];

export const AFFECTED_BOOKINGS: AffectedBooking[] = [
  { id: "b1", date: "22 mai, 14:00", title: "Aula avançada", pilot: "Ana R." },
  { id: "b2", date: "22 mai, 16:30", title: "Treino livre", pilot: "Grupo B" },
  { id: "b3", date: "23 mai, 09:00", title: "Reserva competição" },
];

export const SIGNATURE_MAINTENANCE = {
  mechanic: "Carlos Silva",
  instructor: "Lucas Mendes",
  signedAt: NOW_MAINTENANCE_LABEL,
};

export function searchPartsForMaintenance(query: string): PartCatalogItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return PARTS_CATALOG.slice(0, 5);
  return PARTS_CATALOG.filter((p) => {
    const hay = [p.name, p.code, p.category, p.supplier].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

export function computeEstimatedCosts(
  parts: PredictedPartLine[],
  servicesCount: number,
  externalCost = 0
): {
  partsTotal: number;
  labor: number;
  external: number;
  total: number;
} {
  const partsTotal = parts.reduce((sum, line) => {
    const part = PARTS_CATALOG.find((p) => p.id === line.partId);
    return sum + (part ? part.unitCost * line.quantity : 0);
  }, 0);
  const labor = servicesCount * LABOR_RATE_MOCK;
  const total = partsTotal + labor + externalCost;
  return { partsTotal, labor, external: externalCost, total };
}

export const DEFAULT_KART =
  MAINTENANCE_KART_OPTIONS.find((k) => k.number === 12) ??
  MAINTENANCE_KART_OPTIONS[0];
