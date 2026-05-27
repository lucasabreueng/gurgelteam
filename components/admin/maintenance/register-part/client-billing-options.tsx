import type { ClientBillingMode } from "@/lib/contracts/parts";

const OPTIONS: { value: ClientBillingMode; label: string }[] = [
  { value: "orcamento", label: "Adicionar ao orçamento do cliente" },
  { value: "cobrar", label: "Cobrar peça do cliente" },
  { value: "interno", label: "Somente registro interno" },
];

type Props = {
  value: ClientBillingMode;
  onChange: (value: ClientBillingMode) => void;
};

export function ClientBillingOptions({ value, onChange }: Props) {
  return (
    <div className="mt-4 space-y-2 border-t border-[rgba(17,17,17,0.08)] pt-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Kart de cliente
      </p>
      {OPTIONS.map((opt) => (
        <label
          key={opt.value}
          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
            value === opt.value
              ? "border-accent/30 bg-accent/5 text-[#0d1f3c]"
              : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-neutral-600"
          }`}
        >
          <input
            type="radio"
            name="billing"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-[#0d1f3c]"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
