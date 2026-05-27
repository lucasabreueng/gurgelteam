import type { MaintenanceKartOption } from "@/lib/contracts/maintenance";
import Image from "next/image";

type Props = { kart: MaintenanceKartOption };

export function KartTechnicalCard({ kart }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-gradient-to-br from-[#0d1f3c] to-[#1a3a5c] text-white shadow-md">
      <div className="flex gap-4 p-4">
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl ring-2 ring-white/15">
          <Image
            src={kart.photo}
            alt={`Kart ${kart.number}`}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            Kart selecionado
          </p>
          <p className="text-2xl font-black tabular-nums">#{kart.number}</p>
          <p className="text-sm text-white/80">{kart.categoryName}</p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-white/45">Status</dt>
              <dd className="font-bold">{kart.statusLabel}</dd>
            </div>
            <div>
              <dt className="text-white/45">Motor</dt>
              <dd className="font-bold tabular-nums">{kart.engineHours}h</dd>
            </div>
            <div>
              <dt className="text-white/45">Últ. manutenção</dt>
              <dd className="font-semibold">{kart.lastMaintenance}</dd>
            </div>
            <div>
              <dt className="text-white/45">Confiabilidade</dt>
              <dd className="font-bold tabular-nums">{kart.reliabilityScore}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-2 text-xs text-white/70">
        {kart.ownerName}
      </div>
    </div>
  );
}
