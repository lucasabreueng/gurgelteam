import type { InventoryKpi } from "@/lib/admin-inventory-mocks";

export const INVENTORY_KPI_IDS = [
  "items",
  "critical",
  "used-today",
  "pending-purchases",
  "total-value",
  "last-movement",
] as const;

type InventoryStatsInput = {
  totalParts: number;
  lowStock: number;
  critical: number;
  totalValueCents: number;
  formattedTotalValue: string;
  usedToday?: number;
  pendingPurchases?: number;
  lastMovementLabel?: string;
};

export function buildInventoryKpisFromStats(
  stats: InventoryStatsInput,
): InventoryKpi[] {
  const usedToday = stats.usedToday ?? 0;
  const pendingPurchases = stats.pendingPurchases ?? 0;
  const lastMovement = stats.lastMovementLabel ?? "—";

  return [
    {
      id: "items",
      label: "Itens em estoque",
      value: String(stats.totalParts),
      delta: stats.totalParts > 0 ? "Catálogo ativo" : "Sem peças",
      deltaPositive: stats.totalParts > 0,
      sparkline: [],
    },
    {
      id: "critical",
      label: "Estoque crítico",
      value: String(stats.critical),
      delta: stats.critical > 0 ? "Reposição urgente" : "Nenhum crítico",
      deltaPositive: stats.critical === 0,
      sparkline: [],
    },
    {
      id: "used-today",
      label: "Peças utilizadas hoje",
      value: String(usedToday),
      delta: usedToday > 0 ? "Saídas hoje" : "Nenhuma saída hoje",
      deltaPositive: usedToday >= 0,
      sparkline: [],
    },
    {
      id: "pending-purchases",
      label: "Compras pendentes",
      value: String(pendingPurchases),
      delta: pendingPurchases > 0 ? "Aguardando recebimento" : "Nenhuma",
      deltaPositive: pendingPurchases === 0,
      sparkline: [],
    },
    {
      id: "total-value",
      label: "Valor total em estoque",
      value:
        stats.totalParts > 0 ? stats.formattedTotalValue : "—",
      delta: stats.totalParts > 0 ? "Valor estimado" : "Sem dados",
      deltaPositive: stats.totalParts > 0,
      sparkline: [],
    },
    {
      id: "last-movement",
      label: "Última movimentação",
      value: lastMovement === "—" ? "—" : lastMovement.split(" · ")[0] ?? "—",
      delta: lastMovement === "—" ? "Sem movimentações" : lastMovement,
      deltaPositive: lastMovement !== "—",
      sparkline: [],
    },
  ];
}
