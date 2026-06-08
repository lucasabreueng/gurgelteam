function Block({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-200/70 ${className}`}
      aria-hidden
    />
  );
}

export function StudentProfileSkeleton() {
  return (
    <div className="admin-page-stack flex min-h-0 flex-1 flex-col" role="status" aria-label="Carregando perfil">
      <Block className="h-28 w-full rounded-2xl" />
      <div
        className="admin-page-grid grid min-h-0 flex-1 xl:grid-cols-[320px_minmax(0,1fr)_320px] xl:items-stretch"
        style={{ height: "calc(100dvh - var(--admin-chrome-h, 140px))" }}
      >
        <Block className="h-full w-full rounded-2xl" />
        <Block className="h-full w-full rounded-2xl" />
        <Block className="h-full w-full rounded-2xl" />
      </div>
    </div>
  );
}
