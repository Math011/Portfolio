import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';

const ProjectsMenu = ({ progress }) => {
  const { t } = useLanguage();

  // Section Projets : 42 → 63
  const titleStart = 42;
  const titleEnd = 49;

  const cardStart = 49;
  const cardEnd = 63;

  // Fonction pour calculer les styles d'animation.
  const getStyles = (start, end) => {
    if (progress < start || progress >= end) return null;

    const normalizedProgress = (progress - start) / (end - start);

    let scale, translateY, opacity;

    if (normalizedProgress < 0.2) {
      const phaseProgress = normalizedProgress / 0.2;
      scale = 0.3 + phaseProgress * 0.7;
      translateY = phaseProgress * 120;
      opacity = phaseProgress;
    } else if (normalizedProgress < 0.95) {
      scale = 1;
      translateY = 120;
      opacity = 1;
    } else {
      const phaseProgress = (normalizedProgress - 0.95) / 0.05;
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

  // Compteur dynamique : nombre total de projets
  const projectCount = projects.length;

  return (
    <div className="roadOverlay">
      {/* Titre flottant */}
      {titleStyles && (
        <h2 className="sectionTitle" style={titleStyles}>
          {t('projectsTitle')}
        </h2>
      )}

      {/* Carte unique "Voir tous mes projets" */}
      {cardStyles && (
        <div className="roadCard" style={cardStyles}>
          <p className="roadKicker">— 03 {t('projects')} · {projectCount}</p>
          <h2 className="roadTitle">{t('projectsTitle')}</h2>
          <p className="roadDescription">
            {t('projectsTeaser')}
          </p>
          <Link to="/projects" className="roadLink">
            {t('viewAllProjects')} →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsMenu;