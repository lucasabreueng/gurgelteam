import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";


export function TechnicalTimeline() {
  const timeline = NewMaintenanceServiceMock.getTimeline();
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Timeline técnica</h2>
      <ol className="relative mt-4 space-y-0">
        {timeline.map((ev, i) => (
          <li key={ev.id} className="relative flex gap-4 pb-5 last:pb-0">
            {i < timeline.length - 1 ? (
              <span
                className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-0.5 bg-neutral-200"
                aria-hidden
              />
            ) : null}
            <span className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full bg-[#0d1f3c] ring-2 ring-[#0d1f3c]/15" />
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-500">
                {ev.date}
              </p>
              <p className="text-sm font-bold text-[#0d1f3c]">{ev.title}</p>
              <p className="text-xs text-neutral-600">{ev.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
