# AGENTE LOCAL — REVISÃO E VALIDAÇÃO OPEN GRAPH

Repositório: Tokenizaa/Deputado-Carlos-Burigo
Branch: main

A correção de Open Graph já está no main:
ec13176a86dfbabd838afe97989242efa18b719b

Ela:
- garante URL absoluta para og:image;
- usa /assets/carlos_burigo_portrait.png como fallback;
- adiciona og:image:secure_url;
- declara image/png;
- adiciona dimensões e alt;
- corrige imagens configuradas como caminho relativo;
- adiciona teste unitário.

## Executar

1. git pull --ff-only origin main

2. Validar:
npx vitest run tests/unit/open-graph-image.test.ts
npm run lint
npm run build

3. Executar o ambiente local e verificar o HTML de uma página pública.
Confirmar a presença de:
<meta property="og:image" ...>
<meta property="og:image:secure_url" ...>
<meta name="twitter:image" ...>

A URL deve ser absoluta.

4. Validar o asset público:
curl -I http://localhost:<PORTA>/assets/carlos_burigo_portrait.png

Esperado: HTTP 200 e Content-Type de imagem.

5. Se as credenciais Cloudflare estiverem disponíveis:
npm run deploy

6. Após o deploy, validar a URL pública real e o HTML final. Não considerar somente o código-fonte.

7. Se encontrar qualquer problema de renderização, corrigir somente Open Graph/imagem e repetir build/test/deploy.

## Commit

Não criar novo commit se ec13176a86dfbabd838afe97989242efa18b719b resolver o problema.

Se houver correção adicional:
git add ...
git commit -m "fix: validate Open Graph image rendering"
git push origin main

## Entrega

Informar testes, lint, build, URL pública validada, status HTTP do asset, deploy e SHA final.
