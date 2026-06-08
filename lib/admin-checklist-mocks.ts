/** Dados mockados — Checklist de inspeção paddock */

export type InspectionItemStatus = "ok" | "warn" | "fail" | null;

export type ChecklistTypeKey = "pre" | "post" | "revisao" | "evento";

export type OverallInspectionStatus = "liberado" | "restrito" | "bloqueado";

export const CHECKLIST_TYPES: { key: ChecklistTypeKey; label: string }[] = [
  { key: "pre", label: "Pré-treino" },
  { key: "post", label: "Pós-treino" },
  { key: "revisao", label: "Revisão técnica" },
  { key: "evento", label: "Liberação para evento" },
];

export type ChecklistKartContext = {
  orderId: string;
  kartNumber: number;
  photo: string;
  categoryName: string;
  kartStatus: string;
  engineHours: number;
  lastChecklist: string;
  responsible: string;
  reliabilityScore: number;
  daysSinceRevision: number;
  quickNote: string;
};

export const DEFAULT_CHECKLIST_KART: ChecklistKartContext = {
  orderId: "os-001",
  kartNumber: 12,
  photo: "/images/gallery-5.jpg",
  categoryName: "Competição",
  kartStatus: "Aguardando peça",
  engineHours: 512,
  lastChecklist: "Ontem, 18:40 — Pós-treino",
  responsible: "Carlos Silva",
  reliabilityScore: 78,
  daysSinceRevision: 12,
  quickNote: "Corrente com desgaste acima do ideal.",
};

export type InspectionItemDef = {
  id: string;
  label: string;
  critical?: boolean;
  tireWearPercent?: number;
};

export type InspectionSectionDef = {
  id: string;
  title: string;
  items: InspectionItemDef[];
  variant?: "tires";
};

export const INSPECTION_SECTIONS: InspectionSectionDef[] = [
  {
    id: "seguranca",
    title: "Segurança",
    items: [
      { id: "seg-banco", label: "Banco fixado", critical: true },
      { id: "seg-volante", label: "Volante firme", critical: true },
      { id: "seg-pedais", label: "Pedais ajustados" },
      { id: "seg-parafusos", label: "Parafusos visíveis" },
      { id: "seg-geral", label: "Segurança geral", critical: true },
    ],
  },
  {
    id: "freios",
    title: "Freios",
    items: [
      { id: "fr-pressao", label: "Pressão", critical: true },
      { id: "fr-resposta", label: "Resposta", critical: true },
      { id: "fr-vazamento", label: "Vazamento", critical: true },
      { id: "fr-pastilhas", label: "Pastilhas" },
      { id: "fr-disco", label: "Disco" },
    ],
  },
  {
    id: "pneus",
    title: "Pneus",
    variant: "tires",
    items: [
      { id: "pn-desgaste-dd", label: "Desgaste DD", tireWearPercent: 62 },
      { id: "pn-desgaste-de", label: "Desgaste DE", tireWearPercent: 58 },
      { id: "pn-desgaste-te", label: "Desgaste TE", tireWearPercent: 71 },
      { id: "pn-desgaste-td", label: "Desgaste TD", tireWearPercent: 68 },
      { id: "pn-calibragem", label: "Calibragem" },
      { id: "pn-pressao", label: "Pressão" },
      { id: "pn-temp", label: "Temperatura" },
      { id: "pn-integridade", label: "Integridade", critical: true },
    ],
  },
  {
    id: "motor",
    title: "Motor",
    items: [
      { id: "mo-func", label: "Funcionamento", critical: true },
      { id: "mo-vaz", label: "Vazamentos", critical: true },
      { id: "mo-temp", label: "Temperatura" },
      { id: "mo-acel", label: "Aceleração" },
      { id: "mo-marcha", label: "Marcha lenta" },
      { id: "mo-carb", label: "Carburador" },
    ],
  },
  {
    id: "transmissao",
    title: "Relação / Transmissão",
    items: [
      { id: "tr-corrente", label: "Corrente", critical: true },
      { id: "tr-coroa", label: "Coroa" },
      { id: "tr-pinhao", label: "Pinhão" },
      { id: "tr-tensao", label: "Tensão" },
      { id: "tr-lub", label: "Lubrificação" },
    ],
  },
  {
    id: "estrutura",
    title: "Estrutura",
    items: [
      { id: "es-chassi", label: "Chassi", critical: true },
      { id: "es-carenagem", label: "Carenagem" },
      { id: "es-alinh", label: "Alinhamento" },
      { id: "es-trinca", label: "Trincas", critical: true },
      { id: "es-solda", label: "Soldas" },
    ],
  },
  {
    id: "combustivel",
    title: "Combustível",
    items: [
      { id: "cb-nivel", label: "Nível" },
      { id: "cb-vaz", label: "Vazamentos", critical: true },
      { id: "cb-tampa", label: "Tampa" },
      { id: "cb-mang", label: "Mangueiras" },
    ],
  },
];

export const CHECKLIST_SMART_ALERTS = [
  {
    id: "ca1",
    message:
      "Kart 12 apresentou 3 reprovações de freio nas últimas semanas.",
    severity: "urgent" as const,
  },
  {
    id: "ca2",
    message: "Pneus próximos do limite.",
    severity: "warn" as const,
  },
  {
    id: "ca3",
    message: "Motor próximo da revisão.",
    severity: "info" as const,
  },
];

export const CHECKLIST_HISTORY = [
  {
    id: "ch1",
    date: "20 mai 2026, 18:40",
    responsible: "André Mendes",
    result: "Restrito",
    photos: 2,
    notes: "Pneu TD com desgaste elevado.",
  },
  {
    id: "ch2",
    date: "18 mai 2026, 08:10",
    responsible: "Carlos Silva",
    result: "Liberado",
    photos: 0,
    notes: "Liberação pré-treino sem ressalvas.",
  },
  {
    id: "ch3",
    date: "15 mai 2026, 16:00",
    responsible: "Paulo Rocha",
    result: "Bloqueado",
    photos: 4,
    notes: "Freio traseiro reprovado — enviado à manutenção.",
  },
];

export type ChecklistMediaPreview = {
  id: string;
  label: string;
  type: "foto" | "video";
  url?: string;
};

export const MOCK_MEDIA_PREVIEWS: ChecklistMediaPreview[] = [
  { id: "m1", label: "Corrente traseira", type: "foto" },
  { id: "m2", label: "Desgaste pneu TE", type: "foto" },
];

export const KART_DIAGRAM_VIEWS = [
  { key: "frente" as const, label: "Frente" },
  { key: "lateral" as const, label: "Lateral" },
  { key: "traseira" as const, label: "Traseira" },
];

export type DiagramMark = { view: "frente" | "lateral" | "traseira"; zone: string };

export const DIAGRAM_ZONES: Record<
  "frente" | "lateral" | "traseira",
  string[]
> = {
  frente: ["Para-choque", "Volante", "Pedais"],
  lateral: ["Motor", "Carenagem", "Pneu DD", "Pneu DE"],
  traseira: ["Eixo", "Coroa", "Pneu TE", "Pneu TD"],
};

export function buildInitialItemState(): Record<string, InspectionItemStatus> {
  const state: Record<string, InspectionItemStatus> = {};
  for (const section of INSPECTION_SECTIONS) {
    for (const item of section.items) {
      if (item.id === "tr-corrente") state[item.id] = "warn";
      else if (item.id === "pn-desgaste-te") state[item.id] = "warn";
      else state[item.id] = null;
    }
  }
  return state;
}

export function computeInspectionSummary(
  items: Record<string, InspectionItemStatus>
): {
  ok: number;
  warn: number;
  fail: number;
  overall: OverallInspectionStatus;
  heroLabel: string;
  heroTone: "ok" | "warn" | "fail";
} {
  let ok = 0;
  let warn = 0;
  let fail = 0;
  let criticalFail = false;

  for (const section of INSPECTION_SECTIONS) {
    for (const def of section.items) {
      const s = items[def.id];
      if (s === "ok") ok++;
      else if (s === "warn") warn++;
      else if (s === "fail") {
        fail++;
        if (def.critical) criticalFail = true;
      }
    }
  }

  let overall: OverallInspectionStatus = "liberado";
  let heroLabel = "Liberado para pista";
  let heroTone: "ok" | "warn" | "fail" = "ok";

  if (criticalFail) {
    overall = "bloqueado";
    heroLabel = "Reprovado";
    heroTone = "fail";
  } else if (fail > 0 || warn > 0) {
    overall = "restrito";
    heroLabel = "Atenção necessária";
    heroTone = "warn";
  }

  return { ok, warn, fail, overall, heroLabel, heroTone };
}

export const OVERALL_STATUS_LABELS: Record<OverallInspectionStatus, string> = {
  liberado: "Liberado",
  restrito: "Restrito",
  bloqueado: "Bloqueado",
};
