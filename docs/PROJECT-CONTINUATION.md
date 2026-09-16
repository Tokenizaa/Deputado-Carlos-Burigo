# Conexão Pública — Continuidade do Projeto

## Ponto de retomada

A partir deste commit, o projeto deixa o estado de congelamento e entra em desenvolvimento contínuo.

O repositório GitHub é a referência compartilhada entre os agentes e o ambiente local.

## Regra de sincronização

1. O clone local recém-criado parte do estado atual da `main`.
2. Não fazer `git pull` automaticamente no início de uma tarefa.
3. Antes de alterar qualquer coisa, verificar `git status`, branch e último commit.
4. Trabalhar sobre a implementação existente; não reiniciar, duplicar arquitetura ou substituir infraestrutura sem necessidade.
5. Toda alteração relevante deve terminar em um commit pequeno, identificável e relacionado à tarefa.
6. O hash do commit deve ser informado ao final de cada execução.
7. Push para o GitHub somente quando solicitado ou quando a etapa de sincronização exigir explicitamente.
8. Nunca usar `reset --hard`, `clean -fd` ou operações destrutivas para resolver divergências sem autorização explícita.

## Fluxo permanente

```text
GitHub / commit conhecido
        ↓
clone ou workspace local
        ↓
auditoria do estado atual
        ↓
implementação / pesquisa / correção
        ↓
teste e verificação
        ↓
commit
        ↓
sincronização com o outro ambiente
```

## Regra de continuidade

O trabalho deve sempre continuar a partir do que já existe. Antes de criar uma nova implementação, localizar e reutilizar a implementação, tabela, migration, fluxo ou componente existente.

Para tarefas de pesquisa documental, preservar a proveniência das fontes e registrar somente informações verificadas de acordo com os critérios definidos no acervo legislativo.

## Marco

Este arquivo registra formalmente o início do ciclo de desenvolvimento contínuo após o período de congelamento. O commit que o introduz é o novo ponto de sincronização para o trabalho local.
