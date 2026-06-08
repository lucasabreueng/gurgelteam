"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import {
  HiArrowPath,
  HiClock,
  HiExclamationTriangle,
  HiHome,
  HiLockClosed,
  HiMagnifyingGlass,
  HiShieldExclamation,
  HiWrenchScrewdriver,
} from "react-icons/hi2";
import type { ErrorPageConfig, ErrorPageKey } from "@/lib/error-pages";

export type { ErrorPageAction, ErrorPageConfig, ErrorPageKey } from "@/lib/error-pages";

const ICONS: Record<ErrorPageKey, IconType> = {
  "404": HiMagnifyingGlass,
  "401": HiLockClosed,
  "403": HiShieldExclamation,
  "500": HiExclamationTriangle,
  "sessao-expirada": HiClock,
  manutencao: HiWrenchScrewdriver,
};

const EMPHASIZED_CODE_KEYS: ErrorPageKey[] = ["404", "401", "403", "500"];

function actionClassName(action: {
  variant?: "primary" | "outline";
  uppercase?: boolean;
}) {
  if (action.variant === "outline") {
    return `inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-5 py-3.5 text-[13px] text-[#0d1f3c] shadow-sm transition hover:border-accent/30 hover:bg-neutral-50 sm:w-auto ${
      action.uppercase
        ? "font-bold uppercase tracking-wider"
        : "font-semibold"
    }`;
  }
  return "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 sm:w-auto";
}

type Props = {
  config: ErrorPageConfig;
  pageKey: ErrorPageKey;
  onRetry?: () => void;
};

export function ErrorPage({ config, pageKey, onRetry }: Props) {
  const Icon = ICONS[pageKey];
  const emphasizeCode = EMPHASIZED_CODE_KEYS.includes(pageKey);

  const handleRetry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  return (
    <div className="error-page-surface flex min-h-screen items-center justify-center bg-[var(--ds-bg-page)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="w-full max-w-[480px]">
        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 text-center shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(13,31,60,0.06)] text-accent">
            <Icon className="h-8 w-8" aria-hidden />
          </div>

          {emphasizeCode ? (
            <p className="mt-6 text-[64px] font-bold leading-none tracking-tight text-accent sm:text-[80px]">
              {config.status}
            </p>
          ) : (
            <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              {config.status}
            </p>
          )}
          <h1
            className={`font-bold tracking-tight text-[#0d1f3c] ${
              emphasizeCode
                ? "mt-3 text-xl sm:text-2xl"
                : "mt-2 text-2xl sm:text-[28px]"
            }`}
          >
            {config.title}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-neutral-600">
            {config.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {config.actions.map((action) => {
              const className = actionClassName(action);

              if (action.retry) {
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={handleRetry}
                    className={className}
                  >
                    <HiArrowPath className="h-4 w-4" aria-hidden />
                    {action.label}
                  </button>
                );
              }

              if (action.href) {
                const isHome = action.href === "/";
                return (
                  <Link key={action.label} href={action.href} className={className}>
                    {isHome ? (
                      <HiHome className="h-4 w-4" aria-hidden />
                    ) : null}
                    {action.label}
                  </Link>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
