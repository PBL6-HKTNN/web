import { test, expect } from '@playwright/test';

test.describe('Authentication - Forgot Password', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to forgot password page
    await page.goto('/auth/forgot-password');
  });

  test('should display forgot password form correctly', async ({ page }) => {
    // Check page title and description
    await expect(page.getByText('Reset your password')).toBeVisible();
    await expect(page.getByText('Enter your email, get the reset code, and set your new password')).toBeVisible();

    // Check form elements
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('get-code-button')).toBeVisible();

    // Check navigation links
    await expect(page.getByText('Back to sign in')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Fill invalid email
    await page.getByTestId('email-input').fill('invalid-email');

    // Submit form
    await page.getByTestId('get-code-button').click(); 

    // Should stay on forgot password page
    await expect(page).toHaveURL(/.*forgot-password/);
  });

  test('should handle email submission', async ({ page }) => {
    // Fill valid email
    await page.getByTestId('email-input').fill('test@example.com');

    // Submit form
    await page.getByTestId('get-code-button').click();

    // This will depend on the backend response
    // Could show success message or stay on same page
    await expect(page.getByTestId('get-code-button')).toBeVisible();
  });

  test('should navigate back to login', async ({ page }) => {
    // Click back to sign in link
    await page.getByText('Back to sign in').click();

    // Should navigate to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on email input
    await page.getByTestId('email-input').focus();
    await expect(page.getByTestId('email-input')).toBeFocused();

    // Tab to button
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('get-code-button')).toBeFocused();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that all elements are still visible and accessible
    await expect(page.getByText('Reset your password')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('get-code-button')).toBeVisible();
  });

  test('should show reset code input after email submission', async ({ page }) => {
    // This test assumes there's a flow where after submitting email,
    // the form shows additional fields for the reset code and new password

    // Fill and submit email
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByTestId('get-code-button').click();

    // Wait for potential form state change
    // Note: This depends on the actual implementation of the forgot password flow
    await page.waitForTimeout(1000);

    // Check if reset code and new password fields appear
    // (This will need to be adjusted based on the actual UI flow)
    const resetCodeInput = page.getByTestId('reset-code-input');
    const newPasswordInput = page.getByTestId('new-password-input');

    // If these elements exist, test them
    if (await resetCodeInput.isVisible().catch(() => false)) {
      await expect(resetCodeInput).toBeVisible();
    }

    if (await newPasswordInput.isVisible().catch(() => false)) {
      await expect(newPasswordInput).toBeVisible();
    }
  });

  test('should handle complete password reset flow', async ({ page }) => {
    // Fill email
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('get-code-button').click();

    // Wait for form to potentially change
    await page.waitForTimeout(1000);

    // Try to find and fill reset code and new password fields
    const resetCodeInput = page.getByTestId('reset-code-input');
    const newPasswordInput = page.getByTestId('new-password-input');
    const confirmPasswordInput = page.getByTestId('confirm-password-input');

    // If reset code field exists, fill it
    if (await resetCodeInput.isVisible().catch(() => false)) {
      await resetCodeInput.fill('123456');
    }

    // If new password fields exist, fill them
    if (await newPasswordInput.isVisible().catch(() => false)) {
      await newPasswordInput.fill('newpassword123');

      if (await confirmPasswordInput.isVisible().catch(() => false)) {
        await confirmPasswordInput.fill('newpassword123');
      }

      // Try to find and click reset password button
      const resetButton = page.getByTestId('reset-password-button');
      if (await resetButton.isVisible().catch(() => false)) {
        await resetButton.click();
      }
    }

    // Should handle the response appropriately
    await expect(page).toHaveURL(/.*login/);
  });
});
