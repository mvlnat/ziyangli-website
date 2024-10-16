import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const LinkedInButton: React.FC = () => {
  return (
    <a href="https://www.linkedin.com/in/ziyangg" target="_blank" rel="noopener noreferrer" className="linkedin-button">
      <LinkedInIcon sx={{ color: 'white' }} />
    </a>
  );
};

export default LinkedInButton;
