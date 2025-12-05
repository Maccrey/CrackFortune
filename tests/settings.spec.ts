import { test, expect } from '@playwright/test';

test('settings page updates user profile', async ({ page }) => {
    await page.goto('/settings');

    // Fill in Name
    const nameInput = page.getByTestId('input-name');
    await nameInput.fill('John Doe');
    await expect(nameInput).toHaveValue('John Doe');

    // Fill in Birth Date
    const dateInput = page.getByTestId('input-birthdate');
    await dateInput.fill('1990-01-01');
    await expect(dateInput).toHaveValue('1990-01-01');

    // Fill in Birth Time
    const timeInput = page.getByTestId('input-birthtime');
    await timeInput.fill('14:30');
    await expect(timeInput).toHaveValue('14:30');

    // Handle Alert dialog
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Settings Saved!');
        await dialog.accept();
    });

    // Click Save
    await page.getByTestId('btn-save').click();
});
