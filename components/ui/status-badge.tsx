import type { ReactNode } from "react";

type StatusBadgeProps = {
  children: ReactNode;
  className?: string;
  dotClassName?: string;
  pulseDot?: boolean;
};

export function StatusBadge({
  children,
  className = "bg-[var(--ds-bg-muted)] text-[var(--ds-text-secondary)] ring-[var(--ds-border-field)]",
  dotClassName,
  pulseDot = false,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${className}`}
    >
      {dotClassName ? (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClassName}${
            pulseDot ? " animate-pulse" : ""
          }`}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  );
}
