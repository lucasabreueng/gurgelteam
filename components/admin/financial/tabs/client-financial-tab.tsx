import { FinancialServiceMock } from "@/services/finance/financialServiceMock";


type Props = {
  onAction: (msg: string) => void;
};

export function ClientFinancialTab({ onAction }: Props) {
  return (
    <div className="admin-page-stack">
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {FinancialServiceMock.getClientFinancials().map((c) => (
          <li
            key={c.id}
            className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm"
          >
            <div>
              <p className="font-bold text-[#0d1f3c]">{c.name}</p>
              <p className="text-xs text-neutral-500">{c.currentPlan}</p>
            </div>

            <dl className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Total gasto</dt>
                <dd className="font-bold text-[#0d1f3c]">{c.totalSpent}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Pagamentos</dt>
                <dd className="font-semibold">{c.paymentsCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Pendências</dt>
                <dd className="font-bold text-amber-700">{c.pending}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Aulas restantes</dt>
                <dd className="font-semibold">{c.lessonsLeft}</dd>
              </div>
              <div className="flex justify-between border-t border-[rgba(17,17,17,0.06)] pt-2">
                <dt className="text-neutral-500">Ticket médio</dt>
                <dd className="font-bold tabular-nums">{c.ticketAvg}</dd>
              </div>
            </dl>

            {c.paymentHistory.length > 0 ? (
              <div className="mt-4 rounded-xl bg-[#fafbfc] p-3 ring-1 ring-[rgba(17,17,17,0.06)]">
                <p className="text-[10px] font-bold uppercase text-neutral-500">
                  Histórico recente
                </p>
                <ul className="mt-2 space-y-1 text-[11px] text-neutral-600">
                  {c.paymentHistory.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAction(`Cliente ${c.name} (mock).`)}
                className="rounded-lg bg-[#0d1f3c] px-3 py-2 text-[10px] font-bold uppercase text-white"
              >
                Abrir cliente
              </button>
              <button
                type="button"
                onClick={() => onAction(`Cobrança — ${c.name} (mock).`)}
                className="rounded-lg border border-[rgba(13,31,60,0.15)] px-3 py-2 text-[10px] font-bold uppercase text-[#0d1f3c]"
              >
                Cobrar
              </button>
              <button
                type="button"
                onClick={() => onAction(`Recibo — ${c.name} (mock).`)}
                className="rounded-lg px-3 py-2 text-[10px] font-bold uppercase text-neutral-600 hover:bg-neutral-100"
              >
                Recibo
              </button>
              <button
                type="button"
                onClick={() => onAction(`Pagamentos — ${c.name} (mock).`)}
                className="rounded-lg px-3 py-2 text-[10px] font-bold uppercase text-neutral-600 hover:bg-neutral-100"
              >
                Ver pagamentos
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

