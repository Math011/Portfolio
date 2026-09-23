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
    <path className={styles.birdWingLeft} d="M20 10 Q10 2, 2 8" 
          fill="none" stroke="#4A3728" strokeWidth="2.5" strokeLinecap="round">
      <animate
        attributeName="d"
        values="M20 10 Q10 2, 2 8;
                M20 10 Q10 14, 2 12;
                M20 10 Q10 2, 2 8"
        dur="0.3s"
        repeatCount="indefinite" />
    </path>

    <path className={styles.birdWingRight} d="M20 10 Q30 2, 38 8"
          fill="none" stroke="#4A3728" strokeWidth="2.5" strokeLinecap="round">
      <animate
        attributeName="d"
        values="M20 10 Q30 2, 38 8;
                M20 10 Q30 14, 38 12;
                M20 10 Q30 2, 38 8"
        dur="0.3s"
        repeatCount="indefinite" />
    </path>
      <ellipse cx="20" cy="11" rx="4" ry="2.5" fill={color} />
      <circle cx="26" cy="10" r="2" fill={color} />
      <path d="M28 10 L31 10.5 L28 11" fill={color} />
  </svg>
);

export default Bird;