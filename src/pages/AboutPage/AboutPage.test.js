import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';
import AboutPage from './AboutPage';

// =============================================================================
// SETUP
// =============================================================================

const renderPage = (language = 'fr') =>
  render(
    <MemoryRouter initialEntries={['/about']}>
      <LanguageProvider defaultLanguage={language}>
        <AboutPage />
      </LanguageProvider>
    </MemoryRouter>
  );

// =============================================================================
// TESTS — orientés utilisateur (pas de classes CSS)
// =============================================================================

describe('AboutPage', () => {

  // ---------------------------------------------------------------------------
  // RENDU PRINCIPAL : ce que l'utilisateur voit en arrivant
  // ---------------------------------------------------------------------------
  describe('rendering', () => {

    test('displays the page title and bio', () => {
      renderPage('fr');
      expect(screen.getByRole('heading', { name: /À propos/i, level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Mathieu Raudin', level: 2 })).toBeInTheDocument();
    });

    test('displays the kicker and subtitle', () => {
      renderPage('fr');
      expect(screen.getByText(/Carnet de route/i)).toBeInTheDocument();
      expect(screen.getByText(/Une carte dépliée/i)).toBeInTheDocument();
    });

  });

  // ---------------------------------------------------------------------------
  // POLAROID : fallback image (logique métier importante)
  // ---------------------------------------------------------------------------
  describe('polaroid', () => {

    test('falls back to initials when photo fails to load', () => {
      const { container } = renderPage();
      const photo = container.querySelector('img[src="/images/face.jpg"]');
      expect(photo).toBeInTheDocument();

      fireEvent.error(photo);

      expect(container.querySelector('img[src="/images/face.jpg"]')).not.toBeInTheDocument();
      expect(screen.getByText('MR')).toBeInTheDocument();
    });

  });

  // ---------------------------------------------------------------------------
  // SKILLS : contenu dynamique généré depuis SKILLS
  // ---------------------------------------------------------------------------
  describe('skills', () => {

    test('displays the section and category labels', () => {
      renderPage('fr');
      expect(screen.getByRole('heading', { name: /Compétences/i })).toBeInTheDocument();
      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Backend')).toBeInTheDocument();
      expect(screen.getByText('Outils')).toBeInTheDocument();
    });

    test('displays expected skill names', () => {
      renderPage('fr');
      // On vérifie la présence de quelques skills caractéristiques de
      // chaque catégorie. L'utilisateur les voit comme du texte.
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('PHP')).toBeInTheDocument();
      expect(screen.getByText('Git')).toBeInTheDocument();
    });

  });

  // ---------------------------------------------------------------------------
  // JOURNEY : formation + expériences (contenu dynamique depuis translations)
  // ---------------------------------------------------------------------------
  describe('journey', () => {

    test('displays education and experience columns', () => {
      renderPage('fr');
      expect(screen.getByRole('heading', { name: /Parcours/i })).toBeInTheDocument();
      const h4s = screen.getAllByRole('heading', { level: 4 });
      expect(h4s.some(h => h.textContent === 'Formation')).toBe(true);
      expect(h4s.some(h => h.textContent === 'Expériences')).toBe(true);
    });

    test('displays at least one timeline entry with a year', () => {
      renderPage('fr');
      expect(screen.getAllByText(/20\d{2}/).length).toBeGreaterThan(0);
    });

  });

  // ---------------------------------------------------------------------------
  // CV : logique métier — href change selon la langue active
  // ---------------------------------------------------------------------------
  describe('CV download', () => {

    test('points to the FR CV in French mode', () => {
      renderPage('fr');
      const cvLink = screen.getByRole('link', { name: /Télécharger mon CV/i });
      expect(cvLink).toHaveAttribute('href', '/cv-mathieu-raudin-fr.pdf');
      expect(cvLink).toHaveAttribute('download');
    });

    test('points to the EN CV in English mode', () => {
      renderPage('en');
      // Le label change avec la langue → on cherche par href
      const cvLink = screen.getAllByRole('link')
        .find(l => l.getAttribute('href') === '/cv-mathieu-raudin-en.pdf');
      expect(cvLink).toBeDefined();
      expect(cvLink).toHaveAttribute('download');
    });

  });

  // ---------------------------------------------------------------------------
  // i18n : le contenu change avec la langue
  // ---------------------------------------------------------------------------
  describe('i18n', () => {

    test('displays French content by default', () => {
      renderPage('fr');
      expect(screen.getByText(/Compétences/i)).toBeInTheDocument();
      expect(screen.getByText(/Carnet de route/i)).toBeInTheDocument();
    });

    test('displays English content in en mode', () => {
      renderPage('en');
      // En anglais, "Compétences" ne doit plus exister
      expect(screen.queryByText(/^Compétences$/)).not.toBeInTheDocument();
    });

  });

  // ---------------------------------------------------------------------------
  // ACCESSIBILITY : structure sémantique vue par les lecteurs d'écran
  // ---------------------------------------------------------------------------
  describe('accessibility', () => {

    test('has a main landmark and a navigation', () => {
      renderPage();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('has exactly one h1', () => {
      renderPage();
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });

  });

});