import Image from "next/image";
import type { StudentOfTheMonth } from "@/lib/contracts/dashboard";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

type Props = {
  className?: string;
};

const RANK_LABEL: Record<StudentOfTheMonth["rank"], string> = {
  1: "Top 1",
  2: "Top 2",
  3: "Top 3",
};

const RANK_BADGE: Record<StudentOfTheMonth["rank"], string> = {
  1: "bg-amber-50 text-amber-900 ring-amber-200/70",
  2: "bg-slate-100 text-slate-800 ring-slate-200/70",
  3: "bg-orange-50 text-orange-900 ring-orange-200/70",
};

function HighlightCard({ student }: { student: StudentOfTheMonth }) {
  const categories = ClientsServiceMock.resolveCategoryNames(
    student.categoryIds,
    SettingsServiceMock.getKartCategories(),
  ).join(" · ");

  return (
    <article className="flex items-center gap-3 rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc] p-3 sm:gap-4 sm:p-4">
      <span
        className={`flex h-8 w-10 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-wide ring-1 sm:h-9 sm:w-11 sm:text-[11px] ${RANK_BADGE[student.rank]}`}
      >
        {RANK_LABEL[student.rank]}
      </span>

      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm sm:h-12 sm:w-12">
        <Image
          src={student.avatar}
          alt=""
          fill
          className="object-cover"
          sizes="48px"
        />
      </span>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#0d1f3c] sm:text-base">
            {student.name}
          </p>
          <p className="mt-0.5 text-[12px] text-neutral-600 sm:text-sm">
            {student.age} anos
          </p>
          <p className="mt-0.5 truncate text-[12px] font-medium text-neutral-700 sm:text-sm">
            {categories}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 sm:text-[10px]">
            Melhor tempo
          </p>
          <p className="mt-0.5 text-base font-bold tabular-nums text-[#0d1f3c] sm:text-lg">
            {student.bestTime}
          </p>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-neutral-500 sm:text-[10px]">
            Evolução
          </p>
          <p
            className={`mt-0.5 text-[12px] font-bold tabular-nums sm:text-sm ${
              student.evolutionPositive ? "text-emerald-700" : "text-red-700"
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
    <div
      className={`flex h-full flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7 ${className}`}
    >
      <div>
        <h3 className="text-xl font-bold text-[#0d1f3c]">Alunos em destaque</h3>
        <p className="mt-1 text-sm text-neutral-600">Destaques do mês</p>
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
