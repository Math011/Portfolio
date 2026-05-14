import { useEffect, useRef } from 'react';

// =============================================================================
// useTouchScroll
// -----------------------------------------------------------------------------
// Hook qui simule des événements `wheel` à partir de gestes tactiles, pour que
// useVideoScroll (qui écoute uniquement `wheel`) fonctionne sur mobile.
//
// Principe :
//   1. Capture touchstart pour mémoriser la position Y initiale
//   2. À chaque touchmove, calcule le delta Y depuis le dernier point
//   3. Dispatche un WheelEvent synthétique avec ce deltaY (× sensitivity)
//   4. useVideoScroll le reçoit comme un scroll molette
//
// `preventDefault()` sur touchmove bloque le scroll natif pendant qu'on
// contrôle la vidéo (sinon double effet : page qui scroll + vidéo qui avance).
// =============================================================================

const useTouchScroll = ({ enabled = true, sensitivity = 3.5 } = {}) => {
  const lastTouchYRef = useRef(0);
  const isTouchingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        lastTouchYRef.current = e.touches[0].clientY;
        isTouchingRef.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouchingRef.current || !e.touches || e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchYRef.current - currentY;
      lastTouchYRef.current = currentY;

      // Bloque le scroll natif pour éviter le double effet
      e.preventDefault();

      // sensitivity élevée (3.5 par défaut) : un swipe court = beaucoup de
      // progression vidéo. Sur mobile les écrans sont petits, donc on a
      // peu de "course de doigt" — on amplifie pour traverser la vidéo
      // en quelques swipes.
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: deltaY * sensitivity,
        deltaMode: 0,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(wheelEvent);
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
    };

    // passive: false OBLIGATOIRE pour que preventDefault fonctionne sur les
    // navigateurs modernes (Chrome 56+, iOS Safari).
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, sensitivity]);
};

export default useTouchScroll;