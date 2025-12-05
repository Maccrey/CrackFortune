import { test, expect } from '@playwright/test';

test('쿠키를 깨면 운세 결과 페이지로 이동한다', async ({ page }) => {
    await page.goto('/');

    const cookie = page.getByTestId('fortune-cookie');
    await expect(cookie).toBeVisible();

    await cookie.click();

    await expect(page).toHaveURL(/.*result/, { timeout: 5000 });
    await expect(page.getByTestId('fortune-slip')).toBeVisible();
});
