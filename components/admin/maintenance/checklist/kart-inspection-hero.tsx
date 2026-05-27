import type { ChecklistKartContext } from "@/lib/contracts/maintenance";

type Props = {
  heroLabel: string;
  heroTone: "ok" | "warn" | "fail";
  kart: ChecklistKartContext;
  reliabilityScore: number;
};

const HERO_STYLES = {
  ok: {
    border: "border-emerald-200/60",
    bg: "bg-gradient-to-br from-emerald-50 to-white",
    pill: "bg-emerald-500 text-white",
    ring: "ring-emerald-200/50",
  },
  warn: {
    border: "border-amber-200/60",
    bg: "bg-gradient-to-br from-amber-50 to-white",
    pill: "bg-amber-500 text-white",
    ring: "ring-amber-200/50",
  },
  fail: {
    border: "border-red-200/60",
    bg: "bg-gradient-to-br from-red-50 to-white",
    pill: "bg-red-500 text-white",
    ring: "ring-red-200/50",
  },
};

export function KartInspectionHero({
  heroLabel,
  heroTone,
  kart,
  reliabilityScore,
}: Props) {
  const s = HERO_STYLES[heroTone];

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${s.border} ${s.bg} md:p-6`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Status geral
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#0d1f3c] md:text-3xl">
            {heroLabel}
          </p>
        </div>
        <span
          className={`rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider ${s.pill}`}
        >
          {heroTone === "ok"
            ? "Liberado"
            : heroTone === "warn"
              ? "Restrito"
              : "Bloqueado"}
        </span>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className={`rounded-xl bg-white/80 p-3 ring-1 ${s.ring}`}>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Score confiabilidade
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-[#0d1f3c]">
            {reliabilityScore}
          </dd>
        </div>
        <div className={`rounded-xl bg-white/80 p-3 ring-1 ${s.ring}`}>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Última revisão
          </dt>
          <dd className="mt-1 text-lg font-bold text-[#0d1f3c]">
            {kart.daysSinceRevision} dias
          </dd>
        </div>
        <div
          className={`col-span-2 rounded-xl bg-white/80 p-3 ring-1 sm:col-span-1 ${s.ring}`}
        >
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Observação rápida
          </dt>
          <dd className="mt-1 text-sm font-medium text-neutral-700">
            {kart.quickNote}
          </dd>
        </div>
      </dl>
    </div>
  );
}
