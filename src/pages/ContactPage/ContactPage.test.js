import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';

// =============================================================================
// MOCKS
// =============================================================================

jest.mock('@emailjs/browser', () => ({
  sendForm: jest.fn(() => Promise.resolve({ status: 200 })),
  send: jest.fn(() => Promise.resolve({ status: 200 })),
}));

beforeAll(() => {
  window.grecaptcha = {
    render: jest.fn(() => 1),
    reset: jest.fn(),
  };
});

import ContactPage from './ContactPage';
import ContactForm from './ContactForm';
import emailjs from '@emailjs/browser';

// =============================================================================
// HELPERS
// =============================================================================

const renderContactPage = () => {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <ContactPage />
      </LanguageProvider>
    </MemoryRouter>
  );
};

const mockT = (key) => {
  const translations = {
    nameLabel: 'Nom',
    namePlaceholder: 'Votre nom',
    emailLabel: 'Email',
    emailPlaceholder: 'votre@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Votre message...',
    sendButton: 'Envoyer',
    sending: 'Envoi en cours...',
    messageSent: 'Message envoyé !',
    messageError: 'Erreur lors de l\'envoi',
    captchaRequired: 'Veuillez cocher le captcha',
    orContactVia: 'Ou contactez-moi via',
  };
  return translations[key] || key;
};

const renderContactForm = () => {
  return render(
    <MemoryRouter>
      <ContactForm t={mockT} language="fr" />
    </MemoryRouter>
  );
};

// Utiliser les IDs pour être plus précis
const fillForm = async (user, { name, email, message }) => {
  await user.type(screen.getByRole('textbox', { name: /nom/i }), name);
  await user.type(screen.getByRole('textbox', { name: /^email$/i }), email);
  await user.type(screen.getByRole('textbox', { name: /message/i }), message);
};

// =============================================================================
// TESTS
// =============================================================================

describe('ContactPage', () => {
  test('renders navigation with all links', () => {
    renderContactPage();
    
    expect(screen.getByRole('link', { name: /accueil/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /à propos/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /projets/i })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
  });

  test('renders form with required fields', () => {
    renderContactPage();
    
    expect(screen.getByRole('textbox', { name: /nom/i })).toBeRequired();
    expect(screen.getByRole('textbox', { name: /^email$/i })).toBeRequired();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeRequired();
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
  });

  test('renders social media links', () => {
    renderContactPage();
    
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', expect.stringContaining('github.com'));
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });
});

describe('ContactForm - Security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('submits form successfully when captcha is completed', async () => {
    const user = userEvent.setup();
    renderContactForm();
    
    await fillForm(user, {
      name: 'John',
      email: 'john@example.com',
      message: 'Hello'
    });
    
    // Simulate captcha success
    act(() => {
      window.onRecaptchaChange('mock-token');
    });
    
    await user.click(screen.getByRole('button', { name: /envoyer/i }));
    
    await waitFor(() => {
      expect(emailjs.sendForm).toHaveBeenCalled();
    });
  });

  test('blocks submission and fakes success when honeypot is filled (bot detected)', async () => {
    const user = userEvent.setup();
    renderContactForm();
    
    await fillForm(user, {
      name: 'Bot',
      email: 'bot@spam.com',
      message: 'Spam'
    });
    
    // Bot fills honeypot - using testid for hidden field
    const honeypot = screen.getByTestId('honeypot');
    fireEvent.change(honeypot, { target: { value: 'http://spam.com' } });
    
    await user.click(screen.getByRole('button', { name: /envoyer/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/message envoyé/i)).toBeInTheDocument();
    });
    
    // EmailJS should NOT be called
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  test('requires captcha before submission', async () => {
    const user = userEvent.setup();
    renderContactForm();
    
    await fillForm(user, {
      name: 'John',
      email: 'john@example.com',
      message: 'Hello'
    });
    
    await user.click(screen.getByRole('button', { name: /envoyer/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/captcha/i)).toBeInTheDocument();
    });
    
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });
});

describe('ContactForm - Accessibility', () => {
  test('honeypot is hidden from screen readers', () => {
    renderContactForm();
    
    const honeypot = screen.getByTestId('honeypot');
    expect(honeypot.closest('div')).toHaveAttribute('aria-hidden', 'true');
  });

  test('social links open in new tab with security attributes', () => {
    renderContactForm();
    
    const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    
    [linkedinLink, githubLink].forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});