import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * TypeScript Async and Promises
 */
const TypeScriptAsyncPromise: React.FC = () => {
  return (
    <>
      <p>
        JavaScript's asynchronous operations return Promises, and TypeScript provides generic
        types to describe what those Promises resolve to. Properly typing async code prevents
        errors and makes the flow of asynchronous data explicit.
      </p>

      <h2>Promise Types</h2>

      <p>
        A Promise is generic over its resolution type. <code>Promise&lt;string&gt;</code> resolves
        to a string, <code>Promise&lt;number&gt;</code> resolves to a number.
      </p>

      <CodeBlock language="typescript">
{`const promise1: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Hello'), 1000);
});

const promise2 = Promise.resolve(42);
// Type: Promise<number>

const promise3 = Promise.reject(new Error('Failed'));
// Type: Promise<never>`}
      </CodeBlock>

      <p>
        <code>Promise.all</code> returns a tuple type matching the input promises.
        <code>Promise.race</code> returns a union of all possible types.
      </p>

      <CodeBlock language="typescript">
{`const [user, posts, comments] = await Promise.all([
  fetchUser(),      // Promise<User>
  fetchPosts(),     // Promise<Post[]>
  fetchComments(),  // Promise<Comment[]>
]);
// user: User, posts: Post[], comments: Comment[]

const result = await Promise.race([
  fetchFromCache(),  // Promise<Data>
  fetchFromAPI(),    // Promise<Data>
]);
// result: Data`}
      </CodeBlock>

      <h2>Async Functions</h2>

      <p>
        An async function always returns a Promise. TypeScript infers the wrapped type
        from what the function returns.
      </p>

      <CodeBlock language="typescript">
{`async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  const data = await response.json();
  return data;
}

// Type inference works without explicit annotation
async function getUsers() {
  const users = await fetchUser('123');
  return users;
}
// Return type inferred as Promise<User>`}
      </CodeBlock>

      <h2>Error Handling</h2>

      <p>
        TypeScript can't know what type an error will be, so catch blocks receive
        <code>unknown</code>. We need to narrow the type before using it.
      </p>

      <CodeBlock language="typescript">
{`class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchUserSafe(id: string): Promise<User> {
  try {
    const response = await fetch(\`/api/users/\${id}\`);

    if (!response.ok) {
      throw new ApiError(
        'Failed to fetch user',
        response.status,
        await response.json()
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('API Error:', error.statusCode);
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    throw error;
  }
}`}
      </CodeBlock>

      <p>
        An alternative approach uses a Result type to make errors explicit in the return type.
      </p>

      <CodeBlock language="typescript">
{`type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUserResult(id: string): Promise<Result<User, ApiError>> {
  try {
    const user = await fetchUser(id);
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error : new ApiError('Unknown error', 500)
    };
  }
}

const result = await fetchUserResult('123');
if (result.success) {
  console.log(result.data.name);
} else {
  console.error(result.error.statusCode);
}`}
      </CodeBlock>

      <h2>Generic Async Functions</h2>

      <p>
        Generics make async utilities reusable across different types.
      </p>

      <CodeBlock language="typescript">
{`async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return await response.json() as T;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

const post = await fetchJson<Post>('/api/posts/1');
// post: Post`}
      </CodeBlock>

      <p>
        A retry utility shows how generics preserve the wrapped Promise type.
      </p>

      <CodeBlock language="typescript">
{`async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError!;
}

const data = await retry(() => fetchJson<Post>('/api/posts/1'), 3);
// data: Post`}
      </CodeBlock>

      <h2>Async Iteration</h2>

      <p>
        Async generators produce values asynchronously. They return
        <code>AsyncGenerator&lt;T&gt;</code> which can be consumed with <code>for await...of</code>.
      </p>

      <CodeBlock language="typescript">
{`async function* fetchPages<T>(
  baseUrl: string,
  pageSize: number = 10
): AsyncGenerator<T[], void, undefined> {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await fetchJson<T[]>(\`\${baseUrl}?page=\${page}&size=\${pageSize}\`);
    yield data;
    hasMore = data.length === pageSize;
    page++;
  }
}

for await (const posts of fetchPages<Post>('/api/posts')) {
  console.log(\`Fetched \${posts.length} posts\`);
}`}
      </CodeBlock>

      <h2>Promise Utility Types</h2>

      <p>
        TypeScript includes utility types for working with Promises. <code>Awaited&lt;T&gt;</code>
        unwraps nested Promises.
      </p>

      <CodeBlock language="typescript">
{`type Awaited<T> = T extends Promise<infer U> ? U : T;

type UserPromise = Promise<User>;
type UnwrappedUser = Awaited<UserPromise>;
// User

// Extract return type from async function
type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : never;

async function getUser() {
  return { id: '1', name: 'Alice' };
}

type UserType = AsyncReturnType<typeof getUser>;
// { id: string; name: string }`}
      </CodeBlock>

      <h2>Advanced Patterns</h2>

      <p>
        Debouncing an async function requires careful typing to preserve the parameter
        and return types.
      </p>

      <CodeBlock language="typescript">
{`function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

const debouncedSearch = debounceAsync(
  async (query: string) => {
    return await fetchJson<Post[]>(\`/api/search?q=\${query}\`);
  },
  300
);`}
      </CodeBlock>

      <p>
        Racing a promise with a timeout shows how to type union results.
      </p>

      <CodeBlock language="typescript">
{`async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    ),
  ]);
}

const user = await withTimeout(fetchUser('123'), 5000);`}
      </CodeBlock>

      <p>
        A concurrent queue with limited parallelism demonstrates how to type async coordination.
      </p>

      <CodeBlock language="typescript">
{`class AsyncQueue<T> {
  private queue: Array<() => Promise<T>> = [];
  private running = 0;

  constructor(private concurrency: number = 3) {}

  async add(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const task = async () => {
        this.running++;
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processNext();
        }
      };

      this.queue.push(task);
      this.processNext();
    });
  }

  private processNext() {
    if (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift()!;
      task();
    }
  }
}

const queue = new AsyncQueue<Post>(2);
const results = await Promise.all([
  queue.add(() => fetchJson<Post>('/api/posts/1')),
  queue.add(() => fetchJson<Post>('/api/posts/2')),
  queue.add(() => fetchJson<Post>('/api/posts/3')),
]);`}
      </CodeBlock>

      <h2>Type Safety in Practice</h2>

      <p>
        These types make async code safer. The compiler knows what each Promise resolves to
        and ensures you handle the values correctly. Generic utilities like retry and debounce
        preserve types through the wrapping layers.
      </p>

      <p>
        Error handling remains a weak point because <code>catch</code> receives
        <code>unknown</code>. Result types make errors explicit at the cost of more verbose
        code. The tradeoff depends on how critical error handling is for your application.
      </p>

      <p>
        Async generators and iteration patterns let you work with streams of async data while
        maintaining type safety. The types flow through <code>for await...of</code> loops just
        like synchronous iteration.
      </p>
    </>
  );
};

export default TypeScriptAsyncPromise;
