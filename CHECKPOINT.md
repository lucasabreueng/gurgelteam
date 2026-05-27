# Checkpoint — preparação arquitetural frontend

**Data:** 2026-05-27  
**Objetivo:** marcar o fim da etapa de arquitetura (antes de mudanças de interface).

## Estado desta etapa

- UI admin e área do aluno consomem `*ServiceMock` / `getAppServices()` — sem imports diretos de `*-mocks` nos componentes.
- **Agenda:** primeiro domínio com modo HTTP (`ScheduleRepositoryHttp` + rotas `/api/admin/schedule/*`).
- Contratos em `lib/contracts/`, repositories em `repositories/`, services em `services/`.
- React Query: hooks em `lib/query/hooks/` (incl. `useScheduleMeta`, `use-lessons`, `use-student-dashboard`).
- `lib/data-source/` — `getAppServices()`, `getDataSourceMode()`.
- `lib/api/http-client.ts` — `apiFetch` + `unwrapApiResponse`.
- Documentação: `FRONTEND_ARCHITECTURE_REPORT.md`, `docs/frontend-architecture.md`.

## Como retomar após mudanças de UI

1. Modo mock (padrão): não definir `NEXT_PUBLIC_DATA_SOURCE` ou usar `mock`.
2. Testar agenda HTTP: `NEXT_PUBLIC_DATA_SOURCE=http` e `NEXT_PUBLIC_API_URL=` (rotas Next locais).
3. Validar tipos: `npx tsc --noEmit`.

## Próximo trabalho arquitetural (não feito nesta etapa)

- HTTP para bloqueios/remarcação/nova aula da agenda.
- HTTP para outros domínios (clientes, financeiro, …).
- Backend real substituindo handlers em `app/api/admin/schedule/*`.
