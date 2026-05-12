import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import Header from '../../components/Header';
import DecorativeBackground from './DecorativeBackground';
import Balloon from './Balloon';
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

// Flèches gauche / droite pour navigation
const ArrowIcon = ({ direction }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
       style={{ transform: direction === 'right' ? 'rotate(180deg)' : 'none' }}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Galerie complète : image principale + flèches + thumbnails + lightbox
const ProjectGalleryFull = ({ gallery, projectTitle, t }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = gallery.length;

  const goPrev = useCallback(() => {
    setSelectedImage(i => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setSelectedImage(i => (i + 1) % total);
  }, [total]);

  // Navigation clavier dans la lightbox (et sur l'image principale)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, lightboxOpen]);

  // Empêche le scroll de la page derrière la lightbox
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  const hasMany = total > 1;

  return (
    <>
      {/* Cadre principal avec flèches */}
      <div className={styles.projectMainImage} data-testid="main-project-image">
        <img
          src={gallery[selectedImage]}
          alt={`${projectTitle} — image ${selectedImage + 1}`}
          onClick={() => setLightboxOpen(true)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x500/FFEA93/4A3728?text=Image+Projet';
          }}
        />

        {hasMany && (
          <>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowLeft}`}
              onClick={goPrev}
              aria-label={t('previousImage') || 'Image précédente'}
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowRight}`}
              onClick={goNext}
              aria-label={t('nextImage') || 'Image suivante'}
            >
              <ArrowIcon direction="right" />
            </button>
            <div className={styles.imageCounter}>
              {selectedImage + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails sous l'image principale */}
      {hasMany && (
        <div className={styles.projectGallery}>
          <h3>{t('projectGallery') || 'Galerie'}</h3>
          <div className={styles.galleryThumbnails}>
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.thumbnail} ${i === selectedImage ? styles.active : ''}`}
                onClick={() => setSelectedImage(i)}
                aria-label={`Voir image ${i + 1}`}
              >
                <img src={img} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox plein écran */}
      {lightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>

          <img
            className={styles.lightboxImage}
            src={gallery[selectedImage]}
            alt={`${projectTitle} — image ${selectedImage + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          {hasMany && (
            <>
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Image précédente"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Image suivante"
              >
                <ArrowIcon direction="right" />
              </button>
              <div className={styles.lightboxCounter}>
                {selectedImage + 1} / {total}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();

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

  // Détermine si on a des images à afficher. Si gallery est absent, vide,
  // ou ne contient que des chaînes vides → on n'affiche rien.
  const hasImages = project.gallery
    && project.gallery.length > 0
    && project.gallery.some(img => img && img.trim() !== '');

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

        {/* Galerie complète (image principale + flèches + thumbnails + lightbox) */}
        {hasImages && (
          <ProjectGalleryFull
            gallery={project.gallery.filter(img => img && img.trim() !== '')}
            projectTitle={projectTitle}
            t={t}
          />
        )}

        {/* Infos du projet */}
        <div className={styles.projectInfoSection}>
          <div className={styles.projectDescription}>
            {/* Si le projet a un composant de contenu enrichi (customContent),
                on l'utilise. Sinon, on retombe sur la traduction texte simple. */}
            {project.customContent ? (
              <project.customContent language={language} />
            ) : (
              <p>{t(project.fullDescriptionKey)}</p>
            )}
          </div>

          <div className={styles.projectTechnologies}>
            <h3>{t('technologiesUsed')}</h3>
            <div className={styles.techTags}>
              {project.tags.map((tag, index) => (
                <span key={index} className={styles.techTag}>
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