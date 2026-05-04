import { useEffect, useState } from 'react';

// Détecte un refresh ou un chargement initial direct.
const computeIsInitialLoad = () => {
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
const INITIAL_LOAD = computeIsInitialLoad();
const LOADING_DURATION = 800;

/**
 * Retourne true si on est dans la fenêtre de loading initial après un refresh.
 *
 * Logique :
 *   - Au refresh (F5), le module JS est rechargé : APP_START_TIME = now,
 *     INITIAL_LOAD = true. Pendant 1500ms le hook retourne true.
 *   - Au-delà de 1500ms (navigation interne), le hook retourne toujours false.
 */
export const useInitialLoading = (routeKey) => {
  const [isLoading, setIsLoading] = useState(() => {
    if (!routeKey) return false;
    if (!INITIAL_LOAD) return false;
    const elapsed = Date.now() - APP_START_TIME;
    return elapsed < LOADING_DURATION;
  });

  useEffect(() => {
    if (!isLoading) return;
    const elapsed = Date.now() - APP_START_TIME;
    const remaining = Math.max(0, LOADING_DURATION - elapsed);
    const t = setTimeout(() => setIsLoading(false), remaining);
    return () => clearTimeout(t);
  }, [isLoading]);

  return isLoading;
};