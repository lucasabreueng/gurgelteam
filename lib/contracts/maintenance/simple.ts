/** Modelo simplificado — Manutenção Gurgel Team (box de kart). */

export type KartOperationalStatus =
  | "operacional"
  | "atencao"
  | "em_manutencao"
  | "indisponivel";

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

export type SimpleMaintenanceStatus = "pendente" | "em_andamento" | "concluida";

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
  status: KartOperationalStatus;
  lastInspection: string;
  lastMaintenance: string;
  nextRevision: string;
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
  kartStatus: KartOperationalStatus | "";
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

export const KART_STATUS_LABELS: Record<KartOperationalStatus, string> = {
  operacional: "Operacional",
  atencao: "Atenção",
  em_manutencao: "Em manutenção",
  indisponivel: "Indisponível",
};
