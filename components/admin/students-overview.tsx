import type { StudentOfTheMonth } from "@/lib/contracts/dashboard";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";
import { UserAvatar } from "@/components/ui/user-avatar";
import { adminCardClass } from "@/lib/design";

type Props = {
  className?: string;
};

const RANK_LABEL: Record<StudentOfTheMonth["rank"], string> = {
  1: "Top 1",
  2: "Top 2",
  3: "Top 3",
};

const RANK_BADGE: Record<StudentOfTheMonth["rank"], string> = {
  1: "bg-[var(--ds-warning-bg)] text-[var(--ds-warning-text)] ring-[var(--ds-warning-border)]",
  2: "bg-[var(--ds-bg-muted)] text-[var(--ds-text-primary)] ring-[var(--ds-border-field)]",
  3: "bg-[var(--ds-info-bg)] text-[var(--ds-info-text)] ring-[var(--ds-info-border)]",
};

function HighlightCard({ student }: { student: StudentOfTheMonth }) {
  const categories = ClientsServiceMock.resolveCategoryNames(
    student.categoryIds,
    SettingsServiceMock.getKartCategories(),
  ).join(" · ");

  return (
    <article className="flex items-center gap-3 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-bg-muted)] p-3 sm:gap-4 sm:p-4">
      <span
        className={`flex h-8 w-10 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-wide ring-1 sm:h-9 sm:w-11 sm:text-[11px] ${RANK_BADGE[student.rank]}`}
      >
        {RANK_LABEL[student.rank]}
      </span>

      <UserAvatar
        src={student.avatar}
        name={student.name}
        size={48}
        roundedClass="rounded-full"
      />

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[var(--ds-text-primary)] sm:text-base">
            {student.name}
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--ds-text-secondary)] sm:text-sm">
            {student.age} anos
          </p>
          <p className="mt-0.5 truncate text-[12px] font-medium text-[var(--ds-text-secondary)] sm:text-sm">
            {categories}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)] sm:text-[10px]">
            Melhor tempo
          </p>
          <p className="mt-0.5 text-base font-bold tabular-nums text-[var(--ds-text-primary)] sm:text-lg">
            {student.bestTime}
          </p>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)] sm:text-[10px]">
            Evolução
          </p>
          <p
            className={`mt-0.5 text-[12px] font-bold tabular-nums sm:text-sm ${
              student.evolutionPositive
                ? "text-[var(--ds-success-text)]"
                : "text-[var(--ds-error-text)]"
            }`}
          >
            {student.evolution}
          </p>
        </div>
      </div>
    </article>
  );
}

export function StudentsOverview({ className = "" }: Props) {
  return (
    <div className={`flex h-full flex-col p-6 md:p-7 ${adminCardClass} ${className}`}>
      <div>
        <h3 className="text-xl font-bold text-[var(--ds-text-primary)]">Clientes em destaque</h3>
        <p className="mt-1 text-sm text-[var(--ds-text-secondary)]">Destaques do mês</p>
      </div>

      <ul className="mt-6 flex min-h-0 flex-1 flex-col gap-3">
        {DashboardServiceMock.getStudentsOfTheMonth().map((student) => (
          <li key={student.id} className="min-h-0 flex-1">
            <HighlightCard student={student} />
          </li>
        ))}
      </ul>
    </div>
  );
}
