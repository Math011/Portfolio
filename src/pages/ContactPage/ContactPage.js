import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ContactForm from './ContactForm';
import { Campfire, WoodenSign, Person, Log } from './SceneElements';
import styles from './ContactPage.module.css';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ContactPage = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className={styles.contactPage}>
        
        {/* ============ CIEL ============ */}
        <div className={styles.sky}></div>

        {/* ============ NUAGES ============ */}
        <div className={styles.cloudsRow1}>
          <img src="/images/nuage1.svg" alt="" className={styles.cloudRow1} />
          <img src="/images/nuage3.svg" alt="" className={styles.cloudRow1} />
          <img src="/images/nuage5.svg" alt="" className={styles.cloudRow1} />
        </div>
        
        <div className={styles.cloudsRow2}>
          <img src="/images/nuage2.svg" alt="" className={styles.cloudRow2} />
          <img src="/images/nuage4.svg" alt="" className={styles.cloudRow2} />
          <img src="/images/nuage1.svg" alt="" className={styles.cloudRow2} />
        </div>
        
        <div className={styles.cloudsRow3}>
          <img src="/images/nuage3.svg" alt="" className={styles.cloudRow3} />
          <img src="/images/nuage5.svg" alt="" className={styles.cloudRow3} />
          <img src="/images/nuage2.svg" alt="" className={styles.cloudRow3} />
        </div>

        {/* ============ SOL + MONTAGNES ============ */}
        <img src="/images/sol-montagne.svg" alt="" className={styles.groundBackground} />

        {/* ============ ARBRES ============ */}
        <Trees />

        {/* ============ HEADER ============ */}
        <Header />

        {/* ============ PANNEAU ============ */}
        <div className={styles.signSection}>
          <WoodenSign text={t('letsWorkTogether')} />
        </div>

        {/* ============ FORMULAIRE ============ */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h1>{t('contactPageTitle')}</h1>
            <p className={styles.formIntro}>{t('contactPageIntro')}</p>
            <ContactForm t={t} language={language} />
          </div>
        </div>

        {/* ============ FEU DE CAMP ============ */}
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

// =============================================================================
// TREES COMPONENT - Séparé pour lisibilité
// =============================================================================

const Trees = () => (
  <>
    {/* RANGÉE 1 - 7 arbres par côté */}
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Left1}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Left2}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Left3}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Left4}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Left5}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Left6}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Left7}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Right1}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Right2}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Right3}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Right4}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Right5}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Right6}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Right7}`} />
    
    {/* RANGÉE 2 - 6 arbres par côté */}
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Left1}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Left2}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Left3}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Left4}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Left5}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Left6}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Right1}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Right2}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Right3}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Right4}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Right5}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Right6}`} />
    
    {/* RANGÉE 3 - 2 arbres gauche, 4 arbres droite */}
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row3Left1}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row3Left2}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row3Right1}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row3Right2}`} />
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row3Right3}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row3Right4}`} />
    
    {/* RANGÉE 4 - 1 arbre par côté */}
    <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row4Left1}`} />
    <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row4Right1}`} />
  </>
);

export default ContactPage;