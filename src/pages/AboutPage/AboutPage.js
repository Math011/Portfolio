import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import styles from './AboutPage.module.css';

const SKILLS = {
  frontend: [
    { name: 'React',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'HTML5',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  ],
  backend: [
    { name: 'Node.js',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'MongoDB',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  ],
  tools: [
    { name: 'Git',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'Figma',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  ],
};

const STATS = [
  { key: 'statYears',    value: '3+'  },
  { key: 'statProjects', value: '12'  },
  { key: 'statSkills',   value: '11'  },
  { key: 'statCoffee',   value: '3'   },
];

// Compass : aiguille orientée vers le NE (l'horizon)
const Compass = () => (
  <div className={styles.compass} aria-hidden="true">
    <span className={styles.compassNeedle} />
    <span className={styles.compassN}>N</span>
    <span className={styles.compassS}>S</span>
    <span className={styles.compassE}>E</span>
    <span className={styles.compassW}>W</span>
  </div>
);

// Polaroid avec scotch + photo (fallback initiales si l'image manque)
const Polaroid = ({ initials = 'MR', photoUrl }) => {
  const [hasError, setHasError] = useState(false);
  const showImage = photoUrl && !hasError;

  return (
    <div className={styles.polaroid}>
      <span className={styles.tape} aria-hidden="true" />
      <div className={styles.polaroidPhoto}>
        {showImage
          ? <img src={photoUrl} alt="" onError={() => setHasError(true)} />
          : <span className={styles.polaroidInitials}>{initials}</span>}
      </div>
      <p className={styles.polaroidCaption}>— Voyageur</p>
    </div>
  );
};

const SkillsBlock = ({ t }) => (
  <div className={styles.skillsBlock}>
    <div className={styles.blockHeader}>
      <span className={styles.blockKicker}>★</span>
      <h3 className={styles.blockTitle}>{t('skillsLabel')}</h3>
    </div>
    {Object.entries(SKILLS).map(([cat, list]) => (
      <div key={cat} className={styles.skillsRow}>
        <span className={styles.skillsCat}>{t(`skills${cat[0].toUpperCase() + cat.slice(1)}`)}</span>
        <div className={styles.skillsList}>
          {list.map(s => (
            <span key={s.name} className={styles.skillChip} title={s.name}>
              <img src={s.icon} alt="" loading="lazy" />
              <span>{s.name}</span>
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

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

function AboutPage() {
  const { t, language } = useLanguage();

  // CV adapté à la langue active
  const cvHref = language === 'en' ? '/cv-mathieu-raudin-en.pdf' : '/cv-mathieu-raudin-fr.pdf';

  return (
    <div className={styles.page}>
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
              <a href={cvHref} download className={styles.cvButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('cvDownload')}
              </a>
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