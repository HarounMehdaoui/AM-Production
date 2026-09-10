import { test, expect } from "@playwright/test";
import { settle } from "./helpers";

test.describe("interaction: desktop nav", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1366", "nav bar links are desktop-only; drawer covered separately");
  });

  test("primary nav: Contact/Home navigate to their routes, Projects smooth-scrolls in place", async ({ page }) => {
    // Nav "Projects" intentionally scroll-links to the Home page's projects
    // section (id="projects") rather than routing to /projects -- the
    // separate "See All" button (tested below) is what routes to the
    // dedicated /projects page. Two different, deliberately non-matching
    // behaviours -- see the nav scroll-to-section describe block for the
    // Projects-specific assertions.
    await page.goto("/");
    await settle(page);

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
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

test.describe("interaction: nav scroll-to-section", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1366", "scroll targets don't vary per breakpoint");
  });

  test("Studios and About smooth-scroll to their Home sections, not separate routes", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const nav = page.getByRole("navigation", { name: "Primary" });

    await nav.getByRole("link", { name: "Studios" }).click();
    await expect(page).toHaveURL("/#studios");
    await expect(page.locator("#studios")).toBeInViewport();

    await nav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/#about");
    await expect(page.locator("#about")).toBeInViewport();
  });

  test("nav 'Projects' smooth-scrolls to the Home section; 'See All' still routes to /projects", async ({
    page,
  }) => {
    // These are deliberately opposite behaviours on the same page -- verify
    // together so a fix to one can't silently regress the other.
    await page.goto("/");
    await settle(page);

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/#projects");
    await expect(page.locator("#projects")).toBeInViewport();

    await page.getByRole("link", { name: "See All" }).click();
    await expect(page).toHaveURL("/projects");
  });

  test("clicking Studios/About from another page navigates to Home and scrolls there", async ({ page }) => {
    await page.goto("/contact");
    await settle(page);
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Studios" }).click();
    await expect(page).toHaveURL("/#studios");
    await expect(page.locator("#studios")).toBeInViewport();
  });

  test("legacy /studios and /about URLs redirect to the anchors", async ({ page }) => {
    await page.goto("/studios");
    await expect(page).toHaveURL("/#studios");
    await page.goto("/about");
    await expect(page).toHaveURL("/#about");
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

  test("submitting with all required fields shows a success state", async ({ page }) => {
    await page.goto("/contact");
    await settle(page);

    await page.getByLabel("First name*").fill("Jane");
    await page.getByLabel("Last Name*").fill("Doe");
    await page.getByLabel("How can we reach you?*").fill("jane@example.com");
    await page.getByLabel("Message*").fill("We'd like to book a shoot.");
    await page.getByRole("button", { name: "Submit Now" }).click();

    await expect(page.getByRole("status")).toContainText("Message sent");
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

  test("footer nav links match primary nav hrefs (Contact routes, Projects scroll-links)", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.locator("footer").getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");

    await page.goto("/");
    await settle(page);
    await page.locator("footer").getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/#projects");
    await expect(page.locator("#projects")).toBeInViewport();
  });
});
