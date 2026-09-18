# Proposta — Sistema de Gestão do Gabinete

**Projeto:** Deputado Carlos Burigo  
**Documento:** proposta inicial para evolução do dashboard/CMS  
**Status:** PROPOSTA INICIAL — em descoberta e refinamento  
**Regra:** este documento é a fonte de referência para as próximas discussões sobre o dashboard interno do gabinete.

---

## 1. Objetivo

Transformar o dashboard atual em um **Sistema de Gestão do Gabinete**, voltado ao deputado e à equipe, sem confundi-lo com o portal público.

O dashboard não deve ser apenas um painel de estatísticas nem um CMS genérico.

> **Princípio central: o dashboard deve funcionar como a central de operação do gabinete.**

A equipe deve conseguir, a partir dele, acompanhar atendimento ao cidadão, agenda, atividade parlamentar, conteúdo, documentos, tarefas e equipe.

A evolução deve aproveitar a arquitetura, banco, autenticação e componentes existentes. Não criar uma segunda arquitetura sem necessidade.

---

## 2. Separação entre portal público e gestão interna

O projeto deve ter duas experiências claramente distintas:

### Portal público

Destinado ao cidadão:

- conhecer o deputado e o mandato;
- acompanhar atuação parlamentar;
- consultar notícias, eventos e documentos;
- acompanhar resultados;
- entrar em contato pelo **Fale com o Deputado**.

### Sistema interno do gabinete

Destinado ao deputado e equipe:

- operar demandas;
- organizar agenda;
- acompanhar mandato;
- produzir e publicar conteúdo;
- administrar documentos;
- criar e acompanhar tarefas;
- administrar equipe e permissões;
- acompanhar pendências e prioridades.

Os dois lados devem compartilhar a mesma fonte de verdade quando o conteúdo for público.

---

## 3. Estrutura funcional proposta

### 3.1 Início / Central

A tela inicial deve responder principalmente:

**O que precisa da atenção da equipe agora?**

Exemplo de informações:

- demandas aguardando atendimento;
- compromissos do dia;
- tarefas atrasadas;
- conteúdos aguardando revisão/publicação;
- assuntos legislativos que exigem acompanhamento;
- indicadores operacionais essenciais.

Evitar transformar a Home em um dashboard excessivamente carregado de gráficos e cards.

Prioridade: **ações e pendências**, não decoração.

---

### 3.2 Atendimento

O **Fale com o Deputado** deve alimentar uma central interna de atendimento.

Fluxo inicial:

```
Cidadão
  ↓
Fale com o Deputado
  ↓
Nova demanda
  ↓
Triagem
  ↓
Responsável
  ↓
Em atendimento
  ↓
Aguardando
  ↓
Respondida
  ↓
Encerrada
```

Uma demanda deve poder conter:

- cidadão;
- município;
- categoria;
- assunto;
- descrição;
- anexos;
- responsável;
- prioridade;
- prazo;
- status;
- histórico;
- notas internas;
- resposta;
- registro de encerramento.

O objetivo é transformar o formulário público em um fluxo real de relacionamento e acompanhamento.

---

## 4. CMS orientado ao mandato

O CMS atual deve ser analisado e simplificado.

A interface não deve expor desnecessariamente conceitos técnicos como estrutura de blocos, JSON, slugs ou relações internas.

O gabinete deve pensar em:

- Notícias;
- Páginas;
- Eventos;
- Documentos;
- Agenda pública;
- Atuação parlamentar;
- Resultados;
- Mídia.

### Princípio

> **O banco pode ser sofisticado; a interface do CMS deve ser simples.**

Cada tipo de conteúdo deve ter formulário adequado ao seu objetivo.

### Exemplo — notícia

- título;
- resumo;
- imagem;
- texto;
- categoria;
- data;
- autor;
- status.

### Exemplo — evento

- título;
- data;
- horário;
- local;
- descrição;
- participação do deputado;
- visibilidade pública.

### Exemplo — documento

- nome;
- categoria;
- descrição;
- arquivo;
- data;
- visibilidade.

---

## 5. Workflow editorial

O conteúdo deve poder seguir um fluxo simples:

```
RASCUNHO
   ↓
EM REVISÃO
   ↓
APROVADO
   ↓
PUBLICADO
   ↓
ARQUIVADO
```

A equipe não deve precisar publicar diretamente tudo o que cria.

O sistema deve permitir que um assessor prepare o conteúdo e outro usuário autorizado revise/aprove.

---

## 6. Agenda

A agenda deve ser uma entidade central do gabinete.

Deve permitir:

- compromissos;
- reuniões;
- eventos;
- visitas;
- atividades parlamentares;
- compromissos internos.

Cada compromisso pode ter visibilidade, por exemplo:

- interno;
- público;
- privado.

Um compromisso interno não deve aparecer automaticamente no portal público.

Quando marcado como público, deve poder alimentar a agenda do portal.

---

## 7. Mandato / Atuação parlamentar

O dashboard deve funcionar como camada de gestão do mandato, sem necessariamente substituir sistemas oficiais.

Possíveis áreas:

- proposições;
- comissões;
- votações;
- requerimentos;
- emendas;
- discursos;
- resultados;
- assuntos legislativos em acompanhamento.

Cada item pode possuir:

- responsável interno;
- status;
- próximos eventos;
- documentos;
- notas internas;
- referências externas;
- tarefas relacionadas;
- informações públicas.

---

## 8. Tarefas

O sistema deve permitir transformar demandas e assuntos do mandato em trabalho executável.

Exemplos:

```
Demanda
  ↓
Criar tarefa
  ↓
Solicitar informação
  ↓
Responsável
  ↓
Prazo
  ↓
Conclusão
```

Ou:

```
Proposição
  ↓
Preparar nota técnica
  ↓
Responsável
  ↓
Prazo
  ↓
Conclusão
```

As tarefas devem estar relacionadas às entidades que originaram o trabalho sempre que possível.

---

## 9. Equipe e permissões

A estrutura do gabinete não deve ser rigidamente codificada por cargos.

O sistema deve permitir usuários, funções e permissões configuráveis.

Exemplo:

| Área | Usuário A | Usuário B |
|---|---:|---:|
| Conteúdo | ✓ | ✓ |
| Atendimento | ✓ | ✓ |
| Agenda | ✓ | ✓ |
| Legislativo | ✓ | ✓ |
| Equipe | ✓ | — |
| Configurações | ✓ | — |

O modelo definitivo de permissões será definido após auditoria da implementação existente.

---

## 10. Busca global

O dashboard deve considerar uma busca global como mecanismo transversal.

Exemplo:

```
Buscar no gabinete...

Carlos
Demanda #2026-001245
PL 123/2026
Reunião Prefeitura
Documento orçamento
```

A busca deve permitir localizar rapidamente pessoas, demandas, conteúdos, documentos, tarefas e assuntos do mandato.

---

## 11. Fonte única de dados

A arquitetura conceitual desejada é:

```
                    ┌── Portal público
                    │
Supabase ← Dashboard ┤
                    │
                    └── Gestão do gabinete
```

Exemplo:

```
Dashboard
   ↓
Publica evento
   ↓
Supabase
   ↓
Portal público
```

O gabinete não deve manter uma cópia paralela do conteúdo público.

Da mesma forma, não criar uma segunda API ou uma segunda fonte de verdade se a infraestrutura existente já atende à necessidade.

---

## 12. Navegação inicial proposta

```
GABINETE
│
├── Início
│
├── Atendimento
│   ├── Todas as demandas
│   ├── Novas
│   ├── Em atendimento
│   ├── Aguardando
│   └── Encerradas
│
├── Agenda
│   ├── Calendário
│   └── Compromissos
│
├── Mandato
│   ├── Proposições
│   ├── Comissões
│   ├── Votações
│   ├── Emendas
│   └── Resultados
│
├── Conteúdo
│   ├── Notícias
│   ├── Páginas
│   ├── Eventos
│   ├── Documentos
│   └── Mídia
│
├── Tarefas
│
├── Equipe
│
└── Configurações
```

Esta estrutura é **propositiva**, não uma decisão definitiva.

---

## 13. Princípios de UX

O dashboard deve seguir os princípios já estabelecidos para o projeto:

- menos é mais;
- interfaces familiares;
- hierarquia visual clara;
- poucas ações por tela;
- linguagem de gabinete, não linguagem técnica;
- formulários específicos por tipo de conteúdo;
- feedback claro;
- estados vazios úteis;
- acessibilidade;
- funcionamento adequado em desktop e tablet;
- evitar excesso de cards;
- evitar dashboards ornamentais;
- evitar fluxos longos quando uma ação simples resolver.

A equipe deve conseguir operar o sistema sem conhecer a arquitetura técnica por trás dele.

---

## 14. O que NÃO fazer

Não devemos:

- recriar o projeto;
- criar um segundo CMS;
- criar uma segunda fonte de dados;
- duplicar APIs existentes;
- criar uma nova arquitetura apenas para o dashboard;
- transformar tudo em CRUD genérico;
- criar gráficos sem utilidade operacional;
- expor detalhes técnicos do banco para o usuário;
- misturar conteúdo público e operação interna sem controle de visibilidade;
- codificar cargos do gabinete de maneira rígida;
- substituir sistemas oficiais sem necessidade.

---

## 15. Próxima etapa obrigatória: auditoria

Antes de alterar o dashboard, deve ser feita uma auditoria do estado atual do repositório.

A auditoria deve identificar:

1. telas atuais do dashboard;
2. rotas administrativas existentes;
3. componentes reutilizáveis;
4. CMS atual;
5. entidades e tabelas Supabase existentes;
6. APIs existentes;
7. autenticação e autorização;
8. permissões atuais;
9. fluxos de publicação;
10. fluxo de atendimento;
11. agenda existente;
12. tarefas existentes;
13. recursos já implementados que podem ser reaproveitados;
14. funcionalidades quebradas;
15. duplicações;
16. lacunas em relação à proposta deste documento.

### Regra

**A auditoria deve preceder qualquer refatoração estrutural.**

Não redesenhar o dashboard com base apenas em hipóteses.


---

## 16. Pesquisa institucional — ALRS e integrações

A pesquisa realizada em setembro de 2026 indica que a **Assembleia Legislativa do Rio Grande do Sul (ALRS) opera com um ecossistema de sistemas especializados**, e não com um único ERP/CRM de gabinete.

A própria plataforma de capacitação da ALRS registra, em 2026, treinamentos separados para:

- SEI;
- Sistema de Cotas;
- Sistema de Diárias;
- processo legislativo;
- FPE;
- Microsoft 365;
- plataforma CWA de clipping.

Também há registro de treinamento do **E-PRO**, descrito como sistema de processo eletrônico da ALRS utilizado por coordenadores de bancada, assessorias de gabinetes e secretários de comissão. O material da Escola do Legislativo também registra o **Sistema PRO** para proposições.

Fonte institucional: https://moodle.al.rs.gov.br/course/index.php?categoryid=5

### Evidência adicional de 2026

Contratações públicas registradas para a ALRS mostram manutenção/evolução específica do **e-Pro (NOPAPER)** e contratação de solução própria para **controle das cotas parlamentares**. Isso reforça que essas funções estão apoiadas em sistemas institucionais específicos, e não em um único sistema externo de gabinete. A fonte consultada é um agregador de dados públicos de contratações, devendo ser tratada como evidência secundária.

Fonte: https://ailicita.com/orgao/88243688000181

A ALRS também possui contrato de 2026 para implantação, manutenção, operação, armazenamento e salvamento das informações do aplicativo **Central de Manifestações**, com a PROCERGS. Isso é relevante para o desenho do nosso módulo Atendimento: não devemos presumir que o portal de um gabinete deva substituir sistemas institucionais de manifestação da Assembleia.

Fonte: https://ailicita.com/contrato/88243688000181-2-000004%2F2026

### Dados públicos e integração

O Portal da Transparência RS disponibiliza **dados abertos em CSV/XML**, com arquivos e respectivos layouts, permitindo reutilização em aplicações. O próprio portal informa que os dados são disponibilizados conforme a atualização dos painéis de origem.

Fonte: https://www.transparencia.rs.gov.br/dados-abertos/dados-transparencia-rs/dados/

O painel de Emendas Parlamentares Estaduais informa que os dados de destinação são fornecidos pela SPGG e os dados de execução financeira vêm do FPE/CAGE; o painel também aponta a existência desses dados em formato aberto.

Fonte: https://transparencia.rs.gov.br/emendas-parlamentares/emendas-parlamentares-estaduais/dados/

O Portal da Transparência mantém ainda uma área denominada **ViewApi**, mas a página pública consultada não expõe, no HTML acessível, documentação suficiente dos endpoints para concluir quais APIs podem ser usadas diretamente pelo nosso sistema. Portanto, a existência da área **não deve ser tratada como prova de uma API pública para os sistemas internos da ALRS**.

Fonte: https://www.transparencia.rs.gov.br/viewapi/

### Conclusão arquitetural da pesquisa

A conclusão atual é:

```
ALRS
├── Sistemas institucionais
│   ├── PRO / proposições
│   ├── E-PRO
│   ├── SEI
│   ├── Cotas
│   ├── Diárias
│   └── outros sistemas especializados
│
├── Dados públicos / transparência
│   ├── consultas públicas
│   ├── dados abertos
│   └── informações de execução/orçamento
│
└── Gabinete OS do projeto
       ↓
   camada de organização
   acompanhamento
   tarefas
   relacionamento
   conteúdo
       ↓
   Portal público
```

**Não devemos construir o Gabinete OS como substituto dos sistemas oficiais da ALRS.**

Ele deve funcionar como **camada de gestão e orquestração do gabinete**, integrando dados públicos quando houver fonte oficial reutilizável e mantendo referências/links para operações que precisam continuar nos sistemas institucionais.

### Classificação de integração

Para cada integração futura, devemos classificar o recurso em uma destas categorias:

1. **Integração automática** — existe fonte/API/arquivo oficial reutilizável e tecnicamente acessível.
2. **Consulta externa** — a informação é pública e pode ser consultada, mas não há integração automatizada documentada suficiente.
3. **Operação institucional** — exige acesso aos sistemas oficiais da ALRS; o Gabinete OS deve apenas registrar referência, status, tarefa ou link.
4. **Não confirmado** — existe indício de integração, mas a documentação pública disponível não é suficiente para implementação segura.

Não devemos fazer scraping, engenharia reversa ou automação de sistemas autenticados da ALRS sem autorização e documentação adequada.

---

## 17. Implicação para o desenho do Gabinete OS

A pesquisa fortalece uma parte importante da proposta inicial:

### O sistema não deve tentar ser o "sistema da Assembleia".

Ele deve ser o **sistema operacional do gabinete**, com uma camada própria para:

- relacionamento com cidadãos;
- organização de demandas;
- acompanhamento de assuntos legislativos;
- agenda;
- tarefas;
- produção editorial;
- documentos do gabinete;
- acompanhamento de emendas;
- acompanhamento de proposições;
- histórico e notas internas;
- referências aos sistemas oficiais;
- acompanhamento de pendências externas.

Exemplo:

```
Demanda do cidadão
       ↓
Gabinete OS
       ↓
Tarefa: consultar / encaminhar / acompanhar
       ↓
Sistema oficial da ALRS ou órgão externo
       ↓
Gabinete OS registra resultado/status
       ↓
Resposta ao cidadão
```

Isso evita duplicar sistemas institucionais e concentra no gabinete aquilo que atualmente tende a ficar espalhado entre atendimento, e-mail, agenda, planilhas, sistemas da Assembleia e CMS.

---

## 18. Próxima investigação técnica obrigatória

Antes de definir o modelo final do módulo **Mandato**, devemos mapear, com evidência técnica, quais dados públicos da ALRS e do Estado podem ser consumidos automaticamente.

O levantamento deve produzir uma matriz:

| Dado | Fonte | Automático | Método | Atualização | Pode gravar no Gabinete OS? |
|---|---|---:|---|---|---:|
| Proposições | ALRS | a confirmar | consulta/API/arquivo | a confirmar | sim, como referência/cache |
| Comissões | ALRS | a confirmar | consulta/API/arquivo | a confirmar | sim |
| Votações | ALRS | a confirmar | consulta/API/arquivo | a confirmar | sim |
| Emendas estaduais | Transparência RS | provável | dados abertos | periódica | sim |
| Execução de emendas | FPE/CAGE | provável | dados abertos | diária | sim |
| SEI | ALRS | não confirmado | sistema institucional | — | somente referência |
| E-PRO | ALRS | não confirmado | sistema institucional | — | somente referência |
| Cotas | ALRS | não confirmado | sistema institucional | — | somente referência |
| Diárias | ALRS | não confirmado | sistema institucional | — | somente referência |
| Manifestações institucionais | ALRS | não confirmado | sistema institucional | — | somente referência |

O objetivo é descobrir **endpoints, arquivos, formatos, autenticação, limites e periodicidade reais**, e não apenas afirmar que "existe uma API".


---

## 21. Resultado adicional da investigação — maturidade das APIs legislativas

Foi localizada uma pesquisa acadêmica comparativa sobre transparência programática das Assembleias Legislativas estaduais, publicada como preprint SciELO e baseada em coleta realizada em março/abril de 2025.

Para o **Rio Grande do Sul**, o levantamento classifica a ALRS como:

- portal de transparência: **sim**;
- portal próprio de dados abertos: **não identificado**;
- API de dados legislativos documentada: **não identificada**;
- observação: possibilidade de integração por fontes estaduais.

A pesquisa deve ser tratada como **evidência secundária**, pois não é documentação oficial da ALRS e a coleta é de 2025. Ela, entretanto, é consistente com a investigação atual: não foi localizada documentação pública oficial da ALRS que apresente Swagger, catálogo de endpoints ou API legislativa pública para proposições, votações ou comissões.

Fonte secundária: *Democracia em Formato JSON: As Assembleias Legislativas Estaduais do Portal ao Endpoint*, SciELO Preprints. A própria pesquisa informa que a coleta comparativa ocorreu em março/abril de 2025.

### Consequência prática

Até que uma fonte técnica oficial seja encontrada, o módulo **Mandato** deve tratar os dados legislativos da ALRS como:

**Consulta externa / referência institucional — não como integração API confirmada.**

Isso significa:

- não criar sincronizador contra HTML;
- não fazer scraping como fundamento do produto;
- não presumir endpoint REST;
- não armazenar uma cópia integral das proposições sem necessidade;
- manter URL/identificador da matéria quando disponível;
- permitir que a equipe registre status, responsável, tarefa e notas internas;
- deixar a porta aberta para integração futura caso a ALRS disponibilize API ou arquivo estruturado oficial.

### Exceção importante: dados estaduais

O cenário é diferente para dados publicados pelo **Portal da Transparência RS**.

O portal afirma oficialmente que seu painel de Dados Abertos disponibiliza os dados utilizados pelos próprios painéis em arquivos CSV, com layouts correspondentes, e licença aberta de reutilização. citehttps://www.transparencia.rs.gov.br/dados-abertos/dados-transparencia-rs/dados/

Portanto, para o Gabinete OS:

**Dados abertos estaduais = candidato real a integração automática.**

**Sistemas legislativos internos da ALRS = integração ainda não confirmada.**

---

## 22. Matriz de integração — versão 1

Com a evidência disponível até agora:

| Recurso | Fonte | Estado atual | Estratégia do Gabinete OS |
|---|---|---|---|
| Proposições | ALRS | API pública não confirmada | referência + link + gestão interna |
| Comissões | ALRS | API pública não confirmada | referência + link + gestão interna |
| Votações | ALRS | API pública não confirmada | referência + link + gestão interna |
| Atuação parlamentar pública | ALRS | consulta pública disponível | referência externa até confirmação técnica |
| Emendas estaduais | Transparência RS | dados abertos oficiais | **priorizar integração automática** |
| Execução de emendas | Transparência RS / FPE-CAGE | dados abertos + atualização diária do painel | **priorizar integração automática** |
| Despesas estaduais relevantes | Transparência RS / FPE-CAGE | dados abertos | avaliar integração por caso de uso |
| Contratos/fornecedores relevantes | Transparência RS | dados abertos/painéis | avaliar integração por caso de uso |
| SEI | ALRS | operação institucional | link/referência/status |
| E-PRO | ALRS | operação institucional | link/referência/status |
| Cotas | ALRS | operação institucional | link/referência/status |
| Diárias | ALRS | operação institucional | link/referência/status |
| Ouvidoria/manifestação ALRS | ALRS | canal institucional próprio | não substituir; registrar referência quando necessário |

### Regra

Nenhum item deve entrar como "integração automática" no produto apenas porque existe uma página pública.

Para ser classificado como integração automática, precisamos confirmar:

1. endpoint ou arquivo oficial;
2. formato;
3. método de acesso;
4. estabilidade/endereço;
5. periodicidade;
6. regras de uso;
7. identificador confiável;
8. possibilidade de execução técnica sem autenticação institucional indevida.

---

## 23. Nova prioridade técnica

A investigação agora deve seguir **duas trilhas paralelas**, mas sem iniciar implementação:

### Trilha A — Estado / Transparência RS

Descobrir os arquivos reais de:

- Emendas Parlamentares Estaduais;
- execução das emendas;
- despesas relevantes;
- contratos relevantes;
- eventualmente convênios e transferências.

Objetivo: obter URL real dos arquivos, nomes, layouts, colunas, tamanho, periodicidade e estratégia de ingestão.

### Trilha B — ALRS

Continuar procurando somente fontes oficiais e documentação técnica para:

- proposições;
- comissões;
- votações;
- presença;
- agenda legislativa;
- resultados.

Se não houver API/arquivo oficial, o resultado correto da investigação será **"não confirmado / consulta externa"**, e não uma solução de scraping.

---

## 24. Decisão provisória de arquitetura

A arquitetura de integração do Gabinete OS fica provisoriamente definida assim:

```
                     FONTES EXTERNAS
                            │
             ┌──────────────┴──────────────┐
             │                             │
       Dados estruturados             Consulta externa
       e reutilizáveis                / sistema oficial
             │                             │
             ▼                             ▼
      Sincronização                 Referência + link
             │                      + status/tarefa
             └──────────────┬──────────────┘
                            ▼
                    GABINETE OS
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
      Atendimento        Mandato           Tarefas
      Agenda             Conteúdo          Equipe
          │                 │                 │
          └─────────────────┴─────────────────┘
                            │
                            ▼
                    PORTAL PÚBLICO
```

**A integração deve ser orientada por caso de uso, não por desejo de centralizar todos os sistemas.**

O objetivo é eliminar o trabalho manual desnecessário do gabinete, sem criar dependência de integrações não documentadas ou frágeis.



---

## 25. Investigação técnica — dados abertos estaduais: Emendas e despesas

A investigação de setembro de 2026 confirmou que o **Portal da Transparência RS** possui uma camada oficial de dados abertos reutilizáveis. O portal informa que os dados são publicados em formatos abertos como CSV/XML e que os arquivos podem ser acompanhados de arquivos de layout contendo colunas, formato, tamanho e descrição dos atributos. Os dados são disponibilizados conforme a atualização dos painéis de origem.

Fonte oficial: https://www.transparencia.rs.gov.br/dados-abertos/dados-transparencia-rs/dados/

### 25.1 Emendas Parlamentares Estaduais

O painel oficial informa que:

- a destinação das emendas é fornecida pela **SPGG**;
- os dados incluem ano, deputado, partido, município, órgão, projeto, subtítulo e valor;
- a execução financeira é derivada do **FPE**, administrado pela CAGE/RS;
- a execução inclui data de empenho, liquidação e pagamento, credor, CPF/CNPJ, processo, empenho e valor;
- a execução orçamentária do painel é atualizada diariamente;
- as alterações das emendas recebidas da Assembleia são incorporadas periodicamente;
- os arquivos de dados abertos são disponibilizados pelo próprio Portal da Transparência RS.

Fonte oficial: https://transparencia.rs.gov.br/emendas-parlamentares/emendas-parlamentares-estaduais/dados/

### 25.2 Regra de identificação das emendas

A própria documentação oficial registra um ponto importante para a futura ingestão:

- o município passou a ser parametrizado a partir de 2024;
- registros anteriores podem trazer o município apenas no subtítulo;
- uma mesma emenda pode aparecer em mais de uma linha quando sofre alteração;
- registros com valor zero podem representar o histórico anterior de uma emenda alterada.

Portanto, **o número da emenda não deve ser tratado isoladamente como chave física de uma linha de execução**.

A futura camada de ingestão deve preservar:

1. identificador/número da emenda;
2. ano;
3. versão/registro de origem, quando disponível;
4. situação/valor vigente;
5. município;
6. subtítulo;
7. dados de execução;
8. data da última sincronização;
9. fonte e arquivo de origem.

A modelagem definitiva deve ser confirmada somente depois de inspecionar o layout real dos arquivos.

### 25.3 Despesas estaduais

O Portal da Transparência RS mantém conjuntos de dados abertos relacionados a:

- despesas com fornecedores e prestadores de serviços;
- materiais e serviços;
- relatório detalhado e resumido de despesas;
- despesas extraorçamentárias;
- ordem cronológica de pagamentos.

O FAQ oficial informa que os arquivos de dados abertos das despesas podem ser organizados por mês ou ano devido ao volume de dados.

Fonte oficial: https://www.transparencia.rs.gov.br/faq/

O portal também apresenta painéis específicos de contratos e despesas, inclusive referências às despesas detalhadas da Assembleia Legislativa.

Fonte oficial: https://www.transparencia.rs.gov.br/inicio

### 25.4 O que foi confirmado e o que ainda não foi confirmado

**Confirmado:**

- existe uma infraestrutura oficial de dados abertos;
- os arquivos são reutilizáveis;
- existem layouts dos arquivos;
- Emendas Parlamentares Estaduais estão incluídas;
- execução das emendas utiliza dados do FPE/CAGE;
- a execução do painel de emendas é atualizada diariamente;
- despesas estaduais possuem conjuntos de dados abertos;
- o Portal possui uma área pública chamada ViewApi.

**Ainda não confirmado:**

- URL estável e direta de cada arquivo CSV de emendas;
- nome exato dos arquivos atuais;
- layout efetivo/colunas do arquivo atual;
- tamanho dos arquivos;
- mecanismo técnico para detectar novos arquivos automaticamente;
- endpoint documentado e utilizável da área ViewApi para os dados de interesse do Gabinete OS.

A página pública de dados abertos expõe a seleção dos conjuntos de dados, mas os links/arquivos são carregados de forma que o conteúdo dos arquivos individuais não ficou exposto no HTML consultável. Portanto, **não devemos inventar URLs de CSV nem declarar que um endpoint foi confirmado sem obtê-lo diretamente**.

### 25.5 Decisão para a arquitetura do Gabinete OS

A integração estadual deve ser construída em duas camadas:

```
Portal Transparência RS
        ↓
arquivo oficial / endpoint confirmado
        ↓
ingestão controlada
        ↓
Supabase
        ↓
Gabinete OS
        ↓
acompanhamento de emendas / despesas / tarefas
```

A ingestão deve guardar metadados de origem e data de sincronização. A camada interna não deve substituir os dados oficiais: deve manter uma representação operacional para pesquisa, acompanhamento e relacionamento com tarefas.

### 25.6 Próxima ação técnica

Antes de implementar qualquer tabela ou cron de sincronização para emendas, realizar uma inspeção técnica do mecanismo de download do Portal da Transparência RS para obter:

1. URL real do arquivo;
2. nome do arquivo;
3. formato/encoding/separador;
4. layout;
5. colunas;
6. identificadores;
7. volume;
8. periodicidade;
9. regra de substituição/histórico;
10. estratégia de carga incremental.

Somente depois dessa inspeção deve ser criada a ingestão no Supabase.



---

## 26. Auditoria do dashboard/CMS atual — primeira leitura estrutural

A auditoria do código atual confirma que a proposta de **Gabinete OS** não deve ser implementada como simples redesign visual do dashboard. A estrutura existente já possui várias peças reutilizáveis, mas a organização funcional ainda está orientada à **gestão do portal**, e não à operação completa do gabinete.

### 26.1 Navegação atual

O dashboard atual está organizado em seis módulos:

- Visão Geral;
- Atuação Pública;
- Conteúdo Público;
- Acervo;
- Cidadão;
- Administração.

A navegação é definida em `AdminLayout.tsx` e os conteúdos são renderizados por `AdminWorkspace.tsx`.

Isso funciona como um **painel administrativo do site**, mas ainda não corresponde à navegação operacional proposta para o Gabinete OS.

### 26.2 O CMS atual é essencialmente um Page Builder

O módulo **Páginas e Landing Pages** utiliza:

- páginas;
- blocos;
- versões;
- status de rascunho/publicado;
- rollback;
- editor genérico de blocos;
- biblioteca de mídia;
- prévia.

A implementação existente está em `AdminPagesTab.tsx`, `BlockEditorForm.tsx` e `server/pagesAdmin.ts`.

O modelo é tecnicamente reutilizável e possui histórico de versões, mas apresenta um problema de produto:

> **o gabinete precisa administrar conteúdo por finalidade; o CMS atual administra componentes por tipo de bloco.**

O assessor atualmente precisa pensar em conceitos como:

- Hero;
- bloco;
- CTA;
- alinhamento;
- posição de mídia;
- slug;
- biblioteca;
- URL externa.

Esses conceitos podem continuar existindo internamente, mas não devem ser o centro da experiência operacional do gabinete.

### 26.3 Conteúdo está fragmentado em modelos diferentes

Além do Page Builder, existem módulos independentes para:

- notícias;
- agenda;
- resultados;
- municípios;
- vídeos;
- mídia;
- páginas.

Isso não significa que esses módulos devam ser eliminados. A conclusão é diferente:

**a experiência de gestão precisa unificar o trabalho sem necessariamente unificar todas as tabelas.**

Exemplo:

```
Conteúdo
├── Notícias
├── Eventos
├── Documentos
├── Páginas
├── Agenda pública
└── Mídia
```

A equipe deve enxergar essas coisas como tipos de conteúdo do mandato, enquanto o banco pode continuar usando suas entidades atuais.

### 26.4 O módulo "Conteúdo Público" contém responsabilidades que não são CMS

A auditoria encontrou no `AdminContentTab.tsx` configurações de:

- telefones;
- WhatsApp;
- e-mail;
- slogan;
- dados eleitorais;
- redes sociais;
- textos institucionais;
- CTA de contato.

Portanto, o nome **Conteúdo Público** mistura configuração institucional, campanha, comunicação e conteúdo editorial.

Isso deverá ser separado conceitualmente na futura arquitetura de navegação.

### 26.5 O dashboard atual ainda é orientado a indicadores do site

O `AdminDashboardTab.tsx` mostra:

- demandas pendentes;
- demandas em atendimento;
- quantidade de notícias;
- quantidade de compromissos;
- fila de demandas;
- auditoria recente;
- seletor de modo campanha/mandato/institucional.

Isso é útil, mas ainda não responde integralmente à pergunta:

> **"O que a equipe do gabinete precisa resolver hoje?"**

Faltam, entre outros:

- tarefas vencidas;
- tarefas próximas do vencimento;
- demandas sem responsável;
- demandas aguardando resposta;
- compromissos de hoje;
- itens legislativos em acompanhamento;
- emendas em acompanhamento;
- conteúdos aguardando revisão;
- pendências externas;
- atividades relacionadas a municípios.

### 26.6 Atendimento é a parte mais próxima do Gabinete OS

O sistema já possui uma base importante para Atendimento:

- `demands`;
- `demand_messages`;
- `demand_history`;
- atribuição;
- prioridade;
- status;
- resposta oficial;
- protocolo.

A API administrativa também já permite listar e atualizar demandas.

Portanto, **não devemos recriar o módulo Atendimento**.

O trabalho futuro deve evoluí-lo de "lista de demandas" para **central de atendimento do gabinete**, preservando as entidades e APIs existentes quando forem adequadas.

### 26.7 Há uma lacuna estrutural: Tarefas

Na estrutura atual auditada não foi encontrada uma entidade operacional de **Tarefas** equivalente ao conceito proposto neste documento.

Isso é importante porque:

```
Demanda
   ↓
Tarefa
   ↓
Responsável + prazo
   ↓
Conclusão
```

Sem essa camada, o gabinete registra o problema, mas ainda não possui uma unidade clara de trabalho que possa ser atribuída, cobrada e encerrada.

A criação de tarefas deverá ser analisada na auditoria de banco/migrations antes de qualquer decisão de schema.

### 26.8 Há uma lacuna estrutural: Mandato como área operacional

Existe `/api/legislative` e uma entidade pública de atividade legislativa, mas a interface administrativa atual não possui um módulo operacional de Mandato equivalente a:

- proposições acompanhadas;
- comissões;
- votações;
- emendas;
- assuntos;
- responsáveis;
- tarefas relacionadas;
- referências externas.

A existência do endpoint público **não significa que devemos criar uma segunda base legislativa**.

O módulo futuro deve começar como camada de acompanhamento e referência, conforme a decisão arquitetural registrada nas seções anteriores.

### 26.9 Há uma lacuna estrutural: workflow editorial

O Page Builder possui rascunho/publicado e versões, mas o workflow proposto:

```
Rascunho → Em revisão → Aprovado → Publicado → Arquivado
```

ainda não está representado como processo editorial completo.

A evolução deve primeiro confirmar se o banco atual suporta os estados necessários e quais módulos precisam deles. Não criar workflow paralelo para cada tipo de conteúdo.

### 26.10 Ponto de atenção de autenticação

A API administrativa utiliza atualmente o cabeçalho `x-user-id` para identificar o usuário.

A função `requireAuth()` presente no Worker verifica a existência desse cabeçalho, mas a leitura realizada nesta auditoria não comprova, por si só, uma validação criptográfica da identidade enviada no header.

Esse ponto deve permanecer como **bloqueador de segurança para a próxima auditoria de autenticação/autorização**, especialmente antes de ampliar permissões administrativas.

Não alterar isso incidentalmente durante o redesign do CMS.

### 26.11 Decisão de produto derivada da auditoria

A partir desta leitura, a próxima etapa não deve ser "refazer o CMS".

Deve ser:

**reorganizar o dashboard em torno do trabalho do gabinete e reaproveitar os módulos existentes.**

A direção passa a ser:

```
GABINETE

Início
Atendimento
Agenda
Mandato
Conteúdo
Tarefas
Equipe
Configurações
```

com o CMS/Page Builder permanecendo como infraestrutura de páginas, e não como modelo mental principal da gestão.

### 26.12 Próxima auditoria obrigatória

Antes de implementar a nova navegação, mapear no banco/migrations:

1. todas as tabelas existentes;
2. relacionamentos entre conteúdo;
3. políticas RLS;
4. perfis e permissões;
5. entidades de agenda;
6. entidades de demanda;
7. entidades legislativas;
8. entidades de documentos;
9. entidades de mídia;
10. entidades que possam servir de base para tarefas;
11. campos de publicação/status;
12. funções RPC existentes;
13. triggers relevantes;
14. histórico/auditoria;
15. índices e identificadores.

O resultado deve separar explicitamente:

- **reaproveitar**;
- **adaptar**;
- **criar**;
- **remover somente se comprovadamente obsoleto**.


---

## 27. Auditoria real do Supabase — mapa de dados e segurança

A auditoria foi executada diretamente no projeto Supabase de produção identificado como wktanxbpijurimdjgone, sem alteração de schema.

### 27.1 Inventário atual

Foram identificadas 24 tabelas públicas:

```
audit_logs / demand_history / demand_messages / demands / documents / events
evidence / legislative_events / legislative_items / legislative_roles / legislative_votes
media / municipalities / news / page_blocks / page_versions / pages
parliamentary_participations / profiles / results / site_settings / user_roles / videos
```

Todas as tabelas listadas estão com RLS habilitado.

### 27.2 Mapa funcional

| Área | Entidades existentes | Decisão |
|---|---|---|
| Identidade/equipe | profiles, user_roles | REAPROVEITAR + adaptar permissões |
| Atendimento | demands, demand_messages, demand_history | REAPROVEITAR |
| Agenda | events | REAPROVEITAR + adaptar interface |
| Conteúdo editorial | news, results | REAPROVEITAR + adaptar workflow |
| Páginas/CMS | pages, page_blocks, page_versions | REAPROVEITAR como infraestrutura |
| Mídia | media, videos | REAPROVEITAR |
| Documentos | documents, evidence | REAPROVEITAR + organizar por finalidade |
| Mandato | legislative_items, legislative_events, legislative_votes, legislative_roles, parliamentary_participations | REAPROVEITAR + criar camada operacional |
| Municípios | municipalities | REAPROVEITAR + relacionar com operações futuras |
| Auditoria | audit_logs | REAPROVEITAR |
| Configuração | site_settings | ADAPTAR e separar conceito de configuração institucional |
| Tarefas | nenhuma entidade dedicada encontrada | CRIAR somente após definir o modelo mínimo |

### 27.3 Atendimento já possui o núcleo necessário

A tabela demands já possui protocolo, token de acompanhamento, dados do cidadão, município, categoria, assunto, descrição, anexos, responsável, prioridade, status e timestamps. Existem também mensagens e histórico.

Conclusão: **não criar um novo CRM para o gabinete**. O Atendimento deve evoluir sobre essa estrutura.

### 27.4 Agenda já possui entidade própria

events possui título, descrição, início/fim, local, município, mídia, link, participantes, visibilidade, status e criador.

Isso é suficiente para iniciar a reorganização da Agenda sem criar outra tabela de compromissos.

### 27.5 Mandato já possui base documental e verificável

```
legislative_items
 ├── legislative_events
 ├── legislative_votes
 ├── legislative_roles
 ├── documents
 └── parliamentary_participations
```

Várias entidades possuem source_url e verification_status.

Conclusão: **não criar uma segunda base legislativa para o dashboard**.

### 27.6 CMS atual pode ser mantido como infraestrutura

A estrutura pages → page_blocks → page_versions já suporta páginas, blocos e versionamento.

O redesign deve alterar principalmente a experiência de gestão, não substituir o mecanismo de páginas.

### 27.7 Equipe e permissões

A base atual possui profiles e user_roles, com os papéis ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO e VISUALIZADOR.

Isso é melhor do que codificar cargos específicos do gabinete, mas ainda é um modelo simples de papel único por usuário. A evolução futura deve avaliar permissões por área antes de introduzir uma matriz mais granular.

### 27.8 Segurança — ponto crítico encontrado

A auditoria das políticas RLS encontrou uma política demands_public_select aplicada a anon com condição USING (true).

Isso significa que a tabela demands, que contém nome, e-mail, telefone, município, assunto e descrição do cidadão, está configurada para permitir SELECT anônimo no nível do banco.

Isso é incompatível com o princípio de privacidade esperado para o Atendimento.

**Classificação: BLOQUEADOR DE SEGURANÇA.**

A correção deve ser tratada separadamente do redesign do dashboard e deve preservar o fluxo público de criação e consulta por protocolo/token sem expor a coleção inteira de demandas.

Não alterar a política diretamente nesta etapa de auditoria.

### 27.9 Funções de autorização

As políticas administrativas usam private.is_staff() e private.has_role(role). Ambas são SECURITY DEFINER, estão no schema private, possuem search_path explícito e consultam auth.uid() contra user_roles.

A implementação atual é coerente com a necessidade de consultar autorização sob RLS, mas deve permanecer sob revisão de segurança antes de ampliar o modelo de permissões.

### 27.10 Advisor de segurança

O Security Advisor atual retornou um único alerta: **Leaked Password Protection Disabled**. Esse alerta é independente do redesign do Gabinete OS e deve ser tratado na trilha de segurança/Auth.

### 27.11 Resultado final da classificação

```
REAPROVEITAR
├── Atendimento
├── Agenda
├── CMS/Page Builder
├── Notícias
├── Mídia
├── Documentos
├── Mandato
├── Municípios
├── Auditoria
└── Equipe

ADAPTAR
├── Configurações
├── Workflow editorial
├── Permissões
└── experiência do CMS

CRIAR
└── Tarefas (modelo mínimo ainda não definido)

BLOQUEADOR
└── RLS de leitura pública da tabela demands
```

### 27.12 Regra para a próxima fase

A partir desta auditoria, **não há justificativa para criar uma nova arquitetura de dados do dashboard**. A implementação futura deve trabalhar sobre as entidades existentes e criar somente as lacunas comprovadas.

A próxima etapa de produto passa a ser a definição do **Mapa Operacional do Gabinete**.

Antes disso, o bloqueador de RLS de demands deve ser encaminhado para correção de segurança, independentemente do redesign visual.

---

## 19. Evolução deste documento

Este documento é o ponto de partida.

As próximas discussões devem atualizar este arquivo à medida que:

- a auditoria revelar o que já existe;
- novas necessidades do gabinete forem identificadas;
- decisões de produto forem tomadas;
- funcionalidades forem priorizadas;
- fluxos forem validados;
- o modelo de dados for confirmado;
- o CMS for redesenhado;
- as integrações com fontes oficiais forem tecnicamente confirmadas.

As decisões posteriores devem substituir ou complementar esta proposta neste mesmo documento, evitando que o conhecimento fique disperso no histórico da conversa.

---

## 20. Status atual

**Fase atual: descoberta / auditoria / pesquisa institucional.**

Nenhuma decisão de implementação definitiva foi tomada sobre a nova arquitetura do dashboard.

### Artefatos esperados

1. **Auditoria do Dashboard e CMS Atual**
2. **Mapa Operacional do Gabinete**
3. **Matriz de Integrações ALRS/Estado**
4. **Arquitetura funcional**
5. **Redesign do CMS**
6. **Implementação incremental**
7. **QA**

**Regra de execução:** não iniciar uma refatoração estrutural do dashboard antes da auditoria do estado atual e da confirmação das entidades, APIs e fluxos que já existem.
