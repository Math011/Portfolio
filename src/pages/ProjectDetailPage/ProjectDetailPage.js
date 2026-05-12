import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import Header from '../../components/Header';
import DecorativeBackground from './DecorativeBackground';
import Balloon from './Balloon';
import ProjectGallery from './ProjectGallery';
import ProjectNavigation from './ProjectNavigation';
import { generateBirds, generateClouds } from './generators';
import styles from './ProjectDetailPage.module.css';

// Générer les éléments décoratifs une seule fois
const decorativeBirds = generateBirds();
const decorativeClouds = generateClouds();

// Icône GitHub
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const projectIndex = projects.findIndex(p => p.id === parseInt(id));
  const project = projects[projectIndex];
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
  
  // Projet non trouvé
  if (!project) {
    return (
      <div className={`${styles.projectDetailPage}`}>
        <Header />
        <div className={styles.projectNotFound}>
          <h1>Projet non trouvé</h1>
          <Link to="/projects" className={styles.backLink}>{t('backToProjects')}</Link>
        </div>
      </div>
    );
  }

  const projectTitle = t(project.titleKey);

  return (
    <div className={`${styles.projectDetailPage}`}>
      <DecorativeBackground birds={decorativeBirds} clouds={decorativeClouds} />
      <Header />

      <div className={styles.projectDetailContent}>
        {/* En-tête avec ballon */}
        <div className={styles.projectHeader}>
          <div className={styles.balloonDecoration}>
            <Balloon color={project.color} />
          </div>
          <h1 className={styles.projectTitle}>{projectTitle}</h1>
        </div>

        {/* Image principale */}
        <div className={styles.projectMainImage} data-testid="main-project-image">
          <img 
            src={project.gallery[selectedImage]} 
            alt={projectTitle}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x500/FFEA93/4A3728?text=Image+Projet';
            }}
          />
        </div>

        {/* Galerie (juste sous l'image principale pour qu'on voie tout de suite
            qu'elle permet de changer l'image affichée) */}
        {project.gallery && project.gallery.length > 1 && (
          <ProjectGallery 
            gallery={project.gallery}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            projectTitle={projectTitle}
            t={t}
          />
        )}

        {/* Infos du projet */}
        <div className={styles.projectInfoSection}>
          <div className={styles.projectDescription}>
            <p>{t(project.fullDescriptionKey)}</p>
          </div>

          <div className={styles.projectTechnologies}>
            <h3>{t('technologiesUsed')}</h3>
            <div className={styles.techTags}>
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className={styles.techTag}
                  style={{ backgroundColor: project.color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.projectLinks}>
            {project.githubLink && (
              <a 
                href={project.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${styles.projectBtn} ${styles.githubBtn}`}
              >
                <GitHubIcon />
                {t('viewCode')}
              </a>
            )}
            {project.liveLink && project.liveLink !== '#' && (
              <a 
                href={project.liveLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${styles.projectBtn} ${styles.liveBtn}`}
                style={{ backgroundColor: project.color }}
              >
                {t('viewLive')}
              </a>
            )}
          </div>
        </div>

        {/* Navigation entre projets */}
        <ProjectNavigation 
          prevProject={prevProject}
          nextProject={nextProject}
          t={t}
        />
      </div>
    </div>
  );
};

export default ProjectDetailPage;