/** Classes canônicas — tokens em `theme-tokens.css` (light/dark). */

/** Card admin universal — DESIGN_SYSTEM §5.1 */
export const adminCardClass =
  "rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] shadow-[var(--ds-shadow-card)]";

export const adminCardHoverClass =
  "transition hover:border-accent/20 hover:shadow-[var(--ds-shadow-card-hover)]";

export const adminCardInnerClass = `${adminCardClass} p-5 shadow-sm`;

export const adminCardMutedClass =
  "rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] p-4";

export const adminPanelBgClass = "bg-[var(--ds-bg-panel)]";

/** Sidebar admin/piloto — navy sólido, sem gradiente */
export const shellSidebarClass =
  "shell-sidebar bg-[var(--ds-sidebar-bg)] bg-none text-white";

/** Tipografia admin */
export const adminPageTitleClass =
  "text-xl font-bold text-[var(--ds-text-primary)] tracking-tight md:text-2xl";

export const adminSectionTitleClass =
  "text-lg font-bold text-[var(--ds-text-primary)] md:text-xl";

export const adminSubsectionTitleClass =
  "text-lg font-bold text-[var(--ds-text-primary)]";

export const adminDrawerTitleClass =
  "text-xl font-bold text-[var(--ds-text-primary)]";

export const adminLabelClass =
  "text-[12px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]";

export const adminKpiLabelClass =
  "text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]";

export const adminTableHeaderLabelClass =
  "text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]";

export const adminHintClass = "text-[12px] text-[var(--ds-text-muted)]";

export const adminBodyClass = "text-sm text-[var(--ds-text-secondary)]";

export const adminTextAccentClass =
  "font-semibold text-[var(--ds-text-primary)]";

export const adminTextAccentBoldClass =
  "font-bold text-[var(--ds-text-primary)]";

export const adminTextAccentMonoClass =
  "font-mono tabular-nums text-[var(--ds-text-primary)]";

export const adminTextValueClass =
  "text-xl font-bold tabular-nums text-[var(--ds-text-primary)] md:text-2xl";

export const adminLinkActionClass =
  "shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-wider text-accent transition hover:text-[var(--ds-text-primary)]";

/** Formulários — DESIGN_SYSTEM §7.1 */
export const adminFieldFocusClass =
  "focus:border-accent focus:bg-[var(--ds-bg-elevated)]";

export const adminFieldFocusWithinClass =
  "focus-within:border-accent focus-within:bg-[var(--ds-bg-elevated)]";

export const adminFieldClass =
  `w-full rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-input)] text-[14px] text-[var(--ds-text-body)] outline-none transition ${adminFieldFocusClass}`;

export const adminInputClass = `${adminFieldClass} px-4 py-3 placeholder:text-[var(--ds-text-muted)]`;

export const adminInputReadonlyClass = `${adminInputClass} cursor-default bg-[var(--ds-bg-muted)] text-[var(--ds-text-secondary)]`;

export const adminTextareaClass =
  `min-h-[120px] w-full resize-y rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-input)] px-4 py-3 text-[14px] leading-relaxed text-[var(--ds-text-body)] outline-none transition placeholder:text-[var(--ds-text-muted)] ${adminFieldFocusClass}`;

/** Shell de combobox (dropdown, datepicker) — hover no container, sem ring/glow */
export const adminComboFieldShellClass =
  `relative block w-full min-w-0 overflow-visible rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-input)] text-[14px] text-[var(--ds-text-body)] outline-none transition-colors hover:bg-[var(--ds-bg-muted)] data-[open=true]:border-accent data-[open=true]:bg-[var(--ds-bg-elevated)] ${adminFieldFocusWithinClass}`;

export const adminComboFieldTriggerClass =
  "flex h-full min-h-12 w-full min-w-0 cursor-pointer items-center border-0 bg-transparent px-4 py-0 text-left outline-none disabled:cursor-not-allowed disabled:opacity-50";

export const adminOutlineButtonClass =
  "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-card)] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-primary)] transition hover:border-accent/30 disabled:cursor-not-allowed disabled:opacity-50";

export const adminIconButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--ds-border-field)] text-[var(--ds-text-primary)] transition hover:bg-[var(--ds-bg-muted)]";

export const adminTableActionButtonClass =
  "flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ds-text-muted)] transition hover:bg-accent/10 hover:text-[var(--ds-text-primary)]";

export const adminTableDangerActionButtonClass =
  "flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ds-text-muted)] transition hover:bg-[var(--ds-error-bg)] hover:text-[var(--ds-error-text)] disabled:cursor-not-allowed disabled:opacity-40";

/** Tabelas — DESIGN_SYSTEM §6.3 */
export const adminTableWrapClass = `${adminCardClass} overflow-hidden`;

export const adminTableClass = "w-full text-left text-sm";

/** Scroll horizontal — recorta thead nos cantos do card (gutter auto via globals.css) */
export const adminTableScrollClass =
  "admin-table-scroll overflow-x-auto w-full min-w-0 rounded-t-2xl";

export const adminTableHeadRowClass =
  "border-b border-[var(--ds-border)] bg-[var(--ds-bg-muted)] text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]";

export const adminTableBodyRowClass = "admin-table-body-row";

export const adminTableBodyRowStaticClass =
  "border-b border-[var(--ds-border-subtle)] last:border-0";

export const adminTableCellClass = "text-sm text-[var(--ds-text-secondary)]";

export const adminTableMobileListClass =
  "divide-y divide-[var(--ds-border-subtle)]";

export const adminMetaBadgeClass =
  "inline-flex rounded-md border border-[var(--ds-border-subtle)] bg-[var(--ds-bg-muted)] px-2 py-0.5 text-[11px] font-semibold uppercase text-[var(--ds-text-primary)]";

export const adminTableScoreChipClass =
  "inline-flex min-w-[2.25rem] items-center justify-center rounded-lg bg-accent/10 px-2 py-1 text-sm font-bold tabular-nums text-[var(--ds-text-primary)]";

/** Drawers — DESIGN_SYSTEM §7.4 */
export const adminDrawerOverlayClass =
  "absolute inset-0 bg-black/50 backdrop-blur-[2px]";

export const adminDrawerOverlayLightClass =
  "absolute inset-0 bg-black/40 backdrop-blur-[2px]";

export const adminDrawerPanelClass =
  "app-drawer-panel relative flex h-full w-full max-w-[min(100vw,720px)] flex-col bg-[var(--ds-bg-panel)] shadow-[var(--ds-shadow-popover)]";

export const adminDrawerPanelFormClass =
  "app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[var(--ds-bg-panel)] shadow-2xl lg:max-w-[min(520px,92vw)]";

export const adminDrawerHeaderClass =
  "shrink-0 flex items-center justify-between gap-4 border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)]/95 px-5 py-4 backdrop-blur-md";

export const adminDrawerHeaderSimpleClass =
  "shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-5 py-4";

/** Seção interna de drawers laterais */
export const adminDrawerSectionClass =
  "rounded-xl bg-[var(--ds-bg-card)] p-4 shadow-sm ring-1 ring-[var(--ds-border-subtle)]";

export const adminDrawerSectionCardClass =
  "rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] p-5 shadow-sm";

export const adminDrawerPanelWideClass =
  "app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[var(--ds-bg-panel)] shadow-2xl lg:w-[min(100%,800px)] lg:max-w-[800px] lg:shrink-0";

export const adminDrawerPanelBillingClass =
  "app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[var(--ds-bg-panel)] shadow-2xl lg:max-w-[min(720px,96vw)]";

export const adminDrawerCancelBtnClass =
  "rounded-xl border border-[var(--ds-border-field)] py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-primary)] transition hover:bg-[var(--ds-bg-muted)] disabled:opacity-50";

export const adminDrawerPrimaryBtnClass =
  "rounded-xl bg-accent py-3 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40";

export const adminDrawerOutlineBtnClass =
  "rounded-xl border border-[var(--ds-border-field)] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-primary)] transition hover:bg-[var(--ds-bg-muted)]";

export const adminDrawerDangerBtnClass =
  "rounded-xl border border-[var(--ds-error-border)] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--ds-error-text)] transition hover:bg-[var(--ds-error-bg)]";

/** Card de horário livre / bloqueado na agenda — estilos em globals.css */
export const scheduleFreeSlotCardClass =
  "schedule-free-slot-card schedule-free-slot-card--free";

export const scheduleBlockedSlotCardClass =
  "schedule-free-slot-card schedule-free-slot-card--blocked";

export const scheduleFreeSlotActionPrimaryClass =
  "schedule-free-slot-action-btn schedule-free-slot-action-btn--primary";

export const scheduleFreeSlotActionOutlineClass =
  "schedule-free-slot-action-btn schedule-free-slot-action-btn--outline";

export const adminDrawerEyebrowClass =
  "text-sm font-bold uppercase tracking-wider text-[var(--ds-text-muted)]";

/** KPI — DESIGN_SYSTEM §5.2 */
export const adminKpiCardClass = `${adminCardClass} flex items-center gap-4 p-4 transition hover:shadow-[var(--ds-shadow-card-hover)] md:p-5`;

export const adminKpiIconWrapClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent";

export const adminKpiValueClass =
  "text-xl font-bold leading-tight tracking-tight text-[var(--ds-text-primary)] md:text-2xl";

/** Seleção (checkbox tiles) */
export function adminChoiceTileClass(options: {
  checked: boolean;
  disabled?: boolean;
}): string {
  if (options.disabled) {
    return "flex items-center gap-3 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-bg-muted)] px-4 py-3 opacity-50 cursor-not-allowed";
  }
  if (options.checked) {
    return "flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 transition";
  }
  return "flex items-center gap-3 rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-muted)] px-4 py-3 transition hover:border-accent/25";
}

/** Badge neutro (categorias etc.) */
export const adminBadgeNeutralClass =
  "inline-flex rounded-md border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] px-2 py-0.5 text-[11px] font-semibold uppercase text-[var(--ds-text-primary)]";

export const adminBadgeSuccessClass =
  "bg-[var(--ds-success-bg)] text-[var(--ds-success-text)] ring-[var(--ds-success-border)]";

export const adminBadgeWarningClass =
  "bg-[var(--ds-warning-bg)] text-[var(--ds-warning-text)] ring-[var(--ds-warning-border)]";

export const adminBadgeErrorClass =
  "bg-[var(--ds-error-bg)] text-[var(--ds-error-text)] ring-[var(--ds-error-border)]";

export const adminBadgeInfoClass =
  "bg-[var(--ds-info-bg)] text-[var(--ds-info-text)] ring-[var(--ds-info-border)]";

export const adminBadgeNeutralStatusClass =
  "bg-[var(--ds-bg-muted)] text-[var(--ds-text-secondary)] ring-[var(--ds-border-field)]";

/** Mobile list card (clientes) */
export const adminMobileListCardClass =
  "rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-3 py-3 text-left shadow-[var(--ds-shadow-card)] transition active:scale-[0.99] hover:border-accent/20";

export const adminEmptyStateClass =
  "rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-4 py-10 text-center text-sm text-[var(--ds-text-muted)]";

export const adminSegmentControlWrapClass =
  "inline-flex shrink-0 flex-wrap justify-end rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-muted)] p-1 sm:ml-auto";

export function adminSegmentTabClass(active: boolean): string {
  return `rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition ${
    active
      ? "bg-accent text-white shadow-sm"
      : "text-[var(--ds-text-secondary)] hover:text-accent"
  }`;
}

export const adminFilterPillClass =
  "rounded-xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition bg-[var(--ds-bg-muted)] text-[var(--ds-text-secondary)] ring-1 ring-[var(--ds-border-field)] hover:ring-accent/30";

export const adminFilterPillActiveClass =
  "rounded-xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition bg-accent text-white shadow-sm";

/** Accordions — configurações e painéis expansíveis */
export function adminAccordionItemClass(
  open: boolean,
  options?: { overflowVisible?: boolean },
): string {
  const overflow =
    options?.overflowVisible && open ? "overflow-visible" : "overflow-hidden";
  return `${overflow} admin-accordion-item rounded-2xl border transition ${
    open
      ? "admin-accordion-item--open border-[var(--ds-border-accent-open)] bg-[var(--ds-bg-card)] shadow-[var(--ds-shadow-card)]"
      : "border-[var(--ds-border)] bg-[var(--ds-bg-muted)]"
  }`;
}

export function adminAccordionTriggerIconClass(open: boolean): string {
  return `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
    open ? "bg-accent text-white" : "bg-accent/10 text-accent"
  }`;
}

export const adminAccordionTitleClass =
  "text-base font-bold text-[var(--ds-text-primary)] md:text-lg";

export const adminAccordionSubtitleClass =
  "mt-0.5 block text-[12px] text-[var(--ds-text-muted)]";

export const adminAccordionMetaClass =
  "ml-auto shrink-0 text-[12px] text-[var(--ds-text-muted)]";

export const adminAccordionPanelClass =
  "border-t border-[var(--ds-border)] px-4 pb-5 pt-4 md:px-5";

export const adminAccordionTriggerRowClass =
  "flex w-full items-center gap-3 px-4 py-4 text-left";

export const adminSettingsProfileTabClass =
  "shrink-0 rounded-xl border px-4 py-2.5 text-[12px] font-bold transition border-[var(--ds-border-field)] bg-[var(--ds-bg-card)] text-[var(--ds-text-secondary)] hover:border-accent/30";

export const adminSettingsProfileTabActiveClass =
  "shrink-0 rounded-xl border px-4 py-2.5 text-[12px] font-bold transition border-transparent bg-accent text-white";

export const adminListRowClass =
  "flex items-center gap-4 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-4 py-3 shadow-sm";

export const adminRankBadgeClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white";

export const adminHeroSectionClass =
  "relative overflow-hidden rounded-3xl border border-[var(--ds-border)] shadow-[var(--ds-shadow-card-hover)]";

export const adminHeroOverlayClass = "absolute inset-0 bg-accent/85";

export const adminInsightPanelClass =
  "mt-4 flex gap-3 rounded-xl border border-accent/15 bg-accent/[0.04] px-4 py-3";

/** Painel com destaque sutil (sem gradiente). */
export const adminAccentPanelClass =
  "rounded-2xl border border-accent/20 bg-accent/[0.04] shadow-sm";

export const adminScoreChipClass =
  "rounded-lg bg-[var(--ds-bg-muted)] px-3 py-2 text-center ring-1 ring-[var(--ds-border-subtle)]";

export const adminNoteDashedClass =
  "rounded-xl border border-dashed border-[var(--ds-border-dashed)] bg-[var(--ds-bg-muted)]/80 px-4 py-3";

export const adminEmptyDashedClass =
  "rounded-xl border border-dashed border-[var(--ds-border-dashed)] bg-[var(--ds-bg-muted)] px-4 py-4 text-center text-sm text-[var(--ds-text-muted)]";

export const adminAccentDashedRowClass =
  "rounded-xl border border-dashed border-[var(--ds-border-accent-open)] bg-[var(--ds-bg-muted)] px-4 py-3.5";

export const adminInlineRowClass =
  "flex flex-wrap items-center gap-2 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] px-3 py-2.5 sm:flex-nowrap";

export const adminEditableRowClass =
  "flex flex-wrap items-center gap-3 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-4 py-3 shadow-sm sm:flex-nowrap";

export const adminAchievementCardClass =
  "flex gap-4 rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] p-4 shadow-sm ring-1 ring-[var(--ds-border-subtle)]";

export const adminAchievementIconClass =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--ds-warning-bg)] text-[var(--ds-warning-text)] ring-1 ring-[var(--ds-warning-border)]";

export const adminTimelineAccentClass =
  "bg-accent/10 text-accent ring-accent/15";

export const adminStatTileClass =
  "rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-4 py-3 shadow-sm";

/** Legendas ao lado de gráficos de pizza (financeiro) */
export const adminChartLegendTileClass =
  "rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] px-3 py-2";

export const adminChartLegendLabelClass =
  "truncate text-[12px] font-semibold text-[var(--ds-text-primary)]";

export const adminChartLegendValueClass =
  "text-[12px] font-bold tabular-nums text-[var(--ds-text-primary)]";

export const adminChartLegendPercentClass =
  "text-[10px] text-[var(--ds-text-muted)]";

/** Linhas de tabela com fundo fixo (DRE) — hover via globals.css (.admin-table-row-*) */
export const adminTableRowSuccessClass = "admin-table-row-success";

export const adminTableRowMutedClass = "admin-table-row-muted";

export const adminDividerTopClass =
  "border-t border-[var(--ds-border)]";

export const adminAvatarRingClass = "ring-2 ring-[var(--ds-border-subtle)]";

/** Superfícies de autenticação (login/cadastro) */
export const authSurfaceClass = "auth-surface min-h-screen bg-[var(--ds-bg-page)]";

/** Compatibilidade — aliases legados settings-* */
export const settingsFieldClass = adminFieldClass;
export const settingsInputClass = adminInputClass;
export const settingsTextareaClass = adminTextareaClass;
export const settingsOutlineButtonClass = adminOutlineButtonClass;
