/** Dados mockados — Registro de peças */

import {
  MAINTENANCE_ORDERS,
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_TYPE_LABELS,
  type MaintenanceOrderListItem,
} from "./admin-maintenance-mocks";

export type PartUsageType =
  | "preventiva"
  | "corretiva"
  | "emergencia"
  | "setup"
  | "revisao"
  | "desgaste";

export type PartUnit = "unidade" | "par" | "jogo" | "ml" | "litro" | "metro";

export type ClientBillingMode =
  | "orcamento"
  | "cobrar"
  | "interno";

export type StockLevel = "ok" | "low" | "critical";

export type RegisterPartOsContext = {
  orderId: string;
  osNumber: string;
  kartNumber: number;
  kartPhoto: string;
  categoryName: string;
  ownership: "rental" | "client";
  ownerName?: string;
  status: string;
  maintenanceType: string;
  mechanicId: string;
  mechanicName: string;
  openedAt: string;
};

export type PartCatalogItem = {
  id: string;
  code: string;
  name: string;
  category: string;
  supplier: string;
  compatibility: string;
  stock: number;
  stockLevel: StockLevel;
  unitCost: number;
  location: string;
  image?: string;
  defaultUnit: PartUnit;
};

export const USAGE_TYPE_OPTIONS: { value: PartUsageType; label: string }[] = [
  { value: "preventiva", label: "Preventiva" },
  { value: "corretiva", label: "Corretiva" },
  { value: "emergencia", label: "Emergência" },
  { value: "setup", label: "Setup" },
  { value: "revisao", label: "Revisão" },
  { value: "desgaste", label: "Desgaste natural" },
];

export const PART_UNIT_OPTIONS: { value: PartUnit; label: string }[] = [
  { value: "unidade", label: "Unidade" },
  { value: "par", label: "Par" },
  { value: "jogo", label: "Jogo" },
  { value: "ml", label: "ml" },
  { value: "litro", label: "Litro" },
  { value: "metro", label: "Metro" },
];

export const PARTS_CATALOG: PartCatalogItem[] = [
  {
    id: "p-corrente",
    code: "TR-219H",
    name: "Corrente 219H O-Ring",
    category: "Transmissão",
    supplier: "Racing Parts BR",
    compatibility: "125cc / Competição",
    stock: 5,
    stockLevel: "low",
    unitCost: 420,
    location: "A3 · Prateleira 2",
    image: "/images/gallery-5.jpg",
    defaultUnit: "unidade",
  },
  {
    id: "p-pinhao",
    code: "TR-P10",
    name: "Pinhão 10 dentes",
    category: "Transmissão",
    supplier: "Kart Pro",
    compatibility: "11×74 / Rotax",
    stock: 8,
    stockLevel: "ok",
    unitCost: 290,
    location: "A3 · Prateleira 2",
    defaultUnit: "unidade",
  },
  {
    id: "p-coroa",
    code: "TR-C74",
    name: "Coroa 11×74",
    category: "Transmissão",
    supplier: "Racing Parts BR",
    compatibility: "Competição",
    stock: 3,
    stockLevel: "critical",
    unitCost: 680,
    location: "A3 · Prateleira 1",
    defaultUnit: "unidade",
  },
  {
    id: "p-pneu-mg",
    code: "PN-MG-RED",
    name: "Pneu MG Vermelho",
    category: "Pneus",
    supplier: "MG Tires",
    compatibility: "Rental / Cadete",
    stock: 12,
    stockLevel: "ok",
    unitCost: 620,
    location: "B1 · Parede pneus",
    image: "/images/gallery-2.jpg",
    defaultUnit: "jogo",
  },
  {
    id: "p-pastilha",
    code: "FR-PAD-01",
    name: "Pastilha de freio",
    category: "Freios",
    supplier: "Kart Pro",
    compatibility: "Universal F400",
    stock: 14,
    stockLevel: "ok",
    unitCost: 180,
    location: "A2 · Gaveta freios",
    defaultUnit: "par",
  },
  {
    id: "p-carburador",
    code: "MO-CARB-X30",
    name: "Carburador X30",
    category: "Motor",
    supplier: "IAME Distrib.",
    compatibility: "X30 / 125cc",
    stock: 2,
    stockLevel: "critical",
    unitCost: 1850,
    location: "C1 · Vitrine motor",
    defaultUnit: "unidade",
  },
  {
    id: "p-oleo",
    code: "LU-2T-1L",
    name: "Óleo 2T competição",
    category: "Lubrificantes",
    supplier: "Motul BR",
    compatibility: "Todos os karts",
    stock: 24,
    stockLevel: "ok",
    unitCost: 95,
    location: "D2 · Fluidos",
    defaultUnit: "litro",
  },
  {
    id: "p-vela",
    code: "IG-VELA-NGK",
    name: "Vela NGK padrão",
    category: "Motor",
    supplier: "NGK",
    compatibility: "125cc / Rental",
    stock: 18,
    stockLevel: "ok",
    unitCost: 45,
    location: "C1 · Gaveta ignição",
    defaultUnit: "unidade",
  },
];

export const SMART_PART_SUGGESTIONS = [
  "Já que trocou a corrente, verificar coroa e pinhão.",
  "Essa peça costuma ser substituída junto com pastilhas.",
  "Pneu próximo do limite de ciclos neste kart.",
];

export type QuickPartHistoryItem = {
  id: string;
  partName: string;
  daysAgo: string;
  mechanic: string;
  cost: string;
};

export const DEFAULT_QUICK_PART_HISTORY: QuickPartHistoryItem[] = [
  {
    id: "h1",
    partName: "Corrente 219H",
    daysAgo: "18 dias",
    mechanic: "Rafael Costa",
    cost: "R$ 420",
  },
  {
    id: "h2",
    partName: "Pastilha de freio",
    daysAgo: "32 dias",
    mechanic: "Carlos Silva",
    cost: "R$ 360",
  },
];

export function orderToRegisterContext(
  order: MaintenanceOrderListItem
): RegisterPartOsContext {
  return {
    orderId: order.id,
    osNumber: order.osNumber,
    kartNumber: order.kartNumber,
    kartPhoto: order.kartPhoto,
    categoryName: order.categoryName,
    ownership: order.ownership,
    ownerName: order.ownerName,
    status: MAINTENANCE_STATUS_LABELS[order.status],
    maintenanceType: MAINTENANCE_TYPE_LABELS[order.type],
    mechanicId: order.mechanicId,
    mechanicName: order.mechanicName,
    openedAt: order.openedAt,
  };
}

export const DEFAULT_REGISTER_PART_OS: RegisterPartOsContext =
  orderToRegisterContext(
    MAINTENANCE_ORDERS.find((o) => o.id === "os-001") ?? MAINTENANCE_ORDERS[0]
  );

export function searchPartsCatalog(query: string): PartCatalogItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PARTS_CATALOG.filter((p) => {
    const hay = [
      p.name,
      p.code,
      p.category,
      p.supplier,
      p.compatibility,
      p.location,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  }).slice(0, 6);
}

export function getStockAlert(
  part: PartCatalogItem,
  qty: number
): { tone: "ok" | "low" | "critical" | "error"; message: string } | null {
  if (qty > part.stock) {
    return {
      tone: "error",
      message: `Quantidade maior que o estoque (${part.stock} disponíveis). Ajuste antes de salvar.`,
    };
  }
  if (part.stockLevel === "critical" || part.stock - qty <= 1) {
    return {
      tone: "critical",
      message: "Estoque crítico. Solicite reposição.",
    };
  }
  if (part.stockLevel === "low" || part.stock - qty <= 3) {
    return {
      tone: "low",
      message: `Estoque baixo. Restam apenas ${part.stock - qty} unidade(s) após registro.`,
    };
  }
  return null;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

/** Mock: simula leitura de código de barras */
export function mockBarcodeLookup(): PartCatalogItem {
  return PARTS_CATALOG[0];
}
