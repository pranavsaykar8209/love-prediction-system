import React from 'react';
import styles from './FloatingHearts.module.css';

interface FloatingHeartsProps {
  count?: number;
}

const FloatingHearts: React.FC<FloatingHeartsProps> = ({ count = 25 }) => {
  // Clamp count between 1 and 25 to match our defined CSS positions
  const safeCount = Math.max(1, Math.min(count, 25));

  return (
    <>
      {Array.from({ length: safeCount }).map((_, index) => {
        const heartClass = styles[`heart${index + 1}`];
        return (
          <div
            key={index}
            className={`${styles.floatingHeart} ${heartClass}`}
          >
            ♥
          </div>
        );
      })}
    </>
  );
};

export default FloatingHearts;
