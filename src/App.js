
import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('accueil');

  // Sections du parcours - positions en pourcentage de la durée vidéo
  const journeySteps = [
    { id: 'accueil', label: 'Accueil', position: 20, icon: '🏠' },
    { id: 'propos', label: 'À propos', position: 40, icon: '👨‍💻' },
    { id: 'projects', label: 'Projets', position: 60, icon: '🚀' },
    { id: 'contact', label: 'Contact', position: 80, icon: '📬' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        if (!isPlaying) {
          videoRef.current.play();
          setIsPlaying(true);
        }

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          videoRef.current.pause();
          setIsPlaying(false);
        }, 200);
      }
    };

    // Mise à jour de la progression vidéo
    const handleVideoTimeUpdate = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const progress = (currentTime / duration) * 100;
        setVideoProgress(progress);

        // Déterminer la section active basée sur la progression vidéo
        const currentStep = journeySteps.find(step => 
          progress >= step.position - 10 && progress <= step.position + 10
        );
        setActiveSection(currentStep ? currentStep.id : 'accueil');
      }
    };

    // Écoute à la fois scroll (au cas où) et wheel
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('scroll', handleScroll);

    // Écoute de la progression vidéo
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleVideoTimeUpdate);
    }

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleVideoTimeUpdate);
      }
    };
  }, [isPlaying]);

  return (
    <div className="app-container">
      {/* Barre de progression */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${videoProgress}%` }}
          />
          
          {/* Étapes du trajet */}
          {journeySteps.map((step, index) => (
            <div
              key={step.id}
              className="progress-step"
              style={{ left: `${step.position}%` }}
            >
              <div className={`step-icon ${
                videoProgress >= step.position 
                  ? 'step-active' 
                  : 'step-inactive'
              }`}>
                {step.icon}
              </div>
              <div className="step-label">
                <span className={`label-text ${
                  videoProgress >= step.position 
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
      
      <div className="content">
        {/* Contenu futur ici */}
      </div>
    </div>
  );
}

export default App;