import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { settle } from "./helpers";

// /about and /studios redirect to Home anchors (no Figma frame of their own)
// -- scanning "/" already covers that content, so they're excluded here to
// avoid a redundant duplicate scan of the same rendered page.
const ROUTES = ["/", "/contact", "/projects"];

for (const route of ROUTES) {
  test(`a11y: ${route} has no axe violations`, async ({ page }, testInfo) => {
    // Run once per route (desktop project) -- a11y tree doesn't change per breakpoint here.
    test.skip(testInfo.project.name !== "desktop-1366", "a11y scanned once, not per breakpoint");

    await page.goto(route);
    await settle(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => n.target.join(" ")),
    }));

    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}

test("a11y: mobile nav drawer has no axe violations while open", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375", "drawer only rendered on mobile viewport");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await settle(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  // Same class of flake as the project-modal scan below: wait for the
  // 0.45s slide-in to actually finish before scanning, rather than
  // catching it mid-transition under parallel-worker load.
  await expect.poll(async () => dialog.evaluate((el) => getComputedStyle(el).transform)).toBe("none");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("a11y: project modal has no axe violations while open", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1366", "scanned once, not per breakpoint");
  await page.goto("/projects");
  await settle(page);
  await page.getByTestId("project-card").first().click();
  const modal = page.getByTestId("project-modal");
  await expect(modal).toBeVisible();
  // `toBeVisible()` only checks display -- the modal fades/scales in over
  // 0.3s (ProjectModal.tsx), and scanning mid-transition gave axe a
  // false-positive color-contrast violation (background and text both
  // sampled as near-black at ~10% into the opacity tween, not their real
  // settled colors). Wait for the entrance animation to actually finish.
  await expect.poll(async () => modal.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
