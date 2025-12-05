import { test, expect } from '@playwright/test';

test('네비게이션 링크로 페이지를 이동한다', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/FortuneCrack/);
    await expect(page.getByTestId('heading-main')).toBeVisible();

    await page.getByTestId('nav-history').click();
    await expect(page).toHaveURL(/.*history/);

    await page.getByTestId('nav-settings').click();
    await expect(page).toHaveURL(/.*settings/);

    await page.getByTestId('nav-today').click();
    await expect(page).toHaveURL('/');
});
