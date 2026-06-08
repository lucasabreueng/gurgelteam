/** Estilo de seleção alinhado aos cards da lista de sessões (coluna esquerda). */
export function lessonRegistrationSelectionClass(selected: boolean): string {
  return selected
    ? "border border-accent bg-[var(--ds-bg-card)] ring-2 ring-accent/15 shadow-[var(--ds-shadow-card)]"
    : "border border-[var(--ds-border)] bg-[var(--ds-bg-card)] shadow-[var(--ds-shadow-card)] hover:border-accent/30";
}
