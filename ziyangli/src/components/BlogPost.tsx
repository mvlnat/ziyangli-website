import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import DarkModeToggle from '../DarkModeToggle';
import BackButton from './BackButton';

interface BlogPostProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [postContent, setPostContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/posts/${slug}.md`);
        const text = await response.text();
        const lines = text.split('\n');
        const title = lines[0].replace('#', '').trim(); // Assume first line is the title
        const content = lines.slice(1).join('\n').trim(); // Rest is content
        setPostTitle(title);
        setPostContent(content);
      } catch (error) {
        console.error('Error fetching post:', error);
        setPostTitle('Post Not Found');
        setPostContent('The requested blog post could not be found.');
      }
    };

    fetchPost();
  }, [slug]);

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="dark-mode-toggle">
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <div className="content-wrapper">
        <BackButton />
        <h1>{postTitle}</h1>
        <ReactMarkdown>{postContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogPost;
