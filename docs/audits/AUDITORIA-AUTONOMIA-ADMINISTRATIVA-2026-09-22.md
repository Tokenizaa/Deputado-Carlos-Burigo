# AUDITORIA — AUTONOMIA ADMINISTRATIVA DA PLATAFORMA

**Data:** 2026-09-22  
**Branch auditada:** `main`  
**Escopo:** Configurações, Administração/Equipe, Conteúdo, Operação, Gestão Documental, RBAC e regras persistentes de comportamento.

## 1. Objetivo

Verificar se a plataforma permite ao gabinete administrar seus comportamentos operacionais sem depender de alterações de código, distinguindo:

- o que já é configurável;
- o que possui implementação real, mas permanece codificado;
- o que deve ser administrado em outro módulo;
- o que é corretamente técnico e não deve virar configuração;
- quais lacunas impedem uma autonomia administrativa coerente.

A auditoria foi feita sobre o estado real documentado no repositório e sobre o histórico de implementação relevante, sem tratar backlog histórico como estado atual.

## 2. Fontes auditadas

Foram considerados, entre outros:

- `docs/roadmap/ROADMAP-CANONICO.md`
- `docs/roadmap/FASE-13.5-RECONSTRUCAO-CONFIGURACOES.md`
- `docs/roadmap/FASE-13.6-PRIMEIRO-CONTROLE-PERSISTENTE.md`
- `docs/security/RBAC-CONFIGURAVEL-2026-09-22.md`
- `docs/roadmap/FASE-13.2...` — inventário de leitores/escritores de configurações
- implementação atual de `AdminSettingsTab`
- implementação atual de `AdminUsersTab`
- histórico de commits relacionados a Settings, RBAC, Conteúdo, SEO/privacidade, equipe e gestão documental.

Commits de referência:

- `1de1ecabc1cdb900a583f628670cf82356b7137d` — simplificação atual de Configurações
- `d57cff65f65cb8137849d4236e3cee11c8208232` — primeiro controle persistente
- `0025999777ad0f9640b1a0b76c0e0c03abf4f90c` — inventário de leitores/escritores
- `9156069514221d1de64ca32914d6f6450b97c7ef` — modelo RBAC configurável
- `042dec0a5e481ce8ead28601acf8fc3d84fdcbff` — permissões por role em Configurações
- `e665648346a68e69adcde0cbbf102702a6e3ac9b` — evolução da gestão da equipe
- `7c881bc8c5c8a38c591bb73d2fb9ea2b979a407f` — consolidação de SEO e privacidade em Conteúdo
- `3d6bb10e65ddfd521726e7cae72dd3e4c7387232` — governança documental.

## 3. Conclusão executiva

A plataforma **já possui uma base real de autonomia administrativa**, mas o modelo ainda não está completo nem formalmente catalogado.

O problema identificado não é simplesmente "faltam opções na tela Configurações". O ponto principal é a ausência de um **catálogo de capacidades administrativas da plataforma**, com definição explícita de quem administra cada comportamento e em qual módulo.

A regra atual de não criar controles fictícios está correta. Porém, ela não deve ser interpretada como:

> somente aquilo que já virou configuração pode ser administrado.

A regra correta deve ser:

> toda regra operacional real que precise ser governada pelo gabinete deve ser identificada, ter um proprietário de módulo definido e, quando fizer sentido, possuir persistência e controle administrativo; somente parâmetros puramente técnicos permanecem fora da administração da aplicação.

## 4. O que já é realmente configurável

### 4.1 Acesso e permissões

Existe uma evolução real para RBAC configurável.

As roles continuam como presets:

- ADMIN
- EDITOR
- COMUNICACAO
- ATENDIMENTO
- VISUALIZADOR

O modelo já contempla permissões persistentes por módulo/ação e estruturas para overrides de convite e usuário.

A interface de Configurações permite editar permissões padrão por role. A documentação de RBAC ainda registra pendências de UI, resolução efetiva, enforcement completo e testes.

**Estado:** IMPLEMENTADO PARCIALMENTE / EM VALIDAÇÃO NA FASE 4.

### 4.2 Recebimento de demandas

Existe o primeiro controle comportamental persistente:

`platform_settings.citizen_demand_enabled`

Ele possui consumidor público, enforcement no servidor, controle administrativo e auditoria.

**Estado:** CONFIGURÁVEL E PERSISTENTE.

### 4.3 Conteúdo público

Conteúdo institucional, SEO público e política de privacidade foram deslocados para o domínio Conteúdo.

Isso é uma decisão correta de ownership: não transformar Configurações em CMS.

**Estado:** ADMINISTRÁVEL NO MÓDULO CORRETO.

## 5. Matriz de autonomia administrativa

| Capacidade | Domínio responsável | Estado atual | Deve ser administrável? | Destino |
|---|---|---|---|---|
| Identidade e textos públicos | Conteúdo | Implementado em Conteúdo | Sim | Conteúdo |
| SEO padrão / Open Graph | Conteúdo | Implementado em Conteúdo | Sim | Conteúdo |
| Política de privacidade pública | Conteúdo | Implementada em Conteúdo | Sim | Conteúdo |
| Permissões por role | Administração/Configurações | Persistente e parcialmente validada | Sim | Configurações + Administração |
| Overrides de convite | Administração | Backend existente; UI pendente | Sim | Administração |
| Overrides individuais | Administração | Estrutura persistente existente; UI pendente | Sim | Administração |
| Pessoas/equipe | Administração | Implementado | Sim | Administração |
| Distribuição de tarefas | Operação/Administração | Implementado | Sim | Operação |
| Recebimento de novas demandas | Configurações/Atendimento | Persistente | Sim | Configurações |
| Tratamento das demandas | Operação | Implementado | Sim | Operação |
| Agenda | Operação | Implementada | Sim | Operação |
| Gestão documental | Gestão Documental | Módulo próprio | Sim, dentro do domínio | Gestão Documental |
| Regras editoriais | Conteúdo | Módulo próprio | Sim | Conteúdo |
| Auditoria | Governança | Implementada | Consulta/administração conforme permissão | Auditoria |
| Estado da sessão/usuário | Sistema | Informativo | Não como configuração de negócio | Sistema |
| Parâmetros técnicos de infraestrutura | Infraestrutura | Fora do produto | Não | Técnico |
| Feature flags genéricos | Configurações | Não implementado | Somente quando houver regra real | Avaliar por caso |
| Modo manutenção genérico | Configurações | Não implementado | Não justificado pelo estado auditado | Não criar sem consumidor |
| Configuração arbitrária de limites | Configurações | Não implementado | Não sem regra operacional definida | Avaliar por caso |
| Integrações externas | Técnico/Operação | Variável | Conforme integração real | Definir por domínio |

## 6. Principais lacunas encontradas

### 6.1 Falta de catálogo de capacidades

A documentação atual descreve as configurações existentes, mas não estabelece uma lista completa das capacidades que o gabinete deve conseguir governar.

Sem esse catálogo, existe risco de dois erros opostos:

1. criar configurações artificiais apenas para "preencher" a tela;
2. manter regras operacionais relevantes permanentemente codificadas sem decisão explícita sobre sua administrabilidade.

### 6.2 Fronteira entre Configurações e Administração ainda precisa ser formalizada

RBAC, equipe, convites e overrides possuem relação direta, mas não são necessariamente a mesma coisa.

A separação recomendada é:

- **Configurações:** comportamento global da plataforma;
- **Administração:** pessoas, papéis, acesso e governança administrativa;
- **Operação:** execução diária de demandas, tarefas, agenda e fluxos;
- **Conteúdo:** informação pública/editorial;
- **Gestão Documental:** regras e operação documental;
- **Técnico:** infraestrutura e parâmetros que não representam decisão de negócio.

### 6.3 RBAC ainda não representa autonomia completa

O modelo configurável já existe, mas a própria documentação registra pendências:

- UI de permissões específicas em convite;
- UI de overrides por usuário;
- resolução de permissões efetivas no frontend;
- enforcement completo nos endpoints;
- testes role × permissão × ação;
- validação Playwright por role.

Portanto, a existência da configuração não deve ser confundida com autonomia totalmente validada.

### 6.4 Nem toda autonomia deve estar na página Configurações

A auditoria confirma que centralizar tudo em Configurações seria um erro.

Exemplos:

- editar texto institucional pertence a Conteúdo;
- administrar pessoas pertence a Administração;
- trabalhar uma demanda pertence a Operação;
- administrar documentos pertence a Gestão Documental;
- parâmetros de infraestrutura continuam técnicos.

Autonomia significa **governança distribuída por domínio**, e não uma única tela com todos os controles.

## 7. Modelo canônico proposto

A plataforma deve adotar o seguinte princípio:

`Capacidade administrativa → domínio proprietário → permissão → persistência → consumidor → auditoria → validação`

Para cada capacidade real, deve ser possível responder:

1. O que pode ser alterado?
2. Quem pode alterar?
3. Onde a alteração é feita?
4. Onde é persistida?
5. Qual código consome o valor?
6. O que acontece quando o valor muda?
7. A alteração precisa ser auditada?
8. Como se valida que a alteração realmente produz o comportamento esperado?

Se essas respostas não existirem, a capacidade ainda não deve ser considerada autonomamente administrável.

## 8. Limites da autonomia

A plataforma não precisa transformar toda decisão técnica em configuração.

Devem permanecer predominantemente técnicos:

- infraestrutura;
- credenciais e segredos;
- arquitetura de execução;
- detalhes de deploy;
- tuning de baixo nível;
- parâmetros sem significado operacional para o gabinete;
- mecanismos internos cuja alteração possa comprometer segurança ou integridade.

A administração deve controlar **regras de negócio e operação**, não detalhes de implementação.

## 9. Próxima ação recomendada

Não implementar novos toggles ou ampliar a tela Configurações imediatamente.

Primeiro, usar esta auditoria como referência para uma **matriz completa de capacidades administrativas**, cobrindo todos os módulos existentes.

Para cada capacidade, registrar:

- capacidade;
- domínio;
- módulo responsável;
- role/permissão necessária;
- estado atual;
- persistência;
- consumidor;
- auditoria;
- dependência de código;
- decisão: já configurável / tornar configurável / mover de módulo / permanecer técnico;
- critério objetivo de aceite.

Essa matriz deve ser concluída antes de novas decisões de arquitetura de Configurações.

## 10. Relação com o roadmap canônico

Esta auditoria é **documentação transversal**, não uma nova fase operacional.

O `ROADMAP-CANONICO.md` determina que o ciclo atual permanece na **FASE 4 — Segurança e Acesso**.

Portanto:

- não criar uma nova FASE 13.7 no roadmap canônico;
- manter os documentos 13.x como histórico de reconstrução/auditoria;
- usar esta auditoria como insumo para a continuidade da FASE 4 e para o próximo ciclo funcional;
- qualquer implementação futura deve ser incorporada à fase canônica correspondente.

## 11. Critério de encerramento desta auditoria

A auditoria documental está concluída quando:

- a separação de responsabilidades entre módulos estiver registrada;
- as capacidades administrativas já existentes estiverem identificadas;
- as lacunas de autonomia estiverem explicitadas;
- nenhuma configuração fictícia for criada apenas por completude visual;
- o roadmap canônico continuar sendo a única fonte da sequência operacional.

**Status:** AUDITORIA CONCLUÍDA — SEM IMPLEMENTAÇÃO.
