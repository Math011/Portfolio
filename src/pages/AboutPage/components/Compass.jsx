import React from 'react';
import styles from '../AboutPage.module.css';

// Boussole décorative : aiguille orientée vers le NE (l'horizon).
const Compass = () => (
  <div className={styles.compass} aria-hidden="true">
    <span className={styles.compassNeedle} />
    <span className={styles.compassN}>N</span>
    <span className={styles.compassS}>S</span>
    <span className={styles.compassE}>E</span>
    <span className={styles.compassW}>W</span>
  </div>
);

export default Compass;
