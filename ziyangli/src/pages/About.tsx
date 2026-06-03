import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About</h1>
        <p>A little context on who I am and what this site is for</p>
      </header>

      <section>
        <h2>About Me</h2>
        <p>
          I'm Ziyang Li, a software developer focused on building clear,
          reliable web applications and learning systems.
        </p>
        <p>
          I care about practical product engineering: shaping an interface,
          wiring the backend, deploying it, and writing down the lessons so
          the work compounds.
        </p>
      </section>

      <section>
        <h2>About This Site</h2>
        <p>
          This site is my public home base. It collects shipped projects,
          technical writing, experiments, and the decisions behind them.
        </p>
        <p>
          It is built with React and TypeScript, with each post treated as a
          flexible page rather than a fixed template.
        </p>
      </section>
    </div>
  );
};

export default About;
