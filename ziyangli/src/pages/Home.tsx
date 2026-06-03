import React from 'react';
import { Link } from 'react-router-dom';

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

const Home: React.FC = () => {
  const age = calculateAge(new Date(2000, 7, 28));

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">Software developer · builder · technical writer</p>
          <h1>Ziyang Li</h1>
          <p className="hero-lede">
            I am a {age} year old software developer building useful web products,
            learning systems, and technical notes in public.
          </p>
          <div className="hero-actions" aria-label="Primary links">
            <Link to="/projects">See the work</Link>
            <Link to="/blog">Read the writing</Link>
          </div>
        </div>

        <div className="hero-portrait" aria-label="Portrait of Ziyang Li">
          <img src={`${process.env.PUBLIC_URL}/images/blog/ziyang.png`} alt="Ziyang Li" />
          <div className="portrait-caption">
            <span>Currently public</span>
            <strong>Building, writing, learning</strong>
          </div>
        </div>
      </section>

      <section className="signal-grid" aria-label="What this site highlights">
        <article>
          <span>01</span>
          <h2>Products</h2>
          <p>
            Full-stack apps with the practical parts included: authentication,
            data flows, payments, deployment, and admin surfaces.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Systems</h2>
          <p>
            Notes and experiments around backend design, algorithms, developer
            tooling, and learning infrastructure.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Public Work</h2>
          <p>
            A living record of what I build, what I am studying, and how my
            taste as an engineer is developing over time.
          </p>
        </article>
      </section>

      <section className="home-links" aria-label="Explore more">
        <Link to="/projects">
          <span>Projects</span>
          <strong>Shipped work and live demos</strong>
        </Link>
        <Link to="/about">
          <span>About</span>
          <strong>Background, interests, and site context</strong>
        </Link>
      </section>
    </>
  );
};

export default Home;
