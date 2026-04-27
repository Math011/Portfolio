import React from 'react';
import {
  HomeIcon,
  TentIcon,
  RocketIcon,
  MailboxIcon,
} from '../components/ProgressBar/icons';

// Données des étapes du parcours.
// Chaque step possède une icône SVG (composant React) au lieu d'un emoji,
// pour s'aligner sur le style éditorial chic du nouveau design.
export const journeySteps = [
  { id: 'accueil',  label: 'Accueil',  position: 20, icon: <HomeIcon /> },
  { id: 'propos',   label: 'À propos', position: 40, icon: <TentIcon /> },
  { id: 'projects', label: 'Projets',  position: 60, icon: <RocketIcon /> },
  { id: 'contact',  label: 'Contact',  position: 80, icon: <MailboxIcon /> },
];