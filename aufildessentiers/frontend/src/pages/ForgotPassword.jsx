import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

const COOLDOWN_DURATION = 60; // 60 secondes avant de pouvoir renvoyer un email

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
 

  // Gérer le décompte du cooldown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier le cooldown
    if (cooldown > 0) {
      setError(`Veuillez attendre ${cooldown} secondes avant de renvoyer un email.`);
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('https://api.aufildessentiers.mehdikorichi.com/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email envoyé avec succès ! Vérifiez votre boîte mail.');
        setEmail('');
        
        // Activer le cooldown après envoi réussi
        setCooldown(COOLDOWN_DURATION);
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors de la requête. Vérifiez votre connexion.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Réinitialiser votre mot de passe</h1>
        <p className={styles.subtitle}>
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        {cooldown > 0 && (
          <div className={styles.cooldown}>
            ⏱️ Nouvel envoi possible dans <strong>{cooldown}s</strong>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading || cooldown > 0}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading || cooldown > 0}
          >
            {loading ? 'Envoi en cours...' : cooldown > 0 ? `Attendre ${cooldown}s` : 'Envoyer le lien'}
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/login">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}