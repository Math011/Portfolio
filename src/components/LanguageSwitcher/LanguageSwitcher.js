import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span className={`lang-option ${language === 'fr' ? 'active' : ''}`}>FR</span>
      <span className="lang-separator">|</span>
      <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
    </button>
  );
};

export default LanguageSwitcher;