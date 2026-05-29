import type { MaintenanceSimpleFilterState } from "@/lib/contracts/maintenance/simple";
import { FilterBox, filtersActive } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../../settings/settings-dropdown";

type FilterOptions = {
  kartStatus: { value: string; label: string }[];
  types: { value: string; label: string }[];
  periods: readonly { value: string; label: string }[];
  karts: { value: string; label: string }[];
};

type Props = {
  layout: "inline" | "stacked";
  filters: MaintenanceSimpleFilterState;
  options: FilterOptions;
  onChange: (patch: Partial<MaintenanceSimpleFilterState>) => void;
  onClear: () => void;
};

export function MaintenanceSimpleFilters({
  layout,
  filters,
  options,
  onChange,
  onClear,
}: Props) {
  const isStacked = layout === "stacked";
  const dropdownCell = isStacked ? "w-full" : "min-w-0";
  const grid = isStacked
    ? "flex flex-col gap-3"
    : "admin-page-grid grid min-w-0 flex-1 grid-cols-2 sm:grid-cols-4";

  const active = filtersActive([
    filters.kartStatus,
    filters.maintenanceType,
    filters.period,
    filters.kartId,
  ]);

  return (
    <FilterBox active={active} onClear={onClear}>
      <div className={grid}>
        <div className={dropdownCell}>
          <SettingsDropdown
            aria-label="Status do kart"
            options={options.kartStatus}
            value={filters.kartStatus}
            onSelect={(v) =>
              onChange({
                kartStatus: v as MaintenanceSimpleFilterState["kartStatus"],
              })
            }
          />
        </div>
        <div className={dropdownCell}>
          <SettingsDropdown
            aria-label="Tipo de manutenção"
            options={options.types}
            value={filters.maintenanceType}
            onSelect={(v) =>
              onChange({
                maintenanceType: v as MaintenanceSimpleFilterState["maintenanceType"],
              })
            }
          />
        </div>
        <div className={dropdownCell}>
          <SettingsDropdown
            aria-label="Período"
            options={[...options.periods]}
            value={filters.period}
            onSelect={(v) =>
              onChange({ period: v as MaintenanceSimpleFilterState["period"] })
            }
          />
        </div>
        <div className={dropdownCell}>
          <SettingsDropdown
            aria-label="Kart"
            options={options.karts}
            value={filters.kartId}
            onSelect={(v) => onChange({ kartId: v })}
          />
        </div>
      </div>
    </FilterBox>
  );
}
