# RECONCILIAÇÃO DOCUMENTAL

**Data:** 21/09/2026  
**Branch:** main

## Objetivo

Eliminar divergências entre a documentação operacional e o estado real do projeto sem apagar histórico Git.

## Decisões

### 1. Histórico permanece

Roadmaps, auditorias e registros antigos permanecem no repositório quando úteis para rastreabilidade.

### 2. Histórico não é roadmap

Documentos de fases anteriores não definem a fase atual.

### 3. A implementação posterior prevalece

Quando um documento antigo disser que algo está pendente e um commit posterior comprovar a implementação, o estado atual deve refletir a implementação.

### 4. Não validar não significa não implementar

Quando o código existe, mas não há validação suficiente, o estado correto é **NÃO VALIDADO**.

### 5. O roadmap atual não usa identificadores históricos de backlog

Os identificadores usados no backlog da Fase 2 permanecem históricos. Não são nomenclatura operacional atual.

## Caso de referência: proteção de senha

O commit `ca6e172` implementou uma política reforçada de senha em:

- `src/lib/passwordValidation.ts`;
- bootstrap administrativo;
- cadastro de cidadão;
- `AdminBootstrapView`;
- `CitizenPortalView`.

A validação exige:

- mínimo de 12 caracteres;
- maiúscula;
- minúscula;
- dígito;
- caractere especial.

O commit também registra lint e build aprovados.

**Conclusão documental:** a implementação da política reforçada de senha está CONCLUÍDA no escopo implementado. Melhorias adicionais de autenticação permanecem separadas como trabalho futuro ou como itens ainda não validados.

## Caso de referência: produção

Existe documentação de smoke de produção e deploys posteriores. Um relatório antigo não deve ser tratado como snapshot atual sem considerar o commit/Worker correspondente.

## Caso de referência: fases antigas

Fases históricas continuam preservadas. Elas devem ser lidas como contexto, não como instruções para reabrir trabalho.

## Regra permanente

Antes de marcar uma tarefa como pendente, verificar:

1. código atual;
2. banco/configuração, quando aplicável;
3. commits posteriores;
4. validação existente;
5. documentação mais recente.

