import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import './ProjectDetailPage.css';

// Oiseau SVG animé (même composant que ProjectsPage)
const Bird = ({ size = 30, color = '#4A3728', direction = 'right' }) => (
  <svg 
    width={size} 
    height={size * 0.5} 
    viewBox="0 0 40 20" 
    className="bird-svg"
    style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
  >
    <path 
      className="bird-wing-left"
      d="M20 10 Q10 2, 2 8" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none"
      strokeLinecap="round"
    />
    <path 
      className="bird-wing-right"
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
  const maxHeight = 800; // Hauteur limitée
  
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

// Configuration des nuages - adaptée à une page plus courte
const CLOUD_IMAGES = ['nuage1.svg', 'nuage2.svg', 'nuage3.svg', 'nuage5.svg'];
const CLOUD_SIZES = ['small', 'medium', 'large'];

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
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Trouver le projet
  const projectIndex = projects.findIndex(p => p.id === parseInt(id));
  const project = projects[projectIndex];
  
  // Projets précédent et suivant
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
  
  // Si projet non trouvé
  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="project-not-found">
          <h1>Projet non trouvé</h1>
          <Link to="/projects" className="back-link">{t('backToProjects')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* Oiseaux décoratifs */}
      <div className="background-birds">
        {decorativeBirds.map((bird) => (
          <div
            key={bird.id}
            className={`flying-bird direction-${bird.direction}`}
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
      <div className="background-clouds">
        {decorativeClouds.map((cloud) => (
          <img
            key={cloud.id}
            src={`/images/${cloud.image}`}
            alt=""
            className={`bg-cloud size-${cloud.size} direction-${cloud.direction} speed-${cloud.speed}`}
            style={{ top: cloud.top }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="project-detail-nav">
        <div className="nav-links">
          <Link to="/" className="nav-link">{t('home')}</Link>
          <Link to="/about" className="nav-link">{t('about')}</Link>
          <Link to="/projects" className="nav-link active">{t('projects')}</Link>
          <Link to="/contact" className="nav-link">{t('contact')}</Link>
        </div>
        <div className="nav-language">
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="project-detail-content">
        {/* En-tête avec ballon */}
        <div className="project-header">
          <div className="balloon-decoration" style={{ color: project.color }}>
            <svg width="60" height="100" viewBox="0 0 40 70" className="header-balloon">
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
          <h1 className="project-title">{t(project.titleKey)}</h1>
        </div>

        {/* Image principale */}
        <div className="project-main-image">
          <img 
            src={project.gallery[selectedImage]} 
            alt={t(project.titleKey)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x500/FFEA93/4A3728?text=Image+Projet';
            }}
          />
        </div>

        {/* Galerie miniatures */}
        <div className="project-gallery">
          <h3>{t('projectGallery')}</h3>
          <div className="gallery-thumbnails">
            {project.gallery.map((img, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
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
        <div className="project-info-section">
          {/* Description */}
          <div className="project-description">
            <p>{t(project.fullDescriptionKey)}</p>
          </div>

          {/* Technologies */}
          <div className="project-technologies">
            <h3>{t('technologiesUsed')}</h3>
            <div className="tech-tags">
              {project.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="tech-tag"
                  style={{ backgroundColor: project.color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Liens */}
          <div className="project-links">
            {project.githubLink && (
              <a 
                href={project.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-btn github-btn"
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
                className="project-btn live-btn"
                style={{ backgroundColor: project.color }}
              >
                {t('viewLive')}
              </a>
            )}
          </div>
        </div>

        {/* Navigation entre projets */}
        <div className="project-navigation">
          {prevProject ? (
            <Link 
              to={`/project/${prevProject.id}`} 
              className="nav-btn prev-btn"
            >
              {t('previousProject')}
            </Link>
          ) : (
            <div className="nav-placeholder"></div>
          )}
          
          <Link to="/projects" className="nav-btn all-btn">
            {t('backToProjects')}
          </Link>
          
          {nextProject ? (
            <Link 
              to={`/project/${nextProject.id}`} 
              className="nav-btn next-btn"
            >
              {t('nextProject')}
            </Link>
          ) : (
            <div className="nav-placeholder"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;