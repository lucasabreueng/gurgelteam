import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const studentDir = path.join(root, "components", "student-area");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(p));
    else if (e.name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

const typeByContract = {
  "student-area": [
    "NavItemKey",
    "Achievement",
    "DevTabKey",
    "ResultRow",
    "TimelineItem",
    "EvolutionLapPoint",
    "QuickAction",
    "TelemetryPilotSession",
    "TelemetryTabKey",
  ],
  "student/profile": [
    "ProfileDemoKey",
    "ProfileId",
    "StudentAccountBundle",
    "StudentUserProfile",
    "AccountRole",
    "ProfileNavSection",
    "GuardianInfo",
    "LinkedPilotCard",
    "RegisterPilotFieldErrors",
  ],
  "student/dashboard-view": ["PilotViewOption"],
  "telemetry/sectors": [
    "SectorsPageData",
    "SectorsPageSummary",
    "SectorPerformance",
    "SectorsInsight",
    "TrackMapSegment",
    "SectorModuleData",
    "SectorsLapRecord",
    "SectorId",
    "IdealLapData",
  ],
};

function buildImportBlock(content) {
  const block = [];
  if (/StudentAreaServiceMock/.test(content)) {
    block.push(
      'import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";',
    );
  }
  if (/StudentDashboardServiceMock/.test(content)) {
    block.push(
      'import { StudentDashboardServiceMock } from "@/services/student/studentDashboardServiceMock";',
    );
  }
  if (/StudentProfileServiceMock/.test(content)) {
    block.push(
      'import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";',
    );
  }
  if (/TelemetryServiceMock/.test(content)) {
    block.push(
      'import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";',
    );
  }
  for (const [contract, types] of Object.entries(typeByContract)) {
    const used = types.filter((t) => new RegExp(`\\b${t}\\b`).test(content));
    if (used.length) {
      block.push(
        `import type { ${used.join(", ")} } from "@/lib/contracts/${contract}";`,
      );
    }
  }
  return block;
}

function insertImports(content, block) {
  if (!block.length) return content;
  const blockText = `${block.join("\n")}\n`;
  if (block.every((line) => content.includes(line))) return content;

  if (content.startsWith('"use client"')) {
    const end = content.indexOf("\n") + 1;
    return `${content.slice(0, end)}\n${blockText}${content.slice(end)}`;
  }
  return `${blockText}\n${content}`;
}

for (const file of walk(studentDir)) {
  let content = fs.readFileSync(file, "utf8");
  const orig = content;
  const block = buildImportBlock(content);
  content = insertImports(content, block);
  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log("ensured", path.relative(root, file));
  }
}
