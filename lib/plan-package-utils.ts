/** Formatação de valor e validade — planos Gurgel Team */

export function parseBRLToCents(value: string): number {
  const digits = value.replace(/\D/g, "");
  return parseInt(digits || "0", 10);
}

export function formatCentsToBRL(cents: number): string {
  const reais = cents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(reais);
}

export function parseValidityDays(value: string): number {
  const digits = value.replace(/\D/g, "");
  const n = parseInt(digits || "0", 10);
  return Math.max(0, n);
}

/** Converte mocks legados "R$ 1.200,50" ou "30 dias" */
export function legacyPriceToCents(price: string): number {
  return parseBRLToCents(price);
}

export function legacyValidityToDays(validity: string): number {
  return parseValidityDays(validity) || 30;
}

/** Centésimos de segundo (5532 = 55,32 s) */
export function parseTimeHundredths(value: string): number {
  const digits = value.replace(/\D/g, "");
  return parseInt(digits || "0", 10);
}

export function formatTimeHundredths(hundredths: number): string {
  const seconds = hundredths / 100;
  return seconds.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
