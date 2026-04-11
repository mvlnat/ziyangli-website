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
  return (
    <>
      <section className="hero">
        <h1>Hello there</h1>
        <p>
          My name is Ziyang Li and I am a {calculateAge(new Date(2000, 7, 28))}{' '}
          year old software developer.
        </p>
        <p>
          This is my personal website. I use it to share my thoughts and
          experiences.
        </p>
      </section>

      <section className="home-links">
        <p>
          <Link to="/blog">Check out my blog →</Link>
        </p>
      </section>
    </>
  );
};

export default Home;
