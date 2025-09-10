import React, { useState } from "react";
import "./App.css";
import DarkModeToggle from "./DarkModeToggle";
import LinkedInButton from "./components/LinkedInButton";

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
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
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="dark-mode-toggle">
        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
      <LinkedInButton />
      <div className="content-wrapper">
        <h1>Hello there</h1>
        <p>
          My name is Ziyang Li and I am a {calculateAge(new Date(2000, 8, 28))}{" "}
          year old software developer.
        </p>
        <p>
          This is my personal website. I use it to share my thoughts and
          experiences.
        </p>
      </div>
    </div>
  );
}

export default App;
