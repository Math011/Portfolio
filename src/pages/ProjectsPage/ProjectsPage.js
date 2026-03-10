import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
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

// Génération des oiseaux décoratifs - vraie randomisation par zones
const generateBirds = (numberOfProjects) => {
  const birds = [];
  const birdsPerZone = 5;
  const zoneHeight = 500;
  
  // Seed aléatoire unique à chaque chargement
  const randomSeed = Math.random() * 10000;
  
  const random = (seed) => {
    const x = Math.sin((seed + randomSeed) * 9999) * 10000;
    return x - Math.floor(x);
  };
  
  let birdId = 0;
  
  // Zone du titre (0-150px)
  for (let i = 0; i < 3; i++) {
    birdId++;
    const isLeft = random(birdId * 7) > 0.5;
    birds.push({
      id: birdId,
      top: `${50 + random(birdId * 3) * 100}px`,
      left: isLeft ? '-5%' : undefined,
      right: !isLeft ? '-5%' : undefined,
      size: Math.round(18 + random(birdId * 11) * 18),
      direction: isLeft ? 'right' : 'left',
      duration: Math.round(18 + random(birdId * 13) * 18),
      delay: Math.round(-(random(birdId * 17) * 30)),
    });
  }
  
  // Pour chaque projet
  for (let zone = 0; zone < numberOfProjects; zone++) {
    const zoneStart = 180 + (zone * zoneHeight);
    const zoneEnd = zoneStart + zoneHeight;
    const sectionHeight = (zoneEnd - zoneStart) / birdsPerZone;
    
    for (let i = 0; i < birdsPerZone; i++) {
      birdId++;
      
      // Position dans sa sous-section
      const sectionStart = zoneStart + (i * sectionHeight);
      const topPosition = sectionStart + random(birdId * 3) * (sectionHeight * 0.8);
      
      const isLeft = random(birdId * 7) > 0.5;
      
      birds.push({
        id: birdId,
        top: `${topPosition}px`,
        left: isLeft ? '-5%' : undefined,
        right: !isLeft ? '-5%' : undefined,
        size: Math.round(18 + random(birdId * 11) * 18),
        direction: isLeft ? 'right' : 'left',
        duration: Math.round(18 + random(birdId * 13) * 18),
        delay: Math.round(-(random(birdId * 17) * 30)),
      });
    }
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
            <Link 
              to={`/project/${project.id}`} 
              className="project-link"
              onClick={() => sessionStorage.setItem('projectsPage_fromProject', 'true')}
            >
              {t('viewProject')} →
            </Link>
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

// Générer les nuages avec distribution équilibrée et superpositions naturelles
const generateClouds = (numberOfProjects) => {
  const clouds = [];
  const zoneHeight = 400;
  
  // Seed aléatoire unique à chaque chargement de page
  const randomSeed = Math.random() * 10000;
  
  // Fonction random avec seed variable
  const random = (seed) => {
    const x = Math.sin((seed + randomSeed) * 9999) * 10000;
    return x - Math.floor(x);
  };
  
  let cloudId = 0;
  
  // Zone du titre (0-150px) - seulement 2-3 nuages
  const titleClouds = 2 + Math.floor(random(999) * 2);
  for (let i = 0; i < titleClouds; i++) {
    cloudId++;
    const top = 20 + random(cloudId * 17) * 120;
    const imageIndex = Math.floor(random(cloudId * 23) * CLOUD_IMAGES.length);
    const sizeIndex = Math.floor(random(cloudId * 37) * CLOUD_SIZES.length);
    const speedIndex = Math.floor(random(cloudId * 41) * CLOUD_SPEEDS.length);
    
    clouds.push({
      id: cloudId,
      image: CLOUD_IMAGES[imageIndex],
      top: `${Math.round(top)}px`,
      size: CLOUD_SIZES[sizeIndex],
      opacity: SIZE_TO_OPACITY[CLOUD_SIZES[sizeIndex]],
      direction: random(cloudId * 43) > 0.5 ? 'left' : 'right',
      speed: CLOUD_SPEEDS[speedIndex],
      delay: Math.round(random(cloudId * 47) * -60)
    });
  }
  
  // Zones des projets
  for (let zone = 0; zone < numberOfProjects; zone++) {
    const zoneStart = 150 + (zone * zoneHeight);
    const zoneEnd = zoneStart + zoneHeight;
    
    // 5-7 nuages par zone projet
    const cloudsInZone = 5 + Math.floor(random(zone * 100) * 3);
    
    // Diviser la zone en 3 parties : haut, milieu, bas
    const thirdHeight = (zoneEnd - zoneStart) / 3;
    
    for (let i = 0; i < cloudsInZone; i++) {
      cloudId++;
      
      // Assigner à une section de façon cyclique
      const section = i % 3;
      const sectionStart = zoneStart + (section * thirdHeight);
      
      // Position libre avec débordement possible (±20%)
      const overflow = thirdHeight * 0.2;
      const top = (sectionStart - overflow) + random(cloudId * 17) * (thirdHeight + overflow * 2);
      
      const imageIndex = Math.floor(random(cloudId * 23) * CLOUD_IMAGES.length);
      const sizeIndex = Math.floor(random(cloudId * 37) * CLOUD_SIZES.length);
      const speedIndex = Math.floor(random(cloudId * 41) * CLOUD_SPEEDS.length);
      
      clouds.push({
        id: cloudId,
        image: CLOUD_IMAGES[imageIndex],
        top: `${Math.max(20, Math.round(top))}px`,
        size: CLOUD_SIZES[sizeIndex],
        opacity: SIZE_TO_OPACITY[CLOUD_SIZES[sizeIndex]],
        direction: random(cloudId * 43) > 0.5 ? 'left' : 'right',
        speed: CLOUD_SPEEDS[speedIndex],
        delay: Math.round(random(cloudId * 47) * -60)
      });
    }
  }
  
  return clouds;
};

const ProjectsPage = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const pageRef = React.useRef(null);
  const [animationOffset, setAnimationOffset] = React.useState(0);
  
  // Afficher le loading sauf si on revient d'une page projet détail
  const isReturningFromProject = sessionStorage.getItem('projectsPage_fromProject') === 'true';
  const [isLoading, setIsLoading] = React.useState(!isReturningFromProject);

  // Gérer le loading screen
  React.useEffect(() => {
    // Réinitialiser le flag
    sessionStorage.removeItem('projectsPage_fromProject');
    
    if (isReturningFromProject) return;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [isReturningFromProject]);

  // Récupérer ou créer le timestamp de démarrage des animations
  React.useEffect(() => {
    const savedStartTime = sessionStorage.getItem('projectsPage_animationStart');
    if (savedStartTime) {
      // Calculer le temps écoulé depuis le début des animations
      const elapsed = (Date.now() - parseInt(savedStartTime, 10)) / 1000;
      setAnimationOffset(elapsed);
    } else {
      // Premier chargement - sauvegarder le timestamp
      sessionStorage.setItem('projectsPage_animationStart', Date.now().toString());
    }
  }, []);

  // Générer ou récupérer les nuages et oiseaux depuis sessionStorage
  const decorativeClouds = React.useMemo(() => {
    const saved = sessionStorage.getItem('projectsPage_clouds');
    if (saved) {
      return JSON.parse(saved);
    }
    const clouds = generateClouds(projects.length);
    sessionStorage.setItem('projectsPage_clouds', JSON.stringify(clouds));
    return clouds;
  }, []);

  const decorativeBirds = React.useMemo(() => {
    const saved = sessionStorage.getItem('projectsPage_birds');
    if (saved) {
      return JSON.parse(saved);
    }
    const birds = generateBirds(projects.length);
    sessionStorage.setItem('projectsPage_birds', JSON.stringify(birds));
    return birds;
  }, []);

  // Restaurer la position de scroll au chargement
  React.useEffect(() => {
    const savedScroll = sessionStorage.getItem('projectsPage_scroll');
    if (savedScroll && pageRef.current) {
      pageRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  // Sauvegarder la position de scroll
  React.useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const handleScroll = () => {
      sessionStorage.setItem('projectsPage_scroll', page.scrollTop.toString());
    };

    page.addEventListener('scroll', handleScroll);
    return () => page.removeEventListener('scroll', handleScroll);
  }, []);

  // Effacer le cache quand on quitte la page (navigation vers autre page)
  React.useEffect(() => {
    return () => {
      // Ce cleanup s'exécute quand le composant est démonté (navigation)
      // On vérifie si on va vers une page projet détail (on garde le cache)
      // ou vers une autre page (on efface le cache)
      const nextPath = window.location.pathname;
      if (!nextPath.startsWith('/project')) {
        sessionStorage.removeItem('projectsPage_clouds');
        sessionStorage.removeItem('projectsPage_birds');
        sessionStorage.removeItem('projectsPage_scroll');
        sessionStorage.removeItem('projectsPage_animationStart');
      }
    };
  }, [location]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className="projects-page" ref={pageRef}>
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
              animationDelay: `${bird.delay - animationOffset}s`,
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
            style={{ 
              top: cloud.top,
              animationDelay: `${cloud.delay - animationOffset}s`
            }}
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
    </>
  );
};

export default ProjectsPage;