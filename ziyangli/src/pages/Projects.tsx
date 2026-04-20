import React from 'react';

const projects = [
  {
    name: 'Store',
    url: 'https://store.ziyang.li',
    domain: 'store.ziyang.li',
    description:
      'Full-stack e-commerce app with authentication, cart and checkout flows, Stripe payments, and admin tools for products and orders.',
  },
  {
    name: 'FSRS Simulator',
    url: 'https://fsrs.ziyang.li',
    domain: 'fsrs.ziyang.li',
    description:
      'Interactive simulator for the Free Spaced Repetition Scheduler algorithm.',
  },
] as const;

const Projects: React.FC = () => {
  return (
    <div className="projects-index">
      <header className="projects-header">
        <h1>Projects</h1>
        <p>Things I've built</p>
      </header>

      <div className="project-cards">
        {projects.map((project) => (
          <a
            key={project.url}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card"
          >
            <span className="project-domain">{project.domain}</span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Projects;
