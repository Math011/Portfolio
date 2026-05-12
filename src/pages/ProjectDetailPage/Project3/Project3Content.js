import React from 'react';
import styles from './RichContent.module.css';

// =============================================================================
// CONTENU RICHE — PROJET 3 (Template Docker Symfony)
// -----------------------------------------------------------------------------
// Pour ajouter du contenu enrichi à d'autres projets, créer un composant
// similaire et le brancher dans ProjectsData.js via la propriété `customContent`.
// =============================================================================

const Project3Content = ({ language }) => {
  const isEn = language === 'en';

  return (
    <div className={styles.richContent}>
      <p className={styles.lead}>
        {isEn
          ? 'Reusable Docker template designed to spin up Symfony projects with PostgreSQL in just a few minutes.'
          : 'Template Docker réutilisable conçu pour créer des projets Symfony avec PostgreSQL en quelques minutes.'}
      </p>

      <div className={styles.divider}>
        <span className={styles.dividerOrnament}>⋄⋄</span>
      </div>

      <p className={styles.subLead}>
        {isEn ? 'The project supports two architectures:' : 'Le projet supporte deux architectures :'}
      </p>

      <ul className={styles.featureList}>
        <li>
          <strong>Symfony + Twig</strong>
          <span className={styles.featureDesc}>
            {isEn
              ? 'Classic server-side application with Twig rendering.'
              : 'Application server-side classique avec rendu Twig.'}
          </span>
        </li>
        <li>
          <strong>Symfony API + React/TypeScript</strong>
          <span className={styles.featureDesc}>
            {isEn
              ? 'Modern SPA with API Platform and React frontend.'
              : 'SPA moderne avec API Platform et frontend React.'}
          </span>
        </li>
      </ul>

      <h3 className={styles.sectionHeading}>
        <span className={styles.headingOrnament}>✦</span>
        {isEn ? 'Available optional modules' : 'Modules optionnels disponibles'}
      </h3>

      <div className={styles.tableWrapper}>
        <table className={styles.modulesTable}>
          <thead>
            <tr>
              <th>Module</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className={styles.moduleIcon}>📋</span>
                <strong>PHPUnit</strong>
              </td>
              <td>
                {isEn
                  ? 'Testing framework with a sample test'
                  : "Framework de tests avec un test d'exemple"}
              </td>
            </tr>
            <tr>
              <td>
                <span className={styles.moduleIcon}>⚙️</span>
                <strong>GrumPHP</strong>
              </td>
              <td>PHPStan, PHP CS Fixer, Twig CS Fixer, YAML Lint, Composer Normalize</td>
            </tr>
            <tr>
              <td>
                <span className={styles.moduleIcon}>🔀</span>
                <strong>CI</strong>
              </td>
              <td>
                {isEn
                  ? 'GitHub Actions — quality, tests, build and security'
                  : 'GitHub Actions — qualité, tests, build et sécurité'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Project3Content;
