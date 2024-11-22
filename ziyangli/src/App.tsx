import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import DarkModeToggle from "./DarkModeToggle";
import BlogPost from "./components/BlogPost";
import LinkedInButton from "./components/LinkedInButton";

// Rename this type to avoid conflict with the component
type BlogPostData = {
  id: number;
  title: string;
  slug: string;
};

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Parse blog posts from environment variable
const BLOG_POSTS: BlogPostData[] = (() => {
  try {
    return process.env.REACT_APP_BLOG_POSTS ? 
      JSON.parse(process.env.REACT_APP_BLOG_POSTS) : [];
  } catch (error) {
    console.error('Failed to parse blog posts:', error);
    return [];
  }
})();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="dark-mode-toggle">
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            </div>
            <LinkedInButton />
            <div className="content-wrapper">
              <h1>Hello there</h1>
              <p>My name is Ziyang Li and I am a {calculateAge(new Date(2000, 8, 28))} year old software developer.</p>
              <p>This is my personal website. I use it to share my thoughts and experiences.</p>
              
              <h2>Blog Posts:</h2>
              <ul className="blog-list">
                {BLOG_POSTS.map((post) => (
                  <li key={post.id}>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        } />
        <Route path="/blog/:slug" element={<BlogPost isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
      </Routes>
    </Router>
  );
}

export default App;
