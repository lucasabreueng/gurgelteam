/** Checklist completo — avaliação técnica detalhada do kart. */

import type { MaintenanceCategory } from "./simple";

export type MaintenancePageTabKey =
  | "karts"
  | "inspecoes"
  | "manutencoes"
  | "checklists";

export type CompleteChecklistType =
  | "revisao_periodica"
  | "pos_acidente"
  | "pre_campeonato"
  | "retorno_retifica"
  | "pre_venda"
  | "personalizado";

export type ChecklistItemRating = "ok" | "atencao" | "reprovado";

export type ChecklistFinalStatus =
  | "aprovado"
  | "aprovado_ressalvas"
  | "reprovado";

export type ChecklistTemplateItem = {
  id: string;
  label: string;
  maintenanceCategory: MaintenanceCategory;
};

export type ChecklistTemplateGroup = {
  id: string;
  title: string;
  items: ChecklistTemplateItem[];
};

export type ChecklistItemEvaluation = {
  itemId: string;
  rating?: ChecklistItemRating;
  note?: string;
};

export type CompleteChecklistRecord = {
  id: string;
  kartId: string;
  kartNumber: number;
  date: string;
  dateIso: string;
  responsibleId: string;
  responsibleName: string;
  type: CompleteChecklistType;
  finalStatus: ChecklistFinalStatus;
  failedCount: number;
  evaluations: ChecklistItemEvaluation[];
};

export type ChecklistHistoryRow = {
  id: string;
  date: string;
  kartId: string;
  kartNumber: number;
  type: CompleteChecklistType;
  responsibleName: string;
  finalStatus: ChecklistFinalStatus;
  failedCount: number;
};

export type SimpleInspectionRow = {
  id: string;
  date: string;
  kartId: string;
  kartNumber: number;
  responsibleName: string;
  summary: string;
  hasAttention: boolean;
};

export type SimpleMaintenanceRow = {
  id: string;
  date: string;
  kartId: string;
  kartNumber: number;
  type: "preventiva" | "corretiva";
  category: string;
  description: string;
  status: "pendente" | "em_andamento" | "concluida";
  costCents: number;
};

export type KartTechnicalTimelineEntry = {
  id: string;
  date: string;
  dateLabel: string;
  kind: "inspecao" | "manutencao" | "checklist";
  title: string;
  detail: string;
};

export const COMPLETE_CHECKLIST_TYPE_LABELS: Record<
  CompleteChecklistType,
  string
> = {
  revisao_periodica: "Revisão Periódica",
  pos_acidente: "Pós-Acidente",
  pre_campeonato: "Pré-Campeonato",
  retorno_retifica: "Retorno de Retífica",
  pre_venda: "Pré-Venda",
  personalizado: "Personalizado",
};

export const CHECKLIST_FINAL_STATUS_LABELS: Record<
  ChecklistFinalStatus,
  string
> = {
  aprovado: "Aprovado",
  aprovado_ressalvas: "Aprovado com Ressalvas",
  reprovado: "Reprovado",
};

export const CHECKLIST_ITEM_RATING_LABELS: Record<ChecklistItemRating, string> =
  {
    ok: "OK",
    atencao: "Atenção",
    reprovado: "Reprovado",
  };

export const COMPLETE_CHECKLIST_TEMPLATE: ChecklistTemplateGroup[] = [
  {
    id: "chassi",
    title: "Chassi",
    items: [
      { id: "chassi-estrutura", label: "Estrutura", maintenanceCategory: "chassi" },
      { id: "chassi-soldas", label: "Soldas", maintenanceCategory: "chassi" },
      { id: "chassi-alinhamento", label: "Alinhamento", maintenanceCategory: "chassi" },
      { id: "chassi-fixacoes", label: "Fixações", maintenanceCategory: "chassi" },
    ],
  },
  {
    id: "direcao",
    title: "Direção",
    items: [
      { id: "dir-volante", label: "Volante", maintenanceCategory: "direcao" },
      { id: "dir-coluna", label: "Coluna", maintenanceCategory: "direcao" },
      { id: "dir-terminais", label: "Terminais", maintenanceCategory: "direcao" },
      { id: "dir-folgas", label: "Folgas", maintenanceCategory: "direcao" },
    ],
  },
  {
    id: "freios",
    title: "Freios",
    items: [
      { id: "fre-disco", label: "Disco", maintenanceCategory: "freios" },
      { id: "fre-pastilhas", label: "Pastilhas", maintenanceCategory: "freios" },
      { id: "fre-pedal", label: "Pedal", maintenanceCategory: "freios" },
      {
        id: "fre-hidraulico",
        label: "Sistema hidráulico",
        maintenanceCategory: "freios",
      },
    ],
  },
  {
    id: "motor",
    title: "Motor",
    items: [
      { id: "mot-partida", label: "Partida", maintenanceCategory: "motor" },
      {
        id: "mot-funcionamento",
        label: "Funcionamento",
        maintenanceCategory: "motor",
      },
      { id: "mot-vazamentos", label: "Vazamentos", maintenanceCategory: "motor" },
      { id: "mot-fixacao", label: "Fixação", maintenanceCategory: "motor" },
    ],
  },
  {
    id: "transmissao",
    title: "Transmissão",
    items: [
      { id: "trans-corrente", label: "Corrente", maintenanceCategory: "corrente" },
      { id: "trans-coroa", label: "Coroa", maintenanceCategory: "corrente" },
      { id: "trans-pinha", label: "Pinhão", maintenanceCategory: "corrente" },
      { id: "trans-tensor", label: "Tensor", maintenanceCategory: "corrente" },
    ],
  },
  {
    id: "pneus",
    title: "Pneus",
    items: [
      { id: "pne-dianteiros", label: "Dianteiros", maintenanceCategory: "pneus" },
      { id: "pne-traseiros", label: "Traseiros", maintenanceCategory: "pneus" },
      { id: "pne-desgaste", label: "Desgaste", maintenanceCategory: "pneus" },
      { id: "pne-pressao", label: "Pressão", maintenanceCategory: "pneus" },
    ],
  },
  {
    id: "eletrica",
    title: "Elétrica",
    items: [
      { id: "ele-bateria", label: "Bateria", maintenanceCategory: "outros" },
      { id: "ele-chicote", label: "Chicote", maintenanceCategory: "outros" },
      { id: "ele-botoes", label: "Botões", maintenanceCategory: "outros" },
    ],
  },
  {
    id: "seguranca",
    title: "Segurança",
    items: [
      { id: "seg-banco", label: "Banco", maintenanceCategory: "outros" },
      { id: "seg-cinto", label: "Cinto (quando aplicável)", maintenanceCategory: "outros" },
      { id: "seg-protetores", label: "Protetores", maintenanceCategory: "outros" },
      { id: "seg-fixacoes", label: "Fixações", maintenanceCategory: "outros" },
    ],
  },
];

export function getAllChecklistTemplateItems(): ChecklistTemplateItem[] {
  return COMPLETE_CHECKLIST_TEMPLATE.flatMap((g) => g.items);
}

export function computeChecklistFinalStatus(
  evaluations: ChecklistItemEvaluation[],
): ChecklistFinalStatus {
  const ratings = evaluations
    .map((e) => e.rating)
    .filter((r): r is ChecklistItemRating => r != null);
  if (ratings.some((r) => r === "reprovado")) return "reprovado";
  if (ratings.some((r) => r === "atencao")) return "aprovado_ressalvas";
  return "aprovado";
}

export function getFailedChecklistItems(
  evaluations: ChecklistItemEvaluation[],
): ChecklistTemplateItem[] {
  const failedIds = new Set(
    evaluations.filter((e) => e.rating === "reprovado").map((e) => e.itemId),
  );
  return getAllChecklistTemplateItems().filter((i) => failedIds.has(i.id));
}

export type InspectionListFilterState = {
  kartId: string;
  period: "7" | "30" | "90" | "";
  attention: "" | "yes" | "no";
};

export type MaintenanceListFilterState = {
  kartId: string;
  type: "preventiva" | "corretiva" | "";
  status: "pendente" | "em_andamento" | "concluida" | "";
  period: "7" | "30" | "90" | "";
};

export type ChecklistListFilterState = {
  kartId: string;
  type: CompleteChecklistType | "";
  finalStatus: ChecklistFinalStatus | "";
  period: "7" | "30" | "90" | "";
};
