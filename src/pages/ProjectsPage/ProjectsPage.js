import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';

// Composant Ballon SVG
const Balloon = ({ color = '#7CB342' }) => (
  <svg width="40" height="60" viewBox="0 0 40 60" className="balloon-svg">
    <ellipse cx="20" cy="22" rx="18" ry="22" fill={color} />
    <ellipse cx="20" cy="22" rx="18" ry="22" fill="url(#balloonShine)" />
    <polygon points="17,44 20,48 23,44" fill={color} />
    <path d="M20 48 Q22 52 18 56 Q22 58 20 60" stroke="#8B7355" strokeWidth="1.5" fill="none" />
    <defs>
      <radialGradient id="balloonShine" cx="30%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

// Configuration des nuages - défini en dehors du composant
const CLOUD_IMAGES = ['nuage1.svg', 'nuage2.svg', 'nuage3.svg', 'nuage5.svg'];
const CLOUD_SIZES = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];
const CLOUD_SPEEDS = ['slow', 'normal', 'fast'];

// Opacité liée à la taille (plus petit = plus loin = moins visible)
const SIZE_TO_OPACITY = {
  'xsmall': 'very-light',
  'small': 'light',
  'medium': 'medium-light',
  'large': 'medium',
  'xlarge': 'medium-dark',
  'xxlarge': 'dark'
};

// Fonction pour générer un nombre pseudo-aléatoire stable basé sur un seed
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Générer les nuages une seule fois (en dehors du composant)
const generateClouds = (numberOfProjects) => {
  const clouds = [];
  
  // Plus de nuages pour éviter les zones vides
  const numberOfClouds = numberOfProjects * 8 + 10;
  const verticalSpacing = 55;
  
  for (let i = 0; i < numberOfClouds; i++) {
    const seed = i + 1;
    
    // Calculer l'index précédent pour éviter répétition
    const prevImageIndex = i > 0 ? Math.floor(seededRandom(i * 1) * (CLOUD_IMAGES.length - 1)) : -1;
    const prevSizeIndex = i > 0 ? Math.floor(seededRandom(i * 2) * (CLOUD_SIZES.length - 1)) : -1;
    
    // Choisir un index différent du précédent
    let imageIndex = Math.floor(seededRandom(seed * 1) * CLOUD_IMAGES.length);
    if (imageIndex === prevImageIndex) {
      imageIndex = (imageIndex + 1) % CLOUD_IMAGES.length;
    }
    
    let sizeIndex = Math.floor(seededRandom(seed * 2) * CLOUD_SIZES.length);
    if (sizeIndex === prevSizeIndex) {
      sizeIndex = (sizeIndex + 1) % CLOUD_SIZES.length;
    }
    
    const image = CLOUD_IMAGES[imageIndex];
    const size = CLOUD_SIZES[sizeIndex];
    
    // Opacité liée à la taille
    const opacity = SIZE_TO_OPACITY[size];
    
    // Vitesse aléatoire
    const speedIndex = Math.floor(seededRandom(seed * 4) * CLOUD_SPEEDS.length);
    const speed = CLOUD_SPEEDS[speedIndex];
    
    // Direction alternée
    const direction = i % 2 === 0 ? 'left' : 'right';
    
    clouds.push({
      id: i + 1,
      image,
      top: `${20 + (i * verticalSpacing)}px`,
      size,
      opacity,
      direction,
      speed
    });
  }
  
  return clouds;
};

const ProjectsPage = () => {
  const { t } = useLanguage();

  // Liste des projets
  const projects = [
    {
      id: 1,
      titleKey: 'project1_title',
      descriptionKey: 'project1_description',
      image: '/images/projects/project1.jpg',
      tags: ['React', 'Node.js', 'MongoDB'],
      link: '#',
      color: '#7CB342'
    },
    {
      id: 2,
      titleKey: 'project2_title',
      descriptionKey: 'project2_description',
      image: '/images/projects/project2.jpg',
      tags: ['JavaScript', 'CSS', 'API'],
      link: '#',
      color: '#E67E22'
    },
    {
      id: 3,
      titleKey: 'project3_title',
      descriptionKey: 'project3_description',
      image: '/images/projects/project3.jpg',
      tags: ['React', 'TypeScript', 'Firebase'],
      link: '#',
      color: '#3498DB'
    },
    {
      id: 4,
      titleKey: 'project4_title',
      descriptionKey: 'project4_description',
      image: '/images/projects/project4.jpg',
      tags: ['Node.js', 'Express', 'PostgreSQL'],
      link: '#',
      color: '#9B59B6'
    },
  ];

  // Générer les nuages basé sur le nombre de projets
  const decorativeClouds = React.useMemo(() => generateClouds(projects.length), [projects.length]);

  return (
    <div className="projects-page">
      {/* Nuages décoratifs en arrière-plan */}
      <div className="background-clouds">
        {decorativeClouds.map((cloud) => (
          <img
            key={cloud.id}
            src={`/images/${cloud.image}`}
            alt=""
            className={`bg-cloud size-${cloud.size} opacity-${cloud.opacity} direction-${cloud.direction} speed-${cloud.speed}`}
            style={{ top: cloud.top }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="projects-nav">
        <Link to="/" className="back-button">
          ← {t('backToHome')}
        </Link>
      </nav>

      {/* Titre */}
      <div className="projects-title-container">
        <h1 className="projects-title">{t('projectsPageTitle') || 'Mes Projets'}</h1>
      </div>

      {/* Contenu principal - Projets */}
      <div className="projects-content">
        {projects.map((project, index) => (
          <div key={project.id} className="project-section">
            {/* Carte projet */}
            <article 
              className={`project-card ${index % 2 === 0 ? 'card-left' : 'card-right'}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Ballon */}
              <div className="balloon-container">
                <Balloon color={project.color} />
              </div>
              
              {/* Ficelle */}
              <div className="balloon-string"></div>
              
              {/* Contenu */}
              <div className="card-content">
                <div className="project-image">
                  <img 
                    src={project.image} 
                    alt={t(project.titleKey)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200/FFEA93/4A3728?text=Projet';
                    }}
                  />
                </div>
                <div className="project-info">
                  <h2>{t(project.titleKey)}</h2>
                  <p>{t(project.descriptionKey)}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                  <a href={project.link} className="project-link">
                    {t('viewProject') || 'Voir le projet'} →
                  </a>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;