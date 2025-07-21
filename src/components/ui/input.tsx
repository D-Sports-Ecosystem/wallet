import * as React from 'react';
// Import types only to avoid direct dependency on react-native
import type { TextInputProps } from 'react-native';

import { cn } from '../../lib/utils';

export interface InputProps extends TextInputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholderClassName?: string;
}

const Input = React.forwardRef<any, InputProps>(
  ({ className, placeholderClassName, placeholder, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm web:ring-offset-background web:file:border-0 web:file:bg-transparent web:file:text-sm web:file:font-medium placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 native:text-base',
          className
        )}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };