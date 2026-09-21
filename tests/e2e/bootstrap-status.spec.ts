import { test, expect } from '@playwright/test';
import { trackPageErrors, RENDER_TIMEOUT } from './helpers';

test('página /admin renderiza login e consulta bootstrap-status sem crash', async ({ page }) => {
  test.setTimeout(150_000);
  const { pageErrors, consoleErrors } = trackPageErrors(page);

  const statusResponse = page.waitForResponse(
    (r) => r.url().includes('/api/auth/bootstrap-status') && r.request().method() === 'GET',
  );
  await page.goto('/admin');

  await expect(page.getByRole('heading', { name: 'Acesso do gabinete' })).toBeVisible({ timeout: RENDER_TIMEOUT });
  const res = await statusResponse;
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(typeof body.available).toBe('boolean');

  await page.screenshot({ path: '.superpowers/evidence/02-admin-login.png', fullPage: true });

  expect(pageErrors, pageErrors.map((e) => e.message).join(" | ") || "no pageerror").toEqual([]);
  expect(consoleErrors, consoleErrors.join(" | ") || "no console error").toEqual([]);
});

test('rotas públicas /api/auth/bootstrap-status e /api/auth/config respondem', async ({ request }) => {
  test.setTimeout(30_000);
  const statusRes = await request.get('/api/auth/bootstrap-status');
  expect(statusRes.status()).toBe(200);
  expect(typeof (await statusRes.json()).available).toBe('boolean');

  const configRes = await request.get('/api/auth/config');
  expect(configRes.status()).toBe(200);
  const config = await configRes.json();
  expect(typeof config.url).toBe('string');
  expect(config.url.length).toBeGreaterThan(0);
});