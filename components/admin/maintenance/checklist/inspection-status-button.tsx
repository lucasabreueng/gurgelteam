import type { InspectionItemStatus } from "@/lib/contracts/maintenance";
import { HiCheck, HiExclamationTriangle, HiXMark } from "react-icons/hi2";

type StatusValue = Exclude<InspectionItemStatus, null>;

const CONFIG: Record<
  StatusValue,
  { label: string; active: string; idle: string; Icon: typeof HiCheck }
> = {
  ok: {
    label: "OK",
    active: "bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.35)]",
    idle: "bg-white text-emerald-700 ring-1 ring-emerald-200/80 hover:bg-emerald-50",
    Icon: HiCheck,
  },
  warn: {
    label: "Atenção",
    active: "bg-amber-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.35)]",
    idle: "bg-white text-amber-800 ring-1 ring-amber-200/80 hover:bg-amber-50",
    Icon: HiExclamationTriangle,
  },
  fail: {
    label: "Reprovar",
    active: "bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.35)]",
    idle: "bg-white text-red-700 ring-1 ring-red-200/80 hover:bg-red-50",
    Icon: HiXMark,
  },
};

type Props = {
  status: StatusValue;
  selected: boolean;
  onSelect: () => void;
};

export function InspectionStatusButton({ status, selected, onSelect }: Props) {
  const { label, active, idle, Icon } = CONFIG[status];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-all duration-200 sm:min-h-[40px] sm:flex-none sm:px-3 ${
        selected ? active : idle
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="sm:inline">{label}</span>
    </button>
  );
}
