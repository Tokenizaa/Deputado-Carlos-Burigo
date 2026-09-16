# Design Visual e Mídia Canônicos — Carlos Búrigo

**Status:** CANÔNICO  
**Base:** `main` / `01ad588bf06246965ba72fa140eb1f0d488f633e`  
**Escopo:** portal institucional `/` + experiência separada `/campanha`

## 1. Princípios

- Supabase é a fonte de verdade para conteúdo, mídia e evidências.
- AI Studio é ferramenta de composição visual; não é fonte editorial.
- Não recriar arquitetura existente.
- Não inventar fatos, números, imagens ou slogans.
- Fotografia documental real tem prioridade sobre imagens genéricas.
- O portal institucional não deve parecer uma landing page eleitoral permanente.
- A campanha 2026 possui identidade própria e fica isolada em `/campanha`.

## 2. Referências de identidade

### MDB

Cores oficiais documentadas no manual do MDB:

| Token | HEX | Uso |
|---|---|---|
| `--mdb-green` | `#00A550` | cor institucional principal |
| `--mdb-yellow` | `#E1F200` | destaque |
| `--mdb-red` | `#ED1C24` | acento pontual |
| `--black` | `#000000` | contraste |

### Carlos Búrigo institucional

Referência primária: site oficial atual e seus elementos gráficos reais.

https://www.carlosburigo.com.br/

Não criar uma “paleta Búrigo” arbitrária. Os elementos existentes devem ser tratados como referência antes de introduzir novos tokens.

### Campanha 2026

A experiência `/campanha` deve usar as marcas e materiais oficiais disponibilizados pelo MDB-RS para as Eleições 2026.

- https://mdb-rs.org.br/?eleicoes=2026-marcas_de_campanha
- https://mdb-rs.org.br/?eleicoes=2026-material_de_campanha
- https://mdb-rs.org.br/?eleicoes=2026-galerias-72177720335238369

A peça de campanha fornecida durante o projeto também integra as referências visuais. Os HEX exatos dessa peça devem ser extraídos do arquivo original antes de virar token definitivo.

## 3. Sistema visual institucional

### Fundos

Predominância de branco/off-white e superfícies claras. Grafite/preto somente em blocos editoriais estratégicos.

Não alternar seções mecanicamente entre preto e verde. A variação visual deve vir de fotografia, escala tipográfica, composição, linhas, grids e espaço negativo.

### Tipografia

Manter a família tipográfica já existente no projeto.

- Corpo público: 16–18px.
- H1 mobile: aproximadamente 42–52px.
- H1 desktop: aproximadamente 64–88px, podendo chegar a 96px quando a composição justificar.
- H2: 30–48px conforme viewport.
- Pesos: 500/600/700/800.
- Labels: caixa alta com letter-spacing controlado.
- Títulos: tracking levemente negativo quando adequado.
- Alinhamento preferencial à esquerda.
- Nunca reduzir a tipografia para preencher mais conteúdo.

### Geometria

- radius predominante: 0–8px;
- linhas e divisores horizontais;
- grids editoriais;
- assimetria controlada;
- poucos cards;
- evitar aparência de dashboard SaaS;
- evitar excesso de pills e cantos muito arredondados.

### Glassmorphism

Permitido como recurso pontual sobre fotografia ou superfícies escuras. Não usar como linguagem de todas as seções.

### Fotografia

Prioridade:
1. site oficial;
2. campanha oficial;
3. MDB;
4. Assembleia Legislativa;
5. Câmara/Prefeitura;
6. demais fontes institucionais verificadas.

Cada imagem pública deve ter proveniência e direitos conhecidos ou explicitamente tratados como desconhecidos.

## 4. Arquitetura visual

### `/`

Hero editorial → trajetória → atuação parlamentar → presença → vídeos → notícias → gabinete.

A Home não é dashboard e não exibe o acervo documental inteiro.

### `/campanha`

Hero de campanha → trajetória → prioridades/temas publicados → presença → vídeos → agenda, quando houver dados → redes → CTA para o portal institucional.

A campanha não redefine a identidade do portal permanente.

## 5. SEO e acessibilidade

Toda rota pública deve possuir title, description, canonical, OG/Twitter card, H1 único, hierarquia semântica, alt text e URLs semânticas. JSON-LD somente quando os dados forem verdadeiros e suportados.

Objetivo: WCAG AA; controles com pelo menos 44px; contraste alto; foco visível.

## 6. Curadoria de imagens — Supabase `media`

O levantamento atual encontrou seis imagens no banco:

| Papel | Registro | Fonte | Uso previsto | Situação |
|---|---|---|---|---|
| Retrato principal | Retrato Carlos Búrigo — seção “Quem é o Búrigo?” | Site oficial | Hero / Sobre | APROVADA |
| Logo | Logo Carlos Búrigo | Site oficial | Header / Footer | APROVADA |
| Banner | Banner institucional “BULK (1)_edited” | Site oficial | referência / bloco secundário | APROVADA COMO REFERÊNCIA |
| Trajetória | Carlos Búrigo durante entrevista (2017) | Governo RS / Wikimedia Commons | Trajetória | APROVADA — CC BY 3.0 |
| Trajetória | Prefeito recebe ex-secretário Carlos Búrigo (2014) | Prefeitura de Caxias do Sul | Trajetória | DIREITO A CONFIRMAR |
| Perfil | Avatar do canal oficial | YouTube | Perfil / redes | USO CONDICIONADO |

### Seleção para a primeira implementação

**Prioridade 1**

1. Retrato oficial do site para o Hero institucional.
2. Foto de 2017 do Governo RS para a trajetória, respeitando CC BY 3.0.
3. Logo oficial para header/footer.

**Prioridade 2**

4. Foto da Prefeitura de Caxias de 2014, após validação de direito de reprodução.
5. Banner institucional, somente se tiver função editorial real.
6. Avatar do YouTube somente onde houver função de perfil.

Não espalhar todas as imagens em todas as páginas. Cada fotografia precisa ter função editorial.

## 7. Curadoria de vídeos — Supabase `videos`

O levantamento atual encontrou 13 vídeos catalogados.

### Prioridade para conteúdo atual/institucional

1. **Candidato a Deputado Estadual - Carlos Búrigo (MDB) 17/08/2026** — YouTube — `fkkQAmFmb5A` — prioridade para `/campanha`, com identificação eleitoral adequada.
2. **Política | Deputado Estadual Carlos Antônio Búrigo** — `sZR_9Tpz7ak` — entrevista.
3. **Entrevista com Carlos Búrigo - Fórum Polo Rodoviário** — `eiKrOL_5POE` — atuação/transportes.
4. **DEPUTADO ESTADUAL CARLOS BÚRIGO | PERSONA ENTREVISTA 15/03/2024** — `t4a42E25AOE` — institucional.
5. **Carlos Búrigo: um mandato para as pessoas** — `_CM5okHeFB8` — mandato.
6. **Carlos Búrigo: dos Campos de Cima da Serra para o mundo** — `a-NPItcJsxk` — trajetória.
7. **Entrevista com Carlos Búrigo - 19/06/20** — `Sbw1-MInvbk` — arquivo/entrevista.
8. **Entrevista especial com Carlos Búrigo** — `qOgUhD3e6jY` — arquivo/entrevista.

### Arquivo de campanha 2022

9. **Carlos Búrigo: o deputado que o RS merece** — `oFXpr2qRJcM`.
10. **Carlos Búrigo: ao lado da família** — `XE0fhk1julY`.
11. **Jingle de Carlos Búrigo em 2022** — `2bDsU9aJ6ds`.
12. **Deputado Estadual - Carlos Búrigo** — `sOc_Rx1liC0`.
13. **Sartori é Búrigo 15140** — `bFf38V29ri8`.

Os vídeos de 2022 permanecem catalogados como arquivo histórico. Não devem dominar o portal institucional atual.

## 8. Regras de publicação de mídia

- YouTube: preferir embed/link oficial; não baixar o vídeo sem necessidade.
- Imagem oficial com direitos claros: pode ser armazenada no Storage.
- Terceiros com direitos desconhecidos: manter como referência interna ou link/embed; não republicar automaticamente.
- Toda mídia usada deve manter fonte, URL original, crédito e situação de direitos.

## 9. Próxima coleta de mídia

O acervo atual é suficiente para iniciar a composição visual, mas ainda não é uma biblioteca fotográfica completa.

A próxima coleta deve ser **curada**, não massiva: fotografias reais da Assembleia Legislativa/MDB-RS/atividades recentes, especialmente plenário, comissões, projetos, reuniões, visitas e agenda 2025–2026.

Priorizar imagens que preencham uma função concreta da interface. Evitar coletar volume apenas para formar galeria.

## 10. Regra canônica

**AI Studio desenha → Supabase informa → aplicação renderiza.**

Qualquer alteração futura do visual deve ser compatível com este documento ou justificar explicitamente uma exceção.
