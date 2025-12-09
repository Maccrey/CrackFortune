import { test, expect } from '@playwright/test';

test.describe('Gate Interaction', () => {
    test.beforeEach(async ({ page }) => {
        // Clear session storage to ensure intro overlay is shown (if logic uses session storage)
        // Based on previous code file view, it seems session storage 'visited' might skip it.
        // However, looking at IntroOverlay usage in MainPage might clarify.
        // Let's assume for now we need to clear or set nothing to see it.
        // Wait, failing that, we might need to check if IntroOverlay is conditioned on something.
        // MainPage didn't seem to condition it, but let's re-read MainPage quickly if this test fails.
        // actually, let's just go to root.
        await page.goto('/');
        
        // If the IntroOverlay is always there initially, good. 
        // If it persists state, we might need to clear it.
        await page.evaluate(() => sessionStorage.clear());
        await page.reload();
    });

    test('왼쪽 문고리를 클릭하면 대문이 열립니다', async ({ page }) => {
        const overlay = page.locator('.fixed.inset-0.z-\\[100\\]');
        await expect(overlay).toBeVisible();

        // Verify "福" character is visible on the left door
        const leftFortuneChar = page.locator('.w-1\\/2.justify-end').getByText('福');
        await expect(leftFortuneChar).toBeVisible();

        const leftDoorHandle = page.locator('.w-1\\/2.justify-end').locator('.cursor-pointer');
        await expect(leftDoorHandle).toBeVisible();
        await leftDoorHandle.click();

        await expect(overlay).not.toBeVisible({ timeout: 5000 });
    });

    test('오른쪽 문고리를 클릭하면 대문이 열립니다', async ({ page }) => {
        const overlay = page.locator('.fixed.inset-0.z-\\[100\\]');
        await expect(overlay).toBeVisible();

        // Verify "福" character is visible on the right door
        const rightFortuneChar = page.locator('.w-1\\/2.justify-start').getByText('福');
        await expect(rightFortuneChar).toBeVisible();
        
        const rightDoorHandle = page.locator('.w-1\\/2.justify-start').locator('.cursor-pointer');
        
        await expect(rightDoorHandle).toBeVisible();
        await rightDoorHandle.click();

        await expect(overlay).not.toBeVisible({ timeout: 5000 });
    });
});
