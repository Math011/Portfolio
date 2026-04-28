import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { 
  ProgressBar, 
  BackgroundVideo, 
  LoadingScreen, 
  LanguageSwitcher,
  HomeMenu, 
  // AboutMenu,
  ProjectsMenu, 
  ContactMenu, 
  FinishMenu,
  ScrollHint
} from './components';
import { ProjectsPage, ProjectDetailPage, ContactPage, NotFoundPage } from './pages';
import { journeySteps } from './data/journeySteps';
import useVideoScroll from './hooks/useVideoScroll';
import './App.css';

// Composant pour la page d'accueil
function HomePage() {
  const videoRef = useRef(null);
  const { progress, navigateToSection } = useVideoScroll(videoRef);
  const [activeSection, setActiveSection] = useState('accueil');
  const [isLoading, setIsLoading] = useState(true);

  // Masque le loading screen une fois la vidéo prête
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
    <>
      <LoadingScreen isLoading={isLoading} />
      <LanguageSwitcher fixed />
      
      <ProgressBar 
        progress={progress}
        activeSection={activeSection}
        onNavigate={navigateToSection}
      />
      
      {/* Éléments de la route */}
      <HomeMenu progress={progress} />
      {/* <AboutMenu progress={progress} /> */}
      <ProjectsMenu progress={progress} />
      <ContactMenu progress={progress} />
      <FinishMenu progress={progress} onRestart={() => navigateToSection(0)} />
      
      {/* Indice "scrollez pour avancer" — apparaît après inactivité */}
      <ScrollHint progress={progress} />
      
      <BackgroundVideo 
        ref={videoRef}
        src="/paysages_tout_9sec.mp4"
      />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            {/* <Route path="/about" element={<AboutPage />} /> */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;