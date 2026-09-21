# AUDITORIA DOCUMENTAL — D0 A D3

**Data:** 21/09/2026  
**Branch:** main  
**Escopo:** reconstrução completa da documentação existente.

## Resultado

A auditoria encontrou **104 artefatos documentais** no inventário inicial. O problema estrutural é de **autoridade e temporalidade**, não de falta de documentos.

Há três conjuntos que precisam ser diferenciados:

1. documentação operacional atual;
2. evidências de auditorias e implementações anteriores;
3. documentos históricos que descrevem estados que já foram substituídos.

## Critério de autoridade

A ordem de autoridade é:

**código + banco/configuração + validação executada → estado real → documentação canônica → roadmap**

Um documento antigo não invalida uma implementação posterior.

## Reconciliações realizadas

### Segurança e acesso

Os documentos FASE-20, FASE-21 e FASE-22 registram implementações reais, mas seus textos foram escritos em momentos em que build/lint ainda apareciam como pendentes. Validações posteriores concluíram build/lint. Portanto:

- implementação: preservada como evidência;
- pendência antiga de build/lint: encerrada por evidência posterior;
- validações específicas de autorização/E2E: continuam como trabalho de validação quando não houver evidência atual.

### Bootstrap

A FASE-29 registra implementação do primeiro administrador e uma limitação operacional relacionada à remoção de usuários existentes. Isso não significa que o mecanismo de bootstrap esteja ausente. O estado deve ser separado em:

- implementação existente;
- validação operacional ainda necessária.

### Demandas do cidadão

A auditoria FASE-27 identificou o risco do acompanhamento público por protocolo. A FASE-28 registra a implementação do modelo autenticado e propriedade por cidadão. Portanto, o fluxo antigo por protocolo deve ser tratado como histórico e não como arquitetura atual.

### Documentos e mandatos

A FASE-31 registra o controle de visibilidade do acervo documental. O critério de validação ainda precisa de execução objetiva. A implementação não deve ser marcada como ausente apenas porque a validação final não está documentada.

### Validação de produção

VALIDATION_REPORT.md é uma fotografia histórica de uma implantação anterior. Ele menciona URL, versão do Worker e mecanismos de autenticação que não devem ser usados como evidência atual. O arquivo permanece para rastreabilidade.

### Governança de agentes

AGENTS.md contém uma topologia anterior de agentes e escopos. Ele não determina o estado funcional do produto e precisa ser reconciliado antes de ser tratado como governança canônica.

## Classificação documental

| Classe | Função |
|---|---|
| CANÔNICO | fonte operacional atual |
| REFERÊNCIA | explicação técnica que não determina estado |
| AUDITORIA | evidência de checkpoint |
| ADR | decisão arquitetural |
| MANUTENÇÃO | registro técnico datado |
| HISTÓRICO | preservação sem autoridade operacional |
| GOVERNANÇA | regras de processo/agentes |

A classificação arquivo a arquivo foi incorporada ao inventário documental completo.

## Regra contra regressão documental

É proibido:

- reabrir uma fase porque um documento antigo diz que ela estava pendente;
- marcar implementação como inexistente sem auditar o código;
- transformar “não validado” em “não implementado”;
- usar documento histórico como fonte de estado atual;
- criar novo roadmap paralelo;
- criar novos identificadores de fase derivados de backlogs históricos.

## Estado documental atual

O único roadmap operacional é:

docs/roadmap/ROADMAP-CANONICO.md

A sequência operacional permanece:

**FASE 0 → FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5 → ...**

Os identificadores B2-* e fases numeradas antigas permanecem apenas como histórico.

## Próximas etapas da reconstrução

### D4 — Arquitetura documental mínima
Consolidar quais documentos são canônicos e reduzir duplicação de fontes.

### D5 — Reconstrução do roadmap
Garantir que cada fase atual derive exclusivamente do estado real reconciliado.

### D6 — Reconciliação de ADRs e governança
Atualizar decisões arquiteturais e regras de agentes que estejam incompatíveis com a arquitetura atual.

### D7 — Validação final
Executar busca por referências obsoletas, contradições e fases paralelas; depois registrar o checkpoint final.

## Critério de encerramento da reconstrução

A reconstrução documental estará concluída quando um agente novo conseguir responder, sem consultar documentos históricos:

- qual é o estado atual;
- qual é a fase atual;
- o que já está implementado;
- o que está apenas não validado;
- quais evidências sustentam cada estado;
- qual é a próxima fase operacional.
