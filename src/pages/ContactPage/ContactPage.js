import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ContactForm from './ContactForm';
import { Campfire, WoodenSign, Person, Log } from './SceneElements';
import Trees from './Trees';
import Clouds from './Clouds';
import styles from './ContactPage.module.css';

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
        {/* Décor */}
        <div className={styles.sky} />
        <Clouds />
        <img src="/images/sol-montagne.svg" alt="" className={styles.groundBackground} />
        <Trees />

        {/* Navigation */}
        <Header />

        {/* Panneau */}
        <div className={styles.signSection}>
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

        {/* Feu de camp */}
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