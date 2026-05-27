export type ReceivableStatus = "pago" | "pendente" | "vencido" | "parcial";

export type FinancialTabKey =
  | "overview"
  | "receivables"
  | "payables"
  | "cashflow";

export type FinancialTabMetaDTO = {
  title: string;
  subtitle: string;
};

export type FinancialKpiDTO = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline?: number[];
};

export const RECEIVABLE_STATUS_LABELS: Record<ReceivableStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  vencido: "Vencido",
  parcial: "Parcial",
};

export type AccountReceivableDTO = {
  id: string;
  clientId?: string;
  clientName: string;
  amount: string;
  dueDate: string;
  status: ReceivableStatus;
  paymentMethod: string;
  service: string;
};

export type AccountPayableDTO = {
  id: string;
  supplierName: string;
  category: string;
  amount: string;
  dueDate: string;
  status: ReceivableStatus;
  paymentMethod: string;
};

export type ReceivableQueryDTO = {
  query: string;
  status: ReceivableStatus | "";
  method: string;
  service: string;
};

export type PayableQueryDTO = {
  query: string;
  status: ReceivableStatus | "";
  method: string;
  category: string;
};

