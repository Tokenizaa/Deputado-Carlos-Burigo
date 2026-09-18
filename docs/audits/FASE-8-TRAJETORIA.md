# FASE 8 — Trajetória

**Status:** CONCLUÍDA  
**Data:** 2026-09-18  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`

## Objetivo

Tornar a trajetória pública consultável em uma página institucional própria, com linha do tempo cronológica, contexto de cada etapa e indicação da fonte utilizada.

## Implementação

### Página canônica

Criada:

`src/components/public/TrajectoryView.tsx`

Rota:

`/trajetoria`

A página organiza sete períodos:

1. Origem e formação inicial;
2. Formação e início profissional;
3. Administração municipal em São José dos Ausentes;
4. Gestão pública em Caxias do Sul;
5. Governo do Estado do Rio Grande do Sul;
6. Primeiro período na Assembleia Legislativa;
7. Segundo período parlamentar.

### Evidência

A linha do tempo identifica a fonte de cada etapa. O conteúdo foi baseado no inventário documental já existente no repositório e conferido com a biografia pública publicada pela Câmara Municipal de Caxias do Sul em 2024:

https://www.camaracaxias.rs.gov.br/noticias/index/29462

Não foi criada tabela, API ou fonte paralela.

### Integração

`src/App.tsx` passou a distinguir:

- `/sobre` → perfil institucional existente;
- `/trajetoria` → nova página cronológica canônica.

A Home continua utilizando `TrajectorySection` como resumo e CTA para atuação parlamentar.

## Princípios preservados

- sem novo banco;
- sem nova API;
- sem conteúdo fictício;
- linguagem factual;
- fonte indicada por etapa;
- acessibilidade semântica;
- corpo textual confortável;
- foco visível;
- navegação por teclado;
- reutilização do AppContext existente.

## Validação estrutural

- [x] página `/trajetoria` criada;
- [x] rota conectada ao App;
- [x] timeline cronológica;
- [x] períodos e cargos/contextos identificados;
- [x] fonte indicada em cada etapa;
- [x] links para aprofundamento via áreas existentes;
- [x] nenhuma nova estrutura de dados criada.

## Limitação

A validação visual/build de produção não foi executada nesta rodada. O checkpoint representa a implementação estrutural da fase; a validação runtime deve ser feita no fluxo geral de validação do projeto.

## Checkpoint

`d9ef91a3f341941b53d4b3e811f4a6fafa0b71fa`
