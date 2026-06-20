import React from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  ctaText?: string;
  onLogoClick?: () => void;
  onCtaClick?: () => void;
  showNavLinks?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  ctaText = 'Try Calculator', 
  onLogoClick,
  onCtaClick,
  showNavLinks = true
}) => {

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbar}>
        {/* Left: Logo */}
        <div 
          className={styles.logo} 
          onClick={onLogoClick}
          style={onLogoClick ? { cursor: 'pointer' } : undefined}
          role="button"
          tabIndex={onLogoClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onLogoClick && (e.key === 'Enter' || e.key === ' ')) {
              onLogoClick();
            }
          }}
        >
          <span className={styles.heartIcon}>♥</span>
          <span className={styles.logoText}>LoveMatch</span>
        </div>

        {/* Right: CTA Buttons */}
        <div className={styles.ctaWrapper}>
          {showNavLinks && (
            <a href="#calculator" className={styles.ctaButton}>
              How It Works
            </a>
          )}
          <button className={styles.ctaButton} onClick={onCtaClick}>
            {ctaText}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

