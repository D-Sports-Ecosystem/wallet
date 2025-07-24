/**
 * @file button.tsx
 * @description A customizable button component with various styles and sizes
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "./pressable";
import { cn } from "../../../src/lib/utils";
import { TextClassContext } from "./text";

/**
 * Button style variants using class-variance-authority
 *
 * @type {import('class-variance-authority').VariantProps}
 * @property {Object} variants - Style variants for the button
 * @property {Object} variants.variant - Visual style variants
 * @property {string} variants.variant.default - Primary button style
 * @property {string} variants.variant.destructive - Destructive action button style
 * @property {string} variants.variant.outline - Outlined button style
 * @property {string} variants.variant.secondary - Secondary button style
 * @property {string} variants.variant.ghost - Ghost button style with no background
 * @property {string} variants.variant.link - Link-styled button
 * @property {Object} variants.size - Size variants for the button
 * @property {string} variants.size.default - Default button size
 * @property {string} variants.size.sm - Small button size
 * @property {string} variants.size.lg - Large button size
 * @property {string} variants.size.icon - Icon button size (square)
 */
const buttonVariants = cva(
  "group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary web:hover:opacity-90 active:opacity-90",
        destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
        outline:
          "border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        secondary: "bg-secondary web:hover:opacity-80 active:opacity-80",
        ghost:
          "web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        link: "web:underline-offset-4 web:hover:underline web:focus:underline",
      },
      size: {
        default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 native:h-14",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Text style variants for button content using class-variance-authority
 *
 * @type {import('class-variance-authority').VariantProps}
 * @property {Object} variants - Style variants for button text
 * @property {Object} variants.variant - Text style variants matching button variants
 * @property {string} variants.variant.default - Default text style for primary buttons
 * @property {string} variants.variant.destructive - Text style for destructive buttons
 * @property {string} variants.variant.outline - Text style for outlined buttons
 * @property {string} variants.variant.secondary - Text style for secondary buttons
 * @property {string} variants.variant.ghost - Text style for ghost buttons
 * @property {string} variants.variant.link - Text style for link buttons
 * @property {Object} variants.size - Size variants for button text
 * @property {string} variants.size.default - Default text size
 * @property {string} variants.size.sm - Small text size
 * @property {string} variants.size.lg - Large text size
 * @property {string} variants.size.icon - Icon text size
 */
const buttonTextVariants = cva(
  "web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-destructive-foreground",
        outline: "group-active:text-accent-foreground",
        secondary:
          "text-secondary-foreground group-active:text-secondary-foreground",
        ghost: "group-active:text-accent-foreground",
        link: "text-primary group-active:underline",
      },
      size: {
        default: "",
        sm: "",
        lg: "native:text-lg",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Props for the Button component
 *
 * @interface ButtonProps
 * @extends {React.ComponentProps<typeof Pressable>} - Inherits all Pressable props
 * @extends {VariantProps<typeof buttonVariants>} - Adds variant and size props
 */
type ButtonProps = React.ComponentPropsWithRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

/**
 * Button component with customizable styles and sizes
 *
 * @component
 * @param {ButtonProps} props - Component props
 * @param {React.RefObject<typeof Pressable>} props.ref - Reference to the button element
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size variant
 * @returns {JSX.Element} - Rendered Button component
 *
 * @example
 * ```tsx
 * // Default button
 * <Button>Click me</Button>
 *
 * // Primary button with custom class
 * <Button className="my-4">Submit</Button>
 *
 * // Destructive button
 * <Button variant="destructive">Delete</Button>
 *
 * // Outline button with small size
 * <Button variant="outline" size="sm">Cancel</Button>
 *
 * // Large secondary button
 * <Button variant="secondary" size="lg">Continue</Button>
 *
 * // Ghost button
 * <Button variant="ghost">More options</Button>
 *
 * // Link button
 * <Button variant="link">Learn more</Button>
 *
 * // Icon button
 * <Button variant="ghost" size="icon"><Icon /></Button>
 *
 * // Disabled button
 * <Button disabled>Not available</Button>
 * ```
 */
function Button({ ref, className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider
      value={buttonTextVariants({
        variant,
        size,
        className: "web:pointer-events-none",
      })}
    >
      <Pressable
        className={cn(
          props.disabled && "opacity-50 web:pointer-events-none",
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
