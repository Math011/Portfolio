import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './AboutMenu.css';

const AboutMenu = ({ progress }) => {
  const { t } = useLanguage();
  
  // Section à propos : 20% → 40%
  const titleStart = 23;
  const titleEnd = 30;
  
  const cardStart = 30;
  const cardEnd = 42;
  
  // Fonction pour calculer les styles d'animation
  const getStyles = (start, end) => {
    if (progress < start || progress >= end) return null;
    
    const normalizedProgress = (progress - start) / (end - start);
    
    let scale, translateY, opacity;
    
    if (normalizedProgress < 0.3) {
      const phaseProgress = normalizedProgress / 0.3;
      scale = 0.3 + phaseProgress * 0.7;
      translateY = phaseProgress * 120;
      opacity = phaseProgress;
    } else if (normalizedProgress < 0.85) {
      scale = 1;
      translateY = 120;
      opacity = 1;
    } else {
      const phaseProgress = (normalizedProgress - 0.85) / 0.15;
      scale = 1 + phaseProgress * 0.3;
      translateY = 120 + phaseProgress * 60;
      opacity = 1 - phaseProgress;
    }
    
    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: opacity
    };
  };

  const titleStyles = getStyles(titleStart, titleEnd);
  const cardStyles = getStyles(cardStart, cardEnd);

  // Si rien n'est visible, ne rien afficher
  if (!titleStyles && !cardStyles) return null;

  return (
    <div className="about-menu">
      {/* Titre */}
      {titleStyles && (
        <h2 className="about-section-title" style={titleStyles}>
          {t('aboutTitle')}
        </h2>
      )}
      
      {/* Carte */}
      {cardStyles && (
        <div className="about-card" style={cardStyles}>
          <h2 className="about-title">{t('about')}</h2>
          <p className="about-description">
            {t('aboutDescription')}
          </p>
          <a href="/about" className="about-link">
            {t('aboutLink')}
          </a>
        </div>
      )}
    </div>
  );
};

export default AboutMenu;