"use client";

import dynamic from "next/dynamic";

const Partners = dynamic(
  () => import("@/sections/Partners").then((m) => ({ default: m.Partners })),
  { ssr: false },
);

export function ClientPartners() {
  return <Partners />;
}
