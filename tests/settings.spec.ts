import { test, expect } from '@playwright/test';

test('설정 페이지에서 프로필을 저장한다', async ({ page }) => {
    await page.goto('/settings');

    const nameInput = page.getByTestId('input-name');
    await nameInput.fill('John Doe');
    await expect(nameInput).toHaveValue('John Doe');

    const dateInput = page.getByTestId('input-birthdate');
    await dateInput.fill('1990-01-01');
    await expect(dateInput).toHaveValue('1990-01-01');

    const timeInput = page.getByTestId('input-birthtime');
    await timeInput.fill('14:30');
    await expect(timeInput).toHaveValue('14:30');

    await page.getByTestId('btn-save').click();
    await expect(page.getByTestId('toast-message')).toBeVisible();
});
