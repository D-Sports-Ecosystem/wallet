# Rendering Patterns and Optimizations

This document provides detailed information about rendering patterns and performance optimizations used in the UI components of the @d-sports/wallet project.

## Rendering Patterns

### 1. Conditional Rendering

Components use conditional rendering to show or hide content based on props or state:

```tsx
function ConditionalExample({ isVisible, children }) {
  // Early return pattern
  if (!isVisible) return null;
  
  return <div>{children}</div>;
}

function ConditionalExample2({ status, children }) {
  return (
    <div>
      {/* Ternary operator pattern */}
      {status === 'loading' ? (
        <Spinner />
      ) : status === 'error' ? (
        <ErrorMessage />
      ) : (
        children
      )}
      
      {/* Logical AND pattern */}
      {status === 'success' && <SuccessIcon />}
    </div>
  );
}
```

### 2. Render Props

Components use render props for flexible rendering:

```tsx
function DataFetcher({ url, render }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    setLoading(true);
    
    fetch(url)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  // Pass state to render prop function
  return render({ data, loading, error });
}

// Usage
function App() {
  return (
    <DataFetcher 
      url="/api/tokens" 
      render={({ data, loading, error }) => (
        <div>
          {loading && <Spinner />}
          {error && <ErrorMessage error={error} />}
          {data && <TokenList tokens={data} />}
        </div>
      )}
    />
  );
}
```

### 3. Component Composition

Components are designed for composition using the children prop and specialized subcomponents:

```tsx
// Card component with subcomponents
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

// Tabs component with subcomponents
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings...</TabsContent>
  <TabsContent value="password">Password settings...</TabsContent>
</Tabs>
```

### 4. Higher-Order Components (HOCs)

For cross-cutting concerns, HOCs are used to enhance components:

```tsx
// HOC that adds loading state
function withLoading(Component) {
  return function WithLoading(props) {
    const [isLoading, setIsLoading] = React.useState(false);
    
    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);
    
    return (
      <div>
        {isLoading && <Spinner />}
        <Component 
          {...props} 
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
        />
      </div>
    );
  };
}

// Usage
const ButtonWithLoading = withLoading(Button);

function App() {
  const handleClick = async (startLoading, stopLoading) => {
    startLoading();
    await someAsyncOperation();
    stopLoading();
  };
  
  return (
    <ButtonWithLoading 
      onClick={({ startLoading, stopLoading }) => 
        handleClick(startLoading, stopLoading)
      }
    >
      Submit
    </ButtonWithLoading>
  );
}
```

### 5. Custom Hooks

For reusable logic, custom hooks are used:

```tsx
// Custom hook for form handling
function useForm(initialValues) {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset
  };
}

// Usage
function LoginForm() {
  const { values, handleChange, handleBlur } = useForm({
    email: '',
    password: ''
  });
  
  return (
    <form>
      <Input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

## Performance Optimizations

### 1. Memoization with React.memo

Components use `React.memo` to prevent unnecessary re-renders:

```tsx
// Memoized component that only re-renders when props change
const MemoizedComponent = React.memo(function ExpensiveComponent({ value }) {
  console.log('Rendering ExpensiveComponent');
  
  // Expensive rendering logic
  return <div>{value}</div>;
});

// Usage
function Parent() {
  const [count, setCount] = React.useState(0);
  const [value] = React.useState('Static Value');
  
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
      {/* This won't re-render when count changes */}
      <MemoizedComponent value={value} />
    </div>
  );
}
```

### 2. useMemo for Expensive Calculations

For expensive calculations, `useMemo` is used to cache results:

```tsx
function DataProcessor({ data }) {
  // Memoize expensive calculation
  const processedData = React.useMemo(() => {
    console.log('Processing data...');
    return data.map(item => {
      // Expensive processing
      return transformItem(item);
    });
  }, [data]); // Only recalculate when data changes
  
  return (
    <div>
      {processedData.map(item => (
        <DataItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### 3. useCallback for Event Handlers

Event handlers are memoized with `useCallback` to prevent unnecessary re-renders of child components:

```tsx
function ParentComponent() {
  const [count, setCount] = React.useState(0);
  
  // Memoize callback to prevent ChildComponent from re-rendering
  const handleClick = React.useCallback(() => {
    console.log('Button clicked');
  }, []); // No dependencies means this function never changes
  
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

// Child component that only re-renders when props change
const ChildComponent = React.memo(function ChildComponent({ onClick }) {
  console.log('Rendering ChildComponent');
  
  return <Button onClick={onClick}>Child Button</Button>;
});
```

### 4. Lazy Loading

Components that are not immediately needed are lazy loaded:

```tsx
// Lazy load a component
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  const [showComponent, setShowComponent] = React.useState(false);
  
  return (
    <div>
      <Button onClick={() => setShowComponent(true)}>
        Show Component
      </Button>
      
      {showComponent && (
        <React.Suspense fallback={<Spinner />}>
          <LazyComponent />
        </React.Suspense>
      )}
    </div>
  );
}
```

### 5. Virtualization

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

### 6. Debouncing and Throttling

For frequent events like input changes or scrolling, debouncing and throttling are used:

```tsx
function SearchInput({ onSearch }) {
  const [query, setQuery] = React.useState('');
  
  // Debounce search to avoid excessive API calls
  const debouncedSearch = React.useCallback(
    debounce((value) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return (
    <Input
      value={query}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
}

// Debounce utility function
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

### 7. Code Splitting

The application uses code splitting to reduce the initial bundle size:

```tsx
// Split code by route
const HomePage = React.lazy(() => import('./pages/Home'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Router>
      <React.Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}
```

### 8. Platform-Specific Optimizations

Components use platform detection to optimize rendering for web and React Native:

```tsx
function OptimizedComponent({ children }) {
  const { View } = getPlatformComponents();
  
  if (isReactNative()) {
    // React Native specific optimizations
    return (
      <View className="native-optimized">
        {children}
      </View>
    );
  }
  
  // Web specific optimizations
  return (
    <div className="web-optimized">
      {children}
    </div>
  );
}
```

This document provides a comprehensive overview of the rendering patterns and performance optimizations used in the UI components of the @d-sports/wallet project.