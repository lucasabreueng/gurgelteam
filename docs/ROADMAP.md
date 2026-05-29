# ROADMAP — Gurgel Team

> **Última atualização:** 2026-05-28  
> **Fonte:** código existente, `CHECKPOINT.md`, `FRONTEND_ARCHITECTURE_REPORT.md`, `FRONTEND_AUDIT.md`  
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
| Perfil (dados, segurança, consentimentos) | `/piloto/perfil` |
| Telemetria (importação, análise, setores) | `/piloto/telemetria/*` |

### 1.6 Telemetria (motor client-side)

| Item | Arquivo |
|------|---------|
| Pipeline completo | `lib/telemetry-engine/` |
| Adapters MyChron, Alfano, GPS, GoPro | `lib/telemetry-engine/adapters/` |
| Processamento laps/setores/ideal lap | `lib/telemetry-engine/processing/` |
| Catálogo de pistas | `lib/telemetry-engine/tracks/` |
| Vendor GoPro (esbuild) | `scripts/build-gopro-vendor.mjs` |

### 1.7 Integração HTTP (parcial)

| Item | Status |
|------|--------|
| Agenda — repository HTTP | `[CONFIRMADO]` — `ScheduleRepositoryHttp.ts` |
| Agenda — rotas API Next | `[CONFIRMADO]` — 4 rotas GET |
| OCR cronometragem — API OpenAI | `[CONFIRMADO]` — POST `/api/admin/lesson-registration/ocr` |
| Modo `NEXT_PUBLIC_DATA_SOURCE=http` | `[CONFIRMADO]` |

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
| Agenda modo HTTP | Bridge mock via rotas Next; backend real ausente | `FRONTEND_ARCHITECTURE_REPORT.md` |
| Registro de aulas | UI robusta; OCR funcional; persistência local | `lesson-registration-store.ts` |
| Telemetria piloto/admin | Pipeline maduro; sem persistência remota | `telemetry-engine/` |
| Perfil piloto | UI completa; persistência mock | `student-profile-mocks.ts` |
| Reserva pública | Fluxo UI; dados mock | `/reserva` |
| Migração UI → services | Admin e piloto migrados; stores locais restantes | `CHECKPOINT.md` |
| Estoque mutável | Parts/suppliers em store local | `inventory-*-store.ts` |
| Bloqueios agenda | Lógica em repository mock; sem HTTP | `ScheduleBlocksRepositoryMock.ts` |
| Reagendamento | Lógica de disponibilidade implementada; sem HTTP | `ScheduleRescheduleRepositoryMock.ts` |

---

## 3. Funcionalidades pendentes

### 3.1 Backend e persistência

| Item | Prioridade | Referência |
|------|------------|------------|
| Backend/API real | Crítica | `CHECKPOINT.md` |
| Banco de dados (schema) | Crítica | `DATABASE_REFERENCE.md` |
| Auth/sessão real (JWT/cookies) | Crítica | Sem `middleware.ts` |
| Middleware de proteção de rotas | Crítica | Páginas 401/403 existem, guards não |
| HTTP repositories — demais domínios | Alta | `FRONTEND_ARCHITECTURE_REPORT.md` |
| HTTP — bloqueios/remarcação/nova aula | Alta | `CHECKPOINT.md` |
| Substituir handlers mock das rotas API | Alta | `app/api/admin/schedule/*` |
| Persistência telemetria remota | Alta | Client-side only |
| Trilha auditoria consentimentos | Média | UI existe, backend não |

### 3.2 Módulos admin sem rota

| Módulo | Nav key | Status |
|--------|---------|--------|
| Instrutores | `instrutores` | `[PENDENTE]` — só ModuleKey |
| Campeonatos | `campeonatos` | `[PENDENTE]` — card no dashboard only |
| Relatórios operacionais | `relatorios` | `[PENDENTE]` — relatórios financeiros existem |

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

- Módulo de instrutores (gestão, carga horária, disponibilidade)
- Módulo de campeonatos (inscrições, resultados, pontuação)
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

---

## 6. Critérios de "pronto para backend"

Baseado em `FRONTEND_AUDIT.md` §12:

| Critério | Status |
|----------|--------|
| Contratos DTO por domínio | Parcial — existem, acoplados a mocks |
| UI sem imports diretos de mocks | Concluído — admin/piloto |
| Design system estabilizado | Pendente |
| Estados loading/error/empty padronizados | Pendente |
| Regras de negócio formalizadas | Parcial — `BUSINESS_RULES.md` |
| Auth/sessão definida | Pendente |
| Schema de banco definido | Parcial — `DATABASE_REFERENCE.md` |

**Veredicto atual:** `[CONFIRMADO]` — **NÃO pronto para backend** sem estabilizar contratos, design system e estados de UI.

---

## 7. Priorização sugerida

`[INFERIDO]` — ordem recomendada para próximas sprints:

1. **Auth + middleware** — desbloqueia segurança
2. **Schema DB + backend mínimo** — clientes, agenda, auth
3. **HTTP repositories** — clientes → financeiro → demais
4. **Design system cleanup** — tokens, badges, tabelas
5. **Estados de UI globais** — loading/error/skeleton
6. **Telemetria persistência** — upload + processamento remoto
7. **Módulos pendentes** — instrutores, campeonatos, relatórios
