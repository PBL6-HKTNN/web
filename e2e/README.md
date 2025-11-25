# End-to-End Tests with Playwright

This directory contains comprehensive end-to-end (e2e) tests for the CodeMy web application using Playwright.

## Overview

The e2e tests cover the authentication flow and ensure that critical user journeys work correctly across different browsers and devices.

## Test Structure

### Authentication Tests (`auth/`)

#### Login Tests (`login.spec.ts`)
Tests the complete login user journey:
- Form display and validation
- Password visibility toggle
- Email format validation
- Password requirements
- Remember me functionality
- Navigation to register/forgot password
- Keyboard navigation
- Mobile responsiveness
- Error handling

#### Register Tests (`register.spec.ts`)
Tests the user registration process:
- Form display and validation
- Password confirmation matching
- Terms of service agreement
- Password visibility toggles
- Email format validation
- Navigation to login
- Keyboard navigation
- Mobile responsiveness
- Successful registration flow

#### Forgot Password Tests (`forgot-password.spec.ts`)
Tests the password reset functionality:
- Email submission for reset code
- Form validation
- Reset code and new password input
- Complete password reset flow
- Navigation back to login
- Mobile responsiveness

#### Email Verification Tests (`verify-email.spec.ts`)
Tests the email verification process:
- Verification code input and validation
- URL parameter handling (email/token)
- Resend verification code
- Success and error states
- Loading states
- Mobile responsiveness

## Running Tests

### Prerequisites
Make sure the development server is running before executing e2e tests:

```bash
npm run dev
```

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Tests with UI Mode
```bash
npm run test:e2e:ui
```

### Run Tests in Debug Mode
```bash
npm run test:e2e:debug
```

### Run Tests in Headed Mode (visible browser)
```bash
npm run test:e2e:headed
```

### Run Specific Test File
```bash
npx playwright test auth/login.spec.ts
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Testing**: iPhone 12, Pixel 5
- **Parallel Execution**: Fully parallel across workers
- **Auto-start Dev Server**: Starts `npm run dev` before tests
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on first retry

## Test Best Practices

### Page Object Model
Tests use Playwright's locator APIs directly for simplicity, but consider implementing Page Object Models for complex scenarios.

### Test Isolation
Each test is isolated and can run independently. Tests don't rely on the state of previous tests.

### Assertions
Tests use Playwright's built-in assertions with `expect()` for reliable element state checking.

### Wait Strategies
Tests use explicit waits and Playwright's auto-waiting capabilities rather than fixed timeouts.

### Mobile Testing
All tests include mobile viewport testing to ensure responsive design works correctly.

## CI/CD Integration

The tests are configured to run in CI environments with:
- No parallel execution in CI (single worker)
- Retry on failure (2 retries in CI)
- No headed mode in CI
- Proper artifact collection (screenshots, videos, traces)

## Debugging Tests

### Using Playwright UI
```bash
npm run test:e2e:ui
```
Opens a visual interface to run and debug tests.

### Using Debug Mode
```bash
npm run test:e2e:debug
```
Runs tests in debug mode with step-through capabilities.

### Using Browser DevTools
Add `await page.pause()` in test code to pause execution and inspect the browser.

## Test Data and Mocking

Tests currently use realistic test data. For integration with real APIs, consider:

1. **Test User Accounts**: Create dedicated test accounts
2. **API Mocking**: Use Playwright's request interception for API mocking
3. **Test Database**: Use a separate test database for e2e tests

## Extending Tests

### Adding New Test Files
1. Create new `.spec.ts` file in appropriate directory
2. Follow the naming convention: `feature.spec.ts`
3. Use `test.describe()` for grouping related tests
4. Use `test.beforeEach()` for common setup

### Adding New Browsers
Update `projects` in `playwright.config.ts`:
```typescript
{
  name: 'Microsoft Edge',
  use: { ...devices['Desktop Edge'], channel: 'msedge' },
}
```

### Adding API Testing
Playwright can also test APIs:
```typescript
const response = await page.request.get('/api/users');
expect(response.status()).toBe(200);
```

## Troubleshooting

### Common Issues

1. **Tests timeout**: Increase timeout in config or use explicit waits
2. **Flaky tests**: Use more specific selectors and proper wait strategies
3. **Browser issues**: Clear browser cache or use incognito mode
4. **CI failures**: Check network connectivity and API availability

### Performance
- Run tests in parallel when possible
- Use `onlyOnFailure` for screenshots/videos
- Optimize selector strategies for faster element location

## Integration with Development Workflow

- Run e2e tests as part of pre-deployment checks
- Use e2e tests to validate critical user journeys
- Combine with unit tests (Vitest) for comprehensive coverage
- Use e2e tests to catch integration issues missed by unit tests
