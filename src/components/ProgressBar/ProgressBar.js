import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { journeySteps } from '../../data/journeySteps';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ progress, activeSection, onNavigate }) => {
  const { t } = useLanguage();
  
  // Map des clés de traduction pour chaque step
  const labelKeys = {
    accueil: 'home',
    propos: 'about',
    projects: 'projects',
    contact: 'contact'
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
        
        {journeySteps.map((step) => (
          <div
            key={step.id}
            className={styles.progressStep}
            style={{ left: `${step.position}%` }}
          >
            <div 
              className={`${styles.stepIcon} ${
                progress >= step.position ? styles.stepActive : styles.stepInactive
              }`}
              onClick={() => onNavigate(step.position)}
            >
              {step.icon}
            </div>
            <div className={styles.stepLabel}>
              <span 
                className={`${styles.labelText} ${
                  activeSection === step.id ? styles.labelActive : styles.labelInactive
                }`}
                onClick={() => onNavigate(step.position)}
              >
                {t(labelKeys[step.id]) || step.label}
              </span>
            </div>
          </div>
        ))}
        
        <div className={styles.finishLine}>
          <div className={styles.finishIcon}>🏁</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;