import type { ClientStatus } from "@/lib/contracts/clients";

/** Badge compartilhado para categoria e nível */
export const clientMetaBadgeClass =
  "inline-flex rounded-md border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-2 py-0.5 text-[11px] font-semibold uppercase text-[#0d1f3c]";

export function ClientLevelBadge({ label }: { label: string }) {
  if (!label || label === "—") {
    return <span className="text-[12px] text-neutral-400">—</span>;
  }
  return <span className={clientMetaBadgeClass}>{label}</span>;
}

export function statusBadgeClass(status: ClientStatus) {
  switch (status) {
    case "Ativo":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200/60";
    case "Inativo":
    default:
      return "bg-neutral-100 text-neutral-600 ring-neutral-200/60";
  }
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${statusBadgeClass(status)}`}
    >
      {status}
    </span>
  );
}

export function ClientCategoriesBadges({ labels }: { labels: string[] }) {
  if (labels.length === 0) {
    return <span className="text-[12px] text-neutral-400">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {labels.map((label) => (
        <span key={label} className={clientMetaBadgeClass}>
          {label}
        </span>
      ))}
    </div>
  );
}
