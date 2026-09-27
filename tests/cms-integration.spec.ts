import { test, expect, request as pwRequest, type APIRequestContext } from "@playwright/test";

/**
 * Regression coverage for a real bug report: "CMS edits (unpublish, delete,
 * a second hero-media update) never show up on the site, even minutes past
 * the 60s ISR window." Reproducing it against a genuinely fresh `next build
 * && next start` (see playwright.cms.config.ts) found the ISR/revalidate
 * code itself works correctly -- every case below resolved in well under
 * 60s. The far more likely real-world cause was a site process left running
 * from before CMS_API_URL was set/changed: Next.js only reads env vars at
 * process start, so a stale process silently keeps serving local static
 * content forever, which looks identical to "revalidation is broken." These
 * tests guard the actual revalidation behavior; they can't catch "someone
 * forgot to restart the server" -- see the startup log added in
 * src/lib/cms.ts for that.
 *
 * Requires a live CMS reachable at CMS_API_URL with working admin
 * credentials -- skips entirely otherwise, so the default `npm run
 * test:e2e` suite (which intentionally runs the site in static-fallback
 * mode) is unaffected. Run via `npm run test:e2e:cms`.
 */

const CMS_API_URL = process.env.CMS_API_URL;
const CMS_ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL;
const CMS_ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;

const POLL_INTERVAL_MS = 5_000;
const POLL_TIMEOUT_MS = 150_000; // comfortably past the 60s revalidate window

test.describe("CMS integration: ISR revalidation", () => {
  test.skip(
    !CMS_API_URL || !CMS_ADMIN_EMAIL || !CMS_ADMIN_PASSWORD,
    "Requires a live CMS: set CMS_API_URL, CMS_ADMIN_EMAIL, CMS_ADMIN_PASSWORD, and run the site itself with CMS_API_URL set (see playwright.cms.config.ts)."
  );

  let cms: APIRequestContext;

  test.beforeAll(async () => {
    cms = await pwRequest.newContext({ baseURL: CMS_API_URL });
    const res = await cms.post("/api/admin/login", {
      data: { email: CMS_ADMIN_EMAIL, password: CMS_ADMIN_PASSWORD },
    });
    if (!res.ok()) throw new Error(`CMS admin login failed: ${res.status()}`);
  });

  test.afterAll(async () => {
    await cms.dispose();
  });

  async function createTestProject(id: string) {
    const res = await cms.post("/api/admin/projects", {
      data: {
        id,
        title: `Playwright ISR regression — ${id}`,
        description: "Temporary project created by an automated test; safe to delete.",
        category: "Test",
        published: true,
        order: 999,
      },
    });
    if (!res.ok()) throw new Error(`Failed to create test project ${id}: ${res.status()}`);
  }

  async function pollUntil(label: string, check: () => Promise<boolean>) {
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (await check()) return;
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
    throw new Error(`Timed out waiting for: ${label}`);
  }

  test("unpublishing a project 404s its detail page within one revalidation cycle", async ({ page }) => {
    const id = `pw-unpublish-${Date.now()}`;
    await createTestProject(id);

    try {
      // Freshly created: not in generateStaticParams, AND the shared Data
      // Cache entry behind every getProjects() call (populated at build
      // time, keyed by the fetch URL, not by which page asked) won't include
      // it either until *that* entry's own revalidate window elapses --
      // same mechanism as the unpublish/delete case below, just triggered by
      // creation instead of mutation. So this needs the same full poll, not
      // a short one.
      await pollUntil(`${id} to become visible after creation`, async () => {
        const res = await page.goto(`/projects/${id}`);
        return res?.status() === 200;
      });

      const patchRes = await cms.patch(`/api/admin/projects/${id}`, { data: { published: false } });
      expect(patchRes.ok()).toBeTruthy();

      await pollUntil(`${id} to 404 after unpublish`, async () => {
        const res = await page.goto(`/projects/${id}`);
        return res?.status() === 404;
      });
    } finally {
      await cms.delete(`/api/admin/projects/${id}`);
    }
  });

  test("deleting a project 404s its detail page within one revalidation cycle", async ({ page }) => {
    const id = `pw-delete-${Date.now()}`;
    await createTestProject(id);

    await pollUntil(`${id} to become visible after creation`, async () => {
      const res = await page.goto(`/projects/${id}`);
      return res?.status() === 200;
    });

    const delRes = await cms.delete(`/api/admin/projects/${id}`);
    expect(delRes.ok()).toBeTruthy();

    await pollUntil(`${id} to 404 after delete`, async () => {
      const res = await page.goto(`/projects/${id}`);
      return res?.status() === 404;
    });
  });

  test("a second hero-media update is reflected within one revalidation cycle", async ({ page }) => {
    const getRes = await cms.get("/v1/hero-media");
    const original: string | null = getRes.ok() ? (await getRes.json()).videoUrl : null;

    const firstUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    const secondUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

    try {
      const put1 = await cms.put("/api/admin/hero-media", { data: { videoUrl: firstUrl } });
      expect(put1.ok()).toBeTruthy();
      await pollUntil("hero video to reflect first update", async () => {
        await page.goto("/");
        return (await page.locator("video").first().getAttribute("src")) === firstUrl;
      });

      const put2 = await cms.put("/api/admin/hero-media", { data: { videoUrl: secondUrl } });
      expect(put2.ok()).toBeTruthy();
      await pollUntil("hero video to reflect second update", async () => {
        await page.goto("/");
        return (await page.locator("video").first().getAttribute("src")) === secondUrl;
      });
    } finally {
      if (original) await cms.put("/api/admin/hero-media", { data: { videoUrl: original } });
    }
  });
});
