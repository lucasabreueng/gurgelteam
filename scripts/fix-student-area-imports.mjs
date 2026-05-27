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
  ],
};

for (const file of walk(studentDir)) {
  let content = fs.readFileSync(file, "utf8");
  const orig = content;

  content = content.replace(
    /StudentAreaServiceMock\.getStudentNav\(\)_HREF/g,
    "StudentAreaServiceMock.getStudentNavHref()",
  );

  if (!/import\s*\{[^}]*ServiceMock\./.test(content)) continue;

  content = content.replace(
    /import\s*\{[^}]*ServiceMock\.[^}]*\}\s*from\s*"@\/lib\/[^"]+";?\n?/g,
    "",
  );

  const needsArea = /StudentAreaServiceMock\./.test(content);
  const needsDash = /StudentDashboardServiceMock\./.test(content);
  const needsProfile = /StudentProfileServiceMock\./.test(content);
  const needsTelemetry = /TelemetryServiceMock\./.test(content);

  const lines = [];
  if (needsArea)
    lines.push(
      'import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";',
    );
  if (needsDash)
    lines.push(
      'import { StudentDashboardServiceMock } from "@/services/student/studentDashboardServiceMock";',
    );
  if (needsProfile)
    lines.push(
      'import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";',
    );
  if (needsTelemetry)
    lines.push(
      'import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";',
    );

  for (const [contract, types] of Object.entries(typeByContract)) {
    const used = types.filter((t) => new RegExp(`\\b${t}\\b`).test(content));
    if (used.length) {
      lines.push(
        `import type { ${used.join(", ")} } from "@/lib/contracts/${contract}";`,
      );
    }
  }

  const insert = `${lines.join("\n")}\n`;
  if (content.startsWith('"use client"')) {
    content = content.replace(/^"use client";\n\n/, `"use client";\n\n${insert}`);
  } else {
    content = `${insert}${content}`;
  }

  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log("fixed", path.relative(root, file));
  }
}
