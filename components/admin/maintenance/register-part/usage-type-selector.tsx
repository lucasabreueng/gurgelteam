import type { PartUsageType } from "@/lib/contracts/parts";
import { PartsServiceMock } from "@/services/parts/partsServiceMock";


type Props = {
  value: PartUsageType;
  onChange: (value: PartUsageType) => void;
};

export function UsageTypeSelector({ value, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4">
      <h3 className="mb-3 text-sm font-bold text-[#0d1f3c]">Tipo de utilização</h3>
      <div className="flex flex-wrap gap-1 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-1">
        {PartsServiceMock.getUsageTypeOptions().map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
              value === opt.value
                ? "bg-[#0d1f3c] text-white shadow-sm"
                : "text-neutral-600 hover:text-[#0d1f3c]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  );
}
