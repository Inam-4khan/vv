import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('submitting empty login form displays validation errors', async ({ page }) => {
    await page.goto('/auth/login');

    const submitBtn = page.getByRole('button', { name: /Enter Vizu/i });
    await submitBtn.click();

    // Validation errors should be visible
    await expect(page.getByText(/Please enter your username or email|Username or Email is required/i)).toBeVisible();
    await expect(page.getByText(/Password is required/i)).toBeVisible();
  });

  test('valid login credentials redirect to /home', async ({ page }) => {
    await page.goto('/auth/login');

    await page.locator('input[name="identifier"]').fill('test@vizu.app');
    await page.locator('input[name="password"]').fill('password123');

    const submitBtn = page.getByRole('button', { name: /Enter Vizu/i });
    await submitBtn.click();

    // URL changes to /home
    await expect(page).toHaveURL(/\/home/, { timeout: 8000 });
  });

  test('logout from persona settings returns to home/welcome page', async ({ page }) => {
    // Perform login first
    await page.goto('/auth/login');
    await page.locator('input[name="identifier"]').fill('test@vizu.app');
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: /Enter Vizu/i }).click();
    await expect(page).toHaveURL(/\/home/, { timeout: 8000 });

    // Navigate to persona settings
    await page.goto('/persona/settings');

    // Click Logout button
    const logoutBtn = page.getByRole('button', { name: /Logout/i });
    await logoutBtn.click();

    // Should return to /
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
