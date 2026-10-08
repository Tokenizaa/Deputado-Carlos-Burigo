# ROADMAP CANÔNICO — CICLO ATUAL

**Estado operacional:** FASE 4 — SEGURANÇA E ACESSO  
**Situação do ciclo:** D7 — VALIDAÇÃO DOCUMENTAL FINAL CONCLUÍDA  
**Branch:** `main`

## Fonte de verdade

O estado atual do projeto é determinado por:

1. código em `main`;
2. banco/configuração reais, quando aplicável;
3. validações executadas;
4. documentação canônica derivada dessas evidências.

Documentos históricos não reabrem trabalho automaticamente.

## Fases

### FASE 0 — CONGELAMENTO
**CONCLUÍDA**

Marco: `docs/roadmap/FASE-0-CONGELAMENTO-ESTADO.md`

### FASE 1 — AUDITORIA GERAL
**CONCLUÍDA**

Marco: `docs/roadmap/FASE-1-AUDITORIA-GERAL.md`

### FASE 2 — BACKLOG REAL
**CONCLUÍDA / HISTÓRICA**

Marco: `docs/roadmap/FASE-2-BACKLOG-REAL.md`

Os identificadores internos usados nesse documento pertencem ao backlog histórico da Fase 2. Eles não são nomenclatura operacional atual.

### FASE 3 — VALIDAÇÃO DA BASE
**CONCLUÍDA**

Marco: `docs/roadmap/FASE-3-VALIDACAO-BASE.md`

Evidências posteriores registram a conclusão de build/lint e o smoke de produção.

### FASE 4 — SEGURANÇA E ACESSO
**EM ANDAMENTO**

Escopo canônico:

1. Autenticação
2. Proteção de senha
3. Admin bootstrap
4. RLS
5. RBAC
6. Convites
7. Auditoria
8. Permissões configuráveis por role, convite e usuário

### Estado reconciliado da Fase 4

- **Proteção de senha:** CONCLUÍDA no escopo implementado pelo commit `ca6e172`; inputs e bootstrap foram alinhados à política de 12 caracteres.
- **Autenticação:** implementação existente; validação de segurança complementar continua sendo auditada.
- **Admin bootstrap:** implementação existente; validação operacional ainda necessária.
- **RLS:** implementação existente; testes de autorização ainda necessários.
- **RBAC:** matriz e checks de endpoint existentes; lacuna de ADMIN no módulo `atuação` corrigida em `a688bfa`; testes por papel/ação ainda necessários.
- **Convites:** implementação existente; fluxo ponta a ponta ainda necessário.
- **Auditoria:** implementação existente; fluxo ponta a ponta ainda necessário.

Não classificar uma funcionalidade como ausente apenas porque a validação ainda não foi executada.

### Evolução de RBAC — estado atual

A Fase 4 agora inclui RBAC configurável. As roles continuam como presets e as permissões passam a ser persistidas no Supabase, com possibilidade de ajuste por role, convite e posteriormente por usuário. A especificação e o estado de execução estão em `docs/security/RBAC-CONFIGURAVEL-2026-09-22.md`.

Implementado nesta rodada: catálogo e tabelas de permissões com RLS, defaults das cinco roles, editor de permissões por role em Configurações e suporte backend a overrides de convite.

## Reconstrução documental — trabalho transversal

Estado do processo: **D0–D7 CONCLUÍDOS**.

Antes de avançar para novas funcionalidades da Fase 4, a documentação foi reconstruída e reconciliada de forma controlada:

- `docs/documentation/PLANO-RECONSTRUCAO-DOCUMENTAL-COMPLETA.md`
- `docs/documentation/INVENTARIO-DOCUMENTAL-COMPLETO.md`
- `docs/documentation/RECONSTRUCAO-DOCUMENTAL-LINHA-DO-TEMPO.md`
- `docs/documentation/MATRIZ-ESTADO-REAL.md`
- `docs/documentation/RECONCILIACAO-DOCUMENTAL.md`
- `docs/documentation/D6-RECONCILIACAO-ADRS-GOVERNANCA.md`
- `docs/documentation/D7-VALIDACAO-DOCUMENTAL-FINAL.md`
- `docs/roadmap/FASE-4-VALIDACAO-SEGURANCA-ACESSO.md`

Esse trabalho não substitui as fases do produto. Ele corrige a autoridade documental antes da continuidade da execução.

## INTELIGÊNCIA ELEITORAL — NOVO BLOCO CANÔNICO

A Inteligência Eleitoral foi formalizada como **módulo interno do Dashboard de Gabinete existente**. Não será criada aplicação, dashboard, autenticação ou área administrativa paralela.

Documento canônico:
- `docs/roadmap/INTELIGENCIA-ELEITORAL-CANONICA-2026-10-06.md`

### Arquitetura funcional

O módulo será organizado em três camadas:

1. **Dados** — eleições, candidatos, municípios, zonas, seções, resultados, eleitorado, comparecimento, abstenção e votos válidos/brancos/nulos.
2. **Inteligência** — métricas, evolução histórica, comparativos, rankings, concentração territorial, variações e anomalias.
3. **Investigação** — bate-papo privado baseado em consultas estruturadas aos dados, com respostas acompanhadas de evidências.

### Navegação prevista

`Dashboard de Gabinete → Inteligência Eleitoral`

Subáreas previstas:
- Panorama
- Evolução eleitoral
- Municípios
- Zonas eleitorais
- Seções
- Candidatos
- Comparativos
- Mapa eleitoral
- Investigação

A estrutura final deve respeitar o shell, roteamento, RBAC e padrões já existentes no Dashboard.

### Segurança

A Inteligência Eleitoral será privada e deverá reutilizar autenticação, autorização, RBAC, RLS e infraestrutura existentes. Não haverá API pública, rota pública ou indexação pública para esse módulo.


### IE-03 — Arquitetura de dados local-first / remoto autônomo

A Inteligência Eleitoral adota definitivamente a separação entre ingestão e runtime:

- **PostgreSQL local:** armazenamento completo dos dados brutos, staging, normalização, histórico, processamento e auditoria.
- **Supabase remoto:** somente a projeção filtrada/consolidada necessária para o funcionamento da Inteligência Eleitoral em produção.
- **Runtime:** nenhuma funcionalidade da plataforma poderá depender do banco local, arquivos locais, Docker local ou processos de ETL.

A cadeia canônica é:

`TSE → arquivos brutos locais → PostgreSQL local → validação → consolidação/filtragem → Supabase remoto → plataforma`

O remoto deve ser autônomo para o runtime. O local pode estar indisponível sem interromper a Inteligência Eleitoral.

### Reconstrução da base eleitoral — estado atual

A estratégia anterior de dump **remoto → local** foi descontinuada. O banco eleitoral local será zerado e reconstruído diretamente a partir dos arquivos oficiais TSE já adquiridos/reutilizados para 2018 e 2022, com preparação para 2026.

O próximo orquestrador deverá:

1. verificar a versão atual do código com `git pull --ff-only origin main` antes de qualquer execução;
2. verificar e catalogar os arquivos TSE locais;
3. validar tamanho, ZIP íntegro, entradas esperadas, ano, UF, turno e cargo;
4. bloquear a carga se qualquer arquivo obrigatório estiver ausente ou inconsistente;
5. zerar somente as tabelas eleitorais do PostgreSQL local;
6. aplicar o modelo eleitoral local;
7. executar as cargas 2018 e 2022 diretamente dos arquivos TSE;
8. validar cobertura e reconciliação antes de considerar a carga concluída;
9. publicar futuramente apenas o conjunto remoto necessário ao runtime.

Nenhum dado remoto será usado como fonte para reconstrução local.

### IE-03 — Reconciliação local × GitHub antes da validação
**PRÉ-CONDIÇÃO OPERACIONAL — CONCLUÍDA PARA A PROVA 2022/2026**

Antes de qualquer nova validação, aquisição adicional ou carga no Supabase, o estado local usado pelo agente e o estado publicado em `origin/main` devem ser reconciliados. Nenhum `reset`, `clean`, `checkout` ou descarte de trabalho local será executado sem inspeção prévia. O objetivo é preservar trabalho local do agente, identificar commits locais ainda não publicados e só então alinhar o working tree à `main` canônica.

Procedimento obrigatório:
1. inspecionar `git status --short --branch`;
2. inspecionar `git log --oneline --decorate -n 20`;
3. inspecionar `git fetch origin` e comparar `HEAD` com `origin/main`;
4. identificar separadamente commits locais, alterações não commitadas e arquivos brutos de aquisição;
5. preservar e integrar somente o que for pertinente ao IE-03;
6. confirmar working tree reconciliado antes de executar o validador.

### Estado operacional da Inteligência Eleitoral

- **IE-01 — Fundação: CONCLUÍDA.** Auditoria do Dashboard, ponto de inserção, autenticação, RBAC existente e fontes eleitorais registrados em `docs/roadmap/IE-01-FUNDACAO-INTELIGENCIA-ELEITORAL-2026-10-06.md`.
- **IE-02 — Modelo de dados: CONCLUÍDA.** Modelo lógico registrado em `docs/roadmap/IE-02-MODELO-DADOS-INTELIGENCIA-ELEITORAL-2026-10-06.md` e migração física aplicada no Supabase em `20261006201443_create_electoral_intelligence_model`.
- **IE-03 — Ingestão:** EM EXECUÇÃO. IE-03.1 (descoberta) CONCLUÍDA; IE-03.2 (aquisição da primeira rodada 2022) CONCLUÍDA; IE-03.3 (leitura/contrato) CONCLUÍDA; IE-03.4 (validação cruzada do caso de prova) CONCLUÍDA; IE-03.5 (normalização do caso de prova) CONCLUÍDA; **IE-03.6 — carga física de prova: CONCLUÍDA**. A carga idempotente foi executada no Supabase e validada fisicamente: 6.170 fatos nominais por seção totalizando **33.611 votos** em 2022; 522 fatos candidato/município-zona totalizando **33.611 votos**; 522 fatos de apuração município/zona; 27.201 fatos de apuração por seção; e 1 fato EA20 2026 totalizando **21.038 votos** para Carlos Búrigo 15140. Os cinco `electoral_import_runs` estão `COMPLETED`, com `rows_rejected=0` e `rows_loaded` coerente com o volume físico. O caso de prova cobre cinco camadas e comprova a cadeia TSE → aquisição → normalização → Supabase. Carlos Búrigo continua sendo caso de prova, não filtro da ingestão. Documento geral: `docs/roadmap/IE-03-INGESTAO-TSE-2026-10-06.md`.
- ### IE-03.5 — Gate estrutural e autorização de carga física

A leitura dos arquivos de apuração 2022 confirmou os schemas oficiais:

- detalhe_votacao_munzona_2022: eleitorado, comparecimento, abstenção, votos válidos, brancos, nulos, anulados e metadados de totalização por município/zona/cargo;
- detalhe_votacao_secao_2022: eleitorado, comparecimento, abstenção, votos nominais, brancos, nulos, legenda e situação da seção por seção/cargo.

A reconciliação contrato ↔ schema ↔ loader foi concluída sem criar tabela paralela. O modelo foi ajustado para representar fatos agregados por candidato em `electoral_results_totals`, usando `candidate_id` e `candidate_votes`, e as políticas de escrita das 14 tabelas eleitorais foram separadas por operação.

**Gate:** CONCLUÍDO. A carga física idempotente foi executada após a reconciliação local × GitHub e validada diretamente no Supabase. Os fatos físicos e os cinco `electoral_import_runs` estão consistentes, sem rejeições. **A próxima operação é IE-03.7 — cobertura histórica e territorial.**

**IE-03.7 — Cobertura histórica e territorial: EM EXECUÇÃO.** O escopo canônico está restrito ao **Rio Grande do Sul (RS)**. A primeira onda cobre 2018, 2022 e 2026 **exclusivamente para Deputado Estadual do RS**, com território RS → municípios → zonas → seções e todos os candidatos. A prova 2018/RS foi executada e fechada: município/zona e seção totalizaram **34.322 votos** para Carlos Búrigo 15140, abrangendo 497 municípios e 165 zonas. A próxima operação é consolidar 2018/RS no modelo eleitoral e completar 2022/RS e 2026/RS. Documento: `docs/roadmap/IE-03.7-COBERTURA-HISTORICA-TERRITORIAL-2026-10-06.md`.

**IE-04 — Inteligência:** planejada.
- **IE-05 — Interface:** planejada.
- **IE-06 — Investigação:** planejada.
- **IE-07 — Validação:** planejada.

**Regra:** nenhuma interface de inteligência será criada antes da definição e validação da camada de dados necessária.

## Próxima sequência

A reconstrução documental está encerrada.

**Trabalho atual: FASE 4 — validação e conclusão de Segurança e Acesso**

Depois da conclusão objetiva da FASE 4, o próximo bloco será definido a partir do estado real atualizado.

## Regra definitiva

A sequência operacional é somente:

`FASE 0 → FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5 → ...`

Backlogs e identificadores históricos permanecem como histórico e não definem a próxima fase.


## Open Graph — plano específico

**FASE 1 — ESPECIFICAÇÃO E CANONIZAÇÃO: CONCLUÍDA**

Marco: `docs/audits/OPEN-GRAPH-CANONICO-2026-09-22.md`

A Fase 1 consolidou o contrato canônico, a cadeia de fallback, a matriz de rotas, o tratamento de notícias, as falhas conhecidas e a decisão de manter o Worker existente. Nenhuma alteração funcional das fases seguintes foi antecipada.

**FASE 2 — IMPLEMENTAÇÃO SERVER-SIDE E FALLBACK: CONCLUÍDA**

Execução registrada no documento `docs/audits/OPEN-GRAPH-CANONICO-2026-09-22.md`, com implementação no Worker existente, fallback estático obrigatório, URL absoluta, MIME derivado, tratamento de falhas, rotas institucionais adicionais e resolução de notícias por `?noticia=slug`.

Commits principais: `cf51dd5` e `aa6b5c8`.

**FASE 3 — UNIFICAÇÃO DO FRONTEND E CMS: CONCLUÍDA**

Execução registrada em `docs/audits/OPEN-GRAPH-CANONICO-2026-09-22.md`. O SEO client-side agora usa o fallback canônico, respeita `url`, mantém imagem mesmo sem configuração global e o CMS valida JPEG/PNG e dimensões exatas de 1200×630 antes do upload.

Commits: `eb5a0d5` e `b9ca837`.

**FASE 4 — TESTES E VALIDAÇÃO AUTOMATIZADA: CONCLUÍDA**

Implementação e execução registradas em docs/audits/OPEN-GRAPH-CANONICO-2026-09-22.md: o teste legado foi substituído por testes que importam a implementação real do Worker, incluindo fallback, conteúdo específico, notícia, MIME, dimensões, falhas e asset físico. O workflow .github/workflows/open-graph-validation.yml também foi configurado.

Evidência local de 2026-09-22: lint sem erros; typecheck sem erros; build concluído; suíte unitária com **6 arquivos e 55 testes aprovados**; asset físico confirmado como PNG 1200×630.

Observação: o ambiente local reportou 6 vulnerabilidades de dependências e um aviso de chunks acima de 500 kB no build. Nenhum deles causou falha da validação de Open Graph e nenhum foi alterado nesta fase.

**Próximo passo:** FASE 5 — VALIDAÇÃO REAL EM PRODUÇÃO E ENCERRAMENTO.

## Atualização 2026-10-08 — UX e refatoração da Inteligência Eleitoral

O contrato visual está em `docs/design/INTELIGENCIA-ELEITORAL-UX-2026-10-08.md`; a decisão arquitetural está em ADR-0004. A auditoria do frontend pode iniciar imediatamente. O trabalho é limitado a cinco fases: (1) auditoria/contrato, (2) fundação/seletor, (3) dashboard analítico, (4) chat/relatórios, (5) validação/entrega. Agrupar tarefas relacionadas; evitar microfases. Toda fase precisa de testes, evidências, commit e integração em main, sem branches concluídas abandonadas. Dashboard funcional e insights ligados aos dados permanecem condicionados aos gates de cobertura eleitoral, incluindo IE-03.7. Não mascarar lacunas com dados simulados.


## Inteligência Eleitoral — auditoria preparatória IE-05.0 (2026-10-08)

**Fase 1 — Auditoria e contrato: CONCLUÍDA documentalmente.** A auditoria estática de `main` foi registrada em `docs/design/INTELIGENCIA-ELEITORAL-UX-2026-10-08.md`. O ponto de entrada, a navegação administrativa, a tela existente, o endpoint do Worker, a projeção Supabase, os contratos compartilhados e as lacunas de UX foram identificados. O ADR-0004 já existe e formaliza dashboard analítico principal + chat flutuante independente; não foi criado um ADR duplicado.

A fase não alterou código funcional: os contratos de contexto/apresentação já existem e têm testes, e criar um estado concorrente antes de definir sua integração seria duplicação. A próxima etapa é **Fase 2 — Fundação e seleção**, integrando os contratos existentes ao seletor e ao estado compartilhado. O gate IE-03.7 segue bloqueando visualizações e insights que dependam de cobertura não validada. Não classificar a cobertura como completa com base apenas na auditoria do frontend.

Evidência disponível antes desta atualização documental: em 2026-10-08, no commit `e883c21`, o teste de relatório passou (4/4), a suíte completa passou (12 arquivos / 96 testes) e o deploy Cloudflare foi concluído. Esta atualização documental não afirma execução de testes após o novo commit.
