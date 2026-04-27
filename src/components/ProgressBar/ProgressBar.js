import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { journeySteps } from '../../data/journeySteps';
import { RunnerIcon, CheckeredFlag } from './icons';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ progress, activeSection, onNavigate }) => {
  const { t } = useLanguage();

  // Map des clés de traduction pour chaque step
  const labelKeys = {
    accueil: 'home',
    propos: 'about',
    projects: 'projects',
    contact: 'contact',
  };

  // Détermine l'index actif (-1 = avant tout, journeySteps.length = arrivée)
  const activeIdx = activeSection
    ? journeySteps.findIndex((s) => s.id === activeSection)
    : (progress >= 100 ? journeySteps.length : -1);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.track}>
        {/* Ligne pointillée de fond */}
        <div className={styles.trackLine} />

        {/* Progression colorée par-dessus */}
        <div
          className={styles.trackProgress}
          style={{ width: `${progress}%` }}
        />

        {/* Le coureur qui suit le scroll, position en pourcentage */}
        <div
          className={styles.runner}
          style={{
            left: `${progress}%`,
            opacity: progress < 0.5 ? 0 : 1,
          }}
          aria-hidden="true"
        >
          <RunnerIcon />
        </div>

        {/* Nœuds des étapes */}
        {journeySteps.map((step, i) => {
          const isPassed = i < activeIdx;
          const isActive = i === activeIdx;
          const labelText = t(labelKeys[step.id]) || step.label;

          const nodeClass = [
            styles.node,
            isPassed && styles.nodePassed,
            isActive && styles.nodeActive,
          ].filter(Boolean).join(' ');

          return (
            <button
              key={step.id}
              type="button"
              className={nodeClass}
              style={{ left: `${step.position}%` }}
              onClick={() => onNavigate(step.position)}
              aria-label={labelText}
            >
              <span className={styles.nodeDot}>
                <span className={styles.dotRing} aria-hidden="true" />
                <span className={styles.dotIcon}>{step.icon}</span>
              </span>
              <span className={styles.nodeLabel}>{labelText}</span>
            </button>
          );
        })}

        {/* Drapeau à damier en bout de ligne (simple, statique) */}
        <div
          className={`${styles.node} ${styles.nodeFinish} ${
            progress >= 100 ? styles.nodeFinishActive : ''
          }`}
          aria-label="Arrivée"
        >
          <span className={styles.nodeDot}>
            <span className={styles.dotIcon}>
              <CheckeredFlag />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;