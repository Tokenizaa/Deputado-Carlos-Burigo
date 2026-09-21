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


## 12. Evolução — Cadastro completo e onboarding interno

A Fase 12 passa a incluir uma camada de **perfil operacional completo**, sem transformar o sistema em RH.

### 12.7 — Modelo de perfil interno

O cadastro interno deve separar:

**Identidade**
- nome completo;
- nome de exibição;
- avatar;
- e-mail de acesso;
- telefone.

**Informações funcionais**
- cargo;
- área/setor;
- função;
- responsabilidades;
- descrição profissional curta;
- e-mail institucional, quando diferente do login;
- telefone institucional, quando aplicável;
- município principal de atuação;
- data de entrada na equipe.

**Acesso**
- papel institucional;
- permissões derivadas de adminPermissions.ts.

A identidade continua em public.profiles, relacionada diretamente a auth.users. Não será criada uma tabela paralela de membros.

### 12.8 — Onboarding do usuário interno

Após o primeiro cadastro/autenticação decorrente de um convite, o usuário interno deverá passar automaticamente por:

1. identificação e confirmação do nome;
2. foto/avatar;
3. telefone;
4. área/setor;
5. função;
6. responsabilidades principais;
7. município de atuação;
8. conclusão do perfil.

O onboarding deve ser curto, dividido em etapas claras e permitir salvar o perfil sem exigir informações desnecessárias.

Ao concluir, registrar profiles.onboarding_completed_at.

Enquanto o onboarding estiver incompleto, um usuário interno autenticado será direcionado automaticamente para /onboarding-interno antes de acessar /admin.

### 12.9 — Avatar

O avatar será opcional, porém fortemente recomendado.

O arquivo deverá usar a infraestrutura de upload já existente (/api/admin/upload) e armazenamento privado/interno quando apropriado. O perfil armazenará somente a URL do avatar.

Não criar novo bucket ou novo sistema de mídia.

### 12.10 — Papéis institucionais

A descrição dos papéis será refinada para eliminar a sobreposição entre EDITOR e COMUNICACAO:

- **ADMIN — Administrador Geral:** administração do sistema, equipe, configurações e auditoria.
- **EDITOR — Editor de Conteúdo Institucional:** manutenção e gestão das informações, documentos e conteúdos institucionais autorizados.
- **COMUNICACAO — Assessoria de Comunicação:** produção e publicação de comunicação pública do gabinete.
- **ATENDIMENTO — Equipe de Atendimento:** atendimento e acompanhamento das demandas dos cidadãos.
- **VISUALIZADOR — Consulta:** acesso de leitura aos módulos autorizados.

A distinção é funcional: EDITOR representa manutenção transversal de informação institucional; COMUNICACAO representa atuação especializada em comunicação pública.

As permissões técnicas existentes não serão alteradas automaticamente apenas pela mudança de nomenclatura.

### 12.11 — Usuário externo

O cadastro público deverá permanecer mínimo:

- nome;
- e-mail;
- telefone/WhatsApp.

Dados adicionais serão solicitados somente quando necessários para uma finalidade específica de atendimento.

Não reutilizar o onboarding interno para cidadãos.

### 12.12 — Privacidade e minimização

Não coletar no cadastro interno, sem necessidade operacional explícita:
- CPF;
- RG;
- endereço residencial;
- dados bancários;
- estado civil;
- dependentes;
- dados sensíveis.

A regra é coletar apenas o necessário para identidade, operação do gabinete e controle de acesso.

## 13. Critérios adicionais de aceite

- usuário convidado consegue concluir autenticação e chegar ao onboarding;
- usuário interno sem onboarding concluído não entra no workspace administrativo;
- usuário com onboarding concluído entra normalmente;
- avatar pode ser enviado pela infraestrutura existente;
- dados do perfil são persistidos no public.profiles;
- administrador consegue visualizar o perfil operacional;
- EDITOR e COMUNICACAO ficam claramente diferenciados na interface;
- nenhuma segunda tabela de usuários/equipe é criada.


### 12.13 — Meu Perfil

Após o onboarding, cada usuário interno terá uma página permanente em /meu-perfil.

A página reutiliza o mesmo modelo de dados do onboarding e permite ao próprio usuário:
- consultar seus dados;
- alterar nome e nome de exibição;
- atualizar avatar;
- atualizar contatos;
- atualizar área e função;
- atualizar responsabilidades e apresentação;
- atualizar município e data de entrada.

O e-mail de autenticação e o papel institucional são exibidos, mas não podem ser alterados pelo próprio usuário.

O acesso ao perfil será disponibilizado diretamente pela identificação do usuário no painel, sem criar um novo módulo de equipe ou uma segunda identidade.

Critério de aceite: após concluir o onboarding, o usuário consegue retornar ao seu perfil a qualquer momento, alterar seus dados e persistir as alterações em public.profiles.
