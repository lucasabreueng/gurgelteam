/** Mocks e lookups — Nova Receita / Nova Despesa */

import { SCHEDULE_EVENTS, type ScheduleEvent } from "./admin-schedule-mocks";
import { PACKAGE_CREDITS } from "./admin-financial-mocks";
import { INVENTORY_PARTS, INVENTORY_SUPPLIERS } from "./admin-inventory-mocks";
import { FLEET_KARTS } from "./admin-karts-mocks";
import { PAYMENT_CLIENT_OPTIONS } from "./admin-financial-mocks";

export type RevenueOriginKey =
  | "agendamento"
  | "pacote"
  | "produto"
  | "evento"
  | "manual";

export type RevenueCategoryKey =
  | "aula_avulsa"
  | "pacote_treino"
  | "aluguel_kart"
  | "produto"
  | "evento"
  | "outros";

export type RevenueSituationKey = "recebido_agora" | "receber_depois";

export type ExpenseOriginKey =
  | "manutencao_kart"
  | "combustivel"
  | "estoque"
  | "fornecedor"
  | "administrativo"
  | "manual";

export type ExpenseCategoryKey =
  | "combustivel"
  | "pneus"
  | "pecas"
  | "manutencao"
  | "equipamentos"
  | "marketing"
  | "internet"
  | "sistema"
  | "contabilidade"
  | "taxas"
  | "outros_admin";

export type ExpenseSituationKey = "pago" | "pagar_depois";

export type CostCenterKey =
  | "operacao_pista"
  | "karts"
  | "oficina"
  | "marketing"
  | "administrativo"
  | "estoque";

export type MaintenanceCategoryKey =
  | "pneus"
  | "motor"
  | "corrente"
  | "chassi"
  | "freios"
  | "outros";

export type FuelTargetKey = "kart" | "equipamento" | "geral";

export const REVENUE_ORIGIN_OPTIONS: { value: RevenueOriginKey; label: string }[] = [
  { value: "agendamento", label: "Agendamento" },
  { value: "produto", label: "Produto" },
  { value: "evento", label: "Evento" },
  { value: "manual", label: "Manual" },
];

export const REVENUE_CATEGORY_OPTIONS: { value: RevenueCategoryKey; label: string }[] = [
  { value: "aula_avulsa", label: "Aula Avulsa" },
  { value: "pacote_treino", label: "Pacote de Treino" },
  { value: "aluguel_kart", label: "Aluguel de Kart" },
  { value: "produto", label: "Produto" },
  { value: "evento", label: "Evento" },
  { value: "outros", label: "Outros" },
];

export const EXPENSE_ORIGIN_OPTIONS: { value: ExpenseOriginKey; label: string }[] = [
  { value: "manutencao_kart", label: "Manutenção de Kart" },
  { value: "combustivel", label: "Combustível" },
  { value: "estoque", label: "Estoque" },
  { value: "fornecedor", label: "Fornecedor" },
  { value: "administrativo", label: "Administrativo" },
  { value: "manual", label: "Manual" },
];

export const EXPENSE_CATEGORY_OPTIONS: { value: ExpenseCategoryKey; label: string; group: string }[] = [
  { value: "combustivel", label: "Combustível", group: "Operacionais" },
  { value: "pneus", label: "Pneus", group: "Operacionais" },
  { value: "pecas", label: "Peças", group: "Operacionais" },
  { value: "manutencao", label: "Manutenção", group: "Operacionais" },
  { value: "equipamentos", label: "Equipamentos", group: "Operacionais" },
  { value: "marketing", label: "Marketing", group: "Administrativas" },
  { value: "internet", label: "Internet", group: "Administrativas" },
  { value: "sistema", label: "Sistema", group: "Administrativas" },
  { value: "contabilidade", label: "Contabilidade", group: "Administrativas" },
  { value: "taxas", label: "Taxas", group: "Administrativas" },
  { value: "outros_admin", label: "Outros", group: "Administrativas" },
];

export const COST_CENTER_OPTIONS: { value: CostCenterKey; label: string }[] = [
  { value: "operacao_pista", label: "Operação de Pista" },
  { value: "karts", label: "Karts" },
  { value: "oficina", label: "Oficina" },
  { value: "marketing", label: "Marketing" },
  { value: "administrativo", label: "Administrativo" },
  { value: "estoque", label: "Estoque" },
];

export const MAINTENANCE_CATEGORY_OPTIONS: { value: MaintenanceCategoryKey; label: string }[] = [
  { value: "pneus", label: "Pneus" },
  { value: "motor", label: "Motor" },
  { value: "corrente", label: "Corrente" },
  { value: "chassi", label: "Chassi" },
  { value: "freios", label: "Freios" },
  { value: "outros", label: "Outros" },
];

export const FUEL_TARGET_OPTIONS: { value: FuelTargetKey; label: string }[] = [
  { value: "kart", label: "Kart" },
  { value: "equipamento", label: "Equipamento" },
  { value: "geral", label: "Geral" },
];

export const PAYMENT_METHOD_BILLING_OPTIONS = [
  { value: "pix", label: "PIX" },
  { value: "cartao", label: "Cartão" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "transferencia", label: "Transferência" },
];

export const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n}x`,
}));

const CATEGORY_PRICES: Record<string, number> = {
  mirim: 280,
  cadete: 280,
  f400: 350,
  "125cc": 420,
  competicao: 420,
  rental: 350,
};

function categoryToRevenueCategory(category?: string): RevenueCategoryKey {
  if (!category) return "aula_avulsa";
  const c = category.toLowerCase();
  if (c.includes("rental") || c.includes("aluguel")) return "aluguel_kart";
  return "aula_avulsa";
}

function priceForCategory(category?: string): number {
  if (!category) return 350;
  const key = category.toLowerCase();
  return CATEGORY_PRICES[key] ?? 350;
}

function parseAmountPaid(paid: string): number {
  const digits = paid.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

export type BillingScheduleOption = {
  id: string;
  label: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  category: RevenueCategoryKey;
  categoryLabel: string;
  amount: number;
  amountDisplay: string;
  description: string;
};

export function getBillingScheduleOptions(): BillingScheduleOption[] {
  return SCHEDULE_EVENTS.filter(
    (e) =>
      e.student &&
      e.student !== "—" &&
      e.type !== "manutencao" &&
      e.type !== "bloqueio_pista",
  ).map((e) => mapScheduleToBilling(e));
}

function mapScheduleToBilling(e: ScheduleEvent): BillingScheduleOption {
  const amount = priceForCategory(e.category);
  const cat = categoryToRevenueCategory(e.category);
  const client = PAYMENT_CLIENT_OPTIONS.find(
    (c) => c.label.toLowerCase() === e.student.toLowerCase(),
  );
  return {
    id: e.id,
    label: `${e.date} ${e.start} — ${e.student} · ${e.typeLabel}`,
    clientId: client?.value ?? "",
    clientName: e.student,
    serviceType: e.typeLabel,
    category: cat,
    categoryLabel: REVENUE_CATEGORY_OPTIONS.find((o) => o.value === cat)?.label ?? "Aula Avulsa",
    amount,
    amountDisplay: amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    description: `${e.typeLabel} — ${e.category ?? "Geral"} (${e.date})`,
  };
}

export type BillingPackageOption = {
  id: string;
  label: string;
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
  amountDisplay: string;
};

export function getBillingPackageOptions(): BillingPackageOption[] {
  return PACKAGE_CREDITS.filter((p) => p.status !== "esgotado").map((p) => ({
    id: p.id,
    label: `${p.packageName} — ${p.clientName}`,
    clientId: p.clientId,
    clientName: p.clientName,
    description: `${p.packageName} (${p.lessonsUsed}/${p.lessonsTotal} aulas)`,
    amount: parseAmountPaid(p.amountPaid),
    amountDisplay: p.amountPaid,
  }));
}

export type BillingProductOption = {
  id: string;
  label: string;
  productName: string;
  amount: number;
  amountDisplay: string;
};

export function getBillingProductOptions(): BillingProductOption[] {
  return INVENTORY_PARTS.slice(0, 12).map((p) => ({
    id: p.id,
    label: `${p.code} — ${p.name}`,
    productName: p.name,
    amount: p.unitCost,
    amountDisplay: p.unitCost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  }));
}

export type BillingEventOption = {
  id: string;
  label: string;
  description: string;
  amount: number;
  amountDisplay: string;
};

export function getBillingEventOptions(): BillingEventOption[] {
  return SCHEDULE_EVENTS.filter(
    (e) => e.type === "campeonato" || e.type === "telemetria" || e.type === "treino_avancado",
  )
    .slice(0, 8)
    .map((e) => {
      const amount = e.type === "campeonato" ? 1200 : 650;
      return {
        id: e.id,
        label: `${e.date} — ${e.typeLabel}${e.student !== "—" ? ` · ${e.student}` : ""}`,
        description: e.typeLabel,
        amount,
        amountDisplay: amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      };
    });
}

export function getBillingClientOptions() {
  return PAYMENT_CLIENT_OPTIONS;
}

export function getBillingSupplierOptions() {
  return INVENTORY_SUPPLIERS.map((s) => ({ value: s.id, label: s.name }));
}

export function getBillingKartOptions() {
  return FLEET_KARTS.map((k) => ({
    value: k.id,
    label: `Kart ${String(k.number).padStart(2, "0")} — ${k.categoryName}`,
  }));
}

export function getBillingStockOptions() {
  return INVENTORY_PARTS.slice(0, 15).map((p) => ({
    value: p.id,
    label: `${p.code} — ${p.name}`,
    amount: p.unitCost,
  }));
}

export type BillingSaveResult = {
  message: string;
  cashImpact: number;
  automation: string[];
};

export function mockSaveRevenue(input: {
  situation: RevenueSituationKey;
  amount: number;
  receivedAmount?: number;
}): BillingSaveResult {
  const received = input.receivedAmount ?? input.amount;
  if (input.situation === "recebido_agora") {
    return {
      message: "Receita registrada com sucesso.",
      cashImpact: received,
      automation: [
        "Receita criada",
        "Movimento de caixa (entrada)",
        "Fluxo de caixa atualizado",
        "DRE atualizado",
      ],
    };
  }
  return {
    message: "Conta a receber criada (pendente).",
    cashImpact: 0,
    automation: ["Conta a receber criada · status Pendente"],
  };
}

export function mockSaveExpense(input: {
  situation: ExpenseSituationKey;
  amount: number;
  paidAmount?: number;
}): BillingSaveResult {
  const paid = input.paidAmount ?? input.amount;
  if (input.situation === "pago") {
    return {
      message: "Despesa registrada com sucesso.",
      cashImpact: -paid,
      automation: [
        "Despesa criada",
        "Movimento de caixa (saída)",
        "Fluxo de caixa atualizado",
        "DRE atualizado",
      ],
    };
  }
  return {
    message: "Conta a pagar criada (pendente).",
    cashImpact: 0,
    automation: ["Conta a pagar criada · status Pendente"],
  };
}

export function todayIsoDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
