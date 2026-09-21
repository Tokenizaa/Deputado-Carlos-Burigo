import { test, expect } from '@playwright/test';
import { trackPageErrors, RENDER_TIMEOUT } from './helpers';

// Bug de console conhecido (não fatal): React key warning no AgendaCalendar,
// emitido em dev. Reportado no relatório E2E; não bloqueia render da homepage.
const KNOWN_AGENDA_CALENDAR_KEY_WARNING = /Check the render method of `AgendaCalendar`/;

test('homepage carrega com identidade do deputado visível e sem erros de console', async ({ page }) => {
  test.setTimeout(150_000);
  const { pageErrors, consoleErrors } = trackPageErrors(page, {
    allowConsole: [KNOWN_AGENDA_CALENDAR_KEY_WARNING],
  });

  await page.goto('/');

  const hero = page.locator('h1#hero-title');
  await expect(hero).toBeVisible({ timeout: RENDER_TIMEOUT });
  await expect(hero).toContainText(/Búrigo/);
  await expect(page.getByRole('link', { name: 'Início' }).first()).toBeVisible({ timeout: RENDER_TIMEOUT });

  await page.screenshot({ path: '.superpowers/evidence/01-homepage.png', fullPage: true });

  expect(pageErrors, pageErrors.map((e) => e.message).join(" | ") || "no pageerror").toEqual([]);
  expect(consoleErrors, consoleErrors.join(" | ") || "no console error").toEqual([]);
});