import { defineConfig, devices } from "@playwright/test";

/**
 * Breakpoint projects match the actual Figma frame widths found in the file
 * (MAE6trb9cxb8nKwpoBAhVy), not arbitrary device presets:
 *  - Home:            Desktop-LG 1366 / Tablet-SM 800  / Mobile-XS 375
 *  - Contact/Projects: Desktop-LG 1366 / Tablet-MD 1024 / Tablet-SM 768 / Mobile-XS 375
 * Each spec skips itself on projects whose width has no corresponding frame
 * for that page (see tests/visual.spec.ts BREAKPOINTS map).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    toHaveScreenshot: {
      // Tight by design: this is meant to catch real drift, not rubber-stamp it.
      maxDiffPixelRatio: 0.01,
      threshold: 0.1,
      animations: "disabled",
    },
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: "desktop-1366", use: { viewport: { width: 1366, height: 900 } } },
    { name: "tablet-1024", use: { viewport: { width: 1024, height: 900 } } },
    { name: "tablet-800", use: { viewport: { width: 800, height: 900 } } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 900 } } },
    { name: "mobile-375", use: { viewport: { width: 375, height: 812 } } },
  ],
});
