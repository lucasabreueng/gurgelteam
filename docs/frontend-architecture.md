# Frontend Architecture

> **Atualizado:** 2026-06-01 · Handoff: [`MIGRATION_STATUS.md`](MIGRATION_STATUS.md)

Arquitetura em camadas para desacoplar UI da origem de dados. Backend real via Route Handlers + Prisma (modo `http`).

## 1) Camadas

### Contratos (`/lib/contracts`)
- Tipos e DTOs por domínio
- Schemas Zod UI + **`lib/contracts/api/v1/`** para rotas HTTP
- `ApiResponse<T>`, `ApiError`

### Backend server (`/lib/server`)
- Repositories Prisma por domínio (`schedule-repository`, `week-schedule-repository`, etc.)
- Auth: sessão, cookies, password scrypt
- `require-auth.ts` — permissões por ModuleKey

### Repositories (`/repositories`)
- Mock: `*RepositoryMock.ts`
- HTTP: `*RepositoryHttp.ts` — `apiFetch` + `unwrapApiResponse`
- Agenda HTTP: `ScheduleRepositoryHttp`, `ScheduleBlocksRepositoryHttp`, `ScheduleSlotsRepositoryHttp`, `ScheduleWeekRepositoryHttp`

### Services (`/services`)
- Factories com modo mock/http: `createScheduleService()`, `createWeekScheduleService()`, etc.
- UI consome **somente** services ou hooks React Query

### Data source (`/lib/data-source`)
- `getDataSourceMode()` — `mock` | `http`
- `getAppServices()` — registry central
- `lib/api/v1-api-paths.ts` — paths `/api/v1/*`

### Query layer (`/lib/query`)
- `queryKeys` em `keys.ts` — incl. `schedule.week`, `schedule.events`, etc.
- Hooks: `use-schedule.ts`, `use-week-schedule.ts`, etc.

### UI
- **Não importar mocks** — usar `getAppServices()` ou hooks

## 2) Fluxos principais

### Agenda (modo http — P0 completo)
1. `schedule-page.tsx` → `useScheduleEvents()`, `useScheduleUpcomingDays()`
2. Timeline → `GET /api/v1/schedule/slots?date=` → `buildDayTimelineFromSlots`
3. Mutations → `scheduleBlocks`, `scheduleReschedule`, `newClass` services
4. Config grade → `useWeekSchedule()` → `PUT /api/v1/schedule/week`

### Auth
1. Login → `POST /api/v1/auth/login` → cookie `gurgel_session`
2. Requests HTTP → `credentials: "include"`

## 3) Estado atual

| Domínio | Mock | HTTP |
|---------|------|------|
| Agenda (P0) | ✅ | ✅ |
| Grade semanal (config) | ✅ | ✅ |
| Auth | fallback | ✅ |
| Clientes, karts, aulas | ✅ | ⚠️ API + UI parcial |
| Financeiro, estoque, manutenção, settings | ✅ | ❌ |

## 4) Próximos passos

Ver `MIGRATION_STATUS.md` §9:
1. Registro de aulas UI → HTTP
2. Config datas específicas / exceções
3. Demais domínios admin
4. Deprecar `/api/admin/*`
