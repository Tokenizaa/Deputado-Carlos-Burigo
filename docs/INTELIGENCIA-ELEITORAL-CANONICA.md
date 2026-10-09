# Inteligência Eleitoral — Especificação Canônica

## Status

- Estado: CANÔNICO / EM EXECUÇÃO
- Escopo atual: Deputado Estadual — Rio Grande do Sul
- Eleições: 2018, 2022 e 2026, tratadas separadamente e comparáveis
- Fonte factual: dados oficiais do TSE preservados e processados localmente
- Runtime de produção: Supabase remoto
- Destino: camada privada de Inteligência Eleitoral dentro do dashboard existente do gabinete
- Modelo de produto: plataforma de inteligência parametrizável por candidato, eleição e contexto de cliente/workspace
- Carlos Burigo: primeiro cliente/contexto de uso, não entidade fixa do motor
- Última atualização: 2026-10-08

## 1. Objetivo

Transformar os dados eleitorais oficiais em uma camada de inteligência para apoiar análise e decisão.

A Inteligência Eleitoral não é um dashboard público de resultados. É uma capacidade interna do dashboard existente e combina:

1. dados factuais;
2. indicadores calculados;
3. análises territoriais e competitivas;
4. visualizações;
5. chatbot analítico;
6. geração de relatórios e artefatos exportáveis.

## 2. Arquitetura canônica dos bancos

A arquitetura separa explicitamente origem/processamento de publicação/runtime.

    TSE / dados oficiais
            |
            v
    +-----------------------------+
    | BANCO LOCAL                 |
    | fonte de processamento      |
    | RAW / NORMALIZED / AUDIT    |
    +-------------+---------------+
                  |
                  | processamento determinístico
                  v
    +-----------------------------+
    | MOTOR ANALÍTICO             |
    | DATA -> INDICADOR ->        |
    | INTELIGÊNCIA                |
    +-------------+---------------+
                  |
                  | publicação
                  v
    +-----------------------------+
    | SUPABASE REMOTO             |
    | PROJEÇÃO ANALÍTICA          |
    +-------------+---------------+
                  |
                  v
       DASHBOARD + CHATBOT

### Regra fundamental

LOCAL = fonte de dados e processamento.

REMOTO = fonte de dados da aplicação em produção.

A aplicação em produção não pode depender do PostgreSQL local.

O local pode conter todos os dados necessários para reconstrução, auditoria e cálculo. O remoto recebe somente aquilo que a aplicação precisa consultar.

## 3. Banco LOCAL — contrato

O banco local existe para preservar e processar a fonte oficial.

### 3.1 RAW

Responsável pela preservação dos arquivos oficiais do TSE.

Inclui:

- ZIP original;
- CSV original;
- nome do arquivo;
- ano;
- UF;
- dataset;
- URL oficial;
- data de download;
- SHA-256;
- tamanho;
- metadados da origem.

Os arquivos RAW são imutáveis depois de baixados.

### 3.2 NORMALIZED

Responsável pela representação estruturada dos dados TSE para processamento:

- eleições;
- municípios;
- candidatos;
- resultados nominais;
- turno;
- cargo;
- UF;
- zona quando disponível.

### 3.3 AUDIT

Responsável por provar que o processamento está correto:

- execução de importação;
- arquivo de origem;
- checksum;
- registros lidos/carregados/rejeitados;
- validações;
- baselines;
- divergências;
- status.

### 3.4 O que NÃO é responsabilidade do local

Não deve conter dependência de runtime da aplicação, sessão de usuários, permissões do dashboard ou estado de UI.

## 4. Banco REMOTO / SUPABASE — contrato

O Supabase é o banco operacional da aplicação.

O remoto não é:

- depósito dos ZIPs/CSVs TSE;
- espelho integral do banco local;
- warehouse bruto;
- staging de importação TSE.

O remoto deve sustentar diretamente:

- Visão Geral;
- Histórico;
- Território;
- Candidatos / Concorrência;
- chatbot;
- filtros e drill-down;
- rastreabilidade da publicação.

Depois de publicada uma projeção:

- dashboard consulta Supabase;
- chatbot consulta Supabase/camada analítica de produção;
- nenhuma requisição do usuário consulta banco local;
- nenhuma tela depende de arquivo local.

## 5. Fluxo oficial de dados

    TSE
     ↓
    RAW LOCAL
     ↓
    NORMALIZED LOCAL
     ↓
    AUDIT LOCAL
     ↓
    MOTOR ANALÍTICO
     ↓
    VALIDAÇÃO
     ↓
    PROJEÇÃO ANALÍTICA
     ↓
    SUPABASE
     ↓
    DASHBOARD + CHATBOT

O fluxo é unidirecional.

## 6. Separação entre dado, indicador e inteligência

### DATA

Fato oficial:

- votos;
- candidato;
- município;
- zona;
- eleição;
- ano.

### INDICATOR

Cálculo reproduzível:

- total;
- participação;
- crescimento;
- ranking;
- concentração;
- diferença;
- cobertura;
- força territorial;
- pressão competitiva.

### INTELLIGENCE

Interpretação estruturada:

- força territorial;
- perda territorial;
- crescimento;
- oportunidade;
- concentração;
- competição.

A IA nunca substitui o cálculo.

## 7. Modelo de produto: candidato não é o sistema

O sistema deve ser construído como plataforma de inteligência eleitoral, não como uma aplicação fixa para Carlos Burigo.

Carlos Burigo é o primeiro cliente/contexto de uso.

O motor deve aceitar, como contexto explícito:

    workspace_id
    candidate_id
    election_id
    office_id
    state
    round
    period

O candidato principal é uma configuração do contexto do cliente, não uma constante arquitetural.

A mesma função analítica, skill, intent e template deve funcionar para qualquer candidato compatível com o escopo suportado.

## 8. Comparação entre candidatos

Comparação é capacidade nativa.

Um candidato não deve ser codificado como “o concorrente” permanente de outro.

A relação competitiva é calculada no contexto:

    candidate A
       ↓
    comparação
       ↓
    candidate B / C / D

O mesmo mecanismo deve permitir:

- ranking;
- gap de votos;
- diferença de participação;
- crescimento;
- presença territorial;
- sobreposição;
- pressão competitiva;
- contexto competitivo.

## 9. Cliente / workspace / white label

O white label é uma camada comercial acima do núcleo eleitoral.

Exemplo:

    CLIENTE / WORKSPACE
        |
        +-- identidade visual
        +-- permissões
        +-- candidato principal
        +-- candidatos comparáveis
        +-- eleições/escopos autorizados

A plataforma pode atender hoje o gabinete de Carlos Burigo e amanhã outro cliente, por exemplo um gabinete de José da Silva, sem duplicar o motor analítico.

### Regra

Capacidade da plataforma ≠ permissão do cliente.

A plataforma pode saber comparar candidatos; um workspace só pode consultar candidatos, eleições e escopos autorizados.

Não implementar neste momento uma arquitetura SaaS multi-tenant complexa apenas por antecipação comercial. O requisito atual é manter o núcleo desacoplado de Carlos Burigo e preparado para parametrização futura.

## 10. Quatro áreas funcionais

### 10.1 Visão Geral

Responder: qual é a situação eleitoral geral do candidato?

### 10.2 Histórico

Responder: como o desempenho mudou entre eleições?

### 10.3 Território

Responder: onde o candidato é forte, fraco, cresce, perde espaço ou apresenta oportunidade?

### 10.4 Candidatos / Concorrência

Responder: contra quem o candidato compete e como essa competição se distribui?

## 11. Duas superfícies de interface

A Fase 9 possui duas superfícies sobre a mesma inteligência:

    INTELIGÊNCIA ELEITORAL
             |
       +-----+-----+
       |           |
   DASHBOARD      CHAT
       |           |
   relatórios    conversa
   gráficos      voz
   tabelas       artefatos
   mapas         downloads

### 11.1 Interface Visual

Deve permitir:

- exploração;
- comparação;
- filtros;
- drill-down;
- gráficos;
- tabelas;
- mapas;
- metodologia;
- fontes;
- exportação para PDF;
- download de dados quando apropriado.

O PDF deve ser relatório estruturado, não captura de tela.

### 11.2 Chatbot

Deve permitir:

- linguagem natural;
- conversa guiada;
- contexto de sessão;
- gráficos;
- tabelas;
- mapas;
- metodologia;
- fontes;
- downloads;
- voz.

Dashboard e chatbot devem apresentar o mesmo resultado para o mesmo escopo.

## 12. Presentation Contract

Os resultados analíticos devem ser independentes da superfície de apresentação.

Tipos de artefato:

- text;
- kpi;
- chart;
- table;
- map;
- comparison;
- timeline;
- report;
- download.

Fluxo:

    RESULTADO ESTRUTURADO
            ↓
    PRESENTATION CONTRACT
            ↓
       +----+----+
       |         |
    DASHBOARD   CHATBOT
       |         |
     visual    visual
       +----+----+
            ↓
       PDF / DADOS

Não criar um template por pergunta. Criar uma biblioteca reutilizável de padrões analíticos.

## 13. Templates e trabalho da LLM

Como a maior parte dos dados é estável depois da publicação oficial, a plataforma deve pré-construir:

- funções;
- intents;
- skills;
- métodos;
- templates;
- estruturas de tabelas;
- gráficos;
- mapas;
- relatórios;
- contratos de resposta.

A LLM deve fazer principalmente:

1. compreender a linguagem;
2. resolver intenção e parâmetros;
3. explicar o resultado;
4. conduzir o usuário;
5. adaptar a linguagem ao nível do usuário;
6. produzir síntese textual/voz.

A LLM não deve ser responsável pelo cálculo eleitoral.

## 14. Conversa guiada

O usuário não precisa conhecer os 100 intents.

Quando necessário, o chatbot deve oferecer caminhos:

    "Quero entender o desempenho."

    [Desempenho geral]
    [Evolução]
    [Municípios]
    [Território]
    [Concorrência]

Depois:

    [2018 → 2022]
    [2022 → 2026]
    [2018 → 2026]

A conversa guiada é UX. O método continua determinístico.

## 15. Voz

Arquitetura:

    VOZ
     ↓
    SPEECH-TO-TEXT
     ↓
    PERGUNTA
     ↓
    PIPELINE ELEITORAL
     ↓
    RESULTADO
     ↓
    RESPOSTA VISUAL
     ↓
    TEXT-TO-SPEECH

O áudio não cria uma segunda inteligência.

O resumo pode ser lido em voz alta; tabelas extensas não devem ser narradas linha por linha.

Provedores de Speech-to-Text e Text-to-Speech devem permanecer desacoplados do motor eleitoral.

## 16. Artefatos baixáveis

Dashboard e chatbot devem poder produzir, quando aplicável:

- PDF;
- CSV;
- outros formatos tabulares apropriados.

A exportação nasce do resultado estruturado, não de captura da interface.

## 17. Consistência

Para o mesmo:

- candidato;
- eleição;
- turno;
- período;
- método;
- filtros;

dashboard e chatbot devem usar o mesmo resultado determinístico, metodologia e evidência.

## 18. Segurança

O suporte a múltiplos candidatos não significa acesso irrestrito.

Devem ser respeitados:

- autenticação;
- RBAC;
- RLS;
- workspace;
- candidatos autorizados;
- eleições autorizadas.

Nenhuma interface pode expor dados de outro cliente apenas porque o motor consegue calculá-los.

## 19. Questões judiciais e exceções

Questões judiciais, alterações de situação de candidatura e outros eventos excepcionais podem exigir atualização ou reprocessamento.

Esses casos não alteram a arquitetura:

    FONTE OFICIAL ATUALIZADA
             ↓
        PROCESSAMENTO
             ↓
          VALIDAÇÃO
             ↓
         PUBLICAÇÃO
             ↓
     DASHBOARD + CHATBOT

## 20. Critério de qualidade

Nenhuma visualização ou resposta do chatbot pode depender de números digitados manualmente.

Toda métrica deve possuir:

- definição;
- fórmula;
- origem;
- período;
- filtros;
- teste;
- rastreabilidade.

Toda publicação deve poder ser reconstruída a partir dos dados oficiais locais.

## 21. Estado

A Fase 8 fechou o runtime determinístico em 100/100 intents.

A Fase 9 agora está em:

**CONTRATO CONCEITUAL EXPANDIDO — IMPLEMENTAÇÃO PENDENTE**

Antes da construção da UI, devem ser fechados os contratos técnicos de:

1. Presentation Contract;
2. Conversational Contract;
3. Candidate / Election Context;
4. Workspace / Permission Context;
5. exportação de relatórios;
6. Speech-to-Text / Text-to-Speech desacoplados.

A implementação deve então construir as duas superfícies sobre o mesmo motor, sem duplicar cálculo ou metodologia.

## 22. Contrato de UX visual e interação — 2026-10-08

Consultar `docs/design/INTELIGENCIA-ELEITORAL-UX-2026-10-08.md` e ADR-0004. O dashboard é a superfície principal de análise; o chat é flutuante, independente e compartilha contexto explicitamente. A seleção de candidato/eleição atualiza o cenário; filtros, gráficos, mapas e tabelas devem permitir exploração e drill-down. Insights e relatórios apresentam evidências, método e limitações em linguagem clara. Reutilizar a arquitetura e o dashboard de gabinete existentes. Não usar dados fictícios nem declarar implementado o que não foi validado. A auditoria preparatória pode começar imediatamente; as visualizações ligadas a dados respeitam os gates de cobertura do roadmap.


## 23. Auditoria do frontend — IE-05.0 (2026-10-08)

A auditoria do código em `main` confirma que a Inteligência Eleitoral já está inserida no Dashboard de Gabinete existente por `AdminLayout` → `AdminWorkspace` → `AdminElectoralIntelligenceTab`, com consulta ao Worker existente e projeção analítica no Supabase. A interface atual aceita número do candidato e segundo número para comparação, mantém RS / Deputado Estadual / 1º turno fixos, apresenta perguntas por área e resultados em tabela/JSON, e oferece CSV, relatório imprimível e síntese de voz.

Os contratos `src/contracts/electoralContext.ts` e `src/contracts/electoralPresentation.ts` já existem e têm testes. A interface ainda não os integra em estado compartilhado de candidato/eleição/filtros; não oferece busca por nome, modal de candidatos, seletor de eleição, painel de chat flutuante nem renderer de gráficos/mapas. A presença de templates de apresentação não comprova que essas visualizações estejam operacionais.

A decisão nesta fase é não criar um segundo contrato nem antecipar componentes funcionais sem necessidade comprovada. A fase seguinte conectará a interface aos contratos existentes. O gate IE-03.7 permanece vigente e a auditoria de código não equivale a validação da cobertura física em produção. Ver o mapa detalhado e a evidência de testes em `docs/design/INTELIGENCIA-ELEITORAL-UX-2026-10-08.md`.

## 24. Implementação visual — IE-05.1

A implementação inicial do dashboard está em validação na branch feat/ie-05-1-electoral-dashboard-foundation. A fatia substitui a apresentação antiga de perguntas por uma superfície analítica com contexto eleitoral, pesquisa autenticada de candidato, KPIs provenientes do runtime, evolução histórica, ranking territorial e chat flutuante que compartilha o resultado atual.

A pesquisa utiliza a tabela de projeção existente electoral_analytics_candidates, sem criar catálogo paralelo. A seleção fica restrita ao ano escolhido, RS, Deputado Estadual e 1º turno. A mudança de ano limpa a seleção para exigir a escolha do registro correspondente à eleição e evitar confundir candidatos com números diferentes entre anos.

Nenhum dado fictício foi incluído. O mapa permanece indisponível até IE-03.7 validar a cobertura territorial. Esta branch ainda precisa passar por lint, testes e build; a implementação não deve ser declarada concluída antes dessas evidências e do merge.

