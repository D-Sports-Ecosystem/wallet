/**
 * @file .eslintrc.docs.js
 * @description ESLint configuration for documentation validation
 * @module config/eslint
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

const docRules = require('./.kiro/specs/comprehensive-documentation/eslint-docs-config');

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    ...docRules.extends
  ],
  plugins: [
    "@typescript-eslint", 
    "react", 
    "react-hooks",
    ...docRules.plugins
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  settings: {
    react: {
      version: "detect",
    },
    ...docRules.settings
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
    ...docRules.rules
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
    ...docRules.overrides
  ],
};