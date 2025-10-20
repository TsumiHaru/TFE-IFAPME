// AdminDashboard.jsx - Panel d'administration
import React, { useState, useEffect } from 'react';
import useToasts from '../components/useToasts';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import PageLayout from '../components/PageLayout';
import styles from './AdminDashboard.module.css';
import AdminContacts from './AdminContacts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { push } = useToasts();

  const loadStats = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_STATS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Erreur lors du chargement des statistiques');
      }
    } catch (error) {
      const msg = error && error.message ? `: ${error.message}` : '';
      console.error('Erreur loadStats', error);
      push && push(`Erreur de connexion au serveur${msg}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadStats();
    } else {
      setError('Accès non autorisé');
      setLoading(false);
    }
  }, [user, loadStats]);
  

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
        push && push(`Erreur chargement utilisateurs: ${error.message || ''}`, 'error');
    }
  };

  const loadPendingRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_PENDING_REGISTRATIONS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
  const data = await response.json();
        setPendingRegistrations(data.registrations || []);
      } else {
        console.error('Erreur API inscriptions:', response.status, response.statusText);
      }
  } catch (error) {
    console.error('Erreur chargement inscriptions:', error);
    push && push(`Erreur chargement inscriptions: ${error.message || ''}`, 'error');
  }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_UPDATE_USER_STATUS(userId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadUsers();
        loadStats();
        push && push('Statut mis à jour', 'success');
      } else {
        push && push('Erreur lors de la mise à jour du statut', 'error');
      }
    } catch (error) {
        const msg = error && error.message ? `: ${error.message}` : '';
        console.error('Erreur deleteUser', error);
        push && push(`Erreur de connexion au serveur${msg}`, 'error');
    }
  };

  const deleteUser = async (userId) => {
    // Confirm deletion using the browser confirm for now (can be upgraded to a modal)
    const ok = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (!ok) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_DELETE_USER(userId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadUsers();
        loadStats();
        push && push('Utilisateur supprimé', 'success');
      } else {
        push && push('Erreur lors de la suppression de l\'utilisateur', 'error');
      }
    } catch (error) {
      const msg = error && error.message ? `: ${error.message}` : '';
      console.error('Erreur deleteUser', error);
      push && push(`Erreur de connexion au serveur${msg}`, 'error');
    }
  };

  const updateRegistrationStatus = async (registrationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_UPDATE_REGISTRATION_STATUS(registrationId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadPendingRegistrations();
        loadStats();
        push && push('Statut d\'inscription mis à jour', 'success');
      } else {
        push && push('Erreur lors de la mise à jour du statut', 'error');
      }
    } catch (error) {
      const msg = error && error.message ? `: ${error.message}` : '';
      console.error('Erreur updateRegistrationStatus', error);
      push && push(`Erreur de connexion au serveur${msg}`, 'error');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users' && users.length === 0) {
      loadUsers();
    } else if (tab === 'registrations' && pendingRegistrations.length === 0) {
      loadPendingRegistrations();
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <PageLayout>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Accès non autorisé</h2>
            <p>Vous devez être administrateur pour accéder à cette page.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Chargement du panel d'administration...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Panel d'Administration</h1>
          <p>Gérez les utilisateurs, événements et inscriptions</p>
          <div className={styles.titleUnderline}></div>
        </div>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
            onClick={() => handleTabChange('stats')}
          >
            Statistiques
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => handleTabChange('users')}
          >
            Utilisateurs
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'registrations' ? styles.active : ''}`}
            onClick={() => handleTabChange('registrations')}
          >
            Inscriptions
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'contacts' ? styles.active : ''}`}
            onClick={() => handleTabChange('contacts')}
          >
            Messages
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'stats' && stats && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Utilisateurs</h3>
                <div className={styles.statNumber}>{stats.users.total_users}</div>
                <div className={styles.statDetails}>
                  <span className={styles.active}>Actifs: {stats.users.active_users}</span>
                  <span className={styles.pending}>En attente: {stats.users.pending_users}</span>
                  <span className={styles.banned}>Bannis: {stats.users.banned_users}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <h3>Événements</h3>
                <div className={styles.statNumber}>{stats.events.total_events}</div>
                <div className={styles.statDetails}>
                  <span className={styles.open}>Ouverts: {stats.events.open_events}</span>
                  <span className={styles.closed}>Fermés: {stats.events.closed_events}</span>
                  <span className={styles.full}>Complets: {stats.events.full_events}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <h3>Inscriptions</h3>
                <div className={styles.statNumber}>{stats.registrations.total_registrations}</div>
                <div className={styles.statDetails}>
                  <span className={styles.approved}>Approuvées: {stats.registrations.approved_registrations}</span>
                  <span className={styles.pending}>En attente: {stats.registrations.pending_registrations}</span>
                  <span className={styles.rejected}>Rejetées: {stats.registrations.rejected_registrations}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className={styles.usersTable}>
              <h3>Gestion des Utilisateurs</h3>
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Date d'inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`${styles.status} ${styles[user.status]}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className={styles.actions}>
                          {user.status !== 'active' && (
                            <button 
                              className={styles.approveBtn}
                              onClick={() => updateUserStatus(user.id, 'active')}
                            >
                              Activer
                            </button>
                          )}
                          {user.status !== 'banned' && (
                            <button 
                              className={styles.banBtn}
                              onClick={() => updateUserStatus(user.id, 'banned')}
                            >
                              Bannir
                            </button>
                          )}
                          <button 
                            className={styles.deleteBtn}
                            onClick={() => deleteUser(user.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className={styles.registrationsTable}>
              <h3>Inscriptions en Attente</h3>
              {pendingRegistrations.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Aucune inscription en attente pour le moment.</p>
                  <p><small>Les nouvelles inscriptions apparaîtront ici.</small></p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Événement</th>
                      <th>Date</th>
                      <th>Lieu</th>
                      <th>Date d'inscription</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRegistrations.map(registration => (
                      <tr key={registration.id}>
                        <td>
                          <div>
                            <div>{registration.user_name}</div>
                            <div className={styles.email}>{registration.user_email}</div>
                          </div>
                        </td>
                        <td>{registration.event_title}</td>
                        <td>{new Date(registration.event_date).toLocaleDateString('fr-FR')}</td>
                        <td>{registration.event_location}</td>
                        <td>{new Date(registration.created_at).toLocaleDateString('fr-FR')}</td>
                        <td>
                          <div className={styles.actions}>
                            <button 
                              className={styles.approveBtn}
                              onClick={() => updateRegistrationStatus(registration.id, 'Présent')}
                            >
                              Marquer présent
                            </button>
                            <button 
                              className={styles.rejectBtn}
                              onClick={() => updateRegistrationStatus(registration.id, 'Annulé')}
                            >
                              Annuler
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {activeTab === 'contacts' && (
            <div className={styles.contactsTab}>
              <AdminContacts />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;