import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { LinkedInIcon, GitHubIcon, MailIcon } from './SocialIcons';
import { 
  EMAILJS_CONFIG, 
  RECAPTCHA_SITE_KEY, 
  AUTO_REPLY_MESSAGES, 
  CONTACT_EMAIL, 
  SOCIAL_LINKS, 
  RATE_LIMIT 
} from './config';
import styles from './ContactPage.module.css';

// =============================================================================
// CONTACT FORM COMPONENT WITH EMAILJS + SECURITY
// =============================================================================

const ContactForm = ({ t, language }) => {
  const formRef = useRef();
  const recaptchaContainerId = `recaptcha-container-${language}`;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field - should remain empty
  });
  const [status, setStatus] = useState('idle');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Charger le script reCAPTCHA une seule fois
  useEffect(() => {
    // Callbacks globaux
    window.onRecaptchaChange = (token) => {
      setRecaptchaToken(token);
    };

    window.onRecaptchaExpired = () => {
      setRecaptchaToken(null);
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
      delete window.onRecaptchaChange;
      delete window.onRecaptchaExpired;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ===== HONEYPOT CHECK =====
    if (formData.website) {
      console.log('Bot detected via honeypot');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // ===== RECAPTCHA CHECK =====
    if (!recaptchaToken) {
      setStatus('captchaRequired');
      setTimeout(() => setStatus('idle'), 3000);
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
        
        {status === 'tooFast' && (
          <p className={styles.warningMessage}>{t('tooFast')}</p>
        )}
        
        {status === 'rateLimited' && (
          <p className={styles.warningMessage}>{t('rateLimited')}</p>
        )}
        
        {status === 'captchaRequired' && (
          <p className={styles.warningMessage}>{t('captchaRequired')}</p>
        )}
      </form>
      
      {/* Réseaux sociaux */}
      <div className={styles.socialLinks}>
        <span className={styles.socialLabel}>{t('orContactVia')}</span>
        <div className={styles.socialIcons}>
          <a 
            href={SOCIAL_LINKS.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a 
            href={SOCIAL_LINKS.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a 
            href={`mailto:${CONTACT_EMAIL}`}
            className={styles.socialIcon}
            aria-label="Email"
          >
            <MailIcon />
          </a>
        </div>
      </div>
    </>
  );
};

export default ContactForm;