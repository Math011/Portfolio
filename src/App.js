import React, { useRef, useEffect, useState } from 'react';
import './App.css';

// Défini en dehors du composant car il ne change jamais
const journeySteps = [
  { id: 'accueil', label: 'Accueil', position: 20, icon: '🏠' },
  { id: 'propos', label: 'À propos', position: 40, icon: '👨‍💻' },
  { id: 'projects', label: 'Projets', position: 60, icon: '🚀' },
  { id: 'contact', label: 'Contact', position: 80, icon: '📬' }
];

function App() {
  const videoRef = useRef(null);
  const lastScrollTimeRef = useRef(0);
  const rafRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('accueil');
  const directionRef = useRef(1); // 1 = avance, -1 = recule
  const progressRef = useRef(0); // Track progress pour vérifier les limites

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationId;
    let lastVideoTime = 0;

    // Scroll déclenche la vidéo et détermine la direction
    const handleWheel = (e) => {
      lastScrollTimeRef.current = performance.now();

      // Direction du scroll : bas = avance (1), haut = recule (-1)
      const direction = e.deltaY > 0 ? 1 : -1;
      directionRef.current = direction;

      // Vérifie si la barre peut bouger dans cette direction
      const currentProgress = progressRef.current;
      const canMove = (direction > 0 && currentProgress < 100) || 
                      (direction < 0 && currentProgress > 0);

      // La vidéo ne joue que si la barre peut bouger
      if (canMove) {
        if (video.paused) {
          video.play();
        }
      } else {
        video.pause();
      }

      if (!rafRef.current) {
        checkScrollStop();
      }
    };

    // Arrête la vidéo quand on arrête de scroller
    const checkScrollStop = () => {
      const now = performance.now();

      if (now - lastScrollTimeRef.current > 200) {
        video.pause();
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(checkScrollStop);
    };

    // Met à jour la barre à 60fps selon la direction
    const updateProgress = () => {
      if (video.duration && !video.paused) {
        // Calcule le delta de temps de la vidéo
        const videoTimeDelta = video.currentTime - lastVideoTime;
        
        // Ignore si la vidéo a bouclé (delta négatif trop grand)
        if (Math.abs(videoTimeDelta) < 0.5) {
          // Convertit en pourcentage et applique la direction
          const progressDelta = (videoTimeDelta / video.duration) * 100 * directionRef.current;
          
          setProgress(prev => {
            const newProgress = Math.max(0, Math.min(100, prev + progressDelta));
            progressRef.current = newProgress;
            return newProgress;
          });
        }
      }
      
      lastVideoTime = video.currentTime;
      animationId = requestAnimationFrame(updateProgress);
    };

    // Démarre la boucle d'animation
    animationId = requestAnimationFrame(updateProgress);

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Mise à jour de la section active
  useEffect(() => {
    const currentStep = journeySteps
      .slice()
      .reverse()
      .find(step => progress >= step.position);

    setActiveSection(currentStep?.id || 'accueil');
  }, [progress]);

  return (
    <div className="app-container">
      {/* Barre de progression */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
          
          {/* Étapes du trajet */}
          {journeySteps.map((step) => (
            <div
              key={step.id}
              className="progress-step"
              style={{ left: `${step.position}%` }}
            >
              <div className={`step-icon ${
                progress >= step.position 
                  ? 'step-active' 
                  : 'step-inactive'
              }`}>
                {step.icon}
              </div>
              <div className="step-label">
                <span className={`label-text ${
                  activeSection === step.id 
                    ? 'label-active' 
                    : 'label-inactive'
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
          
          {/* Ligne d'arrivée */}
          <div className="finish-line">
            <div className="finish-icon">
              🏁
            </div>
          </div>
        </div>
      </div>

      <section className="video-section">
        <video
          ref={videoRef}
          className="background-video"
          src="/paysages_tout_9sec.mp4"
          muted
          loop
        />
      </section>
    </div>
  );
}

export default App;