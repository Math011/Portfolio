import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../contexts/LanguageContext';
import ProjectsPage from './ProjectsPage';
import { projects } from '../../data/projects';

// =============================================================================
// SETUP
// =============================================================================

const renderPage = (language = 'fr') => {
  return render(
    <MemoryRouter initialEntries={['/projects']}>
      <LanguageProvider defaultLanguage={language}>
        <ProjectsPage />
      </LanguageProvider>
    </MemoryRouter>
  );
};

// =============================================================================
// TESTS
// =============================================================================

describe('ProjectsPage', () => {

  // ---------------------------------------------------------------------------
  // RENDERING
  // ---------------------------------------------------------------------------

  describe('rendering', () => {
    beforeEach(() => renderPage('fr'));

    test('displays page title', () => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('displays navigation links', () => {
      const nav = screen.getByRole('navigation');
      expect(within(nav).getByRole('link', { name: /accueil/i })).toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: /à propos/i })).toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: /projets/i })).toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });

    test('displays all project cards', () => {
      const projectLinks = screen.getAllByRole('link', { name: /voir le projet|view project/i });
      expect(projectLinks).toHaveLength(projects.length);
    });

    test('displays technology tags for each project', () => {
      projects.forEach(project => {
        project.tags.forEach(tag => {
          expect(screen.getByText(tag)).toBeInTheDocument();
        });
      });
    });

    test('projects link has active state', () => {
      const nav = screen.getByRole('navigation');
      const projectsLink = within(nav).getByRole('link', { name: /projets/i });
      // Utilise match pour CSS Modules
      expect(projectsLink.className).toMatch(/active/);
    });
  });

  // ---------------------------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------------------------

  describe('navigation', () => {
    test('project cards link to correct detail pages', () => {
      renderPage('fr');
      
      const projectLinks = screen.getAllByRole('link', { name: /voir le projet/i });
      
      projects.forEach((project, index) => {
        expect(projectLinks[index]).toHaveAttribute('href', `/project/${project.id}`);
      });
    });

    test('nav links have correct hrefs', () => {
      renderPage('fr');
      
      const nav = screen.getByRole('navigation');
      expect(within(nav).getByRole('link', { name: /accueil/i })).toHaveAttribute('href', '/');
      expect(within(nav).getByRole('link', { name: /à propos/i })).toHaveAttribute('href', '/about');
      expect(within(nav).getByRole('link', { name: /projets/i })).toHaveAttribute('href', '/projects');
      expect(within(nav).getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
    });
  });

  // ---------------------------------------------------------------------------
  // I18N
  // ---------------------------------------------------------------------------

  describe('i18n', () => {
    test('displays French labels by default', () => {
      renderPage('fr');
      
      expect(screen.getByRole('heading', { name: /mes projets/i })).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /voir le projet/i })).toHaveLength(projects.length);
    });

    test('displays English labels when language is English', () => {
      renderPage('en');
      
      expect(screen.getByRole('heading', { name: /my projects/i })).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /view project/i })).toHaveLength(projects.length);
    });

    test('displays English navigation when language is English', () => {
      renderPage('en');
      
      const nav = screen.getByRole('navigation');
      expect(within(nav).getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: /projects/i })).toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });

    test('language switcher changes language', async () => {
      const user = userEvent.setup();
      renderPage('fr');
      
      // Vérifie qu'on est en français
      expect(screen.getByRole('heading', { name: /mes projets/i })).toBeInTheDocument();
      
      // Clique sur le bouton pour changer de langue
      const switcherButton = screen.getByRole('button', { name: /en|english/i });
      await user.click(switcherButton);
      
      // Vérifie qu'on est passé en anglais
      expect(screen.getByRole('heading', { name: /my projects/i })).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // ACCESSIBILITY
  // ---------------------------------------------------------------------------

  describe('accessibility', () => {
    test('page has proper heading hierarchy', () => {
      renderPage('fr');
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBe(projects.length);
    });

    test('navigation has correct role', () => {
      renderPage('fr');
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('decorative images have empty alt text', () => {
      renderPage('fr');
      
      const decorativeImages = screen.getAllByAltText('');
      expect(decorativeImages.length).toBeGreaterThan(0);
    });
  });

});