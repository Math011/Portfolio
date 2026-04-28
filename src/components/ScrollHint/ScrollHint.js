import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './ScrollHint.module.css';

/**
 * ScrollHint — petit message qui apparaît en bas de l'écran quand
 * l'utilisateur reste immobile.
 *
 * Logique :
 * - Au chargement, on attend `INITIAL_DELAY` ms avant d'afficher (laisser
 *   le temps de découvrir la page).
 * - Dès que l'utilisateur scrolle/wheel/touche, on cache le hint
 *   immédiatement et on relance un timer de `INACTIVITY_DELAY` ms.
 * - Si on n'a pas atteint la fin du parcours (progress < 99), on affiche
 *   à nouveau le hint après le délai d'inactivité.
 * - Si on est à 100%, on ne réaffiche plus (le voyage est terminé).
 */
const INITIAL_DELAY = 1200;       // 1.2s avant la première apparition (était 2.5s)
const INACTIVITY_DELAY = 2000;    // 2s d'inactivité pour réafficher (était 4s)

const ScrollHint = ({ progress }) => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Si on est à la fin, on ne montre plus jamais le hint
    if (progress >= 99) {
      setVisible(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const showHint = () => setVisible(true);
    const hideHintAndReschedule = () => {
      setVisible(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(showHint, INACTIVITY_DELAY);
    };

    // Premier affichage : après INITIAL_DELAY au tout début, sinon après INACTIVITY_DELAY
    const firstDelay = progress < 1 ? INITIAL_DELAY : INACTIVITY_DELAY;
    timerRef.current = setTimeout(showHint, firstDelay);

    // Tout évènement d'interaction cache le hint et relance le timer
    const events = ['wheel', 'touchmove', 'keydown', 'mousedown'];
    events.forEach((ev) => window.addEventListener(ev, hideHintAndReschedule, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, hideHintAndReschedule));
    };
    // On veut un seul setup au montage. Les changements de progress
    // arrivent à chaque frame, on ne veut pas re-créer les listeners
    // à chaque fois — sauf si on franchit le seuil 99% (fin du voyage).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress >= 99]);

  return (
    <div
      className={`${styles.hint} ${visible ? styles.visible : ''}`}
      aria-hidden={!visible}
    >
      <span className={styles.text}>
        {t('scrollHint') || 'Faites défiler pour avancer dans le voyage'}
      </span>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Souris stylisée */}
          <rect x="6" y="3" width="12" height="18" rx="6" />
          {/* Petite molette qui descend */}
          <line className={styles.wheel} x1="12" y1="7" x2="12" y2="11" />
        </svg>
      </span>
    </div>
  );
};

export default ScrollHint;