# Component Lifecycle Management

This document provides detailed information about component lifecycle management in the UI components of the @d-sports/wallet project.

## Component Lifecycle Phases

React components go through several lifecycle phases, and our UI components handle these phases appropriately:

### 1. Mounting

When a component is first added to the DOM, it goes through the mounting phase:

```tsx
function MountingExample() {
  // State initialization
  const [data, setData] = React.useState(null);
  
  // Effect runs after first render (mounting)
  React.useEffect(() => {
    console.log('Component mounted');
    
    // Fetch initial data
    fetchData().then(result => setData(result));
    
    // Cleanup function runs when component unmounts
    return () => {
      console.log('Component will unmount');
      // Cleanup resources
    };
  }, []); // Empty dependency array means this runs only on mount/unmount
  
  return <div>{data ? <DataDisplay data={data} /> : <Spinner />}</div>;
}
```

### 2. Updating

When a component's props or state change, it goes through the updating phase:

```tsx
function UpdatingExample({ userId }) {
  const [user, setUser] = React.useState(null);
  
  // Effect runs when userId changes
  React.useEffect(() => {
    console.log('userId changed, fetching new user data');
    
    // Fetch user data when userId changes
    fetchUser(userId).then(userData => setUser(userData));
    
    // Cleanup previous requests if userId changes before completion
    return () => {
      console.log('Cleaning up before next update');
      // Cancel any pending requests
    };
  }, [userId]); // Dependency array with userId means this runs when userId changes
  
  return <UserProfile user={user} />;
}
```

### 3. Unmounting

When a component is removed from the DOM, it goes through the unmounting phase:

```tsx
function UnmountingExample() {
  React.useEffect(() => {
    // Setup event listeners, timers, etc.
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    // Cleanup function runs when component unmounts
    return () => {
      console.log('Cleaning up resources');
      clearInterval(timer);
    };
  }, []);
  
  return <div>Component with cleanup</div>;
}
```

## Side Effects Management

Components manage side effects with `useEffect` and appropriate dependencies:

### 1. Data Fetching

```tsx
function DataFetchingComponent({ resourceId }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    // Reset state when resourceId changes
    setLoading(true);
    setError(null);
    
    // Create an abort controller for cleanup
    const abortController = new AbortController();
    
    async function fetchData() {
      try {
        const response = await fetch(`/api/resources/${resourceId}`, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    // Cleanup function to abort fetch if component unmounts or resourceId changes
    return () => {
      abortController.abort();
    };
  }, [resourceId]);
  
  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return null;
  
  return <DataDisplay data={data} />;
}
```

### 2. DOM Manipulation

```tsx
function AutoFocusInput() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    // Focus the input when component mounts
    const input = inputRef.current;
    if (input) {
      input.focus();
    }
  }, []);
  
  return <Input ref={inputRef} />;
}
```

### 3. Event Subscriptions

```tsx
function EventListener({ eventName, onEvent }) {
  React.useEffect(() => {
    // Add event listener when component mounts
    const handleEvent = (event) => {
      onEvent(event);
    };
    
    window.addEventListener(eventName, handleEvent);
    
    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener(eventName, handleEvent);
    };
  }, [eventName, onEvent]);
  
  return null; // This component doesn't render anything
}
```

### 4. Animations

```tsx
function AnimatedComponent({ isVisible }) {
  const elementRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    if (isVisible) {
      // Start animation when isVisible becomes true
      const animation = element.animate(
        [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards'
        }
      );
      
      // Cleanup function to cancel animation if component unmounts
      return () => {
        animation.cancel();
      };
    } else {
      // Animate out when isVisible becomes false
      const animation = element.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(20px)' }
        ],
        {
          duration: 300,
          easing: 'ease-in',
          fill: 'forwards'
        }
      );
      
      return () => {
        animation.cancel();
      };
    }
  }, [isVisible]);
  
  return <div ref={elementRef}>{/* Content */}</div>;
}
```

## Lifecycle Optimization Techniques

### 1. Dependency Array Optimization

Components carefully manage effect dependencies to prevent unnecessary re-renders:

```tsx
function OptimizedComponent({ data, onDataChange }) {
  // Memoize callback to prevent unnecessary effect triggers
  const handleDataChange = React.useCallback(() => {
    onDataChange(data);
  }, [data, onDataChange]);
  
  React.useEffect(() => {
    // This effect only runs when handleDataChange changes
    console.log('Setting up data change listener');
    
    // Setup listener
    const unsubscribe = setupListener(handleDataChange);
    
    return () => {
      console.log('Cleaning up data change listener');
      unsubscribe();
    };
  }, [handleDataChange]); // Dependency is the memoized callback
  
  return <div>{/* Content */}</div>;
}
```

### 2. Ref-Based State Tracking

For values that need to be accessed in effects but shouldn't trigger re-renders:

```tsx
function RefBasedTracking() {
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef(count);
  
  // Update ref whenever count changes
  React.useEffect(() => {
    countRef.current = count;
  }, [count]);
  
  React.useEffect(() => {
    // This effect runs only once on mount
    const timer = setInterval(() => {
      // Access the latest count value without re-running the effect
      console.log('Current count:', countRef.current);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // Empty dependency array
  
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}
```

### 3. Layout Effects

For DOM measurements and synchronous updates before browser paint:

```tsx
function MeasureComponent() {
  const [width, setWidth] = React.useState(0);
  const elementRef = React.useRef<HTMLDivElement>(null);
  
  // useLayoutEffect runs synchronously after DOM mutations but before browser paint
  React.useLayoutEffect(() => {
    if (elementRef.current) {
      const newWidth = elementRef.current.getBoundingClientRect().width;
      setWidth(newWidth);
    }
  }, []);
  
  return (
    <div>
      <div ref={elementRef} style={{ width: '100%' }}>
        Measured element
      </div>
      <p>Element width: {width}px</p>
    </div>
  );
}
```

## Platform-Specific Lifecycle Considerations

Components handle lifecycle differently based on the platform (web vs. React Native):

```tsx
function PlatformAwareComponent() {
  React.useEffect(() => {
    if (isReactNative()) {
      // React Native specific setup
      const subscription = setupNativeListener();
      
      return () => {
        // React Native specific cleanup
        subscription.remove();
      };
    } else {
      // Web specific setup
      window.addEventListener('resize', handleResize);
      
      return () => {
        // Web specific cleanup
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
  
  return <div>{/* Content */}</div>;
}
```

## Error Handling in Lifecycle Methods

Components handle errors that might occur during lifecycle methods:

```tsx
function ErrorBoundaryExample() {
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  
  React.useEffect(() => {
    try {
      // Potentially error-prone code
      riskyOperation();
    } catch (error) {
      setHasError(true);
      setErrorMessage(error.message);
      
      // Log error to monitoring service
      logError(error);
    }
  }, []);
  
  if (hasError) {
    return <ErrorDisplay message={errorMessage} />;
  }
  
  return <div>{/* Normal content */}</div>;
}
```

This document provides a comprehensive overview of component lifecycle management in the UI components of the @d-sports/wallet project.