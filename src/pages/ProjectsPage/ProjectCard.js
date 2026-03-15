import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Balloon } from './SvgElements';
import { useFloatingAnimation } from './hooks';
import styles from './ProjectsPage.module.css';

const ProjectCard = ({ project, index, t }) => {
  const cardRef = useRef(null);
  const seed = project.id * 7 + index;

  useFloatingAnimation(cardRef, seed);

  return (
    <div className={styles.projectSection}>
      <article
        ref={cardRef}
        className={`${styles.projectCard} ${index % 2 === 0 ? styles.cardLeft : styles.cardRight}`}
      >
        <div className={styles.balloonContainer}>
          <Balloon color={project.color} />
        </div>

        <div className={styles.cardContent}>
          <div className={styles.projectImage}>
            {/* Image placeholder */}
          </div>
          <div className={styles.projectInfo}>
            <h2>{t(project.titleKey)}</h2>
            <p>{t(project.descriptionKey)}</p>
            <div className={styles.projectTags}>
              {project.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>
            <Link
              to={`/project/${project.id}`}
              className={styles.projectLink}
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

export default ProjectCard;