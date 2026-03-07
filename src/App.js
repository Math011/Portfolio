import React, { useRef, useEffect, useState } from 'react';
import ProgressBar from './components/ProgressBar';
import BackgroundVideo from './components/BackgroundVideo';
import HomeMenu from './components/RoadElement/HomeMenu';
import AboutMenu from './components/RoadElement/AboutMenu';
import ProjectsMenu from './components/RoadElement/ProjectsMenu';
import ContactMenu from './components/RoadElement/ContactMenu';
import FinishMenu from './components/RoadElement/FinishMenu';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { journeySteps } from './data/journeySteps';
import useVideoScroll from './hooks/useVideoScroll';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const { progress, navigateToSection } = useVideoScroll(videoRef);
  const [activeSection, setActiveSection] = useState('accueil');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      // Petit délai pour s'assurer que tout est prêt
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Mise à jour de la section active
  useEffect(() => {

    // À 100%, aucune section n'est active (on est à l'arrivée)
    if (progress >= 100) {
      setActiveSection(null);
      return;
    }
    
    const currentStep = journeySteps
      .slice()
      .reverse()
      .find(step => progress >= step.position);

    setActiveSection(currentStep?.id || 'accueil');
  }, [progress]);

  return (
    <div className="app-container">
      <LoadingScreen isLoading={isLoading} />

      <ProgressBar 
        progress={progress}
        activeSection={activeSection}
        onNavigate={navigateToSection}
      />

      {/* Éléments de la route */}
      <HomeMenu progress={progress} />
      <AboutMenu progress={progress} />
      <ProjectsMenu progress={progress} />
      <ContactMenu progress={progress} />
      <FinishMenu progress={progress} onRestart={() => navigateToSection(0)} />

      <BackgroundVideo 
        ref={videoRef}
        src="/paysages_tout_9sec.mp4"
      />
    </div>
  );
}

export default App;