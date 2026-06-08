# FRONTEND_ARCHITECTURE_REPORT — Gurgel Team

> **Atualizado:** 2026-06-01  
> **Documento canônico de handoff:** [`docs/MIGRATION_STATUS.md`](docs/MIGRATION_STATUS.md)  
> Este arquivo mantém histórico da evolução arquitetural.

## Resumo executivo

Arquitetura em camadas no admin e área do piloto. **`npx tsc --noEmit` passa.**

- **Backend:** Route Handlers `/api/v1/*` + Prisma + PostgreSQL (Supabase)
- **Modo `http`:** domínios P0 usam repositories HTTP + DB real
- **Modo `mock`:** mocks in-memory (padrão, sem DB)

## Domínios HTTP (2026-06-01)

| Domínio | Services | API | Status |
|---------|----------|-----|--------|
| Auth | API routes | `/api/v1/auth/*` | ✅ |
| Agenda P0 | `schedule`, `scheduleBlocks`, `scheduleReschedule`, `newClass`, `scheduleKarts`, `weekSchedule` | `/api/v1/schedule/*` | ✅ |
| Clientes | `createClientsService()` | `/api/v1/clients/*` | ⚠️ |
| Karts | `createKartsService()` | `/api/v1/karts/*` | ⚠️ |
| Aulas | `createLessonsService()` | `/api/v1/lessons/*` | ⚠️ |
| Referência | — | `/api/v1/reference/catalog` | ✅ |
| Demais | `*ServiceMock` | — | ❌ mock |

## Agenda — camadas HTTP

| Camada | Arquivo |
|--------|---------|
| Contratos v1 | `lib/contracts/api/v1/schedule.api.schemas.ts` |
| Paths | `lib/api/v1-api-paths.ts` |
| Repositories HTTP | `ScheduleRepositoryHttp`, `ScheduleBlocksRepositoryHttp`, `ScheduleSlotsRepositoryHttp`, `ScheduleWeekRepositoryHttp` |
| Backend Prisma | `lib/server/schedule/*` |
| Rotas v1 | `app/api/v1/schedule/**` |
| Services | `scheduleService`, `scheduleBlocksService`, `scheduleRescheduleService`, `newClassService`, `weekScheduleService` |
| Hooks | `use-schedule.ts`, `use-week-schedule.ts` |
| Timeline | `lib/schedule/build-day-timeline.ts` |
| Config UI | `schedule-hours-panel.tsx` → `PUT /schedule/week` |

**Legado (deprecar):** `app/api/admin/schedule/*`, `lib/api/schedule-api-paths.ts`

### Como testar modo HTTP

```env
NEXT_PUBLIC_DATA_SOURCE=http
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
SESSION_SECRET=...
```

```bash
npm run db:migrate && npm run db:seed
npm run dev
```

Login: `ana.silva@gurgelteam.com.br` / `Gurgel@123` → `/admin/agenda`

### Comportamento

- **`mock`:** repositories mock + stores in-memory
- **`http`:** `apiFetch` (credentials include) → `/api/v1/*` → Prisma → PostgreSQL
- Timeline deriva da grade persistida (`GET /schedule/slots`), não de slots fixos mock

## Data source global

- `getAppServices()` em `lib/data-source/app-services.ts`
- Factories escolhem mock/HTTP internamente via `getDataSourceMode()`

## Próximos passos

Ver `docs/MIGRATION_STATUS.md` §9:

1. Registro de aulas UI → HTTP
2. Config datas específicas / exceções
3. Financeiro, estoque, manutenção
4. Proxy `/api/admin/*` → v1

## Variáveis de ambiente

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` \| `http` |
| `DATABASE_URL` / `DIRECT_URL` | PostgreSQL |
| `SESSION_SECRET` | Cookie sessão |
| `ENABLE_ROUTE_GUARD` | Proteção `/admin/*`, `/piloto/*` |
