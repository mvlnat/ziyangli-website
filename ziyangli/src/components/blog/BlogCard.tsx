import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPostMetadata } from '../../types/blog';
import { formatDate } from '../../utils/dateUtils';

interface BlogCardProps {
  post: BlogPostMetadata;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="blog-card">
      {post.coverImage && (
        <div className="blog-card-image">
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        </div>
      )}
      <div className="blog-card-content">
        <h2>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <div className="blog-card-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.readTime && <span> • {post.readTime} min read</span>}
          {post.category && <span> • {post.category}</span>}
        </div>
        <p className="blog-card-description">{post.description}</p>
      </div>
    </article>
  );
};

export default BlogCard;
