# FASE 7 — Reconstrução da Home V2

**Status:** concluída em 2026-09-18

## Objetivo

Fazer a página inicial funcionar como portal institucional, concentrando as principais informações públicas em uma jornada única e reutilizando os componentes e fontes já existentes.

## Estrutura entregue

1. **Hero institucional**
   - nome e função;
   - atuação pública;
   - fotografia;
   - acesso à atuação;
   - acesso ao canal **Fale com o Deputado**.

2. **Trajetória**
   - resumo factual;
   - acesso à trajetória/atuação completa.

3. **Atuação parlamentar**
   - proposições;
   - votações;
   - autoria/relatoria;
   - documentos;
   - registros provenientes do acervo legislativo existente.

4. **Resultados**
   - seção existente de resultados, sem criação de fatos ou registros paralelos.

5. **Transparência**
   - entrada direta para a política de publicação e consulta do acervo.

6. **Agenda**
   - seção pública existente.

7. **Notícias**
   - destaque limitado a três itens na Home;
   - consulta integral permanece na página de notícias.

8. **Vídeos**
   - acervo audiovisual existente.

9. **Contato**
   - jornada final com o fluxo canônico **Fale com o Deputado**.

## Regra arquitetural

A Home V2 não cria um segundo banco, uma segunda API ou uma segunda fonte de conteúdo. Ela compõe componentes existentes que recebem dados pelo `AppContext` e pelos endpoints públicos já utilizados pelo portal.

A página CMS continua disponível para administração das páginas internas; a Home institucional passa a ter uma composição canônica própria em `HomeView`.

## Critério

**Atendido:** a Home responde, em uma única jornada, quem é, qual é a atuação, onde consultar proposições/votações/documentos/resultados, onde encontrar transparência, agenda, notícias, vídeos e como entrar em contato.
