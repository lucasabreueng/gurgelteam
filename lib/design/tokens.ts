/** Valores canônicos — alinhados a `docs/DESIGN_SYSTEM.md` §2.2 */
export const adminColors = {
  accent: "#0d1f3c",
  accentDark: "#0a1630",
  panelBg: "#f3f5f9",
  inputBg: "#fafbfc",
  text: "#111111",
  error: "#c41e3a",
  border: "rgba(17,17,17,0.08)",
  borderSubtle: "rgba(17,17,17,0.06)",
  borderRow: "rgba(17,17,17,0.05)",
  borderField: "rgba(17,17,17,0.1)",
  borderInput: "rgba(17,17,17,0.12)",
  borderDashed: "rgba(17,17,17,0.12)",
  shadowCard: "0 2px 12px rgba(13,31,60,0.04)",
  shadowCardHover: "0 6px 24px rgba(13,31,60,0.08)",
  shadowDrawer: "-12px 0 48px rgba(13,31,60,0.2)",
} as const;

export const adminRadius = {
  card: "rounded-2xl",
  input: "rounded-xl",
  button: "rounded-xl",
} as const;

/** Cor accent para gráficos (ECharts etc.) — reativa ao tema via CSS var */
export const adminChartAccentColor = "var(--color-accent)";
