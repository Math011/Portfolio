import { useRef, useEffect, useState } from 'react';
import { projects } from '../data/projects';

const useVideoScroll = (videoRef) => {
  const lastScrollTimeRef = useRef(0);
  const rafRef = useRef(null);
  const directionRef = useRef(1);
  const progressRef = useRef(0);
  const targetPositionRef = useRef(null);
  const isFastForwardRef = useRef(false);
  const smoothProgressRef = useRef(0);
  const isAtEndRef = useRef(false);

  const [progress, setProgress] = useState(0);

  // Calcule le multiplicateur de vitesse selon la section
  const getSectionSpeedModifier = (currentProgress) => {
    // Titre "Mes Projets" : 42% à 45% (ralentit de 2/4)
    if (currentProgress >= 42 && currentProgress < 45) {
      return 2 / 4.5;
    }
    // Section Projets : 45% à 62%
    if (currentProgress >= 45 && currentProgress < 62) {
      // Ralentit selon le nombre de projets
      return 2 / projects.length;
    }
    return 1;
  };

  // Fonction pour naviguer vers une section
  const navigateToSection = (targetPosition) => {
    const video = videoRef.current;
    if (!video) return;

    // Reset isAtEnd si on navigue ailleurs
    if (targetPosition < 100) {
      isAtEndRef.current = false;
    }

    const currentProgress = progressRef.current;
    if (targetPosition === currentProgress) return;

    directionRef.current = targetPosition > currentProgress ? 1 : -1;
    targetPositionRef.current = targetPosition;
    isFastForwardRef.current = true;

    if (video.paused) {
      video.play();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationId;
    let lastVideoTime = 0;

    const handleWheel = (e) => {
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
          video.play();
        }
        
        if (!rafRef.current) {
          checkScrollStop();
        }
      }
    };

    const checkScrollStop = () => {
      const now = performance.now();

      if (now - lastScrollTimeRef.current > 200) {
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
      
      // Lissage de la progression affichée (sauf si à la fin)
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
    };
  }, [videoRef]);

  return { progress, navigateToSection };
};

export default useVideoScroll;