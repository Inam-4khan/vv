import { test, expect } from '@playwright/test';

test.describe('Welcome Page', () => {
  test('should display welcome page with CTA button', async ({ page }) => {
    await page.goto('/');

    // Verify Brand Logo / Heading
    await expect(page.getByRole('heading', { name: /VIZU/i })).toBeVisible();

    // Check for CTA button
    const ctaButton = page.getByRole('button', { name: /Get Started/i });
    await expect(ctaButton).toBeVisible();
  });

  test('clicking CTA button navigates to login page', async ({ page }) => {
    await page.goto('/');

    const ctaButton = page.getByRole('button', { name: /Get Started/i });
    await ctaButton.click();

    // Should navigate to /auth/login
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();
  });
});
