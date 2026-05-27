# Frontend Architecture (Preparacao backend)

Este documento descreve a arquitetura criada/estendida para desacoplar a UI da origem de dados, centralizar contratos e preparar a integracao real com backend/API (sem implementar backend agora).

## 1) Camadas

### Contratos (`/lib/contracts`)
- Tipos e DTOs por dominio (ex.: `auth`, `lessons`, `telemetry`, `inventory`, `finance`, `schedule`).
- Enums de status centralizados (ex.: `LessonStatus`, `TelemetryStatus`, `ConsentStatus`).
- Schemas Zod para validacao centralizada (ex.: `loginSchema`, `cadastroSchema`, `lessonRegistrationQuerySchema`).
- Contratos de erro e resposta padrao:
  - `ApiResponse<T>`
  - `ApiError`

### Repositories (`/repositories`)
- Camada que encapsula a origem dos dados.
- Implementacao mock/local por enquanto.
- Exemplos:
  - `repositories/lessons/LessonRepositoryMock.ts`
  - `repositories/inventory/inventoryPartsRepositoryMock.ts`
  - `repositories/finance/FinancialRepositoryMock.ts`
  - `repositories/schedule/ScheduleRepositoryMock.ts`
  - `repositories/schedule/ScheduleKartsRepositoryMock.ts`
  - `repositories/schedule/ScheduleBlocksRepositoryMock.ts`
  - `repositories/schedule/ScheduleRescheduleRepositoryMock.ts`

### Services (`/services`)
- Camada que orquestra regra de negocio leve, mapeamentos e preparo para cache/query.
- Deve ser a unica camada que a UI consome para dados/acoes.
- Exemplos:
  - `services/lessons/lessonServiceMock.ts`
  - `services/inventory/inventoryServiceMock.ts`
  - `services/telemetry/telemetryServiceMock.ts`
  - `services/finance/financialServiceMock.ts`
  - `services/schedule/scheduleServiceMock.ts`
  - `services/schedule/newClassServiceMock.ts`
  - `services/schedule/scheduleKartsServiceMock.ts`
  - `services/schedule/scheduleBlocksServiceMock.ts`
  - `services/schedule/scheduleRescheduleServiceMock.ts`
  - `services/auth/authServiceMock.ts`

### Data source (`/lib/data-source`)
- `getDataSourceMode()`, `assertMockDataSource()` em `mode.ts`
- `getAppServices()` em `app-services.ts` — registry de todos os `*ServiceMock`
- `lib/api/http-client.ts` — `apiFetch` + `unwrapApiResponse` para repositories HTTP futuros

### Query layer (`/lib/query`)
- `QueryProvider` no `app/layout.tsx` (TanStack Query).
- `lib/query/keys.ts` — chaves padronizadas por dominio.
- Hooks iniciais:
  - `use-financial-receivables.ts`, `use-financial-payables.ts`
  - `use-schedule.ts`

### UI (Components/Pages)
- Deve consumir services (direto ou via hooks React Query).
- Deve parar de importar `*mocks*.ts` / `*store*.ts` diretamente.

## 2) Fluxos de exemplo (dados)

### 2.1 Financeiro (contas a receber/pagar)
1. `financial-page.tsx` → `getAppServices().finance.getTabMeta()` (ou hook)
2. `accounts-receivable-table.tsx` → `useFinancialReceivables(filters)` → `getAppServices().finance`
3. `FinancialRepositoryMock` → `admin-financial-mocks.ts`

### 2.2 Agenda
1. `schedule-page.tsx` → `useScheduleEvents()`, `useScheduleUpcomingDays()`, `useScheduleMeta()`
2. `getAppServices().schedule` → mock: `ScheduleRepositoryMock` | http: `ScheduleRepositoryHttp` → `/api/admin/schedule/*`
3. Funções puras → `lib/schedule/schedule-pure.ts`

### 2.3 Registro de aulas
Ver secoes anteriores — `LessonServiceMock` + DTOs em `lib/contracts/lessons`.

## 3) Estado atual (o que ja foi aplicado)

- Contratos por dominio (`lib/contracts/*`) incluindo `finance/index.ts` com tipos legados.
- Services mock para clientes, karts, estoque, settings, financeiro (abas legadas), dashboard, auth.
- Query layer com hooks por dominio principal.
- UI admin sem mocks diretos: clientes, karts, estoque, settings, financeiro, dashboard, auth, agenda (incl. bloqueios/remarcacao/kart swap), manutencao, registro de aulas.
- Validacao: `lib/auth/validate-auth-forms.ts` + `AuthServiceMock` (login, cadastro, recovery).
- UI aluno: `StudentAreaServiceMock`, `StudentProfileServiceMock`, `StudentDashboardServiceMock`, `TelemetryServiceMock` (motor GPS em `lib/telemetry-engine` permanece na UI).

## 4) Proximo passo recomendado

1. Repositories HTTP por dominio (`apiFetch` + `unwrapApiResponse`).
2. `getAppServices()` escolher mock vs HTTP.
3. Padronizar loading/empty/error; migrar mais telas para hooks (`use-lessons`, `use-student-dashboard` disponíveis).
