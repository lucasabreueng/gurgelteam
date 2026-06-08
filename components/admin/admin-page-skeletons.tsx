import { adminCardClass, adminCardMutedClass } from "@/lib/design";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[var(--ds-bg-muted)] ${className}`}
      aria-hidden
    />
  );
}

export function AdminKpiStripSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div
      className="admin-page-grid grid grid-cols-2 gap-3 min-[900px]:grid-cols-5"
      aria-busy="true"
      aria-label="Carregando indicadores"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${adminCardClass} p-4 md:p-5`}>
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="mt-3 h-8 w-24" />
          <SkeletonBlock className="mt-2 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div
      className={`${adminCardClass} overflow-hidden`}
      aria-busy="true"
      aria-label="Carregando tabela"
    >
      <div className="border-b border-[var(--ds-border)] bg-[var(--ds-bg-muted)] px-4 py-3 md:px-5">
        <div className="flex gap-4">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="hidden h-3 w-28 md:block" />
        </div>
      </div>
      <div className="divide-y divide-[var(--ds-border-subtle)]">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 md:px-5">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="hidden h-4 w-20 md:block" />
            <SkeletonBlock className="ml-auto h-6 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminScheduleSkeleton() {
  return (
    <div className="flex flex-col gap-[var(--admin-gap)]" aria-busy="true" aria-label="Carregando agenda">
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }, (_, i) => (
          <SkeletonBlock key={i} className="h-16 min-w-[72px] flex-1" />
        ))}
      </div>
      <div className={`${adminCardClass} p-4 md:p-6`}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="mb-4 flex gap-4 last:mb-0">
            <SkeletonBlock className="h-4 w-12 shrink-0" />
            <SkeletonBlock className="h-14 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSplitPanelSkeleton() {
  return (
    <div
      className="admin-page-grid grid min-h-[min(70vh,720px)] items-stretch lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]"
      aria-busy="true"
      aria-label="Carregando sessões"
    >
      <div className={`${adminCardClass} p-4`}>
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonBlock key={i} className="mb-3 h-16 w-full last:mb-0" />
        ))}
      </div>
      <div className={`hidden ${adminCardMutedClass} lg:block`}>
        <SkeletonBlock className="h-6 w-48" />
        <SkeletonBlock className="mt-4 h-40 w-full" />
        <SkeletonBlock className="mt-4 h-24 w-full" />
      </div>
    </div>
  );
}

export function AdminTabPanelSkeleton() {
  return (
    <div
      className={`${adminCardClass} p-6 md:p-8`}
      aria-busy="true"
      aria-label="Carregando painel"
    >
      <SkeletonBlock className="h-6 w-40" />
      <SkeletonBlock className="mt-6 h-48 w-full" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonBlock key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

export function AdminInventoryOverviewSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando estoque">
      <AdminKpiStripSkeleton count={6} />
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-64 w-full rounded-2xl" />
        <SkeletonBlock className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-[var(--admin-gap)]" aria-busy="true" aria-label="Carregando dashboard">
      <AdminKpiStripSkeleton count={4} />
      <div className="admin-page-grid grid items-stretch lg:grid-cols-2">
        <SkeletonBlock className="min-h-[320px] w-full rounded-2xl" />
        <SkeletonBlock className="min-h-[320px] w-full rounded-2xl" />
      </div>
      <SkeletonBlock className="h-48 w-full rounded-2xl" />
    </div>
  );
}

export function AdminMaintenancePageSkeleton() {
  return (
    <div className="admin-page-stack pb-10 lg:pb-12" aria-busy="true" aria-label="Carregando manutenção">
      <AdminKpiStripSkeleton count={4} />
      <AdminTableSkeleton rows={6} />
    </div>
  );
}

export function AdminSettingsPanelSkeleton() {
  return (
    <div className="admin-settings-layout admin-page-stack lg:flex-row lg:items-start">
      <aside className="min-w-0 lg:w-[240px] lg:shrink-0">
        <div className="flex gap-2 overflow-hidden lg:flex-col">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonBlock key={i} className="h-10 w-28 shrink-0 rounded-xl lg:w-full" />
          ))}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <AdminTabPanelSkeleton />
      </div>
    </div>
  );
}
