/**
 * @file dropdown-menu.tsx
 * @description An accessible dropdown menu component based on Radix UI
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2024-07-23
 */

"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Root component that manages dropdown state
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#root}
 */
const DropdownMenu = DropdownMenuPrimitive.Root

/**
 * Trigger button that opens the dropdown menu
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#trigger}
 */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

/**
 * Group component for organizing menu items
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#group}
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group

/**
 * Portal component for rendering the dropdown outside the DOM hierarchy
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#portal}
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

/**
 * Sub-menu component for nested dropdown menus
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#sub}
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub

/**
 * Radio group component for mutually exclusive options
 * 
 * @component
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#radiogroup}
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

/**
 * Trigger component for sub-menus
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.inset] - Whether to inset the trigger
 * @param {React.ReactNode} props.children - Content to display in the trigger
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>>} ref - Reference to the trigger element
 * @returns {JSX.Element} - Rendered DropdownMenuSubTrigger component
 * 
 * @example
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#subtrigger}
 */
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

/**
 * Content component for sub-menus
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Content to display in the sub-menu
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.SubContent>>} ref - Reference to the content element
 * @returns {JSX.Element} - Rendered DropdownMenuSubContent component
 * 
 * @example
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#subcontent}
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

/**
 * Content component for the main dropdown menu
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.sideOffset=4] - Offset from the trigger
 * @param {React.ReactNode} props.children - Content to display in the dropdown
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Content>>} ref - Reference to the content element
 * @returns {JSX.Element} - Rendered DropdownMenuContent component
 * 
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Item 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#content}
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

/**
 * Item component for dropdown menu options
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.inset] - Whether to inset the item
 * @param {React.ReactNode} props.children - Content to display in the item
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Item>>} ref - Reference to the item element
 * @returns {JSX.Element} - Rendered DropdownMenuItem component
 * 
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 *   <DropdownMenuItem disabled>Account (Unavailable)</DropdownMenuItem>
 * </DropdownMenuContent>
 * 
 * // With icon
 * <DropdownMenuItem>
 *   <UserIcon />
 *   Profile
 * </DropdownMenuItem>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#item}
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

/**
 * Checkbox item component for toggleable options
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.checked] - Whether the checkbox is checked
 * @param {React.ReactNode} props.children - Content to display in the item
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>>} ref - Reference to the checkbox item element
 * @returns {JSX.Element} - Rendered DropdownMenuCheckboxItem component
 * 
 * @example
 * ```tsx
 * const [showStatusBar, setShowStatusBar] = React.useState(true);
 * 
 * <DropdownMenuContent>
 *   <DropdownMenuCheckboxItem
 *     checked={showStatusBar}
 *     onCheckedChange={setShowStatusBar}
 *   >
 *     Show Status Bar
 *   </DropdownMenuCheckboxItem>
 * </DropdownMenuContent>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#checkboxitem}
 */
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

/**
 * Radio item component for mutually exclusive options
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} props.value - Value of the radio item
 * @param {React.ReactNode} props.children - Content to display in the item
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>>} ref - Reference to the radio item element
 * @returns {JSX.Element} - Rendered DropdownMenuRadioItem component
 * 
 * @example
 * ```tsx
 * const [position, setPosition] = React.useState("top");
 * 
 * <DropdownMenuContent>
 *   <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
 *     <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
 *     <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
 *     <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
 *   </DropdownMenuRadioGroup>
 * </DropdownMenuContent>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#radioitem}
 */
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

/**
 * Label component for dropdown sections
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.inset] - Whether to inset the label
 * @param {React.ReactNode} props.children - Content to display in the label
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Label>>} ref - Reference to the label element
 * @returns {JSX.Element} - Rendered DropdownMenuLabel component
 * 
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuLabel>My Account</DropdownMenuLabel>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuLabel>Actions</DropdownMenuLabel>
 *   <DropdownMenuItem>New Project</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#label}
 */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

/**
 * Separator component for visually dividing dropdown sections
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Separator>>} ref - Reference to the separator element
 * @returns {JSX.Element} - Rendered DropdownMenuSeparator component
 * 
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem>Logout</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/primitives/docs/components/dropdown-menu#separator}
 */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

/**
 * Shortcut component for displaying keyboard shortcuts in menu items
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLSpanElement>} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Content to display in the shortcut
 * @returns {JSX.Element} - Rendered DropdownMenuShortcut component
 * 
 * @example
 * ```tsx
 * <DropdownMenuItem>
 *   New File
 *   <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * 
 * <DropdownMenuItem>
 *   Save
 *   <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 */
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

/**
 * Complete example of the DropdownMenu component usage:
 * 
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { 
 *   DropdownMenu,
 *   DropdownMenuTrigger,
 *   DropdownMenuContent,
 *   DropdownMenuLabel,
 *   DropdownMenuItem,
 *   DropdownMenuSeparator,
 *   DropdownMenuShortcut,
 *   DropdownMenuGroup,
 *   DropdownMenuCheckboxItem,
 *   DropdownMenuRadioGroup,
 *   DropdownMenuRadioItem,
 *   DropdownMenuSub,
 *   DropdownMenuSubTrigger,
 *   DropdownMenuSubContent
 * } from './components/ui/dropdown-menu';
 * import { Button } from './components/ui/button';
 * 
 * function UserMenu() {
 *   const [showStatusBar, setShowStatusBar] = useState(true);
 *   const [position, setPosition] = useState("bottom");
 *   
 *   return (
 *     <DropdownMenu>
 *       <DropdownMenuTrigger asChild>
 *         <Button variant="outline">Open Menu</Button>
 *       </DropdownMenuTrigger>
 *       <DropdownMenuContent className="w-56">
 *         <DropdownMenuLabel>My Account</DropdownMenuLabel>
 *         <DropdownMenuSeparator />
 *         <DropdownMenuGroup>
 *           <DropdownMenuItem>
 *             Profile
 *             <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
 *           </DropdownMenuItem>
 *           <DropdownMenuItem>
 *             Settings
 *             <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
 *           </DropdownMenuItem>
 *         </DropdownMenuGroup>
 *         <DropdownMenuSeparator />
 *         <DropdownMenuGroup>
 *           <DropdownMenuLabel>Appearance</DropdownMenuLabel>
 *           <DropdownMenuCheckboxItem
 *             checked={showStatusBar}
 *             onCheckedChange={setShowStatusBar}
 *           >
 *             Status Bar
 *           </DropdownMenuCheckboxItem>
 *         </DropdownMenuGroup>
 *         <DropdownMenuSeparator />
 *         <DropdownMenuGroup>
 *           <DropdownMenuLabel>Position</DropdownMenuLabel>
 *           <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
 *             <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
 *             <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
 *             <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
 *           </DropdownMenuRadioGroup>
 *         </DropdownMenuGroup>
 *         <DropdownMenuSeparator />
 *         <DropdownMenuGroup>
 *           <DropdownMenuSub>
 *             <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *             <DropdownMenuSubContent>
 *               <DropdownMenuItem>Import</DropdownMenuItem>
 *               <DropdownMenuItem>Export</DropdownMenuItem>
 *             </DropdownMenuSubContent>
 *           </DropdownMenuSub>
 *         </DropdownMenuGroup>
 *         <DropdownMenuSeparator />
 *         <DropdownMenuItem className="text-red-500">
 *           Logout
 *           <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
 *         </DropdownMenuItem>
 *       </DropdownMenuContent>
 *     </DropdownMenu>
 *   );
 * }
 * ```
 */
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
