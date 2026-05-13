import React from 'react';
import styles from '../ProjectDetailPage.module.css';

const Balloon = ({ color }) => (
  <svg width="60" height="100" viewBox="0 0 40 70" className={styles.headerBalloon}>
    <ellipse cx="20" cy="22" rx="18" ry="22" fill={color} />
    <ellipse cx="20" cy="22" rx="18" ry="22" fill="url(#balloonShineDetail)" />
    <polygon points="17,43 20,48 23,43" fill={color} />
    <path d="M20 48 C22 55, 18 62, 20 70" stroke="#8B7355" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <defs>
      <radialGradient id="balloonShineDetail" cx="30%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export default Balloon;