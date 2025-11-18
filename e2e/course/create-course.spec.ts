import { test, expect } from '@playwright/test';

test.use({
  video: 'on',
  screenshot: 'on',
  trace: 'on',
});
test.setTimeout(50000);

test.describe('Course Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.getByTestId('email-input').fill('nauts01020304@gmail.com');
    await page.getByTestId('password-input').fill('Nauts12345@');

    await Promise.all([
      page.getByRole('button', { name: 'Sign in' }).click(),
    ]);

    // Navigate to create page
    await page.getByTestId('lecturing-tool-link').click();
    await page.getByTestId('create-course-button').click();
    await expect(page).toHaveURL(/create/);
  });

  // -----------------------------------------------------
  // UI render test
  // -----------------------------------------------------
  test('should display course creation form correctly', async ({ page }) => {
    await expect(page.getByText('Create New Course')).toBeVisible();

    const fields = [
      'course-title-input',
      'course-description-input',
      'course-category-select',
      'course-level-select',
      'course-price-input',
      'course-language-input',
      'course-thumbnail-upload-button',
    ];

    for (const testId of fields) {
      await expect(page.getByTestId(testId)).toBeVisible();
    }

    await expect(page.getByRole('button', { name: 'Create Course' })).toBeVisible();
  });

  // -----------------------------------------------------
  // Required fields Validation
  // -----------------------------------------------------
  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Course' }).click();

    await expect(page).toHaveURL(/create/);
    await expect(page.getByText('Create New Course')).toBeVisible();

    // Nếu có message thì tốt hơn:
    // await expect(page.getByText(/required/i)).toBeVisible();
  });

  // -----------------------------------------------------
  // Price & title validation
  // -----------------------------------------------------
  test('should validate course title and price', async ({ page }) => {
    // Empty title
    await page.getByTestId('course-title-input').fill('');
    await page.getByRole('button', { name: 'Create Course' }).click();
    await expect(page).toHaveURL(/create/);

    // Valid title but invalid price
    await page.getByTestId('course-title-input').fill('Valid Course');
    await page.getByTestId('course-price-input').fill('-10');
    await page.getByRole('button', { name: 'Create Course' }).click();
    await expect(page).toHaveURL(/create/);
  });

  // -----------------------------------------------------
  // File upload test
  // -----------------------------------------------------
  test('should upload a thumbnail file successfully', async ({ page }) => {
    

    await page.getByTestId('course-thumbnail-upload-button').click();

    await page
    .getByTestId('course-thumbnail-input')
    .setInputFiles('e2e/file/image.jpg');

    // Kiểm tra UI có hiển thị preview hoặc tên file
    const uploadedPreview = page.getByText(/image\.jpg/i);
    await expect(uploadedPreview).toBeVisible();
    await page.getByTestId('upload-button').click();
    await page.waitForTimeout(5000);
  });

  // -----------------------------------------------------
  // Full happy path: valid data → redirect or success
  // -----------------------------------------------------
  test('should create course with valid data including thumbnail', async ({ page }) => {
    // Fill fields
    await page.getByTestId('course-title-input').fill('Complete React Development Course');
    await page.getByTestId('course-description-input').fill(
      'Learn React from zero to advanced level.'
    );
  
    // Select category
    await page.getByTestId('course-category-select').click();
    await page.getByRole('option').first().click();
  
    // Fill price
    await page.getByTestId('course-price-input').fill('100');
  
    // Level select
    await page.getByTestId('course-level-select').click();
    await page.getByRole('option', { name: /beginner/i }).click();
  
    await page.getByTestId('course-language-input').fill('English');
  
    // --- Upload thumbnail properly (NO filechooser) ------------------------
  
    // Mở dialog upload
    await page.getByTestId('course-thumbnail-upload-button').click();
  
    // Upload file trực tiếp vào input hidden
    await page
      .getByTestId('course-thumbnail-input')
      .setInputFiles('e2e/file/image.jpg');
  
    // Kiểm tra preview có hiển thị
    await expect(page.getByRole('img')).toBeVisible();

    await page.getByTestId('upload-button').click();
  
    // -----------------------------------------------------------------------
  
    // Submit
    const navPromise = page.waitForNavigation({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Create Course' }).click();
    await navPromise.catch(() => {}); // fallback nếu không điều hướng
  
    // Assert redirect OR success message
    await page.waitForTimeout(2000);

    const url = page.url();

    // Nếu redirect thành công
    if (url.includes('/lecturing-tool/course')) {
      expect(url).toContain('/lecturing-tool/course');
    } else {
      // Không redirect → check success message
      await expect(page.getByText(/success|created/i)).toBeVisible();
    }
  });
  

  // -----------------------------------------------------
  // Required fields (duplicate but valid check)
  // -----------------------------------------------------
  test('should require all mandatory inputs', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Course' }).click();
    await expect(page).toHaveURL(/create/);
  });
});
