import React, { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './FinishMenu.module.css';

/**
 * FinishMenu — scène nocturne d'arrivée.
 *
 * Concept : la nuit tombe, le voyageur est arrivé à son campement.
 * Une tente à gauche, le voyageur assis sur un rondin face au feu de camp,
 * sous un ciel étoilé avec une lune. C'est le repos après le voyage.
 *
 * Phases :
 *   - 88% → 92% : la nuit tombe (overlay sombre apparaît, étoiles scintillent)
 *   - 92% → 96% : la scène (tente + voyageur + feu) entre depuis le bas
 *   - 96% → 100% : titre + bouton apparaissent
 */
const FinishMenu = ({ progress, onRestart }) => {
  const { t } = useLanguage();

  const nightStart = 88;
  const sceneStart = 92;
  const textStart = 96;

  // Étoiles : on les génère une seule fois (positions fixes pour ne pas qu'elles bougent à chaque re-render).
  const stars = useMemo(() => {
    const arr = [];
    const seed = (i) => Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
    for (let i = 0; i < 60; i++) {
      arr.push({
        top: seed(i) * 55,                   // 0 → 55% (haut du ciel)
        left: seed(i + 100) * 100,
        size: 1.5 + seed(i + 200) * 2.5,     // 1.5 à 4 px
        delay: seed(i + 300) * 3,            // décalage d'animation
        duration: 2.5 + seed(i + 400) * 2,   // 2.5 → 4.5s
      });
    }
    return arr;
  }, []);

  // Avant 88% on n'affiche rien (return APRÈS les hooks)
  if (progress < nightStart) return null;

  const nightOpacity = Math.min(1, (progress - nightStart) / (sceneStart - nightStart));
  const textOpacity = Math.max(0, Math.min(1, (progress - textStart) / (100 - textStart)));

  return (
    <div className={styles.finishMenu} style={{ opacity: nightOpacity }}>
      {/* Overlay nocturne (couvre le paysage de jour) */}
      <div className={styles.nightOverlay} aria-hidden="true" />

      {/* Lune avec halo */}
      <div className={styles.moon} aria-hidden="true">
        <div className={styles.moonHalo} />
        <div className={styles.moonBody}>
          <span className={styles.crater1} />
          <span className={styles.crater2} />
        </div>
      </div>

      {/* Étoiles qui scintillent */}
      <div className={styles.stars} aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Texte + bouton */}
      <div
        className={styles.message}
        style={{
          opacity: textOpacity,
          pointerEvents: textOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <p className={styles.kicker}>— 05 {t('finishKicker') || 'Fin du voyage'}</p>
        <h2 className={styles.title}>{t('finishTitle')}</h2>
        <p className={styles.subtitle}>{t('finishSubtitle')}</p>
        <button
          type="button"
          className={styles.restart}
          onClick={onRestart}
        >
          {t('finishRestart')}
        </button>
      </div>
    </div>
  );
};

export default FinishMenu;