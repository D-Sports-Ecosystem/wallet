import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginJSDoc from "eslint-plugin-jsdoc";
import pluginTSDoc from "eslint-plugin-tsdoc";
import { defineConfig } from "eslint/config";

// Documentation rules
const docRules = {
  // Require JSDoc comments
  "jsdoc/require-jsdoc": ["warn", {
    "publicOnly": true,
    "require": {
      "ArrowFunctionExpression": true,
      "ClassDeclaration": true,
      "ClassExpression": true,
      "FunctionDeclaration": true,
      "FunctionExpression": true,
      "MethodDefinition": true
    },
    "contexts": [
      "TSInterfaceDeclaration",
      "TSTypeAliasDeclaration",
      "TSEnumDeclaration",
      "TSPropertySignature"
    ]
  }],
  
  // Require description in JSDoc comments
  "jsdoc/require-description": ["warn", {
    "contexts": [
      "ArrowFunctionExpression",
      "ClassDeclaration",
      "ClassExpression",
      "FunctionDeclaration",
      "FunctionExpression",
      "MethodDefinition",
      "TSInterfaceDeclaration",
      "TSTypeAliasDeclaration",
      "TSEnumDeclaration"
    ]
  }],
  
  // Require parameter descriptions
  "jsdoc/require-param-description": "warn",
  
  // Require return descriptions
  "jsdoc/require-returns-description": "warn",
  
  // Require property descriptions
  "jsdoc/require-property-description": "warn",
  
  // Require examples for public APIs
  "jsdoc/require-example": ["warn", {
    "contexts": [
      "FunctionDeclaration:not([private])",
      "ClassDeclaration:not([private])",
      "MethodDefinition:not([private])"
    ]
  }],
  
  // Enforce valid JSDoc
  "jsdoc/valid-types": "warn",
  "jsdoc/no-undefined-types": "warn",
  "jsdoc/check-param-names": "warn",
  "jsdoc/check-tag-names": "warn",
  "jsdoc/check-types": "warn",
  
  // TypeScript-specific documentation rules
  "tsdoc/syntax": "warn"
};

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  
  // Documentation rules (disabled by default in main config, enabled in .eslintrc.docs.js)
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      jsdoc: pluginJSDoc,
      tsdoc: pluginTSDoc
    },
    rules: {
      // Documentation rules are commented out in the main config
      // They are enabled in .eslintrc.docs.js
      // Uncomment to enable in the main config
      /*
      ...docRules,
      */
    }
  },
  
  // Stricter rules for core files
  {
    files: ["src/core/**/*.ts", "src/core/**/*.tsx"],
    rules: {
      // Core files have stricter rules when documentation linting is enabled
    }
  },
  
  // Stricter rules for UI components
  {
    files: ["src/components/**/*.tsx", "@/components/**/*.tsx"],
    rules: {
      // UI components have stricter rules when documentation linting is enabled
    }
  },
  
  // Less strict rules for test files
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-description": "off",
      "jsdoc/require-example": "off"
    }
  }
]);
