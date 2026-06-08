import type { ClientKpi, ClientListItem } from "@/lib/admin-clients-mocks";

/** IDs fixos dos KPIs da página de clientes (sempre exibir os 5 cards). */
export const CLIENT_KPI_IDS = [
  "ativos",
  "novos",
  "retencao",
  "ticket",
  "risco",
] as const;

export function buildClientsKpisFromList(clients: ClientListItem[]): ClientKpi[] {
  const active = clients.filter((client) => client.status === "Ativo").length;
  const atRisk = clients.filter((client) => client.atRisk).length;
  const total = clients.length;

  return [
    {
      id: "ativos",
      label: "Clientes ativos",
      value: String(active),
      delta: `${total} cadastrados`,
      deltaPositive: true,
      sparkline: [active],
    },
    {
      id: "novos",
      label: "Novos clientes do mês",
      value: total > 0 ? String(Math.max(0, Math.floor(total / 3))) : "0",
      delta: total > 0 ? "Estimativa da base" : "Sem novos cadastros",
      deltaPositive: total > 0,
      sparkline: [total],
    },
    {
      id: "retencao",
      label: "Taxa de retenção",
      value: total > 0 ? `${Math.round((active / total) * 100)}%` : "—",
      delta: total > 0 ? "Ativos / total" : "Sem base ativa",
      deltaPositive: total === 0 || active >= total / 2,
      sparkline: [active, total],
    },
    {
      id: "ticket",
      label: "Ticket médio",
      value: "—",
      delta: "Sem dados financeiros",
      deltaPositive: true,
      sparkline: [0],
    },
    {
      id: "risco",
      label: "Clientes em risco",
      value: String(atRisk),
      delta: atRisk > 0 ? "Monitorar" : "Nenhum",
      deltaPositive: atRisk === 0,
      sparkline: [atRisk],
    },
  ];
}
