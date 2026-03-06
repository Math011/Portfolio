import React from 'react';
import './AboutMenu.css';

const AboutMenu = ({ progress }) => {
  // Visible entre 25% et 45% (section À propos)
  const startProgress = 27;
  const endProgress = 45;
  
  if (progress < startProgress || progress >= endProgress) return null;

  const normalizedProgress = (progress - startProgress) / (endProgress - startProgress);
  
  let scale, translateY, opacity;
  
  if (normalizedProgress < 0.3) {
    // Phase 1 : Apparition
    const phaseProgress = normalizedProgress / 0.3;
    scale = 0.3 + phaseProgress * 0.7;
    translateY = phaseProgress * 120;
    opacity = phaseProgress;
  } else if (normalizedProgress < 0.85) {
    // Phase 2 : Stable
    scale = 1;
    translateY = 120;
    opacity = 1;
  } else {
    // Phase 3 : Disparition
    const phaseProgress = (normalizedProgress - 0.85) / 0.15;
    scale = 1 + phaseProgress * 0.3;
    translateY = 120 + phaseProgress * 60;
    opacity = 1 - phaseProgress;
  }

  return (
    <div className="about-menu">
      <div 
        className="about-card"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity: opacity
        }}
      >
        <h2 className="about-title">À propos</h2>
        <p className="about-description">
          Passionné par le développement web, je crée des expériences 
          digitales uniques et innovantes.
        </p>
        <a href="/about" className="about-link">
          En savoir plus →
        </a>
      </div>
    </div>
  );
};

export default AboutMenu;