import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../contexts/LanguageContext';

// Composants mock simples pour les tests de routes
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

// App de test avec les mêmes routes que l'app réelle
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

// Helper pour render avec router
const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <TestApp />
    </MemoryRouter>
  );
};

describe('Routes Tests', () => {
  
  describe('Route: / (HomePage)', () => {
    test('renders HomePage components on root path', () => {
      renderWithRouter('/');
      
      expect(screen.getByTestId('home-menu')).toBeInTheDocument();
      expect(screen.getByTestId('about-menu')).toBeInTheDocument();
      expect(screen.getByTestId('projects-menu')).toBeInTheDocument();
      expect(screen.getByTestId('contact-menu')).toBeInTheDocument();
      expect(screen.getByTestId('finish-menu')).toBeInTheDocument();
    });

    test('does not render other pages on root path', () => {
      renderWithRouter('/');
      
      expect(screen.queryByTestId('projects-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('project-detail-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
    });
  });

  describe('Route: /projects (ProjectsPage)', () => {
    test('renders ProjectsPage on /projects path', () => {
      renderWithRouter('/projects');
      
      expect(screen.getByTestId('projects-page')).toBeInTheDocument();
    });

    test('does not render other pages on /projects', () => {
      renderWithRouter('/projects');
      
      expect(screen.queryByTestId('home-menu')).not.toBeInTheDocument();
      expect(screen.queryByTestId('project-detail-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
    });
  });

  describe('Route: /project/:id (ProjectDetailPage)', () => {
    // Test dynamique pour tous les IDs de projets existants
    ['1', '2', '3', '4'].forEach(id => {
      test(`renders ProjectDetailPage on /project/${id} path`, () => {
        renderWithRouter(`/project/${id}`);
        expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
      });
    });

    test('does not render other pages on /project/:id', () => {
      renderWithRouter('/project/1');
      
      expect(screen.queryByTestId('home-menu')).not.toBeInTheDocument();
      expect(screen.queryByTestId('projects-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
    });

    // Test des différents types d'IDs (numériques et strings)
    ['123', 'my-project'].forEach(id => {
      test(`handles project ID: ${id}`, () => {
        renderWithRouter(`/project/${id}`);
        expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
      });
    });
  });

  describe('Route: * (NotFoundPage - 404)', () => {
    ['/unknown-route', '/random/nested/path', '/about', '/contact'].forEach(path => {
      test(`renders 404 page on ${path}`, () => {
        renderWithRouter(path);
        
        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
        expect(screen.getByText(/404/i)).toBeInTheDocument();
      });
    });

    test('does not render other pages on unknown route', () => {
      renderWithRouter('/unknown');
      
      expect(screen.queryByTestId('home-menu')).not.toBeInTheDocument();
      expect(screen.queryByTestId('projects-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('project-detail-page')).not.toBeInTheDocument();
    });
  });

});

describe('Navigation Tests', () => {
  
  // App avec navigation pour tester les liens
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

  const renderNavApp = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <NavigationTestApp />
      </MemoryRouter>
    );
  };

  test('navigates from Home to Projects', async () => {
    const user = userEvent.setup();
    renderNavApp('/');
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    
    await user.click(screen.getByRole('link', { name: /projects/i }));
    
    expect(screen.getByText('Projects Page')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
  });

  test('navigates from Home to Project Detail', async () => {
    const user = userEvent.setup();
    renderNavApp('/');
    
    await user.click(screen.getByRole('link', { name: /project 1/i }));
    
    expect(screen.getByText('Project Detail Page')).toBeInTheDocument();
  });

  test('navigates from Projects to Home', async () => {
    const user = userEvent.setup();
    renderNavApp('/projects');
    
    expect(screen.getByText('Projects Page')).toBeInTheDocument();
    
    await user.click(screen.getByRole('link', { name: /home/i }));
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('navigates from Project Detail to Home', async () => {
    const user = userEvent.setup();
    renderNavApp('/project/1');
    
    expect(screen.getByText('Project Detail Page')).toBeInTheDocument();
    
    await user.click(screen.getByRole('link', { name: /home/i }));
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('navigates from Project Detail to Projects', async () => {
    const user = userEvent.setup();
    renderNavApp('/project/1');
    
    await user.click(screen.getByRole('link', { name: /projects/i }));
    
    expect(screen.getByText('Projects Page')).toBeInTheDocument();
  });

  test('navigates from 404 to Home', async () => {
    const user = userEvent.setup();
    renderNavApp('/unknown-route');
    
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    
    await user.click(screen.getByRole('link', { name: /home/i }));
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

});

describe('Route Edge Cases', () => {
  // Test des query params et hash
  [
    { path: '/projects?filter=react', description: 'query params on /projects' },
    { path: '/project/1?ref=home', description: 'query params on /project/:id' },
    { path: '/project/1#details', description: 'hash on /project/:id' },
  ].forEach(({ path, description }) => {
    test(`handles ${description}`, () => {
      renderWithRouter(path);
      
      if (path.startsWith('/projects')) {
        expect(screen.getByTestId('projects-page')).toBeInTheDocument();
      } else {
        expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
      }
    });
  });

});