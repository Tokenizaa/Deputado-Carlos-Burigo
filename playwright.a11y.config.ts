import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/a11y',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report/a11y', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/a11y-results.json' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        deviceScaleFactor: 2,
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
  timeout: 60000,
});