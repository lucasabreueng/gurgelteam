import type { ChecklistGroup, ChecklistItemStatus } from "@/lib/contracts/maintenance";

const statusClass: Record<ChecklistItemStatus, string> = {
  ok: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  warn: "bg-amber-50 text-amber-900 ring-amber-200/60",
  fail: "bg-red-50 text-red-800 ring-red-200/60",
};

const statusLabel: Record<ChecklistItemStatus, string> = {
  ok: "Aprovado",
  warn: "Atenção",
  fail: "Reprovar",
};

export function TechnicalChecklist({ groups }: { groups: ChecklistGroup[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4"
        >
          <h4 className="text-sm font-bold text-[#0d1f3c]">{group.title}</h4>
          <ul className="mt-3 space-y-2">
            {group.items.map((item) => (
              <li
                key={item.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold ring-1 ${statusClass[item.status]}`}
              >
                {item.label}
                <span className="text-[10px] uppercase">
                  {statusLabel[item.status]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
