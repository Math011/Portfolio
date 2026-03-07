import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

const STORAGE_KEY = 'portfolio_language';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Récupère la langue sauvegardée ou utilise le français par défaut
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'fr' || saved === 'en')) {
        return saved;
      }
    } catch (e) {}
    return 'fr';
  });

  // Sauvegarde la langue dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {}
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};