# COMPONENT_INVENTORY — Gurgel Team

> **Última atualização:** 2026-05-28  
> **Total:** 412 arquivos `.tsx` em `components/`  
> **Legenda:** `[CONFIRMADO]` = arquivo existe · `[DUPLICADO]` = implementação paralela · `[SIMILAR]` = mesma função, estilos diferentes

---

## 1. Resumo por pasta

| Pasta | Arquivos | Descrição |
|-------|----------|-----------|
| `components/admin/` (raiz) | ~15 | Shell, dashboard, páginas top-level |
| `components/admin/clients/` | 27 | CRM clientes/alunos |
| `components/admin/financial/` | 54 | Financeiro completo |
| `components/admin/inventory/` | 33 | Estoque, peças, fornecedores |
| `components/admin/karts/` | 11 | Frota e paddock |
| `components/admin/lesson-registration/` | 16 | Registro de aulas |
| `components/admin/maintenance/` | 87 | OS, checklist, inspeção, peças |
| `components/admin/schedule/` | 45 | Agenda operacional |
| `components/admin/settings/` | 22 | Configurações admin |
| `components/student-area/` | 16 | Área do piloto |
| `components/student-area/telemetry/` | 14 | Telemetria piloto |
| `components/ui/` | 11 | Primitivos reutilizáveis |
| `components/login/`, `cadastro/`, etc. | ~30 | Auth e público |
| `components/shell/`, `errors/`, `telemetry/` | ~20 | Layout e utilitários |

---

## 2. Lista de componentes por categoria

### 2.1 Primitivos UI (`components/ui/`)

| Componente | Arquivo | Função |
|------------|---------|--------|
| ButtonLink / ButtonNative | `button.tsx` | Botões landing |
| KpiCard | `kpi-card.tsx` | KPI padrão |
| AppModal | `app-modal.tsx` | Modal centrado (corpo rolável: `app-modal-scroll`) |
| AppDropdown | `app-dropdown.tsx` | Select custom/nativo |
| FilterBox | `filter-box.tsx` | Container filtros |
| ResponsiveTableFilters | `responsive-table-filters.tsx` | Filtros inline/sheet |
| TableFiltersSheet | `table-filters-sheet.tsx` | Bottom sheet filtros |
| TableFiltersButton | `table-filters-button.tsx` | Botão filtrar |
| TableFiltersToolbar | `table-filters-toolbar.tsx` | Wrapper filtros |
| Container / WideSection | `container.tsx` | Layout landing |
| SectionHeading | `section-heading.tsx` | Título seção |

### 2.2 Shell / Layout

| Componente | Arquivo |
|------------|---------|
| AdminShell | `admin/admin-shell.tsx` |
| AdminPageHeader | `admin/admin-page-header.tsx` |
| Sidebar | `admin/sidebar.tsx` |
| Header | `admin/header.tsx` |
| MobileHeaderBar | `shell/mobile-header-bar.tsx` |
| CollapsedRailNavItem | `shell/collapsed-rail-nav-item.tsx` |
| StudentShell | `student-area/student-shell.tsx` |
| ThemeProvider | `theme-provider.tsx` |
| Preloader | `preloader.tsx` |

### 2.3 Páginas top-level (admin)

| Componente | Arquivo | Rota |
|------------|---------|------|
| AdminDashboardPage | `admin-dashboard-page.tsx` | `/admin` |
| ClientsPage | `clients-page.tsx` | `/admin/clientes` |
| FinancialPage | `financial-page.tsx` | `/admin/financeiro` |
| InventoryPage | `inventory-page.tsx` | `/admin/estoque` |
| KartsPage | `karts-page.tsx` | `/admin/karts` |
| MaintenancePage | `maintenance-page.tsx` | `/admin/manutencao` |
| SchedulePage | `schedule-page.tsx` | `/admin/agenda` |
| LessonRegistrationPage | `lesson-registration/lesson-registration-page.tsx` | `/admin/registro-aulas` |
| Settings panels | `settings/*-panel.tsx` | `/admin/configuracoes` |
| StudentDashboardPage | `student-area/student-dashboard-page.tsx` | `/piloto` |

### 2.4 KPI Cards

| Componente | Arquivo | Domínio |
|------------|---------|---------|
| KpiCard (base) | `ui/kpi-card.tsx` → `admin/kpi-card.tsx` | Genérico |
| ClientsKpiCard | `clients/clients-kpi-card.tsx` | Clientes |
| InventoryKpiCard | `inventory/inventory-kpi-card.tsx` | Estoque |
| CashFlowKpiCards | `financial/cash-flow/cash-flow-kpi-cards.tsx` | Fluxo caixa |
| DreSummaryKpis | `financial/dre/dre-summary-kpis.tsx` | DRE |
| MaintenanceMetrics | `maintenance/maintenance-metrics.tsx` | Manutenção |

### 2.5 Tabelas

| Componente | Arquivo | Paginação |
|------------|---------|-----------|
| ClientTable | `clients/client-table.tsx` | `client-table-pagination.tsx` |
| KartsFleetTable | `karts/karts-fleet-table.tsx` | `karts-table-pagination.tsx` |
| MaintenanceOrderTable | `maintenance/maintenance-order-table.tsx` | `maintenance-table-pagination.tsx` |
| PartsTable | `inventory/parts-table.tsx` | `inventory-table-pagination.tsx` |
| SuppliersTable | `inventory/suppliers-table.tsx` | shared |
| AccountsReceivableTable | `financial/accounts-receivable-table.tsx` | `financial-table-pagination.tsx` |
| AccountsPayableTable | `financial/accounts-payable-table.tsx` | shared |
| DreStructuredTable | `financial/dre/dre-structured-table.tsx` | — |
| ClassesHistoryTable | `clients/classes-history-table.tsx` | — |
| FeedbackHistoryTable | `clients/feedback-history-table.tsx` | — |
| LapsTable | `lesson-registration/laps-table.tsx` | — |

**Shared:** `inventory/inventory-table-shared.tsx` — classes CSS reutilizáveis

### 2.6 Badges de status

| Componente | Arquivo | Domínio |
|------------|---------|---------|
| ClientBadges | `clients/client-badges.tsx` | Clientes |
| KartStatusBadge | `karts/kart-status-badge.tsx` | Karts |
| KartStatusBadge (agenda) | `schedule/kart-status-badge.tsx` | Agenda |
| MaintenanceStatusBadge | `maintenance/maintenance-status-badge.tsx` | Manutenção |
| StockStatusBadge | `inventory/stock-status-badge.tsx` | Estoque |
| ReceivableStatusBadge | `financial/receivable-status-badge.tsx` | Financeiro |
| FinancialStatusBadge | `schedule/financial-status-badge.tsx` | Agenda |
| RegistrationListStatusBadge | `lesson-registration/registration-list-status-badge.tsx` | Registro |
| SessionStatusBadge | `lesson-registration/session-status-badge.tsx` | Registro |

### 2.7 Drawers

| Componente | Arquivo | Domínio |
|------------|---------|---------|
| ScheduleDrawerShell | `schedule/schedule-drawer-shell.tsx` | Agenda |
| ScheduleDetailsDrawer | `schedule/schedule-details-drawer.tsx` | Agenda |
| NewClientDrawer | `clients/new-client-drawer.tsx` | Clientes |
| ClientProfileDrawer | `clients/client-profile-drawer.tsx` | Clientes |
| ClientEditDrawer | `clients/client-edit-drawer.tsx` | Clientes |
| NewKartDrawer | `karts/new-kart-drawer.tsx` | Karts |
| KartDetailDrawer | `karts/kart-detail-drawer.tsx` | Karts |
| MaintenanceDetailsDrawer | `maintenance/maintenance-details-drawer.tsx` | Manutenção |
| ChecklistDrawer | `maintenance/checklist/checklist-drawer.tsx` | Manutenção |
| RegisterPartDrawer | `maintenance/register-part/register-part-drawer.tsx` | Manutenção |
| PartFormDrawer | `inventory/part-form-drawer.tsx` | Estoque |
| PartDetailsDrawer | `inventory/part-details-drawer.tsx` | Estoque |
| SupplierFormDrawer | `inventory/supplier-form-drawer.tsx` | Estoque |
| SupplierDetailsDrawer | `inventory/supplier-details-drawer.tsx` | Estoque |
| PaymentDrawer | `financial/payment-drawer.tsx` | Financeiro |
| RegisterPilotDrawer | `student-area/profile/register-pilot-drawer.tsx` | Piloto |

### 2.8 Modais

| Componente | Arquivo |
|------------|---------|
| AppModal | `ui/app-modal.tsx` |
| ConfirmDialog | `settings/confirm-dialog.tsx` |
| SettingsPromptDialog | `settings/settings-prompt-dialog.tsx` |
| NewClassModal | `schedule/new-class/new-class-modal.tsx` |
| NewInspectionModal | `maintenance/new-inspection/new-inspection-modal.tsx` |
| NewMaintenanceModal | `maintenance/new-maintenance/new-maintenance-modal.tsx` |
| ScheduleActionModal | `schedule/schedule-action-modal.tsx` |
| DreAccountModal | `financial/dre/dre-account-modal.tsx` |
| TelemetryLoadModal | `student-area/telemetry-load-modal.tsx` |
| TelemetrySessionsModal | `student-area/telemetry-sessions-modal.tsx` |
| TracksModal | `student-area/telemetry/tracks/tracks-modal.tsx` |
| ProfileTermModal | `student-area/profile/profile-term-modal.tsx` |

### 2.9 Cards mobile (fallback tabela)

| Componente | Arquivo |
|------------|---------|
| ClientMobileCard | `clients/client-mobile-card.tsx` |
| ClientCard | `clients/client-card.tsx` |
| MaintenanceOrderCard | `maintenance/maintenance-order-card.tsx` |
| PartCard | `inventory/part-card.tsx` |
| ScheduleEventCard | `schedule/schedule-event-card.tsx` |
| LessonSessionCard | `lesson-registration/lesson-session-card.tsx` |
| KartPaddockCard | `karts/kart-paddock-card.tsx` |
| FreeSlotCard | `schedule/free-slot-card.tsx` |
| TimelineSlotCard | `schedule/timeline-slot-card.tsx` |

### 2.10 Hero sections

| Componente | Arquivo | Contexto |
|------------|---------|----------|
| ClientHero | `clients/client-hero.tsx` | Perfil cliente |
| MaintenanceHero | `maintenance/maintenance-hero.tsx` | OS manutenção |
| KartInspectionHero | `maintenance/checklist/kart-inspection-hero.tsx` | Checklist |
| KartTechnicalHero | `maintenance/new-inspection/kart-technical-hero.tsx` | Inspeção |
| StudentHero | `student-area/student-hero.tsx` | Piloto |
| LoginHero | `login/login-hero.tsx` | Auth |
| ClientHero (landing) | `client-hero.tsx` | Landing |

### 2.11 Telemetria

| Componente | Pasta |
|------------|-------|
| TelemetryWorkspace | `student-area/telemetry/` |
| TelemetryGoogleMap | `student-area/telemetry/` |
| SectorsIdealLapCard | `student-area/telemetry/sectors/` |
| SectorsSessionHeader | `student-area/telemetry/sectors/` |
| TelemetryImportPreview | `student-area/telemetry/import/` |
| TracksModal | `student-area/telemetry/tracks/` |

### 2.12 Auth

| Componente | Pasta |
|------------|-------|
| LoginForm | `login/` |
| SocialLoginButton | `login/` |
| CadastroForm | `cadastro/` |
| FieldError | `cadastro/` |
| PasswordRecovery forms | `password-recovery/` |

---

## 3. Componentes duplicados

`[DUPLICADO]` — mesma responsabilidade, implementações separadas:

| Grupo | Instâncias | Problema |
|-------|------------|----------|
| **KartStatusBadge** | `karts/kart-status-badge.tsx` + `schedule/kart-status-badge.tsx` | Dois arquivos com mesmo nome em pastas diferentes |
| **KpiCard** | `ui/kpi-card.tsx` re-exporta `admin/kpi-card.tsx` | Indireção desnecessária |
| **TechnicalTimeline** | `new-maintenance/technical-timeline.tsx` + `new-inspection/technical-timeline.tsx` | Estrutura idêntica, arquivos separados |
| **InspectionItem** | `checklist/` + `new-inspection/inspection-item.tsx` | Item de inspeção duplicado |
| **BarcodeScannerButton** | `inventory/` + `maintenance/register-part/` | Mesmo scanner em dois módulos |
| **Hero sections** | 7 variantes (`*-hero.tsx`) | Padrão visual similar não abstraído |
| **Table pagination** | 5 arquivos `*-table-pagination.tsx` | Lógica repetida |
| **Filters sheet** | `ui/table-filters-sheet.tsx` + `clients/clients-filters-sheet.tsx` | Clientes tem sheet próprio além do genérico |
| **DreTable** | `financial/cash-flow/dre-table.tsx` vs `dre/dre-structured-table.tsx` | Nomenclatura confusa |

---

## 4. Componentes similares

`[SIMILAR]` — função parecida, implementação independente:

| Função | Componentes | Diferença |
|--------|-------------|-----------|
| Status badge | 9 arquivos `*-status-badge.tsx`, `client-badges.tsx` | Cores/labels por domínio, sem base comum |
| KPI card | 6 variantes | Sparkline presente/ausente, grid diferente |
| Mobile list card | 8 card components | Estrutura similar, estilos inline distintos |
| Search dropdown | `part-search-dropdown`, `os-search-dropdown`, `client-search-dropdown`, `kart-search-selector` | Mesmo padrão autocomplete |
| Filters | `*-filters.tsx` em cada módulo | Campos diferentes, container similar |
| Chart card | `financial-chart-card.tsx`, `inventory-charts.tsx`, `revenue-chart.tsx` | Wrapper ECharts repetido |
| Quick actions | `quick-actions.tsx`, `quick-financial-actions.tsx`, `quick-inventory-actions.tsx` | Botões de ação rápida |
| Header actions | `*-header.tsx`, `*-header-actions.tsx` | Padrão título + botões |
| Profile section | `profile-section-header.tsx`, `settings-section.tsx` | Seções com título + conteúdo |
| Notes/internal | `internal-notes.tsx`, `gurgel-notes-card.tsx` | Área de notas |

---

## 5. Componentes que podem ser unificados

### 5.1 Alta prioridade

| Unificação | Componentes atuais | Componente proposto |
|------------|-------------------|---------------------|
| StatusBadge | 9 badges | `ui/status-badge.tsx` com variant map |
| TablePagination | 5 paginations | `ui/table-pagination.tsx` |
| DataTable | Tabelas + cards mobile | `ui/data-table.tsx` com slot mobile |
| DrawerShell | ~15 drawers | `ui/drawer-shell.tsx` |
| SearchDropdown | 4 dropdowns | `ui/search-dropdown.tsx` |
| KpiCard | 6 variantes | `ui/kpi-card.tsx` com props sparkline/sub |

### 5.2 Média prioridade

| Unificação | Componentes atuais | Componente proposto |
|------------|-------------------|---------------------|
| HeroSection | 7 heroes | `ui/hero-section.tsx` |
| ChartCard | 3+ wrappers | `ui/chart-card.tsx` |
| QuickActions | 3 barras | `ui/quick-actions-bar.tsx` |
| FiltersPanel | `*-filters.tsx` | `ui/filters-panel.tsx` |
| ConfirmDialog | confirm + prompt | `ui/confirm-dialog.tsx` |
| SectionCard | settings-section + cards | `ui/section-card.tsx` |

### 5.3 Baixa prioridade

| Unificação | Notas |
|------------|-------|
| BarcodeScannerButton | Extrair para `ui/barcode-scanner.tsx` |
| TechnicalTimeline | Unificar maintenance + inspection |
| InspectionItem | Base compartilhada checklist/inspection |
| NotesCard | Unificar notas internas |

---

## 6. Sugestões de padronização

### 6.1 Estrutura de pastas

```
components/
├── ui/           # Primitivos (expandir de 11 → ~25)
├── shell/        # Layouts compartilhados
├── admin/        # Composições de domínio (sem duplicar primitivos)
├── student-area/
├── auth/         # Unificar login + cadastro + recovery
└── marketing/    # Renomear sections/ ou components landing
```

### 6.2 Convenções de nome

| Padrão atual | Padrão sugerido |
|--------------|-----------------|
| `*-page.tsx` (top-level) | Manter — página do módulo |
| `*-drawer.tsx` | Usar `DrawerShell` base |
| `*-modal.tsx` | Usar `AppModal` base |
| `*-badge.tsx` | Migrar para `StatusBadge` |
| `*-filters.tsx` | Migrar para `FiltersPanel` |
| `*-header.tsx` | Usar `AdminPageHeader` ou variant |

### 6.3 Exports

- Cada pasta de domínio tem `index.ts` parcial — completar barrel exports
- `components/admin/index.ts` existe — expandir re-exports

### 6.4 Métricas alvo

| Métrica | Atual | Alvo |
|---------|-------|------|
| Arquivos `components/ui/` | 11 | ~25 (após unificação) |
| Badges duplicados | 9 | 1 base + configs |
| Paginations duplicadas | 5 | 1 |
| Drawers com shell próprio | ~15 | 1 shell + conteúdo |
| Heroes duplicados | 7 | 1 base |

---

## 7. Componentes órfãos / legado

| Componente | Notas |
|------------|-------|
| `client-hero.tsx` (raiz) | Possível duplicata de landing vs admin |
| `cadastrar-piloto` route | Redirecionamento legado |
| `components/admin/index.ts` | Pode estar desatualizado |

---

## 8. Dependências externas por componente

| Biblioteca | Componentes |
|------------|-------------|
| ECharts | financial charts, inventory charts, KPI sparklines |
| react-day-picker | settings-date-picker, schedule calendar |
| Swiper | landing sections |
| react-icons/hi2 | Todos os módulos |
| xlsx | export-clients (via lib, não component) |

---

## 9. Lista completa

Para listar os 412 arquivos `.tsx`:

```powershell
Get-ChildItem -Path "components" -Recurse -Filter "*.tsx" | ForEach-Object { $_.FullName.Replace("$PWD\", "") }
```
