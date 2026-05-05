import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '../../contexts/LanguageContext';

// Mock <Link> de react-router-dom pour qu'il se rende comme un <a> simple.
// Évite d'avoir besoin d'un MemoryRouter ; les tests deviennent plus rapides
// et plus isolés (on teste les menus, pas le routing).
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

// On importe les composants APRÈS le mock pour que le mock soit pris en compte.
const {
  HomeMenu,
  AboutMenu,
  ProjectsMenu,
  ContactMenu,
  FinishMenu,
} = require('./index');

// =============================================================================
// SETUP
// =============================================================================

const renderMenu = (Component, progress, language = 'fr', extraProps = {}) =>
  render(
    <LanguageProvider defaultLanguage={language}>
      <Component progress={progress} {...extraProps} />
    </LanguageProvider>
  );

// =============================================================================
// TESTS
// =============================================================================

describe('RoadElement menus', () => {

  // ---------------------------------------------------------------------------
  // HOME MENU — plage 2 → 26
  // ---------------------------------------------------------------------------
  describe('HomeMenu', () => {

    test('does not render before its range starts', () => {
      const { container } = renderMenu(HomeMenu, 0);
      expect(container).toBeEmptyDOMElement();
    });

    test('renders the hero with the name in its range', () => {
      renderMenu(HomeMenu, 14);
      expect(screen.getByRole('heading', { name: /mathieu/i })).toBeInTheDocument();
    });

    test('does not render after its range ends', () => {
      const { container } = renderMenu(HomeMenu, 30);
      expect(container).toBeEmptyDOMElement();
    });

  });

  // ---------------------------------------------------------------------------
  // ABOUT MENU — title 23-30, card 30-42
  // ---------------------------------------------------------------------------
  describe('AboutMenu', () => {

    test('does not render before its range starts', () => {
      const { container } = renderMenu(AboutMenu, 10);
      expect(container).toBeEmptyDOMElement();
    });

    test('renders the title in the title range', () => {
      renderMenu(AboutMenu, 26);
      expect(screen.getByRole('heading', { name: /À propos/i })).toBeInTheDocument();
    });

    test('renders the card with a link to /about', () => {
      renderMenu(AboutMenu, 36);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/about');
    });

    test('does not render after its range ends', () => {
      const { container } = renderMenu(AboutMenu, 50);
      expect(container).toBeEmptyDOMElement();
    });

  });

  // ---------------------------------------------------------------------------
  // PROJECTS MENU — title 42-49, card 49-66
  // ---------------------------------------------------------------------------
  describe('ProjectsMenu', () => {

    test('does not render outside its range', () => {
      const { container: before } = renderMenu(ProjectsMenu, 30);
      expect(before).toBeEmptyDOMElement();

      const { container: after } = renderMenu(ProjectsMenu, 70);
      expect(after).toBeEmptyDOMElement();
    });

    test('renders the card with a link to /projects', () => {
      renderMenu(ProjectsMenu, 55);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/projects');
    });

  });

  // ---------------------------------------------------------------------------
  // CONTACT MENU — title 62-69, card 70-82
  // ---------------------------------------------------------------------------
  describe('ContactMenu', () => {

    test('does not render outside its range', () => {
      const { container } = renderMenu(ContactMenu, 50);
      expect(container).toBeEmptyDOMElement();
    });

    test('renders the card with a link to /contact', () => {
      renderMenu(ContactMenu, 75);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/contact');
    });

  });

  // ---------------------------------------------------------------------------
  // FINISH MENU — apparait à partir de progress=88, bouton de restart
  // ---------------------------------------------------------------------------
  describe('FinishMenu', () => {

    test('does not render before progress reaches 88', () => {
      const { container } = renderMenu(FinishMenu, 80, 'fr', { onRestart: () => {} });
      expect(container).toBeEmptyDOMElement();
    });

    test('renders content at the end of the journey', () => {
      const { container } = renderMenu(FinishMenu, 95, 'fr', { onRestart: () => {} });
      expect(container).not.toBeEmptyDOMElement();
    });

    test('calls onRestart when clicking the restart button', () => {
      const onRestart = jest.fn();
      renderMenu(FinishMenu, 95, 'fr', { onRestart });

      const button = screen.getByRole('button');
      // fireEvent.click contourne les vérifications pointer-events (le wrapper
      // peut avoir pointer-events:none pendant ses transitions d'opacité).
      // On teste l'appel du callback, pas la simulation d'un vrai clic souris.
      fireEvent.click(button);

      expect(onRestart).toHaveBeenCalled();
    });

  });

  // ---------------------------------------------------------------------------
  // I18N : les libellés changent avec la langue active
  // ---------------------------------------------------------------------------
  describe('i18n', () => {

    test('AboutMenu title changes with language', () => {
      const { unmount } = renderMenu(AboutMenu, 26, 'fr');
      expect(screen.getByRole('heading', { name: /À propos/i })).toBeInTheDocument();
      unmount();

      renderMenu(AboutMenu, 26, 'en');
      expect(screen.queryByRole('heading', { name: /^À propos$/i })).not.toBeInTheDocument();
    });

  });

});