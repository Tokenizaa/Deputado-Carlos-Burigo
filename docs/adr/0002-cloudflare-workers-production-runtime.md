# ADR 0002: Cloudflare Workers como plataforma de produção

- **Status:** Accepted
- **Date:** 2026-09-18
- **Decision:** Manter o deploy de produção exclusivamente em Cloudflare Workers
- **Scope:** Runtime e publicação da aplicação web

## Context

O repositório passou por uma fase anterior em que havia artefatos e referências de execução associados a outras plataformas e camadas de API. A arquitetura atual precisa manter uma única superfície de produção para evitar configurações concorrentes e caminhos de deploy divergentes.

O runtime público atual é um Cloudflare Worker, publicado no domínio de produção configurado para o projeto.

## Decision

Cloudflare Workers é a plataforma canônica de produção deste repositório.

A aplicação deve ser publicada como Worker e a configuração de produção deve permanecer compatível com esse runtime.

Não devem ser reintroduzidos como caminhos alternativos de produção:

- Vercel Functions;
- uma camada `api/` paralela ao Worker;
- um segundo runtime de produção para a mesma aplicação.

Configurações locais ou específicas de desenvolvimento podem existir quando necessárias ao fluxo de desenvolvimento, mas não devem criar uma segunda arquitetura de produção.

## Consequences

### Positivas

- Um único runtime de produção.
- Menor risco de divergência entre ambientes.
- Menos código específico de plataforma.
- Deploy e validação podem ser tratados como uma única cadeia.

### Trade-offs

- O código de servidor deve respeitar as capacidades e limites do runtime Cloudflare Workers.
- Dependências incompatíveis com Workers não devem ser introduzidas apenas para reproduzir padrões de outro runtime.
- Migrações de plataforma futuras exigirão uma nova decisão arquitetural.

## Current production surface

O Worker de produção é a superfície pública canônica da aplicação.

A arquitetura atual não depende de uma pasta `api/` separada para expor a aplicação pública.

## Alternatives considered

1. Manter Cloudflare e Vercel como runtimes de produção equivalentes.
2. Manter uma API serverless separada e o Worker apenas como camada de frontend.
3. Criar uma segunda implementação de runtime para compatibilidade com outro provedor.

Essas alternativas introduziriam mais de uma superfície de produção para o mesmo produto.

## Operational rule

Quando uma alteração exigir comportamento específico de produção, a primeira implementação deve ser compatível com Cloudflare Workers. Uma nova plataforma somente deve ser adicionada por meio de uma decisão arquitetural explícita e documentada.

## Related

- Configuração de Worker do repositório.
- PR #18: `refactor: canonical single-source public platform`
- Histórico de remoção da antiga camada `api/`.
