import React from 'react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <label className={`switch ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
      <span className="slider round"></span>
    </label>
  );
};

export default DarkModeToggle;
