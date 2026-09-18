# Fase 9 — Auditoria Legislativa (2026-09-17) + Batch 02

## Escopo

Auditoria das 6 tabelas legislativas do domínio votos (branch `main`, HEAD `f932f2e`):
`legislative_items` (22), `legislative_roles` (17→46), `legislative_events` (11→26),
`legislative_votes` (3→5), `parliamentary_participations` (57), `evidence` (60→66).

Método: fonte primária ALRS (`https://ww4.al.rs.gov.br/proposicao/<TIPO>/<N>/<ANO>`) consultada
diretamente para **todas as 21 proposições catalogadas** + lei sancionada. Nenhuma inserção sem
evidência; toda correção mantém origem no banco (source_url/source_name).

## Correções aplicadas

### legislative_items (20 updates)
- **Títulos completos** para 8 itens que estavam só com código: PL 280/2019 (Rodovia Prefeito
  Antonio Giordano da Costa), PL 480/2021 (cervejas/chopes artesanais), PL 318/2023 (PCCS
  Serviços Auxiliares do MP), PL 83/2023 (Juro Zero RS), PL 183/2025 (Free Flow), PL 190/2025
  (PID), PL 100/2021 (alteração Lei ICMS), PL 332/2025 (Política Agrícola Florestas Plantadas)
- **summary = ementa oficial** (17 itens)
- **source_url = ficha ALRS** para todos os itens que tinham fonte fraca/blog ou null
- **notes com situação real primária** — divergências críticas encontradas:
  - PL 178/2020: banco PUBLISHED vs real **Prejudicado(a)** (06/04/2021); proponente Vilmar
    Zanchin + 7 (Búrigo coautor — mantido)
  - PL 190/2025: banco DRAFT/título vazio vs real **Sancionado(a)** (10/12/2025); proponente
    Poder Judiciário; relatoria CCJ de Búrigo
  - PL 183/2025: banco DRAFT vs real **Arquivado(a)** (02/04/2026); proponente Búrigo
  - PL 60/2021: banco DRAFT vs real **Sancionado(a)** (30/05/2022)
  - PL 265, 266, 388, 132/2024 e PL 318/2023, PLC 143/2020: banco DRAFT vs real **Sancionados**
  - PL 83/2023, PL 481/2023, PL 243/2021, PL 480/2021: banco DRAFT vs real **Arquivados**
  - PL 280/2019: real "Para Parecer" (desarquivado 01/02/2023)
  - RDI 19/2022: real "Concluído — Transformado em PDL"

### legislative_events (2 updates + 15 inserts)
- Datas de sanção corrigidas por fonte primária: PL 292/2019 (05/11/2019, era 20/11/2019),
  PL 362/2019 (17/01/2020, era null)
- Novos: PREJUDICATED (PL 178/2020), SANCTIONED ×9 (PL 190/2025, 318/2023, 60/2021, 265/2023,
  266/2023, 388/2023, 132/2024, PLC 143/2020), ARCHIVED ×5 (PL 183/2025, 83/2023, 481/2023,
  243/2021, 480/2021), REOPENED (PL 280/2019) — todos VERIFIED_PRIMARY com source ALRS

### legislative_roles (29 inserts + 1 update nota)
Relatores confirmados por ficha ALRS (VERIFIED_PRIMARY), incluindo:
- Relatorias de **Carlos Búrigo**: PL 318/2023 (CCJ) e PL 190/2025 (CCJ) — agora com papel
  primário registrado (antes só fonte secundária SIMPE-RS/Sindjus)
- Relatores de pareceres primários: Bonatto, Nadine, Marenco, Eliana Bayer, Frederico Antunes,
  Valdeci Oliveira, Tatsch, Turra, Fernandes, Franciscon, Zucco, Marroni, Somensi, Lins, Mainardi,
  Ostermann, Capitão Martim, Airton Lima
- PL 243/2021: esclarecido conflito — distribuição inicial (Zucco, secundária) vs parecer final
  CCJ (Professor Bonatto, primária ALRS). Nota registrada nas duas roles.

### legislative_votes (2 inserts)
- PL 190/2025: Reunião Ordinária da CCJ 28/10/2025 (Favorável) + Sessão Ordinária 104 02/12/2025
  (Sim) — VERIFIED_PRIMARY (planilhas nominais da ficha ALRS)

### parliamentary_participations (18 updates)
- 17 participações LEGISLATIVE_ITEM elevadas para VERIFIED_PRIMARY com source ALRS
- PL 100/2021 (COAUTHOR): nota registrada — ficha ALRS lista Beto Fantinel + 3 sem citar Búrigo
  nominalmente; coautoria permanece pela FIERGS (fonte secundária) — não confirmada primariamente

### evidence (6 inserts)
Primárias ALRS para itens sem evidência: PL 178/2020, PL 190/2025, PL 318/2023, PL 347/2019,
PL 362/2019, RDI 19/2022

## LACUNAS/DIREÇÕES DE INVESTIGAÇÃO (não resolvidas neste lote)

1. **Votações detalhadas remanescentes**: PL 318/2023 (Sessão 85, 24/10/2023), PL 60/2021,
   PL 265/2023, PL 266/2023, PL 388/2023, PL 132/2024, PL 292/2019 (Sessão 84, 15/10/2019),
   PL 347/2019 (Sessão 12, 03/03/2020), PL 362/2019 (Sessão 108, 18/12/2019) — extrair voto
   de Búrigo das planilhas ALRS → batch 03
2. **LEI 16.032/2023**: proponente não verificado na ALRS (é lei, sem ficha de proposição);
   fonte atual Rádio Solaris (secundária)
3. **Duplicidade estrutural legislative_roles × parliamentary_participations (LEGISLATIVE_ITEM)**:
   mesmos fatos em dois modelos. Roles = domínio legislativo; participations = linha pública de
   exibição. Redundância controlada; requer ADR para consolidar (fora do escopo deste lote)
4. **Flag DRAFT/PUBLISHED** dos items não é situação legislativa — é flag editorial de exibição.
   Situação real vive em events/notes. Não alterado por risco de exibição; decisão de modelo
   pendente de ADR
5. **evidence UNCONFIRMED (9)**: todas com análise documentada (URLs mortas / bloqueios
   anti-bot / referências) — critério "nenhum UNCONFIRMED sem análise" ATENDIDO

## Validação

- Contagens: items 22 (0 título incompleto, 0 sem source) · roles 46 · events 26 · votes 5
  (100% Búrigo) · participations 57 (21 PRIMARY) · evidence 66 (42 PRIMARY, 9 UNCONFIRMED)
- Nenhuma tabela nova, nenhum schema alterado, nenhum dado excluído
- Build/lint: inalterados neste lote (somente dados + docs)