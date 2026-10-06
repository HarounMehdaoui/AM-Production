import { test, expect } from "@playwright/test";
import { settle } from "./helpers";

test.describe("interaction: desktop nav", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1366", "nav bar links are desktop-only; drawer covered separately");
  });

  test("every primary nav link routes directly to its own dedicated page", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const nav = page.getByRole("navigation", { name: "Primary" });

    await nav.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/projects");

    await nav.getByRole("link", { name: "Studios" }).click();
    await expect(page).toHaveURL("/studios");

    await nav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");

    await nav.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");

    await nav.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
  });

  test("the active nav link is highlighted on every dedicated page", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [path, label] of [
      ["/", "Home"],
      ["/projects", "Projects"],
      ["/studios", "Studios"],
      ["/about", "About"],
      ["/contact", "Contact"],
    ] as const) {
      await page.goto(path);
      await settle(page);
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
    }
  });

  test("nav CTA opens contact", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("banner").getByRole("link", { name: "Let's Talk" }).click();
    await expect(page).toHaveURL("/contact");
  });

  test("home CTAs deep-link to contact", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("link", { name: "Book an Appointment" }).first().click();
    await expect(page).toHaveURL("/contact");
  });

  test("projects teaser 'See All' navigates to /projects", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("link", { name: "See All" }).click();
    await expect(page).toHaveURL("/projects");
  });
});

test.describe("interaction: routing", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1366", "routing behaviour doesn't vary per breakpoint");
  });

  test("every route is reachable directly (hard navigation, not just client-side)", async ({ page }) => {
    for (const path of ["/", "/projects", "/studios", "/about", "/contact"]) {
      const res = await page.goto(path);
      expect(res?.status(), `${path} should respond 200`).toBe(200);
    }
  });

  test("refreshing a dedicated page does not 404", async ({ page }) => {
    for (const path of ["/studios", "/about", "/projects", "/contact"]) {
      await page.goto(path);
      const res = await page.reload();
      expect(res?.status(), `reloading ${path} should still respond 200`).toBe(200);
      await expect(page.getByRole("banner")).toBeVisible();
    }
  });

  test("browser back/forward works across the primary nav", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const nav = page.getByRole("navigation", { name: "Primary" });

    await nav.getByRole("link", { name: "Studios" }).click();
    await expect(page).toHaveURL("/studios");
    await nav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");

    await page.goBack();
    await expect(page).toHaveURL("/studios");
    await page.goBack();
    await expect(page).toHaveURL("/");

    await page.goForward();
    await expect(page).toHaveURL("/studios");
  });

  test("clicking Studios/About from another page navigates to the dedicated route", async ({ page }) => {
    await page.goto("/contact");
    await settle(page);
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Studios" }).click();
    await expect(page).toHaveURL("/studios");
  });
});

test.describe("interaction: mobile nav drawer", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-375", "drawer only rendered below the lg breakpoint");
  });

  test("opens, navigates, and closes", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    const openButton = page.getByRole("button", { name: "Open menu" });
    await openButton.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");
    await expect(dialog).toBeHidden();
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("interaction: project cards + modal", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1366", "single functional pass is enough; visual pass covers breakpoints");
  });

  test("clicking a card opens the modal with matching content", async ({ page }) => {
    await page.goto("/projects");
    await settle(page);

    const cards = page.getByTestId("project-card");
    const firstTitle = await cards.first().getByTestId("project-card-title").textContent();

    await cards.first().click();
    const modal = page.getByTestId("project-modal");
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("heading")).toHaveText(firstTitle ?? "");
  });

  test("next/previous cycle through projects", async ({ page }) => {
    await page.goto("/projects");
    await settle(page);

    await page.getByTestId("project-card").first().click();
    const modal = page.getByTestId("project-modal");
    const firstHeading = await modal.getByRole("heading").textContent();

    await modal.getByRole("button", { name: "Next project" }).click();
    const secondHeading = await modal.getByRole("heading").textContent();
    expect(secondHeading).not.toEqual(firstHeading);

    await modal.getByRole("button", { name: "Previous project" }).click();
    await expect(modal.getByRole("heading")).toHaveText(firstHeading ?? "");
  });

  test("close button and Escape both dismiss the modal", async ({ page }) => {
    await page.goto("/projects");
    await settle(page);

    await page.getByTestId("project-card").first().click();
    const modal = page.getByTestId("project-modal");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Close project" }).click();
    await expect(modal).toBeHidden();

    await page.getByTestId("project-card").first().click();
    await expect(modal).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
  });

  test("modal 'Get in Touch' links to contact", async ({ page }) => {
    await page.goto("/projects");
    await settle(page);
    await page.getByTestId("project-card").first().click();
    await expect(page.getByTestId("project-modal").getByRole("link", { name: "Get in Touch" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });
});

test.describe("interaction: contact form", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1366", "single functional pass is enough");
  });

  test("submitting with all required fields redirects to WhatsApp with the message prefilled", async ({ page }) => {
    await page.goto("/contact");
    await settle(page);

    // The real submit action navigates the tab to wa.me -- intercept that
    // navigation so the test stays deterministic/offline instead of hitting
    // WhatsApp's live servers, then assert against the constructed URL.
    await page.route("https://wa.me/**", (route) =>
      route.fulfill({ status: 200, contentType: "text/plain", body: "ok" })
    );

    await page.getByLabel("First name*").fill("Jane");
    await page.getByLabel("Last Name*").fill("Doe");
    await page.getByLabel("How can we reach you?*").fill("jane@example.com");
    await page.getByLabel("Message*").fill("We'd like to book a shoot.");

    await Promise.all([
      page.waitForURL("https://wa.me/**"),
      page.getByRole("button", { name: "Submit Now" }).click(),
    ]);

    const url = new URL(page.url());
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toMatch(/^\/\d+$/);
    const text = decodeURIComponent(url.searchParams.get("text") ?? "");
    expect(text).toContain("New inquiry from Jane Doe");
    expect(text).toContain("Email: jane@example.com");
    expect(text).toContain("We'd like to book a shoot.");
  });

  test("required fields block submission when empty", async ({ page }) => {
    await page.goto("/contact");
    await settle(page);
    await page.getByRole("button", { name: "Submit Now" }).click();
    // Native HTML5 validation should block the submit handler entirely.
    await expect(page.getByRole("status")).toHaveCount(0);
    const firstNameValid = await page.getByLabel("First name*").evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(firstNameValid).toBe(false);
  });
});

test.describe("interaction: footer", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1366", "single functional pass is enough");
  });

  test("social links point out to real destinations in a new tab", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const links = page.locator("footer a[aria-label]");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute("href", /^https?:\/\//);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noreferrer/);
    }
  });

  test("footer nav links match primary nav hrefs", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.locator("footer").getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");

    await page.goto("/");
    await settle(page);
    await page.locator("footer").getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/projects");
  });
});
