import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LoadingScreen.css';

const LoadingScreen = ({ isLoading }) => {
  const { t } = useLanguage();
  
  if (!isLoading) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-road">
          <div className="loading-line"></div>
        </div>
        <p className="loading-text">{t('loading')}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;