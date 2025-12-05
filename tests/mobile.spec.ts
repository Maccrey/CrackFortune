import { test, expect } from '@playwright/test';

test('mobile viewport configuration', async ({ page }) => {
    await page.goto('/');

    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', /viewport-fit=cover/);
    await expect(viewportMeta).toHaveAttribute('content', /user-scalable=no/);

    // Check if body has overscroll-behavior-y: none (via computed style)
    const body = page.locator('body');
    await expect(body).toHaveCSS('overscroll-behavior-y', 'none');
});
