import { PartsServiceMock } from "@/services/parts/partsServiceMock";
import { ClientBillingOptions } from "./client-billing-options";
import type { ClientBillingMode } from "@/lib/contracts/parts";

type Props = {
  unitCost: number;
  quantity: number;
  supplier: string;
  isClientKart: boolean;
  billingMode: ClientBillingMode;
  onBillingChange: (mode: ClientBillingMode) => void;
};

export function PartCostSummary({
  unitCost,
  quantity,
  supplier,
  isClientKart,
  billingMode,
  onBillingChange,
}: Props) {
  const total = unitCost * quantity;

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Custos</h3>
      <dl className="mt-3 grid gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-500">Custo unitário</dt>
          <dd className="font-bold">{PartsServiceMock.formatCurrency(unitCost)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500">Quantidade</dt>
          <dd className="font-bold tabular-nums">{quantity}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500">Fornecedor</dt>
          <dd className="font-medium">{supplier}</dd>
        </div>
      </dl>
      <p className="mt-4 rounded-xl bg-[#0d1f3c] px-4 py-3 text-center text-lg font-bold text-white">
        {PartsServiceMock.formatCurrency(unitCost)} × {quantity} = {PartsServiceMock.formatCurrency(total)}
      </p>
      {isClientKart ? (
        <ClientBillingOptions value={billingMode} onChange={onBillingChange} />
      ) : null}
    </section>
  );
}
