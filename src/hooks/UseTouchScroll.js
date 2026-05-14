import { useEffect, useRef } from 'react';

// =============================================================================
// useTouchScroll
// -----------------------------------------------------------------------------
// Simule des évènements `wheel` à partir de gestes tactiles, pour que
// useVideoScroll (qui écoute uniquement `wheel`) fonctionne sur mobile.
//
// sensitivity 6.0 par défaut : tres rapide. Sur mobile avec peu de course
// de doigt, on amplifie fort pour traverser la vidéo en quelques swipes.
//
// debug=true affiche les events dans la console (à activer temporairement
// pour vérifier que le hook tourne bien sur iPhone).
// =============================================================================

const useTouchScroll = ({ enabled = true, sensitivity = 6.0, debug = false } = {}) => {
  const lastTouchYRef = useRef(0);
  const isTouchingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        lastTouchYRef.current = e.touches[0].clientY;
        isTouchingRef.current = true;
        if (debug) console.log('[touchscroll] start y=', lastTouchYRef.current);
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouchingRef.current || !e.touches || e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchYRef.current - currentY;
      lastTouchYRef.current = currentY;

      // Bloque le scroll natif pour éviter le double effet
      e.preventDefault();

      const amplifiedDelta = deltaY * sensitivity;

      if (debug) console.log('[touchscroll] dy=', deltaY, 'amp=', amplifiedDelta);

      // WheelEvent synthétique — useVideoScroll le recevra comme un scroll molette
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: amplifiedDelta,
        deltaMode: 0,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(wheelEvent);
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
      if (debug) console.log('[touchscroll] end');
    };

    // passive: false OBLIGATOIRE pour pouvoir preventDefault sur Chrome 56+ et iOS
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
  }, [enabled, sensitivity, debug]);
};

export default useTouchScroll;