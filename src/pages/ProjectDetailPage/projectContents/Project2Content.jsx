import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import styles from './RichContent.module.css';

// =============================================================================
// CONTENU RICHE — PROJET 2 (InfoSpread Lab)
// -----------------------------------------------------------------------------
// Les textes contiennent des balises <strong> pour mettre en avant les mots
// clés. On les rend via dangerouslySetInnerHTML — sûr ici car le contenu vient
// de nos propres fichiers de traduction (pas d'input utilisateur).
// =============================================================================

// Helper pour rendre du HTML inline depuis une string de traduction.
// Utilise <span> pour rester inline et compatible avec ::first-letter.
const RichSpan = ({ html, className }) => (
  <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

const RichParagraph = ({ html, className }) => (
  <p className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

const Project2Content = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.richContent}>
      {/* Paragraphe d'intro avec lettrine + mots en gras */}
      <RichParagraph className={styles.lead} html={t('project2_fullDescription')} />

      <div className={styles.divider}>
        <span className={styles.dividerOrnament}>⋄⋄</span>
      </div>

      <p className={styles.subLead}>{t('project2_subLead')}</p>

      <ul className={styles.featureList}>
        <li>
          <strong>{t('project2_feature1_title')}</strong>
          <RichSpan className={styles.featureDesc} html={t('project2_feature1_desc')} />
        </li>
        <li>
          <strong>{t('project2_feature2_title')}</strong>
          <RichSpan className={styles.featureDesc} html={t('project2_feature2_desc')} />
        </li>
        <li>
          <strong>{t('project2_feature3_title')}</strong>
          <RichSpan className={styles.featureDesc} html={t('project2_feature3_desc')} />
        </li>
        <li>
          <strong>{t('project2_feature4_title')}</strong>
          <RichSpan className={styles.featureDesc} html={t('project2_feature4_desc')} />
        </li>
      </ul>

      <h3 className={styles.sectionHeading}>
        <span className={styles.headingOrnament}>✦</span>
        {t('project2_experimentsTitle')}
      </h3>

      <div className={styles.tableWrapper}>
        <table className={styles.modulesTable}>
          <thead>
            <tr>
              <th>{t('project2_experimentsColName')}</th>
              <th>{t('project2_experimentsColQuestion')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className={styles.moduleIcon}>🔥</span>
                <strong>{t('project2_exp1_name')}</strong>
              </td>
              <td>{t('project2_exp1_desc')}</td>
            </tr>
            <tr>
              <td>
                <span className={styles.moduleIcon}>🧐</span>
                <strong>{t('project2_exp2_name')}</strong>
              </td>
              <td>{t('project2_exp2_desc')}</td>
            </tr>
            <tr>
              <td>
                <span className={styles.moduleIcon}>🫧</span>
                <strong>{t('project2_exp3_name')}</strong>
              </td>
              <td>{t('project2_exp3_desc')}</td>
            </tr>
            <tr>
              <td>
                <span className={styles.moduleIcon}>🎤</span>
                <strong>{t('project2_exp4_name')}</strong>
              </td>
              <td>{t('project2_exp4_desc')}</td>
            </tr>
            <tr>
              <td>
                <span className={styles.moduleIcon}>✅</span>
                <strong>{t('project2_exp5_name')}</strong>
              </td>
              <td>{t('project2_exp5_desc')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Project2Content;