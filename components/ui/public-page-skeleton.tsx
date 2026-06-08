function Block({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-200/80 ${className}`}
      aria-hidden
    />
  );
}

export function PublicPageSkeleton() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-secondary px-4 py-8"
      role="status"
      aria-label="Carregando página"
    >
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Block className="h-9 w-36" />
          <Block className="h-10 w-32" />
        </div>
        <div className="rounded-2xl border border-divider bg-background p-6 shadow-sm">
          <Block className="h-7 w-48" />
          <Block className="mt-6 h-11 w-full" />
          <Block className="mt-4 h-11 w-full" />
          <Block className="mt-6 h-12 w-full rounded-xl" />
        </div>
        <Block className="mt-6 h-24 w-full rounded-2xl" />
      </div>
    </div>
  );
}
