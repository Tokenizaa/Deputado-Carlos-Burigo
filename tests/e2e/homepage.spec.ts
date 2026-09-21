import { test, expect } from '@playwright/test';
import { trackPageErrors, RENDER_TIMEOUT } from './helpers';

test('homepage carrega com identidade do deputado visível e sem erros de console', async ({ page }) => {
  test.setTimeout(150_000);
  const { pageErrors, consoleErrors } = trackPageErrors(page);

  await page.goto('/');

  const hero = page.locator('h1#hero-title');
  await expect(hero).toBeVisible({ timeout: RENDER_TIMEOUT });
  await expect(hero).toContainText(/Búrigo/);
  await expect(page.getByRole('link', { name: 'Início' }).first()).toBeVisible({ timeout: RENDER_TIMEOUT });

  await page.screenshot({ path: '.superpowers/evidence/01-homepage.png', fullPage: true });

  expect(pageErrors, pageErrors.map((e) => e.message).join(" | ") || "no pageerror").toEqual([]);
  expect(consoleErrors, consoleErrors.join(" | ") || "no console error").toEqual([]);
});