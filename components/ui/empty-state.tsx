import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  compact = false,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "px-4 py-8" : "rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white px-6 py-12 shadow-[0_2px_12px_rgba(13,31,60,0.04)]"
      } ${className}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Nenhum registro
      </p>
      <p className="mt-2 text-base font-bold text-[#0d1f3c]">{title}</p>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
