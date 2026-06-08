import { type ReactNode } from "react";
import { LANDING_SHELL } from "@/lib/landing/constants";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-container px-[15px] md:px-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function WideSection({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={LANDING_SHELL}>
      <div className={`rounded-card ${className}`}>{children}</div>
    </div>
  );
}
