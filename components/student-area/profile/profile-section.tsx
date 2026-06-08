import type { ReactNode } from "react";
import { adminCardInnerClass } from "@/lib/design";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  id?: string;
  headerActions?: ReactNode;
};

export function ProfileSection({
  title,
  description,
  children,
  id,
  headerActions,
}: Props) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 ${adminCardInnerClass} transition-shadow hover:shadow-[0_4px_24px_rgba(13,31,60,0.06)] md:p-8`}
    >
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(17,17,17,0.06)] pb-5">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold tracking-tight text-[#0d1f3c] md:text-xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-600">
              {description}
            </p>
          ) : null}
        </div>
        {headerActions ? (
          <div className="shrink-0">{headerActions}</div>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export const profileReadonlyClass =
  "w-full rounded-xl border border-transparent bg-[#fafbfc] px-4 py-3 text-[14px] font-medium text-[#111]";

export const profileInputClass =
  "w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-4 py-3 text-[14px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";

export function ProfileField({
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
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      {children}
      {hint ? (
        <p className="text-[12px] leading-snug text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}
