import React, { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navigation from './Navigation';
import DarkModeToggle from '../DarkModeToggle';
import LinkedInButton from '../LinkedInButton';
import GitHubButton from '../GitHubButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="top-bar">
        <div className="social-buttons">
          <LinkedInButton />
          <GitHubButton />
        </div>
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <Navigation />
      <main className="content-wrapper">
        {children}
      </main>
    </div>
  );
};

export default Layout;
