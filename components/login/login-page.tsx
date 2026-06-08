"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "./login-form";
import { SecurityCard } from "./security-card";
import { useTheme } from "@/components/theme-provider";

function LoginBrand() {
  const { resolvedTheme } = useTheme();
  const logoSrc =
    resolvedTheme === "dark" ? "/images/logo-light.svg" : "/images/logo.svg";

  return (
    <div className="auth-surface flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Image
              src={logoSrc}
              alt="Gurgel Team"
              width={140}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--ds-border-strong)] bg-[var(--ds-bg-card)] px-4 py-2.5 text-[13px] font-semibold text-[var(--ds-text-primary)] shadow-sm transition hover:border-accent/30 hover:bg-[var(--ds-bg-muted)]"
            >
              <HiArrowLeft className="h-4 w-4 text-accent" aria-hidden />
              Voltar ao site
            </Link>
          </div>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <div className="mt-6">
          <SecurityCard />
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  return <LoginBrand />;
}
