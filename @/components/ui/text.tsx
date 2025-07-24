/**
 * @file text.tsx
 * @description A custom Text component that provides consistent text styling
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import * as React from 'react';
import { cn } from '../../../src/lib/utils';

/**
 * Context for sharing text class names between components
 */
const TextClassContext = React.createContext<string | undefined>(undefined);

/**
 * Props for the Text component
 *
 * @interface TextProps
 * @extends {React.HTMLAttributes<HTMLSpanElement>}
 */
interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

/**
 * Custom Text component for consistent text styling
 *
 * @component
 * @param {TextProps} props - Component props
 * @returns {JSX.Element} - Rendered Text component
 */
const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? 'div' : 'span';
    
    return (
      <Component
        ref={ref}
        className={cn('text-base text-foreground select-text', textClass, className)}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

export { Text, TextClassContext };