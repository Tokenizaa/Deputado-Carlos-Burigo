# FASE 10 — Resultados e pautas

**Status:** CONCLUÍDA

## Objetivo

Apresentar resultados e pautas somente quando houver base verificável no acervo público existente.

## Execução

- [x] resultados continuam vindo de `/api/results`, com Supabase como fonte canônica;
- [x] registros de resultado são apresentados somente quando vinculados a proposição legislativa publicada;
- [x] categoria, data e município são exibidos quando disponíveis;
- [x] cada resultado exibe a base legislativa relacionada e o estado de verificação;
- [x] fonte oficial da proposição é apresentada quando disponível;
- [x] filtros simples por categoria e município;
- [x] registros sem vínculo legislativo publicável não são apresentados como resultados factuais;
- [x] corrigida referência residual a `projectParticipation` no filtro de proposições;
- [x] removido da Home o bloco CMS residual que referenciava `sortedBlocks/renderBlock` após a canonização da Home V2.

## Regra factual

Nenhum texto novo foi criado para afirmar uma realização política específica. A camada de apresentação apenas expõe dados já publicados e seus vínculos verificáveis.

## Arquitetura

Nenhuma tabela, API ou fonte paralela foi criada.

## Arquivos principais

- `src/components/public/ResultsSection.tsx`
- `src/components/public/ActionsAndProjectsSection.tsx`
- `src/App.tsx`
