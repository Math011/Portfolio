import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import AboutPage from './AboutPage';
import { LanguageProvider } from '../../contexts/LanguageContext';
// ⚠️ Le fichier de données est data/about.js (pas skills.js)
import { SKILLS, TOTAL_SKILLS } from '../../data/about';

const renderPage = (language = 'fr') =>
  render(
    <MemoryRouter
      initialEntries={['/about']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LanguageProvider defaultLanguage={language}>
        <AboutPage />
      </LanguageProvider>
    </MemoryRouter>
  );

describe('AboutPage', () => {
  describe('rendering', () => {
    test('renders the page title (FR)', () => {
      renderPage('fr');
      expect(screen.getByRole('heading', { name: 'À propos', level: 1 })).toBeInTheDocument();
    });

    test('renders the bio name', () => {
      renderPage('fr');
      expect(screen.getByRole('heading', { name: 'Mathieu Raudin', level: 2 })).toBeInTheDocument();
    });
  });

  describe('skills', () => {
    test('displays the skills section title', () => {
      renderPage('fr');
      expect(screen.getByRole('heading', { name: 'Compétences', level: 3 })).toBeInTheDocument();
    });

    test('displays the expected number of skill chips', () => {
      const { container } = renderPage('fr');
      const skillChips = container.querySelectorAll('[class*="skillChip"]');
      expect(skillChips.length).toBe(TOTAL_SKILLS);
    });

    test('displays expected skill names from each category', () => {
      const { container } = renderPage('fr');
      const skillChips = container.querySelectorAll('[class*="skillChip"]');
      const skillTexts = Array.from(skillChips).map(chip => chip.textContent.trim());

      expect(skillTexts).toEqual(expect.arrayContaining(['React']));
      expect(skillTexts).toEqual(expect.arrayContaining(['JavaScript']));
      expect(skillTexts).toEqual(expect.arrayContaining(['TypeScript']));
      expect(skillTexts).toEqual(expect.arrayContaining(['PHP']));
      expect(skillTexts).toEqual(expect.arrayContaining(['Symfony']));
      expect(skillTexts).toEqual(expect.arrayContaining(['PostgreSQL']));
      expect(skillTexts).toEqual(expect.arrayContaining(['Docker']));
    });

    test('PHPUnit is displayed even without icon', () => {
      const { container } = renderPage('fr');
      const skillChips = container.querySelectorAll('[class*="skillChip"]');
      const phpunitChip = Array.from(skillChips).find(c => c.textContent.includes('PHPUnit'));

      expect(phpunitChip).toBeDefined();
      expect(phpunitChip.querySelector('img')).toBeNull();
    });
  });

  describe('CV download', () => {
    test('points to the FR CV in French mode', () => {
      renderPage('fr');
      const cvLink = screen.getByRole('link', { name: /Voir mon CV/i });
      expect(cvLink).toHaveAttribute('href', '/cv/cv-mathieu-raudin-fr.pdf');
      expect(cvLink).toHaveAttribute('target', '_blank');
      expect(cvLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    // Si LanguageProvider n'accepte pas defaultLanguage, ce test échoue.
    // Voir le commentaire en bas du fichier pour les solutions.
    test('points to the EN CV in English mode', () => {
      renderPage('en');
      const cvLink = screen.getByRole('link', { name: /View my CV/i });
      expect(cvLink).toHaveAttribute('href', '/cv/cv-mathieu-raudin-en.pdf');
      expect(cvLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('journey', () => {
    test('renders the journey section', () => {
      renderPage('fr');
      expect(screen.getByRole('heading', { name: 'Parcours', level: 3 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Formation', level: 4 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Expériences', level: 4 })).toBeInTheDocument();
    });

    test('displays at least one education and one experience item', () => {
      const { container } = renderPage('fr');
      const timelineItems = container.querySelectorAll('[class*="timelineItem"]');
      expect(timelineItems.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('stats', () => {
    test('displays the dynamic skills count', () => {
      const { container } = renderPage('fr');
      const statValues = container.querySelectorAll('[class*="statValue"]');
      const values = Array.from(statValues).map(s => s.textContent.trim());

      expect(values).toContain(String(TOTAL_SKILLS));
    });
  });
});

// =============================================================================
// NOTE : si le test "EN mode" échoue avec href FR, c'est que LanguageProvider
// n'accepte pas la prop `defaultLanguage`. Solution recommandée : modifier
// LanguageContext.js pour accepter cette prop. Exemple :
//
//   export const LanguageProvider = ({ children, defaultLanguage }) => {
//     const [language, setLanguage] = useState(
//       defaultLanguage || localStorage.getItem('language') || 'fr'
//     );
//     ...
//   };
//
// Sans modifier le LanguageProvider, vous pouvez alternativement skip le test
// EN en attendant : remplacez `test(...)` par `test.skip(...)`.
// =============================================================================