import { test, expect } from '@playwright/test';
import { trackPageErrors, RENDER_TIMEOUT } from './helpers';

const publicPages = [
  { path: '/noticias', heading: /Notícias & Posicionamentos Oficiais/ },
  { path: '/agenda', heading: /Agenda Pública/ },
  { path: '/resultados', heading: /Resultados e pautas documentados/ },
];

for (const { path, heading } of publicPages) {
  test(`página pública ${path} renderiza sem crash`, async ({ page }) => {
    test.setTimeout(150_000);
    const { pageErrors, consoleErrors } = trackPageErrors(page);

    await page.goto(path);

    await expect(page.locator('#conteudo-principal')).toBeVisible({ timeout: RENDER_TIMEOUT });
    await expect(page.getByRole('heading', { name: heading })).toBeVisible({ timeout: RENDER_TIMEOUT });

    await page.screenshot({ path: `.superpowers/evidence/03${path.replaceAll('/', '-')}.png`, fullPage: true });

    expect(pageErrors, pageErrors.map((e) => e.message).join(" | ") || "no pageerror").toEqual([]);
    expect(consoleErrors, consoleErrors.join(" | ") || "no console error").toEqual([]);
  });
}

test('página pública /minhas-demandas renderiza área do cidadão sem crash', async ({ page }) => {
  test.setTimeout(150_000);
  const { pageErrors, consoleErrors } = trackPageErrors(page);

  await page.goto('/minhas-demandas');

  await expect(page.getByRole('heading', { name: 'Área do Cidadão' })).toBeVisible({ timeout: RENDER_TIMEOUT });

  await page.screenshot({ path: '.superpowers/evidence/03-minhas-demandas.png', fullPage: true });

  expect(pageErrors, pageErrors.map((e) => e.message).join(" | ") || "no pageerror").toEqual([]);
  expect(consoleErrors, consoleErrors.join(" | ") || "no console error").toEqual([]);
});