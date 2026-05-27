"use client";

type Props = {
  className?: string;
};

export function SectorsPageSkeleton({ className = "" }: Props) {
  return (
    <div
      className={`animate-pulse space-y-4 p-4 md:p-6 ${className}`}
      aria-busy="true"
      aria-label="Carregando setores"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-neutral-200/70" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-52 rounded-2xl bg-neutral-200/70" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-neutral-200/70" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-neutral-200/70" />
    </div>
  );
}
