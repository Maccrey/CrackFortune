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
        // The intro overlay should be visible
        // We need to target the handle. 
        // Since there are two handles, and they are both similar, we might need to be specific.
        // The left handle is in the first motion.div child of the overlay container's door section.
        // Or we can query by the unique visual elements or order.
        
        // Left Handle
        // It's the first one that appears in the DOM usually if left is rendered first.
        // Let's use a locator that distinguishes them if possible, or just nth(0).
        
        // Wait for overlay to be present
        const overlay = page.locator('.fixed.inset-0.z-\\[100\\]');
        await expect(overlay).toBeVisible();

        // There are two handles. We can distinguish by their container alignment?
        // Left handle container has `right-0` (in left door).
        // Right handle container has `left-0` (in right door).
        
        // Let's try to click the left one (first one in DOM order usually if left door is first)
        const handles = page.locator('.cursor-pointer'); 
        // Note: Right handle just got cursor-pointer added.
        
        // We can be more specific:
        const leftDoorHandle = page.locator('.w-1\\/2.justify-end').locator('.cursor-pointer');
        
        await expect(leftDoorHandle).toBeVisible();
        await leftDoorHandle.click();

        // Expect overlay to disappear (opacity 0 or removed from DOM)
        await expect(overlay).not.toBeVisible({ timeout: 5000 });
    });

    test('오른쪽 문고리를 클릭하면 대문이 열립니다', async ({ page }) => {
        const overlay = page.locator('.fixed.inset-0.z-\\[100\\]');
        await expect(overlay).toBeVisible();
        
        // Right door handle
        // Right door has `justify-start` class
        const rightDoorHandle = page.locator('.w-1\\/2.justify-start').locator('.cursor-pointer');
        
        await expect(rightDoorHandle).toBeVisible();
        await rightDoorHandle.click();

        await expect(overlay).not.toBeVisible({ timeout: 5000 });
    });
});
