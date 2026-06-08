# UI_AUDIT — Gurgel Team

> **Última atualização:** 2026-05-28  
> **Metodologia:** Varredura de `components/`, `app/globals.css`, `FRONTEND_AUDIT.md` (2026-05-27)  
> **Legenda:** `[CONFIRMADO]` = evidência no código · `[INFERIDO]` = observação de padrão

---

## 1. Resumo executivo

| Categoria | Severidade | Quantidade |
|-----------|------------|------------|
| Inconsistências visuais | Alta | ~15 padrões |
| Botões divergentes | Alta | 3 sistemas paralelos |
| Cards divergentes | Média | 8+ variantes |
| Tabelas divergentes | Alta | 5+ implementações |
| Inputs inconsistentes | Média | 4+ padrões |
| Problemas UX | Média-Alta | 12+ itens |
| Estados de UI ausentes | Alta | Maioria admin |

**Veredicto:** UI funcional para demonstração, mas **fragmentada** — design system híbrido sem enforcement.

---

## 2. Inconsistências visuais

### 2.1 Cores

| Problema | Evidência | Severidade |
|----------|-----------|------------|
| Tokens CSS vs hardcoded | Admin usa `#0d1f3c`, `#f3f5f9` inline; landing usa `var(--color-accent)` | Alta |
| Dark mode parcial | `ThemeProvider` existe; admin hardcoded light | Média |
| Badges com paletas distintas | 9 badges com cores Tailwind diferentes por módulo | Média |
| Erro inconsistente | `#c41e3a` em forms; outros erros usam `text-red-500` | Baixa |

### 2.2 Tipografia

| Problema | Evidência |
|----------|-----------|
| Micro-tipografia excessiva | `text-[10px]`, `text-[11px]`, `text-[13px]` espalhados |
| Títulos de página variam | `text-xl` vs `text-2xl` vs `text-lg` sem escala formal |
| Landing vs admin | Sora com pesos diferentes por contexto |
| Uppercase inconsistente | Labels KPI uppercase; labels form mixed case |

### 2.3 Espaçamento

| Problema | Evidência |
|----------|-----------|
| Padding cards varia | `p-4`, `p-5`, `p-6`, `p-7` sem regra clara |
| Gap grids inconsistente | `gap-3`, `gap-4`, `gap-5`, `var(--admin-gap)` |
| Landing CSS vs Tailwind | `72px 0` vs `py-12` vs `py-16` |

### 2.4 Bordas e sombras

| Problema | Evidência |
|----------|-----------|
| Border radius | `rounded-2xl` (admin) vs `rounded-card` (20px landing) vs `rounded-xl` (inputs) |
| Sombras repetidas inline | `shadow-[0_2px_12px_rgba(13,31,60,0.04)]` copiado em dezenas de arquivos |
| Bordas com opacidades diferentes | `0.08`, `0.06`, `0.12` sem token |

### 2.5 Ícones

| Problema | Evidência |
|----------|-----------|
| Tamanhos variam | `h-4 w-4`, `h-5 w-5`, `h-6 w-6` sem padrão |
| Cores | `text-neutral-500`, `text-[#0d1f3c]`, `text-accent` mixed |

---

## 3. Botões diferentes para a mesma função

`[CONFIRMADO]` — 3 sistemas paralelos:

### 3.1 Classes CSS globais (admin)

```css
.btn-outline-sm, .btn-outline-md
.btn-primary-sm, .btn-primary-md
```

- Localização: `app/globals.css`
- Uso: módulos admin (settings, schedule, maintenance)

### 3.2 Componente Button (landing)

- `components/ui/button.tsx` — `ButtonLink`, `ButtonNative`
- Estilo: `rounded-full`, gradient, `text-base font-semibold capitalize`

### 3.3 Botões inline custom

- `<button className="...">` com classes Tailwind ad hoc
- Presente em: drawers, modais, tabelas, cards mobile

### 3.4 Matriz de divergência

| Ação | Implementação A | Implementação B | Implementação C |
|------|-----------------|-----------------|-----------------|
| Salvar | `.btn-primary-md` | `bg-[#0d1f3c] px-4 py-2 rounded-xl` | `ButtonNative variant="primary"` |
| Cancelar | `.btn-outline-sm` | `border border-neutral-200 px-3 py-1.5` | Text link |
| Excluir | `ConfirmDialog` + red button | Inline `text-red-600` | `.btn-outline-sm` vermelho |
| Filtrar | `TableFiltersButton` | `FilterBox` clear button | Custom icon button |
| Adicionar | Header action button | FAB-style inline | Quick actions bar |

### 3.5 Impacto UX

- Densidade visual diferente entre módulos
- Hover/focus states inconsistentes
- Área clicável varia (altura 32px vs 40px vs 48px)

---

## 4. Cards diferentes para a mesma finalidade

### 4.1 KPI Cards (6 variantes)

| Componente | Diferença |
|------------|-----------|
| `ui/kpi-card.tsx` | Base: ícone + label + valor + delta |
| `clients-kpi-card.tsx` | + sparkline ECharts |
| `inventory-kpi-card.tsx` | + sparkline, grid 6 cols |
| `cash-flow-kpi-cards.tsx` | Grid wrapper próprio |
| `dre-summary-kpis.tsx` | Valores monetários formatados |
| `maintenance-metrics.tsx` | Métricas com subtexto técnico |

**Problema:** mesma função (métrica resumida), layouts ligeiramente diferentes.

### 4.2 List Cards / Mobile Cards (8 variantes)

| Componente | Módulo |
|------------|--------|
| `client-mobile-card.tsx` | Clientes |
| `client-card.tsx` | Clientes (grid view) |
| `maintenance-order-card.tsx` | Manutenção |
| `part-card.tsx` | Estoque |
| `schedule-event-card.tsx` | Agenda |
| `lesson-session-card.tsx` | Registro aulas |
| `kart-paddock-card.tsx` | Karts |
| `free-slot-card.tsx` | Agenda slots |

**Problema:** fallback mobile de tabelas com estruturas similares mas não compartilhadas.

### 4.3 Section Cards

| Componente | Uso |
|------------|-----|
| `settings-section.tsx` | Configurações |
| `financial-chart-card.tsx` | Gráficos financeiros |
| `plan-card.tsx` | Planos/preços |
| `integration-card.tsx` | Integrações |
| `permission-card.tsx` | Permissões |

### 4.4 Chart Cards

- `financial-chart-card.tsx` — wrapper ECharts padrão
- `inventory-charts.tsx` — charts inline
- `revenue-chart.tsx`, `cash-flow-evolution-chart.tsx` — wrappers próprios

---

## 5. Tabelas diferentes para o mesmo padrão

### 5.1 Implementações existentes

| Tabela | Shared classes | Mobile fallback | Filtros |
|--------|---------------|-----------------|---------|
| `client-table.tsx` | Próprias | `client-mobile-card` | `clients-filters-sheet` |
| `karts-fleet-table.tsx` | Próprias | Cards inline | `karts-filters` |
| `maintenance-order-table.tsx` | Próprias | `maintenance-order-card` | Inline |
| `parts-table.tsx` | `inventory-table-shared` | `part-card` | `parts-filters` |
| `suppliers-table.tsx` | `inventory-table-shared` | — | `suppliers-filters` |
| `accounts-receivable-table.tsx` | Próprias | — | `receivable-filters` |
| `accounts-payable-table.tsx` | Próprias | — | `payable-filters` |
| `dre-structured-table.tsx` | Própria hierárquica | — | `dre-period-filter` |

### 5.2 Divergências

| Aspecto | Variação |
|---------|----------|
| Header background | `bg-[#fafbfc]` vs `bg-neutral-50` vs none |
| Header font | `text-[10px] uppercase` vs `text-xs` |
| Row hover | `hover:bg-neutral-50` vs none |
| Seleção | Checkbox em algumas, ausente em outras |
| Ações | Icon buttons vs text buttons vs dropdown |
| min-width | `880px` clientes; outras variam |
| Paginação | 5 componentes separados |
| Empty state | Mensagem vs ilustração vs nada |

### 5.3 Único padrão compartilhado

`inventory-table-shared.tsx` — **único** arquivo de classes compartilhadas de tabela. Outros módulos não o utilizam.

---

## 6. Inputs inconsistentes

### 6.1 Padrões identificados

| Padrão | Onde | Estilo |
|--------|------|--------|
| Auth input | login, cadastro | `rounded-xl bg-[#fafbfc] px-4 py-3.5 text-[15px]` |
| Settings field | settings panels | `SettingsField` wrapper |
| Filter input | filter-box | `h-12 min-h-12 rounded-xl` |
| Inline input | drawers diversos | Classes ad hoc |
| Native select | mobile | `app-native-select` CSS |
| Native date | mobile | `app-native-date-input` CSS |
| AppDropdown | forms admin | Custom listbox |
| SearchableSelect | inventory, karts | Autocomplete custom |

### 6.2 Divergências

| Aspecto | Variação |
|---------|----------|
| Altura | 40px, 44px, 48px (h-10, h-11, h-12) |
| Border radius | `rounded-lg`, `rounded-xl` |
| Background | `#fafbfc`, `white`, `bg-neutral-50` |
| Focus ring | `ring-accent/15`, `ring-2 ring-blue-500`, none |
| Label position | Above vs floating vs inline |
| Error display | `FieldError` vs inline text vs border red |
| Placeholder color | `neutral-400` vs `neutral-500` |

### 6.3 Toggles e checkboxes

- `SettingsToggle` — switch custom
- `SettingsCheckbox` — checkbox custom
- Checkboxes nativos em alguns forms
- Toggle inline em drawers

---

## 7. Modais e drawers inconsistentes

### 7.1 Modais

| Tipo | z-index | Largura | Overlay |
|------|---------|---------|---------|
| AppModal | 300 | md/lg/2xl | Sim |
| ConfirmDialog | 240 | fixa | Sim |
| NewClassModal | — | custom | Sim |
| Domain modals | variado | variado | Sim |

### 7.2 Drawers

| Tipo | z-index | Largura | Background |
|------|---------|---------|------------|
| ScheduleDrawerShell | 225 | 480px lg | `#f3f5f9` |
| TableFiltersSheet | 220 | full | white |
| Client drawers | — | 480px | `#f3f5f9` |
| Maintenance drawer | — | variável | variável |

**Problema:** múltiplos shells com comportamento de scroll, close button e header ligeiramente diferentes.

---

## 8. Problemas de UX

### 8.1 Estados de interface

Baseado em `FRONTEND_AUDIT.md` §5:

| Módulo | Loading | Empty | Error | Skeleton |
|--------|---------|-------|-------|----------|
| Telemetria | OK | OK | OK | OK |
| Registro aulas | OK | Parcial | OK | Parcial |
| Admin clientes | Não | OK | Parcial | Não |
| Admin financeiro | Não | OK | Parcial | Não |
| Admin estoque | Não | OK | Parcial | Não |
| Admin agenda | Parcial | Parcial | Parcial | Não |
| Admin manutenção | Parcial | Parcial | Parcial | Não |
| Piloto dashboard | Parcial | Parcial | Parcial | Parcial |
| Landing | Não | Não | Não | Não |

**Impacto:** usuário não recebe feedback consistente durante carregamento ou falhas.

### 8.2 Responsividade

| Problema | Severidade | Detalhe |
|----------|------------|---------|
| Tabelas sem fallback mobile | Alta | Financeiro receber/pagar sem cards mobile |
| min-width alto | Média | `client-table` 880px — scroll horizontal |
| Filtros em linha | Média | Overflow em tablet |
| Drawers largura fixa | Média | 480px pode ser estreito em tablet landscape |
| Header oculto mobile | Baixa | Título página hidden < lg — depende de context |
| Botões agenda só ícone | OK | Intencional < 1024px |

### 8.3 Acessibilidade

| Problema | Evidência |
|----------|-----------|
| Focus visível inconsistente | Nem todos inputs/buttons têm focus ring |
| aria-labels ausentes | Icon-only buttons frequentes |
| Contraste micro-texto | 10px/11px uppercase pode falhar WCAG |
| Keyboard nav em dropdowns | AppDropdown custom — verificar |

### 8.4 Navegação

| Problema | Evidência |
|----------|-----------|
| Rotas órfãs | 401, 403, 500 sem link no menu |
| Módulos na nav sem rota | relatórios (ModuleKey only) |
| `/piloto/perfil/cadastrar-piloto` | Legado/redirecionamento |
| Sem breadcrumbs | Admin não tem trilha de navegação |

### 8.5 Feedback de ações

| Problema | Evidência |
|----------|-----------|
| Toasts ausentes | Ações de salvar/excluir sem confirmação visual global |
| Textos de demo | Mensagens simuladas em algumas ações |
| Undo ausente | Exclusões sem desfazer |

### 8.6 Formulários

| Problema | Evidência |
|----------|-----------|
| Validação inconsistente | Zod em auth; validação ad hoc em admin |
| Campos obrigatórios | Asterisco em alguns forms, ausente em outros |
| Máscaras | CPF/telefone em alguns; ausente em outros |

---

## 9. Loaders e feedback visual

| Padrão | Onde | Problema |
|--------|------|----------|
| Skeleton telemetria | Telemetria | Bem implementado |
| Progress bar | OCR upload, telemetria import | OK |
| Spinner inline | Alguns drawers | Inconsistente |
| Texto "Carregando..." | Alguns módulos | Sem spinner |
| Nenhum feedback | Clientes, financeiro, estoque | Crítico para API futura |

---

## 10. Sugestões de melhoria

### 10.1 Prioridade crítica

1. **Criar primitivos unificados:** `StatusBadge`, `TablePagination`, `DataTable`, `DrawerShell`, `Button` admin
2. **Migrar cores hardcoded** para tokens CSS no admin
3. **Implementar estados globais:** `LoadingState`, `EmptyState`, `ErrorState`, `Skeleton` — aplicar em todos módulos admin
4. **Unificar botões admin** — deprecar classes CSS globais em favor de componente

### 10.2 Prioridade alta

5. **Estender `inventory-table-shared`** para todos módulos ou criar `DataTable`
6. **Mobile fallback** para tabelas financeiras
7. **Toast/notification system** para feedback de ações
8. **FormField primitivo** — label + input + error unificado
9. **Decidir dark mode** — completar ou desativar explicitamente no admin

### 10.3 Prioridade média

10. **Escala tipográfica admin** — documentar e enforce 4-5 tamanhos
11. **Escala de spacing** — tokens para card padding, grid gap
12. **Breadcrumbs** no admin
13. **Focus/a11y audit** — aria-labels, focus rings
14. **Consolidar heroes** em componente base
15. **Remover textos de demo** das ações

### 10.4 Prioridade baixa

16. Storybook para primitivos
17. Unificar chart wrappers
18. Padronizar icon sizes (16/20/24)
19. Animations/transitions consistentes

---

## 11. Matriz de consistência por módulo

| Módulo | Cores | Tipografia | Cards | Tabelas | Forms | Estados | Responsivo |
|--------|-------|------------|-------|---------|-------|---------|------------|
| Landing | ★★★★ | ★★★★ | ★★★★ | N/A | ★★★ | ★ | ★★★★ |
| Auth | ★★★ | ★★★ | ★★★ | N/A | ★★★★ | ★★ | ★★★ |
| Admin dashboard | ★★★ | ★★★ | ★★★ | N/A | N/A | ★★ | ★★★★ |
| Clientes | ★★ | ★★ | ★★ | ★★★ | ★★★ | ★★ | ★★★★ |
| Agenda | ★★ | ★★ | ★★★ | ★★ | ★★★ | ★★ | ★★★★ |
| Karts | ★★ | ★★ | ★★★ | ★★★ | ★★ | ★★ | ★★★ |
| Manutenção | ★★ | ★★ | ★★ | ★★ | ★★ | ★★ | ★★★ |
| Estoque | ★★ | ★★ | ★★★ | ★★★★ | ★★★ | ★★ | ★★★ |
| Financeiro | ★★ | ★★ | ★★★ | ★★ | ★★ | ★★ | ★★ |
| Registro aulas | ★★★ | ★★★ | ★★★ | ★★★ | ★★★★ | ★★★★ | ★★★ |
| Telemetria | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★★★ | ★★★★ |
| Piloto | ★★★ | ★★★ | ★★★ | N/A | ★★★ | ★★★ | ★★★ |
| Settings | ★★ | ★★ | ★★★ | ★★ | ★★★★ | ★★ | ★★★ |

Escala: ★ = inconsistente · ★★★★ = consistente

---

## 12. Referências

- Auditoria original: `FRONTEND_AUDIT.md` (2026-05-27)
- Design system: `docs/DESIGN_SYSTEM.md`
- Inventário componentes: `docs/COMPONENT_INVENTORY.md`
- Checklist pré-backend: `FRONTEND_AUDIT.md` §11
