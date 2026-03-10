import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './ContactMenu.module.css';

const ContactMenu = ({ progress }) => {
  const { t } = useLanguage();
  
  // Section Contact : 60% → 80%
  const titleStart = 62;
  const titleEnd = 69;
  
  const cardStart = 70;
  const cardEnd = 82;
  
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
    <div className={styles.contactMenu}>
      {/* Titre */}
      {titleStyles && (
        <h2 className={styles.sectionTitle} style={titleStyles}>
          {t('contactTitle')}
        </h2>
      )}
      
      {/* Carte */}
      {cardStyles && (
        <div className={styles.card} style={cardStyles}>
          <h2 className={styles.title}>{t('contact')}</h2>
          <p className={styles.description}>
            {t('contactDescription')}
          </p>
          <a href="/contact" className={styles.link}>
            {t('contactLink')}
          </a>
        </div>
      )}
    </div>
  );
};

export default ContactMenu;