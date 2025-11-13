# Auth Components Testing

This directory contains comprehensive tests for the authentication components using Vitest and React Testing Library.

## Test Structure

### ProtectedRoute Tests (`protected-route.test.tsx`)
Tests the `ProtectedRoute` and `GuestRoute` components:
- Authentication state checking
- Conditional rendering based on auth status
- Redirect behavior
- Custom fallback rendering
- Loading states

### Login Form Tests (`forms/login/index.test.tsx`)
Tests the `LoginForm` component:
- Form rendering and structure
- User input handling (email, password, remember me)
- Form submission
- Password visibility toggle
- Google login integration
- Loading states
- Navigation links

### Login Validator Tests (`forms/login/validator.test.tsx`)
Tests the Zod schema validation for login forms:
- Valid data acceptance
- Invalid email validation
- Password length requirements
- Required field validation
- Type inference

## Running Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Setup

The tests use a comprehensive setup in `setup.ts` that includes:
- Jest DOM matchers
- Browser API mocks (matchMedia, IntersectionObserver, ResizeObserver)
- jsdom environment for React component testing

## Mock Strategy

Tests mock external dependencies:
- Authentication hooks and utilities
- Router navigation
- Google OAuth components
- Form validation schemas

This ensures tests are isolated and focus on component behavior rather than external service integration.
