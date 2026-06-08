"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminActionVariant =
  | "outline-sm"
  | "outline-md"
  | "primary-sm"
  | "primary-md"
  | "card";

const VARIANT_CLASS: Record<AdminActionVariant, string> = {
  "outline-sm": "btn-outline-sm",
  "outline-md": "btn-outline-md",
  "primary-sm": "btn-primary-sm",
  "primary-md": "btn-primary-md",
  card: "inline-flex shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-4 py-2 text-sm font-semibold text-accent shadow-sm transition hover:border-accent/30 hover:bg-neutral-50",
};

type AdminActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AdminActionVariant;
  children: ReactNode;
};

export function AdminActionButton({
  variant = "outline-sm",
  className = "",
  type = "button",
  children,
  ...props
}: AdminActionButtonProps) {
  return (
    <button
      type={type}
      className={`${VARIANT_CLASS[variant]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
