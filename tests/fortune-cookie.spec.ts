import { test, expect } from '@playwright/test';

test('fortune cookie interaction', async ({ page }) => {
    await page.goto('/');

    // Check if cookie exists (emoji or component structure)
    const cookie = page.getByTestId('fortune-cookie');
    await expect(cookie).toBeVisible();

    // Click the cookie
    await cookie.click();

    // Wait for animation and navigation (1.5s delay in component)
    // We expect to be on result page eventually
    await expect(page).toHaveURL(/.*result/, { timeout: 5000 });
});
