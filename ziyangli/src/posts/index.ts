import { BlogPostMetadata, BlogPostRegistry } from '../types/blog';

// Import all post components
import MyFirstPost from './2024-01-my-first-post';
import ReactHooksGuide from './2024-02-react-hooks-guide';
import TypeScriptTricks from './2024-03-typescript-tricks';
import LeetcodeTwoSum from './2024-04-leetcode-two-sum';
import TypeScriptAsyncPromise from './2024-05-typescript-async-promise';
import LeetcodeBacktracking from './2024-06-leetcode-backtracking';
import LeetcodeKnapsack from './2024-07-leetcode-knapsack';
import LeetcodeBinarySearch from './2024-08-leetcode-binary-search';

/**
 * Central metadata registry for all blog posts
 * Add new posts here with their metadata
 */
export const blogPosts: BlogPostRegistry = {
  'my-first-post': {
    id: '2024-01-my-first-post',
    slug: 'my-first-post',
    title: 'My First Blog Post',
    description: 'Welcome to my blog! This is where I share my thoughts on software development and technology.',
    date: '2024-01-15T00:00:00Z',
    author: 'Ziyang Li',
    category: 'Personal',
    tags: ['Introduction', 'Meta'],
    readTime: 3,
    published: true,
    featured: true,
    component: MyFirstPost,
  },
  'react-hooks-guide': {
    id: '2024-02-react-hooks-guide',
    slug: 'react-hooks-guide',
    title: 'Complete Guide to React Hooks',
    description: 'A comprehensive guide to all React hooks including useState, useEffect, useMemo, useCallback, and the new use() hook from React 19.',
    date: '2024-02-10T00:00:00Z',
    author: 'Ziyang Li',
    category: 'Tech',
    tags: ['React', 'Hooks', 'JavaScript', 'React 19'],
    readTime: 12,
    published: true,
    featured: true,
    component: ReactHooksGuide,
  },
  'typescript-advanced-patterns': {
    id: '2024-03-typescript-tricks',
    slug: 'typescript-advanced-patterns',
    title: 'TypeScript Advanced Patterns',
    description: 'Advanced TypeScript patterns and tricks that will make your code more maintainable and type-safe.',
    date: '2024-03-05T00:00:00Z',
    author: 'Ziyang Li',
    category: 'Tech',
    tags: ['TypeScript', 'JavaScript', 'Best Practices'],
    readTime: 10,
    published: true,
    featured: false,
    component: TypeScriptTricks,
  },
  'leetcode-two-sum': {
    id: '2024-04-leetcode-two-sum',
    slug: 'leetcode-two-sum',
    title: 'LeetCode Sum Problems: Two Sum, Three Sum, K-Sum Pattern',
    description: 'Master the complete Sum problems pattern - from Two Sum to Three Sum, Four Sum, and general K-Sum. Learn when to use hash maps vs two pointers, with Python implementations.',
    date: '2024-04-01T00:00:00Z',
    author: 'Ziyang Li',
    category: 'Leetcode',
    tags: ['Algorithms', 'Data Structures', 'Problem Solving', 'Python', 'Two Pointers', 'Hash Map'],
    readTime: 12,
    published: true,
    featured: true,
    component: LeetcodeTwoSum,
  },
  'typescript-async-promise': {
    id: '2024-05-typescript-async-promise',
    slug: 'typescript-async-promise',
    title: 'TypeScript Async/Promise Patterns',
    description: 'Master asynchronous programming in TypeScript with comprehensive guides on Promises, async/await, error handling, and advanced async patterns.',
    date: '2024-05-15T00:00:00Z',
    author: 'Ziyang Li',
    category: 'Tech',
    tags: ['TypeScript', 'JavaScript', 'Async', 'Promises', 'Best Practices'],
    readTime: 15,
    published: true,
    featured: true,
    component: TypeScriptAsyncPromise,
  },
  'leetcode-backtracking': {
    id: '2024-06-leetcode-backtracking',
    slug: 'leetcode-backtracking',
    title: 'LeetCode Backtracking Problems: Complete Pattern Guide',
    description: 'Master backtracking with comprehensive coverage of Generate Parentheses, Combination Sum, Letter Combinations, Permutations, Subsets, N-Queens, and more. Learn the choose-explore-unchoose pattern.',
    date: '2024-06-01T00:00:00Z',
    author: 'Ziyang Li',
    category: 'Leetcode',
    tags: ['Algorithms', 'Backtracking', 'Recursion', 'Python', 'Problem Solving'],
    readTime: 18,
    published: true,
    featured: true,
    component: LeetcodeBacktracking,
  },
  'leetcode-knapsack': {
    id: '2024-07-leetcode-knapsack',
    slug: 'leetcode-knapsack',
    title: 'LeetCode Knapsack Problems: 0/1, Unbounded, and All Variations',
    description: 'Complete guide to knapsack dynamic programming patterns. Master 0/1 knapsack, unbounded knapsack, and bounded knapsack with problems like Coin Change, Partition Equal Subset Sum, Target Sum, and more.',
    date: '2024-07-01T00:00:00Z',
    author: 'Ziyang Li',
    category: 'Leetcode',
    tags: ['Algorithms', 'Dynamic Programming', 'Knapsack', 'Python', 'Problem Solving'],
    readTime: 20,
    published: true,
    featured: true,
    component: LeetcodeKnapsack,
  },
  'leetcode-binary-search': {
    id: '2024-08-leetcode-binary-search',
    slug: 'leetcode-binary-search',
    title: 'LeetCode Binary Search: <= vs <, Return Left/Right/Mid',
    description: 'Complete binary search guide. Master when to use <= vs <, when to return left/right/mid, bisect_left vs bisect_right patterns. Solve Search in Rotated Array, Find Peak, and more with 5 templates.',
    date: '2024-08-01T00:00:00Z',
    author: 'Ziyang Li',
    category: 'Leetcode',
    tags: ['Algorithms', 'Binary Search', 'Python', 'Problem Solving', 'Templates', 'Bisect'],
    readTime: 28,
    published: true,
    featured: true,
    component: LeetcodeBinarySearch,
  },
};

/**
 * Get all published posts sorted by date (newest first)
 */
export const getAllPosts = (): BlogPostMetadata[] => {
  return Object.values(blogPosts)
    .filter(post => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Get a single post by its slug
 */
export const getPostBySlug = (slug: string): BlogPostMetadata | undefined => {
  return blogPosts[slug];
};

/**
 * Get all posts in a specific category
 */
export const getPostsByCategory = (category: string): BlogPostMetadata[] => {
  return getAllPosts().filter(post => post.category === category);
};

/**
 * Get all posts with a specific tag
 */
export const getPostsByTag = (tag: string): BlogPostMetadata[] => {
  return getAllPosts().filter(post => post.tags?.includes(tag));
};

/**
 * Get all unique categories in a specific order
 */
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  getAllPosts().forEach(post => {
    if (post.category) categories.add(post.category);
  });

  // Custom order: Personal, Leetcode, Tech, then alphabetical for any others
  const categoryOrder = ['Personal', 'Leetcode', 'Tech'];
  const categoryArray = Array.from(categories);

  return categoryArray.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    // If both are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only A is in the order array, it comes first
    if (indexA !== -1) return -1;

    // If only B is in the order array, it comes first
    if (indexB !== -1) return 1;

    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });
};

/**
 * Get all unique tags
 */
export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  getAllPosts().forEach(post => {
    post.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

/**
 * Get featured posts
 */
export const getFeaturedPosts = (): BlogPostMetadata[] => {
  return getAllPosts().filter(post => post.featured === true);
};
