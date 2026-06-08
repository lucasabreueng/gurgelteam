"use client";

import type { AdminNavKey } from "@/lib/contracts/dashboard";
import Link from "next/link";

import { AdminShell } from "./admin-shell";

type AdminModulePlaceholderPageProps = {
  activeNav: AdminNavKey;
  title: string;
  description: string;
  highlights?: readonly string[];
};

export function AdminModulePlaceholderPage({
  activeNav,
  title,
  description,
  highlights = [],
}: AdminModulePlaceholderPageProps) {
  return (
    <AdminShell activeNav={activeNav} mobileTitle={title}>
      <div className="flex min-h-[min(60vh,520px)] flex-col items-center justify-center rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:px-10">
        <span className="inline-flex rounded-full bg-[rgba(13,31,60,0.06)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
          Em breve
        </span>
        <h1 className="mt-4 text-2xl font-bold text-[#0d1f3c] md:text-3xl">{title}</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-600 md:text-base">
          {description}
        </p>
        {highlights.length > 0 ? (
          <ul className="mt-6 max-w-md space-y-2 text-left text-sm text-neutral-700">
            {highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href="/admin"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#0d1f3c] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </AdminShell>
  );
}
