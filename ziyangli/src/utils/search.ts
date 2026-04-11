import { BlogPostMetadata } from '../types/blog';

/**
 * Client-side fuzzy search for blog posts
 * Searches in title, description, tags, and category
 */
export const searchPosts = (
  posts: BlogPostMetadata[],
  query: string
): BlogPostMetadata[] => {
  if (!query.trim()) {
    return posts;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/);

  return posts.filter(post => {
    const searchableText = [
      post.title,
      post.description,
      post.category || '',
      ...(post.tags || []),
    ].join(' ').toLowerCase();

    // Match if ALL query terms are found
    return queryTerms.every(term => searchableText.includes(term));
  });
};

/**
 * Score-based search with ranking
 * Returns posts sorted by relevance
 */
export const searchPostsWithScoring = (
  posts: BlogPostMetadata[],
  query: string
): BlogPostMetadata[] => {
  if (!query.trim()) {
    return posts;
  }

  const normalizedQuery = query.toLowerCase().trim();

  const scored = posts.map(post => {
    let score = 0;

    // Title match (highest weight)
    if (post.title.toLowerCase().includes(normalizedQuery)) {
      score += 10;
    }

    // Description match
    if (post.description.toLowerCase().includes(normalizedQuery)) {
      score += 5;
    }

    // Category match
    if (post.category?.toLowerCase().includes(normalizedQuery)) {
      score += 3;
    }

    // Tag match
    if (post.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
      score += 4;
    }

    return { post, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.post);
};
