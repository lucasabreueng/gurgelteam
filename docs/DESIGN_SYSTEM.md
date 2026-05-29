# DESIGN_SYSTEM — Gurgel Team

> **Última atualização:** 2026-05-28  
> **Fonte:** `tailwind.config.ts`, `app/globals.css`, `components/ui/`, padrões admin  
> **Legenda:** `[CONFIRMADO]` = token/classe no código · `[INFERIDO]` = padrão recorrente não abstraído

---

## 1. Visão geral

O projeto usa um **design system híbrido** `[CONFIRMADO]`:

1. **Landing/marketing** — tokens semânticos CSS (`primary`, `accent`, `divider`) + classes em `globals.css`
2. **Admin/piloto** — paleta fixa hardcoded (`#0d1f3c`, `#f3f5f9`) + utilitários Tailwind
3. **Primitivos** — 11 arquivos em `components/ui/` (sem shadcn/Radix/MUI)

**Risco documentado:** uso amplo de valores hardcoded no admin dificulta tema global e dark mode completo `[CONFIRMADO]` — `FRONTEND_AUDIT.md`.

---

## 2. Cores

### 2.1 Tokens semânticos (landing + root)

Definidos em `app/globals.css` e mapeados em `tailwind.config.ts`:

| Token Tailwind | CSS Variable | Light | Dark |
|----------------|--------------|-------|------|
| `primary` | `--color-primary` | `#111111` | `#ececec` |
| `secondary` | `--color-secondary` | `#f0f2f4` | `#141414` |
| `background` | `--color-bg` | `#ffffff` | `#080808` |
| `foreground` | `--color-text` | `#333333` | `#b0b0b0` |
| `accent` | `--color-accent` | `#0d1f3c` | `#0d1f3c` |
| `divider` | `--color-divider` | `#1111111a` | `rgba(255,255,255,0.08)` |

Auxiliares: `--color-white`, `--color-dark-divider`.

### 2.2 Paleta admin (hardcoded)

| Uso | Valor | Onde |
|-----|-------|------|
| Accent principal | `#0d1f3c` | Títulos, botões primários, KPIs |
| Background painel | `#f3f5f9` | Shell admin, drawers |
| Background input | `#fafbfc` | Campos de formulário |
| Background thead | `#fafbfc` | Cabeçalhos de tabela |
| Borda padrão | `rgba(17,17,17,0.08)` | Cards, tabelas |
| Borda input | `rgba(17,17,17,0.12)` | Inputs |
| Erro | `#c41e3a` | `field-error.tsx` |
| Sombra card | `0_2px_12px_rgba(13,31,60,0.04)` | Cards admin |

### 2.3 Gradientes

| Classe | Valor |
|--------|-------|
| `bg-accent-gradient` | `linear-gradient(135deg, var(--color-accent) 0%, #0a1630 100%)` |
| Botão primary landing | gradient accent → `#0a1630` |

### 2.4 Status / semântica de cor

Badges usam cores Tailwind por domínio (ex.: `emerald`, `amber`, `rose`, `sky`) — **sem token centralizado** `[CONFIRMADO]`.

### 2.5 Dark mode

- Ativado via `html[data-color-mode="dark"]` + `ThemeProvider` `[CONFIRMADO]`
- **Cobertura parcial** — admin majoritariamente light hardcoded `[CONFIRMADO]`

---

## 3. Tipografia

### 3.1 Família

- **Sora** via `next/font/google` — pesos 100–800
- Aplicada: `font-sans text-foreground antialiased` no body

### 3.2 Escala landing

| Elemento | Especificação |
|----------|---------------|
| Kicker | `.section-kicker` — `text-sm font-medium uppercase tracking-[0.2em]` |
| Título seção | `clamp(1.75rem, 4vw, 2.875rem)` / `46px` → `36px` (≤991px) → `26px` (≤767px) |
| Corpo | `text-base`, `leading-relaxed` |
| FAQ | `18px font-medium` → `16px` mobile |

### 3.3 Escala admin (padrão dominante)

| Elemento | Classes típicas |
|----------|-----------------|
| Label KPI/campo | `text-[11px] font-bold uppercase tracking-wider text-neutral-500` |
| Título de página | `text-xl font-bold md:text-2xl text-[#0d1f3c] tracking-tight` |
| Subtítulo | `text-[13px] md:text-[14px] text-neutral-600` |
| Valor KPI | `text-xl md:text-2xl font-bold text-[#0d1f3c]` |
| Delta KPI | `text-[10px] font-bold` |
| Cabeçalho tabela | `text-[10px] font-bold uppercase tracking-wider text-neutral-500` |
| Célula tabela | `text-sm text-neutral-700` |
| Botão outline sm | `text-[10px] font-bold uppercase tracking-wider` |
| Botão primary md | `text-[11px] font-bold uppercase tracking-wider` |
| Erro campo | `text-[12px] font-medium text-[#c41e3a]` |
| Input | `text-[15px]` |

Constantes exportadas: `components/student-area/telemetry/sectors/sectors-styles.ts` — `SECTION_TITLE`, `SECTION_LABEL`.

### 3.4 Botões landing

`components/ui/button.tsx`: `text-base font-semibold capitalize`, `rounded-full`.

---

## 4. Espaçamentos

### 4.1 Tokens admin

```css
--admin-gap: 1rem;
--admin-chrome-h: 76px;
--admin-chrome-actions-gap: 0.625rem;
```

Classes utilitárias:
- `.admin-page-stack` — `gap: var(--admin-gap)`
- `.admin-page-grid` — `gap: var(--admin-gap)`
- `.admin-page-gutter` — `padding-inline: var(--admin-gap)`

### 4.2 Containers

| Componente | Padding | Max-width |
|------------|---------|-----------|
| `Container` | `px-[15px] md:px-4` | `1300px` (`max-w-container`) |
| `WideSection` | `px-[15px] md:px-5` | `1800px` (`max-w-wide`) |

### 4.3 Cards

| Variante | Padding |
|----------|---------|
| Leve | `p-4 md:p-5` |
| Médio | `p-6 md:p-7` |
| Landing interno | `30px` (CSS) |

### 4.4 Formulários

- Stack vertical: `space-y-5`
- Input: `px-4 py-3.5`
- Altura filtro: `h-12 min-h-12` (`filterFieldHeightClass` em `filter-box.tsx`)
- Gap filtros: `gap-4`

### 4.5 Layout admin

- Sidebar: **288px** (`ADMIN_SIDEBAR_WIDTH`); colapsada tablet: **72px**
- Border radius card admin: `rounded-2xl` (16px)
- Border radius landing: `rounded-card` (20px)

### 4.6 Barras de rolagem

Três classes em `app/globals.css` — **usar em todo conteúdo rolável novo**:

| Classe | Quando usar |
|--------|-------------|
| `.app-scrollbar` | Área rolável explícita (legado; preferir overflow + auto no painel) |
| `.app-modal-scroll` | Corpo rolável de modais (`AppModal`) |
| `.app-dropdown-scrollbar` | Listas dentro de dropdowns (`AppDropdown`, selects pesquisáveis) |
| `.app-scrollbar-hidden` | Faixas KPI, tabs horizontais, carrosséis touch — **sem** barra visível |

**Automático no painel:** elementos com `overflow-y-auto`, `overflow-x-auto` ou `overflow-auto` dentro de `.admin-area-page`, `.student-area-page`, `.app-drawer-panel`, `.telemetry-immersive-root` ou `.app-modal-scroll` recebem a scrollbar padrão (7px, thumb accent), exceto se tiverem `.app-scrollbar-hidden` ou `.app-dropdown-scrollbar`.

**Tabs horizontais:** incluir `app-scrollbar-hidden` (ex.: `financial-tabs`, `inventory-tabs`, `AdminResponsiveKpis` strip).

**Dropdowns:** sempre `app-dropdown-scrollbar` na lista (`max-h-* overflow-y-auto`).

---

## 5. Padrões de cards

### 5.1 Card admin universal

```tsx
rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white
shadow-[0_2px_12px_rgba(13,31,60,0.04)]
```

**Usado em:** financeiro, settings, inventory, maintenance, dashboard.

### 5.2 KPI Card

**Componente base:** `components/ui/kpi-card.tsx` (re-exporta `components/admin/kpi-card.tsx`)

Estrutura:
- Ícone em container `h-11 w-11 rounded-xl bg-[#0d1f3c]/5`
- Label uppercase 11px
- Valor bold `#0d1f3c`
- Delta opcional com cor positiva/negativa
- Sparkline opcional (ECharts inline)

Variações:
- `inventory-kpi-card.tsx` — sparkline integrado
- `clients-kpi-card.tsx` — sparkline
- `cash-flow-kpi-cards.tsx` — grid dedicado
- `dre-summary-kpis.tsx` — KPIs DRE

### 5.3 Cards landing

- `.work-step-item`, `.feature-item` — hover gradient, `border-radius: 20px 0 20px 20px`
- `.box-bg-shape` — canto recortado decorativo

### 5.4 Cards de lista (mobile)

Padrão tabela→cards em `< lg`:
- `client-mobile-card.tsx`, `maintenance-order-card.tsx`, `part-card.tsx`, `schedule-event-card.tsx`

---

## 6. Padrões de tabelas

### 6.1 Estrutura responsiva padrão

```tsx
<div className="hidden lg:block">{/* <table> desktop */}</div>
<div className="lg:hidden">{/* cards mobile */}</div>
```

### 6.2 Classes compartilhadas (estoque)

`components/admin/inventory/inventory-table-shared.tsx`:
- `inventoryTableClass`, `inventoryThClass`, `inventoryTdClass`
- `InventoryTableSelectHeader`, `InventoryTableActions`

### 6.3 Cabeçalho padrão

- `thead`: `bg-[#fafbfc]`
- `th`: `text-[10px] font-bold uppercase tracking-wider text-neutral-500`
- `td`: `text-sm text-neutral-700`

### 6.4 Paginação

Componentes dedicados por módulo (estrutura similar):
- `client-table-pagination.tsx`
- `karts-table-pagination.tsx`
- `maintenance-table-pagination.tsx`
- `inventory-table-pagination.tsx`
- `financial-table-pagination.tsx`

### 6.5 Filtros de tabela

| Desktop (≥ lg) | Mobile (< lg) |
|----------------|---------------|
| `FilterBox` inline | `TableFiltersSheet` (bottom sheet) |
| `ResponsiveTableFilters` | `TableFiltersButton` + badge contagem |

Arquivos: `components/ui/filter-box.tsx`, `responsive-table-filters.tsx`, `table-filters-sheet.tsx`, `table-filters-button.tsx`, `table-filters-toolbar.tsx`.

### 6.6 Tabelas exemplares

| Módulo | Arquivo | min-width |
|--------|---------|-----------|
| Clientes | `client-table.tsx` | `880px` |
| Karts | `karts-fleet-table.tsx` | — |
| Financeiro | `accounts-receivable-table.tsx` | — |
| DRE | `dre-structured-table.tsx` | — |
| Manutenção | `maintenance-order-table.tsx` | — |

---

## 7. Padrões de formulários

### 7.1 Input padrão

```tsx
rounded-xl border border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-3.5
text-[15px] focus:border-accent focus:ring-2 focus:ring-accent/15
```

### 7.2 Componentes de campo

| Componente | Path | Uso |
|------------|------|-----|
| `FieldError` | `components/cadastro/field-error.tsx` | Mensagem de erro |
| `SettingsField` | `components/admin/settings/settings-section.tsx` | Label + input settings |
| `SettingsToggle` | `settings-toggle.tsx` | Switch |
| `SettingsCheckbox` | `settings-checkbox.tsx` | Checkbox |
| `SettingsTimeInput` | `settings-time-input.tsx` | Horário |
| `SettingsDatePicker` | `settings-date-picker.tsx` | Data |
| `AppDropdown` | `components/ui/app-dropdown.tsx` | Select custom / nativo mobile |

### 7.3 Validação

- Zod schemas em `lib/contracts/auth/auth.schemas.ts`, `lib/contracts/lessons/lesson.schemas.ts`
- Validação auth: `lib/auth/validate-auth-forms.ts`

### 7.4 Drawers de formulário

Padrão: painel lateral `app-drawer-panel bg-[#f3f5f9] lg:w-[min(100%,480px)]`

Exemplos: `new-client-drawer.tsx`, `new-kart-drawer.tsx`, `part-form-drawer.tsx`, `register-part-drawer.tsx`

Hook: `lib/hooks/use-drawer-body-lock.ts`

---

## 8. Padrões de modais

### 8.1 Modal genérico

`components/ui/app-modal.tsx`:
- Overlay + painel centrado
- `maxWidth`: `md` | `lg` | `2xl`
- z-index: `z-[300]`

### 8.2 Diálogos de confirmação

| Componente | z-index | Uso |
|------------|---------|-----|
| `confirm-dialog.tsx` | `z-[240]` | Exclusão/confirmação settings |
| `settings-prompt-dialog.tsx` | — | Input prompt |

### 8.3 Modais de domínio

- `new-class-modal.tsx`, `new-inspection-modal.tsx`, `new-maintenance-modal.tsx`
- `schedule-action-modal.tsx`, `dre-account-modal.tsx`
- Telemetria: `telemetry-load-modal.tsx`, `telemetry-sessions-modal.tsx`, `tracks-modal.tsx`

### 8.4 Sheets / bottom drawers

| Componente | z-index | Uso |
|------------|---------|-----|
| `table-filters-sheet.tsx` | `z-[220]` | Filtros mobile |
| `schedule-drawer-shell.tsx` | `z-[225]` | Drawer agenda |
| `schedule-day-appointments-sheet.tsx` | — | Compromissos do dia |

---

## 9. Padrões de KPIs

### 9.1 Grid layout

| Contexto | Grid |
|----------|------|
| Dashboard admin | `grid-cols-2 lg:grid-cols-4` |
| Karts/manutenção | `grid-cols-2 md:grid-cols-3 xl:grid-cols-6` |
| Financeiro overview | `grid-cols-2 lg:grid-cols-4` |

### 9.2 Estrutura visual

1. Container card (padrão universal)
2. Ícone + label uppercase
3. Valor principal bold
4. Delta (texto + cor semântica)
5. Sparkline opcional (array de números → mini gráfico)

### 9.3 Fonte de dados

KPIs vêm de mocks por domínio: `CLIENTS_KPIS`, `FINANCIAL_KPIS`, `MAINTENANCE_KPIS`, etc.

---

## 10. Padrões de dashboards

### 10.1 Shell admin

`components/admin/admin-shell.tsx`:
- Sidebar 288px + área de conteúdo
- Header via `AdminPageHeader`
- Conteúdo em `.admin-page-stack`

### 10.2 Dashboard admin (`admin-dashboard-page.tsx`)

Ordem de blocos:
1. KPI grid (4 colunas lg)
2. `OperationalAgenda` + `StudentsOverview` (2 colunas)
3. `KartStatusGrid`

Blocos adicionais disponíveis: `telemetry-overview.tsx`, `championship-card.tsx`, `financial-overview.tsx`

### 10.3 Dashboard piloto (`student-dashboard-page.tsx`)

Cards: `results-card`, `timeline-card`, `achievements-card`, `evolution-goal-card`, etc.

### 10.4 Gráficos

- **ECharts** via `echarts-for-react`
- Wrapper: `financial-chart-card.tsx`
- Cash flow, DRE, sparklines inline nos KPIs

---

## 11. Componentes reutilizáveis

### 11.1 Primitivos (`components/ui/`)

| Arquivo | Exporta |
|---------|---------|
| `button.tsx` | `ButtonLink`, `ButtonNative` |
| `kpi-card.tsx` | `KpiCard` |
| `app-modal.tsx` | `AppModal` |
| `app-dropdown.tsx` | `AppDropdown` |
| `filter-box.tsx` | `FilterBox`, `filterFieldHeightClass`, `filtersActive()` |
| `responsive-table-filters.tsx` | `ResponsiveTableFilters` |
| `table-filters-sheet.tsx` | `TableFiltersSheet` |
| `table-filters-button.tsx` | `TableFiltersButton` |
| `table-filters-toolbar.tsx` | `TableFiltersToolbar` |
| `container.tsx` | `Container`, `WideSection` |
| `section-heading.tsx` | `SectionHeading` |

### 11.2 Shell / layout

| Arquivo | Função |
|---------|--------|
| `admin-shell.tsx` | Layout admin |
| `admin-page-header.tsx` | Cabeçalho de página |
| `sidebar.tsx` | Navegação lateral |
| `header.tsx` | Header desktop |
| `mobile-header-bar.tsx` | Header mobile |
| `student-shell.tsx` | Layout piloto |

### 11.3 Badges de status

| Arquivo | Domínio |
|---------|---------|
| `client-badges.tsx` | Clientes |
| `kart-status-badge.tsx` | Karts / agenda |
| `maintenance-status-badge.tsx` | Manutenção |
| `stock-status-badge.tsx` | Estoque |
| `receivable-status-badge.tsx` | Financeiro |
| `financial-status-badge.tsx` | Agenda |
| `registration-list-status-badge.tsx` | Registro aulas |

### 11.4 Botões admin (CSS global)

`app/globals.css`:
- `.btn-outline-sm`, `.btn-outline-md`
- `.btn-primary-sm`, `.btn-primary-md`

### 11.5 Ícones

- Biblioteca: `react-icons/hi2` (Heroicons 2)
- Tamanhos variam por contexto (sem token fixo)

---

## 12. Regras de responsividade

### 12.1 Breakpoints Tailwind (defaults)

| Breakpoint | px | Uso principal |
|------------|-----|---------------|
| `sm` | 640 | Ajustes menores |
| `md` | 768 | Grids intermediários |
| **`lg`** | **1024** | **Pivot admin** (tabela↔cards, filtros, header) |
| `xl` | 1280 | Grids densos (6 colunas KPI) |

### 12.2 Breakpoints CSS landing

- `max-width: 991px` — tablet
- `max-width: 767px` — mobile

### 12.3 Comportamento admin em `lg`

| Elemento | < lg | ≥ lg |
|----------|------|------|
| Tabelas | Cards | `<table>` |
| Filtros | Bottom sheet | Inline |
| Título página header | Oculto | Visível |
| Sidebar | Overlay / menu mobile | Fixa 288px |
| Scroll | Só `<main>` | Chrome sticky |

**Hook:** `useMaxLg()` — `(max-width: 1023px)` em `lib/hooks/use-max-lg.ts`

### 12.4 Tablet landscape (768–1366px)

- Sidebar colapsável 72px
- Classe `admin-panel-tablet-landscape-shell`
- Hook: `use-admin-panel-tablet-layout.ts`

### 12.5 Mobile UX

- `--app-vh` para altura real (anti-bounce iOS)
- Inputs `font-size: 16px` em drawers (anti-zoom iOS)
- `AppDropdown` → `<select>` nativo via `usePreferNativeSelect`
- Safe area: `env(safe-area-inset-top)`
- Botões agenda: só ícone em `<1024px`

### 12.6 Grids responsivos típicos

```
grid-cols-2 lg:grid-cols-4          // KPIs
grid-cols-2 md:grid-cols-3 xl:grid-cols-6  // KPIs densos
lg:grid-cols-2                      // dashboard 2 colunas
md:grid-cols-2 xl:grid-cols-3       // listas de cards
```

---

## 13. Gaps e recomendações

| Gap | Prioridade | Ação sugerida |
|-----|------------|---------------|
| Cores hardcoded no admin | Alta | Migrar para tokens CSS |
| Badges por domínio | Média | Criar `StatusBadge` genérico |
| Paginação duplicada | Média | Unificar em `TablePagination` |
| Dark mode parcial | Média | Decidir: completar ou desativar no admin |
| Micro-tipografia (10px, 11px) | Baixa | Definir escala tipográfica admin formal |
