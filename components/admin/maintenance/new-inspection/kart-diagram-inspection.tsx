"use client";

import { useInspectionTemplate } from "@/lib/query/hooks/use-inspection-template";

import type {
  DiagramZoneKey,
  InspectionDiagramMark,
} from "@/lib/contracts/maintenance";

import { useState } from "react";


const VIEWS: { key: DiagramZoneKey; label: string }[] = [
  { key: "frente", label: "Frente" },
  { key: "lat_esq", label: "Lat. ESQ" },
  { key: "lat_dir", label: "Lat. DIR" },
  { key: "traseira", label: "Traseira" },
  { key: "motor", label: "Motor" },
  { key: "pneus", label: "Pneus" },
  { key: "freios", label: "Freios" },
];

const PROBLEM_SUGGESTIONS: Record<DiagramZoneKey, string[]> = {
  frente: ["Volante com folga", "Pedal desalinhado"],
  lat_esq: ["Trinca lateral", "Carenagem solta"],
  lat_dir: ["Vazamento lateral", "Motor aquecido"],
  traseira: ["Vazamento traseiro", "Eixo com ruído"],
  motor: ["Vazamento carburador", "Escape solto"],
  pneus: ["Desgaste pneu dianteiro", "Pressão irregular"],
  freios: ["Disco riscado", "Fluido baixo"],
};

export function KartDiagramInspection() {
  const { data: template, isLoading } = useInspectionTemplate();
  const [view, setView] = useState<DiagramZoneKey>("lat_esq");
  const [marks, setMarks] = useState<InspectionDiagramMark[]>([]);
  const [pendingZone, setPendingZone] = useState<string | null>(null);

  const addMark = (label: string) => {
    if (!pendingZone) return;
    setMarks((m) => [
      ...m,
      {
        id: `${view}-${pendingZone}-${Date.now()}`,
        view,
        zone: pendingZone,
        label,
      },
    ]);
    setPendingZone(null);
  };

  const zones = template?.diagramZones[view] ?? [];

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Vista esquemática</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Toque na área e registre o problema
      </p>
      {isLoading ? (
        <div className="mt-4 h-48 animate-pulse rounded-2xl bg-[#fafbfc]" />
      ) : (
        <>
      <div className="mt-3 flex flex-wrap gap-1 rounded-lg bg-[#fafbfc] p-1">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => {
              setView(v.key);
              setPendingZone(null);
            }}
            className={`rounded-md px-2 py-2 text-[9px] font-bold uppercase tracking-wide transition ${
              view === v.key
                ? "bg-[#0d1f3c] text-white"
                : "text-neutral-600 hover:text-[#0d1f3c]"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="relative mx-auto mt-4 aspect-[2/1] max-w-lg rounded-2xl bg-gradient-to-b from-[#fafbfc] to-[#e8ecf2] ring-1 ring-[rgba(17,17,17,0.08)]">
        <div className="absolute inset-4 flex items-center justify-center">
          <div
            className="h-14 w-36 rounded-lg border-2 border-[#0d1f3c]/25 bg-[#0d1f3c]/8"
            aria-hidden
          />
        </div>
        <ul className="absolute inset-0 grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
          {zones.map((zone) => {
            const marked = marks.some(
              (m) => m.view === view && m.zone === zone
            );
            return (
              <li key={zone}>
                <button
                  type="button"
                  onClick={() => setPendingZone(zone)}
                  className={`flex min-h-[40px] w-full items-center justify-center rounded-lg border-2 px-1 text-center text-[9px] font-bold uppercase transition ${
                    marked || pendingZone === zone
                      ? "border-red-400 bg-red-50 text-red-800"
                      : "border-transparent bg-white/70 text-neutral-600 hover:border-accent/30"
                  }`}
                >
                  {zone}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {pendingZone ? (
        <div className="mt-4 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200/60">
          <p className="text-xs font-bold text-amber-900">
            Marcar em: {pendingZone}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PROBLEM_SUGGESTIONS[view].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addMark(s)}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#0d1f3c] ring-1 ring-amber-200/80 hover:bg-amber-100"
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPendingZone(null)}
              className="text-xs font-bold text-neutral-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
      {marks.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {marks.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-800"
            >
              <span>
                {m.label} — {m.zone}
              </span>
              <button
                type="button"
                onClick={() =>
                  setMarks((list) => list.filter((x) => x.id !== m.id))
                }
                className="text-[10px] font-bold uppercase text-red-600"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      ) : null}
        </>
      )}
    </section>
  );
}
