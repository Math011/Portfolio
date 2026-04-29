import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectDetailPage.module.css';

const ProjectNavigation = ({ prevProject, nextProject, t }) => (
  <div className={styles.projectNavigation}>
    {prevProject ? (
      <Link to={`/project/${prevProject.id}`} className={styles.navProject}>
        {t('previousProject')}
      </Link>
    ) : (
      <div className={styles.navProjectEmpty} />
    )}

    <Link to="/projects" className={styles.navBackBtn}>
      {t('backToProjects')}
    </Link>

    {nextProject ? (
      <Link to={`/project/${nextProject.id}`} className={styles.navProject}>
        {t('nextProject')}
      </Link>
    ) : (
      <div className={styles.navProjectEmpty} />
    )}
  </div>
);

export default ProjectNavigation;