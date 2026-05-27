import type { MaintenanceTabKey } from "@/lib/contracts/maintenance";

const TABS: { key: MaintenanceTabKey; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "preventivas", label: "Preventivas" },
  { key: "corretivas", label: "Corretivas" },
  { key: "emergenciais", label: "Emergenciais" },
  { key: "em_andamento", label: "Em andamento" },
  { key: "aguardando_peca", label: "Aguardando peça" },
  { key: "finalizadas", label: "Finalizadas" },
  { key: "historico", label: "Histórico" },
];

type Props = {
  active: MaintenanceTabKey;
  onChange: (tab: MaintenanceTabKey) => void;
};

export function MaintenanceTabs({ active, onChange }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full flex-wrap gap-1 rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition md:px-4 ${
              active === t.key
                ? "bg-[#0d1f3c] text-white shadow-sm"
                : "text-neutral-600 hover:text-[#0d1f3c]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
