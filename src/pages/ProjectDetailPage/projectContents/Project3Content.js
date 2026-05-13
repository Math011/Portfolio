import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import styles from './RichContent.module.css';

// =============================================================================
// CONTENU RICHE — PROJET 3 (Template Docker Symfony)
// -----------------------------------------------------------------------------
// Tous les textes sont récupérés via t() depuis projectsTranslations.
// Aucun texte n'est hardcodé : la source de vérité reste les fichiers de
// traduction, comme pour les autres projets.
// =============================================================================

const Project3Content = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.richContent}>
      {/* Paragraphe d'intro avec lettrine — utilise la clé fullDescription
          déjà présente dans les translations */}
      <p className={styles.lead}>{t('project3_fullDescription')}</p>

      <div className={styles.divider}>
        <span className={styles.dividerOrnament}>⋄⋄</span>
      </div>

      <p className={styles.subLead}>{t('project3_subLead')}</p>

      <ul className={styles.featureList}>
        <li>
          <strong>{t('project3_feature1_title')}</strong>
          <span className={styles.featureDesc}>{t('project3_feature1_desc')}</span>
        </li>
        <li>
          <strong>{t('project3_feature2_title')}</strong>
          <span className={styles.featureDesc}>{t('project3_feature2_desc')}</span>
        </li>
      </ul>

      <h3 className={styles.sectionHeading}>
        <span className={styles.headingOrnament}>✦</span>
        {t('project3_modulesTitle')}
      </h3>

      <div className={styles.tableWrapper}>
        <table className={styles.modulesTable}>
          <thead>
            <tr>
              <th>{t('project3_modulesColModule')}</th>
              <th>{t('project3_modulesColDescription')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className={styles.moduleIcon}>📋</span>
                <strong>PHPUnit</strong>
              </td>
              <td>{t('project3_phpunit_desc')}</td>
            </tr>
            <tr>
              <td>
                <span className={styles.moduleIcon}>⚙️</span>
                <strong>GrumPHP</strong>
              </td>
              <td>{t('project3_grumphp_desc')}</td>
            </tr>
            <tr>
              <td>
                <span className={styles.moduleIcon}>🔀</span>
                <strong>CI</strong>
              </td>
              <td>{t('project3_ci_desc')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Project3Content;