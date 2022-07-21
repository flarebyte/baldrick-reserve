import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const devConfig: PlaywrightTestConfig = {
  testDir: "./e2e",
  timeout: 20 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  reporter: [
    ["html", { outputFolder: "report/playwright-html" }],
    ["json", { outputFile: "report/playwright-test-results.json" }],
  ],
  use: {
    actionTimeout: 0,
    trace: "retain-on-failure",
    headless: false
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  outputDir: "report/playwright-trace/",
};

const ciConfig: PlaywrightTestConfig = {
  testDir: "./e2e",
  timeout: 20 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 1,
  reporter: [
    ["json", { outputFile: "report/playwright-test-results.json" }],
  ],
  use: {
    actionTimeout: 0,
    trace: "retain-on-failure",
    headless: true
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],

  outputDir: "report/playwright-trace/",
};

const config: PlaywrightTestConfig = !!process.env.CI ? ciConfig : devConfig;
export default config;
