import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Import types only to avoid direct dependency on react-native
import type { PressableProps } from 'react-native';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary web:hover:bg-primary/90 active:bg-primary/90',
        destructive: 'bg-destructive web:hover:bg-destructive/90 active:bg-destructive/90',
        outline:
          'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent active:text-accent-foreground',
        secondary: 'bg-secondary web:hover:bg-secondary/80 active:bg-secondary/80',
        ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent active:text-accent-foreground',
        link: 'web:underline-offset-4 web:hover:underline web:focus:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  onPress?: () => void;
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Using a div for web rendering
    return (
      <div
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };