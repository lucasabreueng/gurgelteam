/** Termos operacionais cadastráveis em Configurações */

import { EXPENSE_CATEGORY_OPTIONS, REVENUE_CATEGORY_OPTIONS } from "./admin-new-billing-mocks";
import { INVENTORY_CATEGORIES } from "./admin-inventory-mocks";
import { FLEET_KARTS, REGISTERED_MOTORS } from "./admin-karts-mocks";

function newTermId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function slugFromName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type DreAccountKind = "group" | "line" | "subtotal" | "total";

export type DreAccountTerm = {
  id: string;
  label: string;
  kind: DreAccountKind;
  parentId?: string;
  level: number;
  /** Contas estruturais do DRE — não podem ser removidas */
  locked?: boolean;
};

export type FinancialCategoryFlow = "revenue" | "expense";

export type FinancialCategoryTerm = {
  id: string;
  name: string;
  flow: FinancialCategoryFlow;
  group?: string;
};

export type InventoryPartCategoryTerm = {
  id: string;
  name: string;
};

export type RegisteredMotorTerm = {
  id: string;
  name: string;
};

export type RegisteredChassisTerm = {
  id: string;
  name: string;
};

export type SettingsTermsRegistry = {
  dreAccounts: DreAccountTerm[];
  financialCategories: FinancialCategoryTerm[];
  inventoryPartCategories: InventoryPartCategoryTerm[];
  motors: RegisteredMotorTerm[];
  chassis: RegisteredChassisTerm[];
};

const DRE_ACCOUNT_SEED: Omit<DreAccountTerm, "locked">[] = [
  { id: "gross-revenue", label: "Receita Bruta", kind: "group", level: 0 },
  { id: "rev-lessons", label: "Aulas", kind: "line", level: 1, parentId: "gross-revenue" },
  { id: "rev-rental", label: "Aluguel de kart", kind: "line", level: 1, parentId: "gross-revenue" },
  { id: "rev-packages", label: "Pacotes", kind: "line", level: 1, parentId: "gross-revenue" },
  { id: "rev-products", label: "Produtos", kind: "line", level: 1, parentId: "gross-revenue" },
  { id: "rev-other", label: "Outros", kind: "line", level: 1, parentId: "gross-revenue" },
  { id: "taxes", label: "(-) Impostos e taxas", kind: "line", level: 0 },
  { id: "net-revenue", label: "Receita Líquida", kind: "subtotal", level: 0 },
  { id: "op-costs", label: "(-) Custos Operacionais", kind: "group", level: 0 },
  { id: "cost-fuel", label: "Combustível", kind: "line", level: 1, parentId: "op-costs" },
  { id: "cost-tires", label: "Pneus", kind: "line", level: 1, parentId: "op-costs" },
  { id: "cost-maintenance", label: "Manutenção dos karts", kind: "line", level: 1, parentId: "op-costs" },
  { id: "cost-parts", label: "Peças e componentes", kind: "line", level: 1, parentId: "op-costs" },
  { id: "cost-track", label: "Equipamentos de pista", kind: "line", level: 1, parentId: "op-costs" },
  { id: "gross-profit", label: "Lucro Bruto", kind: "subtotal", level: 0 },
  { id: "op-expenses", label: "(-) Despesas Operacionais", kind: "group", level: 0 },
  { id: "exp-admin", label: "Administrativo", kind: "line", level: 1, parentId: "op-expenses" },
  { id: "exp-marketing", label: "Marketing", kind: "line", level: 1, parentId: "op-expenses" },
  { id: "exp-tech", label: "Sistema/tecnologia", kind: "line", level: 1, parentId: "op-expenses" },
  { id: "exp-bank", label: "Taxas bancárias", kind: "line", level: 1, parentId: "op-expenses" },
  { id: "exp-other", label: "Outras despesas", kind: "line", level: 1, parentId: "op-expenses" },
  { id: "operating-profit", label: "Lucro Operacional", kind: "subtotal", level: 0 },
  { id: "financial-result", label: "Resultado Financeiro", kind: "group", level: 0 },
  { id: "fin-interest-in", label: "Juros recebidos", kind: "line", level: 1, parentId: "financial-result" },
  { id: "fin-interest-out", label: "Juros pagos", kind: "line", level: 1, parentId: "financial-result" },
  { id: "fin-fees", label: "Tarifas", kind: "line", level: 1, parentId: "financial-result" },
  { id: "net-profit", label: "Lucro Líquido", kind: "total", level: 0 },
];

function withDreLocks(accounts: Omit<DreAccountTerm, "locked">[]): DreAccountTerm[] {
  return accounts.map((row) => ({
    ...row,
    locked:
      row.kind === "subtotal" ||
      row.kind === "total" ||
      row.kind === "group" ||
      (row.kind === "line" && !row.parentId),
  }));
}

export const DRE_ACCOUNT_TERMS: DreAccountTerm[] = withDreLocks(DRE_ACCOUNT_SEED);

export const FINANCIAL_CATEGORY_TERMS: FinancialCategoryTerm[] = [
  ...REVENUE_CATEGORY_OPTIONS.map((o) => ({
    id: o.value,
    name: o.label,
    flow: "revenue" as const,
  })),
  ...EXPENSE_CATEGORY_OPTIONS.map((o) => ({
    id: o.value,
    name: o.label,
    flow: "expense" as const,
    group: o.group,
  })),
];

export const INVENTORY_PART_CATEGORY_TERMS: InventoryPartCategoryTerm[] =
  INVENTORY_CATEGORIES.map((name) => ({
    id: slugFromName(name),
    name,
  }));

export const REGISTERED_MOTOR_TERMS: RegisteredMotorTerm[] = REGISTERED_MOTORS.map(
  (m) => ({ id: m.id, name: m.name }),
);

const CHASSIS_FROM_FLEET = Array.from(
  new Set(FLEET_KARTS.map((k) => k.chassis).filter(Boolean)),
).sort((a, b) => a.localeCompare(b, "pt-BR"));

export const REGISTERED_CHASSIS_TERMS: RegisteredChassisTerm[] = CHASSIS_FROM_FLEET.map(
  (name) => ({
    id: slugFromName(name),
    name,
  }),
);

export const SETTINGS_TERMS_REGISTRY: SettingsTermsRegistry = {
  dreAccounts: DRE_ACCOUNT_TERMS,
  financialCategories: FINANCIAL_CATEGORY_TERMS,
  inventoryPartCategories: INVENTORY_PART_CATEGORY_TERMS,
  motors: REGISTERED_MOTOR_TERMS,
  chassis: REGISTERED_CHASSIS_TERMS,
};

export function dreAccountKindLabel(kind: DreAccountKind): string {
  switch (kind) {
    case "group":
      return "Grupo";
    case "line":
      return "Conta";
    case "subtotal":
    case "total":
      return "Resultado";
  }
}

export type DreAccountSection =
  | { type: "group"; group: DreAccountTerm; lines: DreAccountTerm[] }
  | { type: "standalone"; line: DreAccountTerm }
  | { type: "result"; row: DreAccountTerm };

/** Ordem de exibição do plano de contas (grupos, contas fixas e resultados). */
export function buildDreSections(accounts: DreAccountTerm[]): DreAccountSection[] {
  const sections: DreAccountSection[] = [];

  for (let i = 0; i < accounts.length; i += 1) {
    const row = accounts[i];
    if (row.kind === "group") {
      const lines: DreAccountTerm[] = [];
      while (i + 1 < accounts.length && accounts[i + 1].parentId === row.id) {
        i += 1;
        lines.push(accounts[i]);
      }
      sections.push({ type: "group", group: row, lines });
    } else if (row.kind === "line") {
      sections.push({ type: "standalone", line: row });
    } else if (row.kind === "subtotal" || row.kind === "total") {
      sections.push({ type: "result", row });
    }
  }

  return sections;
}

export function insertDreLineInGroup(
  accounts: DreAccountTerm[],
  parentId: string,
  line: DreAccountTerm,
): DreAccountTerm[] {
  const parentIndex = accounts.findIndex((a) => a.id === parentId);
  if (parentIndex === -1) return [...accounts, line];

  let insertAt = parentIndex;
  while (insertAt + 1 < accounts.length && accounts[insertAt + 1].parentId === parentId) {
    insertAt += 1;
  }

  return [...accounts.slice(0, insertAt + 1), line, ...accounts.slice(insertAt + 1)];
}

export function createDreAccountLine(
  accounts: DreAccountTerm[],
  parentId: string,
): DreAccountTerm {
  const parent = accounts.find((a) => a.id === parentId);
  if (!parent || parent.kind !== "group") {
    throw new Error("Conta analítica deve pertencer a um grupo fixo do DRE.");
  }
  return {
    id: newTermId("dre-line"),
    label: "Nova conta",
    kind: "line",
    parentId: parent.id,
    level: parent.level + 1,
    locked: false,
  };
}

export function createFinancialCategory(
  flow: FinancialCategoryFlow,
): FinancialCategoryTerm {
  const id = newTermId(flow === "revenue" ? "rev" : "exp");
  return {
    id,
    name: flow === "revenue" ? "Nova receita" : "Nova despesa",
    flow,
    group: flow === "expense" ? "Operacionais" : undefined,
  };
}

export function createInventoryPartCategory(): InventoryPartCategoryTerm {
  const id = newTermId("part-cat");
  return { id, name: "Nova categoria" };
}

export function createRegisteredMotor(): RegisteredMotorTerm {
  return { id: newTermId("motor"), name: "Novo motor" };
}

export function createRegisteredChassis(): RegisteredChassisTerm {
  return { id: newTermId("chassis"), name: "Novo chassi" };
}

export function uniqueTermName(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base} (${i})`)) i += 1;
  return `${base} (${i})`;
}
