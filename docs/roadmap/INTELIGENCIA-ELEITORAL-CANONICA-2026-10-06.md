# INTELIGÊNCIA ELEITORAL — PLANO CANÔNICO

**Estado:** IE-01 — FUNDAÇÃO CONCLUÍDA  
**Módulo:** Dashboard de Gabinete existente  
**Data:** 2026-10-06

## 1. Regra arquitetural definitiva

A Inteligência Eleitoral **não será uma nova aplicação, novo dashboard ou área administrativa paralela**.

Ela será um módulo privado instalado dentro do **Dashboard de Gabinete já existente**, reutilizando:

- autenticação existente;
- autorização e RBAC existentes;
- layout e navegação existentes;
- infraestrutura e padrões técnicos existentes;
- banco Supabase existente;
- padrões de segurança, auditoria e permissões já adotados pelo gabinete.

Não será criada uma segunda autenticação nem uma segunda estrutura administrativa.

## 2. Objetivo

Transformar o bate-papo atual em uma plataforma interna de inteligência eleitoral capaz de:

1. organizar dados eleitorais oficiais;
2. analisar o desempenho eleitoral de Carlos Burigo;
3. comparar eleições, candidatos e territórios;
4. permitir investigação orientada por dados;
5. apresentar evidências antes de qualquer interpretação.

O objetivo inicial é **entender o resultado eleitoral**, e não produzir conteúdo de campanha, persuasão ou opinião política.

## 3. Três camadas da inteligência

### Camada 1 — Dados

Base estruturada para eleições e resultados:

- eleição;
- cargo;
- candidato;
- partido/federação;
- UF;
- município;
- zona eleitoral;
- seção eleitoral;
- votos;
- eleitorado;
- comparecimento;
- abstenção;
- votos válidos;
- brancos;
- nulos.

A hierarquia analítica deverá permitir o drill-down:

**Estado → Município → Zona → Seção → Resultado.**

A base deverá suportar 2026 e as eleições históricas necessárias para comparação, inicialmente **2018 e 2022**, sempre no escopo **RS + Deputado Estadual**.

### Camada 2 — Inteligência

Métricas e análises estruturadas:

- total de votos;
- participação;
- posição;
- crescimento ou queda;
- variação absoluta e percentual;
- concentração territorial;
- distribuição geográfica;
- rankings;
- comparação entre candidatos;
- comparação entre eleições;
- identificação de concentrações, perdas e mudanças relevantes;
- detecção de anomalias para investigação.

Toda métrica deverá ser reproduzível a partir dos dados armazenados.

### Camada 3 — Investigação

O bate-papo passa a ser uma interface privada de investigação.

Fluxo canônico:

**Pergunta → interpretação estruturada → consulta aos dados → resultado numérico → análise → resposta com evidências.**

O modelo não deverá inventar números nem apresentar hipótese como fato.

As respostas deverão distinguir:

- **Fato:** informação diretamente presente na base;
- **Cálculo:** resultado derivado dos dados;
- **Comparação:** diferença entre conjuntos de dados;
- **Hipótese:** explicação possível que exige investigação adicional.

## 4. Estrutura dentro do Dashboard de Gabinete

A navegação será incorporada ao dashboard existente:

- Dashboard
- Conteúdo
- Notícias
- Agenda
- Atuação
- Usuários
- Configurações
- **Inteligência Eleitoral**

Dentro de Inteligência Eleitoral:

- Panorama
- Evolução eleitoral
- Municípios
- Zonas eleitorais
- Seções
- Candidatos
- Comparativos
- Mapa eleitoral
- Investigação

A lista é uma estrutura funcional inicial. A implementação deverá respeitar a arquitetura real encontrada no repositório, sem duplicar layouts ou criar infraestrutura paralela.

## 5. Segurança

A Inteligência Eleitoral será privada.

Regras mínimas:

- nenhuma rota pública;
- nenhuma API pública de inteligência;
- nenhuma indexação por mecanismos de busca;
- autenticação pelo mecanismo existente;
- autorização pelo RBAC existente;
- autorização também no servidor;
- RLS no Supabase quando aplicável;
- dados eleitorais privados e análises internas não devem ser expostos por componentes públicos;
- o chat não será disponibilizado fora do Dashboard de Gabinete.

A permissão específica da Inteligência Eleitoral deverá ser definida no contexto do RBAC existente, sem criar um sistema de autorização independente.

## 6. Fases de implementação

### IE-01 — Fundação

1. auditar a arquitetura atual do Dashboard de Gabinete;
2. identificar o layout, navegação e roteamento existentes;
3. identificar o ponto correto de inserção do novo módulo;
4. identificar o RBAC e as permissões existentes;
5. definir a permissão da Inteligência Eleitoral;
6. identificar fontes eleitorais oficiais;
7. definir a estratégia de ingestão;
8. registrar decisões arquiteturais antes da criação das telas.

**Regra:** nesta etapa não criar dashboard paralelo nem duplicar autenticação.

### IE-02 — Modelo de dados

Modelar no Supabase:

- eleições;
- candidatos;
- municípios;
- zonas;
- seções;
- resultados eleitorais;
- metadados das fontes;
- mecanismos de comparação.

O modelo deverá ser genérico o suficiente para suportar outras eleições e candidatos sem reconstrução da estrutura.

### IE-03 — Ingestão e validação

- obter dados de fontes oficiais;
- importar dados históricos de **RS + Deputado Estadual**;
- importar dados de 2026 para **RS + Deputado Estadual**;
- preservar a hierarquia territorial;
- validar totais;
- registrar origem e versão dos dados;
- permitir reprocessamento controlado.

### IE-04 — Inteligência

Implementar as métricas e análises da Camada 2 sobre a base validada.

Nenhum indicador deverá depender de números digitados manualmente na interface.

### IE-05 — Interface

Adicionar ao Dashboard de Gabinete as páginas da Inteligência Eleitoral, reutilizando o shell existente.

Prioridade inicial:

1. Panorama;
2. Evolução eleitoral;
3. Municípios;
4. Candidatos;
5. Comparativos;
6. Mapa;
7. Zonas;
8. Seções.

A ordem poderá ser ajustada após IE-02 e IE-03 conforme disponibilidade e qualidade dos dados.

### IE-06 — Investigação

Transformar o bate-papo em interface de investigação baseada na base estruturada.

O chat deverá:

- interpretar perguntas;
- consultar dados permitidos;
- apresentar números;
- mostrar o recorte utilizado;
- apontar a evidência;
- permitir aprofundamento por território, eleição ou candidato.

### IE-07 — Validação

Validar:

- autenticação;
- RBAC;
- RLS;
- isolamento das rotas;
- consistência dos dados;
- totais eleitorais;
- comparações;
- desempenho;
- respostas do chat;
- rastreabilidade das evidências;
- fluxo completo dentro do Dashboard existente.

## 7. Primeira análise de negócio

A primeira investigação deverá responder, com dados oficiais:

1. Quantos votos Burigo recebeu em 2026?
2. Onde esses votos foram obtidos?
3. Quais municípios concentraram o resultado?
4. Como o desempenho mudou em relação à eleição anterior em que foi eleito?
5. Quais municípios cresceram?
6. Quais municípios perderam votos?
7. Como o desempenho se compara aos principais candidatos do mesmo cargo?
8. Como o resultado se distribui por zona eleitoral?
9. Onde existem diferenças relevantes por seção?
10. Quais padrões merecem investigação posterior?

Essas perguntas são o primeiro conjunto de casos de uso; não constituem hipóteses sobre as causas do resultado.

## 8. Regras de implementação

1. Não criar aplicação paralela.
2. Não criar dashboard paralelo.
3. Não duplicar autenticação.
4. Não duplicar RBAC.
5. Não criar tabelas sem relação com o modelo canônico.
6. Não criar telas antes de validar a base necessária para elas.
7. Não hardcodar resultados eleitorais.
8. Não transformar correlação em causalidade.
9. Não permitir que o LLM invente dados.
10. Toda análise numérica deve ser reproduzível.
11. Toda informação eleitoral importada deve manter sua fonte.
12. A implementação deve seguir o padrão técnico já existente no projeto.

## 9. Resultado da IE-01

A auditoria da arquitetura existente está concluída. O módulo será inserido no `AdminLayout`/`AdminWorkspace` existente, usando a rota `/admin#<modulo>` e o mecanismo de autenticação/RBAC já adotado.

A fonte primária de dados definida é o Portal de Dados Abertos do TSE. A documentação detalhada da fundação está em `docs/roadmap/IE-01-FUNDACAO-INTELIGENCIA-ELEITORAL-2026-10-06.md`.


## 11. Arquitetura de dados — local completo, remoto autônomo

A arquitetura operacional definitiva da Inteligência Eleitoral separa **repositório de dados** de **ambiente de execução da aplicação**.

### PostgreSQL local — fonte completa de ingestão

O ambiente local é o repositório completo dos dados eleitorais e pode conter:

- arquivos brutos oficiais do TSE;
- staging;
- dados normalizados;
- histórico completo;
- fatos nominais;
- fatos de totalização;
- dados auxiliares;
- cruzamentos;
- artefatos de auditoria.

O armazenamento local existe para aquisição, processamento, validação, auditoria e reconstrução dos datasets publicados.

### Supabase remoto — fonte exclusiva de runtime

A plataforma em produção **não pode depender do PostgreSQL local**.

Toda funcionalidade da Inteligência Eleitoral deve funcionar integralmente usando somente os dados publicados no Supabase remoto. O banco local pode estar desligado, indisponível ou em processamento sem interromper a operação da plataforma.

Portanto:

> **Local = fonte completa, processamento e auditoria.**
>
> **Remoto = fonte exclusiva de dados para a aplicação em produção.**

### Regra de publicação

O remoto não receberá automaticamente toda a base bruta.

Antes da publicação, os dados serão:

1. normalizados;
2. validados;
3. consolidados;
4. filtrados conforme as necessidades reais da Inteligência Eleitoral;
5. publicados no Supabase remoto;
6. validados novamente no remoto.

Todo dado necessário para uma funcionalidade de produção deve existir no remoto. Nenhuma consulta de runtime poderá exigir acesso ao banco local.

### Regra de armazenamento

Os arquivos brutos do TSE permanecem no ambiente local mesmo após a publicação. Eles são a matéria-prima para reprocessamento e reconstrução futura.

A remoção de dados eleitorais do Supabase remoto somente poderá ocorrer depois que o equivalente necessário para produção estiver validado no armazenamento local e, quando aplicável, republicado em formato filtrado/consolidado.

## 12. Nova estratégia de reconstrução da base

A carga remoto → local atualmente em execução não é mais a estratégia canônica e deverá ser interrompida.

A reconstrução passa a seguir:

**TSE → arquivos brutos locais → PostgreSQL local → validação → consolidação/filtragem → Supabase remoto.**

O banco eleitoral local será zerado e reconstruído a partir dos arquivos oficiais TSE já adquiridos ou novamente adquiridos, preservando a mesma origem oficial dos dados.

A primeira reconstrução cobre exclusivamente:

- RS;
- Deputado Estadual;
- 1º turno;
- 2018;
- 2022;
- 2026.

A carga não será filtrada por Carlos Búrigo. Todos os candidatos necessários ao funcionamento da inteligência permanecem incluídos no dataset local e o remoto receberá somente a projeção analítica necessária à aplicação.

## 13. Regra de independência operacional

É proibido implementar qualquer funcionalidade da Inteligência Eleitoral que, em produção, dependa de:

- PostgreSQL local;
- Docker local;
- arquivos locais;
- scripts de ingestão;
- diretórios de staging;
- máquinas de desenvolvimento;
- processos de ETL em execução.

O ETL local é um processo de **publicação**, não um serviço de runtime.


## 10. Estado operacional atualizado

**IE-02 — Modelo de Dados: CONCLUÍDA.** O modelo canônico foi aplicado no Supabase.

**IE-03 — Ingestão: EM EXECUÇÃO.** A estratégia operacional foi redefinida para ingestão completa no PostgreSQL local e publicação filtrada no Supabase remoto. A reconstrução da base será feita diretamente a partir dos arquivos oficiais do TSE.

**IE-03.7 — Cobertura histórica e territorial:** EM EXECUÇÃO para RS / Deputado Estadual / 1º turno / 2018, 2022 e 2026. A carga local será reconstruída do zero e validada antes de qualquer publicação remota.

Nenhuma tela será criada enquanto a cobertura mínima da base eleitoral não estiver validada.

## Aditivo de experiência visual — 2026-10-08

Seguir `docs/design/INTELIGENCIA-ELEITORAL-UX-2026-10-08.md` e ADR-0004. Dashboard analítico principal e chat flutuante independente compartilham contexto e resultados estruturados. A seleção de candidato/eleição atualiza o cenário; gráficos, mapas, tabelas e filtros permitem drill-down. A auditoria pode começar já; as visualizações reais devem respeitar os gates de cobertura existentes. Refatoração agrupada em até cinco fases, com testes, evidências, commits e merge em main.


## Auditoria de implementação — FASE IE-05.0 (2026-10-08)

Auditoria estática do código publicado em `main` no commit `e883c21`. Este registro descreve o código inspecionado; não afirma validação visual em navegador nem cobertura completa do dataset.

### Mapa real do frontend

- `src/App.tsx` mantém a entrada administrativa existente por meio de `AdminLayout` e `AdminWorkspace`; não há justificativa para criar outro dashboard ou roteador.
- `src/components/admin/AdminLayout.tsx` já inclui Inteligência Eleitoral na sidebar e um submenu para “Painel Eleitoral”.
- `src/components/admin/AdminWorkspace.tsx` verifica a permissão do módulo e encaminha para `AdminElectoralIntelligenceTab`.
- `src/components/admin/AdminElectoralIntelligenceTab.tsx` é a superfície atual: entrada numérica de candidato, segundo candidato para comparação, escopo fixo RS / Deputado Estadual / 1º turno, quatro áreas de perguntas, formulário de consulta embutido, visualização tabular/JSON, metodologia e evidências, CSV, relatório imprimível e síntese de voz.
- As consultas da interface usam `POST /api/admin/electoral/intelligence`; o handler existente em `src/worker.ts` delega para `server/electoralIntelligence.ts`, que consulta a projeção eleitoral do Supabase. Esta auditoria não valida a cobertura física atual dessa projeção em produção.

### Contratos e lacunas confirmadas

- `src/contracts/electoralContext.ts` já define o contexto de workspace, candidato, eleições e cargos autorizados; `src/contracts/electoralPresentation.ts` já define artefatos de apresentação e famílias de templates. Os testes de apresentação exercitam esses contratos.
- A interface atual não conecta esses contratos a um seletor compartilhado de candidato/eleição/filtros.
- A seleção atual aceita número, não oferece busca por nome nem modal de candidatos e não oferece seletor de eleição; o escopo eleitoral aparece fixo.
- O chat/perguntas está incorporado à página, não em painel flutuante independente.
- A apresentação atual mostra tabelas ou JSON conforme o formato retornado. Não há renderer de gráficos ou mapas conectado ao contrato de apresentação nessa tela; os templates definidos, isoladamente, não comprovam visualizações operacionais.
- Há exportação CSV e relatório HTML imprimível, além de síntese de voz. Isso não equivale a uma experiência completa de relatório compartilhado nem a dashboard visual interativo.
- A autorização de módulo reutiliza `can(..., 'inteligencia-eleitoral')`; o endpoint e a política de dados devem continuar submetidos às verificações de autenticação/autorização existentes. Esta auditoria não altera nem substitui a validação de segurança.

### Decisão de preparação

Nenhuma alteração funcional foi antecipada nesta fase. Os contratos compartilhados já existem e estão testados; criar outro estado/contrato antes de mapear sua integração duplicaria conceitos. A próxima fase deve conectar a interface ao contrato existente e definir um único estado de contexto para candidato, eleição, turno, cargo, UF e filtros. O seletor e as visualizações devem usar apenas registros e resultados reais disponíveis, com estados explícitos para cobertura ausente ou parcial.

O gate IE-03.7 permanece obrigatório. A auditoria de código não autoriza afirmar que a cobertura histórica/territorial está completa e não autoriza preencher lacunas com dados simulados.

### Validação observada

Após sincronizar `main` no commit `e883c21`, a execução local registrada em 2026-10-08 passou no teste específico de relatório (4/4) e na suíte completa (12 arquivos, 96 testes). O deploy Cloudflare também foi concluído nessa execução. Essas evidências precedem esta atualização documental; nenhum teste novo é alegado para a alteração de documentação.

### Próxima fase do contrato visual

**Fase 2 — Fundação e seleção:** integrar o contexto compartilhado já definido, criar seleção pesquisável de candidato e seleção de eleição/turno dentro do shell atual, preservar RBAC e acrescentar testes. Não iniciar gráficos, mapas ou insights que dependam de cobertura ainda não validada.
