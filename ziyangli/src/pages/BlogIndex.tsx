import React, { useState, useMemo } from 'react';
import { getAllPosts, getAllCategories } from '../posts';
import BlogCard from '../components/blog/BlogCard';
import SearchBar from '../components/blog/SearchBar';
import CategoryFilter from '../components/blog/CategoryFilter';
import { searchPosts } from '../utils/search';

const BlogIndex: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allPosts = getAllPosts();
  const categories = getAllCategories();

  // Filtered posts based on search and filters
  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    // Apply search
    if (searchQuery) {
      posts = searchPosts(posts, searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    return posts;
  }, [allPosts, searchQuery, selectedCategory]);

  return (
    <div className="blog-index">
      <header className="blog-header">
        <h1>Blog</h1>
        <p>Thoughts, tutorials, and explorations in software development</p>
      </header>

      <div className="blog-filters">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <div className="blog-results">
        <p className="results-count">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        </p>

        <div className="blog-list">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))
          ) : (
            <p className="no-results">No posts found. Try adjusting your search or filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;
