import type { ClientStatus } from "@/lib/contracts/clients";

import {
  adminBadgeNeutralClass,
  adminBadgeNeutralStatusClass,
  adminBadgeSuccessClass,
} from "@/lib/design";

/** Badge compartilhado para categoria e nível */
export const clientMetaBadgeClass = adminBadgeNeutralClass;

export function ClientLevelBadge({ label }: { label: string }) {
  if (!label || label === "—") {
    return <span className="text-[12px] text-neutral-400">—</span>;
  }
  return <span className={clientMetaBadgeClass}>{label}</span>;
}

export function statusBadgeClass(status: ClientStatus) {
  switch (status) {
    case "Ativo":
      return adminBadgeSuccessClass;
    case "Inativo":
    default:
      return adminBadgeNeutralStatusClass;
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
