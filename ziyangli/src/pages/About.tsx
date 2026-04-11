import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <h1>About</h1>

      <section>
        <h2>About Me</h2>
        <p>
          I'm Ziyang Li, a software developer passionate about building
          elegant solutions to complex problems.
        </p>
        <p>
          I enjoy working with modern web technologies and exploring new ways
          to create interactive experiences on the web.
        </p>
      </section>

      <section>
        <h2>About This Site</h2>
        <p>
          This site is built with React, TypeScript, and deployed on GitHub Pages.
          It's a personal space for sharing thoughts, tutorials, and experiments.
        </p>
        <p>
          Each blog post is a custom React component, allowing for maximum
          flexibility and creativity in content presentation.
        </p>
      </section>
    </div>
  );
};

export default About;
