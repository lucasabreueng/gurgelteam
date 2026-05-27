import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.tsx?$/.test(e.name)) files.push(p);
  }
  return files;
}

const extraReplacements = [
  ["KART_FILTER_CATEGORIES", "KartsServiceMock.getFilterCategories()"],
  ["KART_FILTER_STATUSES", "KartsServiceMock.getFilterStatuses()"],
  ["KART_MAINTENANCE_WINDOWS", "KartsServiceMock.getMaintenanceWindows()"],
  ["KART_OWNERSHIP_TYPE_OPTIONS", "KartsServiceMock.getOwnershipTypeOptions()"],
  ["REGISTERED_MOTORS", "KartsServiceMock.getRegisteredMotors()"],
  ["LOCATIONS", "InventoryServiceMock.getLocations()"],
  ["formatInventoryDate", "InventoryServiceMock.formatInventoryDate"],
  ["DEFAULT_REGISTER_PART_OS", "PartsServiceMock.getDefaultRegisterPartOs()"],
  ["DEFAULT_QUICK_PART_HISTORY", "PartsServiceMock.getDefaultQuickHistory()"],
  ["getStockAlert", "PartsServiceMock.getStockAlert"],
];

const typeImportsByDir = {
  "components/admin/settings": [
    "SettingsTabKey",
    "KartCategory",
    "SkillLevel",
    "PlanCategory",
    "PlanPackage",
    "WeekDaySchedule",
    "SpecificDateSchedule",
    "ScheduleException",
    "ScheduleTimeSlot",
    "SettingsKartRow",
    "KartOwnership",
    "NotificationEvent",
    "NotificationChannel",
    "RoleKey",
    "PermissionKey",
    "GeneralSettingsForm",
    "RolePermissions",
  ],
  "components/admin/karts": [
    "KartOwnership",
    "KartStatus",
    "NewKartFormData",
    "FleetKartListItem",
    "KartDetail",
    "PaddockBox",
    "RegisteredMotor",
  ],
  "components/admin/maintenance": [
    "MaintenanceTabKey",
    "MaintenanceOrderListItem",
    "MaintenanceStatus",
    "MaintenancePriority",
    "MaintenanceType",
  ],
  "components/admin/maintenance/register-part": [
    "PartCatalogItem",
    "PartUnit",
    "PartUsageType",
    "ClientBillingMode",
    "RegisterPartOsContext",
    "QuickPartHistoryItem",
  ],
  "components/admin/inventory": [
    "MovementType",
    "InventoryCategory",
    "PurchaseStatus",
    "PurchaseOrder",
    "SupplierStatus",
    "InventoryTabKey",
    "InventoryPart",
    "InventoryAlert",
    "PartDetail",
    "CriticalStockItem",
    "InventorySupplier",
  ],
};

const contractByDir = {
  "components/admin/settings": "@/lib/contracts/settings",
  "components/admin/karts": "@/lib/contracts/karts",
  "components/admin/maintenance": "@/lib/contracts/maintenance",
  "components/admin/maintenance/register-part": "@/lib/contracts/parts",
  "components/admin/inventory": "@/lib/contracts/inventory",
};

function fixFile(file) {
  let c = fs.readFileSync(file, "utf8");
  const orig = c;

  // duplicate use client
  c = c.replace(/("use client";\s*\n)+/g, '"use client";\n\n');
  // remove second use client after service import
  c = c.replace(
    /(import \{ \w+ServiceMock \} from "[^"]+";)\s*\n"use client";\s*\n/g,
    "$1\n\n",
  );

  // double service prefix
  c = c.replace(/(\w+ServiceMock)\.\1\./g, "$1.");

  for (const [from, to] of extraReplacements) {
    c = c.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  }

  // type imports per directory
  for (const [dir, types] of Object.entries(typeImportsByDir)) {
    if (!file.replace(/\\/g, "/").includes(dir.replace(/\\/g, "/"))) continue;
    const contract = contractByDir[dir];
    const used = types.filter((t) => new RegExp(`\\b${t}\\b`).test(c));
    if (!used.length) continue;
    const hasImport = new RegExp(
      `from "${contract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
    ).test(c);
    const importLine = `import type { ${used.join(", ")} } from "${contract}";`;
    if (!hasImport) {
      if (c.includes('"use client";')) {
        c = c.replace('"use client";', `"use client";\n\n${importLine}`);
      } else {
        c = `${importLine}\n${c}`;
      }
    } else {
      // merge missing types into existing import
      const re = new RegExp(
        `import type \\{([^}]*)\\} from "${contract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
      );
      c = c.replace(re, (_, inner) => {
        const existing = inner.split(",").map((s) => s.trim()).filter(Boolean);
        const merged = [...new Set([...existing, ...used])].sort();
        return `import type { ${merged.join(", ")} } from "${contract}"`;
      });
    }
    break;
  }

  // client-search-dropdown
  if (file.includes("client-search-dropdown")) {
    if (!c.includes("ClientsServiceMock")) {
      c = c.replace(
        '"use client";',
        '"use client";\n\nimport { ClientsServiceMock } from "@/services/clients/clientsServiceMock";',
      );
    }
  }

  if (c !== orig) fs.writeFileSync(file, c);
}

const roots = [
  "components/admin/settings",
  "components/admin/karts",
  "components/admin/maintenance",
  "components/admin/inventory",
];

for (const root of roots) {
  for (const file of walk(root)) fixFile(file);
}

console.log("cleanup done");
