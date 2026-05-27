import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

for (const file of walk("components/admin/clients")) {
  let c = fs.readFileSync(file, "utf8");
  const orig = c;

  c = c.replace(
    /const categoryLabels =\(\s*([^,]+),\s*([^)]+)\s*\);/g,
    "const categoryLabels = ClientsServiceMock.resolveCategoryNames($1, $2);",
  );
  c = c.replace(
    /const levelName =\(([^,]+),\s*([^)]+)\);/g,
    "const levelName = ClientsServiceMock.resolveLevelName($1, $2);",
  );
  c = c.replace(
    /ClientsServiceMock\.resolveLevelName\(([^,]+),\s*SettingsServiceMock\.getSkillLevels\(\)\)/g,
    "ClientsServiceMock.resolveLevelName($1, skillLevels)",
  );

  if (!c.includes('"use client"') || c.indexOf('"use client"') > 50) {
    c = c.replace(/^[\s\S]*?("use client";)/, "$1\n");
  }
  if (c.includes("ClientListItem") && !c.includes("import type { ClientListItem")) {
    if (!c.includes("@/lib/contracts/clients")) {
      c = c.replace(
        '"use client";',
        '"use client";\n\nimport type { ClientListItem, ClientProfileDetail } from "@/lib/contracts/clients";',
      );
    }
  }
  if (c.includes("ClientsServiceMock.") && !c.includes("@/services/clients/clientsServiceMock")) {
    c = c.replace(
      '"use client";',
      '"use client";\n\nimport { ClientsServiceMock } from "@/services/clients/clientsServiceMock";',
    );
  }
  if (c !== orig) fs.writeFileSync(file, c);
}

// inventory-charts
const charts = "components/admin/inventory/inventory-charts.tsx";
if (fs.existsSync(charts)) {
  let c = fs.readFileSync(charts, "utf8");
  c = c.replace(
    /import \{\s*CONSUMPTION_BY_CATEGORY,[\s\S]*?WEEKLY_CONSUMPTION,\s*\} from "@\/lib\/contracts\/inventory";/,
    'import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";',
  );
  c = c.replace(/\bWEEKLY_CONSUMPTION\b/g, "weeklyConsumption");
  c = c.replace(/\bCONSUMPTION_BY_CATEGORY\b/g, "consumptionByCategory");
  c = c.replace(/\bMONTHLY_MOVEMENTS\b/g, "monthlyMovements");
  c = c.replace(/\bTOP_USED_PARTS\b/g, "topUsedParts");
  c = c.replace(/\bCOST_BY_CATEGORY\b/g, "costByCategory");
  if (!c.includes("const weeklyConsumption")) {
    c = c.replace(
      'export function ConsumptionChart() {',
      `const weeklyConsumption = InventoryServiceMock.getWeeklyConsumption();
const consumptionByCategory = InventoryServiceMock.getConsumptionByCategory();
const monthlyMovements = InventoryServiceMock.getMonthlyMovements();
const topUsedParts = InventoryServiceMock.getTopUsedParts();
const costByCategory = InventoryServiceMock.getCostByCategory();

export function ConsumptionChart() {`,
    );
  }
  fs.writeFileSync(charts, c);
}

// inventory-movements types
const mov = "components/admin/inventory/inventory-movements.tsx";
if (fs.existsSync(mov)) {
  let c = fs.readFileSync(mov, "utf8");
  if (!c.includes("MovementType")) {
    c = c.replace(
      '"use client";',
      '"use client";\n\nimport type { MovementType } from "@/lib/contracts/inventory";\nimport { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";',
    );
  }
  c = c.replace(/\bMOVEMENT_TYPE_LABELS\b/g, "InventoryServiceMock.getMovementTypeLabels()");
  fs.writeFileSync(mov, c);
}

// inventory-overview
const ov = "components/admin/inventory/inventory-overview.tsx";
if (fs.existsSync(ov)) {
  let c = fs.readFileSync(ov, "utf8");
  c = c.replace(/\bTOP_USED_PARTS\b/g, "InventoryServiceMock.getTopUsedParts()");
  c = c.replace(/\bMOVEMENT_TYPE_LABELS\b/g, "InventoryServiceMock.getMovementTypeLabels()");
  if (!c.includes("InventoryServiceMock") && c.includes("InventoryServiceMock.")) {
    c = `import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";\n${c}`;
  }
  fs.writeFileSync(ov, c);
}

console.log("repair done");
