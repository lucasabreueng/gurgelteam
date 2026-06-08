import type { AccountReceivable, ReceivableStatus } from "./admin-financial-mocks";
import { patchScheduleEvent } from "./schedule-runtime-store";

const addedReceivables: AccountReceivable[] = [];
const receivablePatches = new Map<string, Partial<AccountReceivable>>();
let nextReceivableSeq = 1;

function formatBrl(amount: number): string {
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseBrl(value: string): number {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function getMergedReceivables(
  base: AccountReceivable[],
): AccountReceivable[] {
  return [...base, ...addedReceivables].map((row) => {
    const patch = receivablePatches.get(row.id);
    return patch ? { ...row, ...patch } : row;
  });
}

export type CreateReceivableInput = {
  clientId: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: ReceivableStatus;
  paymentMethod: string;
  service: string;
  scheduleEventId?: string;
};

export function createReceivable(input: CreateReceivableInput): AccountReceivable {
  const row: AccountReceivable = {
    id: `ar-new-${nextReceivableSeq++}`,
    clientId: input.clientId,
    clientName: input.clientName,
    amount: formatBrl(input.amount),
    dueDate: input.dueDate,
    status: input.status,
    paymentMethod: input.paymentMethod,
    service: input.service,
  };

  addedReceivables.push(row);

  if (input.scheduleEventId) {
    patchScheduleEvent(input.scheduleEventId, {
      payment: input.status === "pago" ? "pago" : "pendente",
    });
  }

  return row;
}

export function markReceivablePaid(
  base: AccountReceivable[],
  receivableId: string,
  partialAmount?: number,
): boolean {
  const all = getMergedReceivables(base);
  const row = all.find((r) => r.id === receivableId);
  if (!row || row.status === "pago") return false;

  const total = parseBrl(row.amount);
  const isPartial =
    partialAmount !== undefined &&
    partialAmount > 0 &&
    partialAmount < total;

  receivablePatches.set(receivableId, {
    status: isPartial ? "parcial" : "pago",
    amount: isPartial ? formatBrl(partialAmount) : row.amount,
  });

  return true;
}

export function markPendingReceivablePaidForClient(
  base: AccountReceivable[],
  clientId: string,
  serviceLabel?: string,
  paidAmount?: number,
): AccountReceivable | null {
  const pending = getMergedReceivables(base).find(
    (r) =>
      r.clientId === clientId &&
      (r.status === "pendente" || r.status === "vencido" || r.status === "parcial") &&
      (!serviceLabel ||
        r.service.toLowerCase().includes(serviceLabel.toLowerCase()) ||
        serviceLabel.toLowerCase().includes(r.service.toLowerCase())),
  );

  if (!pending) return null;

  markReceivablePaid(base, pending.id, paidAmount);
  return pending;
}
