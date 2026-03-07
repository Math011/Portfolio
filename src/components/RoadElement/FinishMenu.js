import React from 'react';
import './FinishMenu.css';

const FinishMenu = ({ progress, onRestart }) => {
  // Visible entre 85% et 100%
  const startProgress = 88;
  const endProgress = 100;
  
  // Confettis apparaissent plus tard (à 95%)
  const confettiStart = 91;
  const showConfetti = progress >= confettiStart;
  
  if (progress < startProgress) return null;

  const normalizedProgress = (progress - startProgress) / (endProgress - startProgress);
  
  let scale, translateY, opacity;
  
  if (normalizedProgress < 0.3) {
    const phaseProgress = normalizedProgress / 0.3;
    scale = 0.3 + phaseProgress * 0.7;
    translateY = phaseProgress * 120;
    opacity = phaseProgress;
  } else {
    // Reste visible jusqu'à la fin (pas de disparition)
    scale = 1;
    translateY = 120;
    opacity = 1;
  }

  return (
    <div className="finish-menu">
      {/* Confettis - apparaissent à 95% */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#7CB342', '#FFA726', '#42A5F5', '#EF5350', '#AB47BC'][i % 5]
              }}
            />
          ))}
        </div>
      )}
      
      {/* Message de fin */}
      <div 
        className="finish-content"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity: opacity
        }}
      >
        <div className="finish-flag">🏁</div>
        <h2 className="finish-title">Vous êtes arrivé à destination !</h2>
        <p className="finish-subtitle">Merci d'avoir parcouru mon portfolio</p>
        <button 
          className="finish-restart"
          onClick={onRestart}
        >
          Recommencer le voyage
        </button>
      </div>
    </div>
  );
};

export default FinishMenu;