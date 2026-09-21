# DOCUMENTAÇÃO — GOVERNANÇA

Esta pasta é o núcleo da reconstrução documental.

## Fontes

- `ROADMAP-CANONICO.md` — única fonte para a sequência operacional.
- `MATRIZ-ESTADO-REAL.md` — estado reconciliado do sistema.
- `RECONCILIACAO-DOCUMENTAL.md` — regras para resolver divergências.
- `RECONSTRUCAO-DOCUMENTAL-LINHA-DO-TEMPO.md` — linha do tempo.
- `INVENTARIO-DOCUMENTAL-COMPLETO.md` — inventário e classificação de artefatos.
- `MAPA-DOCUMENTAL-CANONICO.md` — conjunto mínimo de documentos canônicos.
- `AUDITORIA-DOCUMENTAL-D0-D3.md` — resultado da auditoria e reconciliação D0–D3.

## Regras

1. Código, banco, configuração e validação determinam o estado.
2. Documentação registra o estado; não o inventa.
3. Histórico não é roadmap.
4. Não apagar commits para corrigir documentação.
5. Não transformar "não validado" em "não implementado".
6. Não transformar implementação comprovada em pendência por causa de documento antigo.
7. Roadmap atual usa somente FASE 0, FASE 1, FASE 2, FASE 3, FASE 4...
8. Identificadores de backlogs históricos não são etapas atuais.
9. Toda pendência deve possuir critério objetivo de aceite.
10. Antes de criar documento novo, procurar a fonte canônica existente.

## Fluxo

```
EVIDÊNCIA
   ↓
ESTADO REAL
   ↓
DOCUMENTAÇÃO
   ↓
ROADMAP
   ↓
EXECUÇÃO
   ↓
NOVA EVIDÊNCIA
```
