import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".tsx") || e.name.endsWith(".ts")) files.push(p);
  }
  return files;
}

const serviceMap = {
  "@/lib/admin-inventory-mocks": {
    service: "InventoryServiceMock",
    importPath: "@/services/inventory/inventoryServiceMock",
    contract: "@/lib/contracts/inventory",
    reps: [
      ["INVENTORY_TABS", "InventoryServiceMock.getTabs()"],
      ["INVENTORY_TABLE_PAGE_SIZES", "InventoryServiceMock.getTablePageSizes()"],
      ["INVENTORY_HISTORY", "InventoryServiceMock.getHistory()"],
      ["INVENTORY_MOVEMENTS", "InventoryServiceMock.getMovements()"],
      ["INVENTORY_NF_REFERENCES", "InventoryServiceMock.getNfReferences()"],
      ["INVENTORY_SUPPLIERS", "InventoryServiceMock.getStaticSuppliers()"],
      ["CRITICAL_STOCK", "InventoryServiceMock.getCriticalStock()"],
      ["PURCHASE_ORDERS", "InventoryServiceMock.getPurchaseOrders()"],
      ["getPartDetail", "InventoryServiceMock.getPartDetail"],
      ["formatCurrency", "InventoryServiceMock.formatCurrency"],
      ["MAINTENANCE_ORDERS", "MaintenanceServiceMock.getOrders()"],
    ],
  },
  "@/lib/admin-maintenance-mocks": {
    service: "MaintenanceServiceMock",
    importPath: "@/services/maintenance/maintenanceServiceMock",
    contract: "@/lib/contracts/maintenance",
    reps: [
      ["MAINTENANCE_TABLE_PAGE_SIZES", "MaintenanceServiceMock.getTablePageSizes()"],
      ["MAINTENANCE_FILTER_PRIORITIES", "MaintenanceServiceMock.getFilterPriorities()"],
      ["MAINTENANCE_FILTER_STATUSES", "MaintenanceServiceMock.getFilterStatuses()"],
      ["MAINTENANCE_FILTER_TYPES", "MaintenanceServiceMock.getFilterTypes()"],
      ["MAINTENANCE_KART_CATEGORIES", "MaintenanceServiceMock.getKartCategories()"],
      ["MAINTENANCE_MECHANICS", "MaintenanceServiceMock.getMechanics()"],
      ["MAINTENANCE_STATUS_LABELS", "MaintenanceServiceMock.getStatusLabels()"],
      ["MAINTENANCE_PRIORITY_LABELS", "MaintenanceServiceMock.getPriorityLabels()"],
      ["MAINTENANCE_TYPE_LABELS", "MaintenanceServiceMock.getTypeLabels()"],
      ["FLOW_STATUSES", "MaintenanceServiceMock.getFlowStatuses()"],
      ["getMaintenanceDetail", "MaintenanceServiceMock.getDetail"],
    ],
  },
  "@/lib/admin-karts-mocks": {
    service: "KartsServiceMock",
    importPath: "@/services/karts/kartsServiceMock",
    contract: "@/lib/contracts/karts",
    reps: [
      ["KART_STATUS_LABELS", "KartsServiceMock.getStatusLabels()"],
      ["KARTS_TABLE_PAGE_SIZES", "KartsServiceMock.getTablePageSizes()"],
      ["FLEET_KARTS", "KartsServiceMock.getFleet()"],
      ["PADLOCK_BOXES", "KartsServiceMock.getPadlockBoxes()"],
      ["getKartDetail", "KartsServiceMock.getDetail"],
    ],
  },
  "@/lib/admin-clients-mocks": {
    service: "ClientsServiceMock",
    importPath: "@/services/clients/clientsServiceMock",
    contract: "@/lib/contracts/clients",
    reps: [
      ["CLIENT_TABLE_PAGE_SIZES", "ClientsServiceMock.getTablePageSizes()"],
      ["CLIENTS_LIST", "ClientsServiceMock.getList()"],
      ["EVOLUTION_RANKINGS", "ClientsServiceMock.getEvolutionRankings()"],
      ["getClientProfile", "ClientsServiceMock.getProfile"],
      ["resolveCategoryNames", "ClientsServiceMock.resolveCategoryNames"],
    ],
  },
  "@/lib/admin-parts-mocks": {
    service: "PartsServiceMock",
    importPath: "@/services/parts/partsServiceMock",
    contract: "@/lib/contracts/parts",
    reps: [
      ["USAGE_TYPE_OPTIONS", "PartsServiceMock.getUsageTypeOptions()"],
      ["PARTS_CATALOG", "PartsServiceMock.getCatalog()"],
      ["SMART_PART_SUGGESTIONS", "PartsServiceMock.getSmartSuggestions()"],
      ["formatCurrency", "PartsServiceMock.formatCurrency"],
      ["mockBarcodeLookup", "PartsServiceMock.mockBarcodeLookup"],
      ["searchPartsCatalog", "PartsServiceMock.searchCatalog"],
    ],
  },
  "@/lib/admin-settings-mocks": {
    service: "SettingsServiceMock",
    importPath: "@/services/settings/settingsServiceMock",
    contract: "@/lib/contracts/settings",
    reps: [
      ["KART_CATEGORIES", "SettingsServiceMock.getKartCategories()"],
      ["SKILL_LEVELS", "SettingsServiceMock.getSkillLevels()"],
      ["SETTINGS_TABS", "SettingsServiceMock.getTabs()"],
    ],
  },
};

const roots = ["components/admin/inventory", "components/admin/maintenance", "components/admin/karts", "components/admin/clients", "components/admin/settings"];
let count = 0;

for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    let content = fs.readFileSync(file, "utf8");
    const original = content;

    for (const [mockPath, cfg] of Object.entries(serviceMap)) {
      if (!content.includes(mockPath)) continue;

      for (const [from, to] of cfg.reps) {
        content = content.replace(new RegExp(`\\b${from}\\b`, "g"), to);
      }

      if (!content.includes(cfg.service)) {
        content = `import { ${cfg.service} } from "${cfg.importPath}";\n${content}`;
      }

      content = content.replace(
        new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*"${mockPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*;?\\n?`, "g"),
        "",
      );
    }

    if (content !== original) {
      fs.writeFileSync(file, content);
      count++;
    }
  }
}

console.log(`Updated ${count} files`);
