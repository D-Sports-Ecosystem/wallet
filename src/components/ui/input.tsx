/**
 * @file input.tsx
 * @description A cross-platform input component for text entry
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2024-07-23
 */

import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Props for the Input component
 * 
 * @interface InputProps
 * @property {string} [className] - Additional CSS classes for the input element
 * @property {string} [placeholder] - Placeholder text to display when input is empty
 * @property {string} [value] - Current value of the input
 * @property {function} [onChange] - Event handler for input changes (web-focused)
 * @property {function} [onChangeText] - Event handler for text changes (React Native-focused)
 * @property {string} [placeholderClassName] - Additional CSS classes for the placeholder
 * @property {string} [keyboardType] - Type of keyboard to display (e.g., 'decimal-pad')
 * @property {React.CSSProperties} [style] - Inline styles for the input
 */
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

/**
 * Input component for text entry with cross-platform support
 * 
 * @component
 * @param {InputProps} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.placeholderClassName] - CSS classes for placeholder
 * @param {string} [props.placeholder] - Placeholder text
 * @param {function} [props.onChange] - Web input change handler
 * @param {function} [props.onChangeText] - React Native text change handler
 * @param {string} [props.keyboardType] - Keyboard type (maps to input type)
 * @param {React.Ref<HTMLInputElement>} ref - Reference to the input element
 * @returns {JSX.Element} - Rendered Input component
 * 
 * @example
 * ```tsx
 * // Basic input
 * <Input placeholder="Enter your name" />
 * 
 * // Input with value and change handler
 * <Input 
 *   value={name} 
 *   onChange={(e) => setName(e.target.value)} 
 * />
 * 
 * // React Native style with onChangeText
 * <Input 
 *   value={amount} 
 *   onChangeText={(text) => setAmount(text)} 
 *   keyboardType="decimal-pad" 
 * />
 * 
 * // Styled input
 * <Input 
 *   className="border-primary" 
 *   placeholder="Search..." 
 * />
 * 
 * // Disabled input
 * <Input disabled value="Read only value" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholderClassName, placeholder, onChange, onChangeText, keyboardType, ...props }, ref) => {
    // Handle both web and React Native style change events
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