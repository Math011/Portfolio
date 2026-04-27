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

  // Étoiles : on les génère une seule fois (positions fixes pour ne pas
  // qu'elles bougent à chaque re-render).
  // IMPORTANT : les hooks React (useMemo) doivent TOUJOURS être appelés
  // dans le même ordre. Donc on les appelle AVANT toute condition de retour
  // pour respecter les Rules of Hooks.
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
  const sceneOpacity = Math.max(0, Math.min(1, (progress - sceneStart) / (textStart - sceneStart)));
  const sceneTranslate = (1 - sceneOpacity) * 40;
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

      {/* La scène (tente + voyageur + feu) */}
      <div
        className={styles.scene}
        style={{
          opacity: sceneOpacity,
          transform: `translateY(${sceneTranslate}px)`,
        }}
      >
        {/* Tente */}
        <svg className={styles.tent} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="10,85 50,18 90,85" fill="var(--leather)" stroke="var(--leather-dark)" strokeWidth="2" />
          <polygon points="40,85 50,62 60,85" fill="#1F1410" />
          <line x1="50" y1="18" x2="50" y2="85" stroke="var(--leather-dark)" strokeWidth="1" />
          {/* Lumière douce dans la tente */}
          <ellipse cx="50" cy="78" rx="6" ry="3" fill="var(--cloud)" opacity="0.55" />
        </svg>

        {/* Voyageur assis sur un rondin */}
        <svg className={styles.traveler} viewBox="0 0 70 90" aria-hidden="true">
          {/* Rondin */}
          <ellipse cx="35" cy="78" rx="22" ry="6" fill="var(--leather-dark)" />
          <ellipse cx="35" cy="76" rx="20" ry="3" fill="var(--leather)" />
          {/* Jambes pliées */}
          <rect x="24" y="58" width="6" height="20" rx="3" fill="#3A2818" />
          <rect x="40" y="58" width="6" height="20" rx="3" fill="#3A2818" />
          {/* Corps légèrement voûté */}
          <path d="M 21 58 Q 19 36 28 28 L 46 28 Q 50 36 48 58 Z" fill="var(--accent)" />
          {/* Tête */}
          <circle cx="37" cy="25" r="7" fill="var(--cloud)" />
          {/* Cheveux */}
          <path d="M 30 25 Q 37 13 44 25 L 44 21 Q 37 11 30 21 Z" fill="var(--ink-soft)" />
          {/* Bras tendus vers le feu */}
          <path d="M 25 44 Q 18 56 14 62" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 47 44 Q 56 54 60 60" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>

        {/* Feu de camp avec lueur */}
        <div className={styles.fire} aria-hidden="true">
          <div className={styles.fireGlow} />
          <svg viewBox="0 0 100 100" className={styles.fireSvg}>
            {/* Pierres */}
            <ellipse cx="50" cy="82" rx="32" ry="6" fill="var(--ink)" opacity="0.55" />
            <circle cx="22" cy="82" r="6" fill="var(--ink-soft)" />
            <circle cx="36" cy="85" r="5" fill="#7A6855" />
            <circle cx="64" cy="85" r="5" fill="var(--ink-soft)" />
            <circle cx="78" cy="82" r="6" fill="#7A6855" />
            {/* Bois */}
            <rect x="28" y="68" width="44" height="6" rx="2" fill="var(--leather-dark)" transform="rotate(-8 50 71)" />
            <rect x="30" y="74" width="40" height="6" rx="2" fill="var(--leather)" transform="rotate(8 50 77)" />
            {/* Flammes — vacillantes */}
            <g className={styles.flames}>
              <path d="M 34 72 Q 50 24 66 72 Z" fill="#FF6B35" />
              <path d="M 40 72 Q 50 38 60 72 Z" fill="#FFD23F" />
              <path d="M 45 72 Q 50 52 55 72 Z" fill="#FFFFFF" opacity="0.85" />
            </g>
          </svg>
        </div>
      </div>

      {/* Texte + bouton */}
      <div
        className={styles.message}
        style={{
          opacity: textOpacity,
          pointerEvents: textOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <p className={styles.kicker}>— {t('finishKicker') || 'Fin du voyage'}</p>
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