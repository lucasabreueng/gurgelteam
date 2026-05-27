/**
 * Verificação Alfano com padrão MARTINHO.csv (node scripts/verify-alfano-parse.mjs)
 */
const HEADER =
  "Lap;Time Lap;Strip;Time Strip;Absolute Time;Time;Distance;RPM;Speed GPS;Lat.;Lon.;Altitude";
const ROWS = [
  "1;47.01;1;47.01;0;0;0;4408;67.9;-15.8260913;-47.9711232;1081",
  ";;;;0.01;0.01;0.19;4411;67.9;-15.8260938;-47.9711216;1081",
  ";;;;0.02;0.02;0.38;4413;68;-15.8260962;-47.97112;1081",
  ";;;;46.99;46.99;779.45;4688;69.3;-15.8260899;-47.9711236;1081",
  ";;;;;;;;;;;;;;;;;;",
  "2;45.8;1;45.8;47.01;0;0;4693;69.4;-15.8260911;-47.9711228;1083",
  ";;;;47.01;0.01;0.19;4696;69.5;-15.8260914;-47.9711226;1083",
  ";;;;47.02;0.02;0.39;4700;69.6;-15.8260916;-47.9711225;1083",
];

function parseCsvLine(line, delimiter) {
  const fields = [];
  let current = "";
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === delimiter) {
      fields.push(current.trim());
      current = "";
    } else current += c;
  }
  fields.push(current.trim());
  return fields;
}

function toRows(headerLine, dataLines) {
  const headers = parseCsvLine(headerLine, ";");
  return dataLines.map((line) => {
    const fields = parseCsvLine(line, ";");
    const row = {};
    for (let c = 0; c < headers.length; c++) {
      row[headers[c]] = fields[c] ?? "";
    }
    return row;
  });
}

function buildSessionTimes(rows) {
  const times = [];
  let last = 0;
  let lapBase = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const isMarker = r.Lap?.trim() !== "";
    const abs = r["Absolute Time"]?.trim() ? Number(r["Absolute Time"]) : null;
    const rel = r.Time?.trim() ? Number(r.Time) : null;
    if (isMarker && abs != null) lapBase = abs;
    let t;
    if (abs != null && !Number.isNaN(abs)) t = abs;
    else if (rel != null) t = lapBase + rel;
    else t = last + 0.01;
    if (t <= last) t = last + 0.01;
    times.push(t);
    last = t;
  }
  return times;
}

const rows = toRows(HEADER, ROWS);
const times = buildSessionTimes(rows);

const checks = [
  [0, 0],
  [1, 0.01],
  [3, 46.99],
  [5, 47.01],
  [6, 47.01],
  [7, 47.02],
];

let ok = true;
for (const [idx, expected] of checks) {
  if (Math.abs(times[idx] - expected) > 0.02) {
    console.error(`Linha ${idx + 1}: esperado ~${expected}, obtido ${times[idx]}`);
    ok = false;
  }
}

console.log("Timeline:", times.map((t) => t.toFixed(2)).join(", "));
console.log("Time Lap linha 1 (referência, não eixo):", rows[0]["Time Lap"]);

if (!ok) process.exit(1);
console.log("verify-alfano-parse: OK");
