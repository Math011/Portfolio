import { useRef, useEffect, useState } from 'react';

const STORAGE_KEY = 'portfolio_progress';
const VIDEO_TIME_KEY = 'portfolio_video_time';

/**
 * Lance video.play() en ignorant proprement les erreurs liées à un pause()
 * qui arriverait avant que la promesse de play() soit résolue.
 * (Erreur classique : "The play() request was interrupted by a call to pause()".)
 */
const safePlay = (video) => {
  if (!video || !video.paused) return;
  const p = video.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => { /* ignoré : interruption normale */ });
  }
};

const useVideoScroll = (videoRef) => {
  const lastScrollTimeRef = useRef(0);
  const rafRef = useRef(null);
  const directionRef = useRef(1);
  const progressRef = useRef(0);
  const targetPositionRef = useRef(null);
  const isFastForwardRef = useRef(false);
  const smoothProgressRef = useRef(0);
  const isAtEndRef = useRef(false);
  const isInitializedRef = useRef(false);
  const isMouseScrollRef = useRef(false);

  // Récupère la progression sauvegardée au démarrage
  const getSavedProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const value = parseFloat(saved);
        if (!isNaN(value) && value >= 0 && value <= 100) {
          return value;
        }
      }
    } catch (e) {
      console.warn('Could not read progress from localStorage');
    }
    return 0;
  };

  // Récupère le temps vidéo sauvegardé
  const getSavedVideoTime = () => {
    try {
      const saved = localStorage.getItem(VIDEO_TIME_KEY);
      if (saved) {
        const value = parseFloat(saved);
        if (!isNaN(value) && value >= 0) {
          return value;
        }
      }
    } catch (e) {
      console.warn('Could not read video time from localStorage');
    }
    return 0;
  };

  const [progress, setProgress] = useState(getSavedProgress);

  // Sauvegarde la progression dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, progress.toString());
    } catch (e) {
      console.warn('Could not save to localStorage');
    }
  }, [progress]);

  // Sauvegarde le temps vidéo régulièrement et avant de quitter
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Sauvegarde toutes les 500ms (uniquement si la vidéo joue vraiment,
    // pour éviter d'écraser la valeur sauvée par un 0 parasite au boot).
    const saveInterval = setInterval(() => {
      try {
        if (video.currentTime > 0.1) {
          localStorage.setItem(VIDEO_TIME_KEY, video.currentTime.toString());
        }
      } catch (e) {}
    }, 500);

    // Sauvegarde avant de quitter la page (refresh F5, fermeture de l'onglet).
    // Cette sauvegarde-ci EST autorisée même si currentTime est petit, car
    // l'utilisateur a peut-être juste regardé le tout début.
    const handleBeforeUnload = () => {
      try {
        if (video.currentTime > 0.1) {
          localStorage.setItem(VIDEO_TIME_KEY, video.currentTime.toString());
          localStorage.setItem(STORAGE_KEY, progressRef.current.toString());
        }
      } catch (e) {}
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Sauvegarder la position courante au démontage (navigation React Router).
      // IMPORTANT : on ne sauvegarde que si la vidéo a vraiment chargé et que
      // currentTime est cohérent (>0.1s). Sinon on risque d'écraser une bonne
      // valeur sauvegardée par un "0" parasite (cas du refresh + StrictMode où
      // le cleanup s'exécute avant que la vidéo n'ait eu le temps de se
      // positionner sur savedVideoTime).
      try {
        if (video && !isNaN(video.currentTime) && video.currentTime > 0.1) {
          localStorage.setItem(VIDEO_TIME_KEY, video.currentTime.toString());
          localStorage.setItem(STORAGE_KEY, progressRef.current.toString());
        }
      } catch (e) {}
    };
  }, [videoRef]);

  // Calcule le multiplicateur de vitesse selon la section.
  // Avant, on ralentissait dans la section Projets pour laisser le temps à
  // chaque projet d'apparaître un par un. Maintenant qu'on n'affiche plus
  // qu'une seule carte "Voir tous mes projets", la section va à vitesse
  // normale comme les autres.
  const getSectionSpeedModifier = (currentProgress) => {
    return 1;
  };

  // Fonction pour naviguer vers une section : SAUT DIRECT (téléportation).
  // On met immédiatement progressRef, smoothProgressRef, et setProgress à la
  // valeur cible, et on synchronise la vidéo à la frame correspondante.
  // Le petit "fondu" visuel se fait côté CSS (transition d'opacité du conteneur).
  const navigateToSection = (targetPosition) => {
    const video = videoRef.current;
    if (!video) return;

    const target = Math.max(0, Math.min(100, targetPosition));

    // Reset des flags d'état
    isFastForwardRef.current = false;
    targetPositionRef.current = null;
    isAtEndRef.current = target >= 100;
    directionRef.current = target >= progressRef.current ? 1 : -1;

    // Téléportation immédiate de la progression (= la barre de menu, les sections
    // actives, l'apparition des cartes). On NE TOUCHE PAS à video.currentTime
    // pour que la vidéo de fond reste sur sa frame actuelle, comme un décor
    // statique — l'utilisateur garde son repère visuel pendant la navigation.
    progressRef.current = target;
    smoothProgressRef.current = target;
    setProgress(target);

    // On met la vidéo en pause au cas où elle serait en lecture (la molette
    // pourra la relancer ensuite si besoin).
    video.pause();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initialise les refs et la vidéo avec les valeurs sauvegardées
    if (!isInitializedRef.current) {
      const savedProgress = getSavedProgress();
      const savedVideoTime = getSavedVideoTime();
      
      progressRef.current = savedProgress;
      smoothProgressRef.current = savedProgress;
      if (savedProgress >= 100) {
        isAtEndRef.current = true;
      }

      // Synchronise la vidéo avec le temps sauvegardé.
      // Si la vidéo est déjà proche de la valeur sauvée (cas d'un remount React
      // Router où la vidéo n'a pas été démontée), on ne touche pas à currentTime
      // pour éviter le saut visuel.
      const syncVideoTime = () => {
        const setTimeIfNeeded = () => {
          const target = savedVideoTime % video.duration;
          const current = video.currentTime;
          if (Math.abs(current - target) > 0.5) {
            video.currentTime = target;
          }
          isInitializedRef.current = true;
        };

        if (video.readyState >= 1) {
          setTimeIfNeeded();
        } else {
          video.addEventListener('loadedmetadata', setTimeIfNeeded, { once: true });
        }
      };
      
      syncVideoTime();
    }

    let animationId;
    let lastVideoTime = 0;

    const handleWheel = (e) => {
      // Détecte si c'est une souris (deltaY >= 100)
      const isMouse = Math.abs(e.deltaY) >= 100;
      isMouseScrollRef.current = isMouse;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const currentProgress = progressRef.current;
      
      // Bloque uniquement le scroll vers le haut si on est à la fin
      if (isAtEndRef.current && direction > 0) {
        return;
      }
      
      // Reset isAtEnd si on scroll vers le bas (reculer)
      if (direction < 0 && isAtEndRef.current) {
        isAtEndRef.current = false;
      }
      
      lastScrollTimeRef.current = performance.now();
      isFastForwardRef.current = false;
      targetPositionRef.current = null;
      
      const canMove = (direction > 0 && currentProgress < 100) || 
                      (direction < 0 && currentProgress > 0);

      if (canMove) {
        directionRef.current = direction;
        if (video.paused) {
          safePlay(video);
        }
        
        if (!rafRef.current) {
          checkScrollStop();
        }
      }
    };

    const checkScrollStop = () => {
      const now = performance.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;
      
      // Souris : 600ms, Trackpad : 200ms
      const stopDelay = isMouseScrollRef.current ? 600 : 200;

      if (timeSinceLastScroll > stopDelay) {
        video.pause();
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(checkScrollStop);
    };

    const updateProgress = () => {
      if (video.duration && !video.paused) {
        // Si on est à la fin et on essaie d'avancer, pause immédiate
        if (isAtEndRef.current && directionRef.current > 0) {
          video.pause();
          lastVideoTime = video.currentTime;
          animationId = requestAnimationFrame(updateProgress);
          return;
        }
        
        const videoTimeDelta = video.currentTime - lastVideoTime;
        
        if (Math.abs(videoTimeDelta) < 0.5) {
          const baseSpeed = 0.5;
          const sectionModifier = getSectionSpeedModifier(progressRef.current);
          const speedMultiplier = isFastForwardRef.current ? 4 : baseSpeed * sectionModifier;
          const progressDelta = (videoTimeDelta / video.duration) * 100 * directionRef.current * speedMultiplier;
          
          let newProgress = Math.max(0, Math.min(100, progressRef.current + progressDelta));
          
          // Bloque à 100% et marque comme terminé
          if (newProgress >= 100) {
            newProgress = 100;
            isAtEndRef.current = true;
            smoothProgressRef.current = 100;
            setProgress(100);
            video.pause();
            lastVideoTime = video.currentTime;
            animationId = requestAnimationFrame(updateProgress);
            return;
          }
          
          // Pause la vidéo si on atteint 0%
          if (newProgress <= 0 && directionRef.current < 0) {
            video.pause();
          }
          
          if (isFastForwardRef.current && targetPositionRef.current !== null) {
            const target = targetPositionRef.current;
            const reachedTarget = (directionRef.current > 0 && newProgress >= target) ||
                                  (directionRef.current < 0 && newProgress <= target);
            
            if (reachedTarget) {
              newProgress = target;
              isFastForwardRef.current = false;
              targetPositionRef.current = null;
              video.pause();
            }
          }
          
          progressRef.current = newProgress;
        }
      }
      
      if (!isAtEndRef.current) {
        const diff = progressRef.current - smoothProgressRef.current;
        if (Math.abs(diff) > 0.001) {
          smoothProgressRef.current += diff * 0.2;
          setProgress(smoothProgressRef.current);
        }
      }
      
      lastVideoTime = video.currentTime;
      animationId = requestAnimationFrame(updateProgress);
    };

    animationId = requestAnimationFrame(updateProgress);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Quand HomePage se démonte (navigation vers une autre page), on met
      // la vidéo en pause pour qu'elle reste à sa position actuelle.
      if (video) {
        try { video.pause(); } catch (e) {}
      }
    };
  }, [videoRef]);

  return { progress, navigateToSection };
};

export default useVideoScroll;