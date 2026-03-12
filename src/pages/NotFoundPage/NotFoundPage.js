import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      {/* Nuages décoratifs */}
      <img 
        src="/images/nuage1.svg" 
        alt="" 
        className={`${styles.cloud} ${styles.cloud1}`} 
      />
      <img 
        src="/images/nuage2.svg" 
        alt="" 
        className={`${styles.cloud} ${styles.cloud2}`} 
      />
      <img 
        src="/images/nuage3.svg" 
        alt="" 
        className={`${styles.cloud} ${styles.cloud3}`} 
      />

      {/* Contenu principal */}
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>{t('notFoundTitle')}</h2>
        <p className={styles.message}>{t('notFoundMessage')}</p>
        
        <div className={styles.balloon}>
          <svg viewBox="0 0 100 120" className={styles.balloonSvg}>
            {/* Ficelle */}
            <path
              d="M50 85 Q 48 95, 50 105 Q 52 115, 50 120"
              stroke="#4A3728"
              strokeWidth="1"
              fill="none"
            />
            {/* Ballon */}
            <ellipse
              cx="50"
              cy="45"
              rx="35"
              ry="40"
              fill="#E74C3C"
            />
            {/* Reflet */}
            <ellipse
              cx="38"
              cy="35"
              rx="8"
              ry="12"
              fill="rgba(255,255,255,0.3)"
            />
            {/* Nœud */}
            <polygon
              points="45,83 55,83 50,90"
              fill="#C0392B"
            />
          </svg>
        </div>

        <Link to="/" className={styles.homeButton}>
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;