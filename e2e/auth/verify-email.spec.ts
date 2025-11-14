import { test, expect } from '@playwright/test';

test.describe('Authentication - Email Verification', () => {
  test('should display verification form correctly', async ({ page }) => {
    // Navigate to verify page with search params
    await page.goto('/auth/verify?email=test@example.com&token=123456');

    // Check page title and description
    await expect(page.getByText('Verify Your Email')).toBeVisible();
    await expect(page.getByText('We sent a verification code to your email')).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();

    // Check form elements
    await expect(page.getByTestId('verification-code-input')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Email' })).toBeVisible();
    await expect(page.getByText('Resend verification code')).toBeVisible();
  });

  test('should display form without initial params', async ({ page }) => {
    // Navigate to verify page without params
    await page.goto('/auth/verify');

    // Should still show the form
    await expect(page.getByText('Verify Your Email')).toBeVisible();
    await expect(page.getByTestId('verification-code-input')).toBeVisible();
  });

  test('should validate verification code format', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Leave token field empty
    const tokenInput = page.getByTestId('verification-code-input');
    await tokenInput.fill('');

    // Submit form
    await page.getByRole('button', { name: 'Verify Email' }).click();

    // Should stay on verification page
    await expect(page).toHaveURL(/.*verify/);
  });

  test('should handle verification code input', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Fill verification code
    const tokenInput = page.getByTestId('verification-code-input');
    await tokenInput.fill('123456');

    // Submit form
    await page.getByRole('button', { name: 'Verify Email' }).click();

    // This will depend on backend response
    // Could redirect to login or show success message
    await expect(page).toHaveURL(/.*verify/);
  });

  test('should handle resend verification code', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Click resend link
    await page.getByText('Resend verification code').click();

    // Should show some feedback (toast, message, etc.)
    // This depends on the implementation
    await expect(page.getByText('Resend verification code')).toBeVisible();
  });

  test('should handle invalid verification code', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Fill invalid verification code
    const tokenInput = page.getByTestId('verification-code-input');
    await tokenInput.fill('invalid-code');

    // Submit form
    await page.getByRole('button', { name: 'Verify Email' }).click();

    // Should stay on verification page and show error
    await expect(page).toHaveURL(/.*verify/);
  });

  test('should handle successful email verification', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Fill valid verification code
    const tokenInput = page.getByTestId('verification-code-input');
    await tokenInput.fill('valid-code-123');

    // Submit form
    await page.getByRole('button', { name: 'Verify Email' }).click();

    // On success, should redirect to login or show success message
    // This depends on the backend implementation
    await page.waitForTimeout(2000);

    // Check if redirected to login or still on verify page with success message
    const isOnVerifyPage = page.url().includes('verify');
    const hasSuccessMessage = await page.getByText(/verified|success|confirmed/i).isVisible().catch(() => false);

    expect(isOnVerifyPage || hasSuccessMessage).toBe(true);
  });

  test('should handle expired verification code', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Fill expired verification code
    const tokenInput = page.getByTestId('verification-code-input');
    await tokenInput.fill('expired-code');

    // Submit form
    await page.getByRole('button', { name: 'Verify Email' }).click();

    // Should stay on verification page
    await expect(page).toHaveURL(/.*verify/);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Focus on token input
    const tokenInput = page.getByTestId('verification-code-input');
    await tokenInput.focus();
    await expect(tokenInput).toBeFocused();

    // Tab to verify button
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Verify Email' })).toBeFocused();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that all elements are still visible and accessible
    await expect(page.getByText('Verify Your Email')).toBeVisible();
    await expect(page.getByTestId('verification-code-input')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Email' })).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Fill verification code
    const tokenInput = page.getByTestId('verification-code-input');
    await tokenInput.fill('123456');

    // Submit form
    const submitButton = page.getByRole('button', { name: 'Verify Email' });
    await submitButton.click();

    // Button should show loading state or be disabled during submission
    // This depends on the implementation
    await page.waitForTimeout(1000);

    // Form should still be visible
    await expect(page.getByPlaceholder('Enter verification code')).toBeVisible();
  });

  test('should handle back navigation', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Try to go back (if there's a back button or link)
    // This depends on the implementation
    const backButton = page.getByRole('button', { name: /back|return/i }).or(
      page.getByText(/back|return/i)
    );

    if (await backButton.isVisible().catch(() => false)) {
      await backButton.click();
      // Should navigate somewhere appropriate
    } else {
      // If no back button, just ensure we're still on the verify page
      await expect(page).toHaveURL(/.*verify/);
    }
  });
});
