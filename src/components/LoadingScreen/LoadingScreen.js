import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './LoadingScreen.module.css';

const LoadingScreen = ({ isLoading }) => {
  const { t } = useLanguage();
  
  if (!isLoading) return null;

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.content}>
        <div className={styles.road}>
          <div className={styles.line}></div>
        </div>
        <p className={styles.text}>{t('loading')}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;