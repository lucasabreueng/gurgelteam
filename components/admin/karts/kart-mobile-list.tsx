"use client";

import { useEffect, useRef, useState } from "react";
import type { FleetKartListItem } from "@/lib/contracts/karts";
import { KartMobileCard } from "./kart-mobile-card";

const MOBILE_BATCH_SIZE = 12;

type Props = {
  karts: FleetKartListItem[];
  onViewDetails: (id: string) => void;
};

export function KartMobileList({ karts, onViewDetails }: Props) {
  const [visibleCount, setVisibleCount] = useState(MOBILE_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(MOBILE_BATCH_SIZE);
  }, [karts]);

  const visibleKarts = karts.slice(0, visibleCount);
  const hasMore = visibleCount < karts.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + MOBILE_BATCH_SIZE, karts.length));
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [karts.length, hasMore]);

  return (
    <div className="lg:hidden">
      {karts.length === 0 ? (
        <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
          Nenhum kart encontrado com os filtros atuais.
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {visibleKarts.map((kart) => (
              <li key={kart.id}>
                <KartMobileCard kart={kart} onViewDetails={onViewDetails} />
              </li>
            ))}
          </ul>
          {hasMore ? (
            <div
              ref={sentinelRef}
              className="py-4 text-center text-[11px] font-medium text-neutral-500"
              aria-hidden
            >
              Carregando mais…
            </div>
          ) : visibleKarts.length > MOBILE_BATCH_SIZE ? (
            <p className="py-4 text-center text-[11px] font-medium text-neutral-400">
              {karts.length} kart{karts.length === 1 ? "" : "s"} exibidos
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
