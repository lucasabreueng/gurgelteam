"use client";

type Props = {
  title: string;
  description?: string;
  onViewMore?: () => void;
  showViewMore?: boolean;
};

export function ProfileSectionHeader({
  title,
  description,
  onViewMore,
  showViewMore = false,
}: Props) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-[#0d1f3c]">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-neutral-600">{description}</p>
        ) : null}
      </div>
      {showViewMore && onViewMore ? (
        <button
          type="button"
          onClick={onViewMore}
          className="shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-wider text-accent transition hover:text-[#0d1f3c]"
        >
          Ver mais
        </button>
      ) : null}
    </div>
  );
}
