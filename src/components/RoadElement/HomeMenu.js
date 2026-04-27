import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const HomeMenu = ({ progress }) => {
  const { t } = useLanguage();

  // Plage du hero : 2 → 26.
  const heroStart = 2;
  const heroEnd = 23.5;

  // Animation : entrée rapide, plateau LONG, sortie rapide.
  // On utilise un timing 0.2 / 0.95 / 0.05 (au lieu du standard 0.3 / 0.85 / 0.15)
  // pour que le plateau dure plus longtemps. Comme la position du nœud Accueil
  // est à 20% du progress global, et que le plateau standard du Hero finissait
  // trop tôt (84% de la fenêtre), le hero était déjà en sortie au moment du
  // clic. Ce timing élargi le maintient pleinement visible.
  const getStyles = (start, end) => {
    if (progress < start || progress >= end) return null;

    const normalizedProgress = (progress - start) / (end - start);

    let scale, translateY, opacity;

    if (normalizedProgress < 0.2) {
      const phaseProgress = normalizedProgress / 0.2;
      scale = 0.3 + phaseProgress * 0.7;
      translateY = phaseProgress * 140;
      opacity = phaseProgress;
    } else if (normalizedProgress < 0.95) {
      scale = 1;
      translateY = 140;
      opacity = 1;
    } else {
      const phaseProgress = (normalizedProgress - 0.95) / 0.05;
      scale = 1 + phaseProgress * 0.3;
      translateY = 140 + phaseProgress * 60;
      opacity = 1 - phaseProgress;
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
      {/* Plus de wrapper heroAnchor : le bloc est directement dans roadOverlay
          qui centre déjà via flex (align-items: center; justify-content: center).
          Comme ça, le hero arrive et part exactement au même endroit que les
          .roadCard des autres sections. */}
      <div className="heroBlock" style={heroStyles}>
        <p className="heroKicker">{t('welcome')}</p>
        <h1 className="heroName">{t('yourName')}</h1>
        <p className="heroJob">{t('developer')}</p>
      </div>
    </div>
  );
};

export default HomeMenu;