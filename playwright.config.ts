// playwright.config.ts

import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',

  // --- ADD THIS LINE ---
  /* Maximum time one test can run for. */
  timeout: 120 * 1000, // 120 seconds
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 3000 // 3 seconds
  },
  /* Shared settings for all projects. */
  use: {
    baseURL: 'https://autamigouat3.autamigo.com',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  /* Projects configuration */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },
  ],
});