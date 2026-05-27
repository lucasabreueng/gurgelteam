"use client";

import dynamic from "next/dynamic";

const KartReserva = dynamic(
  () =>
    import("@/sections/KartReserva").then((m) => ({ default: m.KartReserva })),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto min-h-[320px] max-w-6xl animate-pulse rounded-card bg-secondary px-4 py-24"
        aria-hidden
      />
    ),
  },
);

export function ClientKartReserva() {
  return <KartReserva />;
}
