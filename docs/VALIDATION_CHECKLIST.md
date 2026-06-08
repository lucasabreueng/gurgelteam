# Checklist de validação manual — modo HTTP

> **Objetivo:** percorrer a aplicação com `NEXT_PUBLIC_DATA_SOURCE=http` e confirmar que cada tela carrega dados reais (API + DB), sem erros visíveis.  
> **Atualizado:** 2026-06-05  
> **Complementa:** `docs/MIGRATION_STATUS.md` (smokes automáticos) · **`docs/SESSION_HANDOFF.md`** (status consolidado admin + piloto).

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Deve vir de `/api/v1/*` (HTTP) |
| ⚠️ | Parcial — parte mock ou só leitura |
| 🔧 | Ação de escrita (POST/PUT/PATCH) — validar persistência |
| 🌐 | Abrir DevTools → Network → filtrar `v1` |

**Critério de OK por tela:** carrega sem erro; dados coerentes com seed; requests `v1` retornam `200` + `{ success: true }` (exceto onde marcado ⚠️).

---

## 0. Pré-requisitos

- [ ] `.env` com `NEXT_PUBLIC_DATA_SOURCE=http`
- [ ] `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` preenchidos
- [ ] `npm run db:migrate` e `npm run db:seed` executados (seed remoto ~2 min)
- [ ] Se schema recente: `npx prisma db push` + `npx prisma generate` (com `npm run dev` **parado** no Windows)
- [ ] Se admin com 403 no dashboard: `npm run repair:staff-permissions` + relogin
- [ ] `npm run dev` rodando em `http://localhost:3000`
- [ ] Smokes automáticos OK:
  ```bash
  npm run smoke:http
  npm run smoke:checklist
  ```

### Usuários demo (seed)

| Papel | E-mail | Senha |
|-------|--------|-------|
| Admin | `ana.silva@gurgelteam.com.br` | `Gurgel@123` |
| Piloto | `piloto@gurgelteam.com.br` | `Gurgel@123` |
| Financeiro | `financeiro@gurgelteam.com.br` | `Gurgel@123` |

### Dica rápida (Network)

1. F12 → aba **Rede**
2. Filtro: `v1`
3. Recarregar a página
4. Clicar em request falho (vermelho) → Preview/Response → anotar rota e mensagem

---

## 1. Autenticação

### `/login`

- [ ] Login admin redireciona para `/admin` (ou rota pós-login configurada)
- [ ] 🌐 `POST /api/v1/auth/login` → 200
- [ ] 🌐 `GET /api/v1/auth/session` → usuário e permissões
- [ ] Credenciais inválidas → mensagem de erro (sem crash)
- [ ] Logout (se disponível) → `POST /api/v1/auth/logout`

### `/cadastro` · `/recuperar-senha` (opcional)

- [ ] Formulários renderizam
- [ ] Fluxo recovery não quebra (envio de e-mail pode ser stub)

### Páginas de erro

- [ ] `/401` · `/403` · `/sessao-expirada` renderizam

---

## 2. Admin — Dashboard

**Rota:** `/admin`

| Item | Esperado | Fonte |
|------|----------|-------|
| KPIs (aulas, alunos, ocupação, receita) | Valores numéricos, não skeleton eterno | ✅ `GET /dashboard` |
| Erro de permissão | Tela de erro + “Tentar novamente”, não loading infinito | ✅ (403 → `AdminErrorState`) |
| Agenda operacional | Eventos do dia/semana | ✅ `GET /dashboard` (summary) |
| Visão alunos / karts | Cards com dados | ⚠️ parcial — alguns blocos mock |

**Checklist:**

- [ ] Login `ana.silva@gurgelteam.com.br` → `/admin` carrega (não 403 em loop no Network)
- [ ] 🌐 `GET /api/v1/dashboard` → 200
| Telemetria (se visível no dashboard) | Gráfico evolução | ✅ se houver sessão no DB |

- [ ] Página carrega sem erro de console
- [ ] 🌐 Requests `GET /api/v1/dashboard` OK
- [ ] Links da sidebar levam às rotas corretas

---

## 3. Admin — Agenda

**Rota:** `/admin/agenda`

### Carregamento

- [ ] Timeline do dia exibe slots (horários da grade, não faixa fixa 08–19)
- [ ] 🌐 `GET /api/v1/schedule/meta`
- [ ] 🌐 `GET /api/v1/schedule/events`
- [ ] 🌐 `GET /api/v1/schedule/slots?date=…`
- [ ] 🌐 `GET /api/v1/schedule/blocks`
- [ ] 🌐 `GET /api/v1/schedule/week`

### Drawer do evento

- [ ] Abrir evento → detalhe (aluno, kart, horário)
- [ ] 🔧 **Confirmar** aula → status atualiza após refresh
- [ ] 🔧 **Cancelar** aula → some ou marca cancelado
- [ ] 🔧 **Trocar kart** → kart alterado persiste

### Bloqueios

- [ ] Criar bloqueio (drawer ou timeline)
- [ ] 🔧 `POST /api/v1/schedule/blocks` → bloqueio visível
- [ ] 🔧 Remover bloqueio → `DELETE .../blocks/:id`

### Nova aula

- [ ] Abrir fluxo nova aula
- [ ] 🔧 Criar evento → aparece na timeline
- [ ] 🌐 `POST /api/v1/schedule/events`

### Remarcação

- [ ] Remarcar para slot livre → sucesso
- [ ] Slot ocupado → erro amigável (não 500)
- [ ] 🔧 `POST /api/v1/schedule/events/:id/reschedule`

### Navegação de datas

- [ ] Trocar dia → novos slots/eventos
- [ ] Upcoming days / calendário lateral OK

---

## 4. Admin — Registro de aulas

**Rota:** `/admin/registro-aulas`

- [ ] Lista de sessões de aula carrega
- [ ] 🌐 `GET /api/v1/lessons/sessions`
- [ ] Abrir sessão → workspace de registro
- [ ] 🌐 `GET /api/v1/lessons/sessions/:id`
- [ ] 🔧 Salvar registro (tempos, observações) → persiste
- [ ] 🌐 `PUT` ou equivalente em lessons
- [ ] OCR (se testar): upload foto → resposta (requer `GEMINI_API_KEY` ou `OPENAI_API_KEY`)

---

## 5. Admin — Clientes

**Rota:** `/admin/clientes`

### Lista e KPIs

- [ ] Tabela com clientes do seed (não vazia)
- [ ] 🌐 `GET /api/v1/clients`
- [ ] 🌐 `GET /api/v1/clients/kpis` (ou stats agregados)
- [ ] Filtros (categoria, nível, busca) funcionam no client-side

### Perfil (drawer)

- [ ] Clicar cliente → drawer abre
- [ ] 🌐 `GET /api/v1/clients/:id/profile` (ou rotas de perfil/timeline)
- [ ] Timeline / stats do perfil com dados reais
- [ ] ⚠️ Bloco **Evolução / Ranking** — ainda mock (esperado)

### Ações

- [ ] Novo cliente / editar (se disponível) → 🔧 persistência
- [ ] Export Excel (se botão existir) → arquivo baixa

---

## 6. Admin — Karts

**Rota:** `/admin/karts`

- [ ] Lista da frota carrega
- [ ] 🌐 `GET /api/v1/karts`
- [ ] KPIs da página
- [ ] Abrir detalhe/drawer de um kart
- [ ] 🌐 `GET /api/v1/karts/:id/detail`
- [ ] ⚠️ Paddock / alertas avançados — mock se aplicável

---

## 7. Admin — Manutenção

**Rota:** `/admin/manutencao`

### Abas: Frota · Inspeções · Manutenções · Checklists

- [ ] KPIs carregam (`GET /maintenance/...` ou orders)
- [ ] 🌐 `GET /api/v1/maintenance/orders`
- [ ] Tabela de OS / frota com registros

### Inspeção técnica (modal)

- [ ] Botão **Inspeção técnica** abre modal
- [ ] 🌐 `GET /api/v1/maintenance/inspections/template` — tipos, módulos, condição geral, assinatura carregam (sem mock síncrono)
- [ ] Selecionar kart → módulos do accordion preenchidos pelo template
- [ ] Diagrama esquemático usa zonas do template
- [ ] Timeline técnica: inspeções salvas via API; seed do template só se vazio
- [ ] 🔧 Salvar inspeção → `POST /api/v1/maintenance/inspections`
- [ ] Inspeção aparece na aba **Inspeções**
- [ ] 🌐 `GET /api/v1/maintenance/inspections`

### Checklist por OS

- [ ] Abrir checklist de uma OS
- [ ] 🌐 `GET /api/v1/maintenance/checklists/template`
- [ ] 🌐 `GET /api/v1/maintenance/checklists/context` — alertas + histórico
- [ ] 🌐 `GET/PUT` checklist da OS (se aplicável)
- [ ] 🔧 Upload mídia → `POST /api/v1/maintenance/checklists/media`

---

## 8. Admin — Estoque

**Rota:** `/admin/estoque`

Percorrer **cada aba**:

### Visão geral (`overview`)

- [ ] KPIs carregam
- [ ] 🌐 `GET /api/v1/inventory/stats`
- [ ] ⚠️ Gráficos do overview — podem ser mock

### Peças (`parts`)

- [ ] Tabela de peças
- [ ] 🌐 `GET /api/v1/inventory/parts`
- [ ] Abrir detalhe / criar peça (🔧 se testar)

### Movimentações (`movements`)

- [ ] Lista de movimentos
- [ ] 🌐 `GET /api/v1/inventory/movements`
- [ ] 🔧 Entrada / saída (drawers) → `POST` movimento → lista atualiza

### Compras (`purchases`)

- [ ] Pedidos de compra
- [ ] 🌐 `GET /api/v1/inventory/purchase-orders`
- [ ] 🔧 Nova compra (drawer) → persiste

### Fornecedores (`suppliers`)

- [ ] 🌐 `GET /api/v1/inventory/suppliers`

### Histórico (`history`)

- [ ] Timeline de eventos
- [ ] 🌐 `GET /api/v1/inventory/history`

---

## 9. Admin — Financeiro

**Rota:** `/admin/financeiro`

### Visão geral (`overview`)

- [ ] Gráficos de receita, in/out, origem, evolução
- [ ] 🌐 `GET /api/v1/finance/charts`
- [ ] 🌐 `GET /api/v1/finance/overview`
- [ ] Smart insights / alertas executivos com dados
- [ ] Próximos pagamentos → link para aba payables

### Contas a receber (`receivables`)

- [ ] Tabela AR
- [ ] 🌐 `GET /api/v1/finance/receivables`
- [ ] Filtros e paginação

### Contas a pagar (`payables`)

- [ ] 🌐 `GET /api/v1/finance/payables`

### Fluxo de caixa (`cashflow`)

- [ ] 🌐 `GET /api/v1/finance/cash-flow`
- [ ] Trocar período/filtro → dados mudam

### DRE (`dre`)

- [ ] 🌐 `GET /api/v1/finance/dre`
- [ ] Tabela estruturada preenchida

### Relatórios (`reports`)

- [ ] Gráficos HTTP (mesmos hooks da overview)
- [ ] Catálogo de relatórios visível
- [ ] ⚠️ **Export PDF / Excel** — ainda mock (botão pode simular download)

### Tabs secundárias (componentes avulsos / futuras abas)

Validar com `NEXT_PUBLIC_DATA_SOURCE=http` — dados via `GET /finance/insights`:

- [ ] 🌐 `GET /api/v1/finance/insights`
- [ ] Pacotes e créditos — lista com validade e uso
- [ ] Inadimplência — total + alertas por cliente
- [ ] Ranking comercial — top 5 clientes
- [ ] Financeiro por kart — receita, custos, margem
- [ ] Financeiro por cliente — gasto, pendências, histórico
- [ ] Entradas / saídas por categoria (seção relatórios ou tabs dedicadas)

---

## 10. Admin — Telemetria

**Rota:** `/admin/telemetria`  
**Setores:** `/admin/telemetria/setores`

- [ ] Página principal (comparação) — import local ou empty state
- [ ] Bloco **Telemetria & evolução** (se na mesma página ou dashboard admin)
- [ ] 🌐 `GET /api/v1/telemetry/sessions` → lista com ≥1 sessão (seed)
- [ ] Overview admin: gráfico evolução + setores da última sessão
- [ ] ⚠️ Gráficos GPS / velocidade — só com CSV local (`proc-*`)

**Sessão seed (referência):** ID `cccccccc-cccc-4ccc-8ccc-ccccccccccc1` — Interlagos, 2 voltas Alfano.

---

## 11. Admin — Configurações

**Rota:** `/admin/configuracoes`

| Aba | Validar | HTTP |
|-----|---------|------|
| **Geral** | Nome equipe, contatos | ✅ org `GET/PUT /settings/organization` |
| **Usuários e permissões** | Perfis padrão + custom; renomear e **Salvar** | ✅ `GET` + **`PUT /settings/users`** |
| **Horários** | Grade semanal | ✅ `GET/PUT /schedule/week` |
| **Preços** | Tabela preços | ⚠️ mock |
| **Categorias e níveis** | Lista categorias | ⚠️ parcial / reference |
| **Cadastro de termos** | Termos | ⚠️ mock |
| **Notificações** | Preferências | ⚠️ mock |
| **Documentos** | Upload/lista | ⚠️ mock |

### Horários (crítico)

- [ ] Alterar horário de um dia → **Salvar**
- [ ] 🔧 `PUT /api/v1/schedule/week`
- [ ] Voltar à **Agenda** → timeline reflete nova grade
- [ ] Datas específicas / exceções (se UI exposta) → persistem

### Usuários e permissões (crítico — 2026-06-02)

- [ ] Renomear perfil (ex.: “Recepção”) → **Salvar** → recarregar → nome mantido
- [ ] Criar perfil custom (ex.: “Novo usuário”) → **Salvar**
- [ ] 🌐 `PUT /api/v1/settings/users` → 200

---

## 3.5 Admin — Equipe

**Rota:** `/admin/equipe`  
**Nav:** item **Equipe** na sidebar admin

| Item | Esperado | HTTP |
|------|----------|------|
| Listagem | Membros staff (seed: Ana, Carla) | ✅ `GET /api/v1/team` — smoke ✅ |
| KPIs | Total, ativos, admin, operação | ✅ `GET /api/v1/team/kpis` — smoke ✅ |
| Novo usuário | Drawer; usuário auto; função = perfis de Configurações | ✅ `POST /api/v1/team` |
| Perfil custom na função | Aparece após salvar em Configurações | ✅ `permissionProfileId` |
| Editar | Drawer com dados | ✅ `PATCH /api/v1/team/:id` |
| Remover | Admin sem lixeira; outros com confirmação | ✅ `DELETE /api/v1/team/:id` (403 admin) |
| Badge função | Texto em MAIÚSCULAS | UI |

**Checklist:**

- [x] 🌐 `GET/PUT /api/v1/settings/users` — smoke round-trip ✅ 2026-06-02
- [ ] Abrir **Configurações** → criar/renomear perfil → **Salvar**
- [ ] **Equipe** → Novo usuário → perfil “Novo usuário” (ou outro) no dropdown
- [ ] Criar com senha ≥ 8 caracteres → aparece na tabela
- [ ] Tentar remover Ana Silva → sem opção / 403
- [ ] Filtro por função (perfil) funciona

---

## 12. Área do piloto

**Login:** `piloto@gurgelteam.com.br` / `Gurgel@123`  
**Dependentes no seed:** Theo e Lara (vinculados a Lucas) — requer `npm run db:seed`

### `/piloto` (dashboard)

- [ ] KPIs / hero carregam
- [x] 🌐 `GET /api/v1/pilot/home` — smoke ✅ 2026-06-02
- [x] ✅ Evolução, conquistas, feedbacks via home HTTP
- [x] Menu lateral: Dashboard, **Reservar**, Telemetria (sem âncoras `#section-*`)
- [ ] **Próximas atividades** — timeline com eventos reais ou empty state
- [ ] Link **Reservar** no card de próximas atividades → `/piloto/reservar`

### `/piloto/reservar`

- [ ] Calendário renderiza; segundas desabilitadas
- [ ] Clicar em data → lista de horários do dia
- [x] 🌐 `GET /api/v1/pilot/booking/slots?date=YYYY-MM-DD` — smoke ✅
- [x] 🌐 `POST /api/v1/pilot/booking` — confirmar reserva (smoke ✅)
- [ ] Selecionar horário disponível → **Confirmar reserva** → mensagem de sucesso
- [ ] Piloto sem permissão `pilotoAgenda` → 403 na API

### `/piloto/perfil`

- [x] 🌐 `GET /api/v1/pilot/profile` + `GET /api/v1/pilot/account` — smoke ✅ 2026-06-02+
- [ ] Dados do perfil renderizam (nome, e-mail, telefone do seed)
- [ ] 🔧 Editar nome/telefone → Salvar → `PATCH /api/v1/pilot/profile`
- [ ] 🔧 Preferências (WhatsApp/e-mail), emergência, número favorito → Salvar → persistem (migration `20260604140000`)
- [ ] **Pilotos vinculados** — tabela Theo/Lara; **Mudar perfil** alterna contexto
- [ ] 🔧 Gerenciar vinculado → painéis laterais corretos; salvar perfil do menor
- [ ] 🔧 Avatar upload (`POST /pilot/profile/avatar`)
- [ ] ⚠️ `?demo=piloto|menor` — showcase mock (ignora API quando ativo)

### `/piloto/telemetria`

- [ ] Empty state se nenhuma sessão selecionada
- [ ] **Sessões** (modal):
  - [ ] Sessão **Nuvem** (badge) listada
  - [ ] Sessões **importadas** (`proc-*`) se houver CSV local
- [ ] Selecionar sessão **Nuvem** → tela resumo “Sessão na nuvem”
- [ ] Link **Abrir análise de setores** funciona

### `/piloto/telemetria/setores`

- [ ] Com sessão nuvem ativa: módulos S1–S2–S3, tabela de voltas, gráficos
- [ ] 🌐 `GET /api/v1/telemetry/sessions/:id`
- [ ] Tempos coerentes (~52s melhor volta no seed)
- [ ] ⚠️ Mapa GPS / heat map — não disponível para nuvem

### Import local (opcional)

- [ ] **Carregar telemetria** → CSV MyChron/Alfano
- [ ] Processamento → sessão `proc-*`
- [ ] Comparação com gráficos GPS e mapa

---

## 13. Usuário financeiro (opcional)

**Login:** `financeiro@gurgelteam.com.br` / `Gurgel@123`

- [ ] Acesso às rotas permitidas (financeiro)
- [ ] Rotas admin bloqueadas → `/403` ou redirect
- [ ] (Depende de `ENABLE_ROUTE_GUARD` — hoje pode estar `false` no `.env`)

---

## 14. Validação automatizada (2026-06-02)

Executado com `npm run smoke:setup && npm run smoke:checklist` contra `http://localhost:3000`.

| Grupo | Rotas validadas | Status |
|-------|-----------------|--------|
| Auth | login admin + piloto | ✅ |
| Agenda | meta, events, upcoming-days, week, **swap-kart**, **PATCH confirmar**, **PUT week** | ✅ |
| Clientes | lista, rankings, stats, timeline | ✅ |
| Karts | paddock, **technical-timeline** | ✅ |
| Financeiro | overview, DRE, **dre/entries**, cash-flow, charts, **insights**, **meta** | ✅ |
| Estoque | parts, movements, purchase-orders, history, **charts** | ✅ |
| Manutenção | orders, template, inspections, **checklists/context**, **inspections/template** | ✅ |
| Settings | org, users, catalog, notifications, documents, terms, integrations, appearance, security | ✅ |
| Dashboard | `/dashboard` | ✅ |
| Telemetria | sessions + detail | ✅ |
| **Piloto** | home, profile, account, evolution, achievements, dashboard, PATCH profile, avatar validation, consents | ✅ |
| **Piloto (booking)** | `GET/POST /pilot/booking*` | ✅ smoke |
| **Escritas** | OS POST/PATCH/GET detail, PUT checklist, inspeção, estoque, mídia, **agenda POST/cancel/reschedule/swap/confirm**, **aula start/register**, **purchase order**, **pagamento**, **POST receivable** | ✅ |

**CI:** workflow `.github/workflows/validate.yml` — Postgres + migrate + seed + build + smoke.

**Local:** `npm run validate` (tsc + lint) · `npm run validate:smoke` (setup + smoke com servidor rodando).

**UI HTTP (etapa 3):** `kart-history-drawer`, `kart-detail-drawer` (timeline), `dre-account-modal` (lançamentos) — dados via API em modo `NEXT_PUBLIC_DATA_SOURCE=http`.

**Pendente manual (browser):** renderização UI, âncoras, fluxos de escrita na interface (agenda, estoque drawer, manutenção drawer completo), telemetria setores no browser.

---

## 15. Registro de falhas

Use esta tabela ao encontrar problemas:

| # | Rota / tela | Passo | Request API | Esperado | Obtido |
|---|-------------|-------|-------------|----------|--------|
| 1 | | | | | |
| 2 | | | | | |

**Console:** anotar erros React ou `Failed to fetch`.  
**Screenshot:** útil para UI quebrada.

---

## 16. Encerramento

- [ ] Nenhum 500 em fluxos críticos (agenda, financeiro AR/AP, clientes, telemetria)
- [ ] Escritas testadas (≥1 por domínio: agenda, estoque, manutenção, lessons)
- [ ] Itens ⚠️ documentados como “conhecidos / próxima sprint”
- [ ] Atualizar `docs/MIGRATION_STATUS.md` se encontrar divergência com §3

### Ordem sugerida (1ª passada rápida ~45 min)

1. Login admin  
2. Agenda (confirmar + bloqueio)  
3. Configurações → Horários → Salvar → Agenda  
4. Financeiro overview + DRE  
5. Clientes → drawer perfil  
6. Estoque → movimentação ou compra  
7. Manutenção → inspeção técnica  
8. Login piloto → Telemetria → Sessão nuvem → Setores  

---

## Documentos relacionados

| Arquivo | Uso |
|---------|-----|
| **`docs/SESSION_HANDOFF.md`** | Contexto da última sessão (ler primeiro em chat novo) |
| `docs/MIGRATION_STATUS.md` | Matriz mock vs HTTP |
| `docs/API_SPEC.md` | Contratos das rotas |
| `scripts/smoke-http.ts` | Smoke automático 21 rotas |
| `scripts/smoke-checklist.ts` | Smoke domínios migrados |