import { test, expect } from '@playwright/test';
import { trackPageErrors } from './helpers';

// O 404 de /api/pages/<slug> é o fluxo DESENHADO desta tela; Chromium loga
// recurso 404 como console.error automaticamente (não é crash do app).
// Fired 2x por StrictMode remontando o useEffect em dev.
const KNOWN_404_RESOURCE_LOG = /Failed to load resource: the server responded with a status of 404/;

test('rota inexistente mostra página não encontrada sem crash', async ({ page }) => {
  test.setTimeout(150_000);
  const { pageErrors, consoleErrors } = trackPageErrors(page, {
    allowConsole: [KNOWN_404_RESOURCE_LOG],
  });

  await page.goto('/pagina-inexistente-teste');

  await expect(page.getByText('Página não encontrada.')).toBeVisible({ timeout: 90_000 });

  await page.screenshot({ path: '.superpowers/evidence/04-pagina-inexistente.png', fullPage: true });

  expect(pageErrors, pageErrors.map((e) => e.message).join(" | ") || "no pageerror").toEqual([]);
  expect(consoleErrors, consoleErrors.join(" | ") || "no console error").toEqual([]);
});

test('rota /api inexistente responde 404 JSON', async ({ request }) => {
  test.setTimeout(30_000);
  const res = await request.get('/api/rota-inexistente');
  expect(res.status()).toBe(404);
  expect(await res.json()).toMatchObject({ error: 'Not Found' });
});