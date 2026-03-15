import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import Header from '../../components/Header';
import styles from './ProjectDetailPage.module.css';

// Oiseau SVG animé (même composant que ProjectsPage)
const Bird = ({ size = 30, color = '#4A3728', direction = 'right' }) => (
  <svg 
    width={size} 
    height={size * 0.5} 
    viewBox="0 0 40 20" 
    className={styles.birdSvg}
    style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
  >
    <path 
      className={styles.birdWingLeft}
      d="M20 10 Q10 2, 2 8" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none"
      strokeLinecap="round"
    />
    <path 
      className={styles.birdWingRight}
      d="M20 10 Q30 2, 38 8" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="20" cy="11" rx="4" ry="2.5" fill={color} />
    <circle cx="26" cy="10" r="2" fill={color} />
    <path d="M28 10 L31 10.5 L28 11" fill={color} />
  </svg>
);

// Génération des oiseaux - adaptée à une page plus courte
const generateBirds = () => {
  const birds = [];
  const totalBirds = 8;
  const maxHeight = 800;
  
  const seededRandom = (seed) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < totalBirds; i++) {
    const seed = i + 100;
    const isLeft = seededRandom(seed * 7) > 0.5;
    const topPosition = 80 + seededRandom(seed * 3) * maxHeight;
    
    birds.push({
      id: i + 1,
      top: `${topPosition}px`,
      left: isLeft ? '-5%' : undefined,
      right: !isLeft ? '-5%' : undefined,
      size: Math.round(20 + seededRandom(seed * 11) * 16),
      direction: isLeft ? 'right' : 'left',
      duration: Math.round(18 + seededRandom(seed * 13) * 18),
      delay: Math.round(-(seededRandom(seed * 17) * 30)),
    });
  }
  
  return birds;
};

const decorativeBirds = generateBirds();

// Configuration des nuages
const CLOUD_IMAGES = ['nuage1.svg', 'nuage2.svg', 'nuage3.svg', 'nuage5.svg'];
const CLOUD_SIZES = ['small', 'medium', 'large'];

const SIZE_TO_CLASS = {
  'small': 'sizeSmall',
  'medium': 'sizeMedium',
  'large': 'sizeLarge',
  'xlarge': 'sizeXlarge'
};

const SPEED_TO_CLASS = {
  'slow': 'speedSlow',
  'normal': 'speedNormal',
  'fast': 'speedFast'
};

const generateClouds = () => {
  const clouds = [];
  const numberOfClouds = 10;
  const maxHeight = 900;
  
  const seededRandom = (seed) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < numberOfClouds; i++) {
    const seed = i + 50;
    const imageIndex = Math.floor(seededRandom(seed * 1.5) * CLOUD_IMAGES.length);
    const sizeIndex = Math.floor(seededRandom(seed * 2.5) * CLOUD_SIZES.length);
    const top = 50 + seededRandom(seed * 3) * maxHeight;
    
    clouds.push({
      id: i + 1,
      image: CLOUD_IMAGES[imageIndex],
      top: `${Math.round(top)}px`,
      size: CLOUD_SIZES[sizeIndex],
      direction: seededRandom(seed * 6) > 0.5 ? 'left' : 'right',
      speed: ['slow', 'normal', 'fast'][Math.floor(seededRandom(seed * 4) * 3)]
    });
  }
  
  return clouds;
};

const decorativeClouds = generateClouds();

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const projectIndex = projects.findIndex(p => p.id === parseInt(id));
  const project = projects[projectIndex];

  // Projets précédent et suivant
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
  
  // Si projet non trouvé
  if (!project) {
    return (
      <div className={styles.projectDetailPage}>
        <Header />
        <div className={styles.projectNotFound}>
          <h1>Projet non trouvé</h1>
          <Link to="/projects" className={styles.backLink}>{t('backToProjects')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectDetailPage}>
      {/* Oiseaux décoratifs */}
      <div className={styles.backgroundBirds}>
        {decorativeBirds.map((bird) => (
          <div
            key={bird.id}
            className={`${styles.flyingBird} ${bird.direction === 'left' ? styles.directionLeft : styles.directionRight}`}
            style={{
              top: bird.top,
              left: bird.left,
              right: bird.right,
              animationDuration: `${bird.duration}s`,
              animationDelay: `${bird.delay}s`,
            }}
          >
            <Bird size={bird.size} direction={bird.direction} />
          </div>
        ))}
      </div>

      {/* Nuages décoratifs */}
      <div className={styles.backgroundClouds}>
        {decorativeClouds.map((cloud) => (
          <img
            key={cloud.id}
            src={`/images/${cloud.image}`}
            alt=""
            className={`${styles.bgCloud} ${styles[SIZE_TO_CLASS[cloud.size]]} ${cloud.direction === 'left' ? styles.directionLeft : styles.directionRight} ${styles[SPEED_TO_CLASS[cloud.speed]]}`}
            style={{ top: cloud.top }}
          />
        ))}
      </div>

      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <div className={styles.projectDetailContent}>
        {/* En-tête avec ballon */}
        <div className={styles.projectHeader}>
          <div className={styles.balloonDecoration} style={{ color: project.color }}>
            <svg width="60" height="100" viewBox="0 0 40 70" className={styles.headerBalloon}>
              <ellipse cx="20" cy="22" rx="18" ry="22" fill={project.color} />
              <ellipse cx="20" cy="22" rx="18" ry="22" fill="url(#balloonShineDetail)" />
              <polygon points="17,43 20,48 23,43" fill={project.color} />
              <path d="M20 48 C22 55, 18 62, 20 70" stroke="#8B7355" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <defs>
                <radialGradient id="balloonShineDetail" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <h1 className={styles.projectTitle}>{t(project.titleKey)}</h1>
        </div>

        {/* Image principale */}
        <div className={styles.projectMainImage} data-testid="main-project-image">
          <img 
            src={project.gallery[selectedImage]} 
            alt={t(project.titleKey)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x500/FFEA93/4A3728?text=Image+Projet';
            }}
          />
        </div>

        {/* Galerie miniatures */}
        <div className={styles.projectGallery}>
          <h3>{t('projectGallery')}</h3>
          <div className={styles.galleryThumbnails}>
            {project.gallery.map((img, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                onClick={() => setSelectedImage(index)}
                aria-label={`${t(project.titleKey)} - image ${index + 1}`}
                aria-pressed={selectedImage === index}
              >
                <img 
                  src={img} 
                  alt={`${t(project.titleKey)} - ${index + 1}`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x100/FFEA93/4A3728?text=Image';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Description et infos */}
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
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
        <div className={styles.projectNavigation}>
          {prevProject ? (
            <Link 
              to={`/project/${prevProject.id}`} 
              className={`${styles.navBtn} ${styles.prevBtn}`}
            >
              {t('previousProject')}
            </Link>
          ) : (
            <div className={styles.navPlaceholder}></div>
          )}
          
          <Link to="/projects" className={`${styles.navBtn} ${styles.allBtn}`}>
            {t('backToProjects')}
          </Link>
          
          {nextProject ? (
            <Link 
              to={`/project/${nextProject.id}`} 
              className={`${styles.navBtn} ${styles.nextBtn}`}
            >
              {t('nextProject')}
            </Link>
          ) : (
            <div className={styles.navPlaceholder}></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;