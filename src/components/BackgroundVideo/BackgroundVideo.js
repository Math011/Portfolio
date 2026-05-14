import React, { forwardRef, useEffect } from 'react';
import styles from './BackgroundVideo.module.css';

// =============================================================================
// BackgroundVideo
// -----------------------------------------------------------------------------
// Vidéo de fond avec contrôle externe (via ref) pour le scroll-vidéo.
// =============================================================================

const BackgroundVideo = forwardRef(({ src }, ref) => {
  // Pause forcée dès que la vidéo est prête, pour rendre la main à useVideoScroll.
  // L'autoPlay HTML a déjà fait son travail (débloquer iOS) à ce moment-là.
  useEffect(() => {
    const video = ref?.current;
    if (!video) return;

    const handleLoaded = () => {
      // Sur iOS, play() peut renvoyer une promesse qui rejette. On capture.
      try {
        video.pause();
      } catch (e) {
        // Ignoré : la pause est best-effort
      }
    };

    // Si déjà chargée, pause direct
    if (video.readyState >= 1) {
      handleLoaded();
    } else {
      video.addEventListener('loadedmetadata', handleLoaded, { once: true });
      return () => video.removeEventListener('loadedmetadata', handleLoaded);
    }
  }, [ref]);

  return (
    <section className="video-section">
      <video
        ref={ref}
        className={styles.backgroundVideo}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />
    </section>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';

export default BackgroundVideo;