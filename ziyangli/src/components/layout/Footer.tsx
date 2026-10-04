import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>&copy; {currentYear} Ziyang Li</p>
      <p>Built with care. Shared in public.</p>
    </footer>
  );
};

export default Footer;
