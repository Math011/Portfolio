// =============================================================================
// CONFIGURATION - ContactPage
//
// ⚠️ IMPORTANT — sécurité des clés d'API
// -----------------------------------------------------------------------------
// =============================================================================

// EmailJS Configuration
export const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  autoReplyTemplateId: process.env.REACT_APP_EMAILJS_AUTOREPLY_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
};

// reCAPTCHA Configuration
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

// Messages de confirmation selon la langue
export const AUTO_REPLY_MESSAGES = {
  fr: {
    subject: 'Merci pour votre message !',
    greeting: 'Bonjour',
    thanks: "Merci d'avoir pris le temps de me contacter !",
    received: 'J\'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.',
    reminder: 'Pour rappel, voici votre message :',
    closing: 'À très bientôt !'
  },
  en: {
    subject: 'Thank you for your message!',
    greeting: 'Hello',
    thanks: 'Thank you for taking the time to contact me!',
    received: 'I have received your message and will get back to you as soon as possible.',
    reminder: 'As a reminder, here is your message:',
    closing: 'Talk soon!'
  }
};

// Email pour le lien mailto
export const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL;

// URLs des réseaux sociaux
export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/in/mathieu-raudin-4a9b90230',
  github: 'https://github.com/Math011'
};

// =============================================================================
// Rate limiting côté client
// -----------------------------------------------------------------------------
// Sans backend, c'est la seule barrière contre un spam massif depuis le
// =============================================================================
export const RATE_LIMIT = {
  minInterval: 60000,   // 1 minute minimum entre chaque envoi
  maxSubmits: 3,        // Maximum 3 envois
  resetTime: 3600000    // Reset après 1 heure (au lieu de 5 minutes)
};