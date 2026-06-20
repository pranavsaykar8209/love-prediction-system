import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import config from '../../data/analysisResultConfig.json';
import aboutData from '../../data/aboutCalculation.json';
import styles from './ResultPage.module.css';
import type { ResultPageProps } from '../../types';
import { capitalizeName } from '../../utils';

const ResultPage: React.FC<ResultPageProps> = ({
  yourName,
  crushName,
  onAnalyzeAnother,
  onHomeNavigate,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [selectedParagraph, setSelectedParagraph] = useState('');

  // 1. Reset and initialization effect
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setLoadingMessageIndex(0);
      setDisplayScore(0);

      // Generate random score between 70 and 100
      const randomScore = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
      
      // Find matching range based on score
      const matchingRange = config.scoreRanges.find(
        (range) => randomScore >= range.min && randomScore <= range.max
      );

      if (matchingRange) {
        // Randomly pick one message and paragraph
        const msg = matchingRange.messages[Math.floor(Math.random() * matchingRange.messages.length)];
        const para = matchingRange.paragraphs[Math.floor(Math.random() * matchingRange.paragraphs.length)];
        setScore(randomScore);
        setSelectedMessage(msg);
        setSelectedParagraph(para);
      }
    }
  }, [isLoading]);

  // 2. Loading progress effect (smooth requestAnimationFrame progress bar)
  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();
    const duration = 3500; // 3.5 seconds loading state

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsLoading(false);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animFrame);
  }, [isLoading]);

  // 3. Cycle loading messages every 1.5 seconds
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % config.loading.loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // 4. Count-up score animation on reveal
  useEffect(() => {
    if (!isLoading && score > 0) {
      const duration = 1200; // 1.2s count up duration
      const startTime = Date.now();

      const animateCount = () => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutQuad
        const easeRatio = ratio * (2 - ratio);
        const currentScore = Math.floor(easeRatio * score);
        
        setDisplayScore(currentScore);

        if (ratio < 1) {
          requestAnimationFrame(animateCount);
        } else {
          setDisplayScore(score);
        }
      };

      requestAnimationFrame(animateCount);
    }
  }, [isLoading, score]);

  const handleLocalTryAgain = () => {
    setIsLoading(true);
  };

  // Circular progress math
  const radius = 54;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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

      {/* Navbar */}
      <Navbar 
        ctaText="Back to Home" 
        onCtaClick={onHomeNavigate} 
        onLogoClick={onHomeNavigate} 
      />

      <main className={styles.container}>
        <div className={`${styles.card} ${!isLoading ? styles.reveal : ''}`}>
          {isLoading ? (
            /* Loading State UI */
            <div className={styles.loadingContainer}>
              <h1 className={styles.loadingTitle}>{config.loading.loadingTitle}</h1>
              
              <div className={styles.progressRingWrapper}>
                <svg className={styles.progressSvg} width="130" height="130">
                  <circle
                    className={styles.progressBgCircle}
                    cx="65"
                    cy="65"
                    r={radius}
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    className={styles.progressCircle}
                    cx="65"
                    cy="65"
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className={styles.loaderHeart}>♥</div>
              </div>

              <div className={styles.loadingMessageWrapper}>
                {config.loading.loadingMessages.map((msg, index) => (
                  <p
                    key={index}
                    className={`${styles.loadingMessage} ${
                      index === loadingMessageIndex ? styles.activeMessage : ''
                    }`}
                  >
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            /* Result State UI */
            <div className={styles.resultContainer}>
              <div className={styles.namesBadge}>
                <span className={styles.name}>{capitalizeName(yourName) || 'You'}</span>
                <span className={styles.heartPulse}>❤️</span>
                <span className={styles.name}>{capitalizeName(crushName) || 'Crush'}</span>
              </div>

              <div className={styles.scoreSection}>
                <div className={styles.scoreCircle}>
                  <div className={styles.scoreDisplay}>
                    <span className={styles.scoreNumber}>{displayScore}</span>
                    <span className={styles.scorePercent}>{config.resultDisplay.scoreSuffix}</span>
                  </div>
                </div>
              </div>

              <div className={styles.messageSection}>
                <h2 className={styles.resultHeadline}>{selectedMessage}</h2>
                <p className={styles.resultParagraph}>{selectedParagraph}</p>
              </div>

              <div className={styles.actionSection}>
                <button 
                  onClick={handleLocalTryAgain} 
                  className={styles.primaryButton}
                >
                  <span className={styles.buttonHeart}>♥</span>
                  {config.actions.primaryAction}
                  <span className={styles.buttonHeart}>♥</span>
                </button>
                <button 
                  onClick={onAnalyzeAnother} 
                  className={styles.secondaryButton}
                >
                  {config.actions.secondaryAction}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Disclaimer */}
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

export default ResultPage;
