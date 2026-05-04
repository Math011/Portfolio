import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import styles from './Header.module.css';

const Header = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'home' },
    { to: '/about', label: 'about' },
    { to: '/projects', label: 'projects' },
    { to: '/contact', label: 'contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Sur fond sombre (page Contact nuit), on inverse les couleurs du brand/liens
  const isDarkBg = location.pathname === '/contact';

  return (
    <header className={`${styles.header} ${isDarkBg ? styles.darkBg : ''}`}>
      <div className={styles.inner}>
        <nav className={styles.bar}>
          <span className={styles.brand}>
            <span className={styles.brandName}>Mathieu Raudin</span>
            <span className={styles.brandSep} />
          </span>

          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.navLink} ${isActive(to) ? styles.active : ''}`}
            >
              {t(label)}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;