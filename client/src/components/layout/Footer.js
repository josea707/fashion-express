import React from 'react';

const Footer = () => {
  return (
    <footer className='row center column'>
      <span>© 2021 All rights reserved.</span>
      <span>
        <a
          href='https://www.linkedin.com/in/jose-delgado-170991115/'
          className='padding-container'
        >
          <i className='fab fa-linkedin-in fa-2x'></i>
        </a>
        <a
          href='https://github.com/josea707/fashion-express'
          className='padding-container'
        >
          <i className='fab fa-github fa-2x'></i>
        </a>
      </span>
    </footer>
  );
};

export default Footer;
