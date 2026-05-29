import type { ReactNode } from "react";

/** Classes do `<footer>` fixo em drawers laterais (`app-drawer-panel`). */
export const DRAWER_FOOTER_SHELL_CLASS =
  "shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white";

/** Padding interno padrão do rodapé. */
export const DRAWER_FOOTER_INNER_CLASS = "drawer-footer px-4 py-4 md:px-5";

type ActionsProps = {
  children: ReactNode;
  /** Colunas iguais — cada botão ocupa 100% da célula. */
  columns?: 1 | 2 | 3 | 4;
  className?: string;
};

const COLUMN_CLASS: Record<NonNullable<ActionsProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/** Grade de ações full-width no rodapé do drawer. */
export function DrawerFooterActions({
  children,
  columns = 2,
  className = "",
}: ActionsProps) {
  return (
    <div
      className={`drawer-footer-actions grid w-full gap-2 ${COLUMN_CLASS[columns]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

/** Conteúdo auxiliar acima dos botões (resumo, alertas, etc.). */
export function DrawerFooterExtra({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-2.5 space-y-2.5 ${className}`.trim()}>{children}</div>
  );
}
