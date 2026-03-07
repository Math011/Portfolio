import React from 'react';
import './ContactMenu.css';

const ContactMenu = ({ progress }) => {
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
    <div className="contact-menu">
      {/* Titre */}
      {titleStyles && (
        <h2 className="contact-section-title" style={titleStyles}>
          Mes Contacts
        </h2>
      )}
      
      {/* Carte */}
      {cardStyles && (
        <div className="contact-card" style={cardStyles}>
          <h2 className="contact-title">Contact</h2>
          <p className="contact-description">
            Une question ou un projet en tête ? 
            N'hésitez pas à me contacter !
          </p>
          <a href="/contact" className="contact-link">
            Me contacter →
          </a>
        </div>
      )}
    </div>
  );
};

export default ContactMenu;