import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const HomeMenu = ({ progress }) => {
  const { t } = useLanguage();

  const heroStart = 2;
  const heroEnd = 23.5;

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
      opacity: opacity,
    };
  };

  const heroStyles = getStyles(heroStart, heroEnd);
  if (!heroStyles) return null;

  return (
    <div className="roadOverlay">
      <div className="heroBlock" style={heroStyles}>
        <p className="heroKicker">{t('welcome')}</p>
        <h1 className="heroName">{t('yourName')}</h1>
        <p className="heroJob">{t('developer')}</p>
      </div>
    </div>
  );
};

export default HomeMenu;