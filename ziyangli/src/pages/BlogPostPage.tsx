import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getPostBySlug } from '../posts';
import { formatDate } from '../utils/dateUtils';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const PostComponent = post.component;

  return (
    <article className="blog-post-page">
      <header className="blog-post-header">
        <Link to="/blog" className="back-link" aria-label="Back to blog">
          ← Back to Blog
        </Link>

        <h1>{post.title}</h1>

        <div className="blog-post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.readTime && <span> • {post.readTime} min read</span>}
          {post.author && <span> • By {post.author}</span>}
        </div>
      </header>

      <div className="blog-post-content">
        <PostComponent />
      </div>

      <footer className="blog-post-footer">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
      </footer>
    </article>
  );
};

export default BlogPostPage;
