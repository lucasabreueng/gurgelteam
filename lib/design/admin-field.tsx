import type { ReactNode } from "react";

import { adminHintClass, adminLabelClass } from "./classes";

type AdminFieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
};

/** Campo de formulário admin — label + control + hint opcional. */
export function AdminField({ label, children, hint }: AdminFieldProps) {
  return (
    <div className="min-w-0 space-y-2">
      <label className={adminLabelClass}>{label}</label>
      {children}
      {hint ? <p className={adminHintClass}>{hint}</p> : null}
    </div>
  );
}
