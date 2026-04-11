import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * Comprehensive guide to React Hooks (2026 update)
 */
const ReactHooksGuide: React.FC = () => {
  return (
    <>
      <p>
        React Hooks revolutionized how we write React components. This comprehensive guide
        covers all the built-in hooks, their use cases, and best practices for 2026.
      </p>

      <h2>State Hooks</h2>

      <h3>useState</h3>
      <p>
        The most commonly used hook. Declares a state variable that you can update directly.
      </p>

      <CodeBlock language="typescript">
{`const [count, setCount] = useState(0);
const [name, setName] = useState('');

// Functional updates for better performance
setCount(prev => prev + 1);`}
      </CodeBlock>

      <h3>useReducer</h3>
      <p>
        Declares a state variable with update logic inside a reducer function.
        Better for complex state logic.
      </p>

      <CodeBlock language="typescript">
{`const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}`}
      </CodeBlock>

      <h2>Effect Hooks</h2>

      <h3>useEffect</h3>
      <p>
        Handles side effects in functional components. Replaces lifecycle methods like
        componentDidMount and componentDidUpdate.
      </p>

      <CodeBlock language="typescript">
{`useEffect(() => {
  // Effect runs after render
  document.title = \`Count: \${count}\`;

  // Cleanup function (optional)
  return () => {
    // Runs before next effect or unmount
  };
}, [count]); // Dependency array`}
      </CodeBlock>

      <p><strong>Common use cases:</strong></p>
      <ul>
        <li>Fetching data (though use() is preferred in React 19)</li>
        <li>Subscriptions and event listeners</li>
        <li>Synchronizing with external systems</li>
        <li>DOM manipulation</li>
      </ul>

      <h3>useLayoutEffect</h3>
      <p>
        Fires synchronously before the browser paints. Use for measuring or modifying
        layout to prevent flickering.
      </p>

      <CodeBlock language="typescript">
{`useLayoutEffect(() => {
  // Measure DOM node
  const rect = divRef.current.getBoundingClientRect();
  setHeight(rect.height);
}, []);`}
      </CodeBlock>

      <h2>Performance Hooks</h2>

      <h3>useMemo</h3>
      <p>
        Caches the result of an expensive calculation. Only recomputes when
        dependencies change.
      </p>

      <CodeBlock language="typescript">
{`const sortedList = useMemo(() => {
  // Expensive operation
  return items.sort((a, b) => a.value - b.value);
}, [items]);`}
      </CodeBlock>

      <p><strong>When to use:</strong></p>
      <ul>
        <li>Expensive calculations (sorting, filtering large arrays)</li>
        <li>Preventing unnecessary re-renders of child components</li>
        <li>Referential equality for dependency arrays</li>
      </ul>

      <h3>useCallback</h3>
      <p>
        Caches a function definition between re-renders. Useful when passing
        callbacks to optimized child components.
      </p>

      <CodeBlock language="typescript">
{`const handleClick = useCallback(() => {
  console.log('Clicked:', value);
}, [value]);

// Pass to memoized child
<MemoizedChild onClick={handleClick} />`}
      </CodeBlock>

      <h2>Context Hook</h2>

      <h3>useContext</h3>
      <p>
        Reads and subscribes to context without nesting multiple Context.Consumer components.
      </p>

      <CodeBlock language="typescript">
{`const theme = useContext(ThemeContext);
const user = useContext(UserContext);

// No more nested consumers!
return <div className={theme}>Hello {user.name}</div>;`}
      </CodeBlock>

      <h2>Ref Hooks</h2>

      <h3>useRef</h3>
      <p>
        Creates a mutable ref object that persists across renders. Commonly used
        for DOM nodes or storing mutable values.
      </p>

      <CodeBlock language="typescript">
{`const inputRef = useRef<HTMLInputElement>(null);
const countRef = useRef(0);

// Access DOM node
inputRef.current?.focus();

// Store mutable value without re-renders
countRef.current += 1;`}
      </CodeBlock>

      <h3>useImperativeHandle</h3>
      <p>
        Customizes the ref value exposed to parent components. Use with forwardRef.
      </p>

      <CodeBlock language="typescript">
{`useImperativeHandle(ref, () => ({
  focus: () => {
    inputRef.current?.focus();
  },
  clear: () => {
    inputRef.current!.value = '';
  }
}));`}
      </CodeBlock>

      <h2>React 19: The use() Hook</h2>
      <p>
        React 19 introduced the <code>use()</code> hook that simplifies data fetching
        and works seamlessly with Suspense.
      </p>

      <CodeBlock language="typescript">
{`function UserProfile({ userId }) {
  // use() can read promises directly
  const user = use(fetchUser(userId));

  return <div>{user.name}</div>;
}`}
      </CodeBlock>

      <p>
        For most data fetching scenarios, prefer <code>use()</code> with Suspense,
        Server Components, or libraries like TanStack Query over useEffect.
      </p>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Rules of Hooks:</strong> Only call hooks at the top level, never inside loops, conditions, or nested functions</li>
        <li><strong>Dependency arrays:</strong> Always include all dependencies to prevent bugs</li>
        <li><strong>Performance:</strong> Don't optimize prematurely - only use useMemo/useCallback when you have a performance issue</li>
        <li><strong>Data fetching:</strong> Prefer the use() hook or dedicated libraries over useEffect</li>
        <li><strong>useLayoutEffect:</strong> Only use when you need synchronous DOM measurements</li>
      </ul>

      <h2>Common Patterns to Avoid</h2>

      <CodeBlock language="typescript">
{`// ❌ Don't use useEffect for data transformation
useEffect(() => {
  const sorted = data.sort();
  setSorted(sorted);
}, [data]);

// ✅ Use useMemo instead
const sorted = useMemo(() => data.sort(), [data]);

// ❌ Don't wrap every function in useCallback
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);

// ✅ Only when passing to memoized components
const MemoChild = React.memo(Child);
<MemoChild onClick={handleClick} />`}
      </CodeBlock>

      <h2>Conclusion</h2>
      <p>
        React Hooks provide a powerful and flexible way to manage state, side effects,
        and component logic. Understanding when and how to use each hook is key to
        building performant, maintainable React applications.
      </p>
    </>
  );
};

export default ReactHooksGuide;
