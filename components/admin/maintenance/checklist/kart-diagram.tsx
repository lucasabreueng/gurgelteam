"use client";

import type { DiagramMark } from "@/lib/contracts/maintenance";

import { useState } from "react";

type DiagramViewKey = "frente" | "lateral" | "traseira";

type Props = {
  views: readonly { key: DiagramViewKey; label: string }[];
  zones: Record<DiagramViewKey, readonly string[]>;
  loading?: boolean;
};

export function KartDiagram({ views, zones, loading = false }: Props) {
  const [view, setView] = useState<DiagramViewKey>("lateral");
  const [marks, setMarks] = useState<DiagramMark[]>([]);

  const toggleZone = (zone: string) => {
    const exists = marks.some((m) => m.view === view && m.zone === zone);
    if (exists) {
      setMarks((m) => m.filter((x) => !(x.view === view && x.zone === zone)));
    } else {
      setMarks((m) => [...m, { view, zone }]);
    }
  };

  const isMarked = (zone: string) =>
    marks.some((m) => m.view === view && m.zone === zone);

  const activeViews = views.length > 0 ? views : [];
  const activeZones = zones[view] ?? [];

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Vista esquemática</h3>
      <p className="mt-1 text-xs text-neutral-500">
        Toque nas zonas para marcar problemas
      </p>
      {loading ? (
        <div className="mt-4 h-40 animate-pulse rounded-2xl bg-[#fafbfc]" />
      ) : (
        <>
      <div className="mt-3 flex gap-1 rounded-lg bg-[#fafbfc] p-1">
        {activeViews.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            className={`flex-1 rounded-md py-2 text-[10px] font-bold uppercase tracking-wide transition ${
              view === v.key
                ? "bg-[#0d1f3c] text-white"
                : "text-neutral-600 hover:text-[#0d1f3c]"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="relative mx-auto mt-4 aspect-[2/1] max-w-md rounded-2xl bg-gradient-to-b from-[#fafbfc] to-[#e8ecf2] ring-1 ring-[rgba(17,17,17,0.08)]">
        <div className="absolute inset-4 flex items-center justify-center">
          <div
            className={`h-16 w-32 rounded-lg border-2 border-[#0d1f3c]/30 bg-[#0d1f3c]/10 ${
              view === "lateral" ? "w-40" : view === "frente" ? "w-24" : "w-36"
            }`}
            aria-hidden
          />
        </div>
        <ul className="absolute inset-0 grid grid-cols-2 gap-2 p-3">
          {activeZones.map((zone) => (
            <li key={zone}>
              <button
                type="button"
                onClick={() => toggleZone(zone)}
                className={`flex h-full min-h-[44px] w-full items-center justify-center rounded-lg border-2 text-[10px] font-bold uppercase transition ${
                  isMarked(zone)
                    ? "border-red-400 bg-red-50 text-red-800"
                    : "border-transparent bg-white/60 text-neutral-600 hover:border-accent/30"
                }`}
              >
                {zone}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {marks.length > 0 ? (
        <p className="mt-3 text-xs font-semibold text-red-700">
          {marks.length} marcação(ões) registrada(s)
        </p>
      ) : null}
        </>
      )}
    </section>
  );
}
