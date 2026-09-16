# Auditoria Editorial, Copy e SEO — Carlos Búrigo

**Status:** em execução  
**Data:** 2026-09-16  
**Fonte de implementação:** `Tokenizaa/Deputado-Carlos-Burigo`

## Objetivo

Auditar e corrigir todas as copys públicas, metadados SEO e afirmações factuais do projeto sem recomeçar a arquitetura.

Regra editorial canônica:

> fonte → evidência → classificação → copy → publicação

Nenhuma informação factual deve ser publicada apenas porque existe no `data/db.json`, no frontend ou no conteúdo gerado pelo AI Studio.

## Escopo

1. `data/db.json` e demais fontes locais de copy.
2. Componentes públicos e páginas de conteúdo.
3. Títulos, subtítulos, CTAs, descrições e textos institucionais.
4. SEO global e por rota.
5. Open Graph, Twitter Cards, canonical, sitemap, robots e JSON-LD.
6. Conteúdo institucional versus campanha 2026.
7. Informações de contato e gabinete.
8. Biografia e trajetória.
9. Projetos, votações, resultados e funções parlamentares.
10. Notícias, vídeos e documentos.

## Classificação factual

- `VERIFIED_PRIMARY` — fonte primária institucional/oficial localizada.
- `VERIFIED_MULTIPLE` — confirmado por duas ou mais fontes independentes/relevantes.
- `VERIFIED_SECONDARY` — fonte secundária confiável, ainda sem confirmação primária completa.
- `SELF_REPORTED` — afirmação publicada pelo próprio parlamentar/campanha.
- `CONFLICTING` — existem versões conflitantes.
- `UNCONFIRMED` — ainda não há evidência suficiente.

Conteúdo `CONFLICTING` ou `UNCONFIRMED` não deve ser apresentado como fato.

## Primeiro achado: `data/db.json`

O arquivo contém diversos dados que precisam ser removidos da autoridade editorial ou validados antes de publicação, incluindo:

- CNPJ de campanha;
- endereço de gabinete em Porto Alegre;
- endereço regional em Caxias do Sul;
- telefone;
- WhatsApp;
- e-mail;
- slogan;
- coligação;
- descrição SEO;
- afirmações biográficas e parlamentares.

Esses campos não serão tratados como verdade apenas por estarem no JSON.

Também existe avatar apontando para Unsplash no usuário administrativo. Isso deve ser tratado como dado técnico/mock e não como fotografia oficial do parlamentar.

## Conflito biográfico prioritário

O site oficial afirma que Carlos Búrigo nasceu em São José dos Ausentes. Fontes eleitorais baseadas nos dados do TSE registram nascimento em **05/07/1964, Bom Jesus/RS**.

Até resolução documental definitiva:

- não publicar uma afirmação categórica incompatível com a evidência eleitoral;
- manter a versão oficial como `SELF_REPORTED`/`CONFLICTING` quando necessário;
- buscar fonte primária adicional para resolver o conflito;
- não transformar São José dos Ausentes em local de nascimento apenas porque aparece no site oficial.

## Outros pontos a validar

### Trajetória

Validar separadamente:

- prefeito de São José dos Ausentes em 1997–2004;
- secretário da Fazenda de Caxias do Sul;
- funções no Governo do Estado;
- período e nomenclatura exata de cada secretaria;
- exercício do mandato de deputado estadual;
- liderança de bancada;
- presidência/participação em comissões;
- frentes parlamentares.

Não usar formulações como “liderou”, “criou”, “viabilizou”, “transformou” ou “entregou” sem evidência adequada.

### Projetos e resultados

Distinguir obrigatoriamente:

- autor;
- coautor;
- relator;
- apoiador;
- voto favorável/contrário;
- projeto aprovado;
- projeto sancionado;
- lei resultante;
- iniciativa ou participação institucional.

Não converter participação parlamentar em autoria.

### Linguagem editorial

Evitar claims absolutos ou promocionais apresentados como fatos, por exemplo:

- “resultados comprovados”;
- “impacto real”;
- “compromissos que viraram realidade”;
- “grandes resultados”;
- “atuação decisiva”;
- “transformam a vida dos gaúchos”.

Quando forem utilizados como linguagem editorial/campanha, devem permanecer claramente separados de dados factuais e não podem substituir evidência documental.

## Arquitetura de conteúdo

### Institucional `/`

A Home permanente deve apresentar:

- Carlos Búrigo;
- trajetória documentada;
- atuação parlamentar;
- projetos;
- votações;
- resultados documentados;
- presença pública;
- notícias;
- vídeos;
- gabinete.

Não misturar automaticamente conteúdo eleitoral de 2026 na identidade permanente.

### Campanha `/campanha`

Conteúdo eleitoral de 2026 deve ficar separado da Home institucional.

Dados eleitorais devem ser tratados como dados temporais da eleição de 2026 e atualizados conforme a fonte oficial.

## SEO canônico

Cada rota pública deverá possuir:

- `title` único;
- `description` factual;
- canonical;
- H1 único;
- hierarquia semântica correta;
- Open Graph;
- Twitter Card quando aplicável;
- URL semântica;
- `robots` adequado;
- sitemap;
- JSON-LD somente quando os dados forem verdadeiros e sustentados.

Schemas previstos, conforme conteúdo real:

- `Person`;
- `NewsArticle`;
- `VideoObject`;
- `CollectionPage`.

Não inserir schema com afirmações que não estejam presentes/confirmadas na página.

## Matriz inicial de rotas

| Rota | Função | SEO inicial |
|---|---|---|
| `/` | Portal institucional | Carlos Búrigo — Deputado Estadual do Rio Grande do Sul |
| `/sobre` | Trajetória | Sobre Carlos Búrigo |
| `/atuacao` | Atuação parlamentar | Atuação parlamentar de Carlos Búrigo |
| `/projetos` | Projetos legislativos | Projetos de lei |
| `/votacoes` | Votações | Votações e posicionamentos |
| `/resultados` | Resultados documentados | Resultados e atuação |
| `/documentos` | Acervo | Documentos oficiais |
| `/noticias` | Notícias | Notícias |
| `/videos` | Vídeos | Vídeos |
| `/contato` | Gabinete | Contato e gabinete |
| `/campanha` | Eleição 2026 | Carlos Búrigo 2026 |

Os títulos finais serão definidos após auditoria do conteúdo de cada rota.

## Plano de execução

### Fase 1 — Inventário

- localizar todas as copys no repositório;
- localizar SEO e metadata;
- localizar textos duplicados;
- localizar claims factuais;
- localizar dados técnicos/mock.

### Fase 2 — Verificação

Cruzar cada claim relevante com o acervo já pesquisado e fontes primárias/independentes.

### Fase 3 — Canonização

Criar uma única versão editorial por assunto e eliminar divergências entre páginas, JSON e componentes.

### Fase 4 — SEO

Aplicar metadata por rota e revisar schema, canonical, sitemap e robots.

### Fase 5 — Implementação

Atualizar a fonte de conteúdo correta sem criar segunda arquitetura.

### Fase 6 — Validação

Executar build, testes e inspeção das rotas públicas, verificando:

`UI → copy → metadata → fonte → conteúdo renderizado`

## Regra de fonte da verdade

**Supabase informa → aplicação renderiza.**

O `data/db.json` legado não deve permanecer como autoridade paralela para conteúdo público quando o dado correspondente já existir no Supabase.

## Primeira rodada de correções identificadas

1. Bloquear uso editorial automático de dados não validados do `data/db.json`.
2. Corrigir o tratamento do local de nascimento para estado `CONFLICTING` até resolução.
3. Revisar endereço, telefone, WhatsApp e e-mail antes de publicação.
4. Revisar `seo_default_title` e `seo_default_description`.
5. Revisar claims de autoria, liderança e resultados.
6. Separar institucional de campanha.
7. Eliminar avatar Unsplash como representação do parlamentar.
8. Fazer a matriz final de SEO por rota.

## Critério de conclusão

A auditoria só será considerada concluída quando toda copy factual pública relevante tiver:

- fonte identificada;
- classificação de verificação;
- redação coerente com a evidência;
- ausência de conflito não declarado;
- SEO correspondente;
- separação correta entre institucional e campanha.
