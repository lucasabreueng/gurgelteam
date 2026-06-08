import type { ReportDefinitionDTO } from "./report.types";

/** Catálogo alvo de relatórios operacionais — `[PLANEJADO]` sem página admin (Fase 2 spec). */
export const OPERATIONAL_REPORT_DEFINITIONS: ReportDefinitionDTO[] = [
  {
    id: "track_occupancy",
    domain: "operacional",
    label: "Ocupação da pista",
    description: "Taxa de ocupação por dia/semana e slots livres vs reservados.",
    exportFormats: ["pdf", "xlsx"],
  },
  {
    id: "schedule_utilization",
    domain: "operacional",
    label: "Utilização da agenda",
    description: "Mix de tipos de evento, no-shows e cancelamentos no período.",
    exportFormats: ["pdf", "xlsx", "csv"],
  },
  {
    id: "pilot_performance",
    domain: "operacional",
    label: "Desempenho de pilotos",
    description: "Evolução, melhor volta e consistência agregados por categoria.",
    exportFormats: ["pdf", "xlsx"],
  },
  {
    id: "fleet_usage",
    domain: "operacional",
    label: "Uso da frota",
    description: "Horas por kart, incidentes e tempo em manutenção.",
    exportFormats: ["pdf", "xlsx"],
  },
  {
    id: "maintenance_summary",
    domain: "operacional",
    label: "Resumo de manutenção",
    description: "OS abertas/fechadas, peças consumidas e karts indisponíveis.",
    exportFormats: ["pdf", "xlsx"],
  },
];

/** Relatórios financeiros — hoje em `lib/admin-financial-mocks.ts` (`FINANCIAL_REPORTS`). */
export const FINANCIAL_REPORT_DEFINITIONS: ReportDefinitionDTO[] = [
  { id: "daily", domain: "financeiro", label: "Receita diária", description: "Consolidado por dia", exportFormats: ["pdf", "xlsx"] },
  { id: "monthly", domain: "financeiro", label: "Receita mensal", description: "Comparativo mensal", exportFormats: ["pdf", "xlsx"] },
  { id: "service", domain: "financeiro", label: "Receita por serviço", description: "Mix de receitas", exportFormats: ["pdf", "xlsx"] },
  { id: "client", domain: "financeiro", label: "Receita por cliente", description: "Ranking de clientes", exportFormats: ["pdf", "xlsx"] },
  { id: "kart", domain: "financeiro", label: "Receita por kart", description: "Performance por kart", exportFormats: ["pdf", "xlsx"] },
  { id: "costs", domain: "financeiro", label: "Custos operacionais", description: "Saídas detalhadas", exportFormats: ["pdf", "xlsx"] },
  { id: "delinq", domain: "financeiro", label: "Inadimplência", description: "Títulos em atraso", exportFormats: ["pdf", "xlsx"] },
  { id: "cashflow", domain: "financeiro", label: "Fluxo de caixa", description: "Entradas, saídas e saldo", exportFormats: ["pdf", "xlsx"] },
];
