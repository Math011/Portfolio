import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectDetailPage.module.css';

const ProjectNavigation = ({ prevProject, nextProject, t }) => (
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
);

export default ProjectNavigation;