# ROADMAP — Gurgel Team

> **Última atualização:** 2026-06-05  
> **Handoff:** [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md) · [`MIGRATION_STATUS.md`](MIGRATION_STATUS.md)  
> **Fonte:** código existente, `CHECKPOINT.md`, `FRONTEND_ARCHITECTURE_REPORT.md`  
> **Legenda:** `[CONFIRMADO]` = implementado no código · `[EM ANDAMENTO]` = parcialmente implementado · `[PENDENTE]` = planejado/documentado mas ausente

---

## 1. Funcionalidades concluídas

### 1.1 Infraestrutura frontend

| Item | Evidência |
|------|-----------|
| Next.js 15 App Router | `package.json`, 28 rotas |
| Arquitetura em camadas (contracts/repositories/services) | `lib/contracts/`, `repositories/`, `services/` |
| Registry `getAppServices()` | `lib/data-source/app-services.ts` |
| React Query + hooks por domínio | `lib/query/hooks/` |
| HTTP client (`apiFetch`) | `lib/api/http-client.ts` |
| Validação Zod centralizada | `lib/contracts/auth/`, `lib/contracts/lessons/` |
| TypeScript strict passando | `CHECKPOINT.md` — `npx tsc --noEmit` |
| Scripts de migração arquitetural | `scripts/migrate-*.mjs` (14 arquivos) |

### 1.2 UI — Landing e público

| Item | Rota/Arquivo |
|------|--------------|
| Landing institucional (11 seções) | `/`, `sections/` |
| Tema dark/light | `ThemeProvider`, `globals.css` |
| Preloader | `components/preloader.tsx` |
| Páginas de erro estáticas | `/401`, `/403`, `/500`, `/sessao-expirada`, `/manutencao` |

### 1.3 UI — Autenticação

| Item | Status |
|------|--------|
| Formulário login com validação | `[CONFIRMADO]` |
| Formulário cadastro com validação | `[CONFIRMADO]` |
| Recuperação de senha (UI) | `[CONFIRMADO]` |
| Social login (visual) | `[CONFIRMADO]` — sem OAuth real |

### 1.4 UI — Admin (mock completo)

| Módulo | Rota | Componentes |
|--------|------|---------------|
| Dashboard | `/admin` | KPIs, agenda operacional, alunos, karts |
| Agenda | `/admin/agenda` | Timeline, calendário, drawers, nova aula, reagendamento, bloqueios |
| Clientes | `/admin/clientes` | CRM, perfil, feedback, export Excel |
| Karts | `/admin/karts` | Frota, paddock, detalhes |
| Manutenção | `/admin/manutencao` | OS, checklist, inspeção, registro peças |
| Estoque | `/admin/estoque` | Peças, fornecedores, movimentações, compras |
| Financeiro | `/admin/financeiro` | Overview, receber, pagar, fluxo, DRE |
| Registro aulas | `/admin/registro-aulas` | Manual, OCR, telemetria |
| Configurações | `/admin/configuracoes` | 7 abas completas |
| Telemetria | `/admin/telemetria` | Shell imersivo |

### 1.5 UI — Área do piloto

| Item | Rota |
|------|------|
| Dashboard piloto | `/piloto` |
| Reservar horário (calendário + slots) | `/piloto/reservar` |
| Perfil (dados, vinculados, segurança, consentimentos) | `/piloto/perfil` |
| Telemetria (importação, análise, setores) | `/piloto/telemetria/*` |

### 1.6 Telemetria (motor client-side)

| Item | Arquivo |
|------|---------|
| Pipeline completo | `lib/telemetry-engine/` |
| Adapters MyChron, Alfano, GPS, GoPro | `lib/telemetry-engine/adapters/` |
| Processamento laps/setores/ideal lap | `lib/telemetry-engine/processing/` |
| Catálogo de pistas | `lib/telemetry-engine/tracks/` |
| Vendor GoPro (esbuild) | `scripts/build-gopro-vendor.mjs` |

### 1.7 Backend e integração HTTP (Fase 5–6)

| Item | Status |
|------|--------|
| Prisma + PostgreSQL (Supabase) | `[CONFIRMADO]` — migration + seed |
| Auth sessão + cookie | `[CONFIRMADO]` — `/api/v1/auth/*` |
| Middleware route guard | `[CONFIRMADO]` — `ENABLE_ROUTE_GUARD` |
| Domínios P0 backend | `[CONFIRMADO]` — schedule, clients, karts, lessons, reference |
| Modo `NEXT_PUBLIC_DATA_SOURCE=http` | `[CONFIRMADO]` |
| Agenda HTTP completa (P0) | `[CONFIRMADO]` — eventos, bloqueios, remarcação, nova aula, slots, grade semanal |
| Grade semanal persistida (Configurações) | `[CONFIRMADO]` — `PUT /api/v1/schedule/week` |
| Supabase client + health | `[CONFIRMADO]` |
| OCR cronometragem | `[CONFIRMADO]` — POST `/api/v1/lessons/ocr` (+ legado admin) |
| Clientes/karts HTTP (parcial UI) | `[EM ANDAMENTO]` |
| Registro aulas HTTP (parcial UI) | `[EM ANDAMENTO]` |
| Demais domínios HTTP | `[PENDENTE]` |
| Proxy `/api/admin/*` → v1 | `[PENDENTE]` |

### 1.8 Documentação

| Item | Arquivo |
|------|---------|
| Arquitetura frontend | `docs/frontend-architecture.md` |
| Relatório arquitetura | `FRONTEND_ARCHITECTURE_REPORT.md` |
| Auditoria frontend | `FRONTEND_AUDIT.md` |
| Checkpoint | `CHECKPOINT.md` |
| Documentação permanente `/docs` | Este conjunto de arquivos |

---

## 2. Funcionalidades em andamento

| Item | Estado | Evidência |
|------|--------|-----------|
| Fase 6 — integração HTTP | Agenda P0 concluída; demais domínios mock | `MIGRATION_STATUS.md` |
| Registro de aulas | API v1 pronta; UI parcialmente mock | `createLessonsService()` |
| Clientes / karts | API v1; detalhes e KPIs parciais | `ClientsRepositoryHttp`, `KartsRepositoryHttp` |
| Configurações | Grade semanal HTTP; resto mock | `weekScheduleService`, `SettingsServiceMock` |
| Config — datas específicas / exceções | Mock only | `schedule-hours-panel.tsx` |
| Telemetria piloto/admin | Pipeline client-side; sem persistência remota | `telemetry-engine/` |
| Reserva pública | Fluxo UI; dados mock | `/reserva` |
| Design system / loading states | Fragmentado | `UI_AUDIT.md` |

---

## 3. Funcionalidades pendentes

### 3.1 Backend e persistência

| Item | Prioridade | Referência |
|------|------------|------------|
| Wire UI registro de aulas → HTTP | Alta | `MIGRATION_STATUS.md` §9 |
| Config — datas específicas / exceções grade | Alta | mock em `admin-settings-mocks.ts` |
| HTTP — financeiro, estoque, manutenção | Alta | `API_SPEC.md` |
| Proxy rotas legadas `/api/admin/*` → v1 | Média | 5 rotas legadas |
| Dashboard admin HTTP | Média | mock |
| Área piloto HTTP | Média | ⚠️ home/perfil/account/reserva GET; POST reserva pendente |
| Persistência telemetria remota | Média | client-side only |
| Workers/jobs assíncronos | Baixa | `ASYNC_JOBS.md` |
| Trilha auditoria consentimentos | Baixa | UI existe |

### 3.2 Módulos admin sem rota

| Módulo | Nav key | Status |
|--------|---------|--------|
| Relatórios operacionais | `relatorios` | `[PLANEJADO]` — ModuleKey em settings; sem rota admin |

### 3.3 Integrações externas

| Item | Status |
|------|--------|
| OAuth/social login | `[PENDENTE]` — UI only |
| WhatsApp notificações | `[PENDENTE]` — config mock |
| E-mail transacional | `[PENDENTE]` — config mock |
| Google Maps (telemetria) | `[PENDENTE]` — requer API key |
| Backend Java/Node externo | `[PENDENTE]` — mencionado em docs |

### 3.4 Qualidade e padronização UI

| Item | Referência |
|------|------------|
| Design system unificado (tokens vs hardcoded) | `FRONTEND_AUDIT.md` §3 |
| Padrão global loading/error/empty/skeleton | `FRONTEND_AUDIT.md` §5 |
| Tabela/modal/drawer/badge unificados | `FRONTEND_AUDIT.md` §11.2 |
| Dark mode completo no admin | `FRONTEND_AUDIT.md` §4.7 |
| Responsividade mobile por módulo | `FRONTEND_AUDIT.md` §6 |

---

## 4. Melhorias futuras

### 4.1 Arquitetura

- Expandir `getAppServices()` para escolher mock/HTTP por domínio (hoje só agenda)
- Consolidar enums dispersos em `lib/contracts/enums.ts`
- Implementar `ApiError` handling padronizado na UI
- Observabilidade (logging, error tracking)

### 4.2 Produto

- Relatórios operacionais dedicados (além dos financeiros)
- App mobile nativo ou PWA `[INFERIDO]`
- Notificações push `[INFERIDO]`
- Assinatura digital de documentos `[INFERIDO]` — termo mock existe

### 4.3 Telemetria

- Processamento server-side (jobs assíncronos)
- Comparação multi-piloto
- Integração direta MyChron/Alfano via Bluetooth `[INFERIDO]`
- Histórico de sessões persistente

### 4.4 Financeiro

- Integração gateway pagamento (Pix, cartão) `[INFERIDO]`
- Emissão NF-e `[INFERIDO]`
- Conciliação bancária `[INFERIDO]`
- Projeção financeira avançada

### 4.5 Operacional

- Concorrência real na agenda (lock otimista) `[INFERIDO]`
- Check-in digital no kartódromo `[INFERIDO]`
- QR code para identificação piloto/kart `[INFERIDO]`
- Integração balança/combustível `[INFERIDO]`

### 4.6 DevOps

- README de setup completo (hoje placeholder)
- CI/CD pipeline `[INFERIDO]`
- Testes automatizados (unit, e2e) — ausentes `[CONFIRMADO]`
- Storybook para design system `[INFERIDO]`

---

## 5. Cronologia de marcos

| Data | Marco | Referência |
|------|-------|------------|
| 2026-05-27 | Checkpoint arquitetural — UI desacoplada de mocks | `CHECKPOINT.md` |
| 2026-05-27 | Auditoria frontend completa | `FRONTEND_AUDIT.md` |
| 2026-05-28 | Documentação permanente `/docs` | Este roadmap |
| 2026-06-01 | Agenda P0 HTTP + grade semanal persistida | `MIGRATION_STATUS.md` |
| 2026-06-01 | Supabase + migrations/seed aplicados | `prisma/`, `.env.example` |

---

## 6. Critérios de "pronto para backend"

Baseado em `FRONTEND_AUDIT.md` §12:

| Critério | Status |
|----------|--------|
| Contratos DTO por domínio | Parcial — v1 schemas para P0 |
| UI sem imports diretos de mocks | Concluído — admin/piloto |
| Design system estabilizado | Pendente |
| Estados loading/error/empty padronizados | Pendente |
| Regras de negócio formalizadas | Parcial — `BUSINESS_RULES.md` |
| Auth/sessão definida | **Concluído** — cookie + middleware |
| Schema de banco definido | **Concluído** — Prisma + migration |
| Domínios P0 em HTTP | **Concluído** — agenda, auth, clients/karts/lessons API |

**Veredicto atual:** Fase 6 em andamento — **agenda P0 pronta**; demais módulos ainda mock. Ver `MIGRATION_STATUS.md`.

---

## 7. Priorização sugerida

`[INFERIDO]` — ordem recomendada para próximas sprints:

1. **Auth + middleware** — desbloqueia segurança
2. **Schema DB + backend mínimo** — clientes, agenda, auth
3. **HTTP repositories** — clientes → financeiro → demais
4. **Design system cleanup** — tokens, badges, tabelas
5. **Estados de UI globais** — loading/error/skeleton
6. **Telemetria persistência** — upload + processamento remoto
7. **Módulos pendentes** — relatórios (operacionais)
