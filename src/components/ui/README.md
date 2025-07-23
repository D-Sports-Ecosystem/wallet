# UI Component State Management and Lifecycle

This document provides an overview of state management patterns and component lifecycle considerations for the UI components in the @d-sports/wallet project.

## Table of Contents

1. [Component State Management](#component-state-management)
2. [Component Lifecycle](#component-lifecycle)
3. [Rendering Patterns](#rendering-patterns)
4. [Performance Optimizations](#performance-optimizations)

## Component State Management

### State Management Patterns

The UI components in this project use several state management patterns:

#### 1. Local Component State

Simple components use React's `useState` hook for local state management:

```tsx
function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}
```

#### 2. Context-Based State

Components that need to share state with their children use React Context:

```tsx
// In tabs.tsx
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

const Tabs = ({ value, onValueChange, children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      {children}
    </TabsContext.Provider>
  );
};

// In child components
const TabsTrigger = ({ value, ...props }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs');
  }
  // Use context values
};
```

#### 3. Controlled vs. Uncontrolled Components

Components support both controlled and uncontrolled patterns:

**Controlled** (state managed by parent):
```tsx
function ControlledInput() {
  const [value, setValue] = React.useState('');
  
  return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

**Uncontrolled** (state managed internally):
```tsx
function UncontrolledInput() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    const value = inputRef.current?.value;
    // Use value
  };
  
  return <Input ref={inputRef} />;
}
```

### State Transitions

Components handle state transitions in several ways:

1. **Direct State Updates**: Simple state changes use direct updates via state setters
2. **Derived State**: Some components compute derived state from props and context
3. **Effect-Based Updates**: Side effects that update state are managed with `useEffect`

Example of derived state:
```tsx
function TabContent({ value, ...props }) {
  const context = React.useContext(TabsContext);
  const isSelected = context?.value === value;
  
  // Render based on derived state
  if (!isSelected) return null;
  
  return <div {...props} />;
}
```

## Component Lifecycle

### Mounting and Unmounting

Components handle mounting and unmounting with cleanup functions in `useEffect`:

```tsx
function AutoFocusInput() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    // On mount
    const input = inputRef.current;
    input?.focus();
    
    // On unmount
    return () => {
      input?.blur();
    };
  }, []);
  
  return <Input ref={inputRef} />;
}
```

### Side Effects

Components manage side effects with `useEffect` and appropriate dependencies:

```tsx
function TokenDisplay({ tokenId }) {
  const [tokenData, setTokenData] = React.useState(null);
  
  React.useEffect(() => {
    // Fetch token data when tokenId changes
    const fetchData = async () => {
      const data = await fetchTokenData(tokenId);
      setTokenData(data);
    };
    
    fetchData();
    
    // Cleanup on unmount or when tokenId changes
    return () => {
      // Cancel any pending requests
    };
  }, [tokenId]);
  
  return <div>{tokenData?.name}</div>;
}
```

### Event Handling

Components use event handlers to manage user interactions:

```tsx
function ToggleButton() {
  const [isActive, setIsActive] = React.useState(false);
  
  const handleClick = React.useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);
  
  return (
    <Button 
      variant={isActive ? 'primary' : 'outline'}
      onClick={handleClick}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Button>
  );
}
```

## Rendering Patterns

### Conditional Rendering

Components use conditional rendering to show or hide content:

```tsx
function ConditionalContent({ isVisible, children }) {
  if (!isVisible) return null;
  
  return <div>{children}</div>;
}
```

### Render Props

Some components use render props for flexible rendering:

```tsx
function DataFetcher({ url, render }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);
  
  return render({ data, loading });
}

// Usage
<DataFetcher 
  url="/api/tokens" 
  render={({ data, loading }) => (
    loading ? <Spinner /> : <TokenList tokens={data} />
  )}
/>
```

### Component Composition

Components are designed for composition using the children prop:

```tsx
function Card({ header, footer, children }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Usage
<Card
  header={<h2>Title</h2>}
  footer={<Button>Action</Button>}
>
  Content goes here
</Card>
```

## Performance Optimizations

### Memoization

Components use memoization to prevent unnecessary re-renders:

```tsx
const MemoizedComponent = React.memo(function ExpensiveComponent({ value }) {
  // Expensive rendering logic
  return <div>{value}</div>;
});

// Usage
function Parent() {
  const [count, setCount] = React.useState(0);
  const value = React.useMemo(() => computeExpensiveValue(), []);
  
  return (
    <div>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
      <MemoizedComponent value={value} />
    </div>
  );
}
```

### Callback Memoization

Event handlers are memoized with `useCallback`:

```tsx
function SearchForm({ onSearch }) {
  const [query, setQuery] = React.useState('');
  
  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    onSearch(query);
  }, [query, onSearch]);
  
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
```

### Lazy Loading

Components that are not immediately needed are lazy loaded:

```tsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <LazyComponent />
    </React.Suspense>
  );
}
```

### Virtualization

For long lists, virtualization is used to render only visible items:

```tsx
function VirtualizedList({ items }) {
  return (
    <VirtualList
      height={500}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </VirtualList>
  );
}
```

### Platform-Specific Optimizations

Components use platform detection to optimize rendering for web and React Native:

```tsx
function OptimizedComponent({ children }) {
  const { View } = getPlatformComponents();
  
  if (isReactNative()) {
    return (
      <View className="native-optimized">
        {children}
      </View>
    );
  }
  
  return (
    <div className="web-optimized">
      {children}
    </div>
  );
}
```

This document provides a comprehensive overview of the state management patterns, component lifecycle considerations, rendering patterns, and performance optimizations used in the UI components of the @d-sports/wallet project.