import React from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  ctaText?: string;
}

const Navbar: React.FC<NavbarProps> = ({ ctaText = 'Try Calculator' }) => {

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbar}>
        {/* Left: Logo */}
        <div className={styles.logo}>
          <span className={styles.heartIcon}>♥</span>
          <span className={styles.logoText}>LoveMatch</span>
        </div>

        {/* Right: CTA Buttons */}
        <div className={styles.ctaWrapper}>
          <a href="#calculator" className={styles.ctaButton}>
            How It Works
          </a>
          <button className={styles.ctaButton}>
            {ctaText}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
