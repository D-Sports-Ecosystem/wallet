/**
 * @file label.tsx
 * @description An accessible label component for form controls
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2024-07-23
 */

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Style variants for the Label component
 * 
 * @type {import('class-variance-authority').VariantProps}
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * Label component for form controls with accessibility features
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.htmlFor] - ID of the form control this label is associated with
 * @param {React.Ref<React.ElementRef<typeof LabelPrimitive.Root>>} ref - Reference to the label element
 * @returns {JSX.Element} - Rendered Label component
 * 
 * @example
 * ```tsx
 * // Basic label
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" />
 * 
 * // Label with custom styling
 * <Label htmlFor="password" className="text-primary">
 *   Password
 * </Label>
 * <Input id="password" type="password" />
 * 
 * // Label with required indicator
 * <div className="space-y-1">
 *   <Label htmlFor="username">
 *     Username <span className="text-destructive">*</span>
 *   </Label>
 *   <Input id="username" required />
 * </div>
 * ```
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
