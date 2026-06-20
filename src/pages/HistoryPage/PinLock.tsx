import React, { useState, useEffect } from 'react';
import styles from './PinLock.module.css';

// PIN is sourced from .env (VITE_HISTORY_PIN) — never hardcoded in source
const CORRECT_PIN = import.meta.env.VITE_HISTORY_PIN ?? '';

interface PinLockProps {
  onUnlock: () => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];

const PinLock: React.FC<PinLockProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');

  // Auto-verify when 4 digits are entered
  useEffect(() => {
    if (pin.length !== 4) return;

    if (pin === CORRECT_PIN) {
      onUnlock();
    } else {
      setShake(true);
      setError('Incorrect PIN. Try again.');
      setTimeout(() => {
        setShake(false);
        setPin('');
        setError('');
      }, 700);
    }
  }, [pin, onUnlock]);

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
      setError('');
    } else if (key === '✓') {
      // confirm button — handled via useEffect on length 4
      if (pin.length === 4) {
        if (pin === CORRECT_PIN) {
          onUnlock();
        } else {
          setShake(true);
          setError('Incorrect PIN. Try again.');
          setTimeout(() => {
            setShake(false);
            setPin('');
            setError('');
          }, 700);
        }
      }
    } else if (pin.length < 4) {
      setPin((p) => p + key);
    }
  };

  return (
    <div className={styles.overlay}>
      {/* Background blobs */}
      <div className={`${styles.blob} ${styles.blobPink}`} />
      <div className={`${styles.blob} ${styles.blobPurple}`} />

      <div className={styles.card}>
        {/* Lock icon */}
        <div className={styles.lockIcon}>🔐</div>

        <h2 className={styles.title}>Secret Archives</h2>
        <p className={styles.subtitle}>Enter your 4-digit PIN to continue</p>

        {/* PIN dots display */}
        <div className={`${styles.dotsRow} ${shake ? styles.shake : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${styles.dot} ${i < pin.length ? styles.dotFilled : ''}`}
            />
          ))}
        </div>

        {/* Error message */}
        <p className={`${styles.errorMsg} ${error ? styles.errorVisible : ''}`}>
          {error || '\u00a0'}
        </p>

        {/* Numpad */}
        <div className={styles.numpad}>
          {KEYS.map((key) => (
            <button
              key={key}
              className={`${styles.key} ${key === '⌫' ? styles.keyDelete : ''} ${key === '✓' ? styles.keyConfirm : ''}`}
              onClick={() => handleKey(key)}
              type="button"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinLock;
