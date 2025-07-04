# shadcn UI Components

This directory contains shadcn UI components as **source code** to avoid runtime dependency on shadcn CLI.

When adding shadcn components, copy the component source code directly into this directory instead of using the shadcn CLI to add them as dependencies.

## Structure

- Each component should be in its own file (e.g., `button.tsx`, `input.tsx`)
- Components should be self-contained and not rely on external shadcn dependencies
- Include necessary utilities and types within the component files or in a shared utilities file

## Usage

Import components directly from this directory:
```typescript
import { Button } from '../shadcn/button';
import { Input } from '../shadcn/input';
```

This approach ensures that shadcn components are bundled with the package and don't require consumers to install shadcn CLI or additional dependencies.
