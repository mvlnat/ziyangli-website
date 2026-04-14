import React from 'react';

const Projects: React.FC = () => {
  return (
    <div className="projects-index">
      <header className="projects-header">
        <h1>Projects</h1>
        <p>Things I've built</p>
      </header>

      <div className="project-cards">
        <a
          href="https://fsrs.ziyang.li"
          target="_blank"
          rel="noopener noreferrer"
          className="project-card"
        >
          <h3>FSRS Simulator</h3>
          <p>Interactive simulator for the Free Spaced Repetition Scheduler algorithm.</p>
        </a>
      </div>
    </div>
  );
};

export default Projects;
