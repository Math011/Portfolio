import React, { useState } from 'react';
import styles from '../AboutPage.module.css';

// Polaroid avec scotch + photo. Fallback en initiales si l'image manque
// ou ne peut pas se charger.
const Polaroid = ({ initials = 'MR', photoUrl }) => {
  const [hasError, setHasError] = useState(false);
  const showImage = photoUrl && !hasError;

  return (
    <div className={styles.polaroid}>
      <span className={styles.tape} aria-hidden="true" />
      <div className={styles.polaroidPhoto}>
        {showImage
          ? <img src={photoUrl} alt="" onError={() => setHasError(true)} />
          : <span className={styles.polaroidInitials}>{initials}</span>}
      </div>
      <p className={styles.polaroidCaption}>— Voyageur</p>
    </div>
  );
};

export default Polaroid;
