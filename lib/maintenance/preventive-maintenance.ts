/** Intervalos de manutenção preventiva por horas de motor. */

export const PREVENTIVE_MAINTENANCE_TASKS = [
  { key: "oleo", label: "Troca de óleo", intervalHours: 5 },
  { key: "corrente", label: "Troca de corrente", intervalHours: 20 },
  { key: "coroa_pinhao", label: "Troca de coroa/pinhão", intervalHours: 30 },
  {
    key: "revisao_motor",
    label: "Revisão completa do motor",
    intervalHours: 50,
  },
  { key: "rolamentos", label: "Troca de rolamentos", intervalHours: 40 },
  {
    key: "cabo_acelerador",
    label: "Troca de cabo do acelerador",
    intervalHours: 20,
  },
] as const;

export type PreventiveMaintenanceTaskKey =
  (typeof PREVENTIVE_MAINTENANCE_TASKS)[number]["key"];

export type PreventiveMaintenanceHoursState = Partial<
  Record<PreventiveMaintenanceTaskKey, number>
>;

export type PreventiveMaintenanceTaskSummary = {
  key: PreventiveMaintenanceTaskKey;
  label: string;
  intervalHours: number;
  currentHours: number;
  lastDoneHours: number;
  nextDueHours: number;
  hoursRemaining: number;
  overdue: boolean;
  displayLabel: string;
};

export type PreventiveMaintenanceSummary = {
  currentHours: number;
  mostUrgent: PreventiveMaintenanceTaskSummary;
  tasks: PreventiveMaintenanceTaskSummary[];
};

function formatHours(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export function defaultLastDoneHours(
  currentHours: number,
  intervalHours: number,
): number {
  if (currentHours <= 0) return 0;
  const cycles = Math.floor(currentHours / intervalHours);
  return Math.max(0, cycles * intervalHours);
}

export function computePreventiveTaskSummary(
  task: (typeof PREVENTIVE_MAINTENANCE_TASKS)[number],
  currentHours: number,
  lastDoneHours: number,
): PreventiveMaintenanceTaskSummary {
  const nextDueHours = lastDoneHours + task.intervalHours;
  const hoursRemaining = nextDueHours - currentHours;
  const overdue = hoursRemaining < 0;

  let displayLabel: string;
  if (overdue) {
    displayLabel = `${task.label} — atrasada (${formatHours(Math.abs(hoursRemaining))}h)`;
  } else if (hoursRemaining <= 0.5) {
    displayLabel = `${task.label} — vence agora`;
  } else {
    displayLabel = `${task.label} — em ${formatHours(nextDueHours)}h (${formatHours(hoursRemaining)}h restantes)`;
  }

  return {
    key: task.key,
    label: task.label,
    intervalHours: task.intervalHours,
    currentHours,
    lastDoneHours,
    nextDueHours,
    hoursRemaining,
    overdue,
    displayLabel,
  };
}

export function buildPreventiveMaintenanceSummary(
  currentHours: number,
  storedHours: PreventiveMaintenanceHoursState | null | undefined,
): PreventiveMaintenanceSummary {
  const tasks = PREVENTIVE_MAINTENANCE_TASKS.map((task) => {
    const lastDoneHours =
      storedHours?.[task.key] ??
      defaultLastDoneHours(currentHours, task.intervalHours);
    return computePreventiveTaskSummary(task, currentHours, lastDoneHours);
  });

  const mostUrgent = [...tasks].sort(
    (a, b) => a.hoursRemaining - b.hoursRemaining,
  )[0]!;

  return { currentHours, mostUrgent, tasks };
}
