/**
 * @file eslint-docs-config.js
 * @description ESLint configuration for enforcing documentation standards
 * @module documentation/eslint
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

module.exports = {
  plugins: ["jsdoc", "eslint-plugin-tsdoc"],
  extends: [
    "plugin:jsdoc/recommended"
  ],
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: "returns",
        property: "property",
        description: "description",
        component: "component"
      },
      mode: "typescript"
    }
  },
  rules: {
    // Require JSDoc comments
    "jsdoc/require-jsdoc": ["error", {
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
    "jsdoc/require-description": ["error", {
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
    "jsdoc/require-param-description": "error",
    
    // Require return descriptions
    "jsdoc/require-returns-description": "error",
    
    // Require property descriptions
    "jsdoc/require-property-description": "error",
    
    // Require examples for public APIs
    "jsdoc/require-example": ["warn", {
      "contexts": [
        "FunctionDeclaration:not([private])",
        "ClassDeclaration:not([private])",
        "MethodDefinition:not([private])"
      ]
    }],
    
    // Enforce valid JSDoc
    "jsdoc/valid-types": "error",
    "jsdoc/no-undefined-types": "warn",
    "jsdoc/check-param-names": "error",
    "jsdoc/check-tag-names": "error",
    "jsdoc/check-types": "error",
    
    // TypeScript-specific documentation rules
    "tsdoc/syntax": "warn"
  },
  overrides: [
    {
      // Apply stricter rules to core files
      files: ["src/core/**/*.ts", "src/core/**/*.tsx"],
      rules: {
        "jsdoc/require-jsdoc": ["error", {
          "publicOnly": false,
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
        "jsdoc/require-example": ["error", {
          "contexts": [
            "FunctionDeclaration",
            "ClassDeclaration",
            "MethodDefinition"
          ]
        }]
      }
    },
    {
      // Apply stricter rules to UI components
      files: ["src/components/**/*.tsx", "@/components/**/*.tsx"],
      rules: {
        "jsdoc/require-jsdoc": ["error", {
          "publicOnly": false,
          "require": {
            "ArrowFunctionExpression": true,
            "FunctionDeclaration": true
          }
        }],
        "jsdoc/require-param": ["error", {
          "exemptedBy": ["component"]
        }],
        "jsdoc/require-returns": ["error", {
          "exemptedBy": ["component"]
        }]
      }
    },
    {
      // Less strict rules for test files
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      rules: {
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-description": "off",
        "jsdoc/require-example": "off"
      }
    }
  ]
};