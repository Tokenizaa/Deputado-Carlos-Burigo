# FASE 6 — Transparência e política de publicação

**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`  
**Status:** concluída em 2026-09-18

## Objetivo

Estabelecer uma camada pública de transparência que explique os critérios de publicação antes de ampliar a exposição de documentos e dados.

## 6.1 Classificação adotada

| Categoria | Regra |
|---|---|
| Público | Informação com finalidade pública e contexto adequado para divulgação. |
| Público com tratamento | Informação publicável após remoção ou minimização de dados pessoais quando necessário. |
| Interno | Informação operacional ou administrativa sem finalidade de divulgação pública. |
| Restrito | Informação protegida por legislação, segurança ou outro fundamento que impeça sua divulgação. |

## 6.2 Auditoria documental

A política de publicação exige, para cada grupo de conteúdo:

- fonte;
- finalidade;
- público-alvo;
- existência de dados pessoais;
- fundamento da publicação;
- necessidade de anonimização ou minimização;
- período de retenção quando aplicável;
- vínculo com a fonte pública.

A regra principal é: **a disponibilidade técnica de um documento não é motivo suficiente para sua publicação**.

## 6.3 Página Transparência

Foi criada a rota pública `/transparencia` com:

- explicação das quatro categorias de informação;
- agrupamento do conteúdo público por assunto;
- descrição do que é publicado;
- finalidade da publicação;
- período de referência;
- fonte;
- links para consulta do conteúdo público correspondente;
- política explícita contra publicação automática de rascunhos, conteúdo interno ou informação não verificada.

A experiência não é uma lista de PDFs. Ela apresenta o contexto necessário para que o cidadão entenda o conteúdo antes de consultá-lo.

## 6.4 Regra preservada

A página não cria fatos, documentos ou registros fictícios para preencher lacunas do acervo. Conteúdo factual continua subordinado ao fluxo:

`fonte/verificação → acervo público → adapter → frontend`.

## Implementação

- `src/components/public/TransparencyView.tsx`
- `src/App.tsx`
- `src/context/AppUiContext.tsx` — rota `/transparencia` já existente e preservada
- `docs/audits/FASE-6-TRANSPARENCIA.md`
- `docs/roadmap/REFATORACAO-PORTAL-CARLOS-BURIGO.md`

## Critério da fase

**Atendido:** nenhum documento é publicado apenas porque está disponível tecnicamente; a publicação pública possui classificação, finalidade e contexto documentados.
