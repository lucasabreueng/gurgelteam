import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
};

export function SettingsSection({
  title,
  description,
  headerAction,
  children,
}: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
      <header className="flex flex-col gap-4 border-b border-[rgba(17,17,17,0.06)] px-6 py-5 sm:flex-row sm:items-start sm:justify-between md:px-8 md:py-6">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#0d1f3c] md:text-xl">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          ) : null}
        </div>
        {headerAction ? (
          <div className="shrink-0 sm:pt-0.5">{headerAction}</div>
        ) : null}
      </header>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}

export function SettingsField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <label className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </label>
      {children}
      {hint ? <p className="text-[12px] text-neutral-500">{hint}</p> : null}
    </div>
  );
}

/** Superfície de campos (input, dropdown) na área de configurações. */
export const settingsFieldClass =
  "w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] text-[14px] text-[#111] outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";

export const settingsInputClass = `${settingsFieldClass} px-4 py-3 placeholder:text-neutral-400`;

export const settingsTextareaClass =
  "min-h-[120px] w-full resize-y rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-4 py-3 text-[14px] leading-relaxed text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";

export const settingsOutlineButtonClass =
  "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[rgba(17,17,17,0.1)] bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30 disabled:cursor-not-allowed disabled:opacity-50";
