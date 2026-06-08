function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-200/80 ${className}`}
      aria-hidden
    />
  );
}

export function StudentDashboardSkeleton() {
  return (
    <div
      className="flex flex-col gap-[var(--admin-gap)]"
      aria-busy="true"
      aria-label="Carregando dashboard do piloto"
    >
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 md:p-8">
        <SkeletonBlock className="h-7 w-40" />
        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonBlock key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <SkeletonBlock className="h-56 w-full rounded-xl" />
          <SkeletonBlock className="h-56 w-full rounded-xl" />
        </div>
      </div>
      <div className="grid gap-[var(--admin-gap)] lg:grid-cols-2">
        <SkeletonBlock className="min-h-[280px] w-full rounded-2xl" />
        <SkeletonBlock className="min-h-[280px] w-full rounded-2xl" />
      </div>
      <div className="grid gap-[var(--admin-gap)] lg:grid-cols-2">
        <SkeletonBlock className="min-h-[320px] w-full rounded-2xl" />
        <SkeletonBlock className="min-h-[320px] w-full rounded-2xl" />
      </div>
      <SkeletonBlock className="h-40 w-full rounded-2xl" />
    </div>
  );
}

export function StudentCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm ${className}`}
      aria-busy="true"
      aria-label="Carregando"
    >
      <SkeletonBlock className="h-5 w-32" />
      <SkeletonBlock className="mt-4 h-24 w-full" />
    </div>
  );
}
