"use client";

import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Classes extras na barra de ações (ex.: grid 2 colunas na agenda mobile). */
  actionsClassName?: string;
};

/** Conteúdo interno do cabeçalho de página (borda e posição fixa ficam no AdminShell). */
export function AdminPageHeader({
  title,
  subtitle,
  actions,
  actionsClassName = "",
}: Props) {
  return (
    <div className="flex flex-col gap-0 lg:gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="hidden min-w-0 lg:block">
        {typeof title === "string" ? (
          <h1 className="text-xl font-bold tracking-tight text-[#0d1f3c] md:text-2xl">
            {title}
          </h1>
        ) : (
          title
        )}
        {subtitle ? (
          typeof subtitle === "string" ? (
            <p className="mt-0.5 max-w-2xl text-[13px] leading-snug text-neutral-600 md:text-[14px]">
              {subtitle}
            </p>
          ) : (
            subtitle
          )
        ) : null}
      </div>
      {actions ? (
        <div
          className={`admin-page-header-actions flex w-full min-w-0 shrink-0 flex-wrap items-center justify-end gap-2 max-lg:justify-stretch lg:w-auto lg:gap-2 ${actionsClassName}`.trim()}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
