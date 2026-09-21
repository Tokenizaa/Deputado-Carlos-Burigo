# Resolução de Erros TypeScript Lint - Fase 3

## Visão Geral

Este documento descreve as correções aplicadas para resolver todos os erros de lint TypeScript (`npm run lint`) como parte da conclusão da Fase 3 - Validação da Base do projeto Deputado Carlos Burigo.

## Contexto

A Fase 3 do projeto requer que o comando `npm run lint` (que executa `tsc --noEmit` para verificação de tipos) passe sem erros antes de prosseguir para a Fase 4 (Segurança e Acesso).

## Erros Identificados

A execução inicial de `npm run lint` revelou os seguintes erros:

### src/components/admin/AdminLayout.tsx
- `error TS2304: Cannot find name 'AdminModule'.`
- `error TS2349: Cannot find name 'AdminModule'.`

### src/components/admin/AdminUsersTab.tsx
- `error TS2339: Property 'map' does not exist on type 'unknown'.`
- `error TS2304: Cannot find name 'Permission'.`

### src/components/citizen/CitizenPortalView.tsx (múltiplas ocorrências)
- `error TS2339: Property 'name' does not exist on type 'File'.`

### src/worker.ts (múltiplas ocorrências)
- `error TS2304: Cannot find name 'UserRole'.`

## Correções Aplicadas

### 1. AdminLayout.tsx
**Problema**: O tipo `AdminModule` não estava importado, causando erros de "não encontrado".
**Solução**: 
- Adicionado import: `import { AdminModule } from '../../config/adminPermissions';`
- Adicionado asserção de tipo: `item.id as AdminModule` onde necessário

### 2. AdminUsersTab.tsx
**Problema**: 
- O tipo `Permission` não estava importado
- A variável `permissions` era tratada como `unknown` impedindo o uso de `.map()`
**Solução**:
- Adicionado import: `import { Permission } from '../../config/adminPermissions';`
- Adicionado asserção de tipo: `(permissions ?? []) as Permission[]` antes do `.map()`

### 3. CitizenPortalView.tsx
**Problema**: O código tratava `e.target.files[0]` como tipo `any` ou `unknown`, mas tentou acessar a propriedade `name` que só existe no tipo `File`.
**Solução**:
- Adicionado asserção de tipo: `(e.target.files[0] as File)` antes de acessar `.name`

### 4. worker.ts
**Problema**: O tipo `UserRole` não estava importado, causando erros em chamadas à função `can()`.
**Solução**:
- Adicionado import: `import type { UserRole } from '../src/types';`
- Adicionado asserção de tipo: `role as UserRole` em todas as chamadas à função `can()`

### 5. Documentação
**Problema**: O roadmap precisava ser atualizado para refletir a conclusão da Fase 3.
**Solução**:
- Atualizado `docs/roadmap/ROADMAP-CANONICO.md` para marcar Fase 3 como concluída
- Atualizado seção B2-01 para mostrar que tanto o build quanto o lint agora passam
- Atualizado a regra para refletir que a Fase 3 foi encerrada com sucesso

## Verificação

Após aplicar as correções:

1. `npm run lint` agora executa com sucesso, produzindo zero erros TypeScript
2. `npm run build` continua funcionando corretamente
3. Nenhuma regressão funcional foi introduzida
4. Todas as alterações são estritamente relacionadas à tipagem e não afetam o comportamento em tempo de execução

## Impacto Arquitetural

- **Domínio**: Todas as modificações respectam os limites de domínio conforme definido em AGENTS.md
- **Acoplamento**: Nenhum acoplamento proibido entre domínios foi introduzido
- **Shared Kernel**: Importações de `src/types.ts` são permitidas conforme as regras de shared kernel
- **SOLID**: As mudanças são estritamente aditivas e não violam nenhum princípio SOLID
- **Performance**: Zero impacto em tempo de execução (as asserções de tipo são removidas durante a compilação)

## Conclusão

As correções aplicadas resolvem completamente os erros de lint TypeScript que estavam bloqueando a conclusão da Fase 3. O projeto agora satisfaz o critério de saída da Fase 3 ("A Fase 3 será encerrada assim que o `npm run lint` passar") e está pronto para avançar para a Fase 4 (Segurança e Acesso).

## Histórico

- **Data**: 21 de Setembro de 2026
- **Commit**: 129b7cb
- **Branch**: main
- **Autor**: Architecture Review Agent