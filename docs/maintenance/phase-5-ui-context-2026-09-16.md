# Fase 5 — Separação do estado transversal de UI

**Data:** 2026-09-16  
**Branch:** `maintenance/canonical-domains-phase-1`

## Objetivo

Reduzir a responsabilidade do `AppContext` sem criar uma segunda fonte de estado e sem quebrar os consumidores existentes.

## Implementação

Foi criado:

`src/context/AppUiContext.tsx`

Responsabilidades extraídas:

- `currentView`;
- `selectedNewsSlug`;
- `trackingProtocol`;
- `isProtocolModalOpen`;
- navegação de visão;
- abertura de detalhe de notícia;
- abertura e fechamento do modal de protocolo.

O `AppContext` deixou de possuir esses estados e passou a consumir `useAppUi()` apenas para manter compatibilidade com a API existente de `useApp()`.

## Compatibilidade

Os componentes existentes continuam podendo usar `useApp()` sem migração em massa nesta fase.

Isso permite que as próximas fases migrem consumidores individualmente, sem duplicar estado nem introduzir uma segunda arquitetura de dados.

A composição dos providers foi atualizada em `src/App.tsx`:

`AppUiProvider → AppProvider → aplicação`

## Preservação

Não houve:

- alteração de banco;
- alteração de API;
- alteração das fontes de dados;
- criação de estado duplicado;
- alteração da `main` como objetivo da fase.

O estado de UI agora possui uma única fonte no `AppUiContext`; `AppContext` funciona apenas como camada de compatibilidade para os consumidores legados.

## Validação estrutural

A branch contém os três elementos esperados:

1. `src/context/AppUiContext.tsx`;
2. `src/context/AppContext.tsx` consumindo `useAppUi()`;
3. `src/App.tsx` compondo os providers.

A validação de compilação automática ainda depende da execução do ambiente local/CI do projeto.
