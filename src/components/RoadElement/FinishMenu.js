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

      {/* La scène (tente + voyageur + lanterne) */}
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

        {/* Voyageur assis sur un rondin — pose détendue */}
        <svg className={styles.traveler} viewBox="0 0 70 90" aria-hidden="true">
          {/* Rondin */}
          <ellipse cx="35" cy="78" rx="22" ry="6" fill="var(--leather-dark)" />
          <ellipse cx="35" cy="76" rx="20" ry="3" fill="var(--leather)" />
          {/* Jambes pliées */}
          <rect x="24" y="58" width="6" height="20" rx="3" fill="#3A2818" />
          <rect x="40" y="58" width="6" height="20" rx="3" fill="#3A2818" />
          {/* Corps légèrement voûté (relax) */}
          <path d="M 21 58 Q 19 36 28 28 L 46 28 Q 50 36 48 58 Z" fill="var(--accent)" />
          {/* Tête légèrement penchée vers le ciel */}
          <circle cx="37" cy="25" r="7" fill="var(--cloud)" />
          {/* Cheveux */}
          <path d="M 30 25 Q 37 13 44 25 L 44 21 Q 37 11 30 21 Z" fill="var(--ink-soft)" />
          {/* Bras gauche posé sur le genou (relax) */}
          <path d="M 25 44 Q 22 54 26 60" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Bras droit pendant le long du corps */}
          <path d="M 47 44 Q 50 56 48 64" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>

        {/* Lanterne suspendue à un poteau */}
        <div className={styles.lantern} aria-hidden="true">
          {/* Halo lumineux autour */}
          <div className={styles.lanternGlow} />

          <svg viewBox="0 0 80 130" className={styles.lanternSvg}>
            {/* Poteau planté dans le sol */}
            <rect x="38" y="35" width="4" height="90" rx="1" fill="var(--leather-dark)" />
            {/* Crochet en haut du poteau */}
            <path d="M 40 35 Q 40 30 35 30 Q 30 30 30 38" stroke="var(--leather-dark)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Anse de la lanterne */}
            <path d="M 22 38 Q 22 42 30 42 L 30 50" stroke="var(--ink-soft)" strokeWidth="1.5" fill="none" />

            {/* Chapeau de la lanterne */}
            <path d="M 18 50 L 42 50 L 39 44 L 21 44 Z" fill="var(--ink-soft)" />
            <rect x="20" y="46" width="20" height="2" fill="var(--leather-dark)" />

            {/* Corps en verre de la lanterne (avec flamme à l'intérieur) */}
            <rect x="22" y="50" width="16" height="22" rx="1" fill="rgba(255, 215, 100, 0.35)" stroke="var(--ink-soft)" strokeWidth="1" />
            {/* Petites barres verticales (cadre du verre) */}
            <line x1="30" y1="50" x2="30" y2="72" stroke="var(--ink-soft)" strokeWidth="0.6" />
            <line x1="22" y1="60" x2="38" y2="60" stroke="var(--ink-soft)" strokeWidth="0.6" />

            {/* Flamme à l'intérieur (animée) */}
            <g className={styles.lanternFlame} style={{ transformOrigin: '30px 65px' }}>
              <path d="M 27 68 Q 30 58 33 68 Q 32 64 30 60 Q 28 64 27 68 Z" fill="#FFD23F" />
              <path d="M 28.5 68 Q 30 62 31.5 68 Z" fill="#FFFFFF" opacity="0.8" />
            </g>

            {/* Base de la lanterne */}
            <rect x="20" y="71" width="20" height="3" fill="var(--ink-soft)" />
            <rect x="22" y="74" width="16" height="2" fill="var(--leather-dark)" />
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