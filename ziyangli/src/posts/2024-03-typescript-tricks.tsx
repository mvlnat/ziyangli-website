import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * TypeScript Type Patterns
 */
const TypeScriptTricks: React.FC = () => {
  return (
    <>
      <p>
        TypeScript's type system can express constraints that catch errors at compile time
        rather than runtime. Understanding how to use optional types, utility types, and
        conditional types makes code safer and more maintainable.
      </p>

      <h2>Optional Types</h2>

      <p>
        A property marked with <code>?</code> can be undefined. This is different from
        explicitly including undefined in a union type.
      </p>

      <CodeBlock language="typescript">
{`interface User {
  id: string;
  name: string;
  email?: string;        // string | undefined
  phone?: string | null; // string | null | undefined
}

// Optional parameters work the same way
function greet(name: string, greeting?: string) {
  return \`\${greeting ?? 'Hello'}, \${name}!\`;
}

// Optional chaining stops evaluation if a value is null or undefined
const userEmail = user?.email?.toLowerCase();

// Nullish coalescing provides a default only for null/undefined
const displayName = user.name ?? 'Anonymous';`}
      </CodeBlock>

      <h2>Utility Types</h2>

      <p>
        TypeScript includes several built-in types that transform existing types.
        <code>Partial</code> makes all properties optional. <code>Required</code> makes
        them all required. <code>Readonly</code> makes them immutable.
      </p>

      <CodeBlock language="typescript">
{`interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type UserUpdate = Partial<User>;
// { id?: string; name?: string; email?: string; password?: string }

type CompleteUser = Required<User>;
// All properties required (same as User in this case)

type ImmutableUser = Readonly<User>;
// Properties cannot be reassigned`}
      </CodeBlock>

      <p>
        <code>Pick</code> selects specific properties. <code>Omit</code> excludes them.
      </p>

      <CodeBlock language="typescript">
{`type UserCredentials = Pick<User, 'email' | 'password'>;
// { email: string; password: string }

type PublicUser = Omit<User, 'password'>;
// { id: string; name: string; email: string }`}
      </CodeBlock>

      <p>
        <code>Record</code> creates an object type with specific keys and value type.
      </p>

      <CodeBlock language="typescript">
{`type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
// { [key: string]: 'admin' | 'user' | 'guest' }`}
      </CodeBlock>

      <h2>Conditional Types</h2>

      <p>
        Conditional types use <code>extends</code> to check if a type matches a constraint,
        then return one type or another.
      </p>

      <CodeBlock language="typescript">
{`type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Extract non-nullable types
type NonNullable<T> = T extends null | undefined ? never : T;

// Extract return type from a function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: 'Alice' };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string }`}
      </CodeBlock>

      <p>
        The <code>infer</code> keyword lets TypeScript extract types from within other types.
        In the example above, <code>infer R</code> captures the return type of the function.
      </p>

      <h2>Mapped Types</h2>

      <p>
        Mapped types transform each property in an object type. The syntax
        <code>[K in keyof T]</code> iterates over all keys in T.
      </p>

      <CodeBlock language="typescript">
{`interface Person {
  name: string;
  age: number;
  email: string;
}

type Optional<T> = {
  [K in keyof T]?: T[K];
};

type PartialPerson = Optional<Person>;
// { name?: string; age?: number; email?: string }

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullablePerson = Nullable<Person>;
// { name: string | null; age: number | null; email: string | null }`}
      </CodeBlock>

      <p>
        We can transform keys as well as values. Template literal types combine with mapped
        types to create new key names.
      </p>

      <CodeBlock language="typescript">
{`type Prefixed<T, Prefix extends string> = {
  [K in keyof T as \`\${Prefix}\${string & K}\`]: T[K];
};

type PrefixedPerson = Prefixed<Person, 'user_'>;
// { user_name: string; user_age: number; user_email: string }`}
      </CodeBlock>

      <h2>Template Literal Types</h2>

      <p>
        Template literal types manipulate string literal types the same way template literals
        manipulate strings.
      </p>

      <CodeBlock language="typescript">
{`type EventName = 'click' | 'focus' | 'blur';
type HandlerName = \`on\${Capitalize<EventName>}\`;
// 'onClick' | 'onFocus' | 'onBlur'

type CSSProperty = 'color' | 'background' | 'font-size';
type CSSVar = \`--\${CSSProperty}\`;
// '--color' | '--background' | '--font-size'`}
      </CodeBlock>

      <p>
        These can combine with mapped types to create type-safe paths through nested objects.
      </p>

      <CodeBlock language="typescript">
{`type DeepObject = {
  user: {
    profile: {
      name: string;
    };
  };
};

type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? \`\${K}\` | \`\${K}.\${Path<T[K]>}\`
        : never;
    }[keyof T]
  : never;

type ValidPaths = Path<DeepObject>;
// 'user' | 'user.profile' | 'user.profile.name'`}
      </CodeBlock>

      <h2>Generic Constraints</h2>

      <p>
        Constraints limit what types a generic can accept. This provides type safety while
        keeping functions reusable.
      </p>

      <CodeBlock language="typescript">
{`function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Works with any object that has an id property
const users = [{ id: '1', name: 'Alice' }];
const user = findById(users, '1');`}
      </CodeBlock>

      <p>
        <code>keyof T</code> creates a union of all keys in T. We can constrain a generic
        to be one of those keys.
      </p>

      <CodeBlock language="typescript">
{`function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 30 };
const name = getProperty(user, 'name'); // string
const age = getProperty(user, 'age');   // number`}
      </CodeBlock>

      <h2>Discriminated Unions</h2>

      <p>
        A discriminated union is a union type where each member has a literal property in
        common. TypeScript uses this property to narrow the type.
      </p>

      <CodeBlock language="typescript">
{`type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return response.data; // TypeScript knows data exists here
    case 'error':
      return response.error.message; // TypeScript knows error exists here
  }
}`}
      </CodeBlock>

      <p>
        The <code>status</code> property discriminates between the union members. Once we
        check <code>response.status === 'success'</code>, TypeScript knows the type must be
        <code>&#123; status: 'success'; data: T &#125;</code>.
      </p>

      <h2>Const Assertions</h2>

      <p>
        Adding <code>as const</code> to a value tells TypeScript to infer the narrowest
        possible type. Arrays become readonly tuples, objects get readonly properties with
        literal types.
      </p>

      <CodeBlock language="typescript">
{`const colors1 = ['red', 'blue', 'green'];
// Type: string[]

const colors2 = ['red', 'blue', 'green'] as const;
// Type: readonly ['red', 'blue', 'green']

type Color = typeof colors2[number];
// 'red' | 'blue' | 'green'

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;
// apiUrl: 'https://api.example.com' (literal type, not string)
// timeout: 5000 (literal type, not number)`}
      </CodeBlock>

      <p>
        This pattern creates enum-like constants without actual enums.
      </p>

      <CodeBlock language="typescript">
{`const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
// 'pending' | 'in_progress' | 'completed'`}
      </CodeBlock>

      <h2>Putting It Together</h2>

      <p>
        These features work together. Discriminated unions with conditional types can model
        complex state. Mapped types with template literals create type-safe APIs. Generic
        constraints ensure functions work with the right shapes of data.
      </p>

      <p>
        The type system catches errors before runtime. A function that expects
        <code>&#123; id: string &#125;</code> can't receive <code>&#123; name: string &#125;</code>.
        A discriminated union ensures you handle all cases. Optional types make null checks
        explicit.
      </p>

      <p>
        This level of type safety has a cost in complexity, but it scales better than runtime
        checks scattered through the code. The types document the assumptions and the compiler
        verifies them.
      </p>
    </>
  );
};

export default TypeScriptTricks;
