import React, { ReactNode } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navigation from './Navigation';
import DarkModeToggle from '../DarkModeToggle';
import LinkedInButton from '../LinkedInButton';
import GitHubButton from '../GitHubButton';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const isPresentationRoute = Boolean(matchPath('/blog/web-video-blog-demo', location.pathname));

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isPresentationRoute ? 'presentation-app' : ''}`}>
      {!isPresentationRoute && (
        <>
          <a href="#main-content" className="skip-link" onClick={(event) => {
            event.preventDefault();
            document.getElementById('main-content')?.focus();
          }}>Skip to content</a>
          <header className="desk-header">
            <div className="top-bar">
              <Link to="/" className="site-brand" aria-label="Ziyang Li home">
                <span className="brand-monogram" aria-hidden="true">ZL</span>
                <span><span className="brand-name">Ziyang Li</span><span className="brand-caption">A developer’s notebook</span></span>
              </Link>
              <div className="desk-tools">
                <div className="social-buttons"><LinkedInButton /><GitHubButton /></div>
                <div className="theme-control">
                  <span className="theme-label">{isDarkMode ? 'Evening' : 'Daylight'}</span>
                  <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                </div>
              </div>
            </div>
            <Navigation />
          </header>
        </>
      )}
      <main id="main-content" tabIndex={-1} className="content-wrapper">
        {children}
      </main>
      {!isPresentationRoute && <Footer />}
    </div>
  );
};

export default Layout;
