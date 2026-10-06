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
- **IE-03 — Ingestão:** EM EXECUÇÃO. IE-03.1 (descoberta) CONCLUÍDA; IE-03.2 (aquisição da primeira rodada 2022) CONCLUÍDA; IE-03.3 (leitura/contrato) CONCLUÍDA com prova estrutural executada. A prova oficial confirmou **33.611 votos em 2022** para Carlos Búrigo 15140 em RS/1º turno/Deputado Estadual tanto na camada município/zona quanto na camada seção, com `totals_match=true`; confirmou também **21.038 votos em 2026** no EA20 oficial do TSE. O schema distinto de `VOTACAO_SECAO` foi corrigido no validador. Próxima etapa: **IE-03.5 — normalização**, precedida pela formalização do contrato de mapeamento TSE → 14 tabelas do IE-02. Carlos Búrigo continua sendo caso de prova, não filtro da ingestão. Para 2026, a divulgação oficial do TSE inclui EA20, EA16, EA18 e demais arquivos técnicos; para 2022, o Portal de Dados Abertos disponibiliza votação nominal município/zona, votação por seção, votação partidária e detalhes de apuração. Documento: `docs/roadmap/IE-03-INGESTAO-TSE-2026-10-06.md`.
- **IE-04 — Inteligência:** planejada.
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
