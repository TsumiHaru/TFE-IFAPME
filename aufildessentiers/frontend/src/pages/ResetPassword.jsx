import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null);

  // Vérifier le token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token manquant');
        setTokenValid(false);
        return;
      }

      try {
      const response = await fetch('https://api.aufildessentiers.mehdikorichi.com/api/auth/verify-reset-token/' + token);
        const data = await response.json();

        if (response.ok) {
          setTokenValid(true);
        } else {
          setError(data.message || 'Token invalide ou expiré');
          setTokenValid(false);
        }
      } catch (err) {
        setError('Erreur lors de la vérification du token');
        setTokenValid(false);
        console.error(err);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.aufildessentiers.mehdikorichi.com/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Mot de passe réinitialisé avec succès ! Redirection en cours...');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors de la réinitialisation. Vérifiez votre connexion.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.loading}>Vérification du lien...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Lien invalide</h1>
          <div className={styles.error}>{error}</div>
          <div className={styles.links}>
            <Link to="/forgot-password">Demander un nouveau lien</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Nouveau mot de passe</h1>
        <p className={styles.subtitle}>
          Entrez votre nouveau mot de passe ci-dessous.
        </p>

        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Au moins 8 caractères"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez votre mot de passe"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Réinitialisation en cours...' : 'Réinitialiser mon mot de passe'}
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/login">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}
