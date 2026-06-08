# Checkpoint — migração HTTP + PostgreSQL

**Data:** 2026-06-01  
**Documento principal de handoff:** [`docs/MIGRATION_STATUS.md`](docs/MIGRATION_STATUS.md)

---

## Estado atual

### Infraestrutura

- **Next.js 15** + **Prisma** + **PostgreSQL (Supabase)**
- Migrations aplicáveis via `npm run db:migrate`; seed via `npm run db:seed`
- Auth real: sessão opaca + cookie `gurgel_session`; `middleware.ts` com `ENABLE_ROUTE_GUARD`
- Modo dados: `NEXT_PUBLIC_DATA_SOURCE=mock|http` via `lib/data-source/mode.ts`
- Supabase JS client em `src/lib/supabase/` + `GET /api/v1/supabase/health`

### Arquitetura frontend (mantida)

```
UI → React Query / getAppServices() → services/ → repositories/ → mock | HTTP
```

- UI **não importa mocks diretamente** — usa `getAppServices()` ou hooks
- Registry: `lib/data-source/app-services.ts`
- HTTP client: `lib/api/http-client.ts` + `lib/api/v1-api-paths.ts`

### Domínios com HTTP funcional (P0)

| Domínio | Services | API |
|---------|----------|-----|
| Auth | API routes | `/api/v1/auth/*` |
| Agenda | `schedule`, `scheduleBlocks`, `scheduleReschedule`, `newClass`, `scheduleKarts`, `weekSchedule` | `/api/v1/schedule/*` |
| Clientes | `createClientsService()` | `/api/v1/clients/*` |
| Karts | `createKartsService()` | `/api/v1/karts/*` |
| Aulas | `createLessonsService()` | `/api/v1/lessons/*` |
| Referência | — | `/api/v1/reference/catalog` |

### Agenda P0 — concluído (2026-06-01)

- Eventos, meta, upcoming-days, detalhe, confirmar, cancelar, swap kart
- Nova aula, remarcação, bloqueios (drawer + timeline)
- Timeline deriva da grade real (`GET /schedule/slots`, `buildDayTimelineFromSlots`)
- **Grade semanal persistida:** Configurações → Horários → `PUT /api/v1/schedule/week`

### Ainda mock-only

- Configurações: datas específicas, exceções, geral, usuários, preços, etc.
- Financeiro, estoque, manutenção, dashboard, telemetria, área piloto
- Rotas legadas `/api/admin/schedule/*` (duplicadas)

---

## Como retomar

1. Ler **`docs/MIGRATION_STATUS.md`** (handoff completo)
2. Ler **`docs/AI_CONTEXT.md`** (resumo para agentes)
3. Modo mock: omitir `NEXT_PUBLIC_DATA_SOURCE` ou `mock`
4. Modo HTTP: `.env` com `DATABASE_URL`, `SESSION_SECRET`, `NEXT_PUBLIC_DATA_SOURCE=http`
5. Validar: `npx tsc --noEmit`

---

## Próximo trabalho sugerido

1. Smoke test manual agenda + config horários
2. Wire registro de aulas UI → HTTP
3. Persistir datas específicas / exceções de grade
4. Proxy `/api/admin/*` → v1
5. Demais domínios admin
