# Project Structure & Organization

## Root Structure

```
@d-sports/wallet/
├── src/                    # Source code
├── dist/                   # Build output (generated)
├── app/                    # Next.js app directory (demo/examples)
├── data/                   # Static data files
├── .kiro/                  # Kiro AI assistant configuration
└── node_modules/           # Dependencies
```

## Source Code Organization (`src/`)

### Core Architecture
```
src/
├── core/                   # Core wallet functionality
│   ├── wallet.ts          # Main DSportsWallet class
│   ├── stores/            # Zustand state management
│   └── __tests__/         # Core functionality tests
├── types/                 # TypeScript type definitions
│   └── index.ts          # All exported types
├── utils/                 # Utility functions
│   ├── event-emitter.ts  # Custom event emitter
│   └── platform-adapters.ts # Platform-specific adapters
```

### Platform-Specific Modules
```
src/
├── nextjs/               # Next.js specific exports
├── react-native/         # React Native specific exports
├── connectors/           # Wallet connectors
│   ├── rainbow-kit.ts   # Rainbow Kit integration
│   └── wagmi.ts         # Wagmi integration
└── providers/            # Authentication providers
    ├── custom-social-login.ts
    └── dsports-oauth-service.ts
```

### UI Components
```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI primitives (Radix-based)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── index.ts     # Barrel exports
│   ├── main-page.tsx    # Main wallet interface
│   ├── send-page.tsx    # Send functionality
│   ├── receive-page.tsx # Receive functionality
│   └── token-*.tsx      # Token-related components
├── wallet-dashboard.tsx  # Main dashboard component
├── wallet-modal.tsx     # Modal interface
└── wallet-page.tsx      # Page wrapper
```

## Configuration Files

### Build & Development
- `rollup.config.js` - Main build configuration
- `rollup.config.nextjs.js` - Next.js specific build
- `rollup.config.react-native.js` - React Native build
- `tsconfig.json` - TypeScript configuration
- `jest.config.cjs` - Test configuration
- `eslint.config.js` - Linting rules

### Styling & UI
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui component configuration
- `src/index.css` - Global styles
- `src/global.css` - Additional global styles
- `app/globals.css` - Next.js global styles

## Naming Conventions

### Files & Directories
- **kebab-case** for file names: `custom-social-login.ts`
- **PascalCase** for component files: `TokenCard.tsx`
- **camelCase** for utility files: `eventEmitter.ts`
- **lowercase** for directories: `components/`, `utils/`

### Code Conventions
- **PascalCase** for classes and components: `DSportsWallet`, `TokenCard`
- **camelCase** for functions and variables: `createWallet`, `isConnected`
- **SCREAMING_SNAKE_CASE** for constants: `DEFAULT_CHAIN_ID`
- **Interface** prefix for TypeScript interfaces: `WalletConfig`, `SocialProvider`

## Import/Export Patterns

### Barrel Exports
- Each major directory has an `index.ts` for clean imports
- UI components use barrel exports: `export * from "./button"`
- Main entry point (`src/index.ts`) exports all public APIs

### Path Aliases (tsconfig.json)
```typescript
"@/*": ["./src/*"]
"@/components/*": ["./src/components/*"]
"@/lib/*": ["./src/lib/*"]
"@/utils/*": ["./src/utils/*"]
"@/types/*": ["./src/types/*"]
```

## Testing Structure
- Tests co-located with source: `__tests__/` directories
- Test files: `*.test.ts`, `*.spec.ts`
- Setup file: `src/setupTests.ts`
- Coverage excludes: type definitions, index files, test files

## Build Output Structure
```
dist/
├── index.js              # CommonJS build
├── index.esm.js          # ES Module build
├── index.d.ts            # TypeScript declarations
├── index.css             # Compiled styles
├── nextjs/               # Next.js specific build
├── react-native/         # React Native build
└── ui/                   # UI components build
```

## Key Architectural Patterns

### Platform Adapter Pattern
- `PlatformAdapter` interface for cross-platform compatibility
- Separate adapters for web, Next.js, and React Native
- Handles storage, crypto, and network operations

### Event-Driven Architecture
- Custom `EventEmitter` for wallet events
- Type-safe event handling with `WalletEventMap`
- Connector-based event propagation

### Factory Pattern
- `createDSportsWallet()` - Main factory function
- `createDSportsWalletQuickStart()` - Development factory
- Platform-specific connector factories


Theres no point running npm run typecheck because you keep HANGING on the command 