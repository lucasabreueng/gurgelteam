"use client";

import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HiChevronRight } from "react-icons/hi2";
import type { TeamMemberListItem } from "@/lib/contracts/team";
import {
  adminEmptyStateClass,
  adminMobileListCardClass,
  adminTextAccentBoldClass,
} from "@/lib/design";
import { TeamRoleBadge, TeamStatusBadge } from "./team-badges";

const MOBILE_BATCH_SIZE = 12;

type Props = {
  members: TeamMemberListItem[];
  onView: (id: string) => void;
};

export function TeamMobileList({ members, onView }: Props) {
  const [visible, setVisible] = useState(MOBILE_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(MOBILE_BATCH_SIZE);
  }, [members]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visible >= members.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => Math.min(v + MOBILE_BATCH_SIZE, members.length));
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [members.length, visible]);

  if (members.length === 0) {
    return (
      <p className={`lg:hidden ${adminEmptyStateClass}`}>
        Nenhum membro encontrado com os filtros atuais.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3 lg:hidden">
      {members.slice(0, visible).map((member) => (
        <li key={member.id}>
          <button
            type="button"
            onClick={() => onView(member.id)}
            className={`grid w-full grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-x-3 ${adminMobileListCardClass}`}
          >
            <UserAvatar
              src={member.avatar}
              name={member.name}
              size={48}
              roundedClass="rounded-2xl"
            />
            <div className="min-w-0 text-left">
              <p className={`truncate text-[13px] ${adminTextAccentBoldClass}`}>
                {member.name}
              </p>
              <p className="truncate text-[11px] text-neutral-500">
                {member.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <TeamRoleBadge label={member.roleLabel} />
                <TeamStatusBadge active={member.active} />
              </div>
            </div>
            <HiChevronRight className="h-5 w-5 shrink-0 text-neutral-400" aria-hidden />
          </button>
        </li>
      ))}
      <div ref={sentinelRef} className="h-1" aria-hidden />
    </ul>
  );
}
