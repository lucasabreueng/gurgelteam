import { type ReactNode } from "react";

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
    <div
      id={id}
      className={`mx-auto w-full max-w-wide rounded-card px-[15px] md:px-5 ${className}`}
    >
      {children}
    </div>
  );
}
