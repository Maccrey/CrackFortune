import { test, expect } from '@playwright/test';

test('has title and navigates to pages', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/FortuneCrack/);

    // Check Main Page content
    await expect(page.locator('h2')).toContainText("Today's Fortune");

    // Navigate to History
    await page.click('text=History');
    await expect(page).toHaveURL(/.*history/);
    await expect(page.locator('h2')).toContainText('History');

    // Navigate to Settings
    await page.click('text=Settings');
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.locator('h2')).toContainText('Settings');

    // Navigate back to Home
    await page.click('text=Today');
    await expect(page).toHaveURL('/');
});
