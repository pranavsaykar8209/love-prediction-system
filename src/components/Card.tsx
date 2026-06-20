import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  stepNumber?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ stepNumber, title, description, icon }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {/* Step Number Badge */}
        {stepNumber && <span className={styles.stepBadge}>{stepNumber}</span>}
        
        {/* Circular Icon Wrapper */}
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
      </div>

      {/* Card Content */}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Card;
