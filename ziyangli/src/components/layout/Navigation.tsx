import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="main-navigation" role="navigation" aria-label="Main navigation">
      <ul>
        <li><Link to="/" className={isActive('/')}>Home</Link></li>
        <li><Link to="/blog" className={isActive('/blog')}>Blog</Link></li>
        <li><Link to="/about" className={isActive('/about')}>About</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
