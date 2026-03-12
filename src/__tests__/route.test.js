import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../contexts/LanguageContext';

// =============================================================================
// MOCK COMPONENTS
// =============================================================================

const MockHomePage = () => (
  <>
    <div data-testid="home-menu">HomeMenu</div>
    <div data-testid="about-menu">AboutMenu</div>
    <div data-testid="projects-menu">ProjectsMenu</div>
    <div data-testid="contact-menu">ContactMenu</div>
    <div data-testid="finish-menu">FinishMenu</div>
  </>
);

const MockProjectsPage = () => <div data-testid="projects-page">ProjectsPage</div>;
const MockProjectDetailPage = () => <div data-testid="project-detail-page">ProjectDetailPage</div>;
const MockNotFoundPage = () => <div data-testid="not-found-page">404 - Page not found</div>;

// =============================================================================
// TEST APPS
// =============================================================================

const TestApp = () => (
  <LanguageProvider>
    <Routes>
      <Route path="/" element={<MockHomePage />} />
      <Route path="/projects" element={<MockProjectsPage />} />
      <Route path="/project/:id" element={<MockProjectDetailPage />} />
      <Route path="*" element={<MockNotFoundPage />} />
    </Routes>
  </LanguageProvider>
);

const NavigationTestApp = () => (
  <LanguageProvider>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/project/1">Project 1</Link>
    </nav>
    <Routes>
      <Route path="/" element={<main>Home Page</main>} />
      <Route path="/projects" element={<main>Projects Page</main>} />
      <Route path="/project/:id" element={<main>Project Detail Page</main>} />
      <Route path="*" element={<main>404 - Page not found</main>} />
    </Routes>
  </LanguageProvider>
);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <TestApp />
    </MemoryRouter>
  );
};

const renderNavApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <NavigationTestApp />
    </MemoryRouter>
  );
};

const expectRoute = (path, testId) => {
  renderWithRouter(path);
  expect(screen.getByTestId(testId)).toBeInTheDocument();
};

const expectRouteNotFound = (path, excludedTestIds) => {
  renderWithRouter(path);
  excludedTestIds.forEach(testId => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });
};

const navigateAndExpect = async (startRoute, linkName, expectedText) => {
  const user = userEvent.setup();
  renderNavApp(startRoute);
  await user.click(screen.getByRole('link', { name: linkName }));
  expect(screen.getByText(expectedText)).toBeInTheDocument();
};

// =============================================================================
// ROUTES TESTS
// =============================================================================

describe('Routes Tests', () => {

  describe('Route: / (HomePage)', () => {
    test('renders all HomePage components', () => {
      renderWithRouter('/');
      
      ['home-menu', 'about-menu', 'projects-menu', 'contact-menu', 'finish-menu'].forEach(testId => {
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });
    });

    test('does not render other pages', () => {
      expectRouteNotFound('/', ['projects-page', 'project-detail-page', 'not-found-page']);
    });
  });

  describe.each([
    ['/projects', 'projects-page'],
    ['/projects?filter=react', 'projects-page'],
  ])('Route: %s', (path, testId) => {
    test('renders correct component', () => {
      expectRoute(path, testId);
    });
  });

  describe.each([
    ['/project/1', 'project-detail-page'],
    ['/project/2', 'project-detail-page'],
    ['/project/3', 'project-detail-page'],
    ['/project/4', 'project-detail-page'],
    ['/project/123', 'project-detail-page'],
    ['/project/my-project', 'project-detail-page'],
    ['/project/1?ref=home', 'project-detail-page'],
    ['/project/1#details', 'project-detail-page'],
  ])('Route: %s', (path, testId) => {
    test('renders ProjectDetailPage', () => {
      expectRoute(path, testId);
    });
  });

  describe.each([
    '/unknown-route',
    '/random/nested/path',
    '/about',
    '/contact',
  ])('Route: %s (404)', (path) => {
    test('renders NotFoundPage', () => {
      expectRoute(path, 'not-found-page');
      expect(screen.getByText(/404/i)).toBeInTheDocument();
    });
  });

});

// =============================================================================
// NAVIGATION TESTS
// =============================================================================

describe('Navigation Tests', () => {

  describe.each([
    ['/', /projects/i, 'Projects Page'],
    ['/', /project 1/i, 'Project Detail Page'],
    ['/projects', /home/i, 'Home Page'],
    ['/project/1', /home/i, 'Home Page'],
    ['/project/1', /projects/i, 'Projects Page'],
    ['/unknown', /home/i, 'Home Page'],
  ])('From %s clicking "%s"', (startRoute, linkName, expectedText) => {
    test(`navigates to ${expectedText}`, async () => {
      await navigateAndExpect(startRoute, linkName, expectedText);
    });
  });

});