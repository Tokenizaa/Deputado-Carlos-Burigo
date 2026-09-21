# FASE 10 — Gestão Documental: Histórico e governança

**Status:** concluída  
**Data:** 2026-09-20

## Objetivo

Registrar alterações administrativas relevantes do acervo documental usando a trilha de auditoria já existente na plataforma.

## Implementação

Foi reutilizada a tabela canônica existente `public.audit_logs`.

Não foi criada uma tabela de histórico documental paralela.

As operações de Gestão Documental agora registram:

- criação de documento;
- atualização de documento.

Cada registro guarda:

- usuário;
- papel;
- ação;
- entidade;
- ID do documento;
- campos alterados, no caso de atualização;
- contexto documental relevante;
- data/hora.

## Governança

O histórico é consultável pela infraestrutura administrativa já existente em `/api/audit-logs`.

A escrita do log acontece no backend, depois da operação documental autorizada. O usuário não informa manualmente o autor da alteração.

A informação de contexto evita armazenar o arquivo ou conteúdo integral no log; o histórico registra metadados da operação.

## Estado verificado

A tabela `public.audit_logs` já existia e estava vazia no momento da implantação da fase.

Isso significa que os novos registros passam a representar alterações realizadas a partir desta implementação, sem inventar histórico retroativo.

## Decisão arquitetural

Mantido o princípio das fases anteriores:

`public.documents` continua sendo a entidade documental única.

`public.audit_logs` permanece como trilha transversal de governança da plataforma.

Não foram criadas versões duplicadas de documentos nem tabelas específicas de histórico.

## Próxima fase

**Fase 11 — Automação documental.**
