import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../contexts/LanguageContext';
import ProjectDetailPage from './ProjectDetailPage';
import { projects } from '../../data/projects';
import { GITHUB_PROFILE } from '../../data/constants';

// =============================================================================
// SETUP
// =============================================================================

const firstProject = projects[0];
const lastProject = projects[projects.length - 1];

const renderPage = (projectId = '1', language = 'fr') => {
  return render(
    <MemoryRouter initialEntries={[`/project/${projectId}`]}>
      <LanguageProvider defaultLanguage={language}>
        <Routes>
          <Route path="/project/:id" element={<ProjectDetailPage />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>
  );
};

// =============================================================================
// TESTS
// =============================================================================

describe('ProjectDetailPage', () => {

  // ---------------------------------------------------------------------------
  // RENDERING
  // ---------------------------------------------------------------------------

  describe('rendering', () => {
    beforeEach(() => renderPage('1'));

    test('displays project title', () => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('displays technology tags', () => {
      firstProject.tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    test('displays main image with alt text', () => {
      const container = screen.getByTestId('main-project-image');
      const img = within(container).getByRole('img');
      expect(img).toHaveAttribute('alt');
      expect(img.alt).not.toBe('');
    });

    test('displays navigation links', () => {
      const nav = screen.getByRole('navigation');
      expect(within(nav).getByRole('link', { name: /accueil|home/i })).toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: /projets|projects/i })).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // GALLERY
  // ---------------------------------------------------------------------------

  describe('gallery', () => {
    test('first thumbnail is selected by default', () => {
      renderPage('1');
      
      const thumbnails = screen.getAllByRole('button', { name: /image \d+/i });
      expect(thumbnails[0]).toHaveAttribute('aria-pressed', 'true');
    });

    test('clicking thumbnail changes main image', async () => {
      const user = userEvent.setup();
      renderPage('1');
      
      const thumbnails = screen.getAllByRole('button', { name: /image \d+/i });
      const mainImage = within(screen.getByTestId('main-project-image')).getByRole('img');
      
      // Image initiale
      expect(mainImage.src).toContain(firstProject.gallery[0].replace(/^\//, ''));
      
      // Clic sur thumbnail 2
      await user.click(thumbnails[1]);
      
      // Image change
      expect(mainImage.src).toContain(firstProject.gallery[1].replace(/^\//, ''));
      expect(thumbnails[0]).toHaveAttribute('aria-pressed', 'false');
      expect(thumbnails[1]).toHaveAttribute('aria-pressed', 'true');
    });
  });

  // ---------------------------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------------------------

  describe('navigation', () => {
    test('first project has no previous link', () => {
      renderPage('1');
      expect(screen.queryByRole('link', { name: /précédent|previous/i })).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: /suivant|next/i })).toBeInTheDocument();
    });

    test('last project has no next link', () => {
      renderPage(lastProject.id.toString());
      expect(screen.getByRole('link', { name: /précédent|previous/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /suivant|next/i })).not.toBeInTheDocument();
    });

    test('middle project has both links', () => {
      renderPage('2');
      expect(screen.getByRole('link', { name: /précédent|previous/i })).toHaveAttribute('href', '/project/1');
      expect(screen.getByRole('link', { name: /suivant|next/i })).toHaveAttribute('href', '/project/3');
    });
  });

  // ---------------------------------------------------------------------------
  // EXTERNAL LINKS
  // ---------------------------------------------------------------------------

  describe('external links', () => {
    test.each(projects)('project $id GitHub link points to correct profile', (project) => {
      renderPage(project.id.toString());
      
      const githubLinks = screen.getAllByRole('link', { name: /code|github/i });
      const githubLink = githubLinks[0];
      
      expect(githubLink.getAttribute('href')).toContain(GITHUB_PROFILE);
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  // ---------------------------------------------------------------------------
  // I18N
  // ---------------------------------------------------------------------------

  describe('i18n', () => {
    test('displays French labels by default', () => {
      renderPage('1', 'fr');
      
      expect(screen.getByRole('link', { name: /retour aux projets/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /galerie/i })).toBeInTheDocument();
    });

    test('displays English labels when language is English', () => {
      renderPage('1', 'en');
      
      expect(screen.getByRole('link', { name: /back to projects/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /gallery/i })).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // EDGE CASES
  // ---------------------------------------------------------------------------

  describe('edge cases', () => {
    test('shows error for invalid project ID', () => {
      renderPage('999');
      expect(screen.getByText(/projet non trouvé/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /retour|back/i })).toBeInTheDocument();
    });

    test('shows error for non-numeric ID', () => {
      renderPage('invalid');
      expect(screen.getByText(/projet non trouvé/i)).toBeInTheDocument();
    });

    test.each(projects)('project $id renders without crashing', (project) => {
      renderPage(project.id.toString());
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

});