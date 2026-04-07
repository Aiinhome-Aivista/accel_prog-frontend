import React from 'react';
import BrandLogo from '../components/shared/BrandLogo';

interface HeaderProps {
  onSignInClick: () => void;
  onToggleNav: () => void;
  onCloseNav: () => void;
  onGoHome: () => void;
  navOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSignInClick,
  onToggleNav,
  onCloseNav,
  onGoHome,
  navOpen
}) => {
  return (
    <>
      <div className="top-bar">
        <a href="#">Request a Demo</a>
        <a href="#">FAQs</a>
        <a href="#">Help Center</a>
      </div>

      <nav className="nav">
        <a
          href="#"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            onCloseNav();
            onGoHome();
          }}
        >
          <BrandLogo />
        </a>

        <div className={`nav-links ${navOpen ? "open" : ""}`} id="navLinks">
          <a
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCloseNav();
              onGoHome();
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 3L4 7l5 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>All Programs</span>
          </a>

          <a href="#pathway" onClick={onCloseNav}>
            Program
          </a>
          <a href="#courses" onClick={onCloseNav}>
            Courses
          </a>
          <a href="#features" onClick={onCloseNav}>
            Why Us
          </a>
          <a href="#instructor" onClick={onCloseNav}>
            Instructors
          </a>

          <button
            className="btn-signin btn-signin-fill"
            onClick={onSignInClick}
          >
            Sign In
          </button>
        </div>

        <button
          className="mobile-toggle"
          onClick={onToggleNav}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </>
  );
};

export default Header;
