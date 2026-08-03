import { test, expect } from '@playwright/test';

test.describe('Ghost Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('input[name="identifier"]').fill('test@vizu.app');
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: /Enter Vizu/i }).click();
    await expect(page).toHaveURL(/\/home/, { timeout: 8000 });
  });

  test('toggling Ghost Mode shows toast notification and visual feedback', async ({ page }) => {
    // Find Ghost Mode toggle button
    const ghostToggle = page.getByRole('button', { name: /Ghost Mode/i }).first();
    await expect(ghostToggle).toBeVisible();

    // Click to activate Ghost Mode
    await ghostToggle.click();

    // Check Toast Notification
    await expect(page.getByText(/Ghost Mode Activated/i)).toBeVisible();

    // Check visual indicator (ON badge)
    const onBadge = page.getByText('ON', { exact: true }).first();
    await expect(onBadge).toBeVisible();
  });

  test('ghost mode state persists across page reloads and new tabs', async ({ page, context }) => {
    // Activate Ghost Mode
    const ghostToggle = page.getByRole('button', { name: /Ghost Mode/i }).first();
    await ghostToggle.click();
    await expect(page.getByText(/Ghost Mode Activated/i)).toBeVisible();

    // Verify localStorage value
    const ghostStorage = await page.evaluate(() => localStorage.getItem('vizu_ghost_mode'));
    expect(ghostStorage).toBe('true');

    // Reload the page
    await page.reload();
    await expect(page.getByText('ON', { exact: true }).first()).toBeVisible();

    // Open a new tab in the same browser context
    const newPage = await context.newPage();
    await newPage.goto('/home');
    await expect(newPage.getByText('ON', { exact: true }).first()).toBeVisible();
  });
});
