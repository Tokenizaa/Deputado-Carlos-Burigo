# AGENTE LOCAL — FASE 4 / TESTES RBAC

## Objetivo

Finalizar a etapa de testes unitários do RBAC configurável da Fase 4.

## Repositório

`Tokenizaa/Deputado-Carlos-Burigo`

Branch de trabalho: `main`

## Tarefa

Os dois testes abaixo já foram adicionados ao GitHub:

- `tests/unit/rbac-effective-matrix.test.ts`
- `tests/unit/admin-permissions-matrix.test.ts`

No ambiente local:

1. Atualize o repositório:
   `git pull --ff-only origin main`

2. Execute exatamente:
   `npx vitest run tests/unit/rbac-effective-matrix.test.ts tests/unit/admin-permissions-matrix.test.ts`

3. Se os dois testes passarem, execute:
   `npm run lint`
   `npm run test:unit`
   `npm run test:integration`
   `npm run test:api`
   `npm run test:smoke`

4. Se houver falha:
   - diagnostique a causa;
   - corrija somente o necessário para os testes/RBAC;
   - não faça refatoração ampla;
   - execute novamente as validações afetadas.

5. Não altere arquitetura, UI ou funcionalidades fora do escopo.

6. Não crie novos arquivos de documentação além deste arquivo.

## Commit

Somente faça commit depois que as validações estiverem verdes.

Mensagem obrigatória:

`test: validate RBAC permission matrix`

Depois do commit:

`git push origin main`

## Resultado esperado

Entregar:

- testes RBAC passando;
- lint passando;
- suíte disponível passando;
- commit realizado;
- push para `main`;
- informar o SHA do commit e qualquer validação que não exista ou não possa ser executada no ambiente local.

Não declarar a Fase 4 concluída. Esta tarefa apenas fecha a etapa de testes RBAC.
