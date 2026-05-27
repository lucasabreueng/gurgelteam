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

function fixUseClientFirst(content) {
  const m = content.match(/"use client";/);
  if (!m) return content;
  const idx = content.indexOf('"use client";');
  if (idx === 0) return content;
  const without = content.replace(/^\s*"use client";\s*\n?/, "");
  return `"use client";\n\n${without.trimStart()}`;
}

function ensureImport(content, stmt) {
  if (content.includes(stmt.split('"')[1]?.split("/").pop() ?? "___")) {
    if (content.includes(stmt.match(/from "([^"]+)"/)?.[1] ?? "___")) return content;
  }
  const fromPath = stmt.match(/from "([^"]+)"/)?.[1];
  if (fromPath && content.includes(fromPath)) return content;
  if (content.includes(stmt.replace(/import /, "").split(" from")[0].slice(0, 20))) return content;
  const needle = stmt.match(/\{ ([^}]+) \}/)?.[1];
  if (needle && needle.split(", ").every((s) => content.includes(s.trim()))) return content;
  if (content.includes('"use client";')) {
    return content.replace('"use client";', `"use client";\n\n${stmt}`);
  }
  return `${stmt}\n${content}`;
}

const settingsReplacements = [
  [/\bGENERAL_SETTINGS\b/g, "SettingsServiceMock.getGeneralSettings()"],
  [/\bROLES\b/g, "SettingsServiceMock.getRoles()"],
  [/\bPLAN_CATEGORIES\b/g, "SettingsServiceMock.getPlanCategories()"],
  [/\bWEEK_SCHEDULE\b/g, "SettingsServiceMock.getWeekSchedule()"],
  [/\bSPECIFIC_DATE_SCHEDULES\b/g, "SettingsServiceMock.getSpecificDateSchedules()"],
  [/\bSCHEDULE_EXCEPTIONS\b/g, "SettingsServiceMock.getScheduleExceptions()"],
  [/\bSETTINGS_KARTS\b/g, "SettingsServiceMock.getSettingsKarts()"],
  [/\bSETTINGS_KART_STATUSES\b/g, "SettingsServiceMock.getSettingsKartStatuses()"],
  [/\bFEEDBACK_CRITERIA\b/g, "SettingsServiceMock.getFeedbackCriteria()"],
  [/\bNOTIFICATION_CHANNELS\b/g, "SettingsServiceMock.getNotificationChannels()"],
  [/\bNOTIFICATION_EVENTS\b/g, "SettingsServiceMock.getNotificationEvents()"],
  [/\bINTEGRATIONS\b/g, "SettingsServiceMock.getIntegrations()"],
  [/\bSECURITY_CARDS\b/g, "SettingsServiceMock.getSecurityCards()"],
  [/\bAPPEARANCE_SETTINGS\b/g, "SettingsServiceMock.getAppearanceSettings()"],
  [/\bRANKING_SETTINGS\b/g, "SettingsServiceMock.getRankingSettings()"],
  [/\bDOCUMENT_TEMPLATES\b/g, "SettingsServiceMock.getDocumentTemplates()"],
  [/\bAUDIT_LOG\b/g, "SettingsServiceMock.getAuditLog()"],
  [/\bPERMISSION_LABELS\b/g, "SettingsServiceMock.getPermissionLabels()"],
  [/\bSETTINGS_TABS\b/g, "SettingsServiceMock.getTabs()"],
  [/\bsyncPlanCategoriesFromKart\b/g, "SettingsServiceMock.syncPlanCategoriesFromKart"],
  [/\bsyncLevelRequirements\b/g, "SettingsServiceMock.syncLevelRequirements"],
  [/\bgetWeekDayKeyFromDate\b/g, "SettingsServiceMock.getWeekDayKeyFromDate"],
  [/\bgetEffectiveScheduleSlotsForDate\b/g, "SettingsServiceMock.getEffectiveScheduleSlotsForDate"],
  [/\bscheduleSlotDurationMinutes\b/g, "SettingsServiceMock.scheduleSlotDurationMinutes"],
  [/\bformatScheduleDuration\b/g, "SettingsServiceMock.formatScheduleDuration"],
  [/\bfindScheduleSlot\b/g, "SettingsServiceMock.findScheduleSlot"],
  [/\bcreateTimeSlot\b/g, "SettingsServiceMock.createTimeSlot"],
  [/\bcreateSpecificDateSchedule\b/g, "SettingsServiceMock.createSpecificDateSchedule"],
  [/\bcreateSpecificDateTimeSlot\b/g, "SettingsServiceMock.createSpecificDateTimeSlot"],
  [/\bcreateScheduleException\b/g, "SettingsServiceMock.createScheduleException"],
  [/\bcreateDefaultPlans\b/g, "SettingsServiceMock.createDefaultPlans"],
  [/\bcreateEmptyPlan\b/g, "SettingsServiceMock.createEmptyPlan"],
  [/\bcreateKartCategory\b/g, "SettingsServiceMock.createKartCategory"],
  [/\bcreateSettingsKart\b/g, "SettingsServiceMock.createSettingsKart"],
  [/\bnextSettingsKartNumber\b/g, "SettingsServiceMock.nextSettingsKartNumber"],
];

const inventoryValueImports = [
  "INVENTORY_CATEGORIES",
  "STOCK_HEALTH_FILTER_OPTIONS",
  "SUPPLIER_NAMES",
  "INVENTORY_TABS",
  "INVENTORY_TABLE_PAGE_SIZES",
  "INVENTORY_HISTORY",
  "INVENTORY_MOVEMENTS",
  "INVENTORY_NF_REFERENCES",
  "INVENTORY_SUPPLIERS",
  "CRITICAL_STOCK",
  "PURCHASE_ORDERS",
  "filterPartsList",
  "filterParts",
  "filterSuppliersList",
  "filterSuppliers",
  "formatCurrency",
  "getPartDetail",
  "MOVEMENT_TYPE_LABELS",
  "PURCHASE_STATUS_LABELS",
  "SUPPLIER_STATUS_LABELS",
  "TOP_USED_PARTS",
  "WEEKLY_CONSUMPTION",
  "CONSUMPTION_BY_CATEGORY",
  "MONTHLY_MOVEMENTS",
  "COST_BY_CATEGORY",
];

const inventoryReplacements = [
  ["INVENTORY_CATEGORIES", "InventoryServiceMock.getCategories()"],
  ["STOCK_HEALTH_FILTER_OPTIONS", "InventoryServiceMock.getStockHealthFilterOptions()"],
  ["SUPPLIER_NAMES", "InventoryServiceMock.getSupplierNames()"],
  ["INVENTORY_TABS", "InventoryServiceMock.getTabs()"],
  ["INVENTORY_TABLE_PAGE_SIZES", "InventoryServiceMock.getTablePageSizes()"],
  ["INVENTORY_HISTORY", "InventoryServiceMock.getHistory()"],
  ["INVENTORY_MOVEMENTS", "InventoryServiceMock.getMovements()"],
  ["INVENTORY_NF_REFERENCES", "InventoryServiceMock.getNfReferences()"],
  ["INVENTORY_SUPPLIERS", "InventoryServiceMock.getStaticSuppliers()"],
  ["CRITICAL_STOCK", "InventoryServiceMock.getCriticalStock()"],
  ["PURCHASE_ORDERS", "InventoryServiceMock.getPurchaseOrders()"],
  ["filterPartsList", "InventoryServiceMock.filterPartsList"],
  ["filterParts", "InventoryServiceMock.filterParts"],
  ["filterSuppliersList", "InventoryServiceMock.filterSuppliersList"],
  ["filterSuppliers", "InventoryServiceMock.filterSuppliers"],
  ["formatCurrency", "InventoryServiceMock.formatCurrency"],
  ["getPartDetail", "InventoryServiceMock.getPartDetail"],
  ["MOVEMENT_TYPE_LABELS", "InventoryServiceMock.getMovementTypeLabels()"],
  ["PURCHASE_STATUS_LABELS", "InventoryServiceMock.getPurchaseStatusLabels()"],
  ["SUPPLIER_STATUS_LABELS", "InventoryServiceMock.getSupplierStatusLabels()"],
  ["TOP_USED_PARTS", "InventoryServiceMock.getTopUsedParts()"],
  ["WEEKLY_CONSUMPTION", "InventoryServiceMock.getWeeklyConsumption()"],
  ["CONSUMPTION_BY_CATEGORY", "InventoryServiceMock.getConsumptionByCategory()"],
  ["MONTHLY_MOVEMENTS", "InventoryServiceMock.getMonthlyMovements()"],
  ["COST_BY_CATEGORY", "InventoryServiceMock.getCostByCategory()"],
];

const kartsReplacements = [
  ["KART_STATUS_LABELS", "KartsServiceMock.getStatusLabels()"],
  ["KARTS_TABLE_PAGE_SIZES", "KartsServiceMock.getTablePageSizes()"],
  ["FLEET_KARTS", "KartsServiceMock.getFleet()"],
  ["PADLOCK_BOXES", "KartsServiceMock.getPadlockBoxes()"],
  ["getKartDetail", "KartsServiceMock.getDetail"],
];

const maintenanceReplacements = [
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
  ["MAINTENANCE_ORDERS", "MaintenanceServiceMock.getOrders()"],
];

const partsReplacements = [
  ["USAGE_TYPE_OPTIONS", "PartsServiceMock.getUsageTypeOptions()"],
  ["PARTS_CATALOG", "PartsServiceMock.getCatalog()"],
  ["SMART_PART_SUGGESTIONS", "PartsServiceMock.getSmartSuggestions()"],
  ["formatCurrency", "PartsServiceMock.formatCurrency"],
  ["mockBarcodeLookup", "PartsServiceMock.mockBarcodeLookup"],
  ["searchPartsCatalog", "PartsServiceMock.searchCatalog"],
];

const settingsTypes =
  "SettingsTabKey, GeneralSettingsForm, PermissionKey, RoleKey, ScheduleTimeSlot, WeekDaySchedule, SpecificDateSchedule, ScheduleException, PlanPackage, PlanCategory, KartCategory, SkillLevel, KartOwnership, SettingsKartRow, FeedbackCriterion, NotificationChannel, NotificationEvent, IntegrationItem, DocumentTemplate, AuditEntry, PlanPackage";

function stripValueImportsFromContract(content, contractPath, names) {
  const re = new RegExp(
    `import\\s*\\{([^}]*)\\}\\s*from\\s*"${contractPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*;?`,
    "g",
  );
  return content.replace(re, (full, inner) => {
    const kept = inner
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !names.includes(s.replace(/^type\s+/, "")));
    if (kept.length === 0) return "";
    const hasType = kept.some((s) => s.startsWith("type "));
    const prefix = hasType || inner.includes("type ") ? "import" : "import type";
    if (kept.every((s) => !s.startsWith("type ")) && !inner.includes("type ")) {
      return `import type { ${kept.join(", ")} } from "${contractPath}";`;
    }
    return `${prefix} { ${kept.join(", ")} } from "${contractPath}";`;
  });
}

function processFile(file, cfg) {
  let c = fs.readFileSync(file, "utf8");
  const orig = c;
  c = fixUseClientFirst(c);

  for (const [from, to] of cfg.replacements) {
    const re = typeof from === "string" ? new RegExp(`\\b${from}\\b`, "g") : from;
    c = c.replace(re, to);
  }

  if (cfg.contract && cfg.valueNames) {
    c = stripValueImportsFromContract(c, cfg.contract, cfg.valueNames);
  }

  if (cfg.serviceImport && c.includes(cfg.serviceName + ".") && !c.includes(cfg.serviceImport)) {
    c = ensureImport(c, `import { ${cfg.serviceName} } from "${cfg.serviceImport}";`);
  }

  if (cfg.typeImport && needsTypes(c, cfg.typeNames)) {
    const missing = cfg.typeNames.filter((t) => c.includes(t) && !hasTypeImport(c, t));
    if (missing.length) {
      c = ensureImport(c, `import type { ${missing.join(", ")} } from "${cfg.typeImport}";`);
    }
  }

  if (c !== orig) fs.writeFileSync(file, c);
}

function needsTypes(content, names) {
  return names.some((n) => content.includes(n));
}

function hasTypeImport(content, typeName) {
  return new RegExp(`import\\s+type\\s*\\{[^}]*\\b${typeName}\\b`).test(content);
}

// settings
for (const file of walk("components/admin/settings")) {
  processFile(file, {
    replacements: settingsReplacements,
    serviceName: "SettingsServiceMock",
    serviceImport: "@/services/settings/settingsServiceMock",
    typeImport: "@/lib/contracts/settings",
    typeNames: settingsTypes.split(", ").map((s) => s.trim()),
  });
}

// inventory
for (const file of walk("components/admin/inventory")) {
  processFile(file, {
    replacements: inventoryReplacements.map(([a, b]) => [a, b]),
    contract: "@/lib/contracts/inventory",
    valueNames: inventoryValueImports,
    serviceName: "InventoryServiceMock",
    serviceImport: "@/services/inventory/inventoryServiceMock",
    typeImport: "@/lib/contracts/inventory",
    typeNames: [
      "InventoryTabKey",
      "InventoryCategory",
      "InventoryPart",
      "MovementType",
      "InventoryMovement",
      "PurchaseOrder",
      "PurchaseStatus",
      "InventorySupplier",
      "SupplierStatus",
      "InventoryAlert",
      "PartDetail",
      "CriticalStockItem",
    ],
  });
}

// karts
for (const file of walk("components/admin/karts")) {
  processFile(file, {
    replacements: kartsReplacements,
    contract: "@/lib/contracts/karts",
    valueNames: ["getKartDetail", "KART_STATUS_LABELS", "FLEET_KARTS", "PADLOCK_BOXES"],
    serviceName: "KartsServiceMock",
    serviceImport: "@/services/karts/kartsServiceMock",
    typeImport: "@/lib/contracts/karts",
    typeNames: [
      "KartStatus",
      "KartTabKey",
      "FleetKartListItem",
      "KartDetail",
      "PaddockBox",
      "NewKartFormData",
      "RegisteredMotor",
    ],
  });
}

// maintenance
for (const file of walk("components/admin/maintenance")) {
  processFile(file, {
    replacements: maintenanceReplacements,
    serviceName: "MaintenanceServiceMock",
    serviceImport: "@/services/maintenance/maintenanceServiceMock",
    typeImport: "@/lib/contracts/maintenance",
    typeNames: [
      "MaintenanceTabKey",
      "MaintenanceOrderListItem",
      "MaintenanceStatus",
      "MaintenancePriority",
      "MaintenanceType",
    ],
  });
}

// parts in maintenance register-part
for (const file of walk("components/admin/maintenance/register-part")) {
  processFile(file, {
    replacements: partsReplacements,
    contract: "@/lib/contracts/parts",
    valueNames: ["formatCurrency", "PARTS_CATALOG", "searchPartsCatalog"],
    serviceName: "PartsServiceMock",
    serviceImport: "@/services/parts/partsServiceMock",
  });
}

console.log("fix-tsc done");
