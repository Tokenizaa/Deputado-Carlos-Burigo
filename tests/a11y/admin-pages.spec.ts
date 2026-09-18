import { test, expect } from '@playwright/test';
import { navigateAndWaitForHydration, assertNoCriticalOrSeriousViolations, ADMIN_PAGES } from './utils/a11y';

async function switchAdminTab(page: any, tabName: string): Promise<void> {
  const testId = `[data-testid="admin-tab-${tabName}"]`;
  const textSelector = `button:has-text("${tabName}")`;

  try {
    await page.click(testId, { timeout: 2000 });
    return;
  } catch {
    // ignore
  }

  try {
    await page.click(textSelector, { timeout: 2000 });
    return;
  } catch {
    // ignore
  }

  await page.evaluate((tab) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const target = buttons.find(b => b.textContent?.toLowerCase().includes(tab.toLowerCase()));
    target?.click();
  }, tabName);
}

test.describe('Accessibility Audit - Admin Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.waitForTimeout(500);
  });

  for (const pageInfo of ADMIN_PAGES) {
    test(`${pageInfo.name} - WCAG 2.1 AA + eMAG v3.1`, async ({ page }) => {
      if (pageInfo.tab) {
        await switchAdminTab(page, pageInfo.tab);
        await page.waitForTimeout(300);
      }
      await assertNoCriticalOrSeriousViolations(page, `Admin: ${pageInfo.name}`);
    });
  }
});

test.describe('Accessibility Audit - Admin Pages (Mobile)', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.waitForTimeout(500);
  });

  for (const pageInfo of ADMIN_PAGES) {
    test(`${pageInfo.name} - Mobile (375x667 @2x) - WCAG 2.1 AA + eMAG v3.1`, async ({ page }) => {
      if (pageInfo.tab) {
        await switchAdminTab(page, pageInfo.tab);
        await page.waitForTimeout(300);
      }
      await assertNoCriticalOrSeriousViolations(page, `Admin Mobile: ${pageInfo.name}`);
    });
  }
});