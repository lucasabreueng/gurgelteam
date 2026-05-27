"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import type { ChecklistGroup, ChecklistItemStatus } from "@/lib/contracts/maintenance";

const statusClass: Record<ChecklistItemStatus, string> = {
  ok: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  warn: "bg-amber-50 text-amber-900 ring-amber-200/60",
  fail: "bg-red-50 text-red-800 ring-red-200/60",
};

const statusLabel: Record<ChecklistItemStatus, string> = {
  ok: "Aprovado",
  warn: "Atenção",
  fail: "Reprovar",
};

function groupSummary(group: ChecklistGroup) {
  const fails = group.items.filter((i) => i.status === "fail").length;
  const warns = group.items.filter((i) => i.status === "warn").length;
  if (fails > 0) return { label: `${fails} reprov.`, className: "bg-red-100 text-red-800" };
  if (warns > 0) return { label: `${warns} atenção`, className: "bg-amber-100 text-amber-900" };
  return {
    label: "OK",
    className: "bg-emerald-100 text-emerald-800",
  };
}

type Props = {
  groups: ChecklistGroup[];
};

export function TechnicalChecklistAccordion({ groups }: Props) {
  const [openId, setOpenId] = useState<string | null>(groups[0]?.title ?? null);

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const open = openId === group.title;
        const summary = groupSummary(group);

        return (
          <div
            key={group.title}
            className="overflow-hidden rounded-xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() =>
                setOpenId((id) => (id === group.title ? null : group.title))
              }
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[#fafbfc]"
              aria-expanded={open}
            >
              <span className="text-sm font-bold text-[#0d1f3c]">
                {group.title}
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${summary.className}`}
                >
                  {summary.label}
                </span>
                <HiChevronDown
                  className={`h-5 w-5 text-neutral-500 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2 border-t border-[rgba(17,17,17,0.06)] bg-[#fafbfc]/60 px-3 py-3">
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold ring-1 ${statusClass[item.status]}`}
                    >
                      {item.label}
                      <span className="text-[10px] uppercase">
                        {statusLabel[item.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
