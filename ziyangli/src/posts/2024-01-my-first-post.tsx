import React from 'react';

/**
 * Example blog post as a React component
 * This allows for custom layouts, interactive components, and creative flexibility
 */
const MyFirstPost: React.FC = () => {
  return (
    <>
      <p>
        Welcome to my blog! This is my first post, and I'm excited to share
        my journey in software development with you.
      </p>

      <h2>Why I Started This Blog</h2>
      <p>
        I've been coding for several years now, and I've learned so much from
        the developer community. This blog is my way of giving back and sharing
        what I've learned along the way.
      </p>

      <h2>What to Expect</h2>
      <ul>
        <li>Tutorials on React, TypeScript, and web development</li>
        <li>Personal reflections on software engineering</li>
        <li>Interactive demos and experiments</li>
        <li>Thoughts on technology and design</li>
      </ul>

      <blockquote>
        "The best way to learn is to teach." - Richard Feynman
      </blockquote>

      <h2>Let's Connect</h2>
      <p>
        I'd love to hear from you! Feel free to reach out on{' '}
        <a href="https://www.linkedin.com/in/ziyangg" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        .
      </p>
    </>
  );
};

export default MyFirstPost;
