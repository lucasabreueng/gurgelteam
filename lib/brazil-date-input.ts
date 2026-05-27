/** Entrada manual de data no formato brasileiro dd/mm/aaaa */

export function formatBrazilDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function isCompleteBrazilDate(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
}

/** Converte dd/mm/aaaa para ISO yyyy-mm-dd (mock/persistência). */
export function brazilDateToIso(value: string): string {
  if (!isCompleteBrazilDate(value)) return "";
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}
