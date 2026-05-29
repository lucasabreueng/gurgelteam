# AI_CONTEXT — Gurgel Team (resumo para agentes)

> **Leia este arquivo primeiro** em qualquer chat novo. Detalhes em `/docs/*.md`.  
> **Atualizado:** 2026-05-28

---

## O que é este projeto

Frontend **Next.js 15** (`gurgel-team-site`) para o kartódromo **Gurgel Team**: landing, reserva pública, auth, painel admin operacional e área do piloto com telemetria. **Não há backend/banco** — dados via mocks; agenda tem bridge HTTP parcial.

```
UI → React Query hooks / getAppServices() → services/ → repositories/ → mocks | HTTP
```

---

## Stack essencial

Next.js 15 · React 19 · Tailwind 3 · TypeScript strict · TanStack Query · Zod · ECharts · Sora font

Env: `NEXT_PUBLIC_DATA_SOURCE=mock|http` · `NEXT_PUBLIC_API_URL=` (vazio = rotas `/api` locais)

---

## Rotas principais

| Área | Rotas |
|------|-------|
| Público | `/`, `/reserva`, `/login`, `/cadastro` |
| Piloto | `/piloto`, `/piloto/perfil`, `/piloto/telemetria/*` |
| Admin | `/admin`, `/admin/agenda`, `/admin/clientes`, `/admin/karts`, `/admin/manutencao`, `/admin/estoque`, `/admin/financeiro`, `/admin/registro-aulas`, `/admin/configuracoes`, `/admin/telemetria/*` |
| API | `/api/admin/schedule/*` (GET), `/api/admin/lesson-registration/ocr` (POST) |

**Sem middleware** — rotas admin/piloto não protegidas server-side.

---

## Arquitetura — onde mexer

| Camada | Pasta | Regra |
|--------|-------|-------|
| Contratos/DTOs | `lib/contracts/` | Tipos e Zod schemas |
| Mocks/dados | `lib/*-mocks.ts` | Seed + regras de negócio |
| Repositories | `repositories/` | Acesso a dados |
| Services | `services/` | UI consome só isto |
| Registry | `lib/data-source/app-services.ts` | `getAppServices()` |
| Hooks | `lib/query/hooks/` | React Query |
| UI | `components/admin/`, `components/student-area/`, `components/ui/` | **Não importar mocks diretamente** |
| Telemetria engine | `lib/telemetry-engine/` | Pipeline client-side (MyChron, Alfano, GPS, GoPro) |

Agenda é o **único domínio com HTTP**: `services/schedule/scheduleService.ts` → mock ou `ScheduleRepositoryHttp`.

---

## Módulos admin (nav)

dashboard · agenda · registroAulas · alunos(clientes) · karts · manutencao · estoque · financeiro · telemetria · configuracoes

**Planejados sem rota:** instrutores, campeonatos, relatorios

---

## Regras de negócio críticas

→ Detalhes completos: `docs/BUSINESS_RULES.md`

- Menor de 14 anos **não se cadastra** — responsável ≥18 cadastra e vincula
- Permissões mock: admin, instrutor, recepcao, financeiro (+ granular por ModuleKey) — **sem enforcement server-side**
- Agenda: slots 50min, instrutor fixo "Gurgel", conflitos detectados (kart, instrutor, pagamento)
- Checklist/inspeção: fail crítico → kart **bloqueado**
- Estoque: saída > stock = **erro**; critical/low gera alertas
- Manutenção OS: fluxo detectado → … → liberado; kart client tem fluxo orçamento
- Financeiro: receber/pagar com status pago/pendente/vencido/parcial; DRE hierárquica
- Registro aulas: evento finalizado → sessão pendente_registro; OCR via OpenAI
- Cancelamento: 24h antes = crédito; no-show = não reembolsável

---

## Design system — regras rápidas

→ Detalhes: `docs/DESIGN_SYSTEM.md`

- **Admin:** cores hardcoded `#0d1f3c` / `#f3f5f9`; cards `rounded-2xl border rgba(17,17,17,0.08)`
- **Breakpoint pivot:** `lg` (1024px) — tabela↔cards, filtros inline↔sheet
- **Primitivos:** `components/ui/` (11 arquivos — KpiCard, AppModal, FilterBox, etc.)
- **Problema conhecido:** badges, paginações, drawers e botões duplicados por módulo
- **Botões admin:** classes `.btn-primary-sm/md`, `.btn-outline-sm/md` em globals.css OU inline

---

## Modelo de dados

→ Detalhes: `docs/DATABASE_REFERENCE.md`

**Não existe banco.** Entidades lógicas: User, Client, Kart, ScheduleEvent, LessonSession, MaintenanceOrder, InventoryPart, Supplier, AccountReceivable/Payable, TelemetrySession, ModulePermission, Consent.

Contratos em `lib/contracts/`; enums centrais em `lib/contracts/enums.ts` (LessonStatus, TelemetryStatus, ConsentStatus).

---

## Componentes

→ Inventário: `docs/COMPONENT_INVENTORY.md` (412 `.tsx`)

Unificar prioritariamente: StatusBadge (9), TablePagination (5), DrawerShell (~15), KpiCard (6).

---

## Estado do projeto

→ Roadmap: `docs/ROADMAP.md`

| Status | Itens |
|--------|-------|
| **Concluído** | UI admin completa (mock), área piloto, telemetria engine, arquitetura em camadas, agenda HTTP bridge, OCR |
| **Em andamento** | Registro aulas (store local), estoque (stores locais), migração mock→services |
| **Pendente** | Backend, banco, auth real, middleware, HTTP outros domínios, módulos instrutores/campeonatos/relatórios |
| **Não pronto p/ backend** | Design system fragmentado, estados loading/error incompletos |

---

## UI — problemas conhecidos

→ Auditoria: `docs/UI_AUDIT.md`

- 3 sistemas de botões paralelos
- Tabelas sem padrão único (exceto estoque `inventory-table-shared`)
- Inputs inconsistentes entre módulos
- Loading/skeleton ausente na maioria dos módulos admin
- Dark mode parcial (admin hardcoded light)

---

## Comandos úteis

```bash
npm run dev          # dev server (predev: build gopro vendor)
npm run build        # production build
npx tsc --noEmit     # validar tipos
npm run lint         # eslint
```

Testar agenda HTTP: `.env.local` → `NEXT_PUBLIC_DATA_SOURCE=http`, `NEXT_PUBLIC_API_URL=`

---

## Documentação completa

| Arquivo | Conteúdo |
|---------|----------|
| `PROJECT_CONTEXT.md` | Visão geral, rotas, tech, convenções |
| `DESIGN_SYSTEM.md` | Cores, tipografia, padrões UI |
| `BUSINESS_RULES.md` | Regras de negócio por domínio |
| `DATABASE_REFERENCE.md` | Entidades, relacionamentos, integridade |
| `ROADMAP.md` | Concluído, em andamento, pendente |
| `COMPONENT_INVENTORY.md` | 412 componentes, duplicações, unificações |
| `UI_AUDIT.md` | Inconsistências visuais e UX |
| `frontend-architecture.md` | Arquitetura em camadas (legado) |

Docs raiz (referência histórica): `FRONTEND_AUDIT.md`, `CHECKPOINT.md`, `FRONTEND_ARCHITECTURE_REPORT.md`

---

## Regras para o agente

1. **Não inventar** — basear-se no código e docs `/docs`
2. **UI não importa mocks** — usar `getAppServices()` ou hooks React Query
3. **Minimizar escopo** — diffs focados, seguir convenções do arquivo
4. **Scrollbars** — ver `DESIGN_SYSTEM.md` §4.6: painéis/drawers/modais usam overflow + estilo automático; tabs/KPI strip usam `app-scrollbar-hidden`; dropdowns usam `app-dropdown-scrollbar`
5. **Não commitar** sem pedido explícito
6. **Responder em português**
7. Distinguir `[CONFIRMADO]` (código) vs `[INFERIDO]` (dedução/planejado)
