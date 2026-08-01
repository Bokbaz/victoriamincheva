import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const affiliateLinks = [
  "https://amzn.to/4wyKrlQ",
  "https://amzn.to/4wGTku0",
  "https://amzn.to/4g5tkT0",
  "https://amzn.to/4yTqoQO",
  "https://amzn.to/44Xj7lk",
  "https://amzn.to/3ROFkiv",
  "https://amzn.to/4fHjSUp",
  "https://amzn.to/3RNhjYZ",
  "https://amzn.to/4yRDLB3",
  "https://amzn.to/3RERydx",
  "https://amzn.to/3Ts73Gh",
  "https://amzn.to/4yJNfy6",
  "https://amzn.to/4hHLX0q",
  "https://amzn.to/4fMW2GO",
  "https://amzn.to/4fxat30",
  "https://amzn.to/3S7NGlm",
  "https://amzn.to/45AqmzO",
  "https://amzn.to/3U8xG35",
  "https://amzn.to/4xdgoAf",
];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(100);
});

test("renders the guide funnel and every supplied affiliate link", async ({ page }) => {
  await expect(
    page.getByRole("heading", { level: 1, name: "The full glam I actually wear." }),
  ).toBeVisible();
  await expect(page.locator("#guide").getByText("$4.99", { exact: true })).toBeVisible();
  await expect(page.locator("article.product-card")).toHaveCount(18);

  for (const href of affiliateLinks) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
  }

  await page.getByRole("button", { name: "Eyes" }).click();
  await expect(page.locator("article.product-card")).toHaveCount(5);
});

test("has no horizontal overflow", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
});

test("has no detectable accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
