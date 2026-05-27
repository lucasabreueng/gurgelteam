/** Estilo de seleção alinhado aos cards da lista de sessões (coluna esquerda). */
export function lessonRegistrationSelectionClass(selected: boolean): string {
  return selected
    ? "border border-accent bg-white ring-2 ring-accent/15 shadow-sm"
    : "border border-[rgba(17,17,17,0.08)] bg-white shadow-sm hover:border-accent/30";
}
