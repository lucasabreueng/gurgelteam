type Props = { percent: number; label?: string };

export function TireWearCard({ percent, label }: Props) {
  const tone =
    percent >= 75
      ? "bg-red-500"
      : percent >= 50
        ? "bg-amber-500"
        : "bg-emerald-500";
  const life = Math.max(0, 100 - percent);

  return (
    <div className="rounded-lg bg-[#fafbfc] px-3 py-2 ring-1 ring-[rgba(17,17,17,0.06)]">
      {label ? (
        <p className="mb-1.5 text-[10px] font-bold uppercase text-neutral-500">
          {label}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-2 text-xs font-bold">
        <span className="text-neutral-600">Desgaste</span>
        <span className="tabular-nums text-[#0d1f3c]">{percent}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] font-semibold text-neutral-500">
        Vida útil estimada: {life}%
      </p>
    </div>
  );
}
