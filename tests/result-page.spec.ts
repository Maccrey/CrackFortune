import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        window.sessionStorage.setItem('visited', 'true');
    });
});

test('결과 페이지에서 운세를 확인하고 홈으로 돌아간다', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('fortune-cookie').click();

    await expect(page).toHaveURL(/.*result/, { timeout: 5000 });
    await expect(page.getByTestId('fortune-slip')).toBeVisible();

    await page.getByTestId('btn-open-another').click();
    await expect(page).toHaveURL('/');
});
