import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page not found</p>
      <p>
        <Link to="/">Go back home →</Link>
      </p>
    </div>
  );
};

export default NotFound;
