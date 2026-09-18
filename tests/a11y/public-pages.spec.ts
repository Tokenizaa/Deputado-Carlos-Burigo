import { test, expect } from '@playwright/test';
import { navigateAndWaitForHydration, assertNoCriticalOrSeriousViolations, PUBLIC_PAGES } from './utils/a11y';

test.describe('Accessibility Audit - Public Pages', () => {
  for (const pageInfo of PUBLIC_PAGES) {
    test(`${pageInfo.name} - WCAG 2.1 AA + eMAG v3.1`, async ({ page }) => {
      test.setTimeout(120000);
      await navigateAndWaitForHydration(page, pageInfo.path);
      await assertNoCriticalOrSeriousViolations(page, `Public: ${pageInfo.name}`);
    });
  }
});

test.describe('Accessibility Audit - Public Pages (Mobile)', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
  });

  for (const pageInfo of PUBLIC_PAGES) {
    test(`${pageInfo.name} - Mobile (375x667 @2x) - WCAG 2.1 AA + eMAG v3.1`, async ({ page }) => {
      test.setTimeout(120000);
      await navigateAndWaitForHydration(page, pageInfo.path);
      await assertNoCriticalOrSeriousViolations(page, `Public Mobile: ${pageInfo.name}`);
    });
  }
});