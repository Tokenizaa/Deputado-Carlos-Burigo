# P1 — Projetos Públicos como Fonte de Verdade

**Data:** 2026-09-16
**Etapa:** P1.3

## Implementação

`ActionsAndProjectsSection.tsx` deixou de manter uma lista paralela de projetos, votações, números e documentos hardcoded.

Commit de implementação: `d4da0de7e865e2e4ad3c23271c724a995f7a45bc`

## Fonte de dados

A seção agora consome `projects` fornecido pelo `AppContext`, que chega ao frontend através do endpoint público baseado no Supabase.

Foram removidos do componente:

- `extendedProjects` com proposições paralelas;
- lista editorial fixa de votações;
- números fixos como 1ª lei, 9 anos, 100% e 20+;
- documentos PDF hardcoded;
- afirmações legislativas não derivadas do acervo atual.

## Comportamento preservado

- abas Visão Geral, Projetos, Votações e Acervo Documental;
- abertura de detalhe de projeto;
- acesso à fonte ALRS quando o registro possui `linkAlrs`;
- navegação para Resultados;
- estado vazio quando o acervo não possui informação suficiente.

## Regra importante

A ausência de registros de votação não é preenchida por inferência ou texto político. A interface informa que o acervo ainda não possui registros públicos suficientes.

A seção não cria dados no Supabase e não promove conteúdo externo diretamente para o frontend.

## Próximo passo

Continuar a limpeza sistemática da Home, verificando `ResultsSection`, `VideosSection`, `HeroSection` e `TrajectorySection` contra o mesmo princípio: dados factuais devem vir do acervo; ausência de dado deve permanecer ausência de dado.