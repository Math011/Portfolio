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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationId;

    // Scroll déclenche la vidéo
    const handleWheel = () => {
      lastScrollTimeRef.current = performance.now();

      if (video.paused) {
        video.play();
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

    // Met à jour la barre à 60fps pour une progression fluide
    const updateProgress = () => {
      if (video.duration) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
      }
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