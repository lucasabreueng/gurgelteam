import type { ChecklistKartContext } from "@/lib/contracts/maintenance";
import Image from "next/image";

type Props = {
  kart: ChecklistKartContext & { ownerName?: string; lastMaintenance?: string };
};

export function KartTechnicalHero({ kart }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-gradient-to-br from-[#0d1f3c] via-[#152a47] to-[#0d1f3c] text-white shadow-[0_12px_40px_rgba(13,31,60,0.2)]">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-48 shrink-0 lg:h-auto lg:w-72">
          <Image
            src={kart.photo}
            alt={`Kart ${kart.kartNumber}`}
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 1024px) 100vw, 288px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f3c] via-transparent to-transparent lg:bg-gradient-to-r" />
          <span className="absolute bottom-4 left-4 rounded-xl bg-white/10 px-4 py-2 text-3xl font-black tabular-nums backdrop-blur-sm ring-1 ring-white/20">
            #{kart.kartNumber}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center p-5 md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            Centro técnico · Paddock
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
            Kart {kart.kartNumber}
          </h2>
          <p className="mt-1 text-sm text-white/70">{kart.categoryName}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Proprietário", value: kart.ownerName ?? "Frota" },
              { label: "Horas motor", value: `${kart.engineHours}h` },
              { label: "Status", value: kart.kartStatus },
              {
                label: "Confiabilidade",
                value: String(kart.reliabilityScore),
              },
              { label: "Últ. manutenção", value: kart.lastMaintenance ?? "—" },
              { label: "Últ. inspeção", value: kart.lastChecklist },
            ].map((cell) => (
              <div
                key={cell.label}
                className="rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10"
              >
                <dt className="text-[9px] font-bold uppercase tracking-wide text-white/45">
                  {cell.label}
                </dt>
                <dd className="mt-0.5 text-sm font-bold tabular-nums">
                  {cell.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
