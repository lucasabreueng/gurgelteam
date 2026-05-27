import type { StockLevel } from "@/lib/contracts/parts";

const CONFIG: Record<
  StockLevel,
  { label: string; dot: string; className: string }
> = {
  ok: {
    label: "Estoque normal",
    dot: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  },
  low: {
    label: "Estoque baixo",
    dot: "bg-amber-400",
    className: "bg-amber-50 text-amber-900 ring-amber-200/60",
  },
  critical: {
    label: "Estoque crítico",
    dot: "bg-red-500",
    className: "bg-red-50 text-red-800 ring-red-200/60",
  },
};

export function StockStatusBadge({ level }: { level: StockLevel }) {
  const c = CONFIG[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${c.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} aria-hidden />
      {c.label}
    </span>
  );
}
