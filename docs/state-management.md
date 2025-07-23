# Component State Management

This document provides detailed information about state management patterns used in the UI components of the @d-sports/wallet project.

## State Management Approaches

The UI components in this project use several state management approaches depending on the complexity and requirements of each component:

### 1. Local Component State

Simple components use React's `useState` hook for local state management. This is the most common approach for components that don't need to share state with other components.

#### Example: Button with Loading State

```tsx
function LoadingButton({ onClick, children }) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleClick} 
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </Button>
  );
}
```

### 2. Context-Based State

Components that need to share state with their children use React Context. This is common for compound components like Tabs, DropdownMenu, and other components that have multiple related subcomponents.

#### Example: Tabs Component

```tsx
// Context definition
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

// Provider component
const Tabs = ({ value, onValueChange, children }) => {
  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange]
  );
  
  return (
    <TabsContext.Provider value={contextValue}>
      {children}
    </TabsContext.Provider>
  );
};

// Consumer component
const TabsTrigger = ({ value, children, ...props }) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;
  
  return (
    <button
      data-state={isSelected ? 'active' : 'inactive'}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};
```

### 3. Controlled vs. Uncontrolled Components

Components support both controlled and uncontrolled patterns to accommodate different use cases:

#### Controlled Component (state managed by parent)

```tsx
function ControlledInput() {
  const [value, setValue] = React.useState('');
  
  return (
    <div>
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      <p>Current value: {value}</p>
    </div>
  );
}
```

#### Uncontrolled Component (state managed internally)

```tsx
function UncontrolledInput() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    const value = inputRef.current?.value;
    console.log('Submitted value:', value);
  };
  
  return (
    <div>
      <Input ref={inputRef} defaultValue="Default value" />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
```

### 4. Compound Component Pattern

Complex UI components use the compound component pattern to create a flexible and intuitive API:

```tsx
// Usage example of compound components
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

This pattern allows for flexible composition while maintaining a clear relationship between components.

## State Transitions

Components handle state transitions in several ways:

### 1. Direct State Updates

Simple state changes use direct updates via state setters:

```tsx
function Counter() {
  const [count, setCount] = React.useState(0);
  
  // Direct state update
  const increment = () => setCount(count + 1);
  
  // Functional update (safer for consecutive updates)
  const incrementSafe = () => setCount(prev => prev + 1);
  
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={increment}>Increment</Button>
      <Button onClick={incrementSafe}>Increment (Safe)</Button>
    </div>
  );
}
```

### 2. Derived State

Some components compute derived state from props and context:

```tsx
function TabContent({ value, ...props }) {
  const context = React.useContext(TabsContext);
  
  // Derived state based on context and props
  const isSelected = context?.value === value;
  
  // Render based on derived state
  if (!isSelected) return null;
  
  return <div {...props} />;
}
```

### 3. Effect-Based Updates

Side effects that update state are managed with `useEffect`:

```tsx
function AutosaveInput({ onSave }) {
  const [value, setValue] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Effect to handle autosave
  React.useEffect(() => {
    if (!value) return;
    
    const timeoutId = setTimeout(() => {
      setIsSaving(true);
      onSave(value)
        .finally(() => setIsSaving(false));
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [value, onSave]);
  
  return (
    <div>
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      {isSaving && <Spinner size="sm" />}
    </div>
  );
}
```

## State Management Best Practices

The UI components follow these best practices for state management:

### 1. Single Source of Truth

Each piece of state has a single source of truth, whether it's in a component, context, or external store.

### 2. Minimize State

Components only track the minimum amount of state needed, deriving other values when possible.

### 3. Lift State Up

When multiple components need to share state, the state is lifted to their closest common ancestor.

### 4. Use Immutable Updates

State updates always create new objects/arrays rather than mutating existing ones:

```tsx
// Good: Immutable update
setItems([...items, newItem]);

// Bad: Mutation
items.push(newItem); // Don't do this!
```

### 5. Batch Related State

Related state is grouped together using objects or custom hooks:

```tsx
// Grouping related state
const [form, setForm] = React.useState({
  name: '',
  email: '',
  password: ''
});

// Update grouped state
const updateField = (field, value) => {
  setForm(prev => ({
    ...prev,
    [field]: value
  }));
};
```

### 6. Use Reducers for Complex State

For complex state logic, `useReducer` is preferred over multiple `useState` calls:

```tsx
const initialState = { count: 0, isActive: false };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'toggle':
      return { ...state, isActive: !state.isActive };
    default:
      throw new Error();
  }
}

function ComplexCounter() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Status: {state.isActive ? 'Active' : 'Inactive'}</p>
      <Button onClick={() => dispatch({ type: 'increment' })}>+</Button>
      <Button onClick={() => dispatch({ type: 'decrement' })}>-</Button>
      <Button onClick={() => dispatch({ type: 'toggle' })}>Toggle</Button>
    </div>
  );
}
```

## Platform-Specific State Considerations

The UI components handle state differently based on the platform (web vs. React Native):

```tsx
function PlatformAwareInput({ value, onChange }) {
  // Handle platform-specific state updates
  const handleChange = (e) => {
    if (isReactNative()) {
      // React Native provides the value directly
      onChange(e);
    } else {
      // Web provides an event object
      onChange(e.target.value);
    }
  };
  
  return <Input value={value} onChange={handleChange} />;
}
```

This document provides a comprehensive overview of the state management patterns used in the UI components of the @d-sports/wallet project.