import type { ReactNode } from "react";

import { AdminField } from "@/lib/design/admin-field";
import {
  adminBodyClass,
  adminCardClass,
  adminSectionTitleClass,
  settingsFieldClass,
  settingsInputClass,
  settingsOutlineButtonClass,
  settingsTextareaClass,
} from "@/lib/design/classes";

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
    <section className={adminCardClass}>
      <header className="flex flex-col gap-4 border-b border-[var(--ds-border-subtle)] px-6 py-5 sm:flex-row sm:items-start sm:justify-between md:px-8 md:py-6">
        <div className="min-w-0">
          <h2 className={adminSectionTitleClass}>{title}</h2>
          {description ? (
            <p className={`mt-1 ${adminBodyClass}`}>{description}</p>
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

/** @deprecated Preferir `AdminField` de `@/lib/design`. */
export const SettingsField = AdminField;

export {
  settingsFieldClass,
  settingsInputClass,
  settingsTextareaClass,
  settingsOutlineButtonClass,
};
