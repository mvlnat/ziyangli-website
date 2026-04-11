import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * Example tutorial post about TypeScript
 */
const TypeScriptTricks: React.FC = () => {
  return (
    <>
      <p>
        TypeScript has become essential in modern web development. Here are some
        advanced patterns and tricks that will make your TypeScript code more
        maintainable and type-safe.
      </p>

      <h2>1. Discriminated Unions for Type Safety</h2>
      <p>
        Use discriminated unions to create type-safe state machines and data structures.
      </p>

      <CodeBlock language="typescript">
{`type LoadingState =
  | { status: 'loading' }
  | { status: 'success'; data: string[] }
  | { status: 'error'; error: Error };

function handleState(state: LoadingState) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data; // TypeScript knows data exists here
    case 'error':
      return state.error.message; // TypeScript knows error exists here
  }
}`}
      </CodeBlock>

      <h2>2. Utility Types for Transformation</h2>
      <p>
        TypeScript's built-in utility types like <code>Pick</code>, <code>Omit</code>,
        and <code>Partial</code> are incredibly useful for transforming types.
      </p>

      <CodeBlock language="typescript">
{`interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Only expose safe fields
type PublicUser = Omit<User, 'password'>;

// Create update type with optional fields
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;`}
      </CodeBlock>

      <h2>3. const Assertions for Literal Types</h2>
      <p>
        Use <code>as const</code> to create readonly literal types from objects and arrays.
      </p>

      <CodeBlock language="typescript">
{`const COLORS = ['red', 'blue', 'green'] as const;
type Color = typeof COLORS[number]; // 'red' | 'blue' | 'green'`}
      </CodeBlock>

      <h2>4. Template Literal Types</h2>
      <p>
        TypeScript 4.1+ supports template literal types for creating powerful
        type transformations.
      </p>

      <CodeBlock language="typescript">
{`type EventName = 'click' | 'focus' | 'blur';
type HandlerName = \`on\${Capitalize<EventName>}\`;
// 'onClick' | 'onFocus' | 'onBlur'`}
      </CodeBlock>

      <h2>Conclusion</h2>
      <p>
        These TypeScript patterns help catch bugs at compile time rather than runtime.
        The initial investment in proper typing pays dividends in code quality and
        developer experience.
      </p>
    </>
  );
};

export default TypeScriptTricks;
