# Cross-Platform Tests

This directory contains comprehensive tests for verifying browser compatibility and cross-platform functionality of the D-Sports wallet package.

## Test Suites

### 1. Browser Compatibility Tests

Tests that verify the package works correctly in browser environments without relying on Node.js globals or modules.

```bash
npm run test:browser-compatibility
```

### 2. Platform Adapter Factory Tests

Tests that verify the platform adapter factory pattern works correctly across different environments and with different feature sets.

```bash
npm run test:platform-adapters
```

### 3. Runtime Feature Detection Tests

Tests that verify the package correctly detects available features at runtime and provides appropriate fallbacks when features are unavailable.

```bash
npm run test:runtime-features
```

### 4. Bundle Analysis Tests

Tests that verify Node.js modules are properly excluded from browser bundles.

```bash
npm run validate-browser-bundle
```

## Manual Testing

For manual testing in a real browser environment, open the following HTML files in your browser:

- `test-browser-platform-adapters.html`: Tests platform adapters in a browser environment
- `test-browser-compatibility.cjs`: Simple Node.js script that simulates a browser environment

## Running All Tests

To run all tests:

```bash
npm test
```

## Continuous Integration

The bundle validation script is automatically run as part of the build process to ensure browser compatibility:

```bash
npm run build
```

This will build all packages and validate that the browser bundles do not contain any Node.js modules.