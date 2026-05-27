"use client";

import dynamic from "next/dynamic";

const Testimonials = dynamic(
  () =>
    import("@/sections/Testimonials").then((m) => ({ default: m.Testimonials })),
  { ssr: false },
);

export function ClientTestimonials() {
  return <Testimonials />;
}
