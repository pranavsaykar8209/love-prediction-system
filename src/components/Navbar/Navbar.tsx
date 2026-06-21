import React, { useState, useEffect } from 'react';
import HeartIcon from '../HeartIcon/HeartIcon';
import type { NavbarProps } from '../../types';
import styles from './Navbar.module.css';
import { useTheme } from '../../context/ThemeContext';

const Navbar: React.FC<NavbarProps> = ({ 
  ctaText = 'Try Calculator', 
  onLogoClick,
  onCtaClick,
  onHistoryClick,
  showNavLinks = true
}) => {
  const isHome = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
  const { theme, toggleTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem('lovematch_theme_tooltip_shown');
    if (!hasShown) {
      // Delay showing tooltip slightly to let the page load animations complete
      const showTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 500);

      // Hide after 3 seconds (2.5s display time)
      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
        localStorage.setItem('lovematch_theme_tooltip_shown', 'true');
      }, 3500);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const ThemeToggle = () => (
    <div className={styles.themeToggleWrapper}>
      <button
        className={styles.themeToggle}
        onClick={() => {
          toggleTheme();
          setShowTooltip(false);
          localStorage.setItem('lovematch_theme_tooltip_shown', 'true');
        }}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? (
          /* Sun icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          /* Moon icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
      {showTooltip && (
        <div className={styles.tooltip}>
          Try Dark Mode! 🌙
        </div>
      )}
    </div>
  );

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
            <ThemeToggle />
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
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
