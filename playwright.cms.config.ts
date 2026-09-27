import { defineConfig, devices } from "@playwright/test";

/**
 * Separate from playwright.config.ts on purpose: the default suite must stay
 * hermetic (site in static-fallback mode, so its visual/font/a11y baselines
 * never depend on CMS state). This config runs only tests/cms-integration.spec.ts,
 * against a site instance built and started with CMS_API_URL explicitly set --
 * requires a live CMS already running there. Run with `npm run test:e2e:cms`.
 */
const SITE_PORT = 4100;

export default defineConfig({
  testDir: "./tests",
  testMatch: "cms-integration.spec.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 5 * 60_000,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${SITE_PORT}`,
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `next build && next start -p ${SITE_PORT}`,
    url: `http://localhost:${SITE_PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      CMS_API_URL: process.env.CMS_API_URL ?? "",
    },
  },
});
