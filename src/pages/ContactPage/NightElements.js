import React, { useMemo } from 'react';
import styles from './ContactPage.module.css';

// Étoiles avec scintillement
export const Stars = ({ count = 80 }) => {
  const stars = useMemo(() => {
    const arr = [];
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < count; i++) {
      arr.push({
        left: rand() * 100,
        top: rand() * 55,
        size: rand() * 2 + 1,
        delay: rand() * 4,
      });
    }
    return arr;
  }, [count]);

  return (
    <div className={styles.stars} aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={styles.star}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export const ShootingStar = () => (
  <span className={styles.shootingStar} aria-hidden="true" />
);

// Lune avec cratères
export const Moon = () => (
  <div className={styles.moon} aria-hidden="true">
    <div className={`${styles.moonCrater} ${styles.crater1}`} />
    <div className={`${styles.moonCrater} ${styles.crater2}`} />
    <div className={`${styles.moonCrater} ${styles.crater3}`} />
  </div>
);

// Lanterne suspendue (à mettre près du formulaire ou sur le panneau)
export const Lantern = ({ className = '' }) => (
  <svg
    className={`${styles.lantern} ${className}`}
    viewBox="0 0 30 50"
    width="32"
    height="52"
    aria-hidden="true"
  >
    <line x1="15" y1="0" x2="15" y2="6" stroke="#3a2a1e" strokeWidth="1.4" />
    <rect x="6" y="6" width="18" height="22" rx="2" fill="#d99a3a" />
    <rect x="9" y="9" width="12" height="16" fill="#fff2c4">
      <animate attributeName="fill" dur="2s" repeatCount="indefinite"
               values="#fff2c4;#f6d27a;#fff2c4" />
    </rect>
    <rect x="4" y="28" width="22" height="4" fill="#3a2a1e" />
  </svg>
);