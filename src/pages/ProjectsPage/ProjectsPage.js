import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import './ProjectsPage.css';

// Composant Ballon SVG pour les cartes
const Balloon = ({ color = '#7CB342' }) => (
  <svg width="40" height="70" viewBox="0 0 40 70" className="balloon-svg">
    {/* Ballon */}
    <ellipse cx="20" cy="22" rx="18" ry="22" fill={color} />
    <ellipse cx="20" cy="22" rx="18" ry="22" fill="url(#balloonShine)" />
    {/* Noeud */}
    <polygon points="17,43 20,48 23,43" fill={color} />
    {/* Ficelle */}
    <path 
      d="M20 48 C22 55, 18 62, 20 70" 
      stroke="#8B7355" 
      strokeWidth="1.5" 
      fill="none"
      strokeLinecap="round"
    />
    <defs>
      <radialGradient id="balloonShine" cx="30%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

// Oiseau SVG animé
const Bird = ({ size = 30, color = '#4A3728', direction = 'right' }) => (
  <svg 
    width={size} 
    height={size * 0.5} 
    viewBox="0 0 40 20" 
    className="bird-svg"
    style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
  >
    {/* Aile gauche */}
    <path 
      className="bird-wing-left"
      d="M20 10 Q10 2, 2 8" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none"
      strokeLinecap="round"
    />
    {/* Aile droite */}
    <path 
      className="bird-wing-right"
      d="M20 10 Q30 2, 38 8" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none"
      strokeLinecap="round"
    />
    {/* Corps */}
    <ellipse cx="20" cy="11" rx="4" ry="2.5" fill={color} />
    {/* Tête */}
    <circle cx="26" cy="10" r="2" fill={color} />
    {/* Bec */}
    <path d="M28 10 L31 10.5 L28 11" fill={color} />
  </svg>
);

// Génération des oiseaux décoratifs - répartis aléatoirement
const generateBirds = (numberOfProjects) => {
  const birds = [];
  const totalBirds = numberOfProjects * 6 + 6; // Plus d'oiseaux
  const maxHeight = numberOfProjects * 500 + 200; // Hauteur max basée sur les projets
  
  // Fonction pseudo-aléatoire stable
  const seededRandom = (seed) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < totalBirds; i++) {
    const seed = i + 1;
    
    // Position verticale aléatoire
    const topPosition = 40 + seededRandom(seed * 3) * maxHeight;
    
    // Côté aléatoire (gauche ou droite)
    const isLeft = seededRandom(seed * 7) > 0.5;
    
    // Taille aléatoire
    const size = 18 + seededRandom(seed * 11) * 18; // 18-36px
    
    // Durée et délai aléatoires
    const duration = 18 + seededRandom(seed * 13) * 18; // 18-36s
    const delay = -(seededRandom(seed * 17) * 30); // 0 à -30s
    
    birds.push({
      id: i + 1,
      top: `${topPosition}px`,
      left: isLeft ? '-5%' : undefined,
      right: !isLeft ? '-5%' : undefined,
      size: Math.round(size),
      direction: isLeft ? 'right' : 'left',
      duration: Math.round(duration),
      delay: Math.round(delay),
    });
  }
  
  return birds;
};

// Les oiseaux seront générés dans le composant avec le nombre de projets

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
    tags: ['Vue.js', 'Firebase'],
    link: '#',
    color: '#E67E22'
  },
  {
    id: 3,
    titleKey: 'project3_title',
    descriptionKey: 'project3_description',
    image: '/images/projects/project3.jpg',
    tags: ['Next.js', 'Tailwind CSS'],
    link: '#',
    color: '#3498DB'
  },
  {
    id: 4,
    titleKey: 'project4_title',
    descriptionKey: 'project4_description',
    image: '/images/projects/project4.jpg',
    tags: ['React Native', 'Express'],
    link: '#',
    color: '#9B59B6'
  },
];

// Hook pour animation de flottement avec direction aléatoire
const useFloatingAnimation = (cardRef, seed) => {
  React.useEffect(() => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    let animationId;
    let startTime = null;
    
    // Initialiser le transform à 0 immédiatement
    card.style.transform = 'translateY(0) translateX(0) rotate(0deg)';
    
    // Durée d'un cycle complet (similaire au CSS)
    const cycleDuration = 5500 + (seed % 5) * 500; // 5.5s à 8s
    
    // Paramètres actuels
    let currentTargetX = 0;
    let currentTargetRotate = 0;
    
    // Générer nouvelle direction aléatoire
    const generateRandomDirection = () => {
      const rand = Math.random();
      if (rand < 0.33) {
        // Gauche
        currentTargetX = -(10 + Math.random() * 12);
        currentTargetRotate = -(1 + Math.random() * 1.2);
      } else if (rand < 0.66) {
        // Milieu
        currentTargetX = -3 + Math.random() * 6;
        currentTargetRotate = -0.5 + Math.random() * 1;
      } else {
        // Droite
        currentTargetX = 10 + Math.random() * 12;
        currentTargetRotate = 1 + Math.random() * 1.2;
      }
    };
    
    // Hauteur aléatoire pour ce cycle
    let currentTargetY = -(16 + Math.random() * 12); // -16 à -28px
    
    // Initialiser
    generateRandomDirection();
    
    let lastPhase = 'down';
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      
      // Progression dans le cycle (0 à 1)
      const elapsed = (timestamp - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration;
      
      // Fonction ease-in-out (comme CSS)
      const easeInOut = (t) => {
        return t < 0.5 
          ? 2 * t * t 
          : 1 - Math.pow(-2 * t + 2, 2) / 2;
      };
      
      // Phase montée (0 à 0.5) ou descente (0.5 à 1)
      let y, x, rotate;
      
      if (progress < 0.5) {
        // Montée
        const phaseProgress = easeInOut(progress * 2);
        y = currentTargetY * phaseProgress;
        x = currentTargetX * phaseProgress;
        rotate = currentTargetRotate * phaseProgress;
        
        // Détecter changement de phase
        if (lastPhase === 'down') {
          lastPhase = 'up';
          // Nouvelle direction aléatoire pour la prochaine montée
          generateRandomDirection();
          currentTargetY = -(16 + Math.random() * 12);
        }
      } else {
        // Descente
        const phaseProgress = easeInOut((progress - 0.5) * 2);
        y = currentTargetY * (1 - phaseProgress);
        x = currentTargetX * (1 - phaseProgress);
        rotate = currentTargetRotate * (1 - phaseProgress);
        
        if (lastPhase === 'up') {
          lastPhase = 'down';
        }
      }
      
      card.style.transform = `translateY(${y}px) translateX(${x}px) rotate(${rotate}deg)`;
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Délai initial aléatoire
    const initialDelay = (seed * 500) % 3000;
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, initialDelay);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [cardRef, seed]);
};

// Composant carte projet avec animation
const ProjectCard = ({ project, index, t }) => {
  const cardRef = React.useRef(null);
  const seed = project.id * 7 + index;
  
  useFloatingAnimation(cardRef, seed);
  
  return (
    <div className="project-section">
      <article 
        ref={cardRef}
        className={`project-card ${index % 2 === 0 ? 'card-left' : 'card-right'}`}
      >
        {/* Ballon avec ficelle intégrée */}
        <div className="balloon-container">
          <Balloon color={project.color} />
        </div>
        
        {/* Contenu */}
        <div className="card-content">
          <div className="project-image">
            {/* <img 
              src={project.image} 
              alt={t(project.titleKey)}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200/FFEA93/4A3728?text=Projet';
              }}
            /> */}
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
              {t('viewProject')} →
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

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

  // Générer les nuages et oiseaux basé sur le nombre de projets
  const decorativeClouds = React.useMemo(() => generateClouds(projects.length), []);
  const decorativeBirds = React.useMemo(() => generateBirds(projects.length), []);

  return (
    <div className="projects-page">
      {/* Oiseaux décoratifs en arrière-plan */}
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

      {/* Titre */}
      <div className="projects-title-container">
        <h1 className="projects-title">{t('projectsPageTitle')}</h1>
      </div>

      {/* Contenu principal - Projets */}
      <div className="projects-content">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id}
            project={project}
            index={index}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;