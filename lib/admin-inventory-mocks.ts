/** Dados mockados — Estoque Gurgel Team */

import type { StockLevel } from "./admin-parts-mocks";
import { formatCurrency } from "./admin-parts-mocks";

export type InventoryTabKey =
  | "overview"
  | "parts"
  | "movements"
  | "purchases"
  | "suppliers"
  | "history";

export const INVENTORY_TABS: { key: InventoryTabKey; label: string }[] = [
  { key: "overview", label: "Visão Geral" },
  { key: "parts", label: "Peças" },
  { key: "movements", label: "Movimentações" },
  { key: "purchases", label: "Compras" },
  { key: "suppliers", label: "Fornecedores" },
  { key: "history", label: "Histórico" },
];

export const INVENTORY_TABLE_PAGE_SIZES = [10, 25, 50] as const;

export const INVENTORY_TAB_META: Record<
  InventoryTabKey,
  { title: string; subtitle: string }
> = {
  overview: {
    title: "Visão Geral",
    subtitle: "Resumo operacional do estoque técnico do paddock",
  },
  parts: {
    title: "Peças",
    subtitle: "Catálogo técnico, níveis de estoque e custos unitários",
  },
  movements: {
    title: "Movimentações",
    subtitle: "Entradas, saídas e ajustes registrados no estoque",
  },
  purchases: {
    title: "Compras",
    subtitle: "Pedidos pendentes, aprovações e entregas programadas",
  },
  suppliers: {
    title: "Fornecedores",
    subtitle: "Parceiros do paddock, prazos e histórico de compras",
  },
  history: {
    title: "Histórico",
    subtitle: "Registro cronológico de eventos do estoque",
  },
};

export const STOCK_HEALTH_FILTER_OPTIONS: {
  value: StockLevel | "";
  label: string;
}[] = [
  { value: "", label: "Saúde" },
  { value: "ok", label: "Normal" },
  { value: "low", label: "Baixo" },
  { value: "critical", label: "Crítico" },
];

export type InventoryCategory =
  | "Motor"
  | "Pneus"
  | "Freio"
  | "Transmissão"
  | "Combustível"
  | "Segurança"
  | "Ferramentas"
  | "Elétrica";

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
  "Motor",
  "Pneus",
  "Freio",
  "Transmissão",
  "Combustível",
  "Segurança",
  "Ferramentas",
  "Elétrica",
];

export type InventoryKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
};

export const INVENTORY_KPIS: InventoryKpi[] = [
  {
    id: "items",
    label: "Itens em estoque",
    value: "248",
    delta: "+12",
    deltaPositive: true,
    sparkline: [210, 218, 225, 230, 238, 242, 248],
  },
  {
    id: "critical",
    label: "Estoque crítico",
    value: "7",
    delta: "+2",
    deltaPositive: false,
    sparkline: [3, 4, 4, 5, 6, 6, 7],
  },
  {
    id: "used-today",
    label: "Peças utilizadas hoje",
    value: "18",
    delta: "+5",
    deltaPositive: true,
    sparkline: [8, 10, 12, 14, 15, 16, 18],
  },
  {
    id: "pending-purchases",
    label: "Compras pendentes",
    value: "5",
    delta: "2 novas",
    deltaPositive: false,
    sparkline: [2, 3, 3, 4, 4, 5, 5],
  },
  {
    id: "total-value",
    label: "Valor total em estoque",
    value: "R$ 48.200",
    delta: "+3,2%",
    deltaPositive: true,
    sparkline: [42000, 43500, 44100, 45200, 46800, 47500, 48200],
  },
  {
    id: "most-used",
    label: "Peças mais utilizadas",
    value: "Corrente 219H",
    delta: "32 saídas",
    deltaPositive: true,
    sparkline: [18, 22, 24, 26, 28, 30, 32],
  },
  {
    id: "last-movement",
    label: "Última movimentação",
    value: "Hoje às 14:32",
    delta: "Saída",
    deltaPositive: true,
    sparkline: [1, 2, 3, 4, 5, 6, 7],
  },
];

export type InventoryPart = {
  id: string;
  code: string;
  name: string;
  category: InventoryCategory;
  compatibility: string;
  stock: number;
  minStock: number;
  stockLevel: StockLevel;
  location: string;
  unitCost: number;
  supplierId: string;
  supplierName: string;
  image?: string;
};

export const INVENTORY_PARTS: InventoryPart[] = [
  {
    id: "p-corrente",
    code: "TR-219H",
    name: "Corrente 219H O-Ring",
    category: "Transmissão",
    compatibility: "125cc / Competição",
    stock: 5,
    minStock: 8,
    stockLevel: "low",
    location: "A3 · Prateleira 2",
    unitCost: 420,
    supplierId: "sup-rpb",
    supplierName: "Racing Parts BR",
    image: "/images/gallery-5.jpg",
  },
  {
    id: "p-pinhao",
    code: "TR-P10",
    name: "Pinhão 10 dentes",
    category: "Transmissão",
    compatibility: "11×74 / Rotax",
    stock: 8,
    minStock: 4,
    stockLevel: "ok",
    location: "A3 · Prateleira 2",
    unitCost: 290,
    supplierId: "sup-kartpro",
    supplierName: "Kart Pro",
    image: "/images/gallery-6.jpg",
  },
  {
    id: "p-coroa",
    code: "TR-C74",
    name: "Coroa 11×74",
    category: "Transmissão",
    compatibility: "Competição",
    stock: 2,
    minStock: 4,
    stockLevel: "critical",
    location: "A3 · Prateleira 1",
    unitCost: 680,
    supplierId: "sup-rpb",
    supplierName: "Racing Parts BR",
    image: "/images/gallery-7.jpg",
  },
  {
    id: "p-pneu-mg",
    code: "PN-MG-RED",
    name: "Pneu MG Vermelho",
    category: "Pneus",
    compatibility: "Rental / Cadete",
    stock: 12,
    minStock: 6,
    stockLevel: "ok",
    location: "B1 · Parede pneus",
    unitCost: 620,
    supplierId: "sup-mg",
    supplierName: "MG Tires",
    image: "/images/gallery-2.jpg",
  },
  {
    id: "p-pastilha",
    code: "FR-PAD-01",
    name: "Pastilha dianteira",
    category: "Freio",
    compatibility: "Universal F400",
    stock: 3,
    minStock: 6,
    stockLevel: "critical",
    location: "A2 · Gaveta freios",
    unitCost: 180,
    supplierId: "sup-kartpro",
    supplierName: "Kart Pro",
    image: "/images/gallery-3.jpg",
  },
  {
    id: "p-corburador",
    code: "MO-CARB-X30",
    name: "Carburador X30",
    category: "Motor",
    compatibility: "X30 / 125cc",
    stock: 2,
    minStock: 3,
    stockLevel: "critical",
    location: "C1 · Vitrine motor",
    unitCost: 1850,
    supplierId: "sup-iame",
    supplierName: "IAME Distrib.",
    image: "/images/gallery-4.jpg",
  },
  {
    id: "p-oleo",
    code: "LU-2T-1L",
    name: "Óleo 2T competição",
    category: "Motor",
    compatibility: "Todos os karts",
    stock: 24,
    minStock: 10,
    stockLevel: "ok",
    location: "D2 · Fluidos",
    unitCost: 95,
    supplierId: "sup-motul",
    supplierName: "Motul BR",
  },
  {
    id: "p-vela",
    code: "IG-VELA-NGK",
    name: "Vela NGK padrão",
    category: "Motor",
    compatibility: "125cc / Rental",
    stock: 18,
    minStock: 8,
    stockLevel: "ok",
    location: "C1 · Gaveta ignição",
    unitCost: 45,
    supplierId: "sup-ngk",
    supplierName: "NGK",
  },
  {
    id: "p-combustivel",
    code: "CB-98-20L",
    name: "Combustível 98 octanas",
    category: "Combustível",
    compatibility: "Competição",
    stock: 8,
    minStock: 4,
    stockLevel: "ok",
    location: "D1 · Tanque reserva",
    unitCost: 320,
    supplierId: "sup-petro",
    supplierName: "Petro Racing",
  },
  {
    id: "p-capacete",
    code: "SG-CAP-01",
    name: "Capacete homologado",
    category: "Segurança",
    compatibility: "Cadete / Mirim",
    stock: 6,
    minStock: 4,
    stockLevel: "ok",
    location: "E1 · Equipamentos",
    unitCost: 890,
    supplierId: "sup-kartpro",
    supplierName: "Kart Pro",
    image: "/images/gallery-8.jpg",
  },
  {
    id: "p-chave",
    code: "FT-KEY-SET",
    name: "Jogo de chaves allen",
    category: "Ferramentas",
    compatibility: "Oficina",
    stock: 4,
    minStock: 2,
    stockLevel: "ok",
    location: "F1 · Bancada",
    unitCost: 120,
    supplierId: "sup-kartpro",
    supplierName: "Kart Pro",
  },
  {
    id: "p-bobina",
    code: "EL-BOB-X30",
    name: "Bobina de ignição X30",
    category: "Elétrica",
    compatibility: "X30",
    stock: 1,
    minStock: 3,
    stockLevel: "critical",
    location: "C1 · Gaveta elétrica",
    unitCost: 540,
    supplierId: "sup-iame",
    supplierName: "IAME Distrib.",
  },
];

export type MovementType =
  | "entrada"
  | "saida"
  | "ajuste"
  | "perda"
  | "devolucao";

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  entrada: "Entrada",
  saida: "Saída",
  ajuste: "Ajuste",
  perda: "Perda",
  devolucao: "Devolução",
};

export type InventoryMovement = {
  id: string;
  partId: string;
  partName: string;
  partCode: string;
  type: MovementType;
  quantity: number;
  kartNumber?: number;
  osNumber?: string;
  responsible: string;
  datetime: string;
};

export const INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: "mv-1",
    partId: "p-corrente",
    partName: "Corrente 219H O-Ring",
    partCode: "TR-219H",
    type: "saida",
    quantity: 1,
    kartNumber: 7,
    osNumber: "OS-1842",
    responsible: "Rafael Costa",
    datetime: "Hoje, 14:32",
  },
  {
    id: "mv-2",
    partId: "p-pastilha",
    partName: "Pastilha dianteira",
    partCode: "FR-PAD-01",
    type: "saida",
    quantity: 2,
    kartNumber: 12,
    osNumber: "OS-1839",
    responsible: "Carlos Silva",
    datetime: "Hoje, 11:15",
  },
  {
    id: "mv-3",
    partId: "p-pneu-mg",
    partName: "Pneu MG Vermelho",
    partCode: "PN-MG-RED",
    type: "entrada",
    quantity: 4,
    responsible: "Marina Souza",
    datetime: "Ontem, 16:40",
  },
  {
    id: "mv-4",
    partId: "p-oleo",
    partName: "Óleo 2T competição",
    partCode: "LU-2T-1L",
    type: "saida",
    quantity: 3,
    kartNumber: 5,
    osNumber: "OS-1835",
    responsible: "Felipe Alves",
    datetime: "Ontem, 09:20",
  },
  {
    id: "mv-5",
    partId: "p-coroa",
    partName: "Coroa 11×74",
    partCode: "TR-C74",
    type: "ajuste",
    quantity: -1,
    responsible: "Ricardo Gurgel",
    datetime: "18 mai, 17:00",
  },
  {
    id: "mv-6",
    partId: "p-vela",
    partName: "Vela NGK padrão",
    partCode: "IG-VELA-NGK",
    type: "devolucao",
    quantity: 2,
    kartNumber: 18,
    osNumber: "OS-1830",
    responsible: "Rafael Costa",
    datetime: "17 mai, 14:10",
  },
  {
    id: "mv-7",
    partId: "p-corburador",
    partName: "Carburador X30",
    partCode: "MO-CARB-X30",
    type: "perda",
    quantity: 1,
    responsible: "Carlos Silva",
    datetime: "16 mai, 10:05",
  },
];

export type PurchaseStatus =
  | "solicitado"
  | "aprovado"
  | "comprado"
  | "entregue";

export const PURCHASE_STATUS_LABELS: Record<PurchaseStatus, string> = {
  solicitado: "Solicitado",
  aprovado: "Aprovado",
  comprado: "Comprado",
  entregue: "Entregue",
};

export type PurchaseOrder = {
  id: string;
  partName: string;
  partCode: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  value: number;
  forecast: string;
  status: PurchaseStatus;
  requestedBy: string;
};

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po-1",
    partName: "Corrente 219H O-Ring",
    partCode: "TR-219H",
    supplierId: "sup-rpb",
    supplierName: "Racing Parts BR",
    quantity: 10,
    value: 4200,
    forecast: "24 mai",
    status: "aprovado",
    requestedBy: "Ricardo Gurgel",
  },
  {
    id: "po-2",
    partName: "Pastilha dianteira",
    partCode: "FR-PAD-01",
    supplierId: "sup-kartpro",
    supplierName: "Kart Pro",
    quantity: 8,
    value: 1440,
    forecast: "22 mai",
    status: "solicitado",
    requestedBy: "Carlos Silva",
  },
  {
    id: "po-3",
    partName: "Carburador X30",
    partCode: "MO-CARB-X30",
    supplierId: "sup-iame",
    supplierName: "IAME Distrib.",
    quantity: 2,
    value: 3700,
    forecast: "28 mai",
    status: "comprado",
    requestedBy: "Rafael Costa",
  },
  {
    id: "po-4",
    partName: "Bobina de ignição X30",
    partCode: "EL-BOB-X30",
    supplierId: "sup-iame",
    supplierName: "IAME Distrib.",
    quantity: 3,
    value: 1620,
    forecast: "26 mai",
    status: "solicitado",
    requestedBy: "Felipe Alves",
  },
  {
    id: "po-5",
    partName: "Pneu MG Vermelho",
    partCode: "PN-MG-RED",
    supplierId: "sup-mg",
    supplierName: "MG Tires",
    quantity: 6,
    value: 3720,
    forecast: "20 mai",
    status: "entregue",
    requestedBy: "Marina Souza",
  },
];

export type CriticalStockItem = {
  partId: string;
  partName: string;
  partCode: string;
  stock: number;
  minStock: number;
  sessionsLeft: number;
  avgConsumption: string;
  lastPurchase: string;
  ruptureForecast: string;
  message: string;
};

export const CRITICAL_STOCK: CriticalStockItem[] = [
  {
    partId: "p-pastilha",
    partName: "Pastilha dianteira",
    partCode: "FR-PAD-01",
    stock: 3,
    minStock: 6,
    sessionsLeft: 2,
    avgConsumption: "1,5 par/sessão",
    lastPurchase: "28 abr",
    ruptureForecast: "2 sessões",
    message: "Pastilha dianteira possui estoque para apenas 2 sessões.",
  },
  {
    partId: "p-coroa",
    partName: "Coroa 11×74",
    partCode: "TR-C74",
    stock: 2,
    minStock: 4,
    sessionsLeft: 3,
    avgConsumption: "0,7 un/sessão",
    lastPurchase: "10 abr",
    ruptureForecast: "3 sessões",
    message: "Coroa 11×74 abaixo do mínimo operacional.",
  },
  {
    partId: "p-corrente",
    partName: "Corrente 219H O-Ring",
    partCode: "TR-219H",
    stock: 5,
    minStock: 8,
    sessionsLeft: 4,
    avgConsumption: "1,2 un/sessão",
    lastPurchase: "05 mai",
    ruptureForecast: "4 sessões",
    message: "Corrente 219H abaixo do estoque mínimo.",
  },
  {
    partId: "p-corburador",
    partName: "Carburador X30",
    partCode: "MO-CARB-X30",
    stock: 2,
    minStock: 3,
    sessionsLeft: 2,
    avgConsumption: "0,3 un/sessão",
    lastPurchase: "15 mar",
    ruptureForecast: "2 semanas",
    message: "Carburador X30 com estoque crítico — peça de alto valor.",
  },
  {
    partId: "p-bobina",
    partName: "Bobina de ignição X30",
    partCode: "EL-BOB-X30",
    stock: 1,
    minStock: 3,
    sessionsLeft: 1,
    avgConsumption: "0,5 un/sessão",
    lastPurchase: "22 abr",
    ruptureForecast: "1 sessão",
    message: "Bobina X30 — apenas 1 unidade disponível.",
  },
];

export type SupplierStatus = "ativo" | "atrasado" | "inativo";

export type InventorySupplier = {
  id: string;
  code: string;
  name: string;
  cnpj: string;
  city: string;
  phone: string;
  whatsapp: string;
  partsSupplied: string[];
  avgLeadDays: number;
  /** ISO date YYYY-MM-DD */
  lastPurchase: string;
  status: SupplierStatus;
  email?: string;
};

export const INVENTORY_NF_REFERENCES: { value: string; label: string }[] = [
  { value: "NF-4582", label: "NF 4582 · Racing Parts BR" },
  { value: "NF-4571", label: "NF 4571 · Kart Pro" },
  { value: "NF-4560", label: "NF 4560 · MG Tires" },
  { value: "NF-4555", label: "NF 4555 · IAME Distrib." },
  { value: "NF-4540", label: "NF 4540 · Motul BR" },
  { value: "NF-4532", label: "NF 4532 · NGK" },
  { value: "REF-AVULSA", label: "Referência avulsa / sem NF" },
];

/** Formata data ISO (YYYY-MM-DD) para dd/mm/aaaa */
export function formatInventoryDate(isoDate: string): string {
  if (!isoDate.trim()) return "—";
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export const SUPPLIER_STATUS_LABELS: Record<SupplierStatus, string> = {
  ativo: "Ativo",
  atrasado: "Atrasado",
  inativo: "Inativo",
};

export const INVENTORY_SUPPLIERS: InventorySupplier[] = [
  {
    id: "sup-rpb",
    code: "FOR-RPB",
    name: "Racing Parts BR",
    cnpj: "12.345.678/0001-90",
    city: "Brasília",
    phone: "(61) 3333-1100",
    whatsapp: "(61) 99999-1100",
    partsSupplied: ["Corrente", "Coroa", "Pinhão", "Relação"],
    avgLeadDays: 3,
    lastPurchase: "2026-05-05",
    status: "ativo",
    email: "vendas@racingparts.com.br",
  },
  {
    id: "sup-kartpro",
    code: "FOR-KPR",
    name: "Kart Pro",
    cnpj: "98.765.432/0001-10",
    city: "Brasília",
    phone: "(61) 3333-2200",
    whatsapp: "(61) 99999-2200",
    partsSupplied: ["Freios", "Ferramentas", "Capacetes"],
    avgLeadDays: 2,
    lastPurchase: "2026-05-18",
    status: "ativo",
  },
  {
    id: "sup-mg",
    code: "FOR-MGT",
    name: "MG Tires",
    cnpj: "11.222.333/0001-44",
    city: "São Paulo",
    phone: "(11) 4444-3300",
    whatsapp: "(11) 98888-3300",
    partsSupplied: ["Pneus MG", "Pneus Vega"],
    avgLeadDays: 5,
    lastPurchase: "2026-05-19",
    status: "atrasado",
  },
  {
    id: "sup-iame",
    code: "FOR-IAM",
    name: "IAME Distrib.",
    cnpj: "55.666.777/0001-88",
    city: "São Paulo",
    phone: "(11) 5555-4400",
    whatsapp: "(11) 97777-4400",
    partsSupplied: ["Motor", "Carburador", "Bobina"],
    avgLeadDays: 7,
    lastPurchase: "2026-04-10",
    status: "ativo",
  },
  {
    id: "sup-motul",
    code: "FOR-MOT",
    name: "Motul BR",
    cnpj: "33.444.555/0001-66",
    city: "Rio de Janeiro",
    phone: "(11) 6666-5500",
    whatsapp: "(11) 96666-5500",
    partsSupplied: ["Óleos", "Fluidos"],
    avgLeadDays: 4,
    lastPurchase: "2026-05-12",
    status: "ativo",
  },
  {
    id: "sup-ngk",
    code: "FOR-NGK",
    name: "NGK",
    cnpj: "77.888.999/0001-22",
    city: "Campinas",
    phone: "(11) 7777-6600",
    whatsapp: "(11) 95555-6600",
    partsSupplied: ["Velas", "Ignição"],
    avgLeadDays: 3,
    lastPurchase: "2026-05-08",
    status: "ativo",
  },
];

export type InventoryAlert = {
  id: string;
  message: string;
  severity: "info" | "warn" | "urgent";
};

export const INVENTORY_ALERTS: InventoryAlert[] = [
  {
    id: "a1",
    message: "Corrente 219H abaixo do estoque mínimo.",
    severity: "warn",
  },
  {
    id: "a2",
    message: "Pneu MG teve aumento de consumo.",
    severity: "info",
  },
  {
    id: "a3",
    message: "Pastilhas apresentam troca acima da média.",
    severity: "warn",
  },
  {
    id: "a4",
    message: "Fornecedor MG Tires atrasou últimas entregas.",
    severity: "urgent",
  },
];

export type HistoryEventType =
  | "movimentacao"
  | "entrada"
  | "saida"
  | "troca"
  | "compra"
  | "alerta";

export type InventoryHistoryEvent = {
  id: string;
  type: HistoryEventType;
  title: string;
  description: string;
  datetime: string;
  responsible?: string;
};

export const INVENTORY_HISTORY: InventoryHistoryEvent[] = [
  {
    id: "h1",
    type: "saida",
    title: "Saída — Corrente 219H",
    description: "1 unidade · Kart 07 · OS-1842",
    datetime: "Hoje, 14:32",
    responsible: "Rafael Costa",
  },
  {
    id: "h2",
    type: "entrada",
    title: "Entrada — Pneu MG Vermelho",
    description: "4 jogos recebidos · NF 4582",
    datetime: "Ontem, 16:40",
    responsible: "Marina Souza",
  },
  {
    id: "h3",
    type: "compra",
    title: "Compra aprovada — Corrente 219H",
    description: "10 unidades · Racing Parts BR · R$ 4.200",
    datetime: "Ontem, 10:00",
    responsible: "Ricardo Gurgel",
  },
  {
    id: "h4",
    type: "troca",
    title: "Troca crítica — Pastilha dianteira",
    description: "Kart 12 · desgaste acelerado detectado",
    datetime: "18 mai, 11:30",
    responsible: "Carlos Silva",
  },
  {
    id: "h5",
    type: "alerta",
    title: "Alerta de estoque crítico",
    description: "Bobina X30 — apenas 1 unidade restante",
    datetime: "17 mai, 08:15",
  },
  {
    id: "h6",
    type: "movimentacao",
    title: "Ajuste de inventário",
    description: "Coroa 11×74 — contagem física",
    datetime: "16 mai, 17:00",
    responsible: "Ricardo Gurgel",
  },
];

export type PartDetail = {
  part: InventoryPart;
  usageHistory: {
    id: string;
    date: string;
    kartNumber: number;
    osNumber: string;
    quantity: number;
    mechanic: string;
  }[];
  linkedKarts: { number: number; category: string; lastUse: string }[];
  linkedOs: { osNumber: string; status: string; date: string }[];
  replaceFrequency: string;
  costHistory: { month: string; value: number }[];
  avgWear: string;
  avgConsumption: string;
  lastUsed: string;
};

export function getPartDetail(
  partId: string,
  partOverride?: InventoryPart | null,
): PartDetail | null {
  const part =
    partOverride ?? INVENTORY_PARTS.find((p) => p.id === partId) ?? null;
  if (!part) return null;

  return {
    part,
    usageHistory: [
      {
        id: "uh1",
        date: "Hoje, 14:32",
        kartNumber: 7,
        osNumber: "OS-1842",
        quantity: 1,
        mechanic: "Rafael Costa",
      },
      {
        id: "uh2",
        date: "15 mai",
        kartNumber: 12,
        osNumber: "OS-1830",
        quantity: 1,
        mechanic: "Carlos Silva",
      },
      {
        id: "uh3",
        date: "10 mai",
        kartNumber: 5,
        osNumber: "OS-1820",
        quantity: 1,
        mechanic: "Felipe Alves",
      },
    ],
    linkedKarts: [
      { number: 7, category: "125cc", lastUse: "Hoje" },
      { number: 12, category: "Competição", lastUse: "Ontem" },
      { number: 5, category: "F400", lastUse: "18 mai" },
    ],
    linkedOs: [
      { osNumber: "OS-1842", status: "Em andamento", date: "Hoje" },
      { osNumber: "OS-1830", status: "Concluída", date: "15 mai" },
      { osNumber: "OS-1820", status: "Concluída", date: "10 mai" },
    ],
    replaceFrequency: "A cada 18–22 sessões",
    costHistory: [
      { month: "Jan", value: 840 },
      { month: "Fev", value: 1260 },
      { month: "Mar", value: 420 },
      { month: "Abr", value: 1680 },
      { month: "Mai", value: 2100 },
    ],
    avgWear: part.category === "Pneus" ? "12 ciclos" : "18 sessões",
    avgConsumption:
      part.stockLevel === "critical" ? "1,5 un/sessão" : "0,8 un/sessão",
    lastUsed: "Hoje, 14:32",
  };
}

export const WEEKLY_CONSUMPTION = [
  { day: "Seg", value: 14 },
  { day: "Ter", value: 18 },
  { day: "Qua", value: 12 },
  { day: "Qui", value: 22 },
  { day: "Sex", value: 16 },
  { day: "Sáb", value: 28 },
  { day: "Dom", value: 8 },
];

export const CONSUMPTION_BY_CATEGORY = [
  { category: "Transmissão", value: 32 },
  { category: "Pneus", value: 28 },
  { category: "Freio", value: 18 },
  { category: "Motor", value: 14 },
  { category: "Elétrica", value: 8 },
];

export const TOP_USED_PARTS = [
  { name: "Corrente 219H", count: 32 },
  { name: "Pneu MG", count: 24 },
  { name: "Pastilha dianteira", count: 18 },
  { name: "Óleo 2T", count: 15 },
  { name: "Vela NGK", count: 12 },
];

export const MONTHLY_MOVEMENTS = [
  { month: "Jan", entrada: 42, saida: 38 },
  { month: "Fev", entrada: 38, saida: 45 },
  { month: "Mar", entrada: 55, saida: 48 },
  { month: "Abr", entrada: 48, saida: 52 },
  { month: "Mai", entrada: 62, saida: 58 },
];

export const COST_BY_CATEGORY = [
  { category: "Motor", value: 12400 },
  { category: "Pneus", value: 9800 },
  { category: "Transmissão", value: 8200 },
  { category: "Freio", value: 4100 },
  { category: "Elétrica", value: 2800 },
];

export const FINANCIAL_INTEGRATION = {
  totalStockValue: 48200,
  monthlyPartsCost: 12840,
  costByKart: [
    { kart: "07", value: 2180 },
    { kart: "12", value: 3420 },
    { kart: "05", value: 1890 },
    { kart: "18", value: 980 },
  ],
};

export const SUPPLIER_NAMES = [
  ...new Set(INVENTORY_PARTS.map((p) => p.supplierName)),
].sort();

export const LOCATIONS = [
  ...new Set(INVENTORY_PARTS.map((p) => p.location.split(" · ")[0])),
].sort();

export function filterPartsList(
  source: InventoryPart[],
  filters: {
    query?: string;
    category?: string;
    supplier?: string;
    health?: StockLevel | "" | "all";
    criticalOnly?: boolean;
    compatibility?: string;
    location?: string;
  },
): InventoryPart[] {
  let list = [...source];
  const q = filters.query?.trim().toLowerCase();

  if (q) {
    list = list.filter((p) => {
      const hay = [
        p.name,
        p.code,
        p.category,
        p.supplierName,
        p.compatibility,
        p.location,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (filters.category && filters.category !== "all") {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters.supplier && filters.supplier !== "all") {
    list = list.filter((p) => p.supplierName === filters.supplier);
  }
  if (filters.health && filters.health !== "all") {
    list = list.filter((p) => p.stockLevel === filters.health);
  } else if (filters.criticalOnly) {
    list = list.filter(
      (p) => p.stockLevel === "critical" || p.stockLevel === "low",
    );
  }
  if (filters.compatibility?.trim()) {
    const c = filters.compatibility.trim().toLowerCase();
    list = list.filter((p) => p.compatibility.toLowerCase().includes(c));
  }
  if (filters.location && filters.location !== "all") {
    list = list.filter((p) => p.location.startsWith(filters.location!));
  }
  return list;
}

export function filterParts(filters: {
  query?: string;
  category?: string;
  supplier?: string;
  health?: StockLevel | "" | "all";
  criticalOnly?: boolean;
  compatibility?: string;
  location?: string;
}): InventoryPart[] {
  return filterPartsList(INVENTORY_PARTS, filters);
}

export function filterSuppliersList(
  source: InventorySupplier[],
  filters: {
    query?: string;
    status?: SupplierStatus | "" | "all";
  },
): InventorySupplier[] {
  let list = [...source];
  const q = filters.query?.trim().toLowerCase();

  if (q) {
    list = list.filter((s) => {
      const hay = [
        s.name,
        s.code,
        s.cnpj,
        s.city,
        s.phone,
        s.whatsapp,
        ...s.partsSupplied,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (filters.status && filters.status !== "all") {
    list = list.filter((s) => s.status === filters.status);
  }
  return list;
}

export function filterSuppliers(filters: {
  query?: string;
  status?: SupplierStatus | "" | "all";
}): InventorySupplier[] {
  return filterSuppliersList(INVENTORY_SUPPLIERS, filters);
}

export { formatCurrency };
