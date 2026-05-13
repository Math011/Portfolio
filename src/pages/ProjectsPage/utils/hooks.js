import { useEffect } from 'react';

// Hook pour animation de flottement avec direction aléatoire
export const useFloatingAnimation = (cardRef, seed) => {
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    let animationId;
    let startTime = null;

    card.style.transform = 'translateY(0) translateX(0) rotate(0deg)';

    const cycleDuration = 5500 + (seed % 5) * 500;

    let currentTargetX = 0;
    let currentTargetY = -(16 + Math.random() * 12);
    let currentTargetRotate = 0;
    let lastPhase = 'down';

    const generateRandomDirection = () => {
      const rand = Math.random();
      if (rand < 0.33) {
        currentTargetX = -(10 + Math.random() * 12);
        currentTargetRotate = -(1 + Math.random() * 1.2);
      } else if (rand < 0.66) {
        currentTargetX = -3 + Math.random() * 6;
        currentTargetRotate = -0.5 + Math.random() * 1;
      } else {
        currentTargetX = 10 + Math.random() * 12;
        currentTargetRotate = 1 + Math.random() * 1.2;
      }
    };

    generateRandomDirection();

    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const elapsed = (timestamp - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration;

      let y, x, rotate;

      if (progress < 0.5) {
        const phaseProgress = easeInOut(progress * 2);
        y = currentTargetY * phaseProgress;
        x = currentTargetX * phaseProgress;
        rotate = currentTargetRotate * phaseProgress;

        if (lastPhase === 'down') {
          lastPhase = 'up';
          generateRandomDirection();
          currentTargetY = -(16 + Math.random() * 12);
        }
      } else {
        const phaseProgress = easeInOut((progress - 0.5) * 2);
        y = currentTargetY * (1 - phaseProgress);
        x = currentTargetX * (1 - phaseProgress);
        rotate = currentTargetRotate * (1 - phaseProgress);

        if (lastPhase === 'up') lastPhase = 'down';
      }

      card.style.transform = `translateY(${y}px) translateX(${x}px) rotate(${rotate}deg)`;
      animationId = requestAnimationFrame(animate);
    };

    const initialDelay = (seed * 500) % 3000;
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [cardRef, seed]);
};