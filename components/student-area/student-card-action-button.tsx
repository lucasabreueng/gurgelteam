"use client";

import type { ButtonHTMLAttributes } from "react";

const ACTION_BUTTON_CLASS =
  "inline-flex shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-4 py-2 text-sm font-semibold text-accent shadow-sm transition hover:border-accent/30 hover:bg-neutral-50";

type StudentCardActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function StudentCardActionButton({
  className = "",
  type = "button",
  ...props
}: StudentCardActionButtonProps) {
  return (
    <button
      type={type}
      className={`${ACTION_BUTTON_CLASS}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
