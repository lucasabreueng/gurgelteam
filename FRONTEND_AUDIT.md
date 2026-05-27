# FRONTEND AUDIT - Gurgel Team

Data: 2026-05-27  
Escopo: auditoria completa do frontend (arquitetura visual + funcional), sem iniciar backend.

## Metodologia

- Varredura estrutural de rotas em `app/**/page.tsx`.
- Inspecao de fluxos em `components/**` e contratos/mocks em `lib/**`.
- Revisao de consistencia visual (tokens, componentes reutilizados, padroes de tabela/form/modal).
- Levantamento de estados de UI (loading/empty/error/success/skeleton/validacoes).
- Mapeamento de dados mockados, regras de negocio aparentes e gaps pre-backend.

---

## 1) Mapa de paginas existentes

### Rotas publicas e autenticacao

- `/` - Landing institucional (conteudo comercial e navegacao principal) - **Parcial**
- `/reserva` - Reserva publica em etapas (data/slot/login/confirmacao) - **Mockada**
- `/login` - Login de usuario - **Mockada**
- `/cadastro` - Cadastro de conta - **Mockada**
- `/recuperar-senha` - Solicitacao/validacao de recuperacao - **Mockada**
- `/recuperar-senha/redefinir` - Redefinicao de senha - **Parcial**

### Area aluno/piloto

- `/piloto` - Dashboard do aluno/piloto - **Mockada**
- `/piloto/perfil` - Perfil, seguranca, consentimentos e dados pessoais - **Parcial**
- `/piloto/perfil/cadastrar-piloto` - Rota legado/redirecionamento para cadastro vinculado - **Parcial**
- `/piloto/telemetria` - Importacao e analise de telemetria - **Parcial**
- `/piloto/telemetria/setores` - Visualizacao detalhada por setores - **Parcial**

### Area admin

- `/admin` - Dashboard administrativo - **Mockada**
- `/admin/agenda` - Agenda operacional - **Mockada**
- `/admin/clientes` - Gestao de clientes/alunos - **Mockada**
- `/admin/karts` - Gestao de frota de karts - **Mockada**
- `/admin/manutencao` - Manutencao/checklists/OS - **Mockada**
- `/admin/estoque` - Estoque/pecas/fornecedores/compras - **Mockada**
- `/admin/financeiro` - Financeiro (visao geral, contas a receber/pagar, fluxo) - **Mockada**
- `/admin/registro-aulas` - Registro de aulas com OCR/telemetria/manual - **Parcial**
- `/admin/configuracoes` - Configuracoes administrativas - **Mockada**

### Rotas de estado/erro

- `/401` - Nao autorizado - **Completa (estatica)**
- `/403` - Acesso negado - **Completa (estatica)**
- `/500` - Erro interno - **Completa (estatica)**
- `/manutencao` - Sistema em manutencao - **Completa (estatica)**
- `/sessao-expirada` - Sessao expirada - **Completa (estatica)**

### Paginas orfas ou sem navegacao explicita

Rotas com arquivo existente e sem navegacao clara por menu/CTA principal:

- `/401`
- `/403`
- `/500`
- `/manutencao`
- `/sessao-expirada`

Observacao: podem ser rotas de fallback/guard/middleware.

---

## 2) Fluxos principais (status atual)

### 2.1 Cadastro
- **Status:** Parcial/Mockado
- Formulario e validacoes presentes.
- Regras de menor de idade parcialmente modeladas.
- Persistencia/autenticacao real ausente.

### 2.2 Login
- **Status:** Mockado
- Fluxo visual funcional.
- Sem sessao/token real de backend.

### 2.3 Area do aluno/piloto
- **Status:** Parcial
- Estrutura rica (dashboard, perfil, telemetria).
- Dados majoritariamente vindos de mocks.

### 2.4 Responsavel e menor de 14 anos
- **Status:** Parcial
- Regras presentes no frontend (menor + responsavel, perfil vinculado).
- Sem validacao transacional no backend.

### 2.5 Agendamento
- **Publico (`/reserva`)**: Mockado
- **Admin (`/admin/agenda`)**: Mockado
- Fluxo de UI existe, sem persistencia/concorrencia real.

### 2.6 Financeiro
- **Status:** Mockado
- Tabelas e KPIs presentes.
- Acoes de negocio ainda simuladas.

### 2.7 Registro de aulas
- **Status:** Parcial
- Fluxo robusto com metodos manual/OCR/telemetria.
- Boas validacoes locais.
- Fonte de dados ainda local/mock.

### 2.8 Telemetria
- **Status:** Parcial (forte no frontend)
- Pipeline de processamento no client bem estruturado.
- Sem integracao completa com backend para persistencia/processamento remoto.

### 2.9 OCR de cronometragem manual
- **Status:** Parcial
- Upload + revisao manual + validacao implementados.
- Dependencias de fluxo local e mock ainda presentes.

### 2.10 Perfil/configuracoes
- **Status:** Parcial
- Secoes completas de UI (dados, seguranca, consentimentos).
- Sem persistencia real consolidada.

### 2.11 Termos, privacidade e uso de imagem
- **Status:** Parcial
- Conteudo e acoes de aceite/revogacao presentes.
- Sem trilha de auditoria backend confirmada.

---

## 3) Componentes duplicados e inconsistencias

## 3.1 Cards repetidos
- Variacoes de cards de KPI, resumo e status com estrutura semelhante mas sem base unica completa.
- Repeticao de blocos de metricas entre modulos admin (clientes, financeiro, manutencao, estoque).

## 3.2 Botoes diferentes para a mesma funcao
- Coexistencia de:
  - classes utilitarias (`btn-primary-sm`, `btn-outline-sm`, etc.)
  - componente `Button` em `components/ui/button.tsx`
  - botoes custom inline em varios arquivos
- Resultado: variacao de tamanho, peso, hover e densidade visual.

## 3.3 Tabelas com padroes diferentes
- Existe base compartilhada no estoque (`inventory-table-shared.tsx`) + paginacao padrao.
- Outras tabelas ainda usam estrutura propria, com comportamentos distintos de filtros/acoes/mobile.

## 3.4 Inputs inconsistentes
- Padrões de input variam por modulo (settings/clients/inventory/financeiro).
- Diferencas de altura, borda, placeholder, foco e mascara.

## 3.5 Modais e drawers duplicados
- Multiplos shells/abordagens:
  - `AppModal`
  - dialogs custom
  - drawers com estrutura repetida
- Mesmo comportamento (confirmar/excluir/editar) implementado em formas diferentes.

## 3.6 Loaders diferentes
- Telemetria tem carga/skeleton/progresso bem definida.
- Outras areas dependem de feedback textual simples, sem padrao unico.

## 3.7 Badges/status sem padrao unico
- Varias implementacoes por dominio (karts, agenda, financeiro, registro), com estilos proximos mas nao unificados.

---

## 4) Design system

## 4.1 Cores
- Tokens existem, mas uso amplo de valores hardcoded (`#0d1f3c`, etc.) ainda domina.
- Risco: dificuldade de tema global e consistencia.

## 4.2 Espacamentos
- Bom uso de utilitarios Tailwind, mas com muitos ajustes pontuais por tela.
- Falta escala mais estrita por componente base.

## 4.3 Tipografia
- Boa legibilidade geral.
- Muitos tamanhos custom (`text-[10px]`, `text-[11px]`, etc.) causam variacao excessiva.

## 4.4 Bordas e sombras
- Padrões proximos, mas ainda repetidos localmente em vez de abstraidos.

## 4.5 Icones
- Uso consistente de `react-icons/hi2`.
- Sem problema critico, mas com variacoes de tamanho/cor por modulo.

## 4.6 Hover/focus/active
- Hover geralmente presente.
- Focus/estado de acessibilidade nem sempre padronizado em todos os componentes.

## 4.7 Dark/light mode
- Infra para dark mode existe.
- Cobertura parcial: muitos componentes (principalmente admin) ainda hardcoded em light.

---

## 5) Estados obrigatorios por pagina/modulo

Legenda: OK = presente de forma clara, Parcial = existe em parte, Nao = ausente/restrito.

- Landing/Home: loading **Nao**, empty **Nao**, error **Nao**, success **Nao**, skeleton **Nao**, validacao **Nao**
- Login/Cadastro/Recuperacao: loading **Parcial**, empty **Nao**, error **Parcial**, success **Parcial**, skeleton **Nao**, validacao **OK**
- Piloto Dashboard: loading **Parcial**, empty **Parcial**, error **Parcial**, success **Parcial**, skeleton **Parcial**, validacao **Parcial**
- Piloto Telemetria: loading **OK**, empty **OK**, error **OK**, success **OK**, skeleton **OK**, validacao **OK**
- Piloto Perfil: loading **Parcial**, empty **Parcial**, error **Parcial**, success **Parcial**, skeleton **Nao**, validacao **Parcial**
- Admin Agenda: loading **Parcial**, empty **Parcial**, error **Parcial**, success **Parcial**, skeleton **Nao**, validacao **Parcial**
- Admin Clientes: loading **Nao**, empty **OK**, error **Parcial**, success **OK**, skeleton **Nao**, validacao **OK**
- Admin Manutencao: loading **Parcial**, empty **Parcial**, error **Parcial**, success **Parcial**, skeleton **Nao**, validacao **Parcial**
- Admin Estoque: loading **Nao**, empty **OK**, error **Parcial**, success **OK**, skeleton **Nao**, validacao **Parcial**
- Admin Financeiro: loading **Nao**, empty **OK**, error **Parcial**, success **OK**, skeleton **Nao**, validacao **Parcial**
- Admin Registro de aulas: loading **OK**, empty **Parcial**, error **OK**, success **OK**, skeleton **Parcial**, validacao **OK**
- Admin Configuracoes: loading **Nao**, empty **Parcial**, error **Parcial**, success **Parcial**, skeleton **Nao**, validacao **Parcial**

Conclusao de estados: cobertura mais madura em telemetria e registro de aulas; restante ainda precisa padronizacao forte.

---

## 6) Responsividade

## 6.1 Desktop
- Geralmente bom.
- Densidade de informacao alta em telas admin, exigindo refinamento de hierarquia visual.

## 6.2 Tablet
- Risco medio em drawers/larguras fixas e composicoes com muitos controles em linha.
- Alguns layouts dependem de breakpoints agressivos.

## 6.3 Mobile
- Varios modulos resolvem com scroll horizontal de tabela.
- Nem todas as tabelas tem alternativa mobile dedicada.
- Drawers e modais com variacoes de largura/estrutura podem ficar inconsistentes.

Principais pontos de atencao:
- tabelas com `min-w` elevado
- combinacoes de filtros em linha
- multiplos shells de drawer/modal
- sincronismo de headers fixos em shells complexos

---

## 7) Dados mockados e pontos simulados

## 7.1 Locais com dados fake/arrays estaticos/valores fixos

Encontrados amplamente em `lib/*mocks*.ts`, incluindo:

- `admin-dashboard-mocks.ts`
- `admin-schedule-mocks.ts`
- `admin-clients-mocks.ts`
- `admin-karts-mocks.ts`
- `admin-maintenance-mocks.ts`
- `admin-inventory-mocks.ts`
- `admin-financial-mocks.ts`
- `admin-settings-mocks.ts`
- `lesson-registration-mocks.ts`
- `student-area-mocks.ts`
- `student-profile-mocks.ts`
- `login-mocks.ts`
- `cadastro-mocks.ts`
- `password-recovery-mocks.ts`

## 7.2 Stores locais sem backend

- `lesson-registration-store.ts` (memoria)
- `inventory-parts-store.ts` (memoria)
- `inventory-suppliers-store.ts` (memoria)
- `telemetry-active-session.ts` (sessionStorage)

## 7.3 Usuarios mockados

- Presentes nos dominos de auth, perfil, clientes, financeiro e dashboards.

## 7.4 TODO/FIXME

- Nao ha concentracao significativa de `TODO`/`FIXME` explicitos.
- Pendencias estao mais implicitas na arquitetura mock/local.

---

## 8) Contratos de dados necessarios (futuro backend)

## 8.1 Home/Publico
- Conteudo institucional (hero, servicos, parceiros, FAQ)
- configuracoes de navegacao/CTA
- destaque de agenda/eventos

## 8.2 Auth (login/cadastro/recuperacao)
- Usuario (id, nome, email, telefone, cpf, nascimento, role)
- credenciais/senha
- sessao/token/refresh
- verificacao de email/codigo
- politicas de menor de idade/responsavel

## 8.3 Perfil aluno/piloto e responsavel
- dados pessoais e contato
- perfil esportivo/categoria/experiencia
- dados de emergencia
- responsavel legal vinculado (quando menor)
- consentimentos (termos, privacidade, uso de imagem) + trilha de aceite/revogacao
- preferencias de conta/notificacao

## 8.4 Reserva e agenda
- calendario e slots disponiveis
- capacidade/vagas por horario
- conflito de agendamento
- reserva/confirmacao/cancelamento
- historico e status da aula

## 8.5 Admin clientes
- cadastro completo de cliente/piloto
- status do cliente
- relacionamento responsavel-menor
- historico financeiro e de aulas

## 8.6 Admin karts
- inventario de karts
- status operacional/manutencao
- alocacao por aula
- custos e historico de uso

## 8.7 Admin manutencao
- ordens de servico
- checklist/inspecao
- tecnico responsavel
- pecas usadas/custos/tempo
- anexos e evidencias

## 8.8 Admin estoque
- pecas (codigo, categoria, custo, estoque minimo/atual)
- movimentacoes (entrada/saida/ajuste)
- compras e recebimentos
- fornecedores (dados, prazo medio, historico)

## 8.9 Admin financeiro
- contas a receber
- contas a pagar
- recebimentos/pagamentos
- inadimplencia
- fluxo de caixa, DRE, indicadores e relatorios

## 8.10 Registro de aulas
- sessoes originadas da agenda
- dados de aula (instrutor, kart, aluno, objetivo, feedback)
- voltas/setores/tempos
- origem de cronometragem (manual, OCR, telemetria)
- status de registro/finalizacao

## 8.11 Telemetria
- sessao telemetrica (metadados)
- pontos de telemetria/series temporais
- voltas/setores e comparacoes
- processamento assinado por job (status, erros, warnings)
- vinculo com aluno, aula, kart e pista

## 8.12 Termos/privacidade/uso de imagem
- versao de documentos
- aceite por usuario com timestamp/ip/device
- revogacao e historico de alteracoes

---

## 9) Regras de negocio aparentes (ja codificadas no frontend)

- Menor de 14 anos precisa responsavel legal.
- Consentimento de uso de imagem pode ser aceito/revogado.
- Registro de aula depende de consistencia dos dados (ex.: voltas/setores).
- Aula agendada/finalizada alimenta fluxo de registro de aulas.
- OCR de cronometragem exige revisao manual em cenarios inconsistentes.
- Telemetria passa por processamento/validacao antes de uso final.
- Status e filtros de financeiro/estoque seguem regras operacionais especificas.

---

## 10) Problemas encontrados (prioridade)

## Critico

- Dependencia massiva de mocks como fonte principal de dados.
- Persistencia em memoria/sessionStorage para dominos criticos.
- Ausencia de contratos formais unificados frontend-backend por dominio.

## Alto

- Fragmentacao do design system (tokens x hardcoded, componentes paralelos).
- Inconsistencia entre tabelas/modais/drawers/inputs.
- Cobertura incompleta de loading/error/skeleton em modulos admin centrais.
- Regras de negocio relevantes apenas no frontend (risco de divergencia futura).

## Medio

- Responsividade heterogenea (tabelas largas e fallback mobile desigual).
- Duplicidade de badges/status e estilos de botoes.
- Falta de trilha de erro/observabilidade visual padronizada.

## Baixo

- Variacoes tipograficas pontuais e microinconsistencias de spacing.
- Presenca de textos de demonstracao em mensagens de acao.

---

## 11) Plano de correcao pre-backend (checklist)

## 11.1 Arquitetura e contratos

- [ ] Definir contratos de dados (DTOs) por dominio: auth, perfil, agenda, financeiro, estoque, manutencao, registro, telemetria.
- [ ] Criar schema compartilhado (ex.: Zod/TypeScript types centrais) para request/response.
- [ ] Mapear todos os `*mocks.ts` para fontes de dados substituiveis (adapter/repository).

## 11.2 Design system e UI base

- [ ] Consolidar padrao unico de tabela (header, filtros, acoes, paginação, mobile fallback).
- [ ] Consolidar padrao unico de modal/drawer/confirmacao.
- [ ] Consolidar padrao unico de badges/status.
- [ ] Migrar cores hardcoded para tokens.
- [ ] Definir oficialmente suporte dark mode (completo ou desativado por enquanto).

## 11.3 Estados de interface

- [ ] Criar padrao global para loading, error, empty, success e skeleton.
- [ ] Aplicar o padrao em todas as paginas admin e area aluno.
- [ ] Padronizar validacoes visuais de formulario (erro/sucesso/informativo).

## 11.4 Fluxos funcionais

- [ ] Congelar comportamento final de cadastro/login/recuperacao.
- [ ] Congelar regras de menor + responsavel legal.
- [ ] Congelar fluxo de registro de aulas (manual/OCR/telemetria).
- [ ] Congelar fluxo de consentimentos (termos/privacidade/imagem).
- [ ] Congelar comportamento de agenda publica e agenda admin.

## 11.5 Dados e stores

- [ ] Isolar stores locais em camada de gateway para troca por API sem refatoracao de UI.
- [ ] Remover dependencias diretas de arrays mock dentro de componentes de tela.
- [ ] Definir IDs estaveis e relacionamentos entre entidades (usuario, aluno, responsavel, aula, telemetria, financeiro).

## 11.6 Responsividade e acessibilidade

- [ ] Revisar tabelas com `min-w` alto e definir experiencia mobile por modulo.
- [ ] Revisar drawers/modais em tablet/mobile.
- [ ] Garantir foco visivel/teclado/aria em interacoes principais.

---

## 12) Pronto para backend?

**Resposta: NAO.**

Justificativa:

- O frontend esta funcional para demonstracao, mas ainda centrado em mocks e estado local.
- Faltam contratos de dados consolidados por dominio para evitar retrabalho na integracao.
- Ha inconsistencias de design system e cobertura de estados que devem ser estabilizadas antes de acoplar API/banco.
- Regras de negocio ja existem no frontend, porem precisam ser formalizadas para sincronia com backend.

Recomendacao: executar o checklist acima e somente depois iniciar implementacao backend (ou iniciar backend em paralelo apenas apos congelar contratos e padroes de UI/estado).

