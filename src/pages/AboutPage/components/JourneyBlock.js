import React from 'react';
import styles from '../AboutPage.module.css';

// Timeline réutilisée pour formation et expériences. Gardée en interne du
// fichier car uniquement utilisée par JourneyBlock.
const Timeline = ({ items }) => (
  <ul className={styles.timeline}>
    {items.map((s, i) => (
      <li key={i} className={styles.timelineItem}>
        <span className={styles.timelineDot} aria-hidden="true" />
        <span className={styles.timelineYear}>{s.years}</span>
        <h4 className={styles.timelineTitle}>{s.title}</h4>
        <p className={styles.timelineMeta}>{s.school || s.company}</p>
        <p className={styles.timelineDesc}>{s.desc}</p>
      </li>
    ))}
  </ul>
);

// Bloc parcours : 2 colonnes (formation à gauche, expériences à droite).
// Les données viennent des traductions (Array d'objets {years, title, ...}).
const JourneyBlock = ({ t }) => {
  const educationRaw = t('education');
  const experienceRaw = t('experience');
  const education = Array.isArray(educationRaw) ? educationRaw : [];
  const experience = Array.isArray(experienceRaw) ? experienceRaw : [];

  return (
    <div className={styles.journeyBlock}>
      <div className={styles.blockHeader}>
        <span className={styles.blockKicker}>✦</span>
        <h3 className={styles.blockTitle}>{t('journeyLabel')}</h3>
      </div>

      <div className={styles.journeyGrid}>
        <div>
          <h4 className={styles.journeyCol}>{t('journeyEducation')}</h4>
          <Timeline items={education} />
        </div>
        <div>
          <h4 className={styles.journeyCol}>{t('journeyExperience')}</h4>
          <Timeline items={experience} />
        </div>
      </div>
    </div>
  );
};

export default JourneyBlock;