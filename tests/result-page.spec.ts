import { test, expect } from '@playwright/test';

test('result page displays fortune and navigates back', async ({ page }) => {
    // Navigate directly to result page
    await page.goto('/result');

    // Check for Fortune Slip content
    await expect(page.locator('text=Today\'s Insight')).toBeVisible();
    await expect(page.locator('text=Great things are coming your way.')).toBeVisible();
    await expect(page.locator('text=High Precision')).toBeVisible();

    // Check Back Button
    const backButton = page.locator('text=Open Another Cookie');
    await expect(backButton).toBeVisible();

    // Click Back Button
    await backButton.click();
    await expect(page).toHaveURL('/');
});
