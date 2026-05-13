import React, { useState } from 'react';
import { SKILLS } from '../../../data/about';
import styles from '../AboutPage.module.css';

// Une seule skill (chip). Si l'icône manque OU si son chargement échoue,
// on retombe sur un style "puce texte" propre via la classe skillChipTextOnly.
// Utilisé uniquement par SkillsBlock, gardé en interne pour limiter la surface.
const SkillChip = ({ skill }) => {
  const [iconFailed, setIconFailed] = useState(false);
  const hasIcon = skill.icon && !iconFailed;

  return (
    <span
      className={`${styles.skillChip} ${!hasIcon ? styles.skillChipTextOnly : ''}`}
      title={skill.name}
    >
      {hasIcon && (
        <img
          src={skill.icon}
          alt=""
          loading="lazy"
          onError={() => setIconFailed(true)}
        />
      )}
      <span>{skill.name}</span>
    </span>
  );
};

// Bloc complet des compétences : titre + une ligne par catégorie.
// Les labels de catégories viennent des traductions (skillsFrontend, etc.)
// pour suivre la langue active.
const SkillsBlock = ({ t }) => (
  <div className={styles.skillsBlock}>
    <div className={styles.blockHeader}>
      <span className={styles.blockKicker}>★</span>
      <h3 className={styles.blockTitle}>{t('skillsLabel')}</h3>
    </div>
    {Object.entries(SKILLS).map(([cat, list]) => (
      <div key={cat} className={styles.skillsRow}>
        <span className={styles.skillsCat}>
          {t(`skills${cat[0].toUpperCase() + cat.slice(1)}`)}
        </span>
        <div className={styles.skillsList}>
          {list.map(s => <SkillChip key={s.name} skill={s} />)}
        </div>
      </div>
    ))}
  </div>
);

export default SkillsBlock;