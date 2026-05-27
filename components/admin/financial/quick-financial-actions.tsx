import type { IconType } from "react-icons/lib";
import {
  HiArrowDownTray,
  HiBanknotes,
  HiDocumentText,
  HiPlus,
  HiShoppingBag,
  HiUser,
} from "react-icons/hi2";

type Action = {
  id: string;
  label: string;
  Icon: IconType;
};

const ACTIONS: Action[] = [
  { id: "charge", label: "Nova cobrança", Icon: HiPlus },
  { id: "payment", label: "Registrar pagamento", Icon: HiBanknotes },
  { id: "receipt", label: "Gerar recibo", Icon: HiDocumentText },
  { id: "client", label: "Abrir cliente", Icon: HiUser },
  { id: "expense", label: "Nova despesa", Icon: HiShoppingBag },
  { id: "export", label: "Exportar relatório", Icon: HiArrowDownTray },
];

type Props = {
  onAction: (id: string, label: string) => void;
};

export function QuickFinancialActions({ onAction }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Ações rápidas</h3>
      <div className="admin-page-grid mt-4 grid grid-cols-2 sm:grid-cols-3">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onAction(a.id, a.label)}
            className="flex flex-col items-center gap-2 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-3 py-4 text-center transition hover:border-accent/30 hover:bg-white hover:shadow-md"
          >
            <a.Icon className="h-6 w-6 text-accent" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c]">
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
