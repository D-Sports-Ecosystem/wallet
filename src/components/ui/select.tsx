/**
 * @file select.tsx
 * @description An accessible dropdown select component based on Radix UI
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Root Select component that manages the select state
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#root}
 */
const Select = SelectPrimitive.Root

/**
 * Group component for organizing select items
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#group}
 */
const SelectGroup = SelectPrimitive.Group

/**
 * Component that displays the selected value
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#value}
 */
const SelectValue = SelectPrimitive.Value

/**
 * Trigger button that opens the select dropdown
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Content to display in the trigger
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>>} ref - Reference to the trigger element
 * @returns {JSX.Element} - Rendered SelectTrigger component
 * 
 * @example
 * ```tsx
 * <Select>
 *   <SelectTrigger className="w-[200px]">
 *     <SelectValue placeholder="Select a fruit" />
 *   </SelectTrigger>
 * </Select>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#trigger}
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * Button for scrolling up in the select dropdown
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>} ref - Reference to the button element
 * @returns {JSX.Element} - Rendered SelectScrollUpButton component
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#scrollupbutton}
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

/**
 * Button for scrolling down in the select dropdown
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>} ref - Reference to the button element
 * @returns {JSX.Element} - Rendered SelectScrollDownButton component
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#scrolldownbutton}
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

/**
 * Content component that contains the select dropdown items
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Content to display in the dropdown
 * @param {"item" | "popper"} [props.position="popper"] - Position strategy for the dropdown
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Content>>} ref - Reference to the content element
 * @returns {JSX.Element} - Rendered SelectContent component
 * 
 * @example
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select a fruit" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="apple">Apple</SelectItem>
 *     <SelectItem value="banana">Banana</SelectItem>
 *     <SelectItem value="orange">Orange</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#content}
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * Label component for select groups
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Label>>} ref - Reference to the label element
 * @returns {JSX.Element} - Rendered SelectLabel component
 * 
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectGroup>
 *     <SelectLabel>Fruits</SelectLabel>
 *     <SelectItem value="apple">Apple</SelectItem>
 *     <SelectItem value="banana">Banana</SelectItem>
 *   </SelectGroup>
 * </SelectContent>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#label}
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * Selectable item component for the dropdown
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} props.value - Value of the item when selected
 * @param {boolean} [props.disabled] - Whether the item is disabled
 * @param {React.ReactNode} props.children - Content to display in the item
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Item>>} ref - Reference to the item element
 * @returns {JSX.Element} - Rendered SelectItem component
 * 
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectItem value="apple">Apple</SelectItem>
 *   <SelectItem value="banana">Banana</SelectItem>
 *   <SelectItem value="orange" disabled>Orange (Out of Stock)</SelectItem>
 * </SelectContent>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#item}
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * Separator component for visually dividing select items
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>>} ref - Reference to the separator element
 * @returns {JSX.Element} - Rendered SelectSeparator component
 * 
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectGroup>
 *     <SelectLabel>Fruits</SelectLabel>
 *     <SelectItem value="apple">Apple</SelectItem>
 *     <SelectItem value="banana">Banana</SelectItem>
 *   </SelectGroup>
 *   <SelectSeparator />
 *   <SelectGroup>
 *     <SelectLabel>Vegetables</SelectLabel>
 *     <SelectItem value="carrot">Carrot</SelectItem>
 *     <SelectItem value="potato">Potato</SelectItem>
 *   </SelectGroup>
 * </SelectContent>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/select#separator}
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

/**
 * Complete example of the Select component usage
 * 
 * @example
 * ```tsx
 * <Select onValueChange={(value) => console.log(value)}>
 *   <SelectTrigger className="w-[200px]">
 *     <SelectValue placeholder="Select a fruit" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectGroup>
 *       <SelectLabel>Fruits</SelectLabel>
 *       <SelectItem value="apple">Apple</SelectItem>
 *       <SelectItem value="banana">Banana</SelectItem>
 *       <SelectItem value="blueberry">Blueberry</SelectItem>
 *     </SelectGroup>
 *     <SelectSeparator />
 *     <SelectGroup>
 *       <SelectLabel>Vegetables</SelectLabel>
 *       <SelectItem value="carrot">Carrot</SelectItem>
 *       <SelectItem value="potato">Potato</SelectItem>
 *       <SelectItem value="broccoli" disabled>Broccoli</SelectItem>
 *     </SelectGroup>
 *   </SelectContent>
 * </Select>
 * ```
 */
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}