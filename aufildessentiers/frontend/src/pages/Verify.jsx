// Verify.jsx - Page de vérification d'email
import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './Verify.module.css';
import useToasts from '../components/useToasts';
import ToastContainer from '../components/ToastContainer';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { toasts, push, remove } = useToasts();

  const token = searchParams.get('token');

  const verifyEmail = React.useCallback(async (verificationToken) => {
    try {
  const response = await fetch(API_ENDPOINTS.VERIFY_EMAIL_API || API_ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (err) {
      setStatus('error');
      const errMsg = err && err.message ? `: ${err.message}` : '';
      setMessage(`Erreur de connexion au serveur${errMsg}`);
      push(`Erreur de connexion au serveur${errMsg}`, 'error');
    }
  }, [navigate, push]);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Token de vérification manquant');
    }
  }, [token, verifyEmail]);



  const resendVerification = async () => {
    setIsResending(true);
    try {
      const email = prompt('Entrez votre email pour renvoyer le lien de vérification :');
      if (!email) return;

  const response = await fetch(API_ENDPOINTS.RESEND_VERIFICATION || (API_ENDPOINTS.BASE_URL + '/api/auth/resend-verification'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        push('Email de vérification renvoyé ! Vérifiez votre boîte mail.', 'success');
      } else {
        push(data.error || 'Erreur lors du renvoi', 'error');
      }
    } catch (error) {
      const errMsg = error && error.message ? `: ${error.message}` : '';
      push(`Erreur lors du renvoi de l'email${errMsg}`, 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer toasts={toasts} onClose={remove} />
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Vérification de votre compte</h1>
        </div>

        {status === 'loading' && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Vérification en cours...</p>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.success}>
            <div className={styles.successIcon}>✅</div>
            <h2>Compte vérifié avec succès !</h2>
            <p>{message}</p>
            <p>Vous allez être redirigé vers la page de connexion...</p>
            <button 
              className={styles.button}
              onClick={() => navigate('/login')}
            >
              Se connecter maintenant
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>❌</div>
            <h2>Erreur de vérification</h2>
            <p>{message}</p>
            <div className={styles.actions}>
              <button 
                className={styles.button}
                onClick={resendVerification}
                disabled={isResending}
              >
                {isResending ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'}
              </button>
              <button 
                className={styles.buttonSecondary}
                onClick={() => navigate('/register')}
              >
                Créer un nouveau compte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;