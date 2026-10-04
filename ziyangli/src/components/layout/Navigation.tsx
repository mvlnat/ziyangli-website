import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="main-navigation" role="navigation" aria-label="Main navigation">
      <ul>
        {[
          { path: '/', label: 'Home' },
          { path: '/projects', label: 'Projects' },
          { path: '/blog', label: 'Blog' },
          { path: '/about', label: 'About' },
        ].map((item, index) => {
          const active = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));
          return <li key={item.path}><Link to={item.path} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
            <span className="nav-number" aria-hidden="true">0{index + 1}</span>{item.label}
          </Link></li>;
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
