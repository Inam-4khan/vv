import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Log in to ensure protected routes are accessible
    await page.goto('/auth/login');
    await page.locator('input[name="identifier"]').fill('test@vizu.app');
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: /Enter Vizu/i }).click();
    await expect(page).toHaveURL(/\/home/, { timeout: 8000 });
  });

  test('navigates between Flow, Vista, and Hush using tabs', async ({ page }) => {
    // From /home, click Vista tab
    const vistaTab = page.getByRole('button', { name: /Navigate to Vista|Vista/i }).first();
    await vistaTab.click();
    await expect(page).toHaveURL(/\/vista/);

    // Click Hush tab
    const hushTab = page.getByRole('button', { name: /Navigate to Hush|Hush/i }).first();
    await hushTab.click();
    await expect(page).toHaveURL(/\/hush/);
  });

  test('browser back button navigates to previous screen', async ({ page }) => {
    // Currently on /home
    await expect(page).toHaveURL(/\/home/);

    // Go to /vista
    const vistaTab = page.getByRole('button', { name: /Navigate to Vista|Vista/i }).first();
    await vistaTab.click();
    await expect(page).toHaveURL(/\/vista/);

    // Go to /hush
    const hushTab = page.getByRole('button', { name: /Navigate to Hush|Hush/i }).first();
    await hushTab.click();
    await expect(page).toHaveURL(/\/hush/);

    // Browser back -> should return to /vista
    await page.goBack();
    await expect(page).toHaveURL(/\/vista/);

    // Browser back -> should return to /home
    await page.goBack();
    await expect(page).toHaveURL(/\/home/);
  });
});
