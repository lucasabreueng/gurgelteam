import type { ItemSeverity } from "@/lib/contracts/maintenance";

const STYLES: Record<
  Exclude<ItemSeverity, null>,
  { label: string; className: string }
> = {
  leve: {
    label: "Leve",
    className: "bg-amber-100 text-amber-900 ring-amber-200/80",
  },
  moderada: {
    label: "Moderada",
    className: "bg-orange-100 text-orange-900 ring-orange-200/80",
  },
  critica: {
    label: "Crítica",
    className: "bg-red-100 text-red-900 ring-red-200/80",
  },
};

type Props = {
  severity: Exclude<ItemSeverity, null>;
  selected?: boolean;
  onClick?: () => void;
};

export function SeverityBadge({ severity, selected, onClick }: Props) {
  const { label, className } = STYLES[severity];
  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 transition ${className} ${
        selected ? "ring-2 ring-offset-1" : ""
      } ${onClick ? "hover:brightness-95" : ""}`}
    >
      {label}
    </Tag>
  );
}
