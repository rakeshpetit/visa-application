import { test, expect } from "@playwright/test";

test.describe("Multi-Step Form", () => {
  test("should complete the form and save as draft", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(
      /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/step1/
    );

    // Fill in the first step
    await page.fill('input[name="passportNumber"]', "AB1234567");
    await page.fill('input[name="dateOfBirth"]', "2012-10-01");
    await page.fill('input[name="nationality"]', "United Kingdom");

    // Navigate to the second step
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(
      /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/step2/
    );

    // Fill in the second step
    await page.fill('input[name="purposeOfVisit"]', "Vacation");
    await page.fill('input[name="arrivalDate"]', "2025-02-01");
    await page.fill('input[name="departureDate"]', "2025-02-15");

    // Navigate to the third step
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(
      /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/step3/
    );

    // Fill in the third step
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', "john.doe@example.com");
    await page.fill('input[name="countryOfBirth"]', "United States");
    await page.selectOption('select[name="gender"]', "Male");

    // Save as draft
    await page.click('button[type="submit"][value="draft"]');
    await expect(page.locator("div.bg-green-100")).toHaveText(
      "Draft saved successfully!"
    );
  });
  test("should complete the form and submit", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(
      /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/step1/
    );

    // Fill in the first step
    await page.fill('input[name="passportNumber"]', "AB1234567");
    await page.fill('input[name="dateOfBirth"]', "2012-10-01");
    await page.fill('input[name="nationality"]', "United Kingdom");

    // Navigate to the second step
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(
      /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/step2/
    );

    // Fill in the second step
    await page.fill('input[name="purposeOfVisit"]', "Vacation");
    await page.fill('input[name="arrivalDate"]', "2025-02-01");
    await page.fill('input[name="departureDate"]', "2025-02-15");

    // Navigate to the third step
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(
      /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/step3/
    );

    // Fill in the third step
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', "john.doe@example.com");
    await page.fill('input[name="countryOfBirth"]', "United States");
    await page.selectOption('select[name="gender"]', "Male");

    // Save as draft
    await page.click('button[type="submit"][value="submit"]');
    await expect(page).toHaveURL(
      /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/success/
    );
    await expect(page.locator("h1.text-2xl")).toHaveText(
      "Application Submitted Successfully!"
    );
    await expect(page.locator("p.mb-4")).toHaveText(
      "Thank you, John! Your application has been submitted successfully."
    );
  });
});
