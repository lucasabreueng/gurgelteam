import type { MaintenanceOrderDetail } from "@/lib/contracts/maintenance";

export function MaintenanceTimeline({
  items,
}: {
  items: MaintenanceOrderDetail["history"];
}) {
  return (
    <ol className="flex flex-col">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full bg-[#0d1f3c] ring-4 ring-white"
                aria-hidden
              />
              {!isLast ? (
                <span
                  className="w-0.5 flex-1 min-h-[24px] bg-[rgba(13,31,60,0.15)]"
                  aria-hidden
                />
              ) : null}
            </div>
            <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                {item.date}
              </p>
              <p className="mt-1 font-bold text-[#0d1f3c]">{item.title}</p>
              <p className="mt-0.5 text-sm text-neutral-600">{item.detail}</p>
              {item.cost ? (
                <p className="mt-1 text-sm font-semibold text-accent">
                  {item.cost}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
