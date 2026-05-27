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

const configs = [
  {
    mock: "@/lib/admin-checklist-mocks",
    service: "ChecklistServiceMock",
    servicePath: "@/services/maintenance/checklistServiceMock",
    contract: "@/lib/contracts/maintenance",
    reps: [
      ["CHECKLIST_TYPES", "ChecklistServiceMock.getTypes()"],
      ["DEFAULT_CHECKLIST_KART", "ChecklistServiceMock.getDefaultKart()"],
      ["INSPECTION_SECTIONS", "ChecklistServiceMock.getSections()"],
      ["CHECKLIST_SMART_ALERTS", "ChecklistServiceMock.getSmartAlerts()"],
      ["CHECKLIST_HISTORY", "ChecklistServiceMock.getHistory()"],
      ["MOCK_MEDIA_PREVIEWS", "ChecklistServiceMock.getMediaPreviews()"],
      ["KART_DIAGRAM_VIEWS", "ChecklistServiceMock.getDiagramViews()"],
      ["DIAGRAM_ZONES", "ChecklistServiceMock.getDiagramZones()"],
      ["OVERALL_STATUS_LABELS", "ChecklistServiceMock.getOverallStatusLabels()"],
      ["buildInitialItemState", "ChecklistServiceMock.buildInitialItemState"],
      ["computeInspectionSummary", "ChecklistServiceMock.computeInspectionSummary"],
    ],
    types: [
      "InspectionItemStatus",
      "ChecklistTypeKey",
      "OverallInspectionStatus",
      "ChecklistKartContext",
      "InspectionItemDef",
      "InspectionSectionDef",
      "ChecklistMediaPreview",
      "DiagramMark",
    ],
    dirs: ["components/admin/maintenance/checklist", "components/admin/maintenance/new-inspection"],
  },
  {
    mock: "@/lib/admin-inspection-mocks",
    service: "InspectionServiceMock",
    servicePath: "@/services/maintenance/inspectionServiceMock",
    contract: "@/lib/contracts/maintenance",
    reps: [
      ["INSPECTION_TYPE_OPTIONS", "InspectionServiceMock.getTypeOptions()"],
      ["INSPECTION_MODULES", "InspectionServiceMock.getModules()"],
      ["DIAGRAM_INSPECTION_ZONES", "InspectionServiceMock.getDiagramZones()"],
      ["TECHNICAL_TIMELINE", "InspectionServiceMock.getTechnicalTimeline()"],
      ["DEFAULT_INSPECTION_KART", "InspectionServiceMock.getDefaultKart()"],
      ["MOCK_DIAGNOSIS", "InspectionServiceMock.getMockDiagnosis()"],
      ["SIGNATURE_STAFF", "InspectionServiceMock.getSignatureStaff()"],
      ["GENERAL_CONDITION_META", "InspectionServiceMock.getGeneralConditionMeta()"],
      ["buildInitialItemStates", "InspectionServiceMock.buildInitialItemStates"],
      ["computeInspectionResult", "InspectionServiceMock.computeInspectionResult"],
    ],
    types: [
      "InspectionTypeKey",
      "ItemStatus",
      "ItemSeverity",
      "GeneralCondition",
      "FinalResultStatus",
      "AutoRecommendation",
      "InspectionItemState",
      "InspectionModuleItemDef",
      "InspectionModuleDef",
      "InspectionTypeOption",
      "DiagramZoneKey",
      "DiagramMark",
    ],
    dirs: ["components/admin/maintenance/new-inspection"],
  },
  {
    mock: "@/lib/admin-new-maintenance-mocks",
    service: "NewMaintenanceServiceMock",
    servicePath: "@/services/maintenance/newMaintenanceServiceMock",
    contract: "@/lib/contracts/maintenance",
    reps: [
      ["DEFAULT_KART", "NewMaintenanceServiceMock.getDefaultKart()"],
      ["DEFAULT_PLANNED_SERVICES", "NewMaintenanceServiceMock.getDefaultPlannedServices()"],
      ["DEFAULT_RESPONSIBLE", "NewMaintenanceServiceMock.getDefaultResponsible()"],
      ["MOCK_PROBLEM", "NewMaintenanceServiceMock.getMockProblem()"],
      ["NOW_MAINTENANCE_LABEL", "NewMaintenanceServiceMock.getNowLabel()"],
      ["buildInitialDiagnosis", "NewMaintenanceServiceMock.buildInitialDiagnosis"],
      ["computeEstimatedCosts", "NewMaintenanceServiceMock.computeEstimatedCosts"],
      ["generateOsNumber", "NewMaintenanceServiceMock.generateOsNumber"],
      ["MAINTENANCE_KART_OPTIONS", "NewMaintenanceServiceMock.getKartOptions()"],
      ["searchMaintenanceKarts", "NewMaintenanceServiceMock.searchKarts"],
      ["MAINTENANCE_TYPE_OPTIONS", "NewMaintenanceServiceMock.getTypeOptions()"],
      ["PRIORITY_OPTIONS", "NewMaintenanceServiceMock.getPriorityOptions()"],
      ["ORIGIN_OPTIONS", "NewMaintenanceServiceMock.getOriginOptions()"],
      ["ORIGIN_LINK_MOCK", "NewMaintenanceServiceMock.getOriginLinkMock()"],
      ["DIAGNOSIS_AREAS", "NewMaintenanceServiceMock.getDiagnosisAreas()"],
      ["PLANNED_SERVICES", "NewMaintenanceServiceMock.getPlannedServices()"],
      ["LABOR_RATE_MOCK", "NewMaintenanceServiceMock.getLaborRate()"],
      ["MAINTENANCE_TIMELINE", "NewMaintenanceServiceMock.getTimeline()"],
      ["SMART_MAINTENANCE_ALERTS", "NewMaintenanceServiceMock.getSmartAlerts()"],
      ["AFFECTED_BOOKINGS", "NewMaintenanceServiceMock.getAffectedBookings()"],
      ["SIGNATURE_MAINTENANCE", "NewMaintenanceServiceMock.getSignature()"],
      ["searchPartsForMaintenance", "NewMaintenanceServiceMock.searchParts"],
    ],
    types: [
      "NewMaintenanceTypeKey",
      "NewMaintenancePriority",
      "MaintenanceOriginKey",
      "OperationalStatusKey",
      "DiagnosisAreaKey",
      "DiagnosisAreaState",
      "MaintenanceKartOption",
      "PredictedPartLine",
      "PlannedServiceKey",
      "ItemSeverity",
    ],
    dirs: ["components/admin/maintenance/new-maintenance"],
  },
];

function processFile(file, cfg) {
  if (!fs.readFileSync(file, "utf8").includes(cfg.mock)) return false;
  let c = fs.readFileSync(file, "utf8");
  const orig = c;

  for (const [from, to] of cfg.reps) {
    c = c.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  }

  c = c.replace(
    new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*"${cfg.mock.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*;?\\n?`, "g"),
    "",
  );

  const usedTypes = cfg.types.filter((t) => new RegExp(`\\b${t}\\b`).test(c));
  if (usedTypes.length) {
    const typeLine = `import type { ${usedTypes.join(", ")} } from "${cfg.contract}";`;
    if (!c.includes(typeLine) && !c.includes(`from "${cfg.contract}"`)) {
      if (c.includes('"use client";')) {
        c = c.replace('"use client";', `"use client";\n\n${typeLine}`);
      } else {
        c = `${typeLine}\n${c}`;
      }
    } else if (c.includes(`from "${cfg.contract}"`)) {
      const re = new RegExp(
        `import type \\{([^}]*)\\} from "${cfg.contract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
      );
      c = c.replace(re, (_, inner) => {
        const existing = inner.split(",").map((s) => s.trim()).filter(Boolean);
        const merged = [...new Set([...existing, ...usedTypes])];
        return `import type { ${merged.join(", ")} } from "${cfg.contract}"`;
      });
    }
  }

  if (c.includes(`${cfg.service}.`) && !c.includes(cfg.servicePath)) {
    const imp = `import { ${cfg.service} } from "${cfg.servicePath}";`;
    if (c.includes('"use client";')) {
      c = c.replace('"use client";', `"use client";\n\n${imp}`);
    } else {
      c = `${imp}\n${c}`;
    }
  }

  // Fix typeof MAINTENANCE_TYPE_OPTIONS / INSPECTION_TYPE_OPTIONS in type positions
  c = c.replace(
    /\(typeof (?:NewMaintenanceServiceMock\.getTypeOptions|MAINTENANCE_TYPE_OPTIONS)\)\[0\]\["icon"\]/g,
    'ReturnType<typeof NewMaintenanceServiceMock.getTypeOptions>[number]["icon"]',
  );
  c = c.replace(
    /\(typeof (?:InspectionServiceMock\.getTypeOptions|INSPECTION_TYPE_OPTIONS)\)\[0\]\["icon"\]/g,
    'ReturnType<typeof InspectionServiceMock.getTypeOptions>[number]["icon"]',
  );
  c = c.replace(
    /typeof (?:NewMaintenanceServiceMock\.getTypeOptions|MAINTENANCE_TYPE_OPTIONS)/g,
    "ReturnType<typeof NewMaintenanceServiceMock.getTypeOptions>",
  );
  c = c.replace(
    /typeof (?:InspectionServiceMock\.getTypeOptions|INSPECTION_TYPE_OPTIONS)/g,
    "ReturnType<typeof InspectionServiceMock.getTypeOptions>",
  );

  if (c !== orig) {
    fs.writeFileSync(file, c);
    return true;
  }
  return false;
}

let count = 0;
for (const cfg of configs) {
  const seen = new Set();
  for (const dir of cfg.dirs) {
    for (const file of walk(dir)) {
      if (seen.has(file)) continue;
      seen.add(file);
      if (processFile(file, cfg)) count++;
    }
  }
}
console.log(`migrated ${count} files`);
