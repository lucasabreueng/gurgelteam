"use client";

import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { HiAcademicCap } from "react-icons/hi2";
import { fetchAuthenticatedUser } from "@/lib/auth/client-session";
import { resolveUserAreaPath } from "@/lib/auth/resolve-user-area-path";

type StudentAreaButtonProps = {
  className?: string;
  onNavigate?: () => void;
  variant?: "header" | "card";
  /** Evita propagação de clique em cards selecionáveis (ex.: preços). */
  stopPropagation?: boolean;
};

const headerBtnClass =
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-semibold capitalize text-white transition-all duration-300 hover:bg-[var(--color-accent-hover)] disabled:pointer-events-none disabled:opacity-50";

export function StudentAreaButton({
  className = "",
  onNavigate,
  variant = "header",
  stopPropagation = false,
}: StudentAreaButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const runNavigation = async () => {
    if (loading) return;
    setLoading(true);
    onNavigate?.();

    const user = await fetchAuthenticatedUser();
    if (user) {
      router.push(resolveUserAreaPath(user));
    } else {
      router.push("/login");
    }

    setLoading(false);
  };

  const handleCardClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) e.stopPropagation();
    await runNavigation();
  };

  if (variant === "card") {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={handleCardClick}
        className={`block w-full rounded-full border border-divider bg-secondary py-[15px] text-center text-base font-semibold text-primary transition hover:border-accent hover:bg-accent hover:text-white disabled:opacity-60 ${className}`}
      >
        Agendar agora!
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void runNavigation()}
      className={`${headerBtnClass} whitespace-nowrap ${className}`}
    >
      <HiAcademicCap className="h-5 w-5 shrink-0" aria-hidden />
      Área do aluno
    </button>
  );
}
