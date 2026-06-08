# AI_CONTEXT — Gurgel Team (resumo para agentes)

> **Leia primeiro:** [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md) (status + última sessão) · depois este arquivo.  
> **Migração mock→HTTP:** [`MIGRATION_STATUS.md`](MIGRATION_STATUS.md) · Validação manual: [`VALIDATION_CHECKLIST.md`](VALIDATION_CHECKLIST.md)  
> **Atualizado:** 2026-06-05

---

## O que é este projeto

Frontend **Next.js 15** (`gurgel-team-site`) para o kartódromo **Gurgel Team**: landing, reserva pública, auth, painel admin operacional e área do piloto com telemetria.

**Backend:** Route Handlers Next.js + **Prisma + PostgreSQL (Supabase)**. Modo `http` liga UI aos endpoints `/api/v1/*`. Modo `mock` (padrão) funciona sem banco.

```
UI → React Query / getAppServices() → services/ → repositories/ → mocks | HTTP → Prisma/DB
```

---

## Stack essencial

Next.js 15 · React 19 · Tailwind 3 · TypeScript strict · TanStack Query · Zod · Prisma · Supabase · ECharts · Sora font

### Env crítico

| Variável | Valores |
|----------|---------|
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` (padrão) \| `http` |
| `DATABASE_URL` / `DIRECT_URL` | PostgreSQL Supabase |
| `SESSION_SECRET` | Cookie sessão |
| `ENABLE_ROUTE_GUARD` | `true` → protege `/admin/*`, `/piloto/*` |

Login demo: `ana.silva@gurgelteam.com.br` / `Gurgel@123` · Piloto: `piloto@gurgelteam.com.br` / `Gurgel@123`

---

## Rotas principais

| Área | Rotas |
|------|-------|
| Público | `/`, `/reserva`, `/login`, `/cadastro` |
| Piloto | `/piloto`, `/piloto/reservar`, `/piloto/perfil`, `/piloto/telemetria/*` |
| Admin | `/admin`, `/admin/agenda`, `/admin/clientes`, `/admin/equipe`, `/admin/karts`, `/admin/manutencao`, `/admin/estoque`, `/admin/financeiro`, `/admin/registro-aulas`, `/admin/configuracoes`, `/admin/telemetria/*` |
| API v1 | `/api/v1/auth/*`, `/api/v1/schedule/*`, `/api/v1/clients/*`, `/api/v1/karts/*`, `/api/v1/lessons/*`, `/api/v1/pilot/*`, `/api/v1/reference/catalog` |
| Legado | `/api/admin/*` — proxy para v1 (deprecado); preferir `/api/v1/*` |

**Middleware:** `middleware.ts` — guard opcional via `ENABLE_ROUTE_GUARD`.

---

## Arquitetura — onde mexer

| Camada | Pasta | Regra |
|--------|-------|-------|
| Contratos/DTOs | `lib/contracts/` | Tipos e Zod schemas |
| API v1 schemas | `lib/contracts/api/v1/` | Validação rotas |
| Backend | `lib/server/` | Repositories Prisma, auth, responses |
| Mocks/dados | `lib/*-mocks.ts` | Seed + regras (modo mock) |
| Repositories | `repositories/` | Mock ou `*RepositoryHttp.ts` |
| Services | `services/` | UI consome só isto |
| Registry | `lib/data-source/app-services.ts` | `getAppServices()` |
| Hooks | `lib/query/hooks/` | React Query |
| UI | `components/admin/`, `components/student-area/` | **Não importar mocks diretamente** |

---

## Estado da migração HTTP (2026-06-05)

→ Matriz completa: **`MIGRATION_STATUS.md` §3** · Status detalhado: **`SESSION_HANDOFF.md` §2**

| Status | Domínios |
|--------|----------|
| ✅ HTTP | Agenda, auth, dashboard admin, financeiro/estoque/manutenção (core), settings, equipe, clientes, karts, aulas, **piloto home/perfil/account** |
| ⚠️ Parcial | Piloto **reserva (só GET slots)**, telemetria (nuvem sem GPS), finance export PDF |
| ❌ Pendente | Reserva para dependente na UI, telemetria laps no Prisma (P2) |

### Piloto — arquivos importantes

- `components/student-area/booking/pilot-booking-page.tsx` — reservar horário
- `components/student-area/profile/profile-page.tsx` — perfil + vinculados
- `lib/server/pilot/build-pilot-booking-slots.ts` — grade do dia para piloto
- `lib/admin/pilot-nav-modules.ts` — `/piloto/reservar` → `pilotoAgenda`

### Agenda admin — arquivos importantes

- `components/admin/schedule-page.tsx`, `schedule/operational-timeline.tsx`
- `lib/schedule/build-day-timeline.ts` — timeline da grade real
- `lib/server/schedule/week-schedule-repository.ts` — persistência grade

---

## Módulos admin (nav)

dashboard · agenda · registroAulas · alunos(clientes) · **equipe** · karts · manutencao · estoque · financeiro · telemetria · configuracoes

Módulos piloto: `pilotoDashboard`, **`pilotoAgenda`** (`/piloto/reservar`), `pilotoTelemetria`, …

---

## Regras de negócio críticas

→ `docs/BUSINESS_RULES.md`

- Menor de 14 anos → responsável ≥18 cadastra
- Permissões por ModuleKey — enforcement server-side em `/api/v1/*`
- Agenda: slots da grade configurada; conflitos → 409
- DELETE bloqueios: permissão `edit` (não `delete`)
- Cancelamento: 24h = crédito; no-show = não reembolsável

---

## Fase do projeto

| Fase | Status |
|------|--------|
| 1 — UI visual | ✅ Concluída |
| 2 — Arquitetura funcional | ✅ Documentada |
| 3 — Prisma/schema | ✅ Migration + seed |
| 4 — API spec | ✅ v1 |
| 5 — Backend | ⚠️ P0 implementado |
| 6 — Integração HTTP | ⚠️ **Admin maduro**; piloto em polimento (reserva GET/POST ✅) |

→ Fluxo oficial: `PRE_BACKEND_FLOW.md` · Roadmap: `ROADMAP.md`

---

## Comandos úteis

```bash
npm run dev
npm run db:migrate && npm run db:seed
npm run smoke:setup && npm run smoke:checklist
npx tsx scripts/repair-staff-permissions.ts   # se admin 403 no dashboard
npm run validate
```

Modo HTTP: `.env` → `NEXT_PUBLIC_DATA_SOURCE=http`, `DATABASE_URL=...`, `SESSION_SECRET=...`  
Após pull com schema novo: parar dev → `npx prisma db push` → `npx prisma generate`

---

## Documentação — ordem de leitura

| Prioridade | Arquivo | Conteúdo |
|------------|---------|----------|
| 1 | **`SESSION_HANDOFF.md`** | Status do projeto + última sessão |
| 2 | **`MIGRATION_STATUS.md`** | Matriz mock vs HTTP + marcos |
| 3 | `AI_CONTEXT.md` | Este arquivo |
| 4 | `VALIDATION_CHECKLIST.md` | Testes manuais por rota |
| 5 | `API_SPEC.md` | Contratos HTTP |
| 6 | `BUSINESS_RULES.md` | Regras por domínio |

---

## Regras para o agente

1. **Não inventar** — basear-se no código e docs `/docs`
2. **Ler `SESSION_HANDOFF.md` + `MIGRATION_STATUS.md`** antes de propor próximo domínio
3. **UI não importa mocks** — usar `getAppServices()` ou hooks
4. **Minimizar escopo** — diffs focados
5. **Não commitar** sem pedido explícito
6. **Responder em português**
7. Distinguir `[CONFIRMADO]` vs `[INFERIDO]` vs `[PLANEJADO]`
