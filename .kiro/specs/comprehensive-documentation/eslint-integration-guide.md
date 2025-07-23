# ESLint Documentation Configuration Integration Guide

This guide explains how to integrate the documentation ESLint configuration into the @d-sports/wallet project.

## Installation

First, install the required ESLint plugins:

```bash
npm install --save-dev eslint-plugin-jsdoc eslint-plugin-tsdoc
```

## Integration

To integrate the documentation ESLint configuration, you need to extend your existing ESLint configuration.

### Option 1: Extend the main ESLint configuration

Modify your `.eslintrc.js` file to include the documentation configuration:

```javascript
// .eslintrc.js
const docRules = require('./.kiro/specs/comprehensive-documentation/eslint-docs-config');

module.exports = {
  // Existing configuration...
  
  // Merge plugins
  plugins: [
    ...existing.plugins,
    ...docRules.plugins
  ],
  
  // Merge extends
  extends: [
    ...existing.extends,
    ...docRules.extends
  ],
  
  // Merge settings
  settings: {
    ...existing.settings,
    ...docRules.settings
  },
  
  // Merge rules
  rules: {
    ...existing.rules,
    ...docRules.rules
  },
  
  // Merge overrides
  overrides: [
    ...existing.overrides,
    ...docRules.overrides
  ]
};
```

### Option 2: Create a separate ESLint configuration for documentation

Create a separate ESLint configuration file for documentation:

```javascript
// .eslintrc.docs.js
const baseConfig = require('./.eslintrc.js');
const docRules = require('./.kiro/specs/comprehensive-documentation/eslint-docs-config');

module.exports = {
  ...baseConfig,
  
  // Merge plugins
  plugins: [
    ...baseConfig.plugins,
    ...docRules.plugins
  ],
  
  // Merge extends
  extends: [
    ...baseConfig.extends,
    ...docRules.extends
  ],
  
  // Merge settings
  settings: {
    ...baseConfig.settings,
    ...docRules.settings
  },
  
  // Merge rules
  rules: {
    ...baseConfig.rules,
    ...docRules.rules
  },
  
  // Merge overrides
  overrides: [
    ...baseConfig.overrides,
    ...docRules.overrides
  ]
};
```

Then add a script to your `package.json`:

```json
{
  "scripts": {
    "lint:docs": "eslint --config .eslintrc.docs.js 'src/**/*.{ts,tsx}'"
  }
}
```

## Usage

### Running Documentation Linting

To run documentation linting:

```bash
npm run lint:docs
```

### Fixing Documentation Issues

To automatically fix documentation issues where possible:

```bash
npm run lint:docs -- --fix
```

### Ignoring Files

To ignore specific files from documentation linting, add them to `.eslintignore`:

```
# .eslintignore
src/types/generated/**
```

## Recommended Workflow

1. Start by documenting core files in `src/core/`
2. Then document UI components in `src/components/`
3. Then document utility functions in `src/utils/`
4. Run documentation linting regularly to ensure compliance
5. Fix documentation issues as they are identified

## Common Issues and Solutions

### Missing JSDoc Comments

Error:
```
error: Missing JSDoc comment (jsdoc/require-jsdoc)
```

Solution: Add a JSDoc comment to the function, class, or interface:

```typescript
/**
 * Description of the function
 * 
 * @param {string} param - Parameter description
 * @returns {boolean} Return value description
 */
function myFunction(param: string): boolean {
  // ...
}
```

### Missing Parameter Description

Error:
```
error: Missing JSDoc @param description (jsdoc/require-param-description)
```

Solution: Add a description to the parameter:

```typescript
/**
 * Description of the function
 * 
 * @param {string} param - Parameter description
 * @returns {boolean} Return value description
 */
```

### Missing Return Description

Error:
```
error: Missing JSDoc @returns description (jsdoc/require-returns-description)
```

Solution: Add a description to the return value:

```typescript
/**
 * Description of the function
 * 
 * @param {string} param - Parameter description
 * @returns {boolean} Return value description
 */
```

### Missing Example

Warning:
```
warning: Missing JSDoc @example (jsdoc/require-example)
```

Solution: Add an example to the JSDoc comment:

```typescript
/**
 * Description of the function
 * 
 * @param {string} param - Parameter description
 * @returns {boolean} Return value description
 * 
 * @example
 * ```typescript
 * const result = myFunction('test');
 * ```
 */
```