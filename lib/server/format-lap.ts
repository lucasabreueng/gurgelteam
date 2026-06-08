/** Formata tempo de volta em ms para exibição (mm:ss.mmm ou ss.mmm). */
export function formatLapMs(ms: number): string {
  const totalSec = ms / 1000;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > 0) {
    return `${min}:${sec.toFixed(3).padStart(6, "0")}`;
  }
  return sec.toFixed(3);
}
