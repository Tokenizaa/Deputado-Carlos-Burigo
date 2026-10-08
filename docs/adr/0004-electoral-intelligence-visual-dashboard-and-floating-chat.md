# ADR-0004 — Dashboard analítico e chat flutuante

- **Status:** Aceito
- **Data:** 2026-10-08
- **Contrato UX:** `docs/design/INTELIGENCIA-ELEITORAL-UX-2026-10-08.md`

## Contexto

A experiência precisa apoiar exploração visual e análise eleitoral profissional sem exigir domínio estatístico do usuário. O dashboard e o chat não podem competir pelo controle da interface.

## Decisão

Manter o dashboard analítico como superfície principal e o chat como painel flutuante independente. Ambos compartilham contexto explícito e resultados estruturados da mesma camada analítica. A seleção de candidato e eleição atualiza o cenário; gráficos, mapas, tabelas e filtros compatíveis permanecem sincronizados e permitem detalhamento interativo.

Insights e relatórios apresentam conclusões em linguagem simples com números, método, fonte e limitações. Cálculos canônicos são determinísticos e testáveis; a LLM interpreta resultados e organiza investigações, mas não inventa dados nem substitui as fórmulas.

## Restrições

- Reutilizar Dashboard de Gabinete, AdminWorkspace/AdminLayout, navegação, roteamento, RBAC e componentes existentes.
- Não criar dashboard, backend, banco ou motor analítico paralelo.
- Não apresentar dados fictícios como reais.
- Respeitar os gates de cobertura eleitoral definidos no roadmap.
- Executar em até cinco fases, com testes, evidências, commits e merge das branches concluídas.

## Consequências

A seleção e os filtros precisam de contexto explícito compartilhado. Toda visualização deve permitir conferir a origem dos resultados e, quando possível, detalhar os dados. O trabalho começa por auditoria do frontend e avança incrementalmente.

## Alternativas rejeitadas

- Chat que substitui ou controla implicitamente o dashboard.
- Formulários obrigatórios para cada pergunta.
- Gráficos decorativos sem conexão com dados reais.
- Arquitetura paralela ou fragmentação excessiva em microfases.
