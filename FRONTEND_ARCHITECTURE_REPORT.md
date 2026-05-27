# FRONTEND_ARCHITECTURE_REPORT - Gurgel Team

## Resumo executivo

Arquitetura em camadas aplicada ao admin e área do aluno. **`npx tsc --noEmit` passa.** Agenda é o **primeiro domínio com camada HTTP** (rotas Next.js + `ScheduleRepositoryHttp`).

## Agenda — modo HTTP (implementado)

| Camada | Arquivo |
|--------|---------|
| Contratos API | `lib/contracts/schedule/schedule-api.types.ts` |
| Paths | `lib/api/schedule-api-paths.ts` |
| Repository HTTP | `repositories/schedule/ScheduleRepositoryHttp.ts` |
| Rotas Next (bridge mock) | `app/api/admin/schedule/events`, `upcoming-days`, `meta`, `events/[eventId]` |
| Service unificado | `services/schedule/scheduleService.ts` (`createScheduleService`) |
| Hooks | `useScheduleEvents`, `useScheduleUpcomingDays`, `useScheduleMeta`, `useScheduleDefaultDate` |

### Como testar agenda em HTTP

No `.env.local`:

```env
NEXT_PUBLIC_DATA_SOURCE=http
# Deixe vazio para usar rotas /api do próprio Next.js:
NEXT_PUBLIC_API_URL=
```

Reinicie `npm run dev` e abra `/admin/agenda`.

### Comportamento

- **`mock` (padrão):** `ScheduleRepositoryMock` via `scheduleService` (síncrono onde aplicável).
- **`http`:** `apiFetch` → rotas API → mesmo payload mock até existir backend Java/Node externo.
- Funções puras (formatar data, timeline, filtros em memória) em `lib/schedule/schedule-pure.ts`.

## Data source global

- `getAppServices().schedule` — agenda com mock/HTTP interno
- Demais domínios — ainda só mock

## Próximos domínios HTTP

1. Clientes ou financeiro (mesmo padrão: repository HTTP + rotas API)
2. Apontar `NEXT_PUBLIC_API_URL` para API real e substituir handlers das rotas
3. Bloqueios/remarcação/karts da agenda (`ScheduleBlocks*`, `ScheduleReschedule*`)

## Variáveis de ambiente

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` \| `http` |
| `NEXT_PUBLIC_API_URL` | Base externa; vazio = rotas relativas `/api/...` |
