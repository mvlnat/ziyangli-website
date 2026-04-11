import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>&copy; {currentYear} Ziyang Li. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
