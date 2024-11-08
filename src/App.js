import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/menu/Header';
import './App.css';

function App() {
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Navigate to="/accueil" />} />
      
      <Route path="#accueil" element={<div>Accueil</div>} />
      <Route path="#propos" element={<div>À propos</div>} />
      <Route path="#projects" element={<div>Projets</div>} />
      <Route path="#contact" element={<div>Contact</div>} />
    </Routes>
  </Router>
  );
}

export default App;
