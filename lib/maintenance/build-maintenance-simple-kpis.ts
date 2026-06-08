import type { MaintenanceSimpleKpi } from "@/lib/contracts/maintenance";

export const MAINTENANCE_SIMPLE_KPI_IDS = [
  "disponiveis",
  "atencao",
  "manutencao",
  "inspecoes",
  "custo",
  "checklists_mes",
  "checklists_pendentes",
  "ultimo_checklist",
] as const;

type MaintenanceStatsInput = {
  disponiveis: number;
  manutencao: number;
  openOrders: number;
  inProgress: number;
  pendingInspections: number;
  atencao?: number;
  monthlyCostCents?: number;
  checklistsThisMonth?: number;
  pendingChecklists?: number;
  lastChecklistLabel?: string;
};

function formatBrl(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function buildMaintenanceSimpleKpis(
  stats: MaintenanceStatsInput,
): MaintenanceSimpleKpi[] {
  const atencao = stats.atencao ?? 0;
  const monthlyCost = stats.monthlyCostCents ?? 0;
  const checklistsMonth = stats.checklistsThisMonth ?? 0;
  const pendingChecklists = stats.pendingChecklists ?? 0;
  const lastChecklist = stats.lastChecklistLabel ?? "—";

  return [
    {
      id: "disponiveis",
      label: "Karts disponíveis",
      value: String(stats.disponiveis),
      delta: stats.disponiveis > 0 ? "Prontos para pista" : "Nenhum disponível",
      deltaPositive: stats.disponiveis > 0,
    },
    {
      id: "atencao",
      label: "Karts em atenção",
      value: String(atencao),
      delta: atencao > 0 ? "Inspeção ou revisão próxima" : "Nenhum",
      deltaPositive: atencao === 0,
    },
    {
      id: "manutencao",
      label: "Karts em manutenção",
      value: String(stats.manutencao),
      delta:
        stats.manutencao > 0 ? "Intervenção em andamento" : "Nenhum em oficina",
      deltaPositive: stats.manutencao === 0,
    },
    {
      id: "inspecoes",
      label: "Inspeções pendentes",
      value: String(stats.pendingInspections),
      delta:
        stats.pendingInspections > 0
          ? "Aguardando conferência"
          : "Nenhuma pendente",
      deltaPositive: stats.pendingInspections === 0,
    },
    {
      id: "custo",
      label: "Custo no mês",
      value: monthlyCost > 0 ? formatBrl(monthlyCost) : "—",
      delta: monthlyCost > 0 ? "Manutenções do mês" : "Sem dados",
      deltaPositive: true,
    },
    {
      id: "checklists_mes",
      label: "Checklists no mês",
      value: String(checklistsMonth),
      delta: checklistsMonth > 0 ? "Concluídos no mês" : "Nenhum no mês",
      deltaPositive: checklistsMonth > 0,
    },
    {
      id: "checklists_pendentes",
      label: "Checklists pendentes",
      value: String(pendingChecklists),
      delta:
        pendingChecklists > 0
          ? "Aguardando conclusão"
          : "Nenhum pendente",
      deltaPositive: pendingChecklists === 0,
    },
    {
      id: "ultimo_checklist",
      label: "Último checklist",
      value: lastChecklist === "—" ? "—" : lastChecklist.split(" · ")[0] ?? "—",
      delta: lastChecklist === "—" ? "Sem registros" : lastChecklist,
      deltaPositive: lastChecklist !== "—",
    },
  ];
}
