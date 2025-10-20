import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePassword.module.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Validation locale
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont requis');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères');
      setLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError('Le nouveau mot de passe doit être différent du mot de passe actuel');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.aufildessentiers.mehdikorichi.com/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Mot de passe modifié avec succès !');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/profil'), 2000);
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors de la modification. Vérifiez votre connexion.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Modifier votre mot de passe</h1>
        <p className={styles.subtitle}>
          Entrez votre mot de passe actuel et votre nouveau mot de passe.
        </p>

        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            style={{ display: 'none' }} 
            autoComplete="username"
            readOnly
          />

          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <input
              type="password"
              id="currentPassword"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Votre mot de passe actuel"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.divider}></div>

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
              placeholder="Répétez votre nouveau mot de passe"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Modification en cours...' : 'Modifier le mot de passe'}
          </button>

          <button 
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/profil')}
            disabled={loading}
          >
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
}