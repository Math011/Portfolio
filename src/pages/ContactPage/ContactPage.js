import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ContactForm from './ContactForm';
import { Campfire, WoodenSign, Person, Log } from './SceneElements';
import { Stars, ShootingStar, Moon, Lantern } from './NightElements';
import { useInitialLoading } from '../../hooks/useFirstLoad';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  const { t, language } = useLanguage();
  const isLoading = useInitialLoading();

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className={styles.contactPage}>
        {/* Ciel nocturne en dégradé */}
        <div className={styles.nightSky} />

        {/* Étoiles + étoile filante + lune */}
        <Stars count={90} />
        <ShootingStar />
        <Moon />

        {/* Paysage SVG existant, assombri par filter CSS pour paraître nocturne */}
        <img
          src="/images/tout-sol.svg"
          alt=""
          className={styles.groundBackground}
        />

        {/* Overlay sombre par-dessus le paysage pour renforcer l'effet nuit */}
        <div className={styles.nightOverlay} />

        {/* Navigation */}
        <Header />

        {/* Panneau bois avec lanterne suspendue */}
        <div className={styles.signSection}>
          <Lantern className={styles.signLantern} />
          <WoodenSign text={t('letsWorkTogether')} />
        </div>

        {/* Formulaire */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h1>{t('contactPageTitle')}</h1>
            <p className={styles.formIntro}>{t('contactPageIntro')}</p>
            <ContactForm t={t} language={language} />
          </div>
        </div>

        {/* Feu de camp + 2 personnages autour */}
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