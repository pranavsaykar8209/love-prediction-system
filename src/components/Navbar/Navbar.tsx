import React from 'react';
import HeartIcon from '../HeartIcon/HeartIcon';
import type { NavbarProps } from '../../types';
import styles from './Navbar.module.css';

const Navbar: React.FC<NavbarProps> = ({ 
  ctaText = 'Try Calculator', 
  onLogoClick,
  onCtaClick,
  onHistoryClick,
  showNavLinks = true
}) => {
  const isHome = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');

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
          <HeartIcon className={styles.heartIcon} />
          <span className={styles.logoText}>LoveMatch</span>
        </div>

        {/* Right: CTA Buttons */}
        <div className={styles.ctaWrapper}>
          {/* Desktop/Web view (hidden on mobile via CSS) */}
          <div className={styles.desktopCta}>
            {showNavLinks && (
              <>
                <a href="/#how-it-works" className={styles.ctaButton}>
                  How It Works
                </a>
                {onHistoryClick && (
                  <button className={styles.ctaButton} onClick={onHistoryClick}>
                    Match History
                  </button>
                )}
              </>
            )}
            <button className={styles.ctaButton} onClick={onCtaClick}>
              {ctaText}
            </button>
          </div>

          {/* Mobile view (hidden on desktop via CSS) */}
          <div className={styles.mobileCta}>
            {onHistoryClick && (
              <button className={styles.ctaButton} onClick={onHistoryClick} style={{ marginRight: '4px' }}>
                History
              </button>
            )}
            {isHome ? (
              <button className={styles.ctaButton} onClick={onCtaClick}>
                Try Calculator
              </button>
            ) : (
              <a href="/#how-it-works" className={styles.ctaButton}>
                How It Works
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

