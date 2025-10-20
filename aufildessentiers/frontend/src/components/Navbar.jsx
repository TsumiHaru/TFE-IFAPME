import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const logo = "/images/Logo.jpg";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const prevUserRef = useRef(user);

  useEffect(() => {
    if (prevUserRef.current !== user) {
      prevUserRef.current = user;
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const publicRoutes = ["/", "/events", "/events-old", "/login", "/register", "/contact", "/verify", "/test-api", "/blog", "/forgot-password", "/change-password", "/reset-password"];
 
 if (!user && !publicRoutes.includes(window.location.pathname)) {
  navigate("/login");
}
  }, [user, navigate]);

  // Fermer le menu au clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest(`.${styles.navbar}`)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Empêcher le scroll quand le menu est ouvert
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <div className={styles.logo}>
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Bouton hamburger pour mobile */}
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Accueil</Link></li>
          <li><Link to="/events" onClick={closeMenu}>Événements</Link></li>
          <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          {user && <li><Link to="/profil" onClick={closeMenu}>Profil</Link></li>}
          {user?.role === "admin" && <li><Link to="/admin" onClick={closeMenu}>Admin</Link></li>}
        </ul>
      </div>

      <div className={`${styles.auth} ${isMenuOpen ? styles.authOpen : ''}`}>
        <ThemeToggle />
        {user ? (
          <button onClick={handleLogout}>Déconnexion</button>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Connexion</Link>
            <Link to="/register" onClick={closeMenu}>Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}