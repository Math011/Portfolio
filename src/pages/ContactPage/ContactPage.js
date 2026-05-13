import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import ContactForm from './components/ContactForm';
import { Campfire, Person, Log } from './components/SceneElements';
import { Stars, ShootingStar, Moon } from './components/NightElements';
import { LinkedInIcon, GitHubIcon, MailIcon } from './components/SocialIcons';
import { SOCIAL_LINKS, CONTACT_EMAIL } from './config';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  const { t, language } = useLanguage();

  // Extrait un handle lisible depuis une URL.
  // - GitHub : "@username"
  // - LinkedIn : "Prénom Nom" (on retire le suffixe LinkedIn ajouté à la création
  //   du compte, du genre "-4a9b90230", et on capitalize chaque mot)
  const getHandle = (url, platform = '') => {
    if (!url) return '';
    const match = url.match(/\/([^/]+)\/?$/);
    if (!match) return url;
    let slug = match[1];

    if (platform === 'linkedin') {
      // Retire le suffixe alphanumérique de fin (ex: "-4a9b90230", "-12abc34")
      slug = slug.replace(/-[a-z0-9]{6,}$/i, '');
      // "mathieu-raudin" → "Mathieu Raudin"
      return slug
        .split('-')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    return '@' + slug;
  };

  return (
    <>
      <div className={`${styles.contactPage}`}>
        {/* Décor nuit en arrière-plan */}
        <div className={styles.nightSky} />
        <Stars count={90} />
        <ShootingStar />
        <Moon />

        {/* Paysage SVG existant, assombri par filter CSS */}
        <img
          src="/images/tout-sol.svg"
          alt=""
          className={styles.groundBackground}
        />
        <div className={styles.nightOverlay} />

        {/* Navigation */}
        <Header />

        {/* Layout principal : hero à gauche, formulaire à droite */}
        <div className={styles.contactLayout}>
          {/* Hero */}
          <div className={styles.contactHero}>
            <div className={styles.eyebrow}>{t('contactPageEyebrow')}</div>
            <h1 className={styles.heroTitle}>{t('contactPageTitle')}</h1>
            <p className={styles.heroSub}>{t('contactPageIntro')}</p>
            <div className={styles.statusPill}>
              <span className={styles.dotPulse} />
              {t('availableForProjects')}
            </div>

            {/* Liens sociaux directement sous le hero (3 lignes compactes) */}
            <div className={styles.socialsBlock}>
              <div className={styles.socialsTitle}>{t('socialsTitle')}</div>
              <a className={styles.socialRow} href={`mailto:${CONTACT_EMAIL || 'hello@portfolio.dev'}`} aria-label="Email">
                <span className={styles.socialIcon}><MailIcon /></span>
                <div>
                  <div className={styles.socialLabel}>Email</div>
                  <div className={styles.socialHandle}>{CONTACT_EMAIL || 'hello@portfolio.dev'}</div>
                </div>
              </a>
              <a className={styles.socialRow} href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <span className={styles.socialIcon}><GitHubIcon /></span>
                <div>
                  <div className={styles.socialLabel}>GitHub</div>
                  <div className={styles.socialHandle}>{getHandle(SOCIAL_LINKS.github)}</div>
                </div>
              </a>
              <a className={styles.socialRow} href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <span className={styles.socialIcon}><LinkedInIcon /></span>
                <div>
                  <div className={styles.socialLabel}>LinkedIn</div>
                  <div className={styles.socialHandle}>{getHandle(SOCIAL_LINKS.linkedin, 'linkedin')}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Formulaire (carte papier ambré) */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              {language === 'fr' ? 'Carnet de voyage' : 'Travel journal'}
            </h2>
            <ContactForm t={t} language={language} />
          </div>
        </div>

        {/* Feu de camp + 2 personnages — ancrés au bas */}
        <div className={styles.fireSection}>
          <div className={styles.fireGroup}>
            <div className={styles.personWrapper}>
              <Person variant={1} />
              <Log />
            </div>
            <Campfire />
            <div className={styles.personWrapper}>
              <Person variant={2} />
              <Log />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;