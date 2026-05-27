import type { AdapterDetectResult, ColumnMapping, RawCsvRow } from "../types";
import { mappingScore } from "../csv/column-mapper";
import { alfanoAdapter } from "./alfano-adapter";
import { genericGpsAdapter } from "./generic-gps-adapter";
import { mychronAdapter } from "./mychron-adapter";
import type { TelemetryAdapter } from "./base-adapter";

export const TELEMETRY_ADAPTERS: TelemetryAdapter[] = [
  mychronAdapter,
  alfanoAdapter,
  genericGpsAdapter,
];

export function detectAdapter(
  headers: string[],
  sampleRows: RawCsvRow[],
  preferredSource?: string,
): AdapterDetectResult {
  const scored = TELEMETRY_ADAPTERS.map((adapter) => {
    const signalScore = adapter.canParse(headers, sampleRows);
    const mapping = adapter.getMapping(headers, sampleRows);
    const mapScore = mappingScore(mapping);
    let confidence = signalScore * 3 + mapScore;

    if (preferredSource === adapter.id) confidence += 10;
    if (preferredSource === "gopro" && adapter.id === "generic_gps") confidence += 8;

    return { adapter, confidence, mapping };
  }).sort((a, b) => b.confidence - a.confidence);

  const best = scored[0] ?? {
    adapter: genericGpsAdapter,
    confidence: 0,
    mapping: genericGpsAdapter.getMapping(headers, sampleRows),
  };

  return {
    adapterId: best.adapter.id,
    confidence: best.confidence,
    mapping: best.mapping,
  };
}

export function getAdapterById(id: string): TelemetryAdapter {
  return (
    TELEMETRY_ADAPTERS.find((a) => a.id === id) ?? genericGpsAdapter
  );
}

export function normalizeWithAdapter(
  adapterId: string,
  rows: RawCsvRow[],
  mapping?: ColumnMapping,
): ReturnType<TelemetryAdapter["normalize"]> {
  const adapter = getAdapterById(adapterId);
  const map = mapping ?? adapter.getMapping(Object.keys(rows[0] ?? {}));
  return adapter.normalize(rows, map);
}
