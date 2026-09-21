import type { Page } from '@playwright/test';

/**
 * Coleta erros de runtime (pageerror) e console.error do browser.
 *
 * `allowConsole`: regexes de mensagens de console.error conhecidas e classificadas
 * (ver relatório E2E) que NÃO devem falhar o teste — bugs de produto não fatais,
 * reportados separadamente. pageerror NUNCA é tolerado.
 */
export function trackPageErrors(page: Page, options?: { allowConsole?: RegExp[] }) {
  const pageErrors: Error[] = [];
  const consoleErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (options?.allowConsole?.some((re) => re.test(text))) return;
    consoleErrors.push(text);
  });
  return { pageErrors, consoleErrors };
}

/** Timeout de expect generoso: dev server local serializa requisições (ver relatório). */
export const RENDER_TIMEOUT = 60_000;