# PLANO DE TESTES — BATERIA GERAL DA FASE 4

**Data:** 21/09/2026  
**Estado:** PLANEJAMENTO / EXECUÇÃO LOCAL  

## Objetivo

Transformar a FASE 4 em uma validação objetiva e reproduzível usando os agentes locais, as skills de Playwright e as ferramentas de testes existentes no projeto.

## Regra principal

Não considerar uma funcionalidade validada apenas porque existe código, rota, migration, policy ou componente. A validação deve ter evidência adequada ao tipo de capacidade:

- testes unitários para regras puras;
- testes de integração para serviços, APIs e banco;
- testes HTTP para autenticação e autorização de endpoints;
- Playwright para fluxos reais de navegador;
- build, typecheck e lint;
- smoke local e, quando seguro, smoke de produção.

Não criar mocks para substituir infraestrutura real quando a infraestrutura real já estiver disponível.

## Escopo da FASE 4

### 4.1 Autenticação
- login administrativo;
- logout;
- sessão expirada ou inválida;
- acesso sem autenticação;
- autenticação cidadã;
- separação entre cidadão e equipe;
- persistência e recuperação de sessão;
- proteção das rotas administrativas.

### 4.2 Proteção de senha
- mínimo de 12 caracteres;
- maiúscula;
- minúscula;
- dígito;
- caractere especial;
- senha inválida no frontend e backend;
- senha válida;
- bootstrap;
- cadastro cidadão;
- mensagens de erro;
- consistência entre UI e API.

### 4.3 Admin bootstrap
- primeiro bootstrap;
- bootstrap já realizado;
- concorrência/race condition;
- credenciais inválidas;
- senha inválida;
- tentativa sem autorização;
- criação correta de usuário, perfil e papel;
- impossibilidade de repetir o claim.

### 4.4 RLS
Para cada domínio relevante, testar ANON, CITIZEN_A, CITIZEN_B e os papéis administrativos aplicáveis.

Para cada tabela protegida, verificar SELECT, INSERT, UPDATE e DELETE, incluindo isolamento por proprietário, acesso administrativo e acesso público quando explicitamente permitido.

O teste deve comprovar também negação de acesso, não apenas sucesso.

### 4.5 RBAC
Testar os papéis ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO e VISUALIZADOR.

Testar, quando aplicável, view, create, edit, publish, delete, manage_users, view_audit e manage_settings.

Verificar tanto a interface quanto a proteção real do endpoint. Esconder botão não é controle de segurança.

### 4.6 Convites
- criação;
- token e hash;
- expiração;
- convite já utilizado;
- e-mail diferente;
- aprovação e rejeição;
- aceite;
- criação do perfil;
- atribuição do papel;
- acesso posterior;
- invalidação quando aplicável.

### 4.7 Auditoria
- geração do log;
- usuário responsável;
- ação;
- recurso;
- timestamp;
- metadados relevantes;
- bloqueio de consulta não autorizada;
- leitura por ADMIN;
- leitura pelos papéis permitidos;
- integridade do registro.

## Camadas

### A — Unitários
Completar testes para validatePassword, can, visibleModules, helpers de autorização, validações de convite, regras de expiração e hashing/validação de tokens quando isoláveis.

Testar positivos, negativos e limites.

### B — Integração
Testar contra a infraestrutura real ou ambiente de teste equivalente: Supabase Auth, tabelas, RLS, policies, funções SQL, bootstrap, convites, audit logs e endpoints do Worker.

Não duplicar a lógica de produção dentro dos testes.

### C — API/HTTP
Testar método, status HTTP, payload, headers, autenticação, autorização, erros, sessão expirada e tentativas de bypass.

### D — Playwright
Criar ou completar testes E2E para login, cidadão, dashboard administrativo, bootstrap, convite, aceite, acesso por papel, acesso proibido, auditoria, logout, sessão expirada, recuperação de senha se existir, responsividade, erros e loading.

Reutilizar a configuração Playwright existente. Não criar uma segunda configuração.

Preferir roles, labels e test IDs estáveis em vez de classes CSS frágeis ou texto incidental.

### E — Smoke
Executar build, typecheck, lint, testes unitários, integração, Playwright, smoke local e smoke de produção quando seguro.

## Identidades de teste

| Identidade | Objetivo |
|---|---|
| ANON | negação pública/privada |
| CITIZEN_A | isolamento |
| CITIZEN_B | provar que A não acessa B |
| ADMIN | acesso integral |
| EDITOR | permissões intermediárias |
| COMUNICACAO | permissões de comunicação |
| ATENDIMENTO | permissões de atendimento |
| VISUALIZADOR | somente leitura |

Não reutilizar uma única identidade para todos os testes. Credenciais reais nunca devem ser commitadas. Preferir contas temporárias e cleanup automático.

## Testes negativos obrigatórios

- endpoint sem sessão;
- sessão de tipo incorreto;
- cidadão A acessando registro de B;
- papel inferior chamando endpoint administrativo;
- alteração de ID na URL;
- alteração de ID no payload;
- campos extras;
- convite expirado ou repetido;
- convite com e-mail diferente;
- repetição de bootstrap;
- operação após logout;
- consulta de auditoria sem permissão;
- publish sem publish;
- delete sem delete;
- manage_users sem manage_users.

## Matriz de evidência

Cada teste deve registrar ID, camada, funcionalidade, identidade, ação, resultado esperado, resultado obtido, evidência e estado.

Estados permitidos: PASSOU, FALHOU, BLOQUEADO, NÃO APLICÁVEL.

Teste não executado é BLOQUEADO, nunca PASSOU.

## Regra de investigação

Quando um teste falhar: reproduzir; classificar como produto, teste, ambiente, dados ou configuração; corrigir somente com evidência; executar novamente; registrar o resultado.

Não apagar teste para fazer a suite passar. Não reduzir cobertura. Não criar bypass. Não criar implementação paralela somente para satisfazer o teste.

## Critério de conclusão

A FASE 4 só poderá ser marcada como concluída quando os testes críticos unitários, integração, API e Playwright passarem; RLS tiver testes positivos e negativos; RBAC tiver testes por papel; bootstrap, convites e auditoria tiverem fluxos reais; build/typecheck/lint passarem; nenhuma falha crítica ficar sem classificação; e a matriz de estado real for atualizada com evidências.

## Responsabilidade dos agentes

O agente principal deve orquestrar a bateria, não criar uma segunda arquitetura.

Antes de escrever testes, deve auditar framework, configuração Playwright, fixtures, scripts, testes existentes, skills disponíveis, ambiente local, Supabase, Worker e autenticação.

Depois deve montar uma matriz do que já é testado e do que falta, distribuir o trabalho por domínio, executar, corrigir problemas reais, separar falhas de produto de falhas do teste e consolidar as evidências.

## Prompt operacional

> Você está executando a bateria geral de testes da FASE 4.
>
> Não recrie o projeto, não crie segunda arquitetura e não substitua infraestrutura existente.
>
> Primeiro audite framework de testes, configuração Playwright, fixtures, scripts, testes existentes, skills, ambiente local, Supabase, Worker/API e autenticação.
>
> Monte uma matriz objetiva do que já é testado e do que falta.
>
> Execute e complete testes unitários, integração, API/HTTP, Playwright E2E, build, typecheck, lint e smoke.
>
> Cubra autenticação, proteção de senha, admin bootstrap, RLS, RBAC, convites e auditoria.
>
> Para RLS e RBAC, crie testes negativos que comprovem bloqueio real. Use identidades separadas para ANON, CITIZEN_A, CITIZEN_B, ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO e VISUALIZADOR quando aplicável.
>
> Use a configuração Playwright existente. Prefira locators semânticos e fixtures reutilizáveis.
>
> Para banco e segurança, valide infraestrutura real. Não transforme mocks em substitutos da segurança.
>
> Toda falha deve ser reproduzida e classificada. Não apagar testes, reduzir cobertura ou criar bypass para eliminar falhas.
>
> Ao final, produza testes criados/alterados, comandos executados, resultados, falhas, correções, cobertura por domínio, evidências, itens bloqueados e riscos restantes.
>
> Atualize a documentação da FASE 4 e a matriz de estado real somente com resultados efetivamente executados. Item não executado permanece NÃO VALIDADO/BLOQUEADO.