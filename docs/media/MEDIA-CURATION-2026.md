# Curadoria de Mídia 2026 — Carlos Búrigo

**Status:** LEVANTAMENTO CURADO  
**Objetivo:** selecionar fontes reais para a próxima implementação visual sem transformar o acervo em galeria massiva.

## Regra

Supabase é a fonte de verdade. Esta lista registra **fontes e funções editoriais**, não autoriza automaticamente a republicação de imagens de terceiros. Antes de copiar um arquivo para Storage, validar direitos/licença e preservar URL, crédito, data e hash.

## Fontes 2026 encontradas

### MDB-RS — galerias oficiais de campanha

O portal oficial do MDB-RS mantém galerias de 2026 com material fotográfico. As galerias abaixo são candidatas para a experiência `/campanha` e devem ser filtradas por presença efetiva de Carlos Búrigo antes da ingestão individual das fotos.

| Data | Galeria | URL | Uso possível | Status |
|---|---|---|---|---|
| 09/09/2026 | Caxias do Sul | https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720335530452 | campanha / presença regional | CANDIDATA |
| 04/09/2026 | Santa Maria | https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720335455882 | campanha / presença regional | CANDIDATA |
| 04/09/2026 | Sabatina A Hora do Sul | https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720335452377 | campanha / entrevista | CANDIDATA |
| 25/08/2026 | Acist em Debate | https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720335307808 | campanha / debate | CANDIDATA |
| 20/08/2026 | Profissão na Mão | https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720335238369 | campanha / agenda | CANDIDATA |
| 28/07/2026 | Comitiva de Santiago | https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720334881795 | campanha / interior | CANDIDATA |
| 17/07/2026 | Visita ao Correio do Povo | https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720334723787 | campanha / imprensa | CANDIDATA |
| 16/07/2026 | Visita na B&8 e nova indústria de etanol | https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720334712721 | campanha / desenvolvimento | CANDIDATA |

**Importante:** a busca indexou essas galerias como páginas oficiais do MDB-RS, mas o resultado textual não permite confirmar quais fotografias contêm Búrigo. Portanto, nenhuma imagem é marcada como `APPROVED` apenas pela existência da galeria.

## Fontes institucionais atuais

### Site oficial Carlos Búrigo

https://www.carlosburigo.com.br/

Uso: identidade institucional, retrato principal, logo e materiais do próprio site.

### Assembleia Legislativa do RS

Prioridade para futura coleta de fotografias de:

- plenário;
- comissões;
- projetos e votações;
- frentes parlamentares;
- homenagens;
- atividades recentes 2025–2026.

A ALRS é fonte institucional prioritária para o portal permanente. A coleta de imagens precisa preservar a origem e verificar as condições de uso da fotografia específica.

## Seleção visual prevista

### `/` institucional

1. Retrato oficial do site — Hero.
2. Foto institucional/documental de atividade parlamentar — Atuação.
3. Foto de trajetória já arquivada — seção Trajetória.
4. Fotografia institucional recente — Notícias/Presença, quando houver fonte e direitos validados.

### `/campanha`

1. Retrato/peça oficial da campanha 2026.
2. Fotografias de agenda 2026 em que Búrigo esteja efetivamente presente.
3. Fotografia de debate/entrevista 2026, quando confirmada.
4. Fotografia de atividade regional 2026, quando confirmada.

## Vídeos — seleção canônica inicial

### Institucional

- `sZR_9Tpz7ak` — Política | Deputado Estadual Carlos Antônio Búrigo
- `eiKrOL_5POE` — Entrevista com Carlos Búrigo - Fórum Polo Rodoviário
- `t4a42E25AOE` — DEPUTADO ESTADUAL CARLOS BÚRIGO | PERSONA ENTREVISTA 15/03/2024
- `_CM5okHeFB8` — Carlos Búrigo: um mandato para as pessoas
- `a-NPItcJsxk` — Carlos Búrigo: dos Campos de Cima da Serra para o mundo

### Campanha 2026

- `fkkQAmFmb5A` — Candidato a Deputado Estadual - Carlos Búrigo (MDB) 17/08/2026

### Arquivo histórico

Os cinco vídeos de 2022 já catalogados permanecem no acervo, mas não devem ocupar posição dominante no portal institucional atual.

## Critério de promoção para Supabase `media`

Uma imagem somente passa de `CANDIDATE` para `APPROVED` quando:

1. Carlos Búrigo aparece de forma confirmada;
2. a fonte original está identificada;
3. a URL original foi preservada;
4. o direito/licença de uso foi avaliado;
5. a função editorial está definida;
6. o arquivo foi baixado sem alteração indevida;
7. SHA-256 foi calculado;
8. o registro contém crédito e proveniência.

## Resultado desta rodada

- Foram identificadas **8 galerias oficiais MDB-RS de 2026** relevantes como fontes de campanha.
- Foram identificadas funções editoriais para institucional e campanha.
- A seleção de vídeos foi reduzida a um conjunto inicial para implementação.
- Nenhuma fotografia de terceiro foi marcada como aprovada sem validação individual.
- A próxima ação técnica é abrir/renderizar as galerias oficiais, selecionar apenas fotografias em que Búrigo esteja efetivamente presente e então arquivar as aprovadas no Supabase Storage `media`.

**Princípio:** coletar menos imagens, mas cada uma com função, proveniência e direito claramente documentados.
