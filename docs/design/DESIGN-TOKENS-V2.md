# Sistema Visual — Design Tokens V2

**Fase:** 2 — Sistema visual e Design Tokens  
**Data:** 2026-09-18  
**Fonte:** Brand Book V2 + auditoria da Fase 1

## Objetivo

Estabelecer uma única base visual para o portal antes da reconstrução das páginas.

A implementação mantém os nomes de compatibilidade existentes para evitar uma segunda arquitetura de estilos, mas passa a organizar os valores por intenção semântica.

## Tokens

### Marca

| Token | Valor | Uso |
|---|---|---|
| `--brand-primary` | `#008740` | ações e elementos de marca em fundo claro |
| `--brand-primary-strong` | `#006B32` | links, foco e estados de maior contraste |
| `--brand-primary-soft` | `#E8F5EE` | superfície de apoio |
| `--brand-secondary` | `#E1F200` | acento visual; não usar como texto |
| `--brand-accent` | `#ED1C24` | identidade/acento visual; não usar como texto sobre branco |
| `--status-danger` | `#B91C1C` | texto/estado de erro quando contraste for necessário |

### Superfícies

- `--surface`: branco.
- `--surface-muted`: cinza muito claro.
- `--surface-elevated`: branco.
- `--surface-dark`: #111111.
- `--surface-dark-elevated`: #171717.

### Texto

- `--text-primary`: #111111.
- `--text-secondary`: #3F3F46.
- `--text-muted`: #52525B.
- `--text-inverse`: #FFFFFF.

### Interface

- `--border`: #D4D4D8.
- `--border-strong`: #A1A1AA.
- `--focus`: #006B32.
- `--link`: #006B32.

## Contraste validado

Relações calculadas para as combinações principais:

| Primeiro plano | Fundo | Contraste | Uso |
|---|---|---:|---|
| #008740 | #FFFFFF | 4,63:1 | marca/ação |
| #006B32 | #FFFFFF | 6,67:1 | link/foco/ação prioritária |
| #111111 | #FFFFFF | 18,88:1 | texto principal |
| #3F3F46 | #FFFFFF | 10,44:1 | texto secundário |
| #52525B | #FFFFFF | 7,73:1 | texto auxiliar |
| #E1F200 | #111111 | 15,20:1 | acento sobre superfície escura |
| #ED1C24 | #FFFFFF | 4,38:1 | **não usar como texto** |

O eMAG recomenda pelo menos 4,5:1 para texto e apresenta 7:1 como referência de alto contraste. Também exige que o layout permaneça funcional em redimensionamento de até 200%. citeturn0search0turn0search12

## Tipografia

A fonte externa anterior foi removida do HTML.

A pilha canônica agora é:

`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Regras:

- corpo: 16px mínimo;
- leitura: priorizar 17–18px nos componentes de conteúdo;
- controles: 16px ou maior;
- H1: escala máxima atual de 64px;
- H2: escala máxima atual de 44px;
- não reduzir conteúdo para caber em uma linha;
- permitir quebra natural;
- preservar zoom do navegador.

## Movimento

O sistema não depende de animação para comunicar função.

`prefers-reduced-motion: reduce` reduz animações e transições globais.

## Glassmorphism

Os estilos `glass-card-dark` e `glass-card-light` foram neutralizados para compatibilidade com componentes antigos:

- sem `backdrop-filter`;
- sem blur decorativo;
- sem transparência usada como elemento estrutural;
- superfície sólida;
- borda semântica;
- sem sombra obrigatória.

Não foi criada uma segunda classe para substituir o glass.

## Scrollbar

A scrollbar utiliza os tokens de superfície/borda e não uma cor de marca diretamente.

## Compatibilidade

Os aliases:

- `--mdb-green`;
- `--mdb-green-dark`;
- `--mdb-yellow`;
- `--mdb-red`;
- `--deep-black`;
- `--dark-surface`;
- `--dark-surface-elevated`

permanecem para evitar quebra desnecessária de componentes existentes.

## Critério para as próximas fases

Componentes novos devem consumir tokens semânticos.

Componentes existentes só devem ser convertidos quando forem tocados por uma fase de implementação, evitando uma migração indiscriminada que crie regressões.

## Estado

**Fase 2 — sistema visual base concluída.**

A próxima fase é a **Fase 3 — Acessibilidade estrutural**.
