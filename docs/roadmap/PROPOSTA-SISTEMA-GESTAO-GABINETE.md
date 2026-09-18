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

## 16. Evolução deste documento

Este documento é o ponto de partida.

As próximas discussões devem atualizar este arquivo à medida que:

- a auditoria revelar o que já existe;
- novas necessidades do gabinete forem identificadas;
- decisões de produto forem tomadas;
- funcionalidades forem priorizadas;
- fluxos forem validados;
- o modelo de dados for confirmado;
- o CMS for redesenhado.

As decisões posteriores devem substituir ou complementar esta proposta neste mesmo documento, evitando que o conhecimento fique disperso no histórico da conversa.

---

## 17. Status inicial

**Fase atual: descoberta / auditoria.**

Nenhuma decisão de implementação definitiva foi tomada sobre a nova arquitetura do dashboard.

O próximo artefato esperado é:

**Auditoria do Dashboard e CMS Atual**

Depois da auditoria:

**Mapa Operacional do Gabinete → Arquitetura funcional → Redesign do CMS → Implementação incremental → QA.**
