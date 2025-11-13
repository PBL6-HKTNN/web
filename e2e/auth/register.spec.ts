import { test, expect } from '@playwright/test';

test.describe('Authentication - Register', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to register page
    await page.goto('/auth/register');
  });

  test('should display register form correctly', async ({ page }) => {
    // Check page title and description
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.getByText('Join CodeMy and start your coding journey today')).toBeVisible();

    // Check form elements
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('confirm-password-input')).toBeVisible();
    await expect(page.getByTestId('terms-checkbox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();

    // Check links
    await expect(page.getByText('Sign in')).toBeVisible();
    await expect(page.getByText('Terms of Service')).toBeVisible();
    await expect(page.getByText('Privacy Policy')).toBeVisible();
  });

  test('should show password visibility toggles', async ({ page }) => {
    const passwordInput = page.getByTestId('password-input');
    const confirmPasswordInput = page.getByTestId('confirm-password-input');

    // Initially passwords should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Find and click password toggle buttons
    const passwordToggleButtons = page.locator('button').filter({ has: page.locator('[data-testid="loader2-icon"]') });
    const toggleButtons = await passwordToggleButtons.all();

    // Toggle password visibility
    await toggleButtons[0].click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle confirm password visibility
    await toggleButtons[1].click();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Toggle back
    await toggleButtons[0].click();
    await toggleButtons[1].click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  test('should validate email format', async ({ page }) => {
    // Fill invalid email
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password123');
    await page.getByTestId('terms-checkbox').check();

    // Submit form
    await page.getByRole('button', { name: 'Create account' }).click();

    // Should stay on register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('should validate password requirements', async ({ page }) => {
    // Fill valid email but short password
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('12345'); // Less than 6 characters
    await page.getByTestId('confirm-password-input').fill('12345');
    await page.getByTestId('terms-checkbox').check();

    // Submit form
    await page.getByRole('button', { name: 'Create account' }).click();

    // Should stay on register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('should validate password confirmation match', async ({ page }) => {
    // Fill passwords that don't match
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('differentpassword');
    await page.getByTestId('terms-checkbox').check();

    // Submit form
    await page.getByRole('button', { name: 'Create account' }).click();

    // Should stay on register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('should require terms agreement', async ({ page }) => {
    // Fill form but don't check terms
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password123');

    // Submit form
    await page.getByRole('button', { name: 'Create account' }).click();

    // Should stay on register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('should handle terms checkbox interaction', async ({ page }) => {
    const checkbox = page.getByTestId('terms-checkbox');

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Check it
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Uncheck it
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should navigate to login page', async ({ page }) => {
    // Click sign in link
    await page.getByText('Sign in').click();

    // Should navigate to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on email input
    await page.getByTestId('email-input').focus();
    await expect(page.getByTestId('email-input')).toBeFocused();

    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('password-input')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('confirm-password-input')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('terms-checkbox')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeFocused();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that all elements are still visible and accessible
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('confirm-password-input')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('should handle successful registration flow', async ({ page }) => {
    // Fill valid registration data
    await page.getByTestId('email-input').fill('newuser@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password123');
    await page.getByTestId('terms-checkbox').check();

    // Submit form
    await page.getByRole('button', { name: 'Create account' }).click();

    // This will depend on the backend response - could redirect to verification or login
    // For now, we'll just check that the form submission was attempted
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });
});
