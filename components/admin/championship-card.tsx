import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";

export function ChampionshipCard() {
  const championship = DashboardServiceMock.getChampionship();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/5" aria-hidden />
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Campeonatos
      </p>
      <h3 className="mt-2 text-xl font-bold text-[#0d1f3c]">{championship.event}</h3>
      <p className="mt-1 text-sm text-neutral-600">{championship.stage}</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#fafbfc] px-4 py-3 ring-1 ring-[rgba(17,17,17,0.06)]">
          <p className="text-[10px] font-bold uppercase text-neutral-500">Inscritos</p>
          <p className="mt-1 text-2xl font-bold text-accent">
            {championship.enrolled}
            <span className="text-base font-medium text-neutral-400">
              /{championship.capacity}
            </span>
          </p>
        </div>
        <div className="rounded-xl bg-[#fafbfc] px-4 py-3 ring-1 ring-[rgba(17,17,17,0.06)]">
          <p className="text-[10px] font-bold uppercase text-neutral-500">Countdown</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[#0d1f3c]">
            {championship.countdown}
          </p>
        </div>
      </div>

      {championship.registrationsOpen ? (
        <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-200/70">
          Inscrições abertas
        </span>
      ) : null}

      <p className="mt-4 text-sm text-neutral-600">
        Próxima data · <span className="font-semibold text-[#111]">{championship.nextDate}</span>
      </p>
    </div>
  );
}
