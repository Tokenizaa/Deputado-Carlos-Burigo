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

A base deverá suportar tanto a eleição de 2026 quanto eleições históricas necessárias para comparação, especialmente a eleição em que Burigo foi eleito.

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
- importar dados históricos;
- importar dados de 2026;
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

## 10. Estado operacional atualizado

**IE-02 — Modelo de Dados: CONCLUÍDA.** O modelo canônico foi aplicado no Supabase.

**IE-03 — Ingestão: EM EXECUÇÃO.** A carga de prova 2022/RS e 2026 foi concluída e validada fisicamente no Supabase. A próxima execução é a cobertura histórica e territorial.

**IE-03.7 — Cobertura histórica e territorial:** primeira onda definida para 2018, 2022 e 2026, todas as 27 UFs e os cargos de Presidente, Governador, Senador, Deputado Federal e Deputado Estadual/Distrital. O documento operacional é `docs/roadmap/IE-03.7-COBERTURA-HISTORICA-TERRITORIAL-2026-10-06.md`.

Nenhuma tela será criada enquanto a cobertura mínima da base eleitoral não estiver validada.
