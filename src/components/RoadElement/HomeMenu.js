import React from 'react';
import './HomeMenu.css';

const HomeMenu = ({ progress }) => {
  // Plage de visibilité : 5% à 25%
  const startProgress = 5;
  const endProgress = 28;
  
  // Cache complètement hors de la plage
  if (progress < startProgress || progress >= endProgress) return null;

  // Normalise la progression entre 0 et 1
  const normalizedProgress = (progress - startProgress) / (endProgress - startProgress);
  
  let scale, translateY;
  
  if (normalizedProgress < 0.3) {
    // Phase 1 : Apparition - descend et grandit
    const phaseProgress = normalizedProgress / 0.3;
    scale = 0.3 + phaseProgress * 0.7;
    translateY = phaseProgress * 80; // 0 → 80
    
  } else if (normalizedProgress < 0.7) {
    // Phase 2 : Stable - reste en place
    scale = 1;
    translateY = 80;
    
  } else {
    // Phase 3 : Disparition - continue de descendre et grandit
    const phaseProgress = (normalizedProgress - 0.7) / 0.3;
    scale = 1 + phaseProgress * 0.3;
    translateY = 80 + phaseProgress * 120; // 80 → 200
  }
  
  // Opacity : transparent → opaque → transparent
  const opacity = normalizedProgress < 0.3 
    ? normalizedProgress / 0.3 
    : normalizedProgress > 0.7 
      ? (1 - normalizedProgress) / 0.3 
      : 1;

  return (
    <div className="home-menu">
      <div 
        className="home-menu-content"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity: opacity
        }}
      >
        <h1 className="home-title">Bienvenue sur mon Portfolio</h1>
      </div>
    </div>
  );
};

export default HomeMenu;