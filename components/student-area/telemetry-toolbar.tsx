"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

type Props = {
  onOpenLoad?: () => void;
  onOpenSessions?: () => void;
  onOpenTracks?: () => void;
};

const TELEMETRY_BASE = "/piloto/telemetria";

export function TelemetryToolbar({ onOpenLoad, onOpenSessions, onOpenTracks }: Props) {
  const pathname = usePathname();
  const onSetoresPage = pathname.startsWith(`${TELEMETRY_BASE}/setores`);
  const onComparePage =
    pathname === TELEMETRY_BASE || pathname === `${TELEMETRY_BASE}/`;

  const isLightPage = onSetoresPage || onComparePage;

  const btnBase =
    "rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition";
  const btnIdle = isLightPage
    ? "border border-[rgba(17,17,17,0.12)] bg-white text-neutral-700 hover:border-accent/30 hover:bg-neutral-50"
    : "bg-white/10 text-white/90 hover:bg-white/15";
  const btnActive = isLightPage
    ? "bg-[#0d1f3c] text-white shadow-sm"
    : "bg-white text-[#0d1f3c] shadow-sm";
  const iconBtnBase =
    "ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition";

  return (
    <div
      className={
        isLightPage
          ? "relative shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white"
          : "relative shrink-0 border-b border-[rgba(255,255,255,0.08)] bg-[#0d1f3c]"
      }
    >
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 md:px-4">
        <button
          type="button"
          onClick={onOpenLoad}
          className={`${btnBase} ${btnIdle}`}
        >
          Carregar
        </button>
        <button
          type="button"
          onClick={onOpenSessions}
          className={`${btnBase} ${btnIdle}`}
        >
          Sessões
        </button>
        <Link
          href={TELEMETRY_BASE}
          className={`${btnBase} ${onComparePage ? btnActive : btnIdle}`}
        >
          Telemetrias
        </Link>
        <Link
          href={`${TELEMETRY_BASE}/setores`}
          className={`${btnBase} ${onSetoresPage ? btnActive : btnIdle}`}
        >
          Setores
        </Link>
        <button
          type="button"
          onClick={onOpenTracks}
          className={`${iconBtnBase} ${btnIdle}`}
          aria-label="Configurar pistas"
          title="Configurar pistas"
        >
          <HiOutlineCog6Tooth className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </div>
    </div>
  );
}
