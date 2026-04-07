import React from 'react';
import LogoIcon from '../assets/logogod.svg';

interface FooterProps {
  onSignInClick: () => void;
  onCloseNav: () => void;
  onGoHome: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onSignInClick,
  onCloseNav,
  onGoHome
}) => {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-left">
          <img
            src={LogoIcon}
            className="nav-logo-icon"
            alt="Logo"
            aria-hidden="true"
          />
          <span className="footer-copy">
            Copyright 2026 MokshPath - Guided Path to True Learning
          </span>
        </div>
        <div className="footer-links cursor-pointer">
          <a 
            target="_blank" 
            rel="noreferrer" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onCloseNav();
              onGoHome();
            }}
          >
            All Programs
          </a>
          <a href="#courses">Courses</a>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onSignInClick();
            }}
          >
            Sign In
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
