type Props = {
  studentName: string;
  timeRange: string;
  dateLabel: string;
  kartLabel: string;
  durationLabel: string;
};

export function ClassSummaryCard({
  studentName,
  timeRange,
  dateLabel,
  kartLabel,
  durationLabel,
}: Props) {
  return (
    <section className="rounded-2xl border-2 border-[#0d1f3c]/15 bg-gradient-to-br from-[#fafbfc] to-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Resumo da aula</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-[rgba(17,17,17,0.06)] pb-2">
          <dt className="text-neutral-500">Aluno</dt>
          <dd className="font-bold text-[#0d1f3c]">{studentName || "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[rgba(17,17,17,0.06)] pb-2">
          <dt className="text-neutral-500">Horário</dt>
          <dd className="font-bold tabular-nums text-[#0d1f3c]">
            {dateLabel}, {timeRange}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[rgba(17,17,17,0.06)] pb-2">
          <dt className="text-neutral-500">Kart</dt>
          <dd className="font-bold text-[#0d1f3c]">{kartLabel || "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 pt-1">
          <dt className="text-neutral-500">Duração</dt>
          <dd className="font-bold text-[#0d1f3c]">{durationLabel}</dd>
        </div>
      </dl>
    </section>
  );
}
