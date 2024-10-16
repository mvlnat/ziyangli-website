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

// Create an array of example blog posts
const blogPosts: BlogPostData[] = [
  { id: 1, title: "My Journey as a Software Developer", slug: "journey-as-developer" },
  { id: 2, title: "React Hooks: A Deep Dive", slug: "react-hooks-deep-dive" },
  { id: 3, title: "The Future of AI in Software Development", slug: "ai-in-software-dev" },
];

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
    age--;
  }
  return age;
};

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
                {blogPosts.map((post) => (
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
