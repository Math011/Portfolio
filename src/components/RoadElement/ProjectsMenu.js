import React from 'react';
import { projects } from '../../data/projects';
import './ProjectsMenu.css';

const ProjectsMenu = ({ progress }) => {
  // Section Projets : 40% à 60%
  // 4 projets répartis sur cette plage
  const sectionStart = 45;
  const sectionEnd =67;
  const sectionRange = sectionEnd - sectionStart;
  const projectDuration = sectionRange / projects.length;

  // Fonction pour calculer les styles d'un projet
  const getProjectStyles = (index) => {
    const startProgress = sectionStart + (index * projectDuration);
    const endProgress = startProgress + projectDuration;
    
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

    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: opacity
    };
  };

  // Vérifie si au moins un projet est visible
  const visibleProjects = projects.map((_, index) => getProjectStyles(index)).filter(Boolean);
  if (visibleProjects.length === 0) return null;

  return (
    <div className="projects-menu">
      {projects.map((project, index) => {
        const styles = getProjectStyles(index);
        if (!styles) return null;

        return (
          <div 
            key={project.id}
            className="project-card"
            style={styles}
          >
            <h2 className="project-title">{project.title}</h2>
            <p className="project-description">{project.description}</p>
            <a href={project.link} className="project-link">
              Voir le projet →
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsMenu;