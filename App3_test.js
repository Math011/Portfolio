import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/menu/Header';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollTimeoutRef = useRef(null);

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
    // Écoute à la fois scroll (au cas où) et wheel
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <Router>
      <Header />
      <section className="video-section">
        <video
          ref={videoRef}
          className="background-video"
          // src="/paysages_route_6sec.mp4
          src="/paysages_avec_tout.mp4"
          muted
          loop
        />
      </section>
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/accueil" />} />
          <Route path="#accueil" element={<div>Accueil</div>} />
          <Route path="#propos" element={<div>À propos</div>} />
          <Route path="#projects" element={<div>Projets</div>} />
          <Route path="#contact" element={<div>Contact</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;