"use client";

import dynamic from "next/dynamic";

const Hero = dynamic(
  () => import("@/sections/Hero").then((m) => ({ default: m.Hero })),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto mb-5 min-h-[420px] max-w-[1800px] animate-pulse rounded-card bg-secondary px-4 sm:px-5"
        aria-hidden
      />
    ),
  },
);

export function ClientHero() {
  return <Hero />;
}
