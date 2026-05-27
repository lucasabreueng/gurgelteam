import fs from "fs";
import path from "path";

const fixes = [
  {
    service: "ClientsServiceMock",
    importPath: "@/services/clients/clientsServiceMock",
    dirs: ["components/admin/clients"],
  },
  {
    service: "InventoryServiceMock",
    importPath: "@/services/inventory/inventoryServiceMock",
    dirs: ["components/admin/inventory"],
  },
  {
    service: "MaintenanceServiceMock",
    importPath: "@/services/maintenance/maintenanceServiceMock",
    dirs: ["components/admin/maintenance", "components/admin/inventory"],
  },
  {
    service: "KartsServiceMock",
    importPath: "@/services/karts/kartsServiceMock",
    dirs: ["components/admin/karts"],
  },
  {
    service: "PartsServiceMock",
    importPath: "@/services/parts/partsServiceMock",
    dirs: ["components/admin/maintenance"],
  },
  {
    service: "SettingsServiceMock",
    importPath: "@/services/settings/settingsServiceMock",
    dirs: ["components/admin/clients", "components/admin/settings"],
  },
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

const clientHelperImports = [
  "resolveCategoryNames",
  "resolveLevelName",
  "CLIENT_FILTER_STATUSES",
];

for (const { service, importPath, dirs } of fixes) {
  for (const dir of dirs) {
    for (const file of walk(dir)) {
      let content = fs.readFileSync(file, "utf8");
      if (!content.includes(service + ".")) continue;
      if (content.includes(`from "${importPath}"`)) continue;
      content = `import { ${service} } from "${importPath}";\n${content}`;
      fs.writeFileSync(file, content);
    }
  }
}

// Fix client components importing helpers from contracts
for (const file of walk("components/admin/clients")) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const helper of clientHelperImports) {
    if (content.includes(`import {`) && content.includes(helper) && content.includes("@/lib/contracts/clients")) {
      content = content.replace(
        new RegExp(`\\s*${helper},?\\s*`, "g"),
        "",
      );
      content = content.replace(/,\s*,/g, ",").replace(/\{\s*,/g, "{").replace(/,\s*\}/g, "}");
      content = content.replace(
        new RegExp(`\\b${helper}\\b`, "g"),
        `ClientsServiceMock.${helper}`,
      );
      changed = true;
    }
  }
  if (content.includes("getClientListItem") && !content.includes("ClientsServiceMock.getListItem")) {
    content = content.replace(/\bgetClientListItem\b/g, "ClientsServiceMock.getListItem");
    changed = true;
  }
  if (content.includes("KART_CATEGORIES") && content.includes("@/lib/contracts/settings")) {
    content = content.replace(/\bKART_CATEGORIES\b/g, "SettingsServiceMock.getKartCategories()");
    content = content.replace(/\bSKILL_LEVELS\b/g, "SettingsServiceMock.getSkillLevels()");
    content = content.replace(
      /import\s*\{\s*SettingsServiceMock\.getKartCategories\(\)\s*,\s*SettingsServiceMock\.getSkillLevels\(\)\s*\}\s*from\s*"@\/lib\/contracts\/settings"\s*;?\n?/g,
      "",
    );
    if (!content.includes('from "@/services/settings/settingsServiceMock"')) {
      content = `import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";\n${content}`;
    }
    changed = true;
  }
  if (changed) fs.writeFileSync(file, content);
}

// Fix inventory type imports stripped
for (const file of walk("components/admin/inventory")) {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("InventoryTabKey") && !content.includes("import type") && !content.includes("InventoryTabKey }")) {
    if (!content.includes("@/lib/contracts/inventory")) {
      content = `import type { InventoryTabKey } from "@/lib/contracts/inventory";\n${content}`;
      fs.writeFileSync(file, content);
    }
  }
}

console.log("fix-service-imports done");
