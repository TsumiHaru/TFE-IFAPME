import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE = 'https://api.aufildessentiers.mehdikorichi.com';

  useEffect(() => {
    fetchUserProfile();
    fetchMyRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
      } else {
        setError(data.error || 'Erreur lors de la récupération du profil');
      }
    } catch (err) {
      console.error('Erreur fetchUserProfile', err);
      setError('Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/event-registrations/my-registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Erreur fetchMyRegistrations', err);
    }
  };

  const getBadgeClass = (role) => {
    return role?.toLowerCase() === 'admin' ? styles.badgeAdmin : styles.badgeUser;
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() === 'active' || status?.toLowerCase() === 'actif'
      ? styles.badgeActive
      : styles.badgeInactive;
  };

  const getRegistrationStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'présent') return styles.statusPresent;
    if (statusLower === 'confirmé') return styles.statusConfirmed;
    if (statusLower === 'en attente') return styles.statusPending;
    if (statusLower === 'annulé') return styles.statusCancelled;
    return styles.statusPresent;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>❌</div>
          <p className={styles.errorText}>{error || 'Utilisateur non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileWrapper}>
        {/* Header */}
        <div className={styles.profileHeader}>
          <h1 className={styles.profileTitle}>Mon Profil</h1>
          <div className={styles.titleUnderline}></div>
        </div>

        {/* Carte Profil */}
        <div className={styles.profileCard}>
          <div className={styles.profileBanner}></div>
          
          <div className={styles.profileContent}>
            {/* Avatar */}
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarOuter}>
                <div className={styles.avatarInner}>
                  <span>👤</span>
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{user.name}</h2>
              <div className={styles.badgesContainer}>
                <span className={`${styles.badge} ${getBadgeClass(user.role)}`}>
                  🛡️ {user.role}
                </span>
                <span className={`${styles.badge} ${getStatusClass(user.status)}`}>
                  {user.status}
                </span>
              </div>
              <button 
            className={styles.changePasswordBtn}
            onClick={() => navigate('/change-password')}
              >
                Modifier mon mot de passe
                </button>
            </div>

            {/* Détails */}
            <div className={styles.profileDetails}>
              <div className={`${styles.detailCard} ${styles.detailCardEmail}`}>
                <span className={styles.detailIcon}>📧</span>
                <div>
                  <p className={`${styles.detailLabel} ${styles.detailLabelEmail}`}>Email</p>
                  <p className={styles.detailValue}>{user.email}</p>
                </div>
              </div>

              <div className={`${styles.detailCard} ${styles.detailCardDate}`}>
                <span className={styles.detailIcon}>📅</span>
                <div>
                  <p className={`${styles.detailLabel} ${styles.detailLabelDate}`}>Membre depuis</p>
                  <p className={styles.detailValue}>
                    {new Date(user.created_at).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Inscriptions */}
        <div className={styles.registrationsCard}>
          <div className={styles.registrationsHeader}>
            <div className={styles.registrationsIcon}>📋</div>
            <h3 className={styles.registrationsTitle}>Mes Inscriptions</h3>
          </div>

          {registrations.length === 0 ? (
            <div className={styles.noRegistrations}>
              <div className={styles.noRegistrationsIcon}>⏰</div>
              <p className={styles.noRegistrationsText}>Aucune inscription pour le moment</p>
              <p className={styles.noRegistrationsSubtext}>Découvrez nos événements et inscrivez-vous !</p>
            </div>
          ) : (
            <div className={styles.registrationsList}>
              {registrations.map((r) => (
                <div key={r.id} className={styles.registrationItem}>
                  <div className={styles.registrationContent}>
                    <div className={styles.registrationInfo}>
                      <h4 className={styles.registrationTitle}>
                        {r.eventTitle || r.event_title}
                      </h4>
                      <div className={styles.registrationDate}>
                        <span>🕐</span>
                        <span>
                          Inscrit le {(r.createdAt || r.created_at) 
                            ? new Date(r.createdAt || r.created_at).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              }) 
                            : 'Date non disponible'}
                        </span>
                      </div>
                    </div>
                    
                    <span className={`${styles.registrationStatus} ${getRegistrationStatusClass(r.status)}`}>
                      {r.status === 'Présent' && '✓ '}
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}