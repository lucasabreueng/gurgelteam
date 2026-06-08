# PERMISSIONS_MATRIX — Mapa de permissões (Fase 2)

> **Status:** `[CONFIRMADO]` — 2026-05-28  
> **Fonte:** `lib/admin-settings-mocks.ts` (`ModuleKey`, `RoleKey`, `SETTINGS_USERS`)  
> **Enforcement alvo:** API middleware (Fase 5) + guards UI (Fase 6)

---

## Modelo de autorização

Duas camadas combinadas:

1. **RoleKey operacional** — flags coarse (`verAlunos`, `editarAgenda`, …) para perfis staff.
2. **ModulePermission** — por usuário: `visualizar | editar | excluir` × `ModuleKey` (22 módulos; ver `lib/contracts/enums.ts`).

**Regra global:** usuário novo → **sem módulos** até admin atribuir (`createSettingsUser`).

---

## Perfis do sistema

| Perfil | Tipo | Escopo de dados |
|--------|------|-----------------|
| **Administrador** | staff | Global |
| **Recepção** | staff | Agenda + clientes (leitura/cadastro) |
| **Financeiro** | staff | Financeiro + clientes (leitura) |
| **Mecânico** | staff | Karts, manutenção, estoque |
| **Piloto** | portal | Próprio perfil e evolução |
| **Responsável** | portal | Dependentes (menores) |
| **Piloto menor** | portal | Parcial — sem telemetria/plano/ranking |

---

## RoleKey × flags operacionais

| RoleKey | verAlunos | editarAlunos | verFinanceiro | editarAgenda | publicarResultados | alterarConfiguracoes |
|---------|:---------:|:------------:|:-------------:|:------------:|:------------------:|:--------------------:|
| admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| recepcao | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| financeiro | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| mecanico | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## Módulos admin (`ModuleKey`)

| ModuleKey | Label UI | Entidades principais |
|-----------|----------|----------------------|
| dashboard | Dashboard | KPIs agregados |
| agenda | Agenda | schedule_events |
| registroAulas | Registro de aulas | lesson_sessions |
| alunos | Clientes | clients |
| equipe | Equipe | users (staff) |
| karts | Karts | karts |
| manutencao | Manutenção | maintenance_orders, checklists |
| estoque | Estoque | inventory_parts, suppliers |
| telemetria | Telemetria | telemetry_sessions |
| financeiro | Financeiro | receivables, payables, DRE |
| relatorios | Relatórios | `[PLANEJADO]` — ModuleKey only; sem rota admin |
| configuracoes | Configurações | settings, users, roles |

---

## Módulos piloto (`ModuleKey`)

| ModuleKey | Label | Piloto adulto | Menor | Responsável |
|-----------|-------|:-------------:|:-----:|:-----------:|
| pilotoDashboard | Dashboard | V | V | V |
| pilotoAgenda | Agenda | V | V | V |
| pilotoEvolucao | Evolução | V | V | V |
| pilotoFeedbacks | Feedbacks | V | V | V |
| pilotoPlano | Plano | V | ✗ | V |
| pilotoTelemetria | Telemetria | V | ✗ | V |
| pilotoResultados | Resultados | V | ✗ | V |
| pilotoMateriais | Materiais | V | V | V |
| pilotoConquistas | Conquistas | V | V | V |
| pilotoRanking | Ranking | V | ✗ | V |

*V = visualizar no mock de papéis; enforcement real pendente.*

---

## Matriz papel × módulo (resumo mock)

Legenda: **V** visualizar · **E** editar · **X** excluir · **—** sem acesso

### Staff — módulos admin

| Módulo | Admin | Mecânico | Recepção | Financeiro |
|--------|:-----:|:--------:|:--------:|:----------:|
| dashboard | VEX | V | V | V |
| agenda | VEX | V | VEX | V |
| registroAulas | VEX | — | — | — |
| alunos | VEX | — | V | V |
| karts | VEX | VEX | V | — |
| manutencao | VEX | VEX | — | — |
| estoque | VEX | VE | — | — |
| telemetria | VEX | — | — | — |
| financeiro | VEX | — | — | VEX |
| relatorios | VEX | — | — | V |
| configuracoes | VEX | — | — | — |

*Derivado de papéis mock em `admin-settings-mocks.ts` — validar na implementação API.*

---

## Ações sensíveis (além de CRUD)

| Ação | Módulo | Perfis permitidos | Regra |
|------|--------|-------------------|-------|
| Confirmar aula | agenda | admin, recepcao | `BR-SCH-CONFIRM` |
| Finalizar registro | registroAulas | admin | `BR-LES-FINISH` |
| Liberar kart pós-checklist | manutencao | admin, mecânico | `BR-KART-RELEASE` |
| Registrar pagamento | financeiro | admin, financeiro | `BR-FIN-PAY` |
| Alterar preços/categorias | configuracoes | admin | `BR-CFG-PRICE` |
| Revogar consentimento imagem | configuracoes / piloto | admin, responsável | `BR-CONSENT-IMG` |
| Exportar clientes Excel | alunos | admin, financeiro | `[PLANEJADO]` |
| Gerar relatório operacional | relatorios | admin, financeiro | `BR-RPT-ACCESS` `[PLANEJADO — sem UI]` |
| Export audit log | relatorios / configuracoes | admin | `AUDIT_LOG_SPEC` |

---

## Escopo de dados (row-level)

| Perfil | Escopo |
|--------|--------|
| Piloto | `client_id = self` |
| Responsável | `client_id IN guardian_links` |
| Recepção / Financeiro | Todos clientes; financeiro filtra por permissão módulo |
| Admin | Sem filtro |

---

## Rotas públicas (sem auth)

| Rota | Auth |
|------|------|
| `/`, `/reserva` | Opcional (reserva exige login mock) |
| `/login`, `/cadastro`, `/recuperar-senha/*` | Público |
| `/401`, `/403`, `/erro-servidor`, `/manutencao` | Público |

## Rotas protegidas (alvo Fase 5)

| Prefixo | Perfil mínimo |
|---------|---------------|
| `/admin/*` | staff com módulo correspondente |
| `/piloto/*` | piloto/responsável autenticado |
| `/api/admin/*` | staff + token + module permission |
| `/api/v1/pilot/*` | piloto/responsável + escopo |

---

## Implementação futura

```typescript
// Alvo Fase 5 — pseudocódigo
assertModule(user, "agenda", "editar");
assertScope(user, clientId); // row-level
```

**Entregável Fase 5:** middleware Next.js + decorators service layer.  
**Testes:** matriz acima como casos E2E por perfil.

---

## Relacionados

- `ENTITY_CATALOG.md` §12 — entidades roles/permissions  
- `AUTH_SPEC.md` — sessão e tokens  
- `BUSINESS_RULES.md` §1 — regras de permissão  
- `lib/admin-settings-mocks.ts` — fonte de verdade mock
