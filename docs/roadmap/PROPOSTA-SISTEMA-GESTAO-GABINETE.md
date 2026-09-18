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
