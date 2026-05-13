import React from 'react';
import styles from '../ProjectDetailPage.module.css';

// Oiseau SVG animé (partagé avec ProjectsPage)
const Bird = ({ size = 30, color = '#4A3728', direction = 'right' }) => (
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

export default Bird;