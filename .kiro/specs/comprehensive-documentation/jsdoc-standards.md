# JSDoc Standards for @d-sports/wallet

This document outlines the JSDoc standards to be followed across the @d-sports/wallet project. These standards ensure consistent documentation across all files and components.

## General Guidelines

1. **All files must have a file header** with description, module, author, version, and creation date
2. **All exported functions, classes, interfaces, and types must be documented** with JSDoc comments
3. **All parameters and return values must be documented** with types and descriptions
4. **All public methods and properties must be documented** with descriptions and examples where appropriate
5. **Complex logic must have inline comments** explaining the approach and reasoning
6. **Examples must be provided** for key functions, components, and classes

## File Headers

Every file should start with a header comment:

```typescript
/**
 * @file filename.ts
 * @description Brief description of the file's purpose
 * @module module/submodule
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since YYYY-MM-DD
 */
```

## Function Documentation

Functions should be documented with:

```typescript
/**
 * Function description
 * 
 * @function functionName (optional if the function name is clear)
 * @param {type} paramName - Parameter description
 * @returns {type} Return value description
 * @throws {ErrorType} Description of when this error is thrown
 * 
 * @example
 * ```typescript
 * // Example usage
 * const result = functionName(param);
 * ```
 */
```

## Class Documentation

Classes should be documented with:

```typescript
/**
 * Class description
 * 
 * @class
 * @implements {InterfaceName} (if applicable)
 * @extends {ParentClass} (if applicable)
 * 
 * @example
 * ```typescript
 * // Example usage
 * const instance = new ClassName(params);
 * ```
 */
```

## Interface and Type Documentation

Interfaces and types should be documented with:

```typescript
/**
 * Interface description
 * 
 * @interface
 * @property {type} propertyName - Property description
 */
```

## Component Documentation

React components should be documented with:

```typescript
/**
 * Component description
 * 
 * @component
 * @param {Object} props - Component props
 * @param {type} props.propName - Prop description
 * @returns {JSX.Element} Component description
 * 
 * @example
 * ```tsx
 * // Example usage
 * <ComponentName propName={value} />
 * ```
 */
```

## Property Documentation

Properties should be documented with:

```typescript
/**
 * Property description
 * 
 * @type {type}
 * @default defaultValue (if applicable)
 */
```

## Method Documentation

Methods should be documented with:

```typescript
/**
 * Method description
 * 
 * @method
 * @param {type} paramName - Parameter description
 * @returns {type} Return value description
 * @throws {ErrorType} Description of when this error is thrown
 * 
 * @example
 * ```typescript
 * // Example usage
 * const result = instance.methodName(param);
 * ```
 */
```

## Inline Comments

Complex logic should have inline comments:

```typescript
// Calculate the weighted average based on token values
const weightedAverage = tokens.reduce((acc, token) => {
  // Apply weight factor based on token type
  const weight = token.type === 'primary' ? 1.5 : 1;
  
  // Accumulate weighted value
  return acc + (token.value * weight);
}, 0) / tokens.length;
```

## Documentation Tags Reference

| Tag | Description | Example |
|-----|-------------|---------|
| `@file` | Describes the file | `@file wallet.ts` |
| `@description` | Describes the purpose | `@description Manages wallet state` |
| `@module` | Identifies the module | `@module core/wallet` |
| `@author` | Identifies the author | `@author D-Sports Engineering Team` |
| `@version` | Identifies the version | `@version 1.0.0` |
| `@since` | Identifies creation date | `@since 2025-07-23` |
| `@param` | Describes a parameter | `@param {string} id - Wallet identifier` |
| `@returns` | Describes return value | `@returns {boolean} Success status` |
| `@throws` | Describes exceptions | `@throws {Error} If wallet not found` |
| `@example` | Provides usage example | `@example const wallet = new Wallet()` |
| `@type` | Describes a type | `@type {number}` |
| `@property` | Describes a property | `@property {string} id - Wallet identifier` |
| `@default` | Describes default value | `@default 'primary'` |
| `@deprecated` | Marks as deprecated | `@deprecated Use newMethod instead` |
| `@see` | References related item | `@see TokenService` |
| `@todo` | Indicates planned work | `@todo Implement error handling` |
| `@private` | Marks as private | `@private` |
| `@protected` | Marks as protected | `@protected` |
| `@public` | Marks as public | `@public` |
| `@readonly` | Marks as read-only | `@readonly` |
| `@async` | Marks as asynchronous | `@async` |
| `@override` | Marks as override | `@override` |
| `@implements` | Identifies interface | `@implements {TokenProvider}` |
| `@extends` | Identifies parent | `@extends {BaseWallet}` |
| `@callback` | Describes callback | `@callback TokenCallback` |
| `@template` | Describes generic | `@template T` |

## Best Practices

1. **Be concise but complete** - Documentation should be thorough but not verbose
2. **Use consistent terminology** - Use the same terms throughout the documentation
3. **Update documentation when code changes** - Keep documentation in sync with code
4. **Document edge cases and errors** - Include information about potential errors and edge cases
5. **Use code examples** - Provide practical examples for complex functionality
6. **Document assumptions** - Note any assumptions made in the implementation
7. **Use proper grammar and spelling** - Ensure documentation is professionally written
8. **Document "why" not just "what"** - Explain reasoning behind complex decisions