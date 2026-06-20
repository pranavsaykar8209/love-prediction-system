import React from 'react';
import type { SectionProps } from '../../types';
import styles from './Section.module.css';

const Section: React.FC<SectionProps> = ({
  id,
  badge,
  title,
  subtitle,
  className = '',
  children,
}) => {
  return (
    <section id={id} className={`${styles.section} ${className}`}>
      <div className={styles.container}>
        {/* Section Header */}
        {(badge || title || subtitle) && (
          <div className={styles.header}>
            {badge && (
              <div className={styles.badgeWrapper}>
                <span className={styles.heartDecoration}>♥</span>
                <span className={styles.badge}>{badge}</span>
                <span className={styles.heartDecoration}>♥</span>
              </div>
            )}
            {title && <h2 className={styles.title}>{title}</h2>}
            {title && <div className={styles.divider}>
              <span className={styles.dividerHeart}>♥</span>
            </div>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}
        
        {/* Section Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
