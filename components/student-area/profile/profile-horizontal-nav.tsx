"use client";

import type { ProfileNavSection } from "@/lib/contracts/student/profile";

type Props = {
  sections: ProfileNavSection[];
  activeSectionId: string;
  onSelect: (sectionId: string) => void;
};

const TAB_LIST_CLASS =
  "-mb-px app-scrollbar-hidden flex min-w-0 touch-pan-x select-none gap-0 overflow-x-auto overscroll-x-contain scroll-smooth";

const TAB_BUTTON_CLASS =
  "relative shrink-0 select-none whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-semibold tracking-tight transition-colors sm:px-5";

export function ProfileHorizontalNav({
  sections,
  activeSectionId,
  onSelect,
}: Props) {
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Seções do perfil"
      className="shrink-0 rounded-t-2xl border-b border-[rgba(17,17,17,0.08)] bg-white px-1"
    >
      <div role="tablist" className={TAB_LIST_CLASS}>
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`profile-panel-${section.id}`}
              id={`profile-tab-${section.id}`}
              onClick={() => onSelect(section.id)}
              className={`${TAB_BUTTON_CLASS} ${
                isActive
                  ? "-mb-px border-[#0d1f3c] text-[#0d1f3c]"
                  : "border-transparent text-neutral-500 hover:border-[rgba(13,31,60,0.2)] hover:text-[#0d1f3c]"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
