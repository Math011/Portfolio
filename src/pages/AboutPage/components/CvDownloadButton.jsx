import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import styles from '../AboutPage.module.css';

// Icône SVG de téléchargement (flèche descendante dans un tiroir).
// Gardée en interne car utilisée uniquement par ce bouton.
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// Bouton "Voir mon CV". Lit le chemin du fichier et le libellé depuis les
// traductions (cvFile et cvDownload). Ouvre le PDF dans un nouvel onglet.
const CvDownloadButton = () => {
  const { t } = useLanguage();

  return (
    <a
      href={t('cvFile')}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.cvButton}
    >
      <DownloadIcon />
      {t('cvDownload')}
    </a>
  );
};

export default CvDownloadButton;