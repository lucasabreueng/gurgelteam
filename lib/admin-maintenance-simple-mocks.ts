import type {
  InspectionItemKey,
  MaintenanceFleetStatus,
  MaintenanceActivity,
  MaintenanceFleetKart,
  MaintenanceSimpleKpi,
  MaintenanceSimpleFilterState,
  SimpleMaintenanceType,
} from "@/lib/contracts/maintenance/simple";
import {
  buildCorrectiveMaintenanceSummary,
  buildMaintenanceFleetKart,
} from "@/lib/maintenance/build-maintenance-fleet-kart";
import type {
  ChecklistHistoryRow,
  ChecklistListFilterState,
  CompleteChecklistRecord,
  InspectionListFilterState,
  KartTechnicalTimelineEntry,
  MaintenanceListFilterState,
  MaintenancePageTabKey,
  SimpleInspectionRow,
  SimpleMaintenanceRow,
} from "@/lib/contracts/maintenance/complete-checklist";
import { CHECKLIST_FINAL_STATUS_LABELS } from "@/lib/contracts/maintenance/complete-checklist";

export const MAINTENANCE_RESPONSIBLES = [
  { id: "carlos", name: "Carlos Silva" },
  { id: "andre", name: "André Mendes" },
  { id: "paulo", name: "Paulo Rocha" },
];

export const MAINTENANCE_SIMPLE_KPIS: MaintenanceSimpleKpi[] = [
  {
    id: "disponiveis",
    label: "Karts disponíveis",
    value: "3",
    delta: "Prontos para pista hoje",
    deltaPositive: true,
  },
  {
    id: "atencao",
    label: "Karts em atenção",
    value: "1",
    delta: "Inspeção ou revisão próxima",
    deltaPositive: false,
  },
  {
    id: "manutencao",
    label: "Karts em manutenção",
    value: "1",
    delta: "Intervenção em andamento",
    deltaPositive: false,
  },
  {
    id: "inspecoes",
    label: "Inspeções pendentes",
    value: "2",
    delta: "Aguardando conferência",
    deltaPositive: false,
  },
  {
    id: "custo",
    label: "Custo no mês",
    value: "R$ 4.280",
    delta: "Manutenções de maio",
    deltaPositive: true,
  },
  {
    id: "checklists_mes",
    label: "Checklists no mês",
    value: "6",
    delta: "Completos em maio",
    deltaPositive: true,
  },
  {
    id: "checklists_pendentes",
    label: "Checklists pendentes",
    value: "1",
    delta: "Aguardando conclusão",
    deltaPositive: false,
  },
  {
    id: "ultimo_checklist",
    label: "Último checklist",
    value: "Ontem",
    delta: "Kart 03 — Revisão periódica",
    deltaPositive: true,
  },
];

export const MAINTENANCE_PAGE_TABS: { key: MaintenancePageTabKey; label: string }[] =
  [
    { key: "karts", label: "Karts" },
    { key: "inspecoes", label: "Inspeções" },
    { key: "manutencoes", label: "Manutenções" },
    { key: "checklists", label: "Checklists" },
  ];

export const SIMPLE_INSPECTIONS: SimpleInspectionRow[] = [
  {
    id: "insp-1",
    date: "28 mai",
    kartId: "k03",
    kartNumber: 3,
    responsibleName: "Carlos Silva",
    summary: "Pneus em atenção",
    hasAttention: true,
  },
  {
    id: "insp-2",
    date: "28 mai",
    kartId: "k01",
    kartNumber: 1,
    responsibleName: "André Mendes",
    summary: "Todos os itens OK",
    hasAttention: false,
  },
  {
    id: "insp-3",
    date: "27 mai",
    kartId: "k02",
    kartNumber: 2,
    responsibleName: "Paulo Rocha",
    summary: "Corrente em atenção",
    hasAttention: true,
  },
  {
    id: "insp-4",
    date: "18 mai",
    kartId: "k04",
    kartNumber: 4,
    responsibleName: "Carlos Silva",
    summary: "Todos os itens OK",
    hasAttention: false,
  },
];

export const SIMPLE_MAINTENANCES: SimpleMaintenanceRow[] = [
  {
    id: "mnt-1",
    date: "28 mai",
    kartId: "k02",
    kartNumber: 2,
    type: "corretiva",
    category: "Freios",
    description: "Manutenção no freio",
    status: "em_andamento",
    costCents: 0,
  },
  {
    id: "mnt-2",
    date: "27 mai",
    kartId: "k05",
    kartNumber: 5,
    type: "corretiva",
    category: "Corrente",
    description: "Troca de corrente",
    status: "concluida",
    costCents: 28500,
  },
  {
    id: "mnt-3",
    date: "12 mai",
    kartId: "k01",
    kartNumber: 1,
    type: "preventiva",
    category: "Motor",
    description: "Limpeza de carburador",
    status: "concluida",
    costCents: 12000,
  },
  {
    id: "mnt-4",
    date: "11 mai",
    kartId: "k04",
    kartNumber: 4,
    type: "corretiva",
    category: "Direção",
    description: "Ajuste de direção",
    status: "pendente",
    costCents: 0,
  },
  {
    id: "mnt-5",
    date: "05 mai",
    kartId: "k03",
    kartNumber: 3,
    type: "preventiva",
    category: "Pneus",
    description: "Troca de pneus",
    status: "concluida",
    costCents: 89000,
  },
];

export const CHECKLIST_HISTORY: ChecklistHistoryRow[] = [
  {
    id: "chk-1",
    date: "27 mai",
    kartId: "k03",
    kartNumber: 3,
    type: "revisao_periodica",
    responsibleName: "Carlos Silva",
    finalStatus: "aprovado_ressalvas",
    failedCount: 0,
  },
  {
    id: "chk-2",
    date: "22 mai",
    kartId: "k02",
    kartNumber: 2,
    type: "pre_evento",
    responsibleName: "André Mendes",
    finalStatus: "reprovado",
    failedCount: 2,
  },
  {
    id: "chk-3",
    date: "18 mai",
    kartId: "k05",
    kartNumber: 5,
    type: "retorno_retifica",
    responsibleName: "Paulo Rocha",
    finalStatus: "aprovado",
    failedCount: 0,
  },
  {
    id: "chk-4",
    date: "10 mai",
    kartId: "k01",
    kartNumber: 1,
    type: "revisao_periodica",
    responsibleName: "Carlos Silva",
    finalStatus: "aprovado",
    failedCount: 0,
  },
];

export const COMPLETE_CHECKLIST_RECORDS: CompleteChecklistRecord[] = [
  {
    id: "chk-2",
    kartId: "k02",
    kartNumber: 2,
    date: "22 mai",
    dateIso: "2026-05-22",
    responsibleId: "andre",
    responsibleName: "André Mendes",
    type: "pre_evento",
    finalStatus: "reprovado",
    failedCount: 2,
    evaluations: [],
  },
];

export const MAINTENANCE_SIMPLE_FLEET: MaintenanceFleetKart[] = [
  buildMaintenanceFleetKart({
    id: "k01",
    number: 1,
    photo: "/images/gallery-1.jpg",
    status: "disponivel",
    engineHours: 12,
    preventiveMaintenanceHours: {
      oleo: 10,
      corrente: 0,
      coroa_pinhao: 0,
      revisao_motor: 0,
      rolamentos: 0,
      cabo_acelerador: 0,
    },
    lastInspection: "Hoje",
    lastMaintenance: "12 mai",
    monthlyCostCents: 42000,
  }),
  buildMaintenanceFleetKart({
    id: "k02",
    number: 2,
    photo: "/images/gallery-2.jpg",
    status: "disponivel",
    engineHours: 38,
    preventiveMaintenanceHours: {
      oleo: 35,
      corrente: 20,
      coroa_pinhao: 30,
      revisao_motor: 0,
      rolamentos: 0,
      cabo_acelerador: 20,
    },
    lastInspection: "Ontem",
    lastMaintenance: "28 abr",
    monthlyCostCents: 18500,
  }),
  buildMaintenanceFleetKart({
    id: "k03",
    number: 3,
    photo: "/images/gallery-3.jpg",
    status: "disponivel",
    engineHours: 41,
    preventiveMaintenanceHours: {
      oleo: 40,
      corrente: 20,
      coroa_pinhao: 30,
      revisao_motor: 0,
      rolamentos: 0,
      cabo_acelerador: 20,
    },
    lastInspection: "Hoje",
    lastMaintenance: "05 mai",
    monthlyCostCents: 89000,
    correctiveMaintenance: buildCorrectiveMaintenanceSummary({
      openChecklistLabel: "Checklist — Revisão periódica",
    }),
  }),
  buildMaintenanceFleetKart({
    id: "k04",
    number: 4,
    photo: "/images/gallery-4.jpg",
    status: "disponivel",
    engineHours: 22,
    preventiveMaintenanceHours: {
      oleo: 20,
      corrente: 20,
      coroa_pinhao: 0,
      revisao_motor: 0,
      rolamentos: 0,
      cabo_acelerador: 0,
    },
    lastInspection: "18 mai",
    lastMaintenance: "10 mai",
    monthlyCostCents: 31200,
  }),
  buildMaintenanceFleetKart({
    id: "k05",
    number: 5,
    photo: "/images/gallery-5.jpg",
    status: "manutencao",
    engineHours: 67,
    preventiveMaintenanceHours: {
      oleo: 65,
      corrente: 60,
      coroa_pinhao: 60,
      revisao_motor: 50,
      rolamentos: 40,
      cabo_acelerador: 60,
    },
    lastInspection: "16 mai",
    lastMaintenance: "Em andamento",
    monthlyCostCents: 156000,
    correctiveMaintenance: buildCorrectiveMaintenanceSummary({
      openOrderLabel: "Corretiva — Troca de corrente",
    }),
  }),
];

export const MAINTENANCE_RECENT_ACTIVITY: MaintenanceActivity[] = [
  {
    id: "a1",
    kartId: "k05",
    kartNumber: 5,
    title: "Troca de corrente",
    kind: "manutencao_concluida",
    statusLabel: "Concluída",
    when: "Ontem",
  },
  {
    id: "a2",
    kartId: "k03",
    kartNumber: 3,
    title: "Inspeção com atenção nos pneus",
    kind: "inspecao",
    statusLabel: "Hoje",
    when: "Hoje",
  },
  {
    id: "a3",
    kartId: "k02",
    kartNumber: 2,
    title: "Manutenção no freio",
    kind: "manutencao_aberta",
    statusLabel: "Em andamento",
    when: "Hoje",
  },
  {
    id: "a4",
    kartId: "k01",
    kartNumber: 1,
    title: "Limpeza de carburador",
    kind: "manutencao_concluida",
    statusLabel: "Concluída",
    when: "12 mai",
  },
  {
    id: "a5",
    kartId: "k04",
    kartNumber: 4,
    title: "Ajuste de direção",
    kind: "manutencao_aberta",
    statusLabel: "Pendente",
    when: "11 mai",
  },
  {
    id: "a6",
    kartId: "k03",
    kartNumber: 3,
    title: "Verificação de chassi",
    kind: "inspecao",
    statusLabel: "Atenção",
    when: "10 mai",
  },
  {
    id: "a7",
    kartId: "k02",
    kartNumber: 2,
    title: "Checklist completo — freios reprovados",
    kind: "checklist",
    statusLabel: CHECKLIST_FINAL_STATUS_LABELS.reprovado,
    when: "22 mai",
  },
];

export const MAINTENANCE_FILTER_KART_STATUS: {
  value: MaintenanceFleetStatus | "";
  label: string;
}[] = [
  { value: "", label: "Todos os status" },
  { value: "disponivel", label: "Disponível" },
  { value: "em_manutencao", label: "Em manutenção" },
  { value: "indisponivel", label: "Indisponível" },
];

export const MAINTENANCE_FILTER_TYPES: {
  value: SimpleMaintenanceType | "";
  label: string;
}[] = [
  { value: "", label: "Todos os tipos" },
  { value: "preventiva", label: "Preventiva" },
  { value: "corretiva", label: "Corretiva" },
];

export const MAINTENANCE_FILTER_PERIODS = [
  { value: "", label: "Qualquer período" },
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
] as const;

export function formatMaintenanceCurrency(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function getMaintenanceKartById(id: string): MaintenanceFleetKart | undefined {
  return MAINTENANCE_SIMPLE_FLEET.find((k) => k.id === id);
}

export function getKartHistory(kartId: string): MaintenanceActivity[] {
  return MAINTENANCE_RECENT_ACTIVITY.filter((a) => a.kartId === kartId);
}

export function getInspectionsList(): SimpleInspectionRow[] {
  return SIMPLE_INSPECTIONS;
}

export function getMaintenancesList(): SimpleMaintenanceRow[] {
  return SIMPLE_MAINTENANCES;
}

export function getChecklistHistory(): ChecklistHistoryRow[] {
  return CHECKLIST_HISTORY;
}

export function getChecklistRecordById(
  id: string,
): CompleteChecklistRecord | undefined {
  return COMPLETE_CHECKLIST_RECORDS.find((r) => r.id === id);
}

export function getMaintenancePageTabs(): { key: MaintenancePageTabKey; label: string }[] {
  return MAINTENANCE_PAGE_TABS;
}

/** Linha do tempo unificada: inspeções, manutenções e checklists. */
export function getKartTechnicalTimeline(
  kartId: string,
): KartTechnicalTimelineEntry[] {
  const entries: KartTechnicalTimelineEntry[] = [];

  for (const i of SIMPLE_INSPECTIONS.filter((x) => x.kartId === kartId)) {
    entries.push({
      id: i.id,
      date: i.date,
      dateLabel: i.date,
      kind: "inspecao",
      title: "Inspeção",
      detail: i.summary,
    });
  }

  for (const m of SIMPLE_MAINTENANCES.filter((x) => x.kartId === kartId)) {
    entries.push({
      id: m.id,
      date: m.date,
      dateLabel: m.date,
      kind: "manutencao",
      title: "Manutenção",
      detail: m.description,
    });
  }

  for (const c of CHECKLIST_HISTORY.filter((x) => x.kartId === kartId)) {
    const statusLabel = CHECKLIST_FINAL_STATUS_LABELS[c.finalStatus];
    entries.push({
      id: c.id,
      date: c.date,
      dateLabel: c.date,
      kind: "checklist",
      title: "Checklist Completo",
      detail:
        c.failedCount > 0
          ? `${statusLabel} — ${c.failedCount} item(ns) reprovado(s)`
          : statusLabel,
    });
  }

  return entries.sort((a, b) => {
    const parse = (d: string) => {
      const months: Record<string, number> = {
        jan: 1,
        fev: 2,
        mar: 3,
        abr: 4,
        mai: 5,
        jun: 6,
        jul: 7,
        ago: 8,
        set: 9,
        out: 10,
        nov: 11,
        dez: 12,
      };
      const parts = d.toLowerCase().split(" ");
      const day = parseInt(parts[0] ?? "1", 10);
      const mon = months[parts[1]?.slice(0, 3) ?? "mai"] ?? 5;
      return day + mon * 31;
    };
    return parse(b.date) - parse(a.date);
  });
}

/** Filtro leve por status do kart e kart selecionado (mock). */
export function filterMaintenanceFleet(
  karts: MaintenanceFleetKart[],
  filters: MaintenanceSimpleFilterState,
): MaintenanceFleetKart[] {
  return karts.filter((k) => {
    if (filters.kartStatus && k.status !== filters.kartStatus) return false;
    if (filters.kartId && k.id !== filters.kartId) return false;
    return true;
  });
}

export function filterInspectionsList(
  rows: SimpleInspectionRow[],
  filters: InspectionListFilterState,
): SimpleInspectionRow[] {
  return rows.filter((row) => {
    if (filters.kartId && row.kartId !== filters.kartId) return false;
    if (filters.attention === "yes" && !row.hasAttention) return false;
    if (filters.attention === "no" && row.hasAttention) return false;
    return true;
  });
}

export function filterMaintenancesList(
  rows: SimpleMaintenanceRow[],
  filters: MaintenanceListFilterState,
): SimpleMaintenanceRow[] {
  return rows.filter((row) => {
    if (filters.kartId && row.kartId !== filters.kartId) return false;
    if (filters.type && row.type !== filters.type) return false;
    if (filters.status && row.status !== filters.status) return false;
    return true;
  });
}

export function filterChecklistsList(
  rows: ChecklistHistoryRow[],
  filters: ChecklistListFilterState,
): ChecklistHistoryRow[] {
  return rows.filter((row) => {
    if (filters.kartId && row.kartId !== filters.kartId) return false;
    if (filters.type && row.type !== filters.type) return false;
    if (filters.finalStatus && row.finalStatus !== filters.finalStatus) return false;
    return true;
  });
}

export function inspectionItemLabel(key: InspectionItemKey): string {
  const labels: Record<InspectionItemKey, string> = {
    pneus: "Pneus",
    corrente: "Corrente",
    freios: "Freios",
    motor: "Motor",
    chassi: "Chassi",
    direcao: "Direção",
  };
  return labels[key];
}
