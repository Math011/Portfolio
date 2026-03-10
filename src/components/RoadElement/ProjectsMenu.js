import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import './ProjectsMenu.css';

const ProjectsMenu = ({ progress }) => {
  const { t } = useLanguage();
  
  //Section Projets : 40% → 60%
  const titleStart = 42;
  const titleEnd = 45;
  
  const sectionStart = 45;
  const sectionEnd = 61;
  const sectionRange = sectionEnd - sectionStart;
  const totalCards = projects.length + 1; // +1 pour la carte "voir tous"
  const projectDuration = sectionRange / totalCards;

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

  // Fonction pour calculer les styles d'un projet
  const getProjectStyles = (index) => {
    const startProgress = sectionStart + (index * projectDuration);
    const endProgress = startProgress + projectDuration;
    return getStyles(startProgress, endProgress);
  };

  const titleStyles = getStyles(titleStart, titleEnd);
  
  // Styles pour la carte "voir tous les projets" (dernière carte)
  const viewAllStyles = getProjectStyles(projects.length);
  
  const visibleProjects = projects.map((_, index) => getProjectStyles(index)).filter(Boolean);

  // Si rien n'est visible, ne rien afficher
  if (!titleStyles && visibleProjects.length === 0 && !viewAllStyles) return null;

  return (
    <div className="projects-menu">
      {/* Titre */}
      {titleStyles && (
        <h2 className="projects-section-title" style={titleStyles}>
          {t('projectsTitle')}
        </h2>
      )}
      
      {/* Cartes projets */}
      {projects.map((project, index) => {
        const styles = getProjectStyles(index);
        if (!styles) return null;

        return (
          <div 
            key={project.id}
            className="project-card"
            style={styles}
          >
            <h2 className="project-title">{t(project.titleKey)}</h2>
            <p className="project-description">{t(project.descriptionKey)}</p>
            <Link to={`/project/${project.id}`} className="project-link">
              {t('projectLink')}
            </Link>
          </div>
        );
      })}

      {/* Carte "Voir tous les projets" */}
      {viewAllStyles && (
        <Link 
          to="/projects"
          className="project-card view-all-card"
          style={viewAllStyles}
        >
          <div className="view-all-content">
            <h2 className="project-title">{t('viewAllProjects')}</h2>
            <span className="view-all-icon">→</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ProjectsMenu;