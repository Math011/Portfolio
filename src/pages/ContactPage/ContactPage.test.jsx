import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';

// =============================================================================
// MOCKS
// =============================================================================

vi.mock('@emailjs/browser', () => {
  const sendForm = vi.fn(() => Promise.resolve({ status: 200, text: 'OK' }));
  const send = vi.fn(() => Promise.resolve({ status: 200, text: 'OK' }));
  const init = vi.fn();
  return {
    default: { sendForm, send, init },
    sendForm,
    send,
    init,
  };
});

import ContactPage from './ContactPage';
import ContactForm from './components/ContactForm';
import emailjs from '@emailjs/browser';

// =============================================================================
// HELPERS
// =============================================================================

// Flags React Router v7 : supprime les avertissements dans la console
const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

// Message assez long pour passer la validation (minLength = 10)
const VALID_MESSAGE = 'Bonjour, ceci est un message de test pour le formulaire.';

// Temps simulé avant l'envoi (le timing check exige au moins 3 secondes)
const HUMAN_DELAY_MS = 4000;

const renderContactPage = () => {
  return render(
    <MemoryRouter future={routerFuture}>
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
    <MemoryRouter future={routerFuture}>
      <ContactForm t={mockT} language="fr" />
    </MemoryRouter>
  );
};

// user-event synchronisé avec les faux timers de Vitest
const setupUser = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

const fillForm = async (user, { name, email, message }) => {
  await user.type(screen.getByRole('textbox', { name: /nom/i }), name);
  await user.type(screen.getByRole('textbox', { name: /^email$/i }), email);
  await user.type(screen.getByRole('textbox', { name: /message/i }), message);
};

// Simule un humain qui prend son temps, puis clique sur "Envoyer"
const submitLikeAHuman = async (user) => {
  act(() => {
    vi.advanceTimersByTime(HUMAN_DELAY_MS);
  });
  await user.click(screen.getByRole('button', { name: /envoyer/i }));
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
    vi.clearAllMocks();
    // Faux timers AVANT le rendu : l'heure d'ouverture du formulaire est alors simulée elle aussi
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Le rate limiting peut garder une trace des envois précédents : on repart de zéro
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('submits form successfully when captcha is completed', async () => {
    const user = setupUser();
    renderContactForm();

    await fillForm(user, {
      name: 'John',
      email: 'john@example.com',
      message: VALID_MESSAGE,
    });

    // Simule la validation du captcha
    act(() => {
      window.onRecaptchaChange('mock-token');
    });

    await submitLikeAHuman(user);

    // Le formulaire envoie 2 emails avec emailjs.send() : le message + la réponse automatique
    await waitFor(() => {
      expect(emailjs.send).toHaveBeenCalled();
    });
  });

  test('blocks submission and fakes success when honeypot is filled (bot detected)', async () => {
    const user = setupUser();
    renderContactForm();

    await fillForm(user, {
      name: 'Bot',
      email: 'bot@spam.com',
      message: VALID_MESSAGE,
    });

    // Le bot remplit le champ caché
    const honeypot = screen.getByTestId('honeypot');
    fireEvent.change(honeypot, { target: { value: 'http://spam.com' } });

    await submitLikeAHuman(user);

    await waitFor(() => {
      expect(screen.getByText(/message envoyé/i)).toBeInTheDocument();
    });

    // EmailJS ne doit PAS être appelé
    expect(emailjs.send).not.toHaveBeenCalled();
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  test('requires captcha before submission', async () => {
    const user = setupUser();
    renderContactForm();

    await fillForm(user, {
      name: 'John',
      email: 'john@example.com',
      message: VALID_MESSAGE,
    });

    await submitLikeAHuman(user);

    await waitFor(() => {
      expect(screen.getByText(/captcha/i)).toBeInTheDocument();
    });

    expect(emailjs.send).not.toHaveBeenCalled();
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
    renderContactPage();

    const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
    const githubLink = screen.getByRole('link', { name: 'GitHub' });

    [linkedinLink, githubLink].forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});