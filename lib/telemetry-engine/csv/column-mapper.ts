import type { ColumnMapping, RawCsvRow } from "../types";
import { normalizeGpsCoordinate } from "./gps-coords";
import { parseNumber } from "./parse-csv";

type AliasGroup = {
  key: keyof ColumnMapping;
  aliases: string[];
};

const ALIAS_GROUPS: AliasGroup[] = [
  {
    key: "timestamp",
    aliases: ["timestamp", "utc", "date time", "datetime", "gps utc"],
  },
  {
    key: "sessionTime",
    aliases: [
      "time",
      "tempo",
      "session time",
      "elapsed",
      "elapsed time",
      "t(s)",
      "t (s)",
    ],
  },
  {
    key: "latitude",
    aliases: [
      "gps latitude",
      "gps lat",
      "gps pos lat",
      "gps n/s",
      "gps ns",
      "latitude",
      "latitudine",
      "lat",
      "lat.",
      "gps latitudine",
      "lat [degrees]",
      "lat degrees",
      "n/s",
      "pos lat",
    ],
  },
  {
    key: "longitude",
    aliases: [
      "gps longitude",
      "gps lon",
      "gps lng",
      "gps pos lon",
      "gps e/w",
      "gps ew",
      "longitude",
      "longitudine",
      "lon",
      "lon.",
      "lng",
      "long",
      "gps longitudine",
      "lon [degrees]",
      "lon degrees",
      "e/w",
      "pos lon",
    ],
  },
  {
    key: "speed",
    aliases: [
      "gps speed",
      "speed gps",
      "speed",
      "velocity",
      "velocidade",
      "gps speed [km/h]",
      "speed [km/h]",
      "speed2d",
      "speed 2d",
    ],
  },
  {
    key: "rpm",
    aliases: ["rpm", "engine rpm", "motore rpm", "engine speed"],
  },
  {
    key: "longitudinalG",
    aliases: [
      "gps lonacc",
      "gps lon acc",
      "lon acc",
      "longitudinal",
      "long acc",
      "gf. x",
      "gf x",
      "g force x",
      "acc x",
    ],
  },
  {
    key: "lateralG",
    aliases: [
      "gps latacc",
      "gps lat acc",
      "lat acc",
      "lateral",
      "lat acc",
      "gf. y",
      "gf y",
      "g force y",
      "acc y",
    ],
  },
  {
    key: "gyro",
    aliases: ["gps gyro", "gyro", "gyro z", "gyroscope"],
  },
  {
    key: "heading",
    aliases: [
      "heading",
      "orientation",
      "gps heading",
      "course",
      "bearing",
      "gps course",
    ],
  },
  {
    key: "altitude",
    aliases: ["altitude", "gps altitude", "alt", "elev"],
  },
  {
    key: "rawDistance",
    aliases: [
      "distance on gps speed",
      "distance",
      "dist",
      "gps distance",
      "lap distance",
      "distance [m]",
    ],
  },
];

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/[\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveHeader(headers: string[], wanted: string): string | undefined {
  const target = normalizeKey(wanted);
  for (const header of headers) {
    if (normalizeKey(header) === target) return header;
  }
  for (const header of headers) {
    const h = normalizeKey(header);
    if (h.includes(target) || target.includes(h)) return header;
  }
  return undefined;
}

export function resolveHeaderAny(headers: string[], wanted: string[]): string | undefined {
  for (const name of wanted) {
    const resolved = resolveHeader(headers, name);
    if (resolved) return resolved;
  }
  return undefined;
}

function scoreCoordinateHeader(header: string, kind: "latitude" | "longitude"): number {
  if (isExcludedCoordinateHeader(header, kind)) return 0;
  const h = normalizeKey(header);

  if (kind === "latitude") {
    if (homeCoordinateMatch(h, /^(gps\s*)?(latitude|latitudine)(\s|$|\[)/)) return 98;
    if (homeCoordinateMatch(h, /^gps\s*(pos\s*)?lat(\s|$|\[)/)) return 96;
    if (homeCoordinateMatch(h, /^gps\s*n\s*\/?\s*s(\s|$|\[)/)) return 94;
    if (homeCoordinateMatch(h, /^(latitude|latitudine)(\s|$|\[)/)) return 90;
    if (homeCoordinateMatch(h, /^lat(\s|$|\[)/)) return 82;
    if (homeCoordinateMatch(h, /^lat\.?(\s|$|\[)/)) return 86;
    if (/gps/.test(h) && /lat|n s|n\/s/.test(h) && !/acc/.test(h)) return 78;
  } else {
    if (homeCoordinateMatch(h, /^(gps\s*)?(longitude|longitudine)(\s|$|\[)/)) return 98;
    if (homeCoordinateMatch(h, /^gps\s*(pos\s*)?(lon|lng)(\s|$|\[)/)) return 96;
    if (homeCoordinateMatch(h, /^gps\s*e\s*\/?\s*w(\s|$|\[)/)) return 94;
    if (homeCoordinateMatch(h, /^(longitude|longitudine)(\s|$|\[)/)) return 90;
    if (homeCoordinateMatch(h, /^(lon|lng)(\s|$|\[)/)) return 82;
    if (homeCoordinateMatch(h, /^lon\.?(\s|$|\[)/)) return 86;
    if (/gps/.test(h) && /lon|lng|e w|e\/w/.test(h) && !/acc/.test(h)) return 78;
  }

  return 0;
}

function homeCoordinateMatch(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

function isExcludedCoordinateHeader(header: string, kind: "latitude" | "longitude"): boolean {
  const h = normalizeKey(header);
  if (/acc|accel|gyro|speed|heading|course|altitude|alt\b|rpm|temp|pressure/.test(h)) {
    return !/(latitude|longitude|latitudine|longitudine)/.test(h);
  }
  if (kind === "latitude" && /\blon\b|longitude|longitudine/.test(h) && !/latitude|latitudine/.test(h)) {
    return true;
  }
  if (kind === "longitude" && /\blat\b|latitude|latitudine/.test(h) && !/longitude|longitudine/.test(h)) {
    return true;
  }
  return false;
}

function isExcludedSessionTimeHeader(header: string): boolean {
  const h = normalizeKey(header);
  if (/time\s*lap|time\s*strip|lap\s*time|strip\s*time/.test(h)) return true;
  if (/absolute\s*time|utc\s*time/.test(h)) return true;
  return false;
}

function scoreHeaderForAlias(header: string, alias: string): number {
  const h = normalizeKey(header);
  const a = normalizeKey(alias);
  if (h === a) return 100;
  if (a === "time" && isExcludedSessionTimeHeader(header)) return 0;
  if (h.startsWith(a) || h.endsWith(a)) return 70;
  if (h.includes(a)) return 40;
  if (a.includes(h) && h.length > 2) return 30;
  return 0;
}

function bestHeaderForGroup(
  headers: string[],
  group: AliasGroup,
): string | undefined {
  let bestHeader: string | undefined;
  let bestScore = 0;

  for (const header of headers) {
    if (
      (group.key === "latitude" || group.key === "longitude") &&
      isExcludedCoordinateHeader(header, group.key)
    ) {
      continue;
    }
    if (group.key === "sessionTime" && isExcludedSessionTimeHeader(header)) {
      continue;
    }

    for (const alias of group.aliases) {
      const score = scoreHeaderForAlias(header, alias);
      if (score > bestScore) {
        bestScore = score;
        bestHeader = header;
      }
    }

    if (group.key === "latitude" || group.key === "longitude") {
      const patternScore = scoreCoordinateHeader(header, group.key);
      if (patternScore > bestScore) {
        bestScore = patternScore;
        bestHeader = header;
      }
    }
  }

  return bestScore >= 30 ? bestHeader : undefined;
}

function numericValuesForColumn(
  rows: RawCsvRow[],
  header: string,
  maxRows = 250,
): number[] {
  const values: number[] = [];
  for (const row of rows.slice(0, maxRows)) {
    const raw = getRowValue(row, header);
    const n = parseNumber(raw);
    if (n != null) values.push(n);
  }
  return values;
}

function looksLikeLatitudeColumn(values: number[]): number {
  if (values.length < 8) return 0;
  let hits = 0;
  for (const raw of values) {
    const v = normalizeGpsCoordinate(raw, "lat") ?? raw;
    if (Math.abs(v) >= 0.5 && Math.abs(v) <= 90) hits += 1;
  }
  return hits / values.length;
}

function looksLikeLongitudeColumn(values: number[]): number {
  if (values.length < 8) return 0;
  let hits = 0;
  for (const raw of values) {
    const v = normalizeGpsCoordinate(raw, "lon") ?? raw;
    if (Math.abs(v) >= 0.5 && Math.abs(v) <= 180) hits += 1;
  }
  return hits / values.length;
}

export function inferCoordinateColumnsFromData(
  headers: string[],
  rows: RawCsvRow[],
): Pick<ColumnMapping, "latitude" | "longitude"> {
  const latCandidates: { header: string; score: number }[] = [];
  const lonCandidates: { header: string; score: number }[] = [];

  for (const header of headers) {
    if (!header.trim()) continue;
    const values = numericValuesForColumn(rows, header);
    const latScore = looksLikeLatitudeColumn(values);
    const lonScore = looksLikeLongitudeColumn(values);

    if (latScore >= 0.75) latCandidates.push({ header, score: latScore });
    if (lonScore >= 0.75) lonCandidates.push({ header, score: lonScore });
  }

  latCandidates.sort((a, b) => b.score - a.score);
  lonCandidates.sort((a, b) => b.score - a.score);

  const latitude =
    latCandidates.find((c) => c.header !== lonCandidates[0]?.header)?.header ??
    latCandidates[0]?.header;
  const longitude =
    lonCandidates.find((c) => c.header !== latitude)?.header ??
    lonCandidates[0]?.header;

  return { latitude, longitude };
}

export function buildColumnMapping(
  headers: string[],
  overrides?: Partial<ColumnMapping>,
  sampleRows?: RawCsvRow[],
): ColumnMapping {
  const mapping: ColumnMapping = {};

  if (overrides) {
    for (const [key, column] of Object.entries(overrides) as [
      keyof ColumnMapping,
      string | undefined,
    ][]) {
      if (!column) continue;
      const resolved = resolveHeader(headers, column);
      if (resolved) mapping[key] = resolved;
    }
  }

  for (const group of ALIAS_GROUPS) {
    if (mapping[group.key]) continue;
    const header = bestHeaderForGroup(headers, group);
    if (header) mapping[group.key] = header;
  }

  if ((!mapping.latitude || !mapping.longitude) && sampleRows && sampleRows.length > 0) {
    const inferred = inferCoordinateColumnsFromData(headers, sampleRows);
    if (!mapping.latitude && inferred.latitude) mapping.latitude = inferred.latitude;
    if (!mapping.longitude && inferred.longitude) mapping.longitude = inferred.longitude;
  }

  return mapping;
}

export function mappingScore(
  mapping: ColumnMapping,
  required: (keyof ColumnMapping)[] = ["latitude", "longitude", "sessionTime"],
): number {
  let score = 0;
  for (const key of required) {
    if (mapping[key]) score += 2;
  }
  const optional: (keyof ColumnMapping)[] = [
    "speed",
    "rpm",
    "longitudinalG",
    "lateralG",
    "gyro",
    "heading",
    "rawDistance",
  ];
  for (const key of optional) {
    if (mapping[key]) score += 1;
  }
  return score;
}

export function getRowValue(
  row: Record<string, string>,
  column: string | undefined,
): string {
  if (!column) return "";
  if (row[column] != null) return row[column];
  const lower = column.toLowerCase();
  for (const [k, v] of Object.entries(row)) {
    if (k.toLowerCase() === lower) return v;
  }
  return "";
}
