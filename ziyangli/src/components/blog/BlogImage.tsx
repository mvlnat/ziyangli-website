import React from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: string | number;
}

const BlogImage: React.FC<BlogImageProps> = ({ src, alt, caption, width }) => {
  return (
    <figure className="blog-image">
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: width || '100%', height: 'auto' }}
        loading="lazy"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

export default BlogImage;
