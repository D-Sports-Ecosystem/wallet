# Tech Stack & Build System

## Core Technologies

- **TypeScript**: Primary language with strict type checking
- **React 18+**: UI framework with JSX support
- **Ethers.js v6**: Ethereum interactions and wallet management
- **Zustand**: State management for wallet stores
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible component primitives for UI components

## Build System

- **Rollup**: Module bundler with multiple output formats (CJS, ESM)
- **TypeScript Compiler**: Declaration file generation
- **PostCSS**: CSS processing and optimization
- **Terser**: JavaScript minification

## Testing & Quality

- **Jest**: Testing framework with jsdom environment
- **Testing Library**: React component testing utilities
- **ESLint**: Code linting with TypeScript and React plugins
- **TypeScript**: Strict type checking with `noEmit` for validation

## Platform Support

- **Web/Next.js**: Browser-based applications
- **React Native**: Mobile applications with platform-specific dependencies
- **Node.js**: Server-side compatibility

## Common Commands

```bash
# Development
npm run dev              # Start development mode with watch
npm run build           # Build all packages (core, nextjs, react-native)
npm run build:core      # Build core package only
npm run build:nextjs    # Build Next.js specific package
npm run build:react-native # Build React Native package

# Testing
npm test               # Run Jest tests
npm run test:watch     # Run tests in watch mode

# Quality Assurance
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues automatically
npm run typecheck      # TypeScript type checking

# Maintenance
npm run clean          # Clean build artifacts
npm run prepare        # Pre-publish build step
```

## Package Exports

The package supports multiple export paths:
- `.` - Core functionality
- `./nextjs` - Next.js specific exports
- `./react-native` - React Native specific exports
- `./ui` - UI components

## Dependencies

### Runtime Dependencies
- Radix UI components for accessible UI primitives
- Ethers.js for blockchain interactions
- Zustand for state management
- Tailwind utilities for styling

### Peer Dependencies
- React/React DOM (required)
- React Native (optional, for mobile)
- Tailwind CSS (for styling)

## Build Configuration

- **Target**: ES2020 with DOM support
- **Module**: ESNext with Node resolution
- **Output**: Both CommonJS and ESM formats
- **Source Maps**: Generated for debugging
- **Declaration Files**: Generated for TypeScript support