import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { 
  ProgressBar, 
  BackgroundVideo, 
  LoadingScreen, 
  LanguageSwitcher,
  HomeMenu, 
  AboutMenu, 
  ProjectsMenu, 
  ContactMenu, 
  FinishMenu,
  ScrollHint
} from './components';
import { ProjectsPage, ProjectDetailPage, ContactPage, AboutPage, NotFoundPage } from './pages';
import { journeySteps } from './data/journeySteps';
import useVideoScroll from './hooks/useVideoScroll';
import { useInitialLoading } from './hooks/useFirstLoad';
import './App.css';

// HomePage : reçoit videoRef en props (la vidéo elle-même est montée au niveau App)
function HomePage({ videoRef }) {
  const { progress, navigateToSection } = useVideoScroll(videoRef);
  const [activeSection, setActiveSection] = useState('accueil');
  const isLoading = useInitialLoading('home');

  // Bloque le scroll natif uniquement sur la HomePage
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  // Mise à jour de la section active
  useEffect(() => {
    if (progress >= 100) {
      setActiveSection(null);
      return;
    }
    const currentStep = journeySteps
      .slice()
      .reverse()
      .find(step => progress >= step.position);
    if (currentStep) {
      setActiveSection(currentStep.id);
    }
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
      
      <HomeMenu progress={progress} />
      <AboutMenu progress={progress} />
      <ProjectsMenu progress={progress} />
      <ContactMenu progress={progress} />
      <FinishMenu progress={progress} onRestart={() => navigateToSection(0)} />
      
      <ScrollHint progress={progress} />
    </>
  );
}

// Composant qui contient la vidéo + les routes. La vidéo n'est affichée que sur "/"
// mais reste montée en permanence pour ne pas perdre sa position.
function AppContent() {
  const videoRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container">
      {/* Vidéo de fond toujours montée, masquée si on n'est pas sur "/" */}
      <div style={{ display: isHome ? 'block' : 'none' }}>
        <BackgroundVideo 
          ref={videoRef}
          src="/paysages_tout_9sec.mp4"
        />
      </div>

      <Routes>
        <Route path="/" element={<HomePage videoRef={videoRef} />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;