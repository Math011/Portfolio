import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
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
import { journeySteps } from './data/journeySteps';
import useVideoScroll from './hooks/useVideoScroll';
import useTouchScroll from './hooks/UseTouchScroll';
import { useInitialLoading } from './hooks/useFirstLoad';
import './App.css';

const ProjectsPage = lazy(() => import('./pages/ProjectsPage/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage/ProjectDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));

// =============================================================================
// HomePage
// -----------------------------------------------------------------------------
// Scroll-jacking : useVideoScroll écoute la molette desktop, useTouchScroll
// convertit les gestes tactiles en événements wheel synthétiques pour mobile.
// =============================================================================
function HomePage({ videoRef }) {
  const { progress, navigateToSection } = useVideoScroll(videoRef);

  useTouchScroll({ enabled: true, sensitivity: 3.5 });

  const [activeSection, setActiveSection] = useState('accueil');
  const isLoading = useInitialLoading('home');

  // Bloque le scroll natif sur la HomePage
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

function AppContent() {
  const videoRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container">
      <div style={{ display: isHome ? 'block' : 'none' }}>
        <BackgroundVideo
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/videos/paysages_tout.mp4`}
        />
      </div>

      <Suspense fallback={<div style={{
        position: 'fixed',
        inset: 0,
        background: '#F0D890',
        zIndex: 9999
      }} />}>
        <Routes>
          <Route path="/" element={<HomePage videoRef={videoRef} />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router
        basename={process.env.NODE_ENV === 'production' ? '/Portfolio' : '/'}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;