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
    else if (e.name.endsWith(".tsx") || e.name.endsWith(".ts")) files.push(p);
  }
  return files;
}

const replacements = [
  [
    /from "@\/lib\/student-area-mocks"/g,
    'from "@/lib/contracts/student-area"',
  ],
  [
    /from "@\/lib\/student-profile-mocks"/g,
    'from "@/lib/contracts/student/profile"',
  ],
  [
    /from "@\/lib\/student-dashboard-view-mocks"/g,
    'from "@/lib/contracts/student/dashboard-view"',
  ],
  [
    /from "@\/lib\/telemetry-sectors-mocks"/g,
    'from "@/lib/contracts/telemetry/sectors"',
  ],
];

const valueReplacements = [
  ["STUDENT_NAV", "StudentAreaServiceMock.getStudentNav()"],
  ["STUDENT_NAV_HREF", "StudentAreaServiceMock.getStudentNavHref()"],
  ["STUDENT_PROFILE", "StudentAreaServiceMock.getStudentProfile()"],
  ["NEXT_CLASS", "StudentAreaServiceMock.getNextClass()"],
  ["HERO_LEVEL", "StudentAreaServiceMock.getHeroLevel()"],
  ["EVOLUTION_LAP_SERIES", "StudentAreaServiceMock.getEvolutionLapSeries()"],
  ["EVOLUTION_GOAL", "StudentAreaServiceMock.getEvolutionGoal()"],
  ["KPI_METRICS", "StudentAreaServiceMock.getKpiMetrics()"],
  ["NEXT_ACTIVITIES", "StudentAreaServiceMock.getNextActivities()"],
  ["FEEDBACK", "StudentAreaServiceMock.getFeedback()"],
  ["DEVELOPMENT_TABS", "StudentAreaServiceMock.getDevelopmentTabs()"],
  ["DEVELOPMENT_BY_TAB", "StudentAreaServiceMock.getDevelopmentByTab()"],
  ["ACHIEVEMENTS", "StudentAreaServiceMock.getAchievements()"],
  ["LAST_RESULTS", "StudentAreaServiceMock.getLastResults()"],
  ["VIDEO_MATERIALS", "StudentAreaServiceMock.getVideoMaterials()"],
  ["QUICK_ACTIONS", "StudentAreaServiceMock.getQuickActions()"],
  ["TELEMETRY_DEFAULT_SESSION_ID", "TelemetryServiceMock.getTelemetryDefaultSessionId()"],
  ["TELEMETRY_STATS", "TelemetryServiceMock.getTelemetryStats()"],
  ["TELEMETRY_CHART_BY_TAB", "TelemetryServiceMock.getTelemetryChartByTab()"],
  ["TELEMETRY_CHART_GROUP", "TelemetryServiceMock.getTelemetryChartGroup()"],
  ["TELEMETRY_TRACK_LENGTH_M", "TelemetryServiceMock.getTelemetryTrackLengthM()"],
  ["TELEMETRY_Y_AXIS", "TelemetryServiceMock.getTelemetryYAxis()"],
  ["TELEMETRY_CHART_METRICS", "TelemetryServiceMock.getTelemetryChartMetrics()"],
  ["TELEMETRY_LAP_COLORS", "TelemetryServiceMock.getTelemetryLapColors()"],
  ["TELEMETRY_SESSION_LAPS", "TelemetryServiceMock.getTelemetrySessionLaps()"],
  ["TELEMETRY_TRACK_MAP", "TelemetryServiceMock.getTelemetryTrackMap()"],
  ["telemetryYExtentForLaps", "TelemetryServiceMock.telemetryYExtentForLaps"],
  ["telemetryLapSeries", "TelemetryServiceMock.telemetryLapSeries"],
  ["getSectorsPageData", "TelemetryServiceMock.getSectorsPageData"],
  ["formatSectorTime", "TelemetryServiceMock.formatSectorTime"],
  ["formatDelta", "TelemetryServiceMock.formatDelta"],
  ["parseSectorTime", "TelemetryServiceMock.parseSectorTime"],
  ["getLapCellHighlight", "TelemetryServiceMock.getLapCellHighlight"],
  ["compareLaps", "TelemetryServiceMock.compareLaps"],
  ["getDashboardViewData", "StudentDashboardServiceMock.getDashboardViewData"],
  ["getDefaultPilotViewId", "StudentDashboardServiceMock.getDefaultPilotViewId"],
  ["getPilotViewOptions", "StudentDashboardServiceMock.getPilotViewOptions"],
  ["getStudentSessionKind", "StudentDashboardServiceMock.getStudentSessionKind"],
  ["getProfileAccount", "StudentProfileServiceMock.getProfileAccount"],
  ["getProfileNavSections", "StudentProfileServiceMock.getProfileNavSections"],
  ["shouldShowPilotData", "StudentProfileServiceMock.shouldShowPilotData"],
  ["formatProfileName", "StudentProfileServiceMock.formatProfileName"],
  ["getDisplayPilotCategory", "StudentProfileServiceMock.getDisplayPilotCategory"],
  ["getLevelLabel", "StudentProfileServiceMock.getLevelLabel"],
  ["formatBirthDateDisplay", "StudentProfileServiceMock.formatBirthDateDisplay"],
  ["formatPhoneBr", "StudentProfileServiceMock.formatPhoneBr"],
  ["getAutoPilotCategory", "StudentProfileServiceMock.getAutoPilotCategory"],
  ["getCategoryLabel", "StudentProfileServiceMock.getCategoryLabel"],
  ["isMinorProfile", "StudentProfileServiceMock.isMinorProfile"],
  ["formatProfileAcceptedDate", "StudentProfileServiceMock.formatProfileAcceptedDate"],
  ["BRAZIL_STATES", "StudentProfileServiceMock.getBrazilStates()"],
  ["RELATIONSHIP_DEGREE_OPTIONS", "StudentProfileServiceMock.getRelationshipDegreeOptions()"],
  ["getRegisterPilotFieldErrors", "StudentProfileServiceMock.getRegisterPilotFieldErrors"],
  ["hasRegisterPilotErrors", "StudentProfileServiceMock.hasRegisterPilotErrors"],
  ["buildRegisterPilotUsername", "StudentProfileServiceMock.buildRegisterPilotUsername"],
];

function ensureImports(content, imports) {
  let next = content;
  for (const imp of imports) {
    if (!next.includes(imp.split(" from ")[0])) {
      const useClient = next.startsWith('"use client"');
      const insert = `${imp}\n`;
      if (useClient) {
        next = next.replace(/^"use client";\n\n/, `"use client";\n\n${insert}`);
      } else {
        next = `${insert}${next}`;
      }
    }
  }
  return next;
}

for (const file of walk(studentDir)) {
  let content = fs.readFileSync(file, "utf8");
  const orig = content;
  if (!content.includes("-mocks")) continue;

  for (const [from, to] of replacements) {
    content = content.replace(from, to);
  }

  const needsArea =
    /StudentAreaServiceMock\./.test(content) &&
    !content.includes('from "@/services/student/studentAreaServiceMock"');
  const needsDash =
    /StudentDashboardServiceMock\./.test(content) &&
    !content.includes('from "@/services/student/studentDashboardServiceMock"');
  const needsProfile =
    /StudentProfileServiceMock\./.test(content) &&
    !content.includes('from "@/services/student/studentProfileServiceMock"');
  const needsTelemetry =
    /TelemetryServiceMock\./.test(content) &&
    !content.includes('from "@/services/telemetry/telemetryServiceMock"');

  const imports = [];
  if (needsArea)
    imports.push(
      'import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";',
    );
  if (needsDash)
    imports.push(
      'import { StudentDashboardServiceMock } from "@/services/student/studentDashboardServiceMock";',
    );
  if (needsProfile)
    imports.push(
      'import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";',
    );
  if (needsTelemetry)
    imports.push(
      'import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";',
    );

  if (imports.length) content = ensureImports(content, imports);

  for (const [from, to] of valueReplacements) {
    if (content.includes(from) && !content.includes(to)) {
      content = content.replaceAll(from, to);
    }
  }

  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log("updated", path.relative(root, file));
  }
}
