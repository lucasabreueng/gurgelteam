import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import { HiArrowDownTray, HiDocument } from "react-icons/hi2";


type Props = {
  onAction?: (msg: string) => void;
};

export function FinancialReportsSection({ onAction }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => onAction?.("Relatório PDF exportado (mock).")}
            className="inline-flex items-center gap-2 rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[10px] font-bold uppercase text-[#0d1f3c]"
          >
            <HiDocument className="h-4 w-4" aria-hidden />
            PDF
          </button>
          <button
            type="button"
            onClick={() => onAction?.("Relatório Excel exportado (mock).")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[10px] font-bold uppercase text-white"
          >
            <HiArrowDownTray className="h-4 w-4" aria-hidden />
            Excel
          </button>
      </div>
      <ul className="admin-page-grid mt-5 grid sm:grid-cols-2 lg:grid-cols-3">
        {FinancialServiceMock.getFinancialReports().map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onAction?.(`Relatório: ${r.label} (mock).`)}
              className="flex w-full flex-col rounded-xl bg-[#fafbfc] p-4 text-left ring-1 ring-[rgba(17,17,17,0.06)] transition hover:ring-accent/25"
            >
              <span className="font-bold text-[#0d1f3c]">{r.label}</span>
              <span className="mt-1 text-xs text-neutral-500">{r.desc}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
