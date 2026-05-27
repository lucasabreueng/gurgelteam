/** Aceita apenas dígitos para estoque inteiro positivo. */
export function sanitizePositiveIntInput(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function parsePositiveInt(value: string): number | null {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

/** Permite dígitos e separador decimal durante digitação. */
export function sanitizeUnitCostInput(raw: string): string {
  const cleaned = raw.replace(/[^\d,.]/g, "");
  const comma = cleaned.indexOf(",");
  const dot = cleaned.indexOf(".");
  const sep =
    comma >= 0 && dot >= 0
      ? Math.min(comma, dot)
      : comma >= 0
        ? comma
        : dot;
  if (sep < 0) return cleaned;
  const head = cleaned.slice(0, sep + 1);
  const tail = cleaned.slice(sep + 1).replace(/[,.]/g, "");
  return head + tail.slice(0, 2);
}

export function formatUnitCostBlur(value: string): string {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return "";
  const num = Number.parseFloat(normalized);
  if (!Number.isFinite(num) || num < 0) return "";
  return num.toFixed(2).replace(".", ",");
}

export function parseUnitCost(value: string): number | null {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;
  const num = Number.parseFloat(normalized);
  if (!Number.isFinite(num) || num < 0) return null;
  return Math.round(num * 100) / 100;
}
