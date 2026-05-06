import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { 
  EMAILJS_CONFIG, 
  RECAPTCHA_SITE_KEY, 
  AUTO_REPLY_MESSAGES, 
  RATE_LIMIT 
} from './config';
import styles from './ContactPage.module.css';

// =============================================================================
// CONTACT FORM COMPONENT WITH EMAILJS + SECURITY
// =============================================================================

const ContactForm = ({ t, language }) => {
  const formRef = useRef();
  const recaptchaContainerId = `recaptcha-container-${language}`;
  // Ref synchronisée pour pouvoir lire la valeur courante depuis les listeners
  // globaux sans avoir à les déclarer en dépendance du useEffect.
  const recaptchaContainerIdRef = useRef(recaptchaContainerId);
  useEffect(() => {
    recaptchaContainerIdRef.current = recaptchaContainerId;
  }, [recaptchaContainerId]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: ''
  });
  const [status, setStatus] = useState('idle');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Charger le script reCAPTCHA une seule fois
  useEffect(() => {
    // === Strategy 1 : silencer les erreurs reCAPTCHA dans la console
    const isRecaptchaMsg = (str) => {
      if (typeof str !== 'string') return false;
      return (
        str.includes('reCAPTCHA') ||
        str.includes('Timeout (b)') ||
        str.includes('gstatic.com/recaptcha') ||
        str.includes('google.com/recaptcha')
      );
    };

    const originalConsoleError = console.error;
    console.error = (...args) => {
      const text = args.map(a => {
        if (a == null) return '';
        if (typeof a === 'string') return a;
        if (a instanceof Error) return a.message + ' ' + (a.stack || '');
        try { return JSON.stringify(a); } catch (e) { return String(a); }
      }).join(' ');
      if (isRecaptchaMsg(text)) return;
      originalConsoleError.apply(console, args);
    };

    const handleRecaptchaError = (event) => {
      const msg = event.error?.message || event.message || '';
      const src = event.filename || '';
      const isRecaptchaError =
        msg.includes('Timeout') ||
        msg.includes('reCAPTCHA') ||
        isRecaptchaMsg(src);
      if (isRecaptchaError) {
        try {
          if (window.grecaptcha && window.grecaptcha.reset) {
            window.grecaptcha.reset();
          }
        } catch (e) {}
        setRecaptchaToken(null);
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    };
    const handleUnhandledRejection = (event) => {
      const msg = event.reason?.message || event.reason || '';
      if (typeof msg === 'string' && (msg.includes('Timeout') || msg.includes('reCAPTCHA'))) {
        event.preventDefault();
        event.stopImmediatePropagation && event.stopImmediatePropagation();
      }
    };
    window.addEventListener('error', handleRecaptchaError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    // === Strategy 2 : reset périodique du widget ===
    // Le token reCAPTCHA expire à 120s. On reset le widget toutes les 100s
    const resetInterval = setInterval(() => {
      try {
        if (window.grecaptcha && window.grecaptcha.reset) {
          window.grecaptcha.reset();
          setRecaptchaToken(null);
        }
      } catch (e) {}
    }, 100000);

    // Callbacks globaux
    window.onRecaptchaChange = (token) => {
      setRecaptchaToken(token);
    };

    window.onRecaptchaExpired = () => {
      setRecaptchaToken(null);
      setStatus('captchaExpired');
      setTimeout(() => setStatus('idle'), 8000);
      try {
        if (window.grecaptcha && window.grecaptcha.reset) {
          window.grecaptcha.reset();
        }
        // Scroll vers le widget pour que l'utilisateur le voie immédiatement
        const el = document.getElementById(recaptchaContainerIdRef.current);
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (e) {}
    };

    // Erreur réseau du captcha (timeout, blocage, connexion lente)
    window.onRecaptchaError = () => {
      setRecaptchaToken(null);
      setStatus('captchaError');
      setTimeout(() => setStatus('idle'), 4000);
      try {
        if (window.grecaptcha && window.grecaptcha.reset) {
          window.grecaptcha.reset();
        }
      } catch (e) {}
    };

    window.onRecaptchaLoad = () => {
      setRecaptchaReady(true);
    };

    // Charger le script s'il n'existe pas
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.grecaptcha && window.grecaptcha.render) {
      setRecaptchaReady(true);
    }

    return () => {
      console.error = originalConsoleError;
      clearInterval(resetInterval);
      window.removeEventListener('error', handleRecaptchaError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      delete window.onRecaptchaChange;
      delete window.onRecaptchaExpired;
      delete window.onRecaptchaError;
      delete window.onRecaptchaLoad;
    };
  }, []);

  // Rendre le reCAPTCHA quand prêt ou quand la langue change
  useEffect(() => {
    if (!recaptchaReady || !window.grecaptcha || !window.grecaptcha.render) {
      return;
    }

    const container = document.getElementById(recaptchaContainerId);
    if (!container || container.hasChildNodes()) {
      return;
    }

    try {
      window.grecaptcha.render(container, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: 'onRecaptchaChange',
        'expired-callback': 'onRecaptchaExpired',
        'error-callback': 'onRecaptchaError',
        hl: language
      });
    } catch (e) {
      console.log('reCAPTCHA already rendered');
    }
  }, [recaptchaReady, language, recaptchaContainerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validation côté client : longueurs raisonnables + format email +
  // détection de patterns suspects.
  const validateInput = () => {
    const errors = [];
    const { name, email, message } = formData;

    // Longueurs
    if (!name.trim() || name.trim().length < 2) errors.push('nameInvalid');
    if (name.length > 100) errors.push('nameTooLong');
    if (!email.trim()) errors.push('emailInvalid');
    if (email.length > 254) errors.push('emailTooLong');
    if (!message.trim() || message.trim().length < 10) errors.push('messageInvalid');
    if (message.length > 5000) errors.push('messageTooLong');

    // Format email basique mais robuste (RFC 5322 simplifié)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (email && !emailRegex.test(email)) errors.push('emailFormatInvalid');

    // Détection liens suspects dans le message (spam classique)
    const urlCount = (message.match(/https?:\/\//gi) || []).length;
    if (urlCount > 3) errors.push('tooManyLinks');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== VALIDATION CÔTÉ CLIENT =====
    const validationErrors = validateInput();
    if (validationErrors.length > 0) {
      setStatus('validationError');
      setTimeout(() => setStatus('idle'), 5000);
      return;
    }

    // ===== HONEYPOT CHECK =====
    if (formData.website) {
      console.log('Bot detected via honeypot');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // ===== RECAPTCHA CHECK =====
    // Le token peut être dans le state OU directement récupérable via l'API
    // (cas de race condition entre la validation et le submit).
    let tokenToUse = recaptchaToken;
    if (!tokenToUse && window.grecaptcha && window.grecaptcha.getResponse) {
      try {
        const apiToken = window.grecaptcha.getResponse();
        if (apiToken) tokenToUse = apiToken;
      } catch (e) {}
    }

    if (!tokenToUse) {
      setStatus('captchaRequired');
      setTimeout(() => setStatus('idle'), 6000);
      // Reset le widget pour forcer une nouvelle validation et scroll vers lui
      try {
        if (window.grecaptcha && window.grecaptcha.reset) {
          window.grecaptcha.reset();
        }
        const el = document.getElementById(recaptchaContainerId);
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (e) {}
      return;
    }

    // ===== RATE LIMITING =====
    const now = Date.now();
    
    if (now - lastSubmitTime > RATE_LIMIT.resetTime) {
      setSubmitCount(0);
    }
    
    if (submitCount >= RATE_LIMIT.maxSubmits) {
      setStatus('rateLimited');
      setTimeout(() => setStatus('idle'), 5000);
      return;
    }
    
    if (lastSubmitTime && now - lastSubmitTime < RATE_LIMIT.minInterval) {
      setStatus('tooFast');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('sending');
    
    try {
      // 1. Envoyer le message principal
      await emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        formRef.current,
        EMAILJS_CONFIG.publicKey
      );
      
      // 2. Envoyer l'auto-reply
      const replyMessages = AUTO_REPLY_MESSAGES[language] || AUTO_REPLY_MESSAGES.fr;
      
      const autoReplyContent = `${replyMessages.greeting} ${formData.name},

${replyMessages.thanks}

${replyMessages.received}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${replyMessages.reminder}

"${formData.message}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${replyMessages.closing}`;

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.autoReplyTemplateId,
        {
          email: formData.email,
          name: formData.name,
          subject: replyMessages.subject,
          message: autoReplyContent
        },
        EMAILJS_CONFIG.publicKey
      );
      
      // Update rate limiting
      setLastSubmitTime(now);
      setSubmitCount(prev => prev + 1);
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '', website: '' });
      
      // Reset reCAPTCHA
      setRecaptchaToken(null);
      if (window.grecaptcha) {
        try {
          window.grecaptcha.reset();
        } catch (e) {
          // Ignorer
        }
      }
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Erreur envoi email:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className={styles.contactForm}>
        {/* Honeypot field */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
            data-testid="honeypot"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">{t('nameLabel')}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('namePlaceholder')}
            required
            minLength={2}
            maxLength={100}
            disabled={status === 'sending'}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">{t('emailLabel')}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('emailPlaceholder')}
            required
            maxLength={254}
            disabled={status === 'sending'}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="message">{t('messageLabel')}</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t('messagePlaceholder')}
            rows="4"
            required
            minLength={10}
            maxLength={5000}
            disabled={status === 'sending'}
          />
        </div>

        {/* reCAPTCHA Widget */}
        <div className={styles.recaptchaWrapper}>
          <div id={recaptchaContainerId} key={language}></div>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={status === 'sending' || status === 'rateLimited'}
        >
          {status === 'sending' ? t('sending') : t('sendButton')}
        </button>
        
        {status === 'success' && (
          <p className={styles.successMessage}>{t('messageSent')}</p>
        )}
        
        {status === 'error' && (
          <p className={styles.errorMessage}>{t('messageError')}</p>
        )}

        {status === 'validationError' && (
          <p className={styles.errorMessage}>{t('validationError') || 'Veuillez vérifier vos informations.'}</p>
        )}
        
        {status === 'tooFast' && (
          <p className={styles.warningMessage}>{t('tooFast')}</p>
        )}
        
        {status === 'rateLimited' && (
          <p className={styles.warningMessage}>{t('rateLimited')}</p>
        )}
        
        {status === 'captchaRequired' && (
          <p className={styles.warningMessage}>{t('captchaRequired')}</p>
        )}

        {status === 'captchaExpired' && (
          <p className={styles.warningMessage}>{t('captchaExpired')}</p>
        )}

        {status === 'captchaError' && (
          <p className={styles.warningMessage}>{t('captchaError')}</p>
        )}
      </form>
    </>
  );
};

export default ContactForm;