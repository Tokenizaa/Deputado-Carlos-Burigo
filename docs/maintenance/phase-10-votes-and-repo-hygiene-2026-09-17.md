# Fase 10 — Votações Catalogadas + Hygiene de Repo (2026-09-17) + Batch 03

## Escopo

Complemento da auditoria legislativa (fase 9): extração das votações nominais de Carlos Búrigo
nas planilhas oficiais ALRS (`ww4.al.rs.gov.br/proposicao/...`) para as proposições com sessões
registradas. + higiene do repositório (`.wrangler/` tracked).

## Votações registradas (15 novas, VERIFIED_PRIMARY — planilha nominal ALRS)

| Proposição | Sessão | Data | Voto |
|-----------|--------|------|------|
| PL 318/2023 | Reunião Ordinária da CCJ | 2023-09-05 | Favorável |
| PL 318/2023 | Sessão Ordinária 85 | 2023-10-24 | Sim |
| PL 60/2021 | Reunião Ordinária da CCJ | 2022-03-08 | Favorável |
| PL 292/2019 | Reunião Ordinária da CCJ | 2019-09-03 | Favorável |
| PL 292/2019 | Reunião Ordinária da CEDST | 2019-10-09 | Favorável |
| PL 292/2019 | Sessão Ordinária 84 | 2019-10-15 | Sim |
| PL 347/2019 | Sessão Ordinária 12 | 2020-03-03 | Sim |
| PL 362/2019 | Sessão Ordinária 108 | 2019-12-18 | Sim |
| PL 265/2023 | Reunião Ordinária da CCJ | 2025-06-24 | Favorável |
| PL 388/2023 | Reunião Ordinária da CCJ | 2023-11-14 | Favorável |
| PL 388/2023 | Reunião Ordinária da CSMA | 2024-02-28 | Favorável |
| PL 132/2024 | Reunião Ordinária da CCJ | 2025-05-20 | Favorável |
| PL 481/2023 | Reunião Ordinária da CCJ | 2024-04-23 | Favorável |
| PL 280/2019 | Reunião Ordinária da CCJ | 2022-11-01 | Favorável |
| PL 480/2021 | Reunião Ordinária da CCJ | 2022-11-01 | Favorável |

Total `legislative_votes` de Búrigo: 20 (2 PL 190/2025 da fase 9 + 3 PL 332/2025 pré-existentes + 15 novas).

## Itens SEM voto nominal localizado (documentado, não inferido)

- PLC 143/2020: votações CCJ/CSSP/CAM em 2021 — Búrigo não listado (coautor, sem voto na planilha)
- PL 243/2021: CCJ/CECDCT 2024-2025 — Búrigo não listado
- PL 100/2021: CCJ 26/05/2026 — Búrigo não listado
- PL 83/2023: sem votações registradas
- PL 266/2023: CCJ/CSSP 2024 — Búrigo não listado
- RDI 19/2022: indicação — sem voto nominal de parlamentar (situação "Concluído — Transformado em PDL")
- PL 178/2020: prejudicado sem votação ("Nenhuma votação encontrada" na ficha ALRS)

"Sem voto na planilha" ≠ "não votou" — a ausência é registrada, não inferida.

## Hygiene de repositório

- `.wrangler/` (19 arquivos: state v3 miniflare SQLite + deploy config) estava TRACKED no repo
  e mudava a cada build local, poluindo o working tree permanentemente
- Ação: `git rm -r --cached .wrangler` + entrada `.wrangler/` no `.gitignore`
- Estado local regenerável; nada de valor no tracking (config de deploy = `dist-cf/**` já ignorado)
- Sem impacto em build/deploy (wrangler regenera o estado automaticamente)

## Validação

- Contagens `legislative_votes`: 20 (todos Carlos Búrigo, todos VERIFIED_PRIMARY com source ALRS)
- `git status` limpo agora exceto itens ignorados