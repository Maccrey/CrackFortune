import { test, expect } from '@playwright/test';

test.describe('Profile Creation Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Clear storage to ensure new user state
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await page.reload();

        // Pass the gate
        const overlay = page.locator('.fixed.inset-0.z-\\[100\\]');
        await expect(overlay).toBeVisible();
        const doorHandle = page.locator('.w-1\\/2.justify-end').locator('.cursor-pointer');
        await doorHandle.click({ force: true });
        await expect(overlay).not.toBeVisible({ timeout: 5000 });
    });

    test('쿠키 클릭 시 프로필 미입력 유저는 프로필 모달이 뜹니다', async ({ page }) => {
        // Find and click the cookie
        const cookie = page.getByTestId('fortune-cookie');
        await expect(cookie).toBeVisible();
        await cookie.click();

        // Check for Profile Modal Title (Korean default or English depending on env, but we can check key elements)
        // Adjust locator based on translations we added.
        // We added "Complete Your Profile" and "프로필 완성하기". 
        // Let's assume default is English or Korean. We can check for the input fields presence.
        
        const nameInput = page.getByPlaceholder('Name').or(page.getByPlaceholder('이름'));
        await expect(nameInput).toBeVisible();

        // Fill out profile
        await nameInput.fill('Test User');
        
        // Fill birth date
        // Note: Date input handling in Playwright can sometimes be tricky with specific formats, 
        // but .fill('YYYY-MM-DD') usually works for type="date".
        const dateInput = page.locator('input[type="date"]');
        await dateInput.fill('1990-01-01');

        // Click Save/Complete button
        const saveButton = page.getByRole('button', { name: 'Complete & View Fortune' }).or(page.getByRole('button', { name: '저장하고 운세 보기' }));
        await expect(saveButton).toBeEnabled();
        await saveButton.click();

        // Verify Modal closes
        await expect(nameInput).not.toBeVisible();

        // Verify navigation to Result Page happens (cookie cracks)
        // The URL should eventually change to /result
        await expect(page).toHaveURL(/\/result/, { timeout: 10000 });
        
        // Verify result content
        await expect(page.getByTestId('btn-open-another')).toBeVisible();
    });
});
