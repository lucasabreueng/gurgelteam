import type { AuditEntry } from "@/lib/contracts/settings";

type Props = {
  entries: AuditEntry[];
};

export function AuditLog({ entries }: Props) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex flex-col gap-2 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-[14px] text-[#111]">
              <span className="font-bold text-[#0d1f3c]">{entry.user}</span>{" "}
              {entry.action}
            </p>
            <p className="mt-1 text-[12px] text-neutral-500">
              Módulo · {entry.module}
            </p>
          </div>
          <time className="shrink-0 text-[12px] font-semibold tabular-nums text-neutral-500">
            {entry.time}
          </time>
        </li>
      ))}
    </ul>
  );
}
