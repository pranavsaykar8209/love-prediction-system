import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import FloatingHearts from '../../components/FloatingHearts/FloatingHearts';
import HeartIcon from '../../components/HeartIcon/HeartIcon';
import config from '../../data/analysisResultConfig.json';
import aboutData from '../../data/aboutCalculation.json';
import styles from './ResultPage.module.css';
import type { ResultPageProps } from '../../types';
import { capitalizeName } from '../../utils';
import { getOrCreateLoveResult } from '../../services/supabaseService';

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

  // 1. Unified initialization, Supabase fetching, and loading progress effect
  useEffect(() => {
    if (!isLoading) return;

    let isMounted = true;
    let dataFinished = false;
    let timerFinished = false;
    let fetchedResult: { score: number; message: string; paragraph: string } | null = null;

    // Fetch or create compatibility result from Supabase
    getOrCreateLoveResult(yourName, crushName)
      .then((res) => {
        if (!isMounted) return;
        fetchedResult = res;
        dataFinished = true;
        checkReveal();
      })
      .catch((error) => {
        console.error('Failed to get or create love result:', error);
        if (!isMounted) return;
        dataFinished = true;
        checkReveal();
      });

    // Loading progress animation (minimum 3.5 seconds)
    const startTime = Date.now();
    const duration = 5000;

    const updateProgress = () => {
      if (!isMounted) return;
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        timerFinished = true;
        checkReveal();
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    const checkReveal = () => {
      if (dataFinished && timerFinished) {
        if (isMounted) {
          if (fetchedResult) {
            setScore(fetchedResult.score);
            setSelectedMessage(fetchedResult.message);
            setSelectedParagraph(fetchedResult.paragraph);
          }
          setIsLoading(false);
        }
      }
    };

    return () => {
      isMounted = false;
      cancelAnimationFrame(animFrame);
    };
  }, [isLoading, yourName, crushName]);

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
    setProgress(0);
    setLoadingMessageIndex(0);
    setDisplayScore(0);
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
      <FloatingHearts count={10} />

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
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: strokeDashoffset,
                    }}
                  />
                </svg>
                <div className={styles.loaderHeart}>
                  <HeartIcon />
                </div>
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
                  <HeartIcon className={styles.buttonHeart} />
                  {config.actions.primaryAction}
                  <HeartIcon className={styles.buttonHeart} />
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
          <HeartIcon className={styles.disclaimerIcon} />
          <span className={styles.disclaimerTitle}>Disclaimer</span>
          <HeartIcon className={styles.disclaimerIcon} />
          <p className={styles.disclaimerText}>{aboutData.disclaimer}</p>
        </div>
      </footer>
    </div>
  );
};

export default ResultPage;
