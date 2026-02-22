import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const modules = ['login', 'usersystem', 'exames', 'pacientes', 'post'];
const e2eModules = ['login', 'patients', 'exams'];

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_WEB_URL,
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
projects: [
  {
    name: 'setup-global',
    testMatch: '**/auth.setup.ts',
  },

  ...modules.flatMap(module => [
    {
      name: `setup-${module.toLowerCase()}`,
      testMatch: `**/api/**/${module}/**/*.setup.ts`,
      dependencies: ['setup-global'],
    },
    {
      name: `api-${module.toLowerCase()}`,
      testMatch: `**/api/**/${module}/**/*.spec.ts`,
      dependencies: [`setup-${module.toLowerCase()}`],
    }
  ]),
  ...e2eModules.flatMap(module => [
    {
      name: `setup-e2e-${module.toLowerCase()}`,
      testMatch: `**/e2e/**/${module}/**/*.setup.ts`,
      dependencies: ['setup-global'],
    },
    {
      name: `e2e-${module.toLowerCase()}`,
      testMatch: `**/e2e/**/${module}/**/*.spec.ts`,
      dependencies: [`setup-e2e-${module.toLowerCase()}`],
    }
  ]),
],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
