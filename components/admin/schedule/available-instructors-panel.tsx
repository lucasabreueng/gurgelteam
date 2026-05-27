import type { AvailableInstructorItem } from "@/lib/contracts/schedule";

export function AvailableInstructorsPanel({
  instructors,
}: {
  instructors: AvailableInstructorItem[];
}) {
  return (
    <section className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Instrutores disponíveis
      </h3>
      <ul className="mt-3 space-y-2">
        {instructors.map((i) => (
          <li
            key={i.id}
            className="flex items-center justify-between rounded-lg bg-[#fafbfc] px-3 py-2 ring-1 ring-[rgba(17,17,17,0.06)]"
          >
            <span className="text-sm font-bold text-[#0d1f3c]">{i.name}</span>
            {i.nextFree ? (
              <span className="text-[10px] font-semibold text-neutral-500">
                Livre {i.nextFree}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
