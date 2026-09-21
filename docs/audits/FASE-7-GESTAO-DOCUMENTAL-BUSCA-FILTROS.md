# FASE 7 — Gestão Documental: Busca e Filtros

**Status:** concluída  
**Data:** 2026-09-20

## Objetivo

Tornar a classificação e o contexto documental operacionalmente pesquisáveis no módulo Gestão Documental, sem criar outro acervo ou duplicar dados.

## Implementado

A interface administrativa agora possui:

- busca textual;
- filtro por tipo;
- filtro por categoria;
- filtro por status;
- filtro por visibilidade;
- limpeza dos filtros em uma ação;
- contador de resultados;
- paginação preservada sobre os resultados filtrados.

### Busca textual

A busca considera o contexto já carregado do documento:

- título;
- tipo;
- categoria;
- status;
- visibilidade;
- fonte;
- observações;
- tags;
- código da proposição;
- título da proposição.

## Arquitetura

A Fase 7 usa os 224 documentos já existentes e faz a filtragem no módulo administrativo.

Não foi criada:

- tabela de busca;
- índice paralelo;
- segundo acervo;
- endpoint duplicado;
- mecanismo externo de pesquisa.

A busca permanece sobre a entidade canônica public.documents.

## Verificação

Estado atual do acervo:

- 224 documentos;
- 212 vinculados a proposições;
- 12 sem proposição.

A paginação existente continua funcionando sobre o conjunto filtrado.

## Próxima fase

**Fase 8 — Controle de acesso**

Objetivo: separar efetivamente documentos públicos, internos e restritos, incluindo a revisão do bucket atualmente público e a estratégia de URLs assinadas/políticas de acesso.
