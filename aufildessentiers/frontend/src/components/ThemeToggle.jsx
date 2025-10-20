// ThemeToggle.jsx - Version améliorée avec animation fluide
import React, { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Charger le thème sauvegardé ou celui du système
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
    setMounted(true);
  }, []);

  const applyTheme = (dark) => {
    const root = document.documentElement;
    if (dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Empêche un petit "flicker" avant que le thème soit monté
  if (!mounted) return null;

  return (
    <button
      className={`${styles.themeToggle} ${isDark ? styles.dark : styles.light}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
    >
      <div className={styles.toggleTrack}>
        <div className={styles.toggleThumb}>
          <span
            className={styles.icon}
            style={{
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: 1,
              transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {isDark ? '🌙' : '☀️'}
          </span>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
