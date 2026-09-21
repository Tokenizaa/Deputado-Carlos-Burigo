# INVENTÁRIO DOCUMENTAL — AUDITORIA INICIAL

**Data:** 21/09/2026  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`  
**Branch:** `main`  
**Objetivo:** identificar, classificar e preparar a reconstrução da documentação sem apagar histórico Git.

## 1. Diagnóstico

A documentação atual não está ausente. O problema é **fragmentação e perda de autoridade documental**.

A auditoria dos commits recentes confirmou que existem documentos de pelo menos quatro naturezas diferentes:

1. **Roadmap operacional** — deveria dizer o que está acontecendo agora e qual é a próxima etapa.
2. **Auditorias/checkpoints** — registram evidências de uma fase.
3. **Documentação de manutenção/execução** — registra correções específicas.
4. **ADRs** — registram decisões arquiteturais e de segurança.

Essas categorias hoje se misturam com documentos históricos e com nomenclaturas de ciclos anteriores.

## 2. Documentos confirmados

### Roadmap

- `docs/roadmap/FASE-0-CONGELAMENTO-ESTADO.md`
- `docs/roadmap/ROADMAP-CANONICO.md`
- `docs/roadmap/FASE-1-AUDITORIA-GERAL.md`
- `docs/roadmap/FASE-2-BACKLOG-REAL.md`
- `docs/roadmap/FASE-3-VALIDACAO-BASE.md`

### Manutenção / validação

- `docs/maintenance/phase-3-typescript-lint-resolution-2026-09-21.md`

### ADR

- `docs/adr/0003-auth-password-protection-enhancements.md`

### Documentação histórica adicional

Os commits anteriores também registram documentos de auditoria, canonização, configurações, conteúdo e fases antigas. Esses artefatos precisam entrar no inventário completo antes de qualquer exclusão ou arquivamento.

## 3. Evidências de inconsistência

### 3.1 Roadmap atual

O roadmap operacional foi alterado várias vezes em sequência:

- criação do novo ciclo;
- auditoria geral;
- backlog;
- validação;
- conclusão de lint/build;
- início de segurança.

O problema não é o histórico de alterações. O problema é que documentos antigos continuam podendo ser interpretados como estado atual.

### 3.2 Nomenclatura B2

A Fase 2 criou identificadores de backlog como `B2-01` até `B2-18`.

Esses identificadores são históricos do backlog da Fase 2. Eles não devem continuar funcionando como nomes de etapas do ciclo atual.

A documentação recente, porém, ainda referencia B2-01/B2-02/B2-03 etc. como próximos passos. Isso cria falsa pendência quando uma implementação posterior já foi realizada.

### 3.3 Estado de implementação versus estado documental

O commit `ca6e172cad5d2024e9c956a346934d547e03d763` adicionou:

- `src/lib/passwordValidation.ts`;
- validação reforçada no bootstrap administrativo;
- validação reforçada no cadastro do cidadão;
- atualização das telas correspondentes;
- ADR 0003.

O próprio commit registra lint e build aprovados.

Portanto, qualquer roadmap que apresente proteção de senha como simplesmente "não feita" está documentalmente desatualizado.

### 3.4 Documentação histórica

Os commits históricos devem ser preservados. Não há necessidade de reescrever a história Git.

O que precisa ser reconstruído é a **camada documental operacional**.

## 4. Regra de autoridade que deverá ser adotada

A reconstrução deverá estabelecer esta hierarquia:

1. **Código e banco reais** — evidência de implementação.
2. **Validação executada** — evidência de funcionamento.
3. **Documento da fase/checkpoint** — registro da evidência.
4. **Roadmap canônico** — índice operacional derivado dos três níveis anteriores.
5. **Documentos históricos** — referência de contexto, nunca fonte para decidir o estado atual.

Um documento antigo nunca poderá, sozinho, reabrir uma pendência já comprovadamente concluída.

## 5. Estado deste inventário

Este documento é o **inventário inicial confirmado pelos commits e arquivos diretamente auditados**.

A etapa seguinte deverá fazer a varredura completa da árvore do repositório e classificar todos os arquivos documentais encontrados, inclusive README, Markdown, MDX, ADRs, auditorias, planos, checklists, relatórios, documentos de manutenção e documentação embutida em configurações.

Nenhum documento histórico deve ser apagado durante essa varredura.
