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
const MockContactPage = () => <div data-testid="contact-page">ContactPage</div>;
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
      <Route path="/contact" element={<MockContactPage />} />
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
      <Link to="/contact">Contact</Link>
    </nav>
    <Routes>
      <Route path="/" element={<main>Home Page</main>} />
      <Route path="/projects" element={<main>Projects Page</main>} />
      <Route path="/project/:id" element={<main>Project Detail Page</main>} />
      <Route path="/contact" element={<main>Contact Page</main>} />
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

// =============================================================================
// ROUTES TESTS
// =============================================================================

describe('Routes', () => {

  test('/ renders HomePage with all menus', () => {
    renderWithRouter('/');
    
    ['home-menu', 'about-menu', 'projects-menu', 'contact-menu', 'finish-menu'].forEach(testId => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  test('/projects renders ProjectsPage', () => {
    renderWithRouter('/projects');
    expect(screen.getByTestId('projects-page')).toBeInTheDocument();
  });

  test('/project/:id renders ProjectDetailPage', () => {
    renderWithRouter('/project/123');
    expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
  });

  test('/contact renders ContactPage', () => {
    renderWithRouter('/contact');
    expect(screen.getByTestId('contact-page')).toBeInTheDocument();
  });

  test('unknown route renders NotFoundPage', () => {
    renderWithRouter('/unknown-route');
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

});

// =============================================================================
// NAVIGATION TESTS
// =============================================================================

describe('Navigation', () => {

  test('navigates from Home to Projects', async () => {
    const user = userEvent.setup();
    renderNavApp('/');
    
    await user.click(screen.getByRole('link', { name: 'Projects' }));
    expect(screen.getByText('Projects Page')).toBeInTheDocument();
  });

  test('navigates from Home to Project Detail', async () => {
    const user = userEvent.setup();
    renderNavApp('/');
    
    await user.click(screen.getByRole('link', { name: 'Project 1' }));
    expect(screen.getByText('Project Detail Page')).toBeInTheDocument();
  });

  test('navigates from Home to Contact', async () => {
    const user = userEvent.setup();
    renderNavApp('/');
    
    await user.click(screen.getByRole('link', { name: 'Contact' }));
    expect(screen.getByText('Contact Page')).toBeInTheDocument();
  });

  test('navigates from Contact back to Home', async () => {
    const user = userEvent.setup();
    renderNavApp('/contact');
    
    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

});