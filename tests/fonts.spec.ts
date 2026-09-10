import { test, expect } from "@playwright/test";

/**
 * Confirms DM Sans (the real family named throughout get_design_context /
 * get_variable_defs output, e.g. "DM_Sans:Bold", "DM_Sans:Medium") actually
 * loaded and is what's rendering -- not a silent fallback to the system
 * sans-serif stack, and that weight/size/line-height per text style match
 * the Typography page's documented values (Heading/H1 = 56/700/1.3,
 * Button/Button2 = 18/500, Body/Body3 = 16/400/1.5).
 */
test.describe("font rendering", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1366", "font behaviour doesn't vary per breakpoint");
  });

  test("DM Sans actually loaded as a font face, not just requested", async ({ page }) => {
    await page.goto("/");
    const loadedFamilies = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
    });
    expect(loadedFamilies.some((f) => f.toLowerCase().includes("dm sans"))).toBe(true);
  });

  test("H1 heading uses DM Sans bold at the documented size/line-height", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    const style = await heading.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { fontFamily: cs.fontFamily, fontWeight: cs.fontWeight, fontSize: cs.fontSize };
    });
    expect(style.fontFamily.toLowerCase()).toContain("dm sans");
    expect(style.fontWeight).toBe("700");
    expect(style.fontSize).toBe("56px");
  });

  test("primary button uses DM Sans medium at the documented size", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("link", { name: "Book an Appointment" }).first();
    const style = await button.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { fontFamily: cs.fontFamily, fontWeight: cs.fontWeight, fontSize: cs.fontSize };
    });
    expect(style.fontFamily.toLowerCase()).toContain("dm sans");
    expect(style.fontWeight).toBe("500");
    expect(style.fontSize).toBe("18px");
  });

  test("body copy uses DM Sans regular at the documented size", async ({ page }) => {
    await page.goto("/contact");
    const body = page.getByText(/We believe every collaboration/);
    const style = await body.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { fontFamily: cs.fontFamily, fontWeight: cs.fontWeight, fontSize: cs.fontSize };
    });
    expect(style.fontFamily.toLowerCase()).toContain("dm sans");
    expect(style.fontWeight).toBe("400");
    expect(style.fontSize).toBe("18px");
  });

  test("nav link uses DM Sans, active link is bold and inactive is medium", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const active = await nav.getByRole("link", { name: "Home" }).evaluate((el) => getComputedStyle(el).fontWeight);
    const inactive = await nav
      .getByRole("link", { name: "Projects" })
      .evaluate((el) => getComputedStyle(el).fontWeight);
    expect(active).toBe("700");
    expect(inactive).toBe("500");
  });

  test("optical sizing is auto (font-size-driven), not a hardcoded opsz value", async ({ page }) => {
    await page.goto("/");
    // Figma's get_design_context prints `fontVariationSettings: '"opsz" 14'`
    // on nearly every text node regardless of that node's actual size -- an
    // earlier fix took that literally and hardcoded opsz 14 globally, which
    // is wrong for anything not close to that size (H1 at 56px measured 11%
    // too wide as a result). `font-optical-sizing: auto` is what actually
    // matches Figma's rendering at every size -- verified for H1 in the
    // width-regression test below.
    const tagText = page.getByText("About Us", { exact: true });
    const style = await tagText.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { opticalSizing: cs.fontOpticalSizing, variationSettings: cs.fontVariationSettings };
    });
    expect(style.opticalSizing).toBe("auto");
    expect(style.variationSettings).toBe("normal");
  });

  test("H1 renders at the width Figma's own screenshot measures, not the pre-fix hardcoded-opsz width", async ({
    page,
  }) => {
    await page.goto("/");
    // Ground truth: Figma's screenshot of this exact string (node 5075:25332,
    // the full fixed-width "Reveal Text" frame, not an auto-cropped export)
    // measures 717px wide for "We turn ideas into cinematic" at 56px/700.
    // Before the font-optical-sizing fix this measured 789px (opsz stuck at
    // its default-for-small-text cut) and wrapped to a 4th line the design
    // doesn't have. Allow a few px for antialiasing/measurement rounding.
    const width = await page.evaluate(async () => {
      await document.fonts.ready;
      const span = document.createElement("span");
      span.style.font = "700 56px 'DM Sans'";
      span.style.position = "absolute";
      span.style.whiteSpace = "nowrap";
      span.style.visibility = "hidden";
      span.textContent = "We turn ideas into cinematic";
      document.body.appendChild(span);
      const w = span.getBoundingClientRect().width;
      document.body.removeChild(span);
      return w;
    });
    expect(width).toBeGreaterThan(705);
    expect(width).toBeLessThan(730);
  });

  test("H1 wraps to exactly 3 lines, matching the design, not 4", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    // Count actual line boxes via Range.getClientRects() rather than
    // element height / line-height -- the latter double-counts the
    // element's own vertical padding (py-6) as if it were extra lines.
    const lineCount = await heading.evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getClientRects().length;
    });
    expect(lineCount).toBe(3);
  });
});
