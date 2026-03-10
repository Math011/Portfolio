import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './HomeMenu.module.css';

const HomeMenu = ({ progress }) => {
  const { t } = useLanguage();
  
  // Fonction pour calculer les styles d'un texte
  const getTextStyles = (startProgress, endProgress) => {
    if (progress < startProgress || progress >= endProgress) return null;
    
    const normalizedProgress = (progress - startProgress) / (endProgress - startProgress);
    
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

  // Timing des 3 textes (sans chevauchement)
  const welcomeStyles = getTextStyles(2, 9);
  const titleStyles = getTextStyles(9, 16);
  const nameStyles = getTextStyles(16, 23);

  // Si aucun texte visible, ne rien afficher
  if (!welcomeStyles && !titleStyles && !nameStyles) return null;

  return (
    <div className={styles.homeMenu}>
      {welcomeStyles && (
        <div className={styles.content} style={welcomeStyles}>
          <h2 className={styles.subtitle}>{t('welcome')}</h2>
        </div>
      )}
      
      {titleStyles && (
        <div className={styles.content} style={titleStyles}>
          <h2 className={styles.job}>{t('developer')}</h2>
        </div>
      )}
      
      {nameStyles && (
        <div className={styles.content} style={nameStyles}>
          <h1 className={styles.name}>{t('yourName')}</h1>
        </div>
      )}
    </div>
  );
};

export default HomeMenu;