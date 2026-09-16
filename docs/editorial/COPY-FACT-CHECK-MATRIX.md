# Matriz de Fatos Canônicos — Carlos Búrigo

**Status:** EM EXECUÇÃO  
**Atualização:** 2026-09-16

Esta matriz é a base de verificação para copy e SEO. Ela não substitui o Supabase; serve como registro editorial de quais afirmações podem ser usadas e em que termos.

## Fatos liberados para copy institucional

| Tema | Formulação segura | Status | Fonte principal |
|---|---|---|---|
| Nome | Carlos Antônio Búrigo / Carlos Búrigo | VERIFIED_MULTIPLE | TSE + Câmara Caxias |
| Nascimento | 05/07/1964 | VERIFIED_MULTIPLE | dados eleitorais/TSE + Câmara Caxias |
| Local de nascimento | Bom Jesus/RS, segundo registro eleitoral e Câmara Caxias | VERIFIED_MULTIPLE | TSE + Câmara Caxias |
| Divergência de naturalidade | Site oficial apresenta São José dos Ausentes | CONFLICTING / SELF_REPORTED | site oficial |
| Formação | Ciências Contábeis pela Unisinos | VERIFIED_MULTIPLE | Câmara Caxias + site oficial |
| Prefeito | Prefeito de São José dos Ausentes em 1997–2004 | VERIFIED_PRIMARY / VERIFIED_MULTIPLE | Prefeitura de São José dos Ausentes + Câmara Caxias |
| Caxias do Sul | Secretaria da Fazenda e depois Gestão e Finanças, 2005–2014 | VERIFIED_PRIMARY/VERIFIED_MULTIPLE | Câmara Caxias |
| Governo RS | Secretaria-Geral de Governo em 2015; Planejamento, Governança e Gestão entre 2016 e abril de 2018 | VERIFIED_MULTIPLE | Câmara Caxias |
| Assembleia | Exerceu mandato a partir de 2019 e voltou ao Parlamento em 2023 | VERIFIED_MULTIPLE | Câmara Caxias + fontes parlamentares |
| 2018 | Mais de 34 mil votos e primeira suplência do MDB | VERIFIED_MULTIPLE | Câmara Caxias |
| 2020 | Candidato do MDB à Prefeitura de Caxias do Sul | VERIFIED_MULTIPLE | Câmara Caxias + dados eleitorais |
| 2022 | Candidato a deputado estadual; cerca de 33 mil votos; segundo suplente do MDB | VERIFIED_MULTIPLE | Câmara Caxias + dados eleitorais |
| Comissão de Educação | Presidiu a Comissão de Educação em legislatura anterior | VERIFIED_MULTIPLE | Câmara Caxias + fontes ALRS |
| RRF | Foi relator da Comissão Especial sobre o Regime de Recuperação Fiscal | VERIFIED_MULTIPLE | Câmara Caxias + documentação pesquisada |
| PL 332/2025 | Autor do PL 332/2025, posteriormente Lei 16.445/2025 | VERIFIED_PRIMARY_COMPLETE | ALRS |
| MDB-RS | Primeiro tesoureiro da Executiva Estadual do MDB-RS | VERIFIED_PRIMARY | MDB-RS |
| Liderança MDB atual | Não usar “atual líder da bancada” | VERIFIED_PRIMARY | MDB-RS atual registra Luciano Silveira como líder |

## Formulações proibidas até nova validação

### Nascimento

Não usar:

> “Nascido em São José dos Ausentes.”

como fato categórico.

A versão permanece conflitante: o site oficial usa São José dos Ausentes, enquanto Câmara Caxias e dados eleitorais registram Bom Jesus/RS.

### Emancipação

Não usar:

> “liderou a emancipação e estruturação de sua terra natal”

A documentação consultada comprova que retornou a São José dos Ausentes em 1993 e ocupou funções públicas; não comprova que tenha liderado a emancipação do município.

### Liderança atual

Não usar:

> “atual Líder da Bancada do MDB”

O site oficial contém essa afirmação, mas o diretório estadual do MDB-RS atualmente identifica **Luciano Silveira** como líder da bancada. Búrigo aparece como **1º Tesoureiro** da Executiva Estadual. O cargo de líder pode ter sido exercido anteriormente e deve ser descrito com período quando relevante.

### Lei da Silvicultura

Evitar:

> “autor da histórica Lei da Silvicultura”

“Histórica” é avaliação editorial. Para copy factual, usar:

> “Autor do PL 332/2025, que resultou na Lei 16.445/2025.”

### Resultados

Não usar como fato:

- “resultados comprovados”;
- “impacto real”;
- “gestão exemplar”;
- “atuação decisiva”;
- “equilibrou as contas”;
- “viabilizou grandes projetos”;
- “transformou a vida dos gaúchos”.

Essas formulações podem ser claims de comunicação/campanha somente quando claramente identificadas como posicionamento, não como descrição factual neutra.

## Contato

O `data/db.json` contém endereços, telefone, WhatsApp e e-mail diferentes dos contatos exibidos no site oficial. Não substituir um pelo outro sem validação editorial.

A versão atualmente exibida no site oficial consultado informa:

- Praça Marechal Deodoro, 130 — Centro Histórico, Porto Alegre/RS;
- 10º andar — Sala 1002;
- telefone 51 99907-4956;
- e-mail imprensacarlosburigo@gmail.com.

Antes de publicar como contato institucional atual, esses dados devem ser confirmados pela equipe responsável e/ou pelo cadastro do Supabase.

## SEO atual

O `index.html` já foi alterado para uma descrição institucional, mas ainda precisa de:

- canonical;
- OG URL/image;
- metadata por rota;
- sitemap;
- robots;
- JSON-LD condicionado aos dados verificados.

O título global atual é aceitável como ponto de partida:

> Carlos Búrigo | Deputado Estadual • Rio Grande do Sul

Não acrescentar “candidato 15140” ao SEO institucional permanente. Esses termos pertencem ao contexto eleitoral de 2026 e devem ficar na rota `/campanha` e páginas eleitorais correspondentes.

## Fontes atuais consultadas

- Site oficial: https://www.carlosburigo.com.br/
- Câmara Municipal de Caxias do Sul: https://www.camaracaxias.rs.gov.br/noticias/index/29462
- Prefeitura de São José dos Ausentes: https://www.saojosedosausentes.rs.gov.br/municipio/galeria-ex-prefeitos/
- MDB-RS — Executiva Estadual: https://www.mdb-rs.org.br/?institucional=executiva_estadual
- TSE/DivulgaCandContas, por fontes que reproduzem os registros públicos eleitorais de 2026.

## Próxima etapa

1. Auditar `TrajectorySection`, `HeroSection`, `ActionsAndProjectsSection`, `ResultsSection`, `NewsSection`, `ContactView`, `CampaignView` e `Navbar`.
2. Mapear cada frase factual contra esta matriz.
3. Corrigir claims conflitantes ou sem fonte.
4. Separar texto institucional de campanha.
5. Consolidar SEO por rota.
6. Depois mover/confirmar a copy canônica no Supabase/CMS.
