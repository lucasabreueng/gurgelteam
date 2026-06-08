# API_SPEC — Contratos HTTP Gurgel Team (Fase 4)

> **Status:** `[CONFIRMADO v1]` — atualizado 2026-06-01  
> **Versão:** `v1`  
> **Implementação:** Fase 5 (backend) · Integração HTTP: Fase 6  
> **Schemas Zod:** `lib/contracts/api/v1/*.api.schemas.ts`  
> **OpenAPI:** `docs/openapi/gurgel-core.yaml`

---

## 1. Convenções

### 1.1 Base URL

| Ambiente | Base |
|----------|------|
| Produção | `https://api.gurgelteam.com.br/v1` |
| Next.js (transição) | `/api/v1` |
| Legado (agenda mock) | `/api/admin/schedule/*` — migrar para v1 |

### 1.2 Autenticação

| Contexto | Mecanismo |
|----------|-----------|
| Staff `/admin` | Bearer `Authorization: Bearer <accessToken>` **ou** cookie `session` httpOnly |
| Portal `/piloto` | Mesmo token; escopo limitado ao `clientId` do usuário |
| Jobs internos | Service token (Fase 5) |

Rotas públicas: `POST /auth/login`, `POST /auth/register`, recovery.

### 1.3 Envelope de resposta

Todas as rotas JSON retornam `ApiResponse<T>`:

```json
{
  "success": true,
  "data": { },
  "message": "opcional"
}
```

Erro:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Evento não encontrado.",
    "httpStatus": 404,
    "details": {}
  }
}
```

**Schema:** `lib/contracts/api/api-response.ts`, `api-error.ts`, `common.schemas.ts`

### 1.4 Códigos de erro (`error.code`)

| Código | HTTP | Uso |
|--------|------|-----|
| `VALIDATION_ERROR` | 400 | Body/query inválido (Zod) |
| `UNAUTHORIZED` | 401 | Token ausente/expirado |
| `FORBIDDEN` | 403 | Sem permissão ModuleKey / escopo |
| `NOT_FOUND` | 404 | Recurso inexistente |
| `CONFLICT` | 409 | Conflito agenda, kart em uso |
| `BUSINESS_RULE` | 422 | Regra `BR-*` violada |
| `RATE_LIMITED` | 429 | Login, OCR, upload |
| `SERVICE_UNAVAILABLE` | 503 | OCR/OpenAI indisponível |
| `INTERNAL_ERROR` | 500 | Erro não tratado |

### 1.5 Paginação

Query: `page` (default 1), `pageSize` (default 20, max 100).

Resposta paginada:

```json
{
  "success": true,
  "data": {
    "items": [],
    "meta": { "page": 1, "pageSize": 20, "total": 0, "totalPages": 0 }
  }
}
```

### 1.6 Permissões

Cada rota admin exige `ModuleKey` conforme `PERMISSIONS_MATRIX.md`. Middleware valida `canView` / `canEdit` / `canDelete`.

### 1.7 Valores monetários

API v1 usa **centavos inteiros** (`amountCents`). UI pode formatar BRL; mocks legados com string migram na Fase 6.

### 1.8 Datas

- `YYYY-MM-DD` — datas calendário (`dueDate`, filtros)
- ISO 8601 com offset — `startsAt`, `paidAt`, timestamps

---

## 2. Auth (`/auth`)

| Método | Path | Body / Query | Response `data` | Permissão |
|--------|------|--------------|-------------------|-----------|
| POST | `/auth/login` | `loginRequestSchema` | `loginResponseSchema` | Público |
| POST | `/auth/logout` | — | `{ ok: true }` | Autenticado |
| GET | `/auth/session` | — | `sessionResponseSchema` | Autenticado |
| POST | `/auth/register` | `registerRequestSchema` | `authUserSchema` | Público |
| POST | `/auth/password-recovery` | `passwordRecoveryRequestSchema` | `{ sent: true }` | Público |
| POST | `/auth/password-recovery/verify` | `passwordRecoveryVerifySchema` | `{ token }` | Público |
| POST | `/auth/password-recovery/reset` | `resetPasswordRequestSchema` | `{ ok: true }` | Token recovery |

**Regras:** `BR-AUTH-MINOR` — cadastro &lt; 14 anos → 403. Rate limit login: 10/min/IP.

**Mock atual:** `AuthServiceMock` — sem validação real.

---

## 3. Clientes (`/clients`) — ModuleKey: `alunos`

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/clients` | `clientsQuerySchema` | paginated `clientListItemSchema` | view |
| GET | `/clients/:id` | — | perfil completo | view |
| POST | `/clients` | `createClientSchema` | `clientListItemSchema` | edit |
| PATCH | `/clients/:id` | `updateClientSchema` | `clientListItemSchema` | edit |
| POST | `/clients/:id/guardians` | `linkGuardianSchema` | `guardianLinkSchema` | edit |
| GET | `/clients/:id/stats` | `pilotStatsQuerySchema` | `pilotStatsSchema` | view |
| GET | `/clients/:id/timeline` | — | timeline events | view |

**Nomenclatura UI:** label “Clientes” — ver `NOMENCLATURE.md`.

---

## 4. Agenda (`/schedule`) — ModuleKey: `agenda`

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/schedule/meta` | — | KPIs, filtros operacionais | view |
| GET | `/schedule/events` | `scheduleEventsQuerySchema` | `ScheduleEventDTO[]` | view |
| GET | `/schedule/events/:id` | — | `scheduleEventSchema` | view |
| POST | `/schedule/events` | `createScheduleEventSchema` | `scheduleEventSchema` | edit |
| PATCH | `/schedule/events/:id` | `updateScheduleEventSchema` | `scheduleEventSchema` | edit |
| POST | `/schedule/events/:id/cancel` | `{ reason? }` | `scheduleEventSchema` | edit |
| POST | `/schedule/events/:id/reschedule` | `rescheduleEventSchema` | `scheduleEventSchema` | edit |
| POST | `/schedule/events/:id/swap-kart` | `swapKartSchema` | `scheduleEventSchema` | edit |
| GET | `/schedule/upcoming-days` | `from`, `days` | resumo por dia | view |
| GET | `/schedule/slots` | `date` | slots efetivos do dia (grade semanal) | view |
| GET | `/schedule/week` | — | grade semanal (`WeekDaySchedule[]`) | view (configuracoes) |
| PUT | `/schedule/week` | `replaceWeekScheduleSchema` | grade atualizada | edit (configuracoes) |
| GET | `/schedule/blocks` | `from`, `to` | `scheduleBlockSchema[]` | view |
| POST | `/schedule/blocks` | `createScheduleBlockSchema` | `scheduleBlockSchema` | edit |
| DELETE | `/schedule/blocks/:id` | — | `{ ok: true }` | edit |

**Conflitos:** kart/recurso ocupado → 409 `CONFLICT` + `details.conflicts`.

**Campos staff (evento):** `registeredById` (FK → users, opcional) · `registeredByName` (denormalizado, opcional).

**Legado:** `GET /api/admin/schedule/events` — envelope `{ success, data }` com `legacyScheduleEventSchema`.

---

## 5. Aulas (`/lessons`) — ModuleKey: `registroAulas`

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/lessons/sessions` | `lessonRegistrationQuerySchema` | `lessonSessionSchema[]` | view |
| GET | `/lessons/sessions/:id` | — | `lessonSessionSchema` | view |
| POST | `/lessons/sessions/:id/start` | `startLessonSchema` | `lessonSessionSchema` | edit |
| POST | `/lessons/sessions/:id/register` | `lessonRegistrationSchema` | registro salvo | edit |
| POST | `/lessons/ocr` | `multipart/form-data` file | `ocrSuccessResponseSchema` | edit |

**OCR:** max 12 MB; 503 se `OPENAI_API_KEY` ausente. Job assíncrono opcional Fase 5 — ver `ASYNC_JOBS.md`.

**Regra:** `BR-LESSON-COMPLETE` — aula só `concluida` com laps + notes.

**Campo staff (sessão):** `registeredByName` — quem registrou/avaliou (denormalizado; FK alvo `registeredById` em evolução).

**Legado:** `POST /api/admin/lesson-registration/ocr` — resposta `{ laps }` sem envelope (migrar).

---

## 6. Frota (`/karts`) — ModuleKey: `karts`

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/karts` | `kartsQuerySchema` | `kartSchema[]` | view |
| GET | `/karts/:id` | — | `kartSchema` | view |
| PATCH | `/karts/:id/status` | `updateKartStatusSchema` | `kartSchema` | edit |
| POST | `/karts/:id/assign-client` | `assignKartToClientSchema` | `kartSchema` | edit |

**Integração manutenção:** status `manutencao` bloqueia alocação na agenda (409).

---

## 7. Manutenção (`/maintenance`) — ModuleKey: `manutencao`

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/maintenance/orders` | filtros kart/status | `maintenanceOrderSchema[]` | view |
| POST | `/maintenance/orders` | `createMaintenanceOrderSchema` | order | edit |
| PATCH | `/maintenance/orders/:id` | `updateMaintenanceOrderSchema` | order | edit |
| POST | `/maintenance/orders/:id/complete` | `completeMaintenanceSchema` | order | edit |
| POST | `/maintenance/inspections` | `inspectionFormSchema` | `{ id }` | edit |
| POST | `/maintenance/inspections/media` | `multipart/form-data` (`file`, `label?`) | `{ id, label, type, url }` | edit |
| POST | `/maintenance/simple` | `simpleMaintenanceFormSchema` | order | edit |

**Efeito colateral:** ordem aberta → kart `manutencao` (já mockado em runtime store).

---

## 8. Estoque (`/inventory`) — ModuleKey: `estoque`

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/inventory/parts` | query, category | paginated parts | view |
| POST | `/inventory/parts` | `createInventoryPartSchema` | part | edit |
| PATCH | `/inventory/parts/:id` | partial | part | edit |
| GET | `/inventory/suppliers` | — | suppliers | view |
| POST | `/inventory/suppliers` | `createSupplierSchema` | supplier | edit |
| POST | `/inventory/movements` | `createStockMovementSchema` | movement | edit |
| GET | `/inventory/purchase-orders` | — | orders | view |
| POST | `/inventory/purchase-orders` | `createPurchaseOrderSchema` | order | edit |

---

## 9. Financeiro (`/finance`) — ModuleKey: `financeiro`

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/finance/overview` | — | KPIs + resumo | view |
| GET | `/finance/receivables` | `receivablesQuerySchema` | paginated | view |
| POST | `/finance/receivables` | `createReceivableSchema` | receivable | edit |
| GET | `/finance/payables` | `payablesQuerySchema` | paginated | view |
| POST | `/finance/payments` | `recordPaymentSchema` | payment + receivable | edit |
| GET | `/finance/package-credits` | `clientId?` | credits | view |
| POST | `/finance/package-credits` | `createPackageCreditSchema` | credit | edit |
| GET | `/finance/cash-flow` | `key`, `customStart?`, `customEnd?` | séries fluxo de caixa | view |
| GET | `/finance/dre` | `key`, `customStart?`, `customEnd?` | DRE | view |
| GET | `/finance/charts` | — | gráficos agregados (ver abaixo) | view |
| GET | `/finance/insights` | — | tabs secundárias (ver abaixo) | view |
| GET | `/finance/meta` | — | filtros, relatórios, KPIs operacionais, opções de pagamento | view |

**Relatórios financeiros (UI):** aba `/admin/financeiro?tab=reports` — gráficos via `GET /finance/charts`; export PDF/Excel ainda mock (futuro: `/reports/runs` §11).

### Financeiro — charts

| Campo | Conteúdo |
|-------|----------|
| `monthlyRevenueChart` | receita mensal + forecast |
| `inOutChart` | entradas vs saídas |
| `financialEvolution` | evolução semanal (receita, custos, margem) |
| `revenueByService` | receita por serviço |
| `revenueOrigin` | origem da receita |
| `paymentMethods` | métodos de pagamento |
| `businessEvolution` | `{ "3m", "6m", "12m" }` |
| `upcomingPayables` | próximos pagamentos |
| `smartInsights` | strings de insight |
| `executiveAlerts` | alertas executivos |

### Financeiro — insights

Agregação para tabs secundárias e componentes avulsos (`useFinanceInsights()`):

| Campo | Conteúdo |
|-------|----------|
| `packageCredits` | pacotes ativos (cliente, validade, uso, status) |
| `delinquencyItems` | títulos vencidos por cliente |
| `delinquencyTotal` | total formatado em BRL |
| `commercialRanking` | top 5 clientes por faturamento |
| `kartFinancials` | rentabilidade por kart (receita, custos, margem) |
| `clientFinancials` | gasto total, pendências, ticket médio |
| `revenueSources` | entradas por origem (mês atual) |
| `expenseCategories` | saídas por categoria (mês atual) |

**Implementação:** `lib/server/finance/insights-builder.ts` — deriva de `PackageCredit`, `AccountReceivable`, `Payment`, `Kart`, `MaintenanceOrder`, etc.

### Financeiro — meta

Metadados para filtros AR/AP, drawer de pagamento e catálogo de relatórios (`useFinanceMeta()`):

| Campo | Conteúdo |
|-------|----------|
| `financialReports` | catálogo de relatórios (label, desc) |
| `operationalKpis` | KPIs operacionais executivos |
| `receivableFilterOptions` | status AR |
| `receivablePaymentMethods` | métodos distintos em títulos |
| `receivableServices` | serviços distintos |
| `payableCategories` | categorias AP |
| `paymentClientOptions` | clientes ativos (id, name) |
| `paymentMethodOptions` | métodos de pagamento |
| `paymentServiceOptions` | serviços para registro de pagamento |
| `tablePageSizes` | `[10, 25, 50]` |

**Implementação:** `lib/server/finance/meta-builder.ts`

---

### Clientes — rankings

| Método | Path | Response | Ação |
|--------|------|----------|------|
| GET | `/clients/rankings` | `{ evolution, training, laps, consistency }[]` top 3 | view |

### Karts — paddock

| Método | Path | Response | Ação |
|--------|------|----------|------|
| GET | `/karts/paddock` | `{ alerts, boxes }` | view |

### Piloto — evolução e conquistas

| Método | Path | Response | Ação |
|--------|------|----------|------|
| GET | `/pilot/evolution` | `lapSeries`, `goal` | sessão piloto |
| GET | `/pilot/achievements` | `achievements[]` | sessão piloto |
| GET | `/pilot/home` | dashboard piloto (perfil, KPIs, feedback, resultados, plano) | sessão piloto |

### Manutenção — templates (checklist + inspeção)

| Método | Path | Response | Ação |
|--------|------|----------|------|
| GET | `/maintenance/checklists/template` | `types`, `sections`, `diagramViews`, `diagramZones`, `overallStatusLabels` | view |
| GET | `/maintenance/inspections/template` | `typeOptions`, `modules`, `diagramZones`, `generalConditionMeta`, `signatureStaff`, `technicalTimeline`, `mockDiagnosis` | view |

**UI inspeção técnica:** modal `NewInspectionModal` e filhos consomem o template via `useInspectionTemplate()`; lógica de score/resultado em `lib/maintenance/inspection-compute.ts`.

### Manutenção — checklist context

| Método | Path | Response | Ação |
|--------|------|----------|------|
| GET | `/maintenance/checklists/context` | `smartAlerts`, `history` | view |
| POST | `/maintenance/checklists/media` | upload foto/vídeo (multipart) | edit |

### Estoque — charts

| Método | Path | Response | Ação |
|--------|------|----------|------|
| GET | `/inventory/charts` | consumo semanal, movimentações, categorias, top peças | view |

### Configurações — integrações e aparência

| Método | Path | Response | Ação |
|--------|------|----------|------|
| GET/PUT | `/settings/integrations` | `integrations[]` | view / edit |
| GET/PUT | `/settings/appearance` | tema, cores, logos | view / edit |
| GET | `/settings/security` | `cards[]` (sessões ativas dinâmico) | view |

---

## 10. Telemetria (`/telemetry`) — ModuleKey: `telemetria`

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/telemetry/sessions` | `telemetrySessionsQuerySchema` | sessions | view |
| GET | `/telemetry/sessions/:id` | — | session + laps | view |
| POST | `/telemetry/sessions` | `createTelemetrySessionSchema` | session | edit |
| POST | `/telemetry/sessions/:id/upload-url` | — | `presignedUploadResponseSchema` | edit |
| POST | `/telemetry/sessions/:id/complete` | `telemetryUploadCompleteSchema` | session | edit |
| GET | `/telemetry/sessions/:id/download` | — | signed URL | view |

**Pipeline:** upload → job `telemetry.parse` → `telemetry.normalize` — ver `ASYNC_JOBS.md`.

**Regra:** voltas inválidas não entram em stats (`BR-TEL-INVALID-LAP`).

---

## 11. Relatórios (`/reports`) — ModuleKey: `relatorios`

Sem rota admin dedicada; consumo via financeiro (financeiros) ou API direta (operacionais futuros).

| Método | Path | Body / Query | Response | Ação |
|--------|------|--------------|----------|------|
| GET | `/reports/definitions` | `domain?` | catálogo estático | view |
| GET | `/reports/runs` | `reportRunsQuerySchema` | runs | view |
| POST | `/reports/runs` | `createReportRunSchema` | `reportRunSchema` | edit |
| GET | `/reports/runs/:id` | — | run + status | view |
| GET | `/reports/runs/:id/download` | — | signed URL | view |

**Job:** `report.generate` — PDF/XLSX/CSV → storage — ver `ASYNC_JOBS.md`.

---

## 12. Configurações (`/settings`) — ModuleKey: `configuracoes`

| Método | Path | Response | Ação |
|--------|------|----------|------|
| GET | `/settings/organization` | org settings | view |
| PATCH | `/settings/organization` | partial | edit |
| GET | `/settings/users` | perfis padrão + custom + usuários vinculados | view |
| PUT | `/settings/users` | salva todos os perfis (nomes custom, `customProfiles`) | edit |
| PATCH | `/settings/users/:id/permissions` | module matrix de um usuário | edit |
| GET | `/settings/schedule-slots` | week slots | view |
| PUT | `/settings/schedule-slots` | slots array | edit |
| GET | `/settings/catalog` | categorias, níveis, preços | view |
| PUT | `/settings/catalog` | catálogo completo | edit |
| GET | `/settings/notifications` | eventos × canais | view |
| PUT | `/settings/notifications` | matriz de notificações | edit |
| GET | `/settings/documents` | modelos de documento | view |
| PUT | `/settings/documents` | modelos | edit |
| GET | `/settings/terms-registry` | DRE, categorias financeiras, peças, motores, chassis | view |
| PUT | `/settings/terms-registry` | cadastros de termos | edit |

---

## 12.1 Equipe (`/team`) — staff interno

Membros com `clientId === null`. Função atribuída via `permissionProfileId` (perfis de Configurações).  
**Permissão:** `ModuleKey` `equipe` (view / edit / delete) — não usar `configuracoes`.

| Método | Path | Descrição | Ação |
|--------|------|-----------|------|
| GET | `/team` | lista paginada (`page`, `search`, `permissionProfileId`) | view (`equipe`) |
| GET | `/team/kpis` | total, ativos, admin, operação | view |
| POST | `/team` | criar membro (`permissionProfileId`, senha ≥ 8) | edit |
| PATCH | `/team/:userId` | editar membro | edit |
| DELETE | `/team/:userId` | remover (403 se admin protegido) | delete |

---

## 13. Portal piloto (`/pilot`)

Escopo: dados do `clientId` autenticado (ou dependentes se responsável).

| Método | Path | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/pilot/home` | Dashboard agregado (KPIs, feedback, atividades) | sessão piloto |
| GET | `/pilot/dashboard` | KPIs, próximas aulas | sessão piloto |
| GET | `/pilot/profile` | perfil + categorias + preferências | sessão piloto |
| PATCH | `/pilot/profile` | dados editáveis | sessão piloto |
| POST | `/pilot/profile/avatar` | upload avatar | sessão piloto |
| GET | `/pilot/account` | bundle perfis + `linkedPilots` | sessão piloto |
| GET | `/pilot/evolution` | série de voltas + meta | sessão piloto |
| GET | `/pilot/achievements` | conquistas | sessão piloto |
| POST | `/pilot/consents` | aceite/revogação termos | sessão piloto |
| GET | `/pilot/booking/slots` | query `date` — grade do dia (disponível/ocupado) | `pilotoAgenda` view |
| POST | `/pilot/booking` | body `{ date, slotId, clientId? }` — confirmar reserva → `ScheduleEvent` | `pilotoAgenda` edit |
| POST | `/pilot/linked-pilots` | cadastrar piloto vinculado (menor) | sessão piloto |
| PATCH | `/pilot/linked-pilots/:clientId/profile` | editar perfil vinculado | sessão piloto |
| POST | `/pilot/linked-pilots/:clientId/password` | definir senha vinculado | sessão piloto |
| DELETE | `/pilot/sessions/:sessionId` | remover sessão telemetria | sessão piloto |
Rotas documentadas mas não implementadas ou legado: `/pilot/schedule`, `/pilot/finance`, `/pilot/telemetry` — usar `/pilot/home` e `/api/v1/telemetry/sessions`.

---

## 14. Auditoria (`/audit`) — admin only

| Método | Path | Query | Response |
|--------|------|-------|----------|
| GET | `/audit/logs` | entityType, entityId, from, to | paginated logs |

Spec detalhada: `AUDIT_LOG_SPEC.md`.

---

## 15. Mapeamento mock → API (Fase 6)

| Mock / store | Repository alvo |
|--------------|-----------------|
| `ScheduleRepositoryMock` | `GET/POST /schedule/events` |
| `clients-runtime-store` | `/clients` |
| `karts-runtime-store` | `/karts` |
| `financial-runtime-store` | `/finance/*` |
| `inventory-*-store` | `/inventory/*` |
| `lesson-registration-store` | `/lessons/*` |
| `telemetry session-store` | `/telemetry/*` |

**Flag:** `NEXT_PUBLIC_DATA_SOURCE=http` + `NEXT_PUBLIC_API_URL` — ver `.env.example`.

---

## 16. Histórico

| Data | Alteração |
|------|-----------|
| 2026-05-28 | Fase 4 — spec v1 completo, 14 schemas Zod, OpenAPI 83 operações |
| 2026-05-28 | Removido conceito de instrutor — `registradoPor` no evento/sessão |
| 2026-06-01 | Implementados `/schedule/slots`, `/schedule/week` (GET/PUT); DELETE blocks usa permissão `edit` |
