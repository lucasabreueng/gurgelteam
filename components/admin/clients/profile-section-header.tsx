"use client";

import {
  adminLinkActionClass,
  adminBodyClass,
  adminSubsectionTitleClass,
} from "@/lib/design";

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
        <h3 className={adminSubsectionTitleClass}>{title}</h3>
        {description ? (
          <p className={`mt-1 ${adminBodyClass}`}>{description}</p>
        ) : null}
      </div>
      {showViewMore && onViewMore ? (
        <button
          type="button"
          onClick={onViewMore}
          className={adminLinkActionClass}
        >
          Ver mais
        </button>
      ) : null}
    </div>
  );
}
