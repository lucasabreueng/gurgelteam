/** Formatação e validação — peso e altura no perfil */

/** Extrai apenas dígitos do peso (máx. 5: 999,99) */
function weightDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

/**
 * Peso (kg): somente positivo, vírgula automática nas 2 casas decimais.
 * Ex.: digitar 7250 → 72,50
 */
export function formatWeightKgInput(value: string): string {
  const digits = weightDigits(value);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  const intPart = digits.slice(0, -2).slice(0, 3);
  const decPart = digits.slice(-2);
  return `${intPart},${decPart}`;
}

/** Completa com ,00 ao sair do campo */
export function finalizeWeightKg(value: string): string {
  const digits = weightDigits(value);
  if (!digits) return "";
  if (digits.length <= 2) {
    return `${digits},00`;
  }
  return formatWeightKgInput(value);
}

export function isValidWeightKg(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (!/^\d{2,3},\d{2}$/.test(trimmed)) return false;
  const normalized = trimmed.replace(",", ".");
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) && n > 0;
}

export function getWeightKgError(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (!isValidWeightKg(value)) {
    return "Informe entre 10,00 e 999,99 kg.";
  }
  return undefined;
}

/** Altura (cm): somente inteiros, 2 a 3 dígitos */
export function formatHeightCmInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 3);
}

export function isValidHeightCm(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return /^\d{2,3}$/.test(trimmed);
}

export function getHeightCmError(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (!isValidHeightCm(value)) {
    return "Informe entre 10 e 999 cm (2 ou 3 dígitos, sem decimais).";
  }
  return undefined;
}
