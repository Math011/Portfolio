import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher = ({ fixed = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`${styles.languageSwitcher} ${fixed ? styles.fixed : ''}`}>
      <button 
        className={`${styles.langOption} ${language === 'fr' ? styles.active : ''}`}
        onClick={() => setLanguage('fr')}
        aria-label="Français"
      >
        FR
      </button>
      <span className={styles.langSeparator}>|</span>
      <button 
        className={`${styles.langOption} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;