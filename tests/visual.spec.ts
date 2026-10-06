import { test, expect } from "@playwright/test";
import { BREAKPOINTS, skipUnlessBreakpointExists, settle, freezeMarquees } from "./helpers";

const PAGES: { path: string; name: string }[] = [
  { path: "/", name: "home" },
  { path: "/contact", name: "contact" },
  { path: "/projects", name: "projects" },
  { path: "/studios", name: "studios" },
  { path: "/about", name: "about" },
];

for (const { path, name } of PAGES) {
  test.describe(`visual: ${name}`, () => {
    test(`${name} matches baseline at this breakpoint`, async ({ page }, testInfo) => {
      const width = testInfo.project.use.viewport?.width ?? 0;
      test.skip(
        skipUnlessBreakpointExists(path, width),
        `${path} has no Figma frame at ${width}px (frames: ${BREAKPOINTS[path]?.join(", ")})`
      );

      await page.goto(path);
      await settle(page);
      await freezeMarquees(page);

      await expect(page).toHaveScreenshot(`${name}-${width}.png`, {
        fullPage: true,
        // Home is ~5000px tall at desktop width -- the default 5s assertion
        // timeout can be too tight for two full-page stability-check
        // screenshots on the largest page/breakpoint combination.
        timeout: 20_000,
      });
    });
  });
}

// Nav drawer is Figma-designed only as a mobile/tablet ("NavigationDrawer",
// 393px-wide component) artifact -- verify it visually on the mobile project.
test.describe("visual: nav drawer", () => {
  test("mobile nav drawer open state", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-375", "drawer is a mobile/tablet-only pattern");
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    await expect(page).toHaveScreenshot("nav-drawer-375.png");
  });
});
