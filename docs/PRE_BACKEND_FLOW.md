# PRE_BACKEND_FLOW — Fluxo ideal antes do backend

> **Status:** padrão oficial do projeto a partir de 2026-05-28 · **atualizado 2026-06-01**  
> **Handoff migração:** [`MIGRATION_STATUS.md`](MIGRATION_STATUS.md)
> **Regra para agentes:** seguir esta ordem. **Não iniciar backend (Fase 5)** antes de concluir os entregáveis das fases anteriores relevantes ao domínio.  
> **Legenda:** `[CONFIRMADO]` evidência no código · `[PARCIAL]` iniciado · `[PENDENTE]` não feito

---

## Visão das fases

| Fase | Nome | Objetivo |
|------|------|----------|
| **1** | Frontend visual | Páginas, fluxos, UX, responsividade, consistência visual |
| **2** | Arquitetura funcional | Entidades, relacionamentos, regras, permissões, estados, APIs |
| **3** | Modelagem do banco | Schema PostgreSQL/Prisma alinhado à Fase 2 |
| **4** | Contratos/API | Endpoints, payloads, responses congelados |
| **5** | Backend | Implementação real (auth, persistência, jobs) |
| **6** | Integração | `http` repositories, testes E2E, remoção de mocks |

**Ordem estrita:** 1 → 2 → 3 → 4 → 5 → 6 (com overlap controlado apenas dentro da mesma fase).

---

## Etapas detalhadas (1–15)

### 1. Revisão completa das páginas — **Fase 1**

Verificar em **todas** as rotas:

- [x] Todas as páginas existem e renderizam
- [x] Todos os fluxos funcionam (happy path + erros previsíveis) — mock runtime
- [x] Navegação consistente (sidebar, breadcrumbs, links mortos)
- [x] Estados vazios — fluxos críticos piloto + admin parcial
- [x] Loading / skeleton — fluxos críticos admin + piloto
- [x] Responsividade (mobile, tablet paisagem, desktop) — admin tablet OK; mobile parcial
- [x] Componentes duplicados identificados — unificação base Sprint B
- [x] Nomes e labels padronizados — `NOMENCLATURE.md`; nav “Clientes”; ModuleKey `alunos` mantido no código

**Entregável:** `docs/PHASE1_PAGE_AUDIT.md` (checklist por rota)  
**Referências:** `UI_AUDIT.md`, `COMPONENT_INVENTORY.md`

---

### 2. Mapear TODAS as entidades — **Fase 2**

Listar cada entidade lógica do sistema (não só as já mockadas).

Exemplos esperados:

| Domínio | Entidades |
|---------|-----------|
| Auth | `users`, `accounts`, `sessions`, `password_resets` |
| Piloto | `pilot_profiles`, `guardians`, `guardian_links`, `consents` |
| Operacional | `schedule_events`, `lesson_sessions`, `karts` |
| Telemetria | `telemetry_sessions`, `lap_times`, `sectors`, `tracks`, `uploads` |
| Financeiro | `payments`, `subscriptions`, `accounts_receivable`, `accounts_payable` |
| Mídia | `video_materials`, `image_authorizations`, `avatars` |
| Gamificação | `achievements`, `pilot_achievements` |

**Entregável:** `docs/ENTITY_CATALOG.md` (complementa `DATABASE_REFERENCE.md`)

---

### 3. Definir RELACIONAMENTOS — **Fase 2**

Diagrama e texto para cada cardinalidade.

Exemplo:

```
Responsável 1──N Pilotos (guardian_links)
Piloto 1──N Aulas/Sessões (lesson_sessions)
Sessão 1──0..1 Telemetria (telemetry_sessions)
Telemetria 1──N Voltas (lap_times)
Volta 1──N Setores (sector_times)
```

**Entregável:** seção em `ENTITY_CATALOG.md` + diagrama Mermaid  
**Referência parcial:** `DATABASE_REFERENCE.md` §2

---

### 4. Definir regras de negócio — **Fase 2**

Formalizar regras que hoje estão espalhadas em mocks.

Exemplos:

- Menor de 14 → responsável ≥18 cadastra e vincula
- Aula só finalizada com registro completo
- Telemetria inválida não entra em estatísticas
- Uso de imagem revogado → bloqueio operacional
- Volta inválida não entra em consistência
- Cancelamento 24h / no-show

**Entregável:** expandir `BUSINESS_RULES.md` com ID, domínio, enforcement (UI / API / DB)

---

### 5. Criar mapa de permissões — **Fase 2**

Matriz perfil × módulo × ação.

| Perfil | Escopo | Exemplos |
|--------|--------|----------|
| Piloto | próprio | visualizar evolução, telemetria |
| Responsável | dependentes | financeiro, cadastro menor |
| Staff operacional | operação | registrar aula, feedback |
| Recepção | operação | agenda, clientes |
| Financeiro | financeiro | receber, pagar, DRE |
| Admin | global | tudo + configurações |

**Entregável:** `docs/PERMISSIONS_MATRIX.md`  
**Referência parcial:** `ModuleKey`, `RoleKey` em `admin-settings-mocks.ts`

---

### 6. Definir estados do sistema — **Fase 2**

Máquinas de estado por entidade principal.

Exemplos:

**Aula / evento:** `agendada` → `confirmada` → `em_andamento` → `aguardando_registro` → `concluida` | `cancelada` | `no_show`

**Telemetria:** `uploaded` → `processing` → `normalized` → `completed` | `failed`

**Manutenção OS:** (já parcial em mocks)

**Entregável:** `docs/STATE_MACHINES.md` + enums em `lib/contracts/enums.ts`

---

### 7. Definir APIs ANTES do backend — **Fase 4**

Contratos HTTP congelados **antes** de implementar servidor.

Para cada domínio:

- Método + path
- Query params
- Request body (JSON Schema / Zod)
- Response (`ApiResponse<T>`)
- Códigos de erro

Exemplos:

```
GET    /api/v1/lessons
POST   /api/v1/telemetry/upload
POST   /api/v1/ocr/process
GET    /api/v1/pilots/:id/stats
```

**Entregável:** `docs/API_SPEC.md` ou OpenAPI em `docs/openapi/`  
**Padrão existente:** agenda em `app/api/admin/schedule/*`

---

### 8. Definir estrutura do banco — **Fase 3**

Somente **após** entidades, relacionamentos, regras e estados (Fase 2).

Stack provável: **PostgreSQL + Prisma**

**Entregável:** `prisma/schema.prisma` + migrations  
**Referência:** `DATABASE_REFERENCE.md`

---

### 9. Definir estratégia de storage — **Fase 3–4**

Separar tipos de arquivo e política de retenção:

| Tipo | Exemplos | Storage sugerido |
|------|----------|------------------|
| Imagens | avatares, OCR input | S3-compatible / blob |
| Telemetria | CSV, binários MyChron | blob + metadados DB |
| Vídeos | materiais, GoPro | CDN + streaming |
| Documentos | termos, autorizações | blob + hash + auditoria |

**Entregável:** `docs/STORAGE_STRATEGY.md`

---

### 10. Definir processamento assíncrono — **Fase 4–5**

Jobs para operações pesadas:

- OCR cronometragem
- Parse telemetria (CSV, GoPro)
- Normalização de voltas/setores
- Análises agregadas (stats piloto)
- Processamento de vídeo

**Entregável:** `docs/ASYNC_JOBS.md` (filas, retries, idempotência)

---

### 11. Validar UX operacional — **Fase 1–2**

Pergunta-guia: *"O Gurgel conseguiria operar isso rapidamente no dia a dia?"*

Validar fluxos críticos:

- Abrir agenda → confirmar aula → registrar → liberar kart
- Cliente novo → agendar → pagamento → primeira aula
- Manutenção bloqueando kart
- Registro OCR em < 2 minutos

**Entregável:** roteiros em `docs/OPERATIONAL_UX.md`

---

### 12. Criar design system definitivo — **Fase 1**

Congelar antes do backend para não refatorar UI durante integração:

- Inputs, selects, date pickers
- Tabelas + paginação + filtros
- Modais, drawers, cards
- Spacing, tipografia, cores (tokens)
- Botões (unificar 3 sistemas atuais)

**Entregável:** `DESIGN_SYSTEM.md` v2 + componentes em `components/ui/`  
**Problema atual:** `UI_AUDIT.md` — fragmentação alta

---

### 13. Remover páginas/dados fake — **Fase 6** (prep na Fase 1–2)

Substituir gradualmente:

- Números aleatórios / seeds fictícios
- Usuários fake hardcoded
- Links mortos / módulos fantasma

Por:

- Contratos reais
- Empty states honestos
- Feature flags para módulos não prontos

**Não remover mocks** até HTTP repository equivalente existir.

---

### 14. Planejar autenticação — **Fase 2–5**

No contexto Gurgel Team:

- Username + senha
- Responsável ↔ menor (vínculo)
- Roles + permissões granulares
- Sessão (cookie httpOnly ou JWT)
- Recovery de senha
- Middleware Next.js

**Entregável:** `docs/AUTH_SPEC.md`  
**Estado:** `[PENDENTE]` — sem `middleware.ts`

---

### 15. Definir logs/auditoria — **Fase 2–5**

Trilha jurídica e operacional:

- Aceites de termos e consentimentos
- Autorização de uso de imagem
- Alterações de perfil/dados sensíveis
- Uploads (quem, quando, hash)
- Registros de aula (quem registrou, OCR vs manual)

**Entregável:** `docs/AUDIT_LOG_SPEC.md`

---

## Critérios de saída por fase

### Fase 1 — pronta quando:

- [x] 100% rotas auditadas — `PHASE1_PAGE_AUDIT.md` (27 rotas)
- [x] Zero links mortos na navegação principal
- [x] Empty + loading + error retry nos fluxos críticos
- [x] Design system v2 congelado (`DESIGN_SYSTEM.md` v2 — `EmptyState`, `PageErrorState`, `StatusBadge`, `AdminTablePagination`)
- [x] UX operacional validada (`OPERATIONAL_UX.md`)
- [x] Nomenclatura documentada + nav alinhada

### Fase 2 — pronta quando:

- [x] `ENTITY_CATALOG.md` completo (v1 confirmado)
- [x] Relacionamentos diagramados (Mermaid)
- [x] `BUSINESS_RULES.md` com IDs (`BR-*`)
- [x] `PERMISSIONS_MATRIX.md` + `STATE_MACHINES.md` confirmados
- [x] `AUTH_SPEC.md` + `AUDIT_LOG_SPEC.md` confirmados
- [x] Domínio relatórios alinhado (sem rota admin)
- [x] Enums em `lib/contracts/enums.ts` + usuários demo (`SETTINGS_USERS` incl. financeiro)

### Fase 3 — pronta quando:

- [x] `schema.prisma` revisado contra catálogo
- [x] Migration inicial `prisma/migrations/20260528140000_init/`
- [x] `@prisma/client` no projeto
- [x] `STORAGE_STRATEGY.md` confirmado
- [x] Entidades P2 documentadas (`DATABASE_REFERENCE.md` §1.1)

### Fase 4 — pronta quando:

- [x] `API_SPEC.md` confirmado (14 domínios)
- [x] Zod v1 — 14 módulos em `lib/contracts/api/v1/`
- [x] OpenAPI completo — 83 operações em `docs/openapi/gurgel-core.yaml`
- [x] `ASYNC_JOBS.md` confirmado

### Fase 5–6 — backend + integração

Ver `ROADMAP.md` e **`MIGRATION_STATUS.md`**.

**Fase 5 — progresso (atualizado 2026-06-01):**

- [x] `lib/server/prisma.ts` — singleton Prisma
- [x] `lib/server/api/responses.ts` — envelope `{ success, data, error }`
- [x] Auth: password (scrypt), sessão opaca + cookie httpOnly
- [x] `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/session`
- [x] `middleware.ts` — guard `/admin/*` e `/piloto/*` (`ENABLE_ROUTE_GUARD`)
- [x] `prisma/seed.ts` — usuários demo + grade + eventos
- [x] `.env.example` + scripts `db:migrate`, `db:seed`
- [x] Login UI integrado à API
- [x] Domínios P0: **schedule** (completo), **lessons**, **clients**, **karts**
- [x] `POST /api/v1/auth/register`, password-recovery
- [x] `GET /api/v1/reference/catalog`
- [x] Supabase client + health check
- [x] `week_schedule_slots` persistida
- [ ] Workers/jobs assíncronos

**Fase 6 — integração HTTP (atualizado 2026-06-01):**

- [x] `NEXT_PUBLIC_DATA_SOURCE=mock|http`
- [x] Repositories HTTP: schedule (+ blocks, reschedule, slots, week), clients, karts, lessons, reference
- [x] Factories de services P0 com modo http
- [x] UI auth integrada
- [x] **Agenda P0 completa** (eventos, bloqueios, remarcação, nova aula, timeline da grade)
- [x] **Configurações → Horários** — grade semanal `GET/PUT /schedule/week`
- [ ] Registro de aulas — wire UI restante
- [ ] Config — datas específicas / exceções
- [ ] Demais domínios (financeiro, estoque, telemetria, piloto)
- [ ] Proxy `/api/admin/*` → v1

**Teste modo HTTP:**

```env
NEXT_PUBLIC_DATA_SOURCE=http
DATABASE_URL=...
SESSION_SECRET=...
ENABLE_ROUTE_GUARD=true   # opcional
```

Login admin (`ana.silva@…` / `Gurgel@123`) → cookie `gurgel_session` → chamadas `/api/v1/*`.

---

## Documentos deste fluxo

| Documento | Fase | Status |
|-----------|------|--------|
| `PHASE1_PAGE_AUDIT.md` | 1 | `[100%]` |
| `NOMENCLATURE.md` | 1 | `[CONFIRMADO]` |
| `OPERATIONAL_UX.md` | 1–2 | `[CONFIRMADO]` |
| `UI_AUDIT.md` | 1 | `[CONFIRMADO]` |
| `COMPONENT_INVENTORY.md` | 1 | `[CONFIRMADO]` |
| `DESIGN_SYSTEM.md` | 1 | `[CONFIRMADO v2]` |
| `ENTITY_CATALOG.md` | 2 | `[CONFIRMADO v1]` |
| `OPERATIONAL_REPORTS_SPEC.md` | 2 | `[PLANEJADO]` — sem rota admin |
| `PERMISSIONS_MATRIX.md` | 2 | `[CONFIRMADO]` |
| `STATE_MACHINES.md` | 2 | `[CONFIRMADO]` |
| `AUTH_SPEC.md` | 2 | `[CONFIRMADO]` |
| `AUDIT_LOG_SPEC.md` | 2 | `[CONFIRMADO]` |
| `DATABASE_REFERENCE.md` | 2–3 | `[CONFIRMADO]` |
| `BUSINESS_RULES.md` | 2 | `[CONFIRMADO]` |
| `prisma/schema.prisma` | 3 | `[CONFIRMADO v1]` |
| `prisma/migrations/` | 3 | `[CONFIRMADO]` — init `20260528140000` |
| `STORAGE_STRATEGY.md` | 3 | `[CONFIRMADO v1]` |
| `API_SPEC.md` | 4 | `[CONFIRMADO v1]` |
| `docs/openapi/gurgel-core.yaml` | 4 | `[CONFIRMADO v1]` — 83 ops |
| `lib/contracts/api/v1/` | 4 | `[CONFIRMADO]` — 14 schemas |
| `ASYNC_JOBS.md` | 4 | `[CONFIRMADO v1]` |
| **`MIGRATION_STATUS.md`** | 5–6 | **`[ATUAL]`** — handoff migração HTTP |

---

1. Identificar **fase atual** antes de propor código de backend.
2. Trabalhos de UI → validar contra **Fase 1**.
3. Trabalhos de contratos/tipos → validar contra **Fase 2–4**.
4. Não criar tabelas Prisma antes de `ENTITY_CATALOG.md`.
5. Não criar rotas API de produção antes de `API_SPEC.md`.
6. Manter mocks até repository HTTP + teste manual passarem (Fase 6).

---

## Status atual (2026-05-28)

**Fases 1–4:** `[100% CONCLUÍDAS]`  
**Fase 5:** `[EM ANDAMENTO]` — auth completo (login/register/recovery); pendente jobs assíncronos.  
**Fase 6:** `[EM ANDAMENTO]` — P0 integrado via HTTP; pendente domínios secundários e detalhe rico de kart.

**Setup backend local:**
1. Copiar `.env.example` → `.env` e ajustar `DATABASE_URL`
2. `npm run db:migrate` + `npm run db:seed`
3. Opcional: `ENABLE_ROUTE_GUARD=true` para exigir sessão em `/admin` e `/piloto`
