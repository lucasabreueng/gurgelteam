# ASYNC_JOBS — Processamento assíncrono (Fase 4)

> **Status:** `[CONFIRMADO v1]` — 2026-05-28  
> **Implementação:** Fase 5 (workers) · Orquestração mínima via Next.js ou fila dedicada  
> **Referências:** `STORAGE_STRATEGY.md`, `API_SPEC.md`, `prisma/schema.prisma`

---

## 1. Objetivos

1. Desacoplar operações lentas da request HTTP (OCR, parse telemetria, exports).
2. Garantir **idempotência** e **retries** com backoff.
3. Manter trilha em `audit_logs` e status em tabelas (`telemetry_sessions`, `report_runs`).

---

## 2. Stack alvo (Fase 5)

| Opção | Dev | Prod |
|-------|-----|------|
| **Recomendada** | BullMQ + Redis local | BullMQ + Redis (Upstash/ElastiCache) |
| Alternativa leve | `next/server` + cron Vercel | Inngest / Trigger.dev |
| MVP | DB polling (`status=pending`) | Mesmo, com worker separado |

**Variáveis:**

```env
REDIS_URL=redis://localhost:6379
JOB_CONCURRENCY=3
JOB_MAX_RETRIES=3
```

---

## 3. Catálogo de jobs

| Job ID | Disparo | Entrada | Saída | Timeout | Retries |
|--------|---------|---------|-------|---------|---------|
| `ocr.lesson-timing-sheet` | `POST /lessons/ocr` ou upload async | image buffer/key | `laps[]` | 60s | 2 |
| `telemetry.parse` | upload complete | `sessionId`, `rawFileKey` | metadata parse | 5min | 3 |
| `telemetry.normalize` | após parse | `sessionId` | laps DB + processed JSON | 3min | 3 |
| `report.generate` | `POST /reports/runs` | `runId` | PDF/XLSX/CSV em storage | 2min | 2 |
| `email.invite-client` | `POST /clients` | `clientId` | e-mail enviado | 30s | 5 |
| `stats.pilot-aggregate` | cron diário / pós-aula | `clientId?` | KPIs materializados | 10min | 2 |
| `video.transcode` | P2 | `videoId` | HLS segments | 30min | 1 |

---

## 4. Detalhamento por job

### 4.1 `ocr.lesson-timing-sheet`

**Fluxo síncrono atual:** `app/api/admin/lesson-registration/ocr/route.ts` (OpenAI).

**Fluxo assíncrono alvo:**

1. Cliente envia imagem → API grava em `lessons/ocr/{lessonSessionId}/{uuid}.jpg`.
2. Enfileira job com `lessonSessionId`, `storageKey`.
3. Worker chama OpenAI → persiste laps em resposta ou draft de registro.
4. UI polling `GET /lessons/sessions/:id/ocr-status` ou WebSocket (P2).

**Idempotência:** chave `ocr:{lessonSessionId}:{fileHash}` — reprocessar mesmo arquivo retorna resultado cacheado.

**Falha:** 503 → job `failed`; UI permite retry manual.

**Auditoria:** `audit_logs` action `lesson.ocr.processed`, metadata `{ method: "ocr", lapCount, model }`.

---

### 4.2 `telemetry.parse`

**Estados:** `UPLOADED` → `PROCESSING` → (`NORMALIZING` | `FAILED`).

1. `POST /telemetry/sessions/:id/complete` valida checksum.
2. Job lê blob (`gopro`, CSV MyChron, etc.) conforme `source`.
3. Extrai pontos GPS/RPM — parsers em `lib/telemetry-engine/`.
4. Grava JSON intermediário em `telemetry/processed/{sessionId}/raw-parsed.json`.

**Retry:** falhas de rede S3 — exponential backoff 5s, 30s, 2min.

**Idempotência:** se `status=COMPLETED`, skip.

---

### 4.3 `telemetry.normalize`

1. Lê parsed JSON + track definition.
2. Calcula voltas/setores; marca `valid=false` onde aplicável (`BR-TEL-INVALID-LAP`).
3. `INSERT telemetry_laps` (batch).
4. Atualiza `clients.best_lap_ms`, `consistency_pct` se melhor volta válida.
5. `status=COMPLETED`, `processed_at=now()`.

**Dependência:** job encadeado após `telemetry.parse` sucesso.

---

### 4.4 `report.generate`

**Entrada:** `report_runs.id` com `status=pending`.

1. Worker seta `processing`.
2. Query agregada conforme `definitionId` (`lib/contracts/reports/report-definitions.ts`).
3. Render PDF (puppeteer/pdfkit) ou XLSX (`xlsx`).
4. Upload `reports/{runId}.{ext}` → atualiza `file_key`, `status=completed`.
5. Erro → `status=failed`, `error_message`.

**Retenção arquivo:** 90 dias (lifecycle S3 — `STORAGE_STRATEGY.md`).

**Idempotência:** re-enfileirar mesmo `runId` em `processing` ignora; em `completed` retorna URL existente.

---

### 4.5 `email.invite-client`

Disparado ao criar cliente com `sendInvite=true`.

- Template: link definir senha (token único, 72h).
- Falha SMTP → retry 5x; não rollback do cliente.

---

### 4.6 `stats.pilot-aggregate`

Cron `0 3 * * *` (03:00) ou evento `lesson.registered`.

Recalcula: `bestLapMs`, `consistencyPct`, `totalSessions` em `clients`.

Escopo incremental se `clientId` presente.

---

## 5. Contrato de fila (BullMQ)

```typescript
type JobPayloadMap = {
  "ocr.lesson-timing-sheet": {
    lessonSessionId: string;
    storageKey: string;
    fileHash: string;
  };
  "telemetry.parse": { sessionId: string };
  "telemetry.normalize": { sessionId: string };
  "report.generate": { runId: string };
  "email.invite-client": { clientId: string };
  "stats.pilot-aggregate": { clientId?: string };
};
```

**Dead letter:** após `JOB_MAX_RETRIES`, mover para fila `failed` + alerta admin.

---

## 6. Observabilidade

| Sinal | Onde |
|-------|------|
| Job started/finished | logs estruturados `{ jobId, name, durationMs }` |
| Falhas | `audit_logs` + métrica contador |
| Status UI | polling em `report_runs.status`, `telemetry_sessions.status` |

---

## 7. Fora do escopo v1

- Webhooks para clientes externos
- Priorização por plano
- `video.transcode` (P2)

---

## 8. Histórico

| Data | Alteração |
|------|-----------|
| 2026-05-28 | Fase 4 — catálogo inicial de jobs |
