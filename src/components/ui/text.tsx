import * as React from 'react';
// Import types only to avoid direct dependency on react-native
import type { TextProps as RNTextProps } from 'react-native';

import { cn } from '../../lib/utils';

export const TextClassContext = React.createContext<string | undefined>(undefined);

export interface TextProps extends RNTextProps {
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  style?: any;
}

const Text = React.forwardRef<any, TextProps>(
  ({ className, style, children, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    return (
      <span
        ref={ref}
        className={cn('text-foreground', textClass, className)}
        style={style}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Text.displayName = 'Text';

export { Text };