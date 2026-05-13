import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import { TOTAL_SKILLS } from '../../data/about';
import Header from '../../components/Header';

// Sous-composants locaux
import Compass from './components/Compass';
import Polaroid from './components/Polaroid';
import SkillsBlock from './components/SkillsBlock';
import JourneyBlock from './components/JourneyBlock';
import CvDownloadButton from './components/CvDownloadButton';

import styles from './AboutPage.module.css';

function AboutPage() {
  const { t } = useLanguage();

  // Stats dynamiques : projets et skills sont comptés depuis les données
  // (data/projects, data/skills). Pas besoin de mettre à jour les chiffres
  // à la main quand on ajoute un projet ou une compétence.
  const STATS = [
    { key: 'statYears',    value: '3+' },
    { key: 'statProjects', value: String(projects.length) },
    { key: 'statSkills',   value: String(TOTAL_SKILLS) },
    { key: 'statCoffee',   value: '3' },
  ];

  return (
    <div className={styles.page}>
      <img
        src="/images/nouveau-paysage.svg"
        alt=""
        className={styles.paysageBg}
        aria-hidden="true"
      />
      <Header />

      <main className={styles.main}>
        <p className={styles.pageKicker}>{t('aboutKicker')}</p>

        <article className={styles.mapCard}>
          {/* 4 punaises aux coins */}
          <span className={`${styles.nail} ${styles.nailTL}`} aria-hidden="true" />
          <span className={`${styles.nail} ${styles.nailTR}`} aria-hidden="true" />
          <span className={`${styles.nail} ${styles.nailBL}`} aria-hidden="true" />
          <span className={`${styles.nail} ${styles.nailBR}`} aria-hidden="true" />

          {/* Scotch en haut */}
          <span className={styles.topTape} aria-hidden="true" />

          {/* En-tête : titre + boussole */}
          <header className={styles.mapHeader}>
            <div>
              <h1 className={styles.mapTitle}>{t('aboutTitle')}</h1>
              <p className={styles.mapSub}>{t('aboutSub')}</p>
            </div>
            <Compass />
          </header>

          {/* Bio + polaroid */}
          <section className={styles.bioRow}>
            <Polaroid initials="MR" photoUrl="/images/face.jpg" />

            <div className={styles.bioContent}>
              <h2 className={styles.bioName}>{t('bioName')}</h2>
              <p className={styles.bioRole}>{t('bioRole')}</p>
              {(Array.isArray(t('bioParagraphs')) ? t('bioParagraphs') : []).map((p, i) => (
                <p key={i} className={styles.bioParagraph}>{p}</p>
              ))}
              <CvDownloadButton />
            </div>
          </section>

          {/* Skills */}
          <SkillsBlock t={t} />

          {/* Parcours (formation + expériences) */}
          <JourneyBlock t={t} />

          {/* Stats en bas */}
          <footer className={styles.statsRow}>
            {STATS.map(s => (
              <div key={s.key} className={styles.statCell}>
                <span className={styles.statKey}>{t(s.key)}</span>
                <span className={styles.statValue}>{s.value}</span>
              </div>
            ))}
          </footer>
        </article>
      </main>
    </div>
  );
}

export default AboutPage;