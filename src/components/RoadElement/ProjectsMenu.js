import React from 'react';
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
  const projectDuration = sectionRange / projects.length;

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
  const visibleProjects = projects.map((_, index) => getProjectStyles(index)).filter(Boolean);

  // Si rien n'est visible, ne rien afficher
  if (!titleStyles && visibleProjects.length === 0) return null;

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
            <a href={project.link} className="project-link">
              {t('projectLink')}
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsMenu;