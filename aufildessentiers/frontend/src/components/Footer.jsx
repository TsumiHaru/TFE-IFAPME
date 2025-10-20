import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>À propos</h3>
          <p>Au Fil Des Sentiers est une plateforme dédiée aux événements en lien avec la nature, le bien-être et l'esprit communautaire en Belgique.</p>
        </div>
        
        <div className={styles.footerSection}>
          <h3>Liens rapides</h3>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/events">Événements</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h3>Contact</h3>
          <p>Email: contact@aufildessentiers.be</p>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>@2025 Au Fil Des Sentiers. Tous droits réservés.</p>
      </div>
    </footer>
  );
} 