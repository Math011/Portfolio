import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Balloon } from './SvgElements';
import { useFloatingAnimation } from './hooks';
import styles from './ProjectsPage.module.css';

const ProjectCard = ({ project, index, t }) => {
  const cardRef = useRef(null);
  const seed = project.id * 7 + index;

  useFloatingAnimation(cardRef, seed);

  // Numéro du projet (01, 02, 03...)
  const num = String(index + 1).padStart(2, '0');

  return (
    <article ref={cardRef} className={styles.projectCard}>
      <div className={styles.balloonContainer}>
        <Balloon color={project.color} />
      </div>

      <div className={styles.cardContent}>
        <p className={styles.cardKicker}>— Projet {num}</p>
        <h2 className={styles.cardTitle}>{t(project.titleKey)}</h2>
        <p className={styles.cardDesc}>{t(project.descriptionKey)}</p>

        <div className={styles.cardTags}>
          {project.tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <Link
          to={`/project/${project.id}`}
          className={styles.cardLink}
          onClick={() => sessionStorage.setItem('projectsPage_fromProject', 'true')}
        >
          {t('viewProject')} →
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;