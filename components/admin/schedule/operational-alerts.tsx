import { ConflictAlerts } from "./conflict-alerts";
import { IntelligentInsights } from "./intelligent-insights";
import type { ScheduleConflict, ScheduleInsight } from "@/lib/contracts/schedule";

type Props = {
  conflicts: ScheduleConflict[];
  insights: ScheduleInsight[];
};

export function OperationalAlerts({ conflicts, insights }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ConflictAlerts conflicts={conflicts} />
      <IntelligentInsights insights={insights} />
    </div>
  );
}
