import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ProjectCard from './ProjectCard';
import { Bird } from './SvgElements';
import { generateBirds, generateClouds, SIZE_TO_CLASS, OPACITY_TO_CLASS, SPEED_TO_CLASS } from './generators';
import { projects } from './ProjectsData';
import styles from './ProjectsPage.module.css';

const ProjectsPage = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const pageRef = useRef(null);
  const [animationOffset, setAnimationOffset] = useState(0);

  const isReturningFromProject = sessionStorage.getItem('projectsPage_fromProject') === 'true';
  const [isLoading, setIsLoading] = useState(!isReturningFromProject);

  // Loading screen
  useEffect(() => {
    sessionStorage.removeItem('projectsPage_fromProject');
    if (isReturningFromProject) return;

    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [isReturningFromProject]);

  // Animation offset
  useEffect(() => {
    const savedStartTime = sessionStorage.getItem('projectsPage_animationStart');
    if (savedStartTime) {
      setAnimationOffset((Date.now() - parseInt(savedStartTime, 10)) / 1000);
    } else {
      sessionStorage.setItem('projectsPage_animationStart', Date.now().toString());
    }
  }, []);

  // Generate or retrieve decorative elements
  const decorativeClouds = useMemo(() => {
    const saved = sessionStorage.getItem('projectsPage_clouds');
    if (saved) return JSON.parse(saved);
    const clouds = generateClouds(projects.length);
    sessionStorage.setItem('projectsPage_clouds', JSON.stringify(clouds));
    return clouds;
  }, []);

  const decorativeBirds = useMemo(() => {
    const saved = sessionStorage.getItem('projectsPage_birds');
    if (saved) return JSON.parse(saved);
    const birds = generateBirds(projects.length);
    sessionStorage.setItem('projectsPage_birds', JSON.stringify(birds));
    return birds;
  }, []);

  // Scroll position persistence
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('projectsPage_scroll');
    if (savedScroll && pageRef.current) {
      pageRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const handleScroll = () => {
      sessionStorage.setItem('projectsPage_scroll', page.scrollTop.toString());
    };

    page.addEventListener('scroll', handleScroll);
    return () => page.removeEventListener('scroll', handleScroll);
  }, []);

  // Clear cache on navigation away
  useEffect(() => {
    return () => {
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
      <div className={styles.projectsPage} ref={pageRef}>
        {/* Birds */}
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
                animationDelay: `${bird.delay - animationOffset}s`,
              }}
            >
              <Bird size={bird.size} direction={bird.direction} />
            </div>
          ))}
        </div>

        {/* Clouds */}
        <div className={styles.backgroundClouds}>
          {decorativeClouds.map((cloud) => (
            <img
              key={cloud.id}
              src={`/images/${cloud.image}`}
              alt=""
              className={`${styles.bgCloud} ${styles[SIZE_TO_CLASS[cloud.size]]} ${styles[OPACITY_TO_CLASS[cloud.opacity]]} ${cloud.direction === 'left' ? styles.directionLeft : styles.directionRight} ${styles[SPEED_TO_CLASS[cloud.speed]]}`}
              style={{
                top: cloud.top,
                animationDelay: `${cloud.delay - animationOffset}s`
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <nav className={styles.projectsNav}>
          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>{t('home')}</Link>
            <Link to="/about" className={styles.navLink}>{t('about')}</Link>
            <Link to="/projects" className={`${styles.navLink} ${styles.active}`}>{t('projects')}</Link>
            <Link to="/contact" className={styles.navLink}>{t('contact')}</Link>
          </div>
          <div className={styles.navLanguage}>
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Title */}
        <div className={styles.projectsTitleContainer}>
          <h1 className={styles.projectsTitle}>{t('projectsPageTitle')}</h1>
        </div>

        {/* Projects */}
        <div className={styles.projectsContent}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} t={t} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;