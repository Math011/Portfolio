import React from 'react';
import styles from '../ProjectsPage.module.css';

// Composant Ballon SVG pour les cartes
export const Balloon = ({ color = '#7CB342' }) => (
  <svg width="56" height="96" viewBox="0 0 40 70" className={styles.balloonSvg}>
    <ellipse cx="20" cy="22" rx="18" ry="22" fill={color} />
    <ellipse cx="20" cy="22" rx="18" ry="22" fill="url(#balloonShine)" />
    <polygon points="17,43 20,48 23,43" fill={color} />
    <path 
      d="M20 48 C22 55, 18 62, 20 70" 
      stroke="#8B7355" 
      strokeWidth="1.5" 
      fill="none"
      strokeLinecap="round"
    />
    <defs>
      <radialGradient id="balloonShine" cx="30%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

// Oiseau SVG animé
export const Bird = ({ size = 30, color = '#4A3728', direction = 'right' }) => (
  <svg 
    width={size} 
    height={size * 0.5} 
    viewBox="0 0 40 20" 
    className={styles.birdSvg}
    style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
  >
    <path 
      className={styles.birdWingLeft}
      d="M20 10 Q10 2, 2 8" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none"
      strokeLinecap="round"
    />
    <path 
      className={styles.birdWingRight}
      d="M20 10 Q30 2, 38 8" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="20" cy="11" rx="4" ry="2.5" fill={color} />
    <circle cx="26" cy="10" r="2" fill={color} />
    <path d="M28 10 L31 10.5 L28 11" fill={color} />
  </svg>
);