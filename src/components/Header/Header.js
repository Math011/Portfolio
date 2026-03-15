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
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navLinks}>
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
      <div className={styles.navLanguage}>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;