import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeText?: (text: string) => void;
  placeholderClassName?: string;
  keyboardType?: string;
  style?: React.CSSProperties;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholderClassName, placeholder, onChange, onChangeText, keyboardType, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onChangeText) onChangeText(e.target.value);
    };

    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm web:ring-offset-background web:file:border-0 web:file:bg-transparent web:file:text-sm web:file:font-medium placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 native:text-base',
          className
        )}
        placeholder={placeholder}
        onChange={handleChange}
        type={keyboardType === 'decimal-pad' ? 'number' : 'text'}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };