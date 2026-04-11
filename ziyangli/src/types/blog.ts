import React from 'react';

/**
 * Metadata for a single blog post
 * Each post is a React component with associated metadata for discovery and filtering
 */
export interface BlogPostMetadata {
  // Required fields
  id: string;                    // Unique identifier (e.g., "2024-01-intro")
  slug: string;                  // URL-friendly slug (e.g., "my-first-post")
  title: string;                 // Post title
  description: string;           // Brief description/excerpt (for SEO & previews)
  date: string;                  // ISO date string (e.g., "2024-01-15T00:00:00Z")
  author: string;                // Author name

  // Optional fields
  category?: string;             // Main category (e.g., "Tech", "Personal", "Tutorial")
  tags?: string[];               // Array of tags (e.g., ["React", "TypeScript"])
  coverImage?: string;           // Path to cover image (e.g., "/images/blog/2024-01-intro/hero.jpg")
  readTime?: number;             // Estimated read time in minutes
  published?: boolean;           // Draft vs published (default: true)
  featured?: boolean;            // Featured post flag (for homepage)

  // Component reference
  component: React.ComponentType; // The actual React component for the post
}

/**
 * Registry of all blog posts
 * Key: slug, Value: metadata
 */
export interface BlogPostRegistry {
  [key: string]: BlogPostMetadata;
}
