"use client";

import type { TrackMapSegment } from "@/lib/contracts/telemetry/sectors";
import { SECTION_LABEL, SECTOR_SECTION } from "./sectors-styles";

type Props = {
  segments: TrackMapSegment[];
  trackName: string;
};

const PERF_FILL: Record<string, string> = {
  gain: "#10b981",
  loss: "#ef4444",
  personal_best: "#8b5cf6",
  neutral: "#f59e0b",
};

export function SectorsTrackMap({ segments, trackName }: Props) {
  return (
    <article className={`${SECTOR_SECTION} flex flex-col`}>
      <p className={SECTION_LABEL}>Mapa da pista</p>
      <p className="mt-1 truncate text-sm font-semibold text-neutral-700">
        {trackName}
      </p>
      <div className="relative mt-4 flex min-h-[180px] flex-1 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc]">
        <svg
          viewBox="0 0 340 280"
          className="h-full max-h-[220px] w-full text-neutral-300"
          role="img"
          aria-label="Mapa simplificado da pista com setores S1, S2 e S3"
        >
          <ellipse
            cx="170"
            cy="140"
            rx="155"
            ry="125"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          {segments.map((seg) => (
            <path
              key={seg.id}
              d={seg.d}
              fill="none"
              stroke={PERF_FILL[seg.performance] ?? PERF_FILL.neutral}
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
          ))}
          {segments.map((seg, i) => {
            const labels = [
              { x: 90, y: 70 },
              { x: 250, y: 100 },
              { x: 170, y: 220 },
            ];
            const pos = labels[i] ?? { x: 170, y: 140 };
            return (
              <g key={`label-${seg.id}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="16"
                  className="fill-white"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  className="fill-[#0d1f3c] text-[11px] font-bold"
                  style={{ fontSize: 11 }}
                >
                  {seg.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="mt-3 flex flex-wrap gap-3 text-[11px] text-neutral-600">
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Ganho
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Perda
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          Melhor pessoal
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Neutro
        </li>
      </ul>
    </article>
  );
}
