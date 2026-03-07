import React, { useRef, useEffect, useState } from 'react';
import ProgressBar from './components/ProgressBar';
import BackgroundVideo from './components/BackgroundVideo';
import HomeMenu from './components/RoadElement/HomeMenu';
import AboutMenu from './components/RoadElement/AboutMenu';
import ProjectsMenu from './components/RoadElement/ProjectsMenu';
import ContactMenu from './components/RoadElement/ContactMenu';
import { journeySteps } from './data/journeySteps';
import useVideoScroll from './hooks/useVideoScroll';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const { progress, navigateToSection } = useVideoScroll(videoRef);
  const [activeSection, setActiveSection] = useState('accueil');

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

      <BackgroundVideo 
        ref={videoRef}
        src="/paysages_tout_9sec.mp4"
      />
    </div>
  );
}

export default App;