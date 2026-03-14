import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import styles from './ContactPage.module.css';

// =============================================================================
// SVG COMPONENTS
// =============================================================================

// Feu de camp animé
const Campfire = () => (
  <svg width="120" height="100" viewBox="0 0 150 120" className={styles.campfire}>
    {/* Bûches */}
    <ellipse cx="75" cy="110" rx="50" ry="8" fill="#3E2723" />
    <rect x="30" y="97" width="90" height="13" rx="6" fill="#5D4037" transform="rotate(-8 75 102)" />
    <rect x="35" y="100" width="80" height="10" rx="5" fill="#6D4C41" transform="rotate(8 75 104)" />
    
    {/* Pierres autour */}
    <ellipse cx="20" cy="108" rx="12" ry="8" fill="#616161" />
    <ellipse cx="130" cy="108" rx="12" ry="8" fill="#757575" />
    <ellipse cx="40" cy="114" rx="10" ry="6" fill="#9E9E9E" />
    <ellipse cx="110" cy="114" rx="10" ry="6" fill="#757575" />
    
    {/* Flammes */}
    <g className={styles.flames}>
      <path className={styles.flame1} d="M75 95 Q62 60, 75 20 Q88 60, 75 95" fill="#FF6F00" />
      <path className={styles.flame2} d="M62 98 Q52 65, 62 35 Q72 65, 62 98" fill="#FF8F00" />
      <path className={styles.flame3} d="M88 98 Q78 65, 88 35 Q98 65, 88 98" fill="#FF8F00" />
      <path className={styles.flameInner} d="M75 95 Q68 70, 75 45 Q82 70, 75 95" fill="#FFCA28" />
      <path className={styles.flameCore} d="M75 92 Q72 78, 75 62 Q78 78, 75 92" fill="#FFF9C4" />
    </g>
    
    {/* Étincelles */}
    <g className={styles.sparks}>
      <circle className={styles.spark1} cx="70" cy="30" r="2" fill="#FFCA28" />
      <circle className={styles.spark2} cx="80" cy="25" r="1.5" fill="#FF8F00" />
      <circle className={styles.spark3} cx="65" cy="18" r="1.5" fill="#FFCA28" />
      <circle className={styles.spark4} cx="85" cy="12" r="2" fill="#FF6F00" />
    </g>
  </svg>
);

// Panneau en bois (petit, ancré dans le sol)
const WoodenSign = ({ text }) => (
  <svg width="260" height="160" viewBox="0 0 280 180" className={styles.woodenSign}>
    {/* Poteau central - plus long pour s'ancrer */}
    <rect x="125" y="60" width="30" height="120" fill="#5D4037" />
    <rect x="130" y="60" width="8" height="120" fill="#6D4C41" />
    
    {/* Panneau */}
    <rect x="15" y="10" width="250" height="60" rx="5" fill="#8D6E63" />
    <path d="M20 25 Q70 23, 140 25 Q200 27, 260 25" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="2" />
    <path d="M20 40 Q100 38, 180 40 Q230 42, 260 40" stroke="rgba(0,0,0,0.08)" fill="none" strokeWidth="2" />
    <path d="M20 55 Q60 53, 120 55 Q190 57, 260 55" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="2" />
    <rect x="15" y="10" width="250" height="15" rx="5" fill="rgba(255,255,255,0.1)" />
    
    {/* Texte */}
    <text x="140" y="48" textAnchor="middle" fontSize="20" fill="#3E2723" fontFamily="'Caveat', cursive" fontWeight="bold">
      {text}
    </text>
    
    {/* Clous */}
    <circle cx="30" cy="25" r="4" fill="#424242" />
    <circle cx="250" cy="25" r="4" fill="#424242" />
    <circle cx="30" cy="55" r="4" fill="#424242" />
    <circle cx="250" cy="55" r="4" fill="#424242" />
  </svg>
);

// Personne assise
const Person = ({ variant = 1 }) => {
  const colors = variant === 1 
    ? { shirt: '#1976D2', pants: '#5D4037', hair: '#3E2723' }
    : { shirt: '#7B1FA2', pants: '#37474F', hair: '#4E342E' };
  
  return (
    <svg width="40" height="55" viewBox="0 0 50 70" className={styles.person}>
      <ellipse cx="25" cy="55" rx="15" ry="10" fill={colors.pants} />
      <ellipse cx="25" cy="40" rx="12" ry="15" fill={colors.shirt} />
      <circle cx="25" cy="18" r="12" fill="#FFCC80" />
      <ellipse cx="25" cy="12" rx="11" ry="8" fill={colors.hair} />
      <circle cx="21" cy="17" r="1.5" fill="#3E2723" />
      <circle cx="29" cy="17" r="1.5" fill="#3E2723" />
      <path d="M22 23 Q25 26, 28 23" stroke="#3E2723" strokeWidth="1.5" fill="none" />
      <path d="M13 38 Q5 45, 10 55" stroke={colors.shirt} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M37 38 Q45 45, 40 55" stroke={colors.shirt} strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="55" r="4" fill="#FFCC80" />
      <circle cx="40" cy="55" r="4" fill="#FFCC80" />
    </svg>
  );
};

// Bûche
const Log = () => (
  <svg width="70" height="25" viewBox="0 0 100 35" className={styles.log}>
    <ellipse cx="10" cy="18" rx="10" ry="12" fill="#5D4037" />
    <rect x="10" y="6" width="80" height="24" fill="#6D4C41" />
    <ellipse cx="90" cy="18" rx="10" ry="12" fill="#8D6E63" />
    <ellipse cx="90" cy="18" rx="7" ry="9" fill="#A1887F" />
    <circle cx="90" cy="18" r="6" stroke="#8D6E63" strokeWidth="1" fill="none" />
  </svg>
);

// =============================================================================
// CONTACT FORM COMPONENT
// =============================================================================

const ContactForm = ({ t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.contactForm}>
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
      
      <button 
        type="submit" 
        className={styles.submitBtn}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? t('sending') : t('sendButton')}
      </button>
      
      {status === 'success' && (
        <p className={styles.successMessage}>{t('messageSent')}</p>
      )}
      
      {status === 'error' && (
        <p className={styles.errorMessage}>{t('messageError')}</p>
      )}
    </form>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ContactPage = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className={styles.contactPage}>
        
        {/* ============ CIEL ============ */}
        <div className={styles.sky}></div>

        {/* ============ NUAGES (3 lignes, directions alternées) ============ */}
        {/* Ligne 1 - vers la droite */}
        <div className={styles.cloudsRow1}>
          <img src="/images/nuage1.svg" alt="" className={styles.cloudRow1} />
          <img src="/images/nuage3.svg" alt="" className={styles.cloudRow1} />
          <img src="/images/nuage5.svg" alt="" className={styles.cloudRow1} />
        </div>
        
        {/* Ligne 2 - vers la gauche */}
        <div className={styles.cloudsRow2}>
          <img src="/images/nuage2.svg" alt="" className={styles.cloudRow2} />
          <img src="/images/nuage4.svg" alt="" className={styles.cloudRow2} />
          <img src="/images/nuage1.svg" alt="" className={styles.cloudRow2} />
        </div>
        
        {/* Ligne 3 - vers la droite (niveau montagnes) */}
        <div className={styles.cloudsRow3}>
          <img src="/images/nuage3.svg" alt="" className={styles.cloudRow3} />
          <img src="/images/nuage5.svg" alt="" className={styles.cloudRow3} />
          <img src="/images/nuage2.svg" alt="" className={styles.cloudRow3} />
        </div>

        {/* ============ SOL + MONTAGNES (image de fond) ============ */}
        <img 
          src="/images/sol-montagne.svg" 
          alt="" 
          className={styles.groundBackground} 
        />

        {/* ============ ARBRES - 5 Rangées horizontales ============ */}
        
        {/* RANGÉE 1 - Fond (très petits) - 7 arbres par côté */}
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Left1}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Left2}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Left3}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Left4}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Left5}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Left6}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Left7}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Right1}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Right2}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Right3}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Right4}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Right5}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row1Right6}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row1Right7}`} />
        
        {/* RANGÉE 2 - (petits) - 6 arbres par côté */}
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Left1}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Left2}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Left3}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Left4}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Left5}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Left6}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Right1}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Right2}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Right3}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Right4}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row2Right5}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row2Right6}`} />
        
        {/* RANGÉE 3 - (moyens) - 2 arbres par côté */}
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row3Left1}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row3Left2}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row3Right1}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row3Right2}`} />
        
        {/* RANGÉE 4 - (grands) - 1 arbre par côté */}
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row4Left1}`} />
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row4Right1}`} />
        
        {/* RANGÉE 5 - Premier plan (très grands) - 1 arbre par côté */}
        <img src="/images/arbre-orange.svg" alt="" className={`${styles.tree} ${styles.row5Left1}`} />
        <img src="/images/arbre-vert.svg" alt="" className={`${styles.tree} ${styles.row5Right1}`} />

        {/* ============ NAVIGATION ============ */}
        <nav className={styles.contactNav}>
          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>{t('home')}</Link>
            <Link to="/about" className={styles.navLink}>{t('about')}</Link>
            <Link to="/projects" className={styles.navLink}>{t('projects')}</Link>
            <Link to="/contact" className={`${styles.navLink} ${styles.active}`}>{t('contact')}</Link>
          </div>
          <div className={styles.navLanguage}>
            <LanguageSwitcher />
          </div>
        </nav>

        {/* ============ PANNEAU (gauche, petit) ============ */}
        <div className={styles.signSection}>
          <WoodenSign text={t('letsWorkTogether')} />
        </div>

        {/* ============ FORMULAIRE (centré) ============ */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h1>{t('contactPageTitle')}</h1>
            <p className={styles.formIntro}>{t('contactPageIntro')}</p>
            <ContactForm t={t} />
          </div>
        </div>

        {/* ============ FEU DE CAMP (droite) ============ */}
        <div className={styles.fireSection}>
          <div className={styles.fireGroup}>
            <div className={styles.personWrapper}>
              <Person variant={1} />
              <Log />
            </div>
            
            <Campfire />
            
            <div className={styles.personWrapper}>
              <Person variant={2} />
              <Log />
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default ContactPage;