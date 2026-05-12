import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ProjectCard from './ProjectCard';
import { Bird } from './SvgElements';
import { generateBirds, generateClouds, SIZE_TO_CLASS, OPACITY_TO_CLASS, SPEED_TO_CLASS } from './generators';
import { projects } from '../../data/projects';
import { useInitialLoading } from '../../hooks/useFirstLoad';
import styles from './ProjectsPage.module.css';

const ProjectsPage = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const pageRef = useRef(null);
  const [animationOffset, setAnimationOffset] = useState(0);

  const isLoading = useInitialLoading('projects');

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
  // En grille 2 colonnes, le nombre de "zones" correspond au nombre de lignes
  const numberOfRows = Math.ceil(projects.length / 2);

  const decorativeClouds = useMemo(() => {
    const saved = sessionStorage.getItem('projectsPage_clouds');
    if (saved) return JSON.parse(saved);
    const clouds = generateClouds(numberOfRows);
    sessionStorage.setItem('projectsPage_clouds', JSON.stringify(clouds));
    return clouds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decorativeBirds = useMemo(() => {
    const saved = sessionStorage.getItem('projectsPage_birds');
    if (saved) return JSON.parse(saved);
    const birds = generateBirds(numberOfRows);
    sessionStorage.setItem('projectsPage_birds', JSON.stringify(birds));
    return birds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className={`${styles.projectsPage}`} ref={pageRef}>
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

        {/* Header */}
        <Header />

        {/* Title */}
        <div className={styles.projectsTitleContainer}>
          <p className={styles.projectsKicker}>{t('projectsPageKicker')}</p>
          <h1 className={styles.projectsTitle}>{t('projectsPageTitle')}</h1>
        </div>

        {/* Projects */}
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} t={t} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;