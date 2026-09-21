# Fase 12 — Gestão Operacional da Equipe

**Data:** 2026-09-21  
**Status:** EXECUÇÃO  
**Módulo:** Administração / Equipe

## 1. Objetivo

Evoluir o módulo **Equipe** de um gerenciador de convites e usuários para uma visão operacional da equipe do gabinete, sem criar uma segunda arquitetura de usuários ou permissões.

A equipe passa a ser entendida como:

```
Equipe
  ↓
Pessoas + cargos + papéis
  ↓
Permissões
  ↓
Responsabilidade operacional
  ↓
Tarefas
```

## 2. Diagnóstico do estado anterior

O módulo existente já possuía:

- usuários reais via `/api/auth/me`;
- convites via `/api/admin/invites`;
- aprovação e recusa;
- nome, e-mail, cargo e papel;
- cinco papéis institucionais;
- matriz de permissões em `adminPermissions.ts`;
- tabela `public.admin_invites`;
- integração indireta com `public.tasks` por `assigned_to`.

O problema era principalmente de experiência operacional: a tela mostrava contas e convites, mas não ajudava o administrador a compreender a distribuição de trabalho da equipe.

## 3. Princípios

1. **Não criar tabela `team_members`.**
2. **Não duplicar usuários.**
3. **Não criar novo sistema de permissões.**
4. **Não alterar o fluxo existente de convites.**
5. **Usar `allUsers` como fonte dos membros.**
6. **Usar `tasks.assigned_to` para indicadores operacionais.**
7. **Manter `adminPermissions.ts` como fonte das permissões.**
8. **Não inventar campos que o banco ainda não possui.**
9. **A tela deve continuar simples e administrativa.**

## 4. Experiência alvo

### Cabeçalho

Exibir:

- quantidade de membros;
- quantidade de tarefas atribuídas;
- quantidade de tarefas em atraso;
- ação `Adicionar membro`.

### Lista da equipe

Cada membro deve mostrar:

- nome;
- cargo;
- e-mail;
- papel;
- indicação da sessão atual;
- quantidade de tarefas;
- tarefas em andamento;
- tarefas atrasadas.

A lista deve permitir:

- busca por nome, e-mail ou cargo;
- filtro por papel.

### Detalhe do membro

Ao selecionar um membro, abrir uma ficha operacional contendo:

**Identificação**
- nome;
- cargo;
- e-mail;
- papel.

**Operação**
- tarefas atribuídas;
- pendentes;
- em andamento;
- aguardando;
- concluídas;
- atrasadas.

**Acesso**
- módulos disponíveis;
- permissões do papel.

O detalhe não cria perfil paralelo nem grava novos dados.

## 5. Permissões

A interface passa a tornar a matriz existente compreensível para o administrador.

Para cada módulo relevante:

- visualizar;
- criar;
- editar;
- publicar;
- excluir;
- permissões administrativas especiais quando aplicável.

A fonte continua sendo:

`src/config/adminPermissions.ts`

Nenhuma permissão será criada ou alterada nesta fase.

## 6. Convites

O fluxo atual permanece:

```
convite → aceite → aprovação → usuário
```

A área de convites será visualmente separada da equipe já cadastrada.

Não será criado um novo status de usuário nesta fase, porque o modelo atual de `User` não possui esse campo.

## 7. Integração com Tarefas

Os indicadores serão derivados dos dados já carregados pelo `AppContext`:

```
tasks
  ↓
assignedTo
  ↓
membro
  ↓
contadores operacionais
```

Nenhuma duplicação será persistida.

## 8. Fases de implementação

### 12.1 — Fundação operacional
- reorganizar a hierarquia visual;
- resumo da equipe;
- separar membros e convites.

### 12.2 — Lista operacional
- busca;
- filtro por papel;
- indicadores de tarefas;
- estados vazios.

### 12.3 — Detalhe do membro
- ficha em modal;
- indicadores;
- tarefas atribuídas;
- sessão atual.

### 12.4 — Acesso
- exibir matriz de permissões derivada do código existente;
- tornar papéis compreensíveis.

### 12.5 — Refinamento
- responsividade;
- acessibilidade;
- foco;
- controles de 44px;
- redução de ruído visual.

### 12.6 — Verificação
- build;
- typecheck;
- verificação visual;
- busca;
- filtro;
- abertura do detalhe;
- contadores;
- convite;
- aprovação;
- operação em mobile.

## 9. Fora do escopo

- nova tabela de membros;
- novo sistema de autenticação;
- permissões customizadas por usuário;
- múltiplos papéis por usuário;
- status ativo/inativo persistido;
- último acesso persistido;
- notificações;
- organograma;
- equipes/departamentos;
- edição de dados do usuário sem API existente;
- novo workflow de convites.

## 10. Critério de aceite

O administrador deve conseguir:

1. identificar rapidamente quem compõe a equipe;
2. localizar um membro;
3. filtrar por papel;
4. entender a responsabilidade operacional de cada membro;
5. abrir o detalhe de um membro;
6. visualizar as permissões do papel;
7. visualizar a carga de tarefas;
8. continuar administrando convites sem perder o fluxo existente.

## 11. Decisão

O módulo **Equipe** será uma camada operacional sobre os dados existentes, conectando usuários, permissões e tarefas sem criar uma nova arquitetura.

**Próxima ação:** implementar as fases 12.1 a 12.5 no componente existente e validar a integração.
