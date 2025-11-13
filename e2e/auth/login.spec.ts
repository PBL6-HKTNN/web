import { test, expect } from '@playwright/test';

test.describe('Authentication - Login', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');
  });

  test('should display login form correctly', async ({ page }) => {
    // Check page title and description
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByText('Enter your email and password to access your account')).toBeVisible();

    // Check form elements
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('remember-me-checkbox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

    // Check links
    await expect(page.getByText('Forgot password?')).toBeVisible();
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    await expect(page.getByText('Sign up')).toBeVisible();
  });

  test('should show password visibility toggle', async ({ page }) => {
    const passwordInput = page.getByTestId('password-input');

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the eye icon (password toggle button)
    const toggleButton = page.locator('button').filter({ has: page.locator('[data-testid="loader2-icon"]') }).first();
    await toggleButton.click();

    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should validate email format', async ({ page }) => {
    // Fill invalid email
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('password-input').fill('password123');

    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should stay on login page (since validation should prevent submission or show error)
    await expect(page).toHaveURL(/.*login/);
  });

  test('should validate password length', async ({ page }) => {
    // Fill valid email but short password
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('12345'); // Less than 6 characters

    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.getByTestId('email-input').fill('nonexistent@example.com');
    await page.getByTestId('password-input').fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should stay on login page and show error (depending on backend response)
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to register page', async ({ page }) => {
    // Click sign up link
    await page.getByText('Sign up').click();

    // Should navigate to register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Click forgot password link
    await page.getByText('Forgot password?').click();

    // Should navigate to forgot password page
    await expect(page).toHaveURL(/.*forgot-password/);
  });

  test('should handle remember me checkbox', async ({ page }) => {
    const checkbox = page.getByTestId('remember-me-checkbox');

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Check it
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Uncheck it
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that all elements are still visible and accessible
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on email input
    await page.getByTestId('email-input').focus();
    await expect(page.getByTestId('email-input')).toBeFocused();

    // Tab to password
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('password-input')).toBeFocused();

    // Tab to remember me checkbox
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('remember-me-checkbox')).toBeFocused();

    // Tab to sign in button
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeFocused();
  });
});
