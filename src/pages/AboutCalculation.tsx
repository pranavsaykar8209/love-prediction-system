import React from 'react';
import Navbar from '../components/Navbar';
import Section from '../components/Section';
import Card from '../components/Card';
import aboutData from '../data/aboutCalculation.json';
import styles from './AboutCalculation.module.css';

// SVG Icons for "How It Works" steps matching the design aesthetic
const StepIcons = [
  // User profile icon for Step 1
  <svg key="user" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>,
  // Brain icon for Step 2
  <svg key="brain" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v12" />
    <path d="M8 10c0-2.5 1.5-4 4-4" />
    <path d="M16 10c0-2.5-1.5-4-4-4" />
    <path d="M8 14c0 2.5 1.5 4 4 4" />
    <path d="M16 14c0 2.5-1.5 4-4 4" />
  </svg>,
  // Heart icon for Step 3
  <svg key="heart" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>,
  // Star icon for Step 4
  <svg key="star" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
];

// SVG Icons for Credibility checkmarks
const CredibilityIcons = [
  // Shield / Check icon
  <svg key="shield" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  // Lock icon
  <svg key="lock" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>,
  // People / Double User icon
  <svg key="users" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
];

interface AboutCalculationProps {
  onCtaClick?: () => void;
}

const AboutCalculation: React.FC<AboutCalculationProps> = ({ onCtaClick }) => {
  // Parse terms inside the formula parenthesis dynamically.
  // For "(Name Energy + Emotional Index + Compatibility Factor)", we extract:
  // ["Name Energy", "Emotional Index", "Compatibility Factor"]
  const getFormulaComponents = () => {
    try {
      const match = aboutData.formula.match(/\(([^)]+)\)/);
      if (match && match[1]) {
        return match[1].split('+').map((item) => item.trim());
      }
    } catch (e) {
      console.error('Error parsing formula components:', e);
    }
    return ['Name Energy', 'Emotional Index', 'Compatibility Factor'];
  };

  const formulaComponents = getFormulaComponents();

  // Short codes for circles (e.g. "Name Energy" -> "NE")
  const getAbbreviation = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      {/* Decorative background blobs */}
      <div className={`${styles.blob} ${styles.blobPink}`}></div>
      <div className={`${styles.blob} ${styles.blobPurple}`}></div>
      <div className={`${styles.blob} ${styles.blobLavender}`}></div>

      {/* Floating hearts */}
      <div className={`${styles.floatingHeart} ${styles.heart1}`}>♥</div>
      <div className={`${styles.floatingHeart} ${styles.heart2}`}>♥</div>
      <div className={`${styles.floatingHeart} ${styles.heart3}`}>♥</div>
      <div className={`${styles.floatingHeart} ${styles.heart4}`}>♥</div>

      {/* 1. Navbar */}
      <Navbar 
        ctaText={aboutData.cta} 
        onCtaClick={onCtaClick} 
        onLogoClick={scrollToTop} 
      />

      {/* 2. Hero Section */}
      <Section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroHeart}>♥</span>
            <span>About Calculation</span>
            <span className={styles.heroHeart}>♥</span>
          </div>
          <h1 className={styles.heroTitle}>{aboutData.title}</h1>
          <p className={styles.heroSubtitle}>{aboutData.subtitle}</p>
          <button className={styles.heroCta} onClick={onCtaClick}>
            {aboutData.cta}
            <span className={styles.ctaHeart}>♥</span>
          </button>
        </div>
      </Section>

      {/* 3. How It Works Section */}
      <Section
        id="calculator"
        badge="How It Works"
        title="Simple steps to find your love compatibility"
        subtitle="Our algorithm runs several multi-dimensional alignment checks on input factors to compute the compatibility percentage."
      >
        <div className={styles.grid}>
          {aboutData.howItWorks.map((step, index) => (
            <Card
              key={step.title}
              stepNumber={String(index + 1).padStart(2, '0')}
              title={step.title}
              description={step.description}
              icon={StepIcons[index % StepIcons.length]}
            />
          ))}
        </div>
      </Section>

      {/* 4. Formula Section */}
      <Section
        badge="Our Compatibility Formula"
        title="A balanced approach to true compatibility"
        className={styles.formulaSection}
      >
        <div className={styles.formulaCard}>
          {/* Dynamic Component Visual Bubbles */}
          <div className={styles.visualFormula}>
            {formulaComponents.map((component, index) => (
              <React.Fragment key={component}>
                <div className={styles.formulaBubbleWrapper}>
                  <div className={styles.formulaBubble}>
                    {getAbbreviation(component)}
                  </div>
                  <span className={styles.formulaBubbleLabel}>{component}</span>
                </div>
                {index < formulaComponents.length - 1 && (
                  <span className={styles.formulaOperator}>+</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Prominent Formula Text display */}
          <div className={styles.formulaTextContainer}>
            <span className={styles.formulaHeart}>♥</span>
            <p className={styles.formulaText}>{aboutData.formula}</p>
          </div>
        </div>
      </Section>

      {/* 5. Credibility Section */}
      <Section
        badge="Why Trust Our Calculator?"
        title="Accuracy meets modern relationship science"
        subtitle="We build emotional indicators using behavioral parameters rather than random generation."
      >
        <div className={styles.credibilityList}>
          {aboutData.credibility.map((item, index) => (
            <div key={item} className={styles.credibilityCard}>
              <div className={styles.credibilityIconWrapper}>
                {CredibilityIcons[index % CredibilityIcons.length]}
              </div>
              <div className={styles.credibilityText}>
                <h4 className={styles.credibilityItemTitle}>
                  {index === 0 && "Science-Backed Approach"}
                  {index === 1 && "100% Confidential"}
                  {index === 2 && "Trusted & Validated"}
                </h4>
                <p className={styles.credibilityItemDesc}>{item}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Disclaimer Section */}
      <footer className={styles.footer}>
        <div className={styles.disclaimerContainer}>
          <span className={styles.disclaimerIcon}>♥</span>
          <span className={styles.disclaimerTitle}>Disclaimer</span>
          <span className={styles.disclaimerIcon}>♥</span>
          <p className={styles.disclaimerText}>{aboutData.disclaimer}</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutCalculation;
