import React, { useState, useEffect, useCallback } from 'react';
import styles from '../ProjectDetailPage.module.css';

// =============================================================================
// PROJECT MAIN IMAGE
// -----------------------------------------------------------------------------
// Image principale du projet, avec :
// - Flèches gauche/droite pour naviguer (si plus d'une image)
// - Compteur "1 / 3" en bas à droite
// - Clic sur l'image → ouvre la lightbox plein écran
// - Navigation clavier (← →) sur l'image principale ET dans la lightbox
// - Échap pour fermer la lightbox
// =============================================================================

const ArrowIcon = ({ direction }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
       style={{ transform: direction === 'right' ? 'rotate(180deg)' : 'none' }}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ProjectMainImage = ({ gallery, selectedImage, setSelectedImage, projectTitle, t }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const total = gallery.length;
  const hasMany = total > 1;

  const goPrev = useCallback(() => {
    setSelectedImage(i => (i - 1 + total) % total);
  }, [total, setSelectedImage]);

  const goNext = useCallback(() => {
    setSelectedImage(i => (i + 1) % total);
  }, [total, setSelectedImage]);

  // Navigation clavier (active en permanence sur la page)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, lightboxOpen]);

  // Empêche le scroll de la page derrière la lightbox
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  return (
    <>
      {/* Cadre principal */}
      <div className={styles.projectMainImage} data-testid="main-project-image">
        <img
          src={gallery[selectedImage]}
          alt={`${projectTitle} — vue ${selectedImage + 1}`}
          onClick={() => setLightboxOpen(true)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x500/FFEA93/4A3728?text=Image+Projet';
          }}
        />

        {hasMany && (
          <>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowLeft}`}
              onClick={goPrev}
              aria-label={t('previousImage') || 'Image précédente'}
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowRight}`}
              onClick={goNext}
              aria-label={t('nextImage') || 'Image suivante'}
            >
              <ArrowIcon direction="right" />
            </button>
            <div className={styles.imageCounter}>
              {selectedImage + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* Lightbox plein écran */}
      {lightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>

          <img
            className={styles.lightboxImage}
            src={gallery[selectedImage]}
            alt={`${projectTitle} — vue ${selectedImage + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          {hasMany && (
            <>
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Image précédente"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Image suivante"
              >
                <ArrowIcon direction="right" />
              </button>
              <div className={styles.lightboxCounter}>
                {selectedImage + 1} / {total}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectMainImage;