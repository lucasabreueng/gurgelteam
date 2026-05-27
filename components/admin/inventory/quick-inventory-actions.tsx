import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiBuildingStorefront,
  HiCube,
  HiShoppingCart,
} from "react-icons/hi2";

const ACTIONS = [
  { id: "entry", label: "Registrar entrada", Icon: HiArrowDownTray },
  { id: "exit", label: "Registrar saída", Icon: HiArrowUpTray },
  { id: "purchase", label: "Solicitar compra", Icon: HiShoppingCart },
  { id: "part", label: "Abrir peça", Icon: HiCube },
  { id: "supplier", label: "Abrir fornecedor", Icon: HiBuildingStorefront },
] as const;

type Props = {
  onAction: (id: string, label: string) => void;
};

export function QuickInventoryActions({ onAction }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Ações rápidas</h3>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {ACTIONS.map(({ id, label, Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onAction(id, label)}
              className="flex w-full items-center gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-3 text-left text-sm font-semibold text-[#0d1f3c] transition hover:border-[#0d1f3c]/20 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(13,31,60,0.06)]">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
