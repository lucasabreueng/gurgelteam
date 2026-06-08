# MIGRATION_STATUS — Handoff para continuidade

> **Leia este arquivo em qualquer chat novo** junto com **`docs/SESSION_HANDOFF.md`** (última sessão) e `docs/AI_CONTEXT.md`.  
> **Atualizado:** 2026-06-05  
> **Objetivo:** registrar o estado exato da migração mock → HTTP + PostgreSQL (Supabase) para retomar sem perder contexto.

---

## 1. Resumo executivo

| Aspecto | Estado |
|---------|--------|
| **Fase atual** | **Fase 6** — integração HTTP (em andamento) |
| **Backend** | Next.js Route Handlers + Prisma + PostgreSQL (Supabase) |
| **Modo mock** | `NEXT_PUBLIC_DATA_SOURCE=mock` (padrão) — UI funciona sem DB |
| **Modo HTTP** | `NEXT_PUBLIC_DATA_SOURCE=http` — domínios P0 usam `/api/v1/*` + DB |
| **Auth** | Sessão opaca + cookie `gurgel_session`; login real via API |
| **Agenda P0** | **Concluída em HTTP** — eventos, bloqueios, remarcação, nova aula, swap kart, grade semanal |
| **Configurações → Horários** | Grade semanal **persiste** via `PUT /api/v1/schedule/week` |
| **Equipe (staff)** | **Concluído** — `/admin/equipe` + API `team` + perfis via Configurações |
| **Área piloto** | **Em polimento** — home/perfil/account HTTP; **`/piloto/reservar`** (slots GET + POST reserva) |
| **Próximo domínio sugerido** | Validação browser §12; reserva para dependente na UI; commit/push |

### 2.3 Smoke test HTTP

```bash
npm run dev          # terminal 1
npm run db:seed      # se necessário
npm run smoke:http   # login + endpoints principais (23 rotas, incl. team)
npm run smoke:checklist  # checklist §2.3 + domínios migrados
```

Variáveis opcionais: `SMOKE_BASE_URL`, `SMOKE_EMAIL`, `SMOKE_PASSWORD`.

---

## 2. Quick start (retomar trabalho)

### 2.1 Ambiente

```bash
cp .env.example .env
# Preencher: DATABASE_URL, DIRECT_URL, SESSION_SECRET
# Opcional Supabase client: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

npm install
npm run db:generate
npm run db:migrate      # aplica migrations no Supabase
npm run db:seed         # ~2 min remoto; cria usuários demo + grade + eventos

# Modo HTTP
# .env → NEXT_PUBLIC_DATA_SOURCE=http

npm run dev
```

### 2.2 Login demo (seed)

| Usuário | Senha | Papel |
|---------|-------|-------|
| `ana.silva@gurgelteam.com.br` | `Gurgel@123` | Admin (agenda + configuracoes edit) |
| `piloto@gurgelteam.com.br` | `Gurgel@123` | Piloto |
| `financeiro@gurgelteam.com.br` | `Gurgel@123` | Financeiro |

### 2.3 Smoke test agenda HTTP

1. Login admin → `/admin/agenda`
2. Confirmar/cancelar evento no drawer
3. Bloquear slot (drawer ou timeline)
4. Remarcar aula
5. Nova aula
6. Trocar kart
7. **Configurações → Horários** → editar grade → Salvar → voltar à agenda e verificar timeline

### 2.4 Validação técnica

```bash
npx tsc --noEmit
npm run lint
curl http://localhost:3000/api/v1/supabase/health   # se Supabase configurado
```

---

## 3. Matriz mock vs HTTP (domínios)

Legenda: ✅ HTTP completo · ⚠️ parcial · ❌ só mock

| Domínio | Service | Repository HTTP | Rotas API | UI |
|---------|---------|-----------------|-----------|-----|
| **Auth** | `AuthServiceMock` + API | — | `/api/v1/auth/*` | Login/cadastro/recovery integrados |
| **Agenda — eventos** | `createScheduleService()` | `ScheduleRepositoryHttp` | `/api/v1/schedule/events*` | ✅ |
| **Agenda — bloqueios** | `createScheduleBlocksService()` | `ScheduleBlocksRepositoryHttp` | `/api/v1/schedule/blocks*` | ✅ |
| **Agenda — remarcação** | `createScheduleRescheduleService()` | via schedule HTTP | `POST .../reschedule` | ✅ |
| **Agenda — nova aula** | `createNewClassService()` | via schedule HTTP | `POST .../events` | ✅ |
| **Agenda — karts catálogo** | `createScheduleKartsService()` | karts + reference | `/api/v1/karts`, `/reference/catalog` | ✅ |
| **Agenda — slots do dia** | schedule service | `ScheduleSlotsRepositoryHttp` | `GET /api/v1/schedule/slots` | ✅ |
| **Agenda — grade semanal** | `createWeekScheduleService()` | `ScheduleWeekRepositoryHttp` | `GET/PUT /api/v1/schedule/week` | ✅ Configurações |
| **Clientes** | `createClientsService()` | `ClientsRepositoryHttp` | `/api/v1/clients/*` | ✅ lista + perfil + rankings HTTP |
| **Karts** | `createKartsService()` | `KartsRepositoryHttp` | `/api/v1/karts/*` | ✅ lista + detalhe + paddock HTTP |
| **Aulas** | `createLessonsService()` | `LessonsRepositoryHttp` | `/api/v1/lessons/*` | ✅ lista + workspace + save HTTP |
| **Referência** | — | — | `GET /api/v1/reference/catalog` | ✅ categorias/níveis |
| Financeiro | `createFinancialService()` | `FinancialRepositoryHttp` | `/api/v1/finance/*` | ⚠️ AR/AP + KPIs + DRE + fluxo + **charts** + **insights** HTTP; tabs secundárias (pacotes, inadimplência, kart/cliente, ranking) via `useFinanceInsights()` |
| Estoque | `createInventoryService()` | `InventoryRepositoryHttp` | `/api/v1/inventory/*` | ⚠️ catálogo + movimentações + compras + histórico + **charts** HTTP |
| Manutenção | `createMaintenanceService()` + `createChecklistService()` + `createInspectionService()` | `MaintenanceRepositoryHttp` | `/api/v1/maintenance/*` | ⚠️ OS + checklist HTTP; modal inspeção técnica 100% via `GET /inspections/template`; diagrama checklist + **upload mídia** via API |
| Settings (geral) | `createSettingsService()` | `SettingsRepositoryHttp` | `/api/v1/settings/*` | ✅ org, catálogo, notificações, documentos, termos, integrações, aparência, segurança; **usuários** `GET` + **`PUT`** + perfis custom JSON |
| **Equipe** | `createTeamService()` | `TeamRepositoryHttp` | `/api/v1/team`, `/team/kpis`, `/team/:id` | ✅ lista, KPIs, criar/editar/remover; função = `permissionProfileId` |
| Dashboard | `createDashboardService()` | `DashboardRepositoryHttp` | `/api/v1/dashboard` | ✅ KPIs + agenda via `summary` (1 request); exige permissões admin no DB |
| Piloto | `createStudentAreaService()` + `createStudentProfileService()` + `createPilotBookingService()` | `StudentAreaRepositoryHttp`, `PilotBookingRepositoryHttp` | `/api/v1/pilot/*` | ⚠️ home + perfil + account + linked + **booking (GET/POST)** HTTP; telemetria parcial |
| Telemetria | `createTelemetryService()` | `TelemetryRepositoryHttp` | `/api/v1/telemetry/sessions*` | ⚠️ listagem + setores nuvem (`api:`) + overview admin HTTP; gráficos GPS só import local |

---

## 4. Agenda P0 — checklist (concluído)

- [x] Listagem eventos, meta, upcoming-days, detalhe
- [x] Confirmar / cancelar / trocar kart
- [x] Nova aula (`newClassService`)
- [x] Remarcação com validação de slot livre
- [x] Bloqueios (CRUD) — drawer + timeline inline
- [x] Timeline usa grade real (`buildDayTimelineFromSlots` + `GET /schedule/slots`)
- [x] Catálogo alunos/karts via API
- [x] Grade semanal persistida (Configurações → Horários → Salvar)
- [x] Invalidação React Query após mutações (`queryKeys.schedule.all`)
- [x] Datas específicas de grade (`specific_date_schedules`) — HTTP
- [x] Exceções de grade (`schedule_exceptions`) — HTTP
- [x] Proxy legado `/api/admin/schedule/*` + OCR → v1 (handlers compartilhados + `Deprecation`)

---

## 5. Arquivos-chave (mapa mental)

### Backend (server)

| Arquivo | Função |
|---------|--------|
| `lib/server/prisma.ts` | Cliente Prisma singleton |
| `lib/server/api/require-auth.ts` | Permissões por ModuleKey |
| `lib/server/api/responses.ts` | Envelope `{ success, data, error }` |
| `lib/server/schedule/schedule-repository.ts` | CRUD eventos |
| `lib/server/schedule/schedule-slots-repository.ts` | Slots efetivos por data |
| `lib/server/schedule/schedule-hours-repository.ts` | Grade + datas específicas + exceções |
| `lib/server/api/legacy-admin-schedule-handlers.ts` | Proxy `/api/admin/schedule/*` → v1 |
| `lib/server/lessons/lesson-ocr-handler.ts` | OCR compartilhado (v1 + legado) |
| `lib/server/schedule/schedule-meta.ts` | KPIs agenda |
| `lib/server/auth/session-service.ts` | Sessões + cookies |
| `lib/server/auth/sync-staff-permissions.ts` | Reaplica perfil/role no login (staff) |
| `lib/server/settings/permission-profile-store.ts` | JSON perfis em `organization_settings` |
| `lib/server/team/team-repository.ts` | CRUD membros equipe |

### API routes (v1 — principais)

```
/api/v1/auth/login|logout|session|register|password-recovery/*
/api/v1/schedule/events|events/:id|meta|upcoming-days|slots|week|blocks|blocks/:id
/api/v1/schedule/events/:id/cancel|reschedule|swap-kart
/api/v1/clients/*
/api/v1/karts/*
/api/v1/lessons/sessions/*
/api/v1/reference/catalog
/api/v1/team|team/kpis|team/:userId
/api/v1/settings/users (GET + PUT)
/api/v1/pilot/home|profile|account|evolution|achievements|dashboard|consents
/api/v1/pilot/booking/slots?date=
/api/v1/pilot/linked-pilots/*|profile/avatar
/api/v1/supabase/health
```

**Legado (proxy v1):** `/api/admin/schedule/*`, `/api/admin/lesson-registration/ocr` — headers `Deprecation`; usar `/api/v1/*`

### Frontend — agenda

| Arquivo | Função |
|---------|--------|
| `components/admin/schedule-page.tsx` | Página principal |
| `components/admin/schedule/operational-timeline.tsx` | Timeline + bloqueios inline |
| `lib/schedule/build-day-timeline.ts` | Monta rows da grade |
| `lib/query/hooks/use-schedule.ts` | React Query agenda |
| `lib/query/hooks/use-week-schedule.ts` | Grade semanal (config) |

### Frontend — configurações (grade)

| Arquivo | Função |
|---------|--------|
| `components/admin/settings/schedule-hours-panel.tsx` | UI grade; `forwardRef` + `getWeekDays()` |
| `components/admin/settings/settings-tab-content.tsx` | `save()` via ref → `weekSchedule.saveWeekSchedule()` |
| `components/admin/settings/admin-settings-page.tsx` | Salvar assíncrono + invalidação queries |

### Infra Supabase

| Arquivo | Função |
|---------|--------|
| `src/lib/supabase/client.ts` | Browser client |
| `src/lib/supabase/server.ts` | Server client |
| `src/lib/supabase/env.ts` | Validação env |
| `app/api/v1/supabase/health/route.ts` | Health check |

### Prisma

| Arquivo | Função |
|---------|--------|
| `prisma/schema.prisma` | 30+ modelos |
| `prisma/migrations/20260528140000_init/` | Migration inicial |
| `prisma/seed.ts` | Seed completo |
| `prisma/seed-week-schedule.ts` | Grade semanal inicial |

---

## 6. Variáveis de ambiente

Ver `.env.example` completo. Essenciais:

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | Prisma runtime (pooler 6543 prod) |
| `DIRECT_URL` | Migrations/seed (5432) |
| `SESSION_SECRET` | Assinatura cookie sessão |
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` \| `http` |
| `ENABLE_ROUTE_GUARD` | `true` protege `/admin/*`, `/piloto/*` |
| `SEED_DEFAULT_PASSWORD` | Senha usuários demo |
| `OPENAI_API_KEY` | OCR registro de aulas |

### Scripts úteis (sessão 2026-06-02)

| Comando | Uso |
|---------|-----|
| `npx tsx scripts/repair-staff-permissions.ts` | Corrige permissões staff (admin com módulos piloto) |
| `npx tsx scripts/delete-user-by-username.ts <user>` | Remove conta por username |

---

## 7. Decisões técnicas importantes

1. **IDs:** mocks usam strings (`"c1"`); DB usa UUID. `resolve-reference-ids.ts` mapeia slugs ↔ UUID na persistência.
2. **Permissão DELETE bloqueios:** exige `edit` (não `delete`) — admin seed não tinha `excluir` na agenda.
3. **Timeline:** não usa mais `DAY_TIMELINE_SLOTS` fixo (08:00–19:00); deriva da grade persistida.
4. **Grade semanal save:** `replaceWeekSchedule` faz delete-all + createMany em transação.
5. **Otimizações backend (2026-06-01):** auth consolidada em `resolveSessionAuth()` (1 query); `upcoming-days` com GROUP BY SQL + capacidade real da grade; sync de aulas em batch (categorias + transação); semana de aulas via `?days=7` (1 request HTTP).
6. **Dependências corrigidas:** `next` ^15.1.6; `xlsx` → `exceljs` (audit 0 vulns).
7. **Perfis de permissões:** templates em `SETTINGS_USERS` (ids `user-administrador`, …); custom em `permission_profiles` JSON; equipe usa `permissionProfileId` no `User`.
8. **Dashboard admin:** `requireAnyAdminModulePermission` + sync no login; KPIs/agenda via query única `dashboard.summary`.

---

## 8. Problemas conhecidos

| Item | Status |
|------|--------|
| Seed remoto Supabase ~2 min | Normal |
| Migration BOM (`\u{feff}`) | Corrigido — strip no SQL |
| Config: datas específicas / exceções | ✅ HTTP — persistem via `GET/PUT /schedule/week` |
| Registro de aulas UI | ✅ HTTP — UI via `getAppServices()` + hooks; telemetria opções ainda mock |
| Financeiro, estoque, manutenção | ⚠️ Core + passos 2–6 + lacunas A/B HTTP (2026-06-02); export PDF/Excel e drawer checklist parcial |
| Design system fragmentado | Ver `UI_AUDIT.md` |
| Rotas legadas `/api/admin/*` | Proxy para v1 — deprecadas (Sunset Sep/2026) |
| Admin 403 no `/dashboard` após dados inconsistentes | Rodar `repair-staff-permissions.ts` + relogin; login já re-sincroniza staff |
| Prisma `permissionProfiles` / `permissionProfileId` | Rodar `db push` + `generate` após pull (ver `SESSION_HANDOFF.md` §5) |
| Piloto reserva | UI + `GET/POST /pilot/booking*` ✅ |
| Migrations perfil piloto (jun/2026) | `client_profile_fields`, `guardian_link`, `preferences_emergency` — ver §5 SESSION_HANDOFF |

---

## 9. Próximos passos (ordem sugerida)

1. **Smoke test manual** — checklist §12 piloto (reservar + perfil)
1. **Validação browser** — §12 `VALIDATION_CHECKLIST.md` (reservar + confirmar)
2. **Commit/push** — consolidar trabalho local
3. Reserva para dependente na UI (`clientId` opcional na API)
4. Continuar `VALIDATION_CHECKLIST.md` admin (equipe §3.5)

### Passos 2–6 (2026-06-02) — resumo

| Passo | Backend | UI |
|-------|---------|-----|
| 2 Manutenção | `MaintenanceInspection`, checklist por OS, rotas template/checklist/inspections | OS HTTP; modal inspeção via `useInspectionTemplate()`; drawer checklist ainda mock parcial |
| 3 Estoque | purchase-orders, history, movements POST | drawers entrada/saída/compra + tabelas via React Query |
| 4 Financeiro | `GET /finance/charts`, `GET /finance/insights` | overview + relatórios via hooks; tabs secundárias via `useFinanceInsights()` |
| 5 Telemetria | `GET /telemetry/sessions/:id` | listagem HTTP; componentes charts ainda mock |
| 6 Clientes | stats + timeline + profile HTTP | `client-profile-drawer` via `getAppServices()` |

---

## 10. Histórico de marcos

| Data | Marco |
|------|-------|
| 2026-05-27 | Checkpoint arquitetural — UI desacoplada de mocks |
| 2026-05-28 | Fases 1–4 documentadas; Prisma schema; API spec v1 |
| 2026-05-28 | Fase 5 iniciada — auth, Prisma, domínios P0 backend |
| 2026-05-28 | Fase 6 — repositories HTTP clientes/karts/lessons/schedule |
| 2026-06-01 | Agenda P0 HTTP completa + grade semanal persistida |
| 2026-06-01 | Karts detalhe HTTP — `GET /karts/:id/detail` + drawer via React Query |
| 2026-06-01 | Otimizações backend — auth 1 query, upcoming-days SQL, lessons batch + `?days=7` |
| 2026-06-01 | Domínios P1 HTTP — finance, inventory, maintenance, dashboard, settings org, pilot |
| 2026-06-02 | Passos 2–6 — charts finance, estoque compras/histórico, manutenção checklist API, telemetria sessão, clientes perfil; `npm run smoke:checklist` |
| 2026-06-02 | Lacunas A + B — `GET /finance/insights`, tabs financeiras secundárias HTTP, modal inspeção técnica via template API; smoke **46 checks OK** |
| 2026-06-02 | Passos smoke escritas + meta — `GET /finance/meta`, upload mídia inspeção, OS/inspeção/estoque/piloto PATCH no smoke; filtros financeiros via `useFinanceMeta()`; smoke **53 checks OK** |
| 2026-06-02 | Passos 1–4 automatizados — smoke agenda/aula/pagamento, OS detail enriquecido, modal nova OS HTTP, `POST /finance/payments` + payment-drawer HTTP |
| 2026-06-02 | CI + smoke determinístico — `.github/workflows/validate.yml`, `smoke:setup`, `validate`/`validate:smoke`, escritas cancel/reschedule/checklist/purchase-order |
| 2026-06-02 | **Equipe** `/admin/equipe` + API team + `PUT /settings/users` + perfis custom JSON + fix dashboard 403 (sync permissões) |
| 2026-06-04 | **Perfil piloto HTTP** — account, linked pilots, preferências/emergência, migrations cliente |
| 2026-06-05 | **`/piloto/reservar`** + `GET/POST /pilot/booking`; menu piloto (Dashboard, Reservar, Telemetria) |

---

## 11. Documentos relacionados

| Arquivo | Conteúdo |
|---------|----------|
| **`docs/SESSION_HANDOFF.md`** | **Última sessão** — retomar chat sem perder contexto |
| `docs/AI_CONTEXT.md` | Resumo para agentes (entrada rápida) |
| `docs/VALIDATION_CHECKLIST.md` | Validação manual HTTP — página a página |
| `docs/PRE_BACKEND_FLOW.md` | Fases 1–6 oficiais |
| `docs/ROADMAP.md` | Concluído / pendente |
| `docs/API_SPEC.md` | Contratos HTTP |
| `docs/DATABASE_REFERENCE.md` | Modelo de dados |
| `CHECKPOINT.md` | Marco arquitetural (atualizado) |
