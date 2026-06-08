/** Modelo simplificado — Manutenção Gurgel Team (box de kart). */

import type { SimpleMaintenanceStatus } from "../enums";
import type { PreventiveMaintenanceSummary } from "@/lib/maintenance/preventive-maintenance";

export type { SimpleMaintenanceStatus } from "../enums";

/** Status exibidos na tabela de karts da manutenção. */
export const MAINTENANCE_FLEET_STATUSES = [
  "disponivel",
  "em_manutencao",
  "indisponivel",
] as const;

export type MaintenanceFleetStatus =
  (typeof MAINTENANCE_FLEET_STATUSES)[number];

export type CorrectiveMaintenanceStatus =
  | "none"
  | "checklist_aberto"
  | "em_andamento"
  | "pendente";

export type CorrectiveMaintenanceSummary = {
  status: CorrectiveMaintenanceStatus;
  label: string;
  orderId?: string;
};

export type InspectionItemKey =
  | "pneus"
  | "corrente"
  | "freios"
  | "motor"
  | "chassi"
  | "direcao";

export type InspectionItemRating = "bom" | "atencao" | "necessita_manutencao";

export type MaintenanceCategory = InspectionItemKey | "outros";

export type SimpleMaintenanceType = "preventiva" | "corretiva";

export type MaintenanceSimpleKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
};

/** @deprecated Use MaintenanceSimpleKpi */
export type MaintenanceSummaryKpi = MaintenanceSimpleKpi;

export type MaintenanceFleetKart = {
  id: string;
  number: number;
  photo: string;
  status: MaintenanceFleetStatus;
  engineHours: number;
  lastInspection: string;
  lastMaintenance: string;
  preventiveMaintenance: PreventiveMaintenanceSummary;
  correctiveMaintenance: CorrectiveMaintenanceSummary;
  monthlyCostCents: number;
};

export type MaintenanceActivityKind =
  | "inspecao"
  | "manutencao_aberta"
  | "manutencao_concluida"
  | "checklist";

export type MaintenanceActivity = {
  id: string;
  kartId: string;
  kartNumber: number;
  title: string;
  kind: MaintenanceActivityKind;
  statusLabel: string;
  when: string;
};

export type MaintenancePartLine = {
  name: string;
  quantity: number;
  unitValueCents: number;
};

export type SimpleInspectionForm = {
  kartId: string;
  date: string;
  responsible: string;
  notes: string;
  items: Record<InspectionItemKey, InspectionItemRating>;
};

export type SimpleMaintenanceForm = {
  kartId: string;
  type: SimpleMaintenanceType;
  category: MaintenanceCategory;
  description: string;
  status: SimpleMaintenanceStatus;
  date: string;
  costCents: number;
  parts: MaintenancePartLine[];
};

export type MaintenanceDraftFromInspection = {
  kartId: string;
  category: MaintenanceCategory;
  description: string;
};

export type MaintenanceSimpleFilterState = {
  kartStatus: MaintenanceFleetStatus | "";
  maintenanceType: SimpleMaintenanceType | "";
  period: "7" | "30" | "90" | "";
  kartId: string;
};

export const INSPECTION_ITEM_LABELS: Record<InspectionItemKey, string> = {
  pneus: "Pneus",
  corrente: "Corrente",
  freios: "Freios",
  motor: "Motor",
  chassi: "Chassi",
  direcao: "Direção",
};

export const MAINTENANCE_FLEET_STATUS_LABELS: Record<
  MaintenanceFleetStatus,
  string
> = {
  disponivel: "Disponível",
  em_manutencao: "Em manutenção",
  indisponivel: "Indisponível",
};
