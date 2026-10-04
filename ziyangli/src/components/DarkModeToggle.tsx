import React from "react";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <label className={`switch ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <input type="checkbox" aria-label="Evening theme" role="switch" checked={isDarkMode} onChange={toggleDarkMode} />
      <span className="slider round" aria-hidden="true"></span>
    </label>
  );
};

export default DarkModeToggle;
