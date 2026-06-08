"use client";

import Image from "next/image";
import Link from "next/link";
import { usePilotHome } from "@/lib/query/hooks/use-pilot-home";

export function StudentHero() {
  const { data: home, isLoading } = usePilotHome();
  const profile = home?.profile;
  const nextClass = home?.nextClass;
  const heroLevel = home?.heroLevel;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] shadow-[0_8px_32px_rgba(13,31,60,0.08)] md:rounded-3xl">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-image.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/70" />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[min(42%,220px)] bg-gradient-to-r from-black/85 via-black/50 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[min(42%,220px)] bg-gradient-to-l from-black/85 via-black/50 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative p-6 lg:p-10">
        <span className="inline-block rounded-md border border-[#0d2847] bg-[#0d1f3c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-black/40">
          {isLoading ? "…" : profile?.tag}
        </span>
        <p className="mt-6 text-xl font-semibold tracking-tight text-white md:text-[32px]">
          Bem-vindo de volta,{" "}
          <span className="text-[#0E1A35]">
            {isLoading ? "…" : profile?.firstName}
          </span>
        </p>
        <p className="mt-2 text-[14px] text-white/74">
          Piloto desde {isLoading ? "…" : profile?.pilotSinceYear}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/88">
                Próxima aula
              </p>
              <Link
                href="#section-agenda"
                className="inline-flex shrink-0 items-center justify-center rounded-xl border-2 border-white/60 bg-transparent px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#0d1f3c]"
              >
                Ver agenda completa
              </Link>
            </div>
            <p className="mt-3 text-lg font-semibold tracking-tight">
              {isLoading ? "…" : nextClass?.dateLabel}
            </p>
            <p className="text-sm text-white/88">
              {isLoading ? "…" : nextClass?.timeRange}
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-md">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/75">
              Nível do piloto
            </p>
            <p className="mt-2 text-xl font-bold text-white">
              {isLoading ? "…" : heroLevel?.title}
            </p>
            <div className="mt-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#c41e3a]"
                  style={{
                    width: `${heroLevel?.progressPercent ?? 0}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-white/65">
                {heroLevel?.progressPercent ?? 0}% do plano atual
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
