import { adminCardClass } from "@/lib/design";

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
    <section className={`${adminCardClass} border-2 border-accent/20 p-5`}>
      <h2 className="text-sm font-bold text-[var(--ds-text-primary)]">Resumo da aula</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className={`flex justify-between gap-4 border-b border-[var(--ds-border-subtle)] pb-2`}>
          <dt className="text-[var(--ds-text-muted)]">Aluno</dt>
          <dd className="font-bold text-[var(--ds-text-primary)]">{studentName || "—"}</dd>
        </div>
        <div className={`flex justify-between gap-4 border-b border-[var(--ds-border-subtle)] pb-2`}>
          <dt className="text-[var(--ds-text-muted)]">Horário</dt>
          <dd className="font-bold tabular-nums text-[var(--ds-text-primary)]">
            {dateLabel}, {timeRange}
          </dd>
        </div>
        <div className={`flex justify-between gap-4 border-b border-[var(--ds-border-subtle)] pb-2`}>
          <dt className="text-[var(--ds-text-muted)]">Kart</dt>
          <dd className="font-bold text-[var(--ds-text-primary)]">{kartLabel || "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 pt-1">
          <dt className="text-[var(--ds-text-muted)]">Duração</dt>
          <dd className="font-bold text-[var(--ds-text-primary)]">{durationLabel}</dd>
        </div>
      </dl>
    </section>
  );
}
