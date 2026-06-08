type StudentCardEmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export function StudentCardEmptyState({
  title,
  description,
  className = "",
}: StudentCardEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-10 text-center ${className}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Nenhum registro
      </p>
      <p className="mt-2 text-sm font-bold text-[#0d1f3c]">{title}</p>
      <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-neutral-600">
        {description}
      </p>
    </div>
  );
}
