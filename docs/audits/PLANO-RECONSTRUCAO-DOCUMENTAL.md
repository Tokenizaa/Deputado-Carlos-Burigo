# PLANO DE RECONSTRUÇÃO DOCUMENTAL COMPLETA

**Data:** 21/09/2026  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`  
**Branch operacional:** `main`

## 1. Objetivo

Reconstruir integralmente a documentação do projeto para que ela volte a representar o estado real do código, do Supabase, do Worker, da produção e das funcionalidades.

O objetivo **não é apagar histórico**.

O objetivo é separar claramente:

- histórico;
- evidência;
- estado atual;
- decisões;
- roadmap;
- pendências reais.

Ao final, um agente local deverá conseguir ler a documentação atual e chegar ao mesmo diagnóstico que o código e as validações produzem.

---

# 2. Problema que a reconstrução resolve

A documentação atual apresenta três problemas estruturais:

1. **fragmentação de fases e nomenclaturas;**
2. **documentos antigos sendo interpretados como estado atual;**
3. **diferença entre o que o código já implementou e o que documentos antigos ainda dizem estar pendente.**

O caso mais claro é a transição do backlog histórico da Fase 2 para a execução das fases seguintes.

O backlog usou identificadores `B2-01`...`B2-18`. Esses IDs serviram ao backlog daquela fase, mas não podem continuar sendo usados como roadmap operacional atual.

---

# 3. Princípio central

A documentação será reconstruída a partir de evidências.

> **Documento não prova implementação. Código e validação provam implementação.**

Para cada item importante, a reconstrução deverá conseguir responder:

- o que é;
- onde está implementado;
- qual é a fonte de dados;
- qual é a API;
- qual é a interface;
- como foi validado;
- quando foi validado;
- qual commit contém a implementação;
- qual é o estado atual;
- o que ainda falta.

---

# 4. Fases da reconstrução documental

## FASE D0 — Inventário completo

### Objetivo

Encontrar **toda a documentação existente** no repositório.

### Varredura obrigatória

Pesquisar:

- `*.md`;
- `*.mdx`;
- `README*`;
- `docs/**`;
- `ADR*`;
- `roadmap/**`;
- `audit*`;
- `maintenance/**`;
- `plan*`;
- `checklist*`;
- `report*`;
- arquivos de configuração que contenham documentação operacional relevante;
- comentários/documentação de arquitetura quando forem fonte de decisão.

### Para cada arquivo registrar

| Campo | Descrição |
|---|---|
| Caminho | localização |
| Tipo | roadmap, auditoria, ADR, manutenção, histórico etc. |
| Assunto | tema principal |
| Data | quando foi produzido |
| Commit | origem |
| Estado | atual, histórico, obsoleto, contraditório |
| Autoridade | operacional ou apenas histórica |
| Ação | manter, atualizar, arquivar ou substituir |

### Critério de conclusão

Nenhum arquivo documental relevante fica fora do inventário.

---

# FASE D1 — Reconstrução da linha do tempo

### Objetivo

Reconstruir a história documental e funcional sem alterar o Git.

### Fontes

- commits;
- diffs;
- documentos;
- migrations;
- código;
- configuração;
- validações registradas.

### Resultado

Criar uma linha do tempo:

`implementação → validação → documentação → atualização posterior`

Isso permitirá identificar quando um documento ficou obsoleto.

### Critério de conclusão

Cada documento importante possui origem e contexto histórico identificáveis.

---

# FASE D2 — Matriz de verdade do estado atual

Esta será a etapa mais importante.

Para cada módulo/funcionalidade:

| Área | Implementação | Banco | API | UI | Segurança | Produção | Evidência | Estado |
|---|---|---|---|---|---|---|---|---|
| Autenticação | | | | | | | | |
| Senhas | | | | | | | | |
| Bootstrap | | | | | | | | |
| RBAC | | | | | | | | |
| Convites | | | | | | | | |
| Auditoria | | | | | | | | |
| Cidadão | | | | | | | | |
| Demandas | | | | | | | | |
| CMS | | | | | | | | |
| Conteúdo | | | | | | | | |
| Documentos | | | | | | | | |
| Evidências | | | | | | | | |
| Mídia | | | | | | | | |
| Agenda | | | | | | | | |
| Tarefas | | | | | | | | |
| Configurações | | | | | | | | |
| Equipe | | | | | | | | |
| Produção | | | | | | | | |
| Acessibilidade | | | | | | | | |
| Responsividade | | | | | | | | |

### Estados permitidos

Somente:

- **CONCLUÍDO**
- **EM ANDAMENTO**
- **PENDENTE**
- **NÃO VALIDADO**
- **HISTÓRICO**

Nunca usar "pendente" apenas porque um documento antigo não foi atualizado.

---

# FASE D3 — Reconciliação documental

Para cada contradição:

### Se o código comprova que está implementado

Atualizar a documentação para **CONCLUÍDO**.

### Se existe código mas falta validação

Usar **NÃO VALIDADO**, e não "não implementado".

### Se existe apenas planejamento

Usar **PENDENTE**.

### Se foi implementado parcialmente

Usar **EM ANDAMENTO** e indicar exatamente o que falta.

### Se pertence ao ciclo antigo

Classificar como **HISTÓRICO**.

---

# FASE D4 — Nova arquitetura documental

A documentação operacional deverá ser reorganizada em poucas categorias.

## A. Entrada principal

`docs/roadmap/ROADMAP-CANONICO.md`

Única fonte para responder:

> O que estamos fazendo agora?

Estrutura linear:

`FASE 0 → FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5 → ...`

Sem nomenclaturas paralelas de backlog.

## B. Fases

`docs/roadmap/FASE-N-*.md`

Cada fase contém:

- objetivo;
- escopo;
- estado;
- evidências;
- critérios de aceite;
- itens concluídos;
- itens pendentes;
- commit/checkpoint;
- decisão de encerramento;
- próxima fase.

## C. Auditorias

`docs/audits/**`

Somente auditorias e matrizes de estado.

## D. ADRs

`docs/adr/**`

Somente decisões arquiteturais/estruturais que precisam permanecer como referência.

## E. Manutenção

`docs/maintenance/**`

Registros técnicos específicos que não precisam controlar o roadmap.

## F. Histórico

Documentos antigos continuam preservados, mas devem ser claramente identificados como históricos quando puderem causar confusão.

---

# FASE D5 — Reconstrução do roadmap

Depois da matriz de verdade:

1. reescrever o `ROADMAP-CANONICO.md`;
2. remover B2-* da nomenclatura operacional;
3. manter a Fase 2 histórica intacta;
4. registrar quais itens do backlog histórico já foram absorvidos;
5. transformar somente pendências reais em fases atuais;
6. estabelecer uma única próxima fase;
7. impedir duas fases simultâneas sem dependência explícita.

### Regra

O roadmap nunca deve criar uma pendência por interpretação documental.

Ele deve ser derivado da matriz de estado.

---

# FASE D6 — Reconciliação de ADRs e documentos técnicos

Revisar todos os ADRs e documentos técnicos para verificar:

- se a decisão ainda existe;
- se foi implementada;
- se foi substituída;
- se está marcada como proposta quando já foi executada;
- se contém planos futuros apresentados como estado atual;
- se contradiz o código.

O ADR 0003 é um exemplo que deverá ser revisado porque mistura a implementação já realizada de política de senha com melhorias futuras ainda não implementadas.

---

# FASE D7 — Validação final da documentação

A documentação reconstruída será validada como se fosse usada por um agente novo.

O agente deverá conseguir responder sem consultar conversas anteriores:

1. qual é o estado atual;
2. qual é a arquitetura;
3. qual é o runtime;
4. qual é o banco;
5. quais módulos existem;
6. quais funcionalidades estão concluídas;
7. quais estão em andamento;
8. quais estão pendentes;
9. o que foi apenas planejado;
10. qual é a fase atual;
11. qual é a próxima fase;
12. qual evidência sustenta cada conclusão.

Se a resposta não puder ser obtida diretamente da documentação, a documentação ainda não está reconstruída.

---

# 5. Regra contra regressão documental

Depois da reconstrução:

### Nenhum commit de implementação poderá declarar uma funcionalidade como pendente sem verificar o estado atual.

### Nenhum documento antigo poderá alterar o roadmap atual.

### Nenhum backlog histórico poderá voltar a ser usado como sequência operacional.

### Toda conclusão deverá apontar para evidência.

### Toda pendência deverá possuir critério objetivo de aceite.

---

# 6. Resultado final esperado

Ao terminar a reconstrução, teremos:

```
DOCUMENTAÇÃO
│
├── ROADMAP-CANONICO.md
│
├── roadmap/
│   ├── FASE-0-...
│   ├── FASE-1-...
│   ├── FASE-2-...
│   ├── FASE-3-...
│   └── FASE-4-...
│
├── audits/
│   ├── INVENTARIO-DOCUMENTACAO.md
│   ├── MATRIZ-ESTADO-ATUAL.md
│   └── ...
│
├── adr/
│   └── decisões arquiteturais
│
├── maintenance/
│   └── registros técnicos
│
└── histórico preservado
```

O objetivo não é produzir mais documentação.

O objetivo é produzir **menos documentos operacionais, porém confiáveis**.

---

# 7. Ordem de execução

A reconstrução deve ocorrer exatamente nesta ordem:

1. **D0 — inventário completo**
2. **D1 — linha do tempo**
3. **D2 — matriz de verdade**
4. **D3 — reconciliação**
5. **D4 — organização documental**
6. **D5 — novo roadmap**
7. **D6 — ADRs/documentos técnicos**
8. **D7 — validação final**

Não implementar funcionalidades durante D0–D3.

Se a auditoria descobrir uma funcionalidade realmente ausente, ela será registrada como pendência e só poderá entrar na execução após a reconstrução documental.

---

# 8. Política de histórico Git

**Não apagar commits.**

**Não reescrever histórico.**

**Não fazer reset destrutivo.**

**Não apagar documentos históricos somente para esconder inconsistências.**

A reconstrução corrige a camada documental atual e preserva a rastreabilidade.

---

# 9. Critério de encerramento da reconstrução

A reconstrução documental só estará concluída quando:

- [ ] toda documentação relevante tiver sido inventariada;
- [ ] todos os documentos tiverem classificação;
- [ ] histórico tiver sido separado do estado atual;
- [ ] matriz de verdade tiver sido criada;
- [ ] contradições tiverem sido reconciliadas;
- [ ] roadmap estiver linear;
- [ ] B2-* não for mais nomenclatura operacional;
- [ ] ADRs contraditórios tiverem sido corrigidos;
- [ ] pendências reais tiverem critérios objetivos;
- [ ] cada conclusão importante possuir evidência;
- [ ] um agente novo conseguir reconstruir o estado do projeto somente lendo a documentação atual.

**Só depois desse checkpoint a execução normal das próximas fases deve continuar.**
