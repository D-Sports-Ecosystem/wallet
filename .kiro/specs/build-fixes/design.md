# Design Document

## Overview

This design addresses critical build issues in the @d-sports/wallet package by resolving TypeScript compilation errors, cleaning up unused directives, and fixing import path resolution problems. The solution focuses on three main areas: correcting import paths for token data, removing unnecessary TypeScript error suppressions, and ensuring proper module resolution across the build system.

## Architecture

### Current Build System
The package uses a multi-target Rollup build system with three separate configurations:
- **Core build** (`rollup.config.js`): Main package build
- **Next.js build** (`rollup.config.nextjs.js`): Next.js-specific exports
- **React Native build** (`rollup.config.react-native.js`): React Native-specific exports

### Path Resolution Strategy
The TypeScript configuration uses path aliases with `baseUrl: "./src"` and path mappings:
- `@/*` maps to `./src/*`
- Component-specific paths for organized imports

### Module Resolution Issues
1. **Token Data Import**: The wallet modal imports from `./data/token-data` but the file is located at `../data/token-data` relative to the src directory
2. **TypeScript Directive**: Unused `@ts-expect-error` directive in button component where the import actually works correctly
3. **Build Path Resolution**: Import paths need to be consistent with the TypeScript baseUrl configuration

## Components and Interfaces

### Affected Components

#### WalletModal Component (`src/wallet-modal.tsx`)
- **Current Issue**: Imports token data from incorrect relative path
- **Resolution**: Update import path to correctly reference token data from the data directory
- **Dependencies**: `availableTokens` and `tokens` exports from token-data.ts

#### Button Component (`src/components/ui/button.tsx`)
- **Current Issue**: Unnecessary `@ts-expect-error` directive for cn utility import
- **Resolution**: Remove the directive as the import resolves correctly with path aliases
- **Dependencies**: `cn` utility function from `@/lib/utils`

#### Token Data Module (`data/token-data.ts`)
- **Current State**: Properly exports `availableTokens` and `tokens`
- **Resolution**: No changes needed to the module itself
- **Usage**: Referenced by wallet modal for token display and interaction

### Import Path Resolution

#### Current Path Structure
```
project-root/
├── src/
│   ├── wallet-modal.tsx (imports from "./data/token-data")
│   ├── components/ui/button.tsx (imports from "@/lib/utils")
│   └── lib/utils.ts
└── data/
    └── token-data.ts
```

#### Corrected Path Structure
```
project-root/
├── src/
│   ├── wallet-modal.tsx (should import from "../data/token-data")
│   ├── components/ui/button.tsx (imports from "@/lib/utils" - working)
│   └── lib/utils.ts
└── data/
    └── token-data.ts
```

## Data Models

### Token Data Structure
The token data module exports two main structures:

#### AvailableTokens Interface
```typescript
interface TokenData {
  name: string;
  symbol: string;
  network: string;
  amount: string;
  value: string;
  change: { positive: string; negative: string };
  icon: string;
  bgColor: string;
  balance: string;
  address: string;
  transactions: Transaction[];
}
```

#### Transaction Interface
```typescript
interface Transaction {
  type: "send" | "receive";
  amount: string;
  value: string;
  time: string;
  to?: string;
  from?: string;
}
```

## Error Handling

### TypeScript Compilation Errors
- **Import Resolution**: Ensure all import paths resolve correctly during compilation
- **Type Safety**: Maintain strict TypeScript checking without unnecessary error suppressions
- **Build Validation**: Verify that all generated files are valid and functional

### Build Process Error Handling
- **Path Resolution**: Handle cases where imports might fail due to incorrect paths
- **Module Loading**: Ensure proper module resolution across different build targets
- **Dependency Validation**: Verify that all required dependencies are available during build

## Testing Strategy

### Build Validation Tests
1. **Compilation Test**: Verify that `npm run typecheck` passes without errors
2. **Build Test**: Ensure `npm run build` completes successfully for all targets
3. **Import Resolution Test**: Validate that token data imports work correctly in the wallet modal
4. **Component Rendering Test**: Verify that components render without TypeScript errors

### Regression Testing
1. **Button Component**: Ensure button component continues to work after removing @ts-expect-error
2. **Wallet Modal**: Verify wallet modal can access and display token data correctly
3. **Build Outputs**: Confirm that all build targets (core, nextjs, react-native) generate valid files

### Integration Testing
1. **Token Data Access**: Test that wallet modal can import and use both `availableTokens` and `tokens`
2. **Utility Functions**: Verify that `cn` utility function works correctly in button component
3. **Path Alias Resolution**: Ensure all `@/*` path aliases resolve correctly across the codebase

## Implementation Approach

### Phase 1: Import Path Correction
- Update wallet modal import path for token data
- Verify import resolution works correctly
- Test component functionality with corrected import

### Phase 2: TypeScript Directive Cleanup
- Remove unnecessary `@ts-expect-error` directive from button component
- Verify that cn utility import works without error suppression
- Confirm no TypeScript warnings are generated

### Phase 3: Build Validation
- Run full build process to ensure no compilation errors
- Verify all build targets generate correctly
- Test that generated files are functional

### Phase 4: Testing and Verification
- Execute comprehensive test suite
- Validate component functionality
- Confirm build process stability