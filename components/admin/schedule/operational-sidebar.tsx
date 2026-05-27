"use client";

import Image from "next/image";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";
import { AvailableKartsPanel } from "./available-karts-panel";
import { OperationalAlertsSidebar } from "./operational-alerts-sidebar";
import { CompactMonthNavigator } from "./compact-month-navigator";

type Props = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  className?: string;
};

export function OperationalSidebar({
  selectedDate,
  onSelectDate,
  className = "",
}: Props) {
  const { data: meta } = useScheduleMeta();
  const instructor = NewClassServiceMock.getInstructor();
  return (
    <aside className={`space-y-4 ${className}`}>
      <CompactMonthNavigator
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />
      <section className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-gradient-to-br from-[#0d1f3c] to-[#1a3a5c] p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl ring-2 ring-white/20">
            <Image
              src={instructor.avatar}
              alt={instructor.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-white/50">
              Instrutor
            </p>
            <p className="text-lg font-black">{instructor.name}</p>
            <p className="text-[10px] text-white/70">
              {instructor.dayOccupancy}% ocupação hoje
            </p>
          </div>
        </div>
      </section>
      <AvailableKartsPanel karts={meta?.availableKartsNow ?? []} />
      <OperationalAlertsSidebar
        alerts={meta?.operationalSidebarAlerts ?? []}
      />
    </aside>
  );
}
