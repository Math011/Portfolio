import { useEffect, useState } from 'react';

// Détecte si la page actuelle a été chargée via refresh/arrivée initiale.
// La valeur est calculée une fois au chargement du module JS et reste stable
// jusqu'au prochain refresh.
const computeIsInitial = () => {
  if (typeof window === 'undefined' || !window.performance) return false;
  try {
    const navEntries = window.performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      const t = navEntries[0].type;
      return t === 'reload' || t === 'navigate' || t === 'back_forward';
    }
  } catch (e) {}
  return false;
};

const APP_START_TIME = Date.now();
const INITIAL_LOAD = computeIsInitial();
const LOADING_DURATION = 1500; // ms

// Hook qui retourne true si on est encore dans la fenêtre de loading initial.
// Robuste à React StrictMode car basé sur le temps écoulé, pas sur un compteur
// de mount.
export const useInitialLoading = () => {
  const [isLoading, setIsLoading] = useState(() => {
    if (!INITIAL_LOAD) return false;
    const elapsed = Date.now() - APP_START_TIME;
    return elapsed < LOADING_DURATION;
  });

  useEffect(() => {
    if (!INITIAL_LOAD) return;
    const elapsed = Date.now() - APP_START_TIME;
    const remaining = LOADING_DURATION - elapsed;
    if (remaining <= 0) {
      setIsLoading(false);
      return;
    }
    const t = setTimeout(() => setIsLoading(false), remaining);
    return () => clearTimeout(t);
  }, []);

  return isLoading;
};