import type { Page } from "@playwright/test";

/**
 * Breakpoints covered per page. Home/Contact/Projects widths match real
 * Figma frames; Studios and About have no Figma frame of their own (built
 * from scratch, reusing the site's existing components/layout language), so
 * they use the same breakpoint set as Contact/Projects rather than a frame
 * reference.
 */
export const BREAKPOINTS: Record<string, number[]> = {
  "/": [1366, 800, 375],
  "/contact": [1366, 1024, 768, 375],
  "/projects": [1366, 1024, 768, 375],
  "/studios": [1366, 1024, 768, 375],
  "/about": [1366, 1024, 768, 375],
};

export function skipUnlessBreakpointExists(path: string, width: number) {
  return !BREAKPOINTS[path]?.includes(width);
}

/**
 * Scrolls the full page height so every `whileInView` reveal actually fires
 * its IntersectionObserver at least once, then returns to the top. Without
 * this, a screenshot taken immediately after navigation shows below-the-fold
 * sections mid "hidden" (opacity 0) state, which is a scroll-reveal artifact,
 * not a rendering bug.
 */
export async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = document.body.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 200));
  });
}

export async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await revealAll(page);
}

/**
 * Freezes the infinite CSS animations (client-logo ticker, testimonial
 * slider, circle ticker ring, FeaturedIntro's blinking dot) in place.
 * Playwright's `animations: "disabled"` screenshot option freezes most CSS
 * animations, but an `infinite` animation has no natural end state to settle
 * on, which made the built-in "wait for two identical consecutive frames"
 * screenshot-stability check flaky/slow on some breakpoints. Pausing them
 * explicitly makes visual-regression runs deterministic. Also pauses and
 * seeks the banner <video> to a fixed frame -- same non-determinism problem,
 * since autoplaying footage keeps advancing between runs/retries.
 */
export async function freezeMarquees(page: Page) {
  await page.addStyleTag({
    content:
      ".animate-marquee, .animate-marquee-slow, .animate-spin-slow, .animate-blink-dot { animation-play-state: paused !important; }",
  });
  await page.evaluate(() => {
    document.querySelectorAll("video").forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
  });
}
