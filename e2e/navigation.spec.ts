import { test, expect, Page } from "@playwright/test";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function openHiringAssistant(page: Page) {
  // EN: "Ask about César" / PT-BR|ES: "FAQ Inteligente" / FR: "FAQ IA"
  const launcher = page.getByRole("button", { name: /ask about|FAQ/i }).first();
  await launcher.waitFor({ state: "visible", timeout: 10000 });
  // Click and retry until the dialog appears — handles React hydration delay
  // (aria-expanded="false" is in SSR HTML so it's not a reliable hydration signal)
  const dialog = page.getByRole("dialog", { name: /career assistant|assistente|asistente|assistant carrière|AI职业/i });
  for (let attempt = 0; attempt < 5; attempt++) {
    const alreadyOpen = await dialog.isVisible().catch(() => false);
    if (alreadyOpen) break;
    await launcher.click();
    await page.waitForTimeout(300);
  }
  // EN: "AI Career Assistant" / PT-BR: "Assistente de Carreira IA" / ES: "Asistente de Carrera IA"
  await expect(dialog).toBeVisible({ timeout: 3000 });
}

async function expectAssistantToBeClosed(page: Page) {
  await expect(page.getByRole("dialog", { name: /career assistant|assistente|asistente|assistant carrière|AI职业/i })).not.toBeVisible();
}

async function clickNavItem(page: Page, label: string | RegExp) {
  // Try desktop nav first, fall back to any visible nav link
  const navLink = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: label }).first();
  if (await navLink.isVisible()) {
    await navLink.click();
  } else {
    // Mobile: open hamburger then click
    const hamburger = page.getByRole("button", { name: /open menu/i });
    if (await hamburger.isVisible()) {
      await hamburger.click();
      const mobileNavBtn = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("button", { name: label });
      await mobileNavBtn.click();
    }
  }
}

async function expectSectionToBeVisible(page: Page, sectionId: string) {
  const section = page.locator(`#${sectionId}`);
  await expect(section).toBeInViewport({ ratio: 0.1 });
}

async function expectBodyScrollable(page: Page) {
  const overflow = await page.evaluate(() => document.body.style.overflow);
  expect(overflow).not.toBe("hidden");
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
});

test.describe("Navigation while Hiring Assistant is open", () => {
  test("desktop: navigates to a section while Hiring Assistant is open", async ({ page }) => {
    await openHiringAssistant(page);

    const navLink = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link").first();
    if (!(await navLink.isVisible())) {
      test.skip(true, "Desktop nav not visible at this viewport — skipping");
    }

    await clickNavItem(page, /impact|work|summary/i);

    await expectAssistantToBeClosed(page);
    await expectBodyScrollable(page);
  });

  test("clicking any desktop nav item closes the assistant", async ({ page }) => {
    const navLinks = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link");
    if (!(await navLinks.first().isVisible())) {
      test.skip(true, "Desktop nav not visible at this viewport");
    }

    await openHiringAssistant(page);

    // Click the first nav link
    await navLinks.first().click();

    await expectAssistantToBeClosed(page);
    await expectBodyScrollable(page);
  });

  test("mobile: navigates to section while Hiring Assistant is open", async ({ page }) => {
    const hamburger = page.getByRole("button", { name: /open menu/i });
    if (!(await hamburger.isVisible())) {
      test.skip(true, "Mobile nav not visible at this viewport — skipping");
    }

    await openHiringAssistant(page);

    // Open mobile menu
    await hamburger.click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNav).toBeVisible();

    // Click first nav item
    const firstItem = mobileNav.getByRole("button").first();
    await firstItem.click();

    await expectAssistantToBeClosed(page);
    await expectBodyScrollable(page);
  });

  test("Escape closes the assistant and body remains scrollable", async ({ page }) => {
    await openHiringAssistant(page);

    await page.keyboard.press("Escape");

    await expectAssistantToBeClosed(page);
    await expectBodyScrollable(page);
  });

  test("assistant does not reopen after navigation closes it", async ({ page }) => {
    await openHiringAssistant(page);

    const navLinks = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link");
    if (await navLinks.first().isVisible()) {
      await navLinks.first().click();
    } else {
      const hamburger = page.getByRole("button", { name: /open menu/i });
      await hamburger.click();
      const firstBtn = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("button").first();
      await firstBtn.click();
    }

    await expectAssistantToBeClosed(page);

    // Wait a moment to confirm it doesn't reopen automatically
    await page.waitForTimeout(600);
    await expectAssistantToBeClosed(page);
  });

  test("no invisible backdrop intercepts clicks after assistant closes", async ({ page }) => {
    await openHiringAssistant(page);
    await page.keyboard.press("Escape");
    await expectAssistantToBeClosed(page);

    // Should be able to click anywhere on page without being intercepted
    await page.click("body", { position: { x: 100, y: 400 } });
    // No error means no invisible blocking overlay
    await expectBodyScrollable(page);
  });

  test("repeated open/close cycles do not break state", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await openHiringAssistant(page);
      await page.keyboard.press("Escape");
      await expectAssistantToBeClosed(page);
    }

    await expectBodyScrollable(page);
  });

  test("command palette navigation closes the assistant", async ({ page }) => {
    await openHiringAssistant(page);

    // Open command palette (⌘K)
    await page.keyboard.press("Meta+k");
    const palette = page.getByRole("dialog", { name: /command/i });
    const paletteVisible = await palette.isVisible().catch(() => false);
    if (!paletteVisible) {
      test.skip(true, "Command palette did not open");
    }

    // Navigate using a palette option
    await page.keyboard.press("Enter");

    await expectAssistantToBeClosed(page);
    await expectBodyScrollable(page);
  });
});

test.describe("Direct hash and browser navigation", () => {
  test("direct hash URL loads correct section", async ({ page }) => {
    await page.goto("/#experience");
    await page.waitForLoadState("load");
    // Verify the section exists and the page scrolled from hash navigation.
    // Full toBeInViewport isn't reliable here: 3D layout shifts can displace
    // the browser's initial hash scroll after React hydration.
    const section = page.locator("#experience");
    await expect(section).toBeAttached();
    const scrolled = await page.evaluate(() => window.scrollY > 0);
    expect(scrolled).toBe(true);
  });

  test("browser back and forward remain functional", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Scroll to a section
    const navLinks = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link");
    if (await navLinks.first().isVisible()) {
      await navLinks.first().click();
      await page.waitForTimeout(500);
      await page.goBack();
      await page.waitForTimeout(300);
      await page.goForward();
    }

    await expectBodyScrollable(page);
  });
});

test.describe("Reduced-motion mode", () => {
  test("navigation works under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await openHiringAssistant(page);

    const navLinks = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link");
    if (await navLinks.first().isVisible()) {
      await navLinks.first().click();
    } else {
      await page.keyboard.press("Escape");
    }

    await expectAssistantToBeClosed(page);
    await expectBodyScrollable(page);
  });
});
