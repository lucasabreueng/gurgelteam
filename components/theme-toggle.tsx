"use client";

import { HiMoon, HiSun } from "react-icons/hi2";

import { useTheme } from "@/components/theme-provider";

type Variant = "icon" | "menu";

type Props = {
  variant?: Variant;
  className?: string;
  /** Visual da landing pública (header, rodapé). */
  appearance?: "landing" | "app";
  /** Sidebar escura ou drawer mobile (ícone claro). */
  onDarkSurface?: boolean;
};

export function ThemeToggle({
  variant = "icon",
  className = "",
  appearance = "app",
  onDarkSurface = false,
}: Props) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const landingIconClass = onDarkSurface
    ? "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/25 bg-white/10 text-white transition-colors duration-300 hover:border-white hover:bg-white/15"
    : "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-divider bg-background text-primary transition-colors duration-300 hover:border-accent hover:text-accent";

  const appIconClass = onDarkSurface
    ? "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
    : "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-card)] text-[var(--ds-text-primary)] transition hover:border-accent/30";

  const triggerClass =
    appearance === "landing" ? landingIconClass : appIconClass;

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition ${
          onDarkSurface
            ? "text-white/85 hover:bg-white/10"
            : "text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-muted)]"
        } ${className}`}
      >
        {isDark ? (
          <HiSun className="h-5 w-5 shrink-0" aria-hidden />
        ) : (
          <HiMoon className="h-5 w-5 shrink-0" aria-hidden />
        )}
        {isDark ? "Tema claro" : "Tema escuro"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${triggerClass} ${className}`}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={toggleTheme}
    >
      {isDark ? (
        <HiSun className="h-5 w-5 shrink-0" aria-hidden />
      ) : (
        <HiMoon className="h-5 w-5 shrink-0" aria-hidden />
      )}
    </button>
  );
}
