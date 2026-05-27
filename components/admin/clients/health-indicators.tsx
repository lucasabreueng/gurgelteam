"use client";

import {
  HiArrowTrendingDown,
  HiExclamationTriangle,
  HiFire,
} from "react-icons/hi2";
import type { ClientHealthFlag } from "@/lib/contracts/clients";

type Props = {
  flags: ClientHealthFlag[];
};

function severityStyle(severity: ClientHealthFlag["severity"]) {
  switch (severity) {
    case "ok":
      return "border-emerald-200/60 bg-emerald-50/80 text-emerald-900";
    case "warn":
      return "border-amber-200/60 bg-amber-50/80 text-amber-950";
    default:
      return "border-red-200/60 bg-red-50/80 text-red-900";
  }
}

function severityIcon(severity: ClientHealthFlag["severity"]) {
  switch (severity) {
    case "ok":
      return HiFire;
    case "warn":
      return HiArrowTrendingDown;
    default:
      return HiExclamationTriangle;
  }
}

export function HealthIndicators({ flags }: Props) {
  return (
    <section>
      <h3 className="text-lg font-bold text-[#0d1f3c]">Saúde do cliente</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Sinais de engajamento, risco e evolução.
      </p>

      <ul className="mt-5 space-y-3">
        {flags.map((flag) => {
          const Icon = severityIcon(flag.severity);
          return (
            <li
              key={flag.id}
              className={`flex gap-4 rounded-xl border px-4 py-3.5 ${severityStyle(flag.severity)}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 opacity-80" aria-hidden />
              <div>
                <p className="font-semibold">{flag.label}</p>
                <p className="mt-0.5 text-sm opacity-90">{flag.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
