/** Dados mockados — Nova inspeção técnica */

import { DEFAULT_CHECKLIST_KART, type ChecklistKartContext } from "./admin-checklist-mocks";

export type InspectionTypeKey =
  | "pre_treino"
  | "pos_treino"
  | "preventiva"
  | "corretiva"
  | "pre_evento"
  | "pos_incidente"
  | "vistoria"
  | "entrada";

export type ItemStatus = "ok" | "warn" | "fail" | null;
export type ItemSeverity = "leve" | "moderada" | "critica" | null;
export type GeneralCondition = "excelente" | "boa" | "atencao" | "critica";
export type FinalResultStatus = "liberado" | "restrito" | "bloqueado";
export type AutoRecommendation =
  | "liberar"
  | "liberar_obs"
  | "manutencao"
  | "bloquear";

export type InspectionItemState = {
  status: ItemStatus;
  severity: ItemSeverity;
  note: string;
};

export type InspectionModuleItemDef = {
  id: string;
  label: string;
  critical?: boolean;
  tireWearPercent?: number;
};

export type InspectionModuleDef = {
  id: string;
  title: string;
  items: InspectionModuleItemDef[];
  variant?: "tires";
};

export type InspectionTypeOption = {
  key: InspectionTypeKey;
  label: string;
  description: string;
  icon: "flag" | "clock" | "wrench" | "shield" | "trophy" | "bolt" | "eye" | "login";
};

export const INSPECTION_TYPE_OPTIONS: InspectionTypeOption[] = [
  {
    key: "pre_treino",
    label: "Pré-treino",
    description: "Liberação rápida antes de entrar na pista.",
    icon: "flag",
  },
  {
    key: "pos_treino",
    label: "Pós-treino",
    description: "Checagem após sessão e desgastes.",
    icon: "clock",
  },
  {
    key: "preventiva",
    label: "Revisão preventiva",
    description: "Manutenção programada por horas ou calendário.",
    icon: "wrench",
  },
  {
    key: "corretiva",
    label: "Revisão corretiva",
    description: "Análise após falha ou queixa reportada.",
    icon: "bolt",
  },
  {
    key: "pre_evento",
    label: "Pré-evento",
    description: "Homologação técnica para evento.",
    icon: "trophy",
  },
  {
    key: "pos_incidente",
    label: "Pós-incidente",
    description: "Vistoria após impacto ou anomalia grave.",
    icon: "shield",
  },
  {
    key: "vistoria",
    label: "Vistoria geral",
    description: "Inspeção completa de rotina do paddock.",
    icon: "eye",
  },
  {
    key: "entrada",
    label: "Inspeção de entrada",
    description: "Kart de cliente ou retorno à operação.",
    icon: "login",
  },
];

export const INSPECTION_MODULES: InspectionModuleDef[] = [
  {
    id: "motor",
    title: "Motor",
    items: [
      { id: "mo-func", label: "Funcionamento", critical: true },
      { id: "mo-vaz", label: "Vazamento", critical: true },
      { id: "mo-temp", label: "Temperatura" },
      { id: "mo-carb", label: "Carburador" },
      { id: "mo-vib", label: "Vibração" },
      { id: "mo-resp", label: "Resposta" },
    ],
  },
  {
    id: "freios",
    title: "Freios",
    items: [
      { id: "fr-resp", label: "Resposta", critical: true },
      { id: "fr-press", label: "Pressão", critical: true },
      { id: "fr-desg", label: "Desgaste" },
      { id: "fr-alin", label: "Alinhamento" },
      { id: "fr-disco", label: "Disco" },
      { id: "fr-fluid", label: "Fluido" },
    ],
  },
  {
    id: "pneus",
    title: "Pneus",
    variant: "tires",
    items: [
      { id: "pn-desg-dd", label: "Desgaste DD", tireWearPercent: 58 },
      { id: "pn-desg-de", label: "Desgaste DE", tireWearPercent: 55 },
      { id: "pn-ciclos", label: "Ciclos de uso" },
      { id: "pn-integ", label: "Integridade", critical: true },
      { id: "pn-press", label: "Pressão" },
      { id: "pn-temp", label: "Temperatura" },
    ],
  },
  {
    id: "estrutura",
    title: "Estrutura / Chassi",
    items: [
      { id: "es-alin", label: "Alinhamento" },
      { id: "es-trinca", label: "Trincas", critical: true },
      { id: "es-solda", label: "Soldas" },
      { id: "es-care", label: "Carenagem" },
      { id: "es-fix", label: "Fixações" },
      { id: "es-banco", label: "Banco" },
    ],
  },
  {
    id: "transmissao",
    title: "Relação / Transmissão",
    items: [
      { id: "tr-corrente", label: "Corrente", critical: true },
      { id: "tr-pinhao", label: "Pinhão" },
      { id: "tr-coroa", label: "Coroa" },
      { id: "tr-lub", label: "Lubrificação" },
      { id: "tr-tensao", label: "Tensão" },
    ],
  },
  {
    id: "seguranca",
    title: "Segurança",
    items: [
      { id: "sg-banco", label: "Banco", critical: true },
      { id: "sg-vol", label: "Volante", critical: true },
      { id: "sg-ped", label: "Pedais" },
      { id: "sg-fix", label: "Fixações" },
      { id: "sg-par", label: "Parafusos" },
      { id: "sg-prot", label: "Proteções" },
    ],
  },
];

export type DiagramZoneKey =
  | "frente"
  | "lat_esq"
  | "lat_dir"
  | "traseira"
  | "motor"
  | "pneus"
  | "freios";

export const DIAGRAM_INSPECTION_ZONES: Record<DiagramZoneKey, string[]> = {
  frente: ["Para-choque", "Volante", "Pedais"],
  lat_esq: ["Carenagem ESQ", "Chassi", "Pneu DD"],
  lat_dir: ["Carenagem DIR", "Motor lateral", "Pneu DE"],
  traseira: ["Eixo", "Coroa", "Pneus traseiros"],
  motor: ["Carburador", "Escape", "Radiador"],
  pneus: ["DD", "DE", "TE", "TD"],
  freios: ["Disco diant.", "Disco traseiro", "Fluido"],
};

export type DiagramMark = {
  id: string;
  view: DiagramZoneKey;
  zone: string;
  label: string;
};

export const TECHNICAL_TIMELINE = [
  {
    id: "t1",
    date: "20 mai 2026",
    title: "Pós-treino",
    detail: "Restrito — pneu TD elevado",
  },
  {
    id: "t2",
    date: "05 mai 2026",
    title: "Manutenção",
    detail: "Troca corrente e pastilhas",
  },
  {
    id: "t3",
    date: "22 abr 2026",
    title: "Falha recorrente",
    detail: "Alerta: freio traseiro",
  },
];

export const DEFAULT_INSPECTION_KART: ChecklistKartContext & {
  ownerName?: string;
  lastMaintenance: string;
} = {
  ...DEFAULT_CHECKLIST_KART,
  ownerName: "Frota Gurgel",
  lastMaintenance: "12 mai 2026 — Revisão 400h",
};

export const MOCK_DIAGNOSIS =
  "Kart apresenta desgaste excessivo na relação e perda de eficiência de frenagem.";

export const SIGNATURE_STAFF = {
  mechanic: "Carlos Silva",
  supervisor: "Lucas Mendes",
  signedAt: "21 mai 2026, 15:42",
};

import {
  buildInitialItemStates as buildInitialItemStatesFromModules,
  computeInspectionResult as computeInspectionResultFromModules,
} from "@/lib/maintenance/inspection-compute";

export function buildInitialItemStates(): Record<string, InspectionItemState> {
  return buildInitialItemStatesFromModules(INSPECTION_MODULES);
}

export function computeInspectionResult(
  items: Record<string, InspectionItemState>,
  general: GeneralCondition,
) {
  return computeInspectionResultFromModules(INSPECTION_MODULES, items, general);
}

export const GENERAL_CONDITION_META: Record<
  GeneralCondition,
  { label: string; color: string; bar: string; summary: string }
> = {
  excelente: {
    label: "Excelente",
    color: "text-emerald-700",
    bar: "bg-emerald-500",
    summary: "Kart em condição ideal para pista.",
  },
  boa: {
    label: "Boa",
    color: "text-sky-800",
    bar: "bg-sky-500",
    summary: "Operação normal com pequenos desgastes.",
  },
  atencao: {
    label: "Atenção",
    color: "text-amber-800",
    bar: "bg-amber-500",
    summary: "Acompanhar itens antes da próxima sessão.",
  },
  critica: {
    label: "Crítica",
    color: "text-red-800",
    bar: "bg-red-500",
    summary: "Intervenção necessária antes de liberar.",
  },
};
