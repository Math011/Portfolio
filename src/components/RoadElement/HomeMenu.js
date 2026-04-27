import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const HomeMenu = ({ progress }) => {
  const { t } = useLanguage();

  // Animation regroupée : les 3 lignes apparaissent ENSEMBLE en un seul moment hero.
  // - Apparition : 2% → 6% (rapide, pour qu'on le voit dès le démarrage)
  // - Plateau    : 6% → 18% (bien visible plus longtemps qu'avant)
  // - Disparition: 18% → 22% (avant l'arrivée du titre "À propos")
  const heroStart = 2;
  const heroEnd = 22;

  const getStyles = (start, end) => {
    if (progress < start || progress >= end) return null;

    const normalized = (progress - start) / (end - start);

    let scale, translateY, opacity;

    if (normalized < 0.2) {
      // Apparition (zoom in)
      const t = normalized / 0.2;
      scale = 0.6 + t * 0.4;
      translateY = (1 - t) * 30;
      opacity = t;
    } else if (normalized < 0.8) {
      // Plateau
      scale = 1;
      translateY = 0;
      opacity = 1;
    } else {
      // Disparition (zoom out + fade)
      const t = (normalized - 0.8) / 0.2;
      scale = 1 + t * 0.15;
      translateY = -t * 40;
      opacity = 1 - t;
    }

    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: opacity,
    };
  };

  const heroStyles = getStyles(heroStart, heroEnd);
  if (!heroStyles) return null;

  return (
    <div className="roadOverlay">
      {/* Wrapper centré (position: absolute + center) ; l'animation translate
          s'applique au bloc enfant pour ne pas écraser le centrage. */}
      <div className="heroAnchor">
        <div className="heroBlock" style={heroStyles}>
          <p className="heroKicker">{t('welcome')}</p>
          <h1 className="heroName">{t('yourName')}</h1>
          <p className="heroJob">{t('developer')}</p>
        </div>
      </div>
    </div>
  );
};

export default HomeMenu;