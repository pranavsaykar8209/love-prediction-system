import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import FloatingHearts from '../../components/FloatingHearts/FloatingHearts';
import HeartIcon from '../../components/HeartIcon/HeartIcon';
import formData from '../../data/calculatorForm.json';
import aboutData from '../../data/aboutCalculation.json';
import styles from './CalculatorForm.module.css';
import type { CalculatorFormProps, FormInputConfig } from '../../types';

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onHomeNavigate, onSubmit, onHistoryNavigate }) => {
  const location = useLocation();
  const prefill = location.state as { yourName?: string; crushName?: string } | null;

  // Initialize from JSON config, but seed any values passed via navigation state
  const initialValues = formData.inputs.reduce((acc, input) => {
    acc[input.name] = prefill?.[input.name as 'yourName' | 'crushName'] ?? '';
    return acc;
  }, {} as Record<string, string>);

  const [formValues, setFormValues] = useState<Record<string, string>>(initialValues);

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Love Compatibility Form Values submitted:', formValues);
    const yourName = formValues.yourName?.trim() || '';
    const crushName = formValues.crushName?.trim() || '';
    onSubmit(yourName, crushName);
  };

  return (
    <div className={styles.page}>
      {/* Decorative background blobs */}
      <div className={`${styles.blob} ${styles.blobPink}`}></div>
      <div className={`${styles.blob} ${styles.blobPurple}`}></div>
      <div className={`${styles.blob} ${styles.blobLavender}`}></div>

      {/* Floating hearts */}
      <FloatingHearts count={10} />

      {/* Navbar with logo click navigating home and CTA text navigating home */}
      <Navbar 
        ctaText="Back to Home" 
        onCtaClick={onHomeNavigate} 
        onLogoClick={onHomeNavigate} 
        onHistoryClick={onHistoryNavigate}
      />

      {/* Main Content Area */}
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardBadge}>
              <HeartIcon className={styles.badgeHeart} />
              <span>COMPATIBILITY CHECK</span>
              <HeartIcon className={styles.badgeHeart} />
            </div>
            <h1 className={styles.title}>{formData.title}</h1>
            <p className={styles.subtitle}>{formData.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {formData.inputs.map((input: FormInputConfig) => (
              <div key={input.name} className={styles.inputGroup}>
                <label htmlFor={input.name} className={styles.label}>
                  {input.label}
                </label>
                <input
                  type="text"
                  id={input.name}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={formValues[input.name] || ''}
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            ))}

            <button type="submit" className={styles.button}>
              <HeartIcon className={styles.buttonHeart} />
              {formData.button}
              <HeartIcon className={styles.buttonHeart} />
            </button>
          </form>
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

export default CalculatorForm;
