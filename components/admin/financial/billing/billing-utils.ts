/** Utilitários de formulário — faturamento */

export function formatMoneyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const num = Number(digits) / 100;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseMoneyInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

export function formatBrlDisplay(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const BILLING_STEP_LABELS = ["Informações", "Situação"] as const;

export const BILLING_EXPENSE_STEP_LABELS = ["Informações", "Situação"] as const;

export function todayBrazilDate(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

export function formatInstallmentPreviewMessage(
  installments: string,
  dueDate: string,
  amount: number,
  entity: "receita" | "despesa" = "receita",
): string | null {
  const count = Number(installments);
  if (!dueDate || count <= 1 || amount <= 0) return null;
  const installmentValue = amount / count;
  const label = entity === "receita" ? "receitas" : "despesas";
  return `Serão geradas ${count} ${label} mensais, iniciando em ${dueDate}, no valor de ${installmentValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} cada.`;
}
