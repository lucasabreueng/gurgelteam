# STATE_MACHINES — Máquinas de estado (Fase 2)

> **Status:** `[CONFIRMADO]` — 2026-05-28  
> **Enums existentes:** `lib/contracts/enums.ts`  
> **Alvo Fase 3:** enums PostgreSQL + CHECK constraints ou tabelas de transição

---

## Convenções

- **Estado inicial** em negrito na diagrama
- Transições anotadas com evento/ação
- Side effects referenciam regra `BR-*` em `BUSINESS_RULES.md`
- `[MOCK]` = implementado em runtime store; `[UI]` = só visual

---

## 1. Schedule event (`schedule_events`)

**Enum:** `ScheduleEventStatus`  
**Valores:** `pendente`, `confirmado`, `em_andamento`, `finalizado`, `cancelado`, `reagendado`, `no_show`, `aguardando_pagamento`

```mermaid
stateDiagram-v2
    [*] --> pendente: criar_aula
    pendente --> confirmado: confirmar_aula
    pendente --> cancelado: cancelar
    confirmado --> em_andamento: iniciar_turno
    confirmado --> reagendado: remarcar
    confirmado --> no_show: no_show
    confirmado --> cancelado: cancelar
    em_andamento --> finalizado: encerrar_aula
    finalizado --> [*]
    cancelado --> [*]
    reagendado --> pendente: novo_evento
    no_show --> [*]
    aguardando_pagamento --> confirmado: pagamento_ok
    aguardando_pagamento --> cancelado: timeout
```

| Transição | Side effect | Enforcement |
|-----------|-------------|-------------|
| → confirmado | Reserva kart `[MOCK]` | `operational-side-effects` |
| → finalizado | Sessão `pendente_registro` | `lesson-registration-mocks` |
| → cancelado | Libera kart se reservado | `[PLANEJADO]` |

**Fonte:** `lib/admin-schedule-mocks.ts`, `schedule-runtime-store.ts`

---

## 2. Lesson session (`lesson_sessions`)

**Enum:** `LessonStatus` / `LessonStatus` enum TS  
**Valores:** `aguardando`, `pendente_registro`, `em_andamento`, `concluida`, `cancelada`

```mermaid
stateDiagram-v2
    [*] --> aguardando: evento_futuro
    aguardando --> pendente_registro: evento_finalizado_hoje
    pendente_registro --> em_andamento: abrir_workspace
    em_andamento --> concluida: finalizar_registro
    pendente_registro --> concluida: finalizar_registro
    aguardando --> cancelada: evento_cancelado
    pendente_registro --> cancelada: cancelar
    concluida --> [*]
    cancelada --> [*]
```

| Transição | Side effect | Regra |
|-----------|-------------|-------|
| → concluida | Evento `finalizado`; kart `disponivel` | `BR-LES-FINISH` `[MOCK]` |
| abrir workspace | Bloqueia se kart manutenção | `BR-KART-BLOCK` `[MOCK]` |

**Fonte:** `lib/lesson-registration-store.ts`, `lib/operational-side-effects.ts`

---

## 3. Kart (`karts`)

**Enum:** `KartStatus`  
**Valores:** `disponivel`, `em_treino`, `reservado`, `manutencao`, `aguardando_peca`, `indisponivel`, `preparacao`, `lavagem`

```mermaid
stateDiagram-v2
    [*] --> disponivel
    disponivel --> reservado: agendar_aula
    reservado --> em_treino: iniciar_aula
    em_treino --> disponivel: finalizar_registro
    disponivel --> manutencao: abrir_os_ou_checklist_reprovado
    manutencao --> disponivel: checklist_aprovado_ou_os_concluida
    manutencao --> aguardando_peca: aguardar_peca
    aguardando_peca --> manutencao: peca_chegou
    disponivel --> preparacao: preparar_pista
    preparacao --> disponivel: pronto
    disponivel --> lavagem: lavagem
    lavagem --> disponivel: concluido
    disponivel --> indisponivel: bloqueio_admin
    indisponivel --> disponivel: liberar_admin
```

**Bloqueio operacional:** `manutencao`, `aguardando_peca`, `indisponivel` → impede agendamento/registro.

**Fonte:** `lib/karts-runtime-store.ts`, manutenção simple/completa

---

## 4. Payment on event (`schedule_events.payment_status`)

**Enum:** `PaymentStatus`  
**Valores:** `pago`, `pendente`, `vencido`, `pacote`

```mermaid
stateDiagram-v2
    [*] --> pendente: nova_aula
    pendente --> pago: registrar_pagamento
    pendente --> vencido: vencimento
    vencido --> pago: quitar
    pendente --> pacote: debitar_pacote
    pacote --> [*]
    pago --> [*]
```

**Fonte:** `finance-runtime-store.ts` + drawer agenda `[MOCK]`

---

## 5. Account receivable (`accounts_receivable`)

**Enum:** `ReceivableStatus`  
**Valores:** `pendente`, `pago`, `vencido`, `parcial`

```mermaid
stateDiagram-v2
    [*] --> pendente: nova_receita
    pendente --> pago: pagamento_total
    pendente --> parcial: pagamento_parcial
    parcial --> pago: quitar_restante
    pendente --> vencido: due_date_passed
    vencido --> pago: quitar
```

**Fonte:** `lib/finance-runtime-store.ts`

---

## 6. Maintenance order — fluxo completo (`maintenance_orders`)

**Enum:** `MaintenanceStatus` (OS legada)  
**Valores:** `detectado` → `aguardando_analise` → `aguardando_peca` → `em_manutencao` → `em_testes` → `finalizado` → `liberado`

```mermaid
stateDiagram-v2
    [*] --> detectado
    detectado --> aguardando_analise: triagem
    aguardando_analise --> aguardando_peca: solicitar_peca
    aguardando_analise --> em_manutencao: iniciar_servico
    aguardando_peca --> em_manutencao: peca_disponivel
    em_manutencao --> em_testes: servico_concluido
    em_testes --> finalizado: teste_ok
    em_testes --> em_manutencao: teste_falhou
    finalizado --> liberado: liberar_pista
    liberado --> [*]
```

---

## 7. Simple maintenance (`simple_maintenances`)

**Enum:** `SimpleMaintenanceStatus`  
**Valores:** `pendente`, `em_andamento`, `concluida`

Side effect mock: ≠ concluida → kart `manutencao`; concluida → `disponivel`.

---

## 8. Complete checklist (`complete_checklists`)

**Enum:** `ChecklistFinalStatus`  
**Valores:** `aprovado`, `aprovado_ressalvas`, `reprovado`

| Resultado | Kart |
|-----------|------|
| aprovado / aprovado_ressalvas | disponivel |
| reprovado | manutencao (+ OS drafts opcionais) |

---

## 9. Telemetry session (`telemetry_sessions`)

**Enum:** `TelemetryStatus` (`lib/contracts/enums.ts`)

```mermaid
stateDiagram-v2
    [*] --> UPLOADED: upload
    UPLOADED --> PROCESSING: job_start
    PROCESSING --> NORMALIZING: parse_ok
    PROCESSING --> FAILED: parse_error
    NORMALIZING --> COMPLETED: normalize_ok
    NORMALIZING --> FAILED: normalize_error
    COMPLETED --> [*]
    FAILED --> UPLOADED: retry
```

**Regra:** voltas inválidas excluídas de stats — `BR-TEL-INVALID`

---

## 10. Consent (`consents`)

**Enum:** `ConsentStatus`

```mermaid
stateDiagram-v2
    [*] --> PENDING: convite
    PENDING --> ACCEPTED: aceitar
    ACCEPTED --> REVOKED: revogar
    REVOKED --> [*]
```

**Side effect revogação imagem:** bloqueio operacional `[PLANEJADO]`

---

## 11. Package credits (`packages`)

**Enum:** `PackageStatus` — `ativo`, `expirando`, `esgotado`

```mermaid
stateDiagram-v2
    [*] --> ativo: compra
    ativo --> expirando: poucas_aulas_ou_prazo
    ativo --> esgotado: aulas_zeradas
    expirando --> esgotado: aulas_zeradas
    expirando --> ativo: renovacao
    esgotado --> [*]
```

---

## 12. Purchase order (`purchase_orders`)

**Enum:** `solicitado` → `aprovado` → `comprado` → `entregue`

---

## 13. Report run (`report_runs`)

**Enum:** `ReportRunStatus`  
**Spec:** `OPERATIONAL_REPORTS_SPEC.md`  
**Nota:** máquina alvo Fase 4–5; módulo admin `relatorios` ainda **sem página**.

```mermaid
stateDiagram-v2
    [*] --> pending: solicitar_export
    pending --> processing: job_iniciado
    processing --> completed: arquivo_gerado
    processing --> failed: erro
    completed --> [*]
    failed --> [*]
```

| Transição | Side effect | Regra |
|-----------|-------------|-------|
| → completed | URL blob + audit | `BR-RPT-EXPORT` |

---

## Matriz transição × enforcement

| Máquina | UI | Runtime mock | API | DB constraint |
|---------|:--:|:------------:|:---:|:-------------:|
| schedule_event | ✓ | ✓ | parcial | — |
| lesson_session | ✓ | ✓ | — | — |
| kart | ✓ | ✓ | — | — |
| receivable | ✓ | ✓ | — | — |
| telemetry | ✓ | local | — | — |
| maintenance OS | ✓ | parcial | — | — |
| report_run | — | — | — | — |

---

## Próximos passos (Fase 3)

1. Materializar enums PostgreSQL + CHECK constraints (incl. report_runs).
2. Tabela `state_transitions` opcional para auditoria.
3. Validar transições inválidas na API (409 Conflict).

---

## Relacionados

- `ENTITY_CATALOG.md` — entidades  
- `BUSINESS_RULES.md` — regras por transição  
- `OPERATIONAL_UX.md` — fluxos validados
