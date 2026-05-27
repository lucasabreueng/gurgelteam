import type { ParseResult, RawCsvRow } from "../types";

function countDelimiter(line: string, delimiter: string): number {
  let count = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === delimiter && !inQuotes) count++;
  }
  return count;
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === delimiter && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  fields.push(current.trim());
  return fields;
}

function normalizeHeader(h: string): string {
  return h.replace(/^\uFEFF/, "").trim();
}

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Metadado no fim da linha de cabeçalho Alfano: `;UTC time : 115809.00` */
function stripAlfanoUtcSuffix(line: string): string {
  return line.replace(/;?\s*UTC\s*time\s*:\s*[\d.,]+\s*$/i, "");
}

function isAlfanoHeaderRow(fields: string[]): boolean {
  const keys = fields.map((f) => normalizeKey(f));
  const hasLap = keys.some((k) => k === "lap");
  const hasTimeLap = keys.some((k) => k === "time lap" || k.includes("time lap"));
  const hasStrip = keys.some((k) => k === "strip");
  const hasSpeedGps = keys.some(
    (k) => k === "speed gps" || k.includes("speed gps"),
  );
  const hasLat = keys.some((k) => k === "lat." || k === "lat" || /^lat\.?$/.test(k));
  const hasLon = keys.some((k) => k === "lon." || k === "lon" || /^lon\.?$/.test(k));
  return hasLap && hasTimeLap && hasStrip && hasSpeedGps && hasLat && hasLon;
}

function isAimChannelHeaderRow(fields: string[]): boolean {
  const cleaned = fields.map(normalizeHeader).filter(Boolean);
  if (cleaned.length < 10) return false;

  const first = normalizeKey(cleaned[0]);
  if (first !== "time" && first !== "tempo") return false;

  const joined = cleaned.join(" ").toLowerCase();
  return (
    joined.includes("gps latitude") &&
    joined.includes("gps longitude") &&
    joined.includes("gps speed")
  );
}

function detectDelimiter(lines: string[]): string {
  const candidates = [",", ";", "\t"];

  for (let i = 0; i < Math.min(lines.length, 80); i++) {
    for (const d of candidates) {
      const fields = parseCsvLine(lines[i], d).map(normalizeHeader);
      if (isAimChannelHeaderRow(fields)) return d;
      if (isAlfanoHeaderRow(fields)) return d;
    }
  }

  let best = ",";
  let bestScore = 0;

  for (const d of candidates) {
    const counts = lines
      .slice(0, 30)
      .filter((l) => l.trim().length > 0)
      .map((l) => parseCsvLine(l, d).length);
    if (counts.length === 0) continue;
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    if (avg > bestScore) {
      bestScore = avg;
      best = d;
    }
  }

  return best;
}

function parseNumber(raw: string): number | null {
  if (!raw || raw === "-" || raw === "N/A") return null;
  const cleaned = raw.replace(/\s/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function looksLikeUnitsRow(fields: string[]): boolean {
  const joined = fields.join(" ").toLowerCase();
  const unitSignals = ["km/h", "deg", "degree", "°", "m/s", " rad", "percent", "g/s"];
  let hits = 0;
  for (const signal of unitSignals) {
    if (joined.includes(signal)) hits += 1;
  }
  if (hits >= 2) return true;
  const nonNumeric = fields.filter((f) => f.trim() && parseNumber(f) == null).length;
  return fields.length >= 4 && nonNumeric >= Math.ceil(fields.length * 0.45);
}

function looksLikeHeader(fields: string[]): boolean {
  return scoreHeaderCandidate(fields) >= 5;
}

function scoreHeaderCandidate(fields: string[]): number {
  const cleaned = fields.map(normalizeHeader).filter(Boolean);
  if (cleaned.length < 4) return 0;
  if (looksLikeUnitsRow(fields)) return -10;

  if (isAimChannelHeaderRow(fields)) return 200;
  if (isAlfanoHeaderRow(fields)) return 195;

  const joined = cleaned.join(" ").toLowerCase();
  let score = 0;

  if (/(\btime\b|tempo|elapsed|\bt\b\s*\(?\s*s\s*\)?)/.test(joined)) score += 3;
  if (/gps/.test(joined)) score += 2;
  if (/speed|rpm|acc|gyro|distance|latacc|lonacc/.test(joined)) score += 1;
  if (/(latitude|latitudine|gps lat|\blat\b|n\/s|n s)/.test(joined)) score += 6;
  if (/(longitude|longitudine|gps lon|\blon\b|e\/w|e w|lng)/.test(joined)) score += 6;

  if (cleaned.length <= 2 && /session|format|vehicle|date|duration|notes|beacon/.test(joined)) {
    score -= 8;
  }

  return score;
}

function findHeaderRowIndex(rawLines: string[], delimiter: string): number {
  for (let i = 0; i < Math.min(rawLines.length, 80); i++) {
    const fields = parseCsvLine(rawLines[i], delimiter).map(normalizeHeader);
    if (isAimChannelHeaderRow(fields)) return i;
    if (isAlfanoHeaderRow(fields)) return i;
  }

  let bestIndex = 0;
  let bestScore = 0;

  for (let i = 0; i < Math.min(rawLines.length, 80); i++) {
    const fields = parseCsvLine(rawLines[i], delimiter).map(normalizeHeader);
    const score = scoreHeaderCandidate(fields);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestScore >= 5 ? bestIndex : 0;
}

export function parseCsvContent(content: string): ParseResult {
  const rawLines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const delimiter = detectDelimiter(rawLines);

  const headerRowIndex = findHeaderRowIndex(rawLines, delimiter);

  if (headerRowIndex >= 0 && headerRowIndex < rawLines.length) {
    const probe = parseCsvLine(rawLines[headerRowIndex], delimiter).map(
      normalizeHeader,
    );
    if (isAlfanoHeaderRow(probe)) {
      rawLines[headerRowIndex] = stripAlfanoUtcSuffix(rawLines[headerRowIndex]);
    }
  }

  const headers = parseCsvLine(rawLines[headerRowIndex], delimiter).map(
    normalizeHeader,
  );
  const rows: RawCsvRow[] = [];

  let dataStart = headerRowIndex + 1;
  if (dataStart < rawLines.length) {
    const probe = parseCsvLine(rawLines[dataStart], delimiter);
    if (looksLikeUnitsRow(probe)) dataStart += 1;
  }

  for (let i = dataStart; i < rawLines.length; i++) {
    const fields = parseCsvLine(rawLines[i], delimiter);
    if (fields.every((f) => !f.trim())) continue;
    const row: RawCsvRow = {};
    for (let c = 0; c < headers.length; c++) {
      row[headers[c]] = fields[c] ?? "";
    }
    rows.push(row);
  }

  return {
    headers,
    rows,
    delimiter,
    headerRowIndex,
    skippedLines: headerRowIndex,
  };
}

export { parseNumber };

export async function readFileAsText(file: File): Promise<string> {
  return file.text();
}

export function sampleRows(
  rows: RawCsvRow[],
  count = 5,
): RawCsvRow[] {
  return rows.slice(0, count);
}
