# FASE 9 — Atuação Parlamentar

**Status:** CONCLUÍDA  
**Checkpoint:** `45b8386f35d0b8f5776efacef4b8e35b56880af2`

## Objetivo

Transformar o acervo legislativo existente em uma experiência pública compreensível, sem criar uma segunda fonte de dados.

## Implementado

A página canônica de atuação já utilizava `/api/legislative` e os contratos públicos existentes. Nesta fase ela foi consolidada para:

- manter `legislative_items` como fonte canônica;
- filtrar proposições por período, tipo e situação;
- apresentar votações nominais ligadas às matérias publicadas;
- apresentar autoria, relatoria e outras participações registradas;
- permitir acesso à fonte oficial quando o registro fornece `sourceUrl`;
- manter o acervo documental ligado às proposições;
- deixar explícito quando comissões ou discursos não possuem dados estruturados publicáveis na fonte canônica, sem fabricar registros.

## Experiência

A área permanece simples e orientada à consulta:

- Visão geral
- Proposições
- Votações
- Participações
- Acervo documental

Os detalhes continuam em superfície contextual, preservando a navegação do portal.

## Governança

Nenhuma tabela, API ou base legislativa paralela foi criada.

Não foram criados registros de comissões, discursos ou relatorias sem evidência no acervo existente.

## Critério

- [x] fonte legislativa canônica preservada;
- [x] proposições consultáveis;
- [x] votações consultáveis;
- [x] participações/relatorias disponíveis quando verificadas;
- [x] filtros simples;
- [x] fonte oficial identificável quando disponível;
- [x] sem banco legislativo duplicado.

## Limitação

A validação de build e browser de produção não foi executada nesta rodada.
