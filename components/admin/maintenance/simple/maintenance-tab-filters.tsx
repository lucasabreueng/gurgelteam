import type {
  ChecklistListFilterState,
  CompleteChecklistType,
  InspectionListFilterState,
  MaintenanceListFilterState,
} from "@/lib/contracts/maintenance/complete-checklist";
import { COMPLETE_CHECKLIST_TYPE_LABELS } from "@/lib/contracts/maintenance/complete-checklist";
import { CHECKLIST_FINAL_STATUS_LABELS } from "@/lib/contracts/maintenance/complete-checklist";
import { MAINTENANCE_FILTER_PERIODS } from "@/lib/admin-maintenance-simple-mocks";
import { FilterBox, filtersActive } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../../settings/settings-dropdown";

type KartOption = { value: string; label: string };

type LayoutProps = {
  layout: "inline" | "stacked";
  karts: KartOption[];
};

export function InspectionListFilters({
  layout,
  karts,
  filters,
  onChange,
  onClear,
}: LayoutProps & {
  filters: InspectionListFilterState;
  onChange: (patch: Partial<InspectionListFilterState>) => void;
  onClear: () => void;
}) {
  const isStacked = layout === "stacked";
  const cell = isStacked ? "w-full" : "min-w-0";
  const grid = isStacked
    ? "flex flex-col gap-3"
    : "admin-page-grid grid min-w-0 flex-1 grid-cols-2 sm:grid-cols-3";

  const active = filtersActive([filters.kartId, filters.period, filters.attention]);

  return (
    <FilterBox active={active} onClear={onClear}>
      <div className={grid}>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Kart"
            options={karts}
            value={filters.kartId}
            onSelect={(v) => onChange({ kartId: v })}
          />
        </div>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Período"
            options={[...MAINTENANCE_FILTER_PERIODS]}
            value={filters.period}
            onSelect={(v) =>
              onChange({ period: v as InspectionListFilterState["period"] })
            }
          />
        </div>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Atenção"
            options={[
              { value: "", label: "Qualquer resultado" },
              { value: "yes", label: "Com atenção" },
              { value: "no", label: "Sem atenção" },
            ]}
            value={filters.attention}
            onSelect={(v) =>
              onChange({ attention: v as InspectionListFilterState["attention"] })
            }
          />
        </div>
      </div>
    </FilterBox>
  );
}

export function MaintenanceListFilters({
  layout,
  karts,
  filters,
  onChange,
  onClear,
}: LayoutProps & {
  filters: MaintenanceListFilterState;
  onChange: (patch: Partial<MaintenanceListFilterState>) => void;
  onClear: () => void;
}) {
  const isStacked = layout === "stacked";
  const cell = isStacked ? "w-full" : "min-w-0";
  const grid = isStacked
    ? "flex flex-col gap-3"
    : "admin-page-grid grid min-w-0 flex-1 grid-cols-2 sm:grid-cols-4";

  const active = filtersActive([
    filters.kartId,
    filters.type,
    filters.status,
    filters.period,
  ]);

  return (
    <FilterBox active={active} onClear={onClear}>
      <div className={grid}>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Kart"
            options={karts}
            value={filters.kartId}
            onSelect={(v) => onChange({ kartId: v })}
          />
        </div>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Tipo"
            options={[
              { value: "", label: "Todos os tipos" },
              { value: "preventiva", label: "Preventiva" },
              { value: "corretiva", label: "Corretiva" },
            ]}
            value={filters.type}
            onSelect={(v) =>
              onChange({ type: v as MaintenanceListFilterState["type"] })
            }
          />
        </div>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Status"
            options={[
              { value: "", label: "Todos os status" },
              { value: "pendente", label: "Pendente" },
              { value: "em_andamento", label: "Em andamento" },
              { value: "concluida", label: "Concluída" },
            ]}
            value={filters.status}
            onSelect={(v) =>
              onChange({ status: v as MaintenanceListFilterState["status"] })
            }
          />
        </div>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Período"
            options={[...MAINTENANCE_FILTER_PERIODS]}
            value={filters.period}
            onSelect={(v) =>
              onChange({ period: v as MaintenanceListFilterState["period"] })
            }
          />
        </div>
      </div>
    </FilterBox>
  );
}

export function ChecklistListFilters({
  layout,
  karts,
  filters,
  onChange,
  onClear,
}: LayoutProps & {
  filters: ChecklistListFilterState;
  onChange: (patch: Partial<ChecklistListFilterState>) => void;
  onClear: () => void;
}) {
  const isStacked = layout === "stacked";
  const cell = isStacked ? "w-full" : "min-w-0";
  const grid = isStacked
    ? "flex flex-col gap-3"
    : "admin-page-grid grid min-w-0 flex-1 grid-cols-2 sm:grid-cols-4";

  const typeOptions = [
    { value: "", label: "Todos os tipos" },
    ...(
      Object.entries(COMPLETE_CHECKLIST_TYPE_LABELS) as [CompleteChecklistType, string][]
    ).map(([value, label]) => ({ value, label })),
  ];

  const statusOptions = [
    { value: "", label: "Todos os resultados" },
    ...(
      Object.entries(CHECKLIST_FINAL_STATUS_LABELS) as [
        keyof typeof CHECKLIST_FINAL_STATUS_LABELS,
        string,
      ][]
    ).map(([value, label]) => ({ value, label })),
  ];

  const active = filtersActive([
    filters.kartId,
    filters.type,
    filters.finalStatus,
    filters.period,
  ]);

  return (
    <FilterBox active={active} onClear={onClear}>
      <div className={grid}>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Kart"
            options={karts}
            value={filters.kartId}
            onSelect={(v) => onChange({ kartId: v })}
          />
        </div>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Tipo"
            options={typeOptions}
            value={filters.type}
            onSelect={(v) =>
              onChange({ type: v as ChecklistListFilterState["type"] })
            }
          />
        </div>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Resultado"
            options={statusOptions}
            value={filters.finalStatus}
            onSelect={(v) =>
              onChange({
                finalStatus: v as ChecklistListFilterState["finalStatus"],
              })
            }
          />
        </div>
        <div className={cell}>
          <SettingsDropdown
            aria-label="Período"
            options={[...MAINTENANCE_FILTER_PERIODS]}
            value={filters.period}
            onSelect={(v) =>
              onChange({ period: v as ChecklistListFilterState["period"] })
            }
          />
        </div>
      </div>
    </FilterBox>
  );
}
