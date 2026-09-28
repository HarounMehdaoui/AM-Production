import { test, expect } from "@playwright/test";

/**
 * Regression coverage for two QA reports:
 *
 * (C) Client logo <Image> usage previously set width/height props but
 * overrode only one via CSS (w-auto), triggering next/image's "width or
 * height modified, but not the other" console warning for every logo whose
 * real aspect ratio wasn't exactly 3:1. Fixed in HeroAbout.tsx by switching
 * to fill + a sized wrapper, which carries no width/height attribute for
 * the browser to compare against in the first place.
 *
 * (D) A reported TypeError from Next's RSC performance instrumentation
 * ("cannot have a negative time stamp") on every 404 to /projects/[slug].
 * Not reproduced here across repeated attempts in either dev or a
 * production build (see the session notes) -- this test locks in the one
 * concretely testable acceptance criterion from that report: a production
 * build produces zero console errors on a nonexistent project slug. If this
 * ever starts failing, that's a real regression to chase; it passing does
 * not retroactively prove the original report's dev-mode symptom doesn't
 * exist under conditions this suite doesn't reproduce.
 */

test("home produces no next/image aspect-ratio console warnings", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1366", "console output doesn't vary per breakpoint");

  const warnings: string[] = [];
  page.on("console", (msg) => {
    if (/aspect ratio/i.test(msg.text())) warnings.push(msg.text());
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(warnings).toEqual([]);
});

test("a nonexistent project slug produces zero console errors (production build)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1366", "console output doesn't vary per breakpoint");

  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // The 404 navigation's own failed resource load is expected noise, not
    // a bug -- every other console error is a real regression to catch.
    if (/404 \(Not Found\)/.test(msg.text())) return;
    errors.push(msg.text());
  });

  await page.goto("/projects/this-project-does-not-exist");
  await page.waitForLoadState("networkidle");

  expect(errors).toEqual([]);
});
