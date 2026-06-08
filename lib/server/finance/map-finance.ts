import type { AccountPayable, AccountReceivable, Client } from "@prisma/client";

import type {
  AccountPayableApiDTO,
  AccountReceivableApiDTO,
} from "@/lib/contracts/api/v1/finance.api.schemas";
import type { ReceivableStatus } from "@/lib/contracts/enums";
import { isoDateFromDbDate } from "@/lib/server/format-money";

export function resolveReceivableStatus(
  status: ReceivableStatus,
  dueDate: Date,
): ReceivableStatus {
  if (status === "pago" || status === "parcial") return status;
  const today = isoDateFromDbDate(new Date());
  const due = isoDateFromDbDate(dueDate);
  if (due < today && status === "pendente") return "vencido";
  return status;
}

export function mapReceivableToApi(
  row: AccountReceivable & { client: Pick<Client, "name"> },
): AccountReceivableApiDTO {
  const status = resolveReceivableStatus(row.status, row.dueDate);
  return {
    id: row.id,
    clientId: row.clientId,
    clientName: row.client.name,
    scheduleEventId: row.scheduleEventId,
    amountCents: row.amountCents,
    dueDate: isoDateFromDbDate(row.dueDate),
    status,
    paymentMethod: row.paymentMethod,
    serviceLabel: row.serviceLabel,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapPayableToApi(row: AccountPayable): AccountPayableApiDTO {
  const status = resolveReceivableStatus(row.status, row.dueDate);
  return {
    id: row.id,
    supplierName: row.supplierName,
    category: row.category,
    amountCents: row.amountCents,
    dueDate: isoDateFromDbDate(row.dueDate),
    status,
    paymentMethod: row.paymentMethod,
  };
}
