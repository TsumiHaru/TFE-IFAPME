import React, { useEffect, useState, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import useToasts from '../components/useToasts';
import styles from './AdminTabs.module.css';

export default function AdminContacts() {
  const { user } = useAuth();
  const { push } = useToasts();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.CONTACTS, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setContacts(data.contacts || []);
      else push && push(data.error || 'Erreur récupération messages', 'error');
    } catch (err) {
      console.error('Erreur fetchContacts', err);
      push && push('Erreur serveur', 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  const markRead = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.MARK_CONTACT_READ(id), { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        push && push({ title: 'Succès', message: 'Marqué comme lu' }, 'success');
        fetchContacts();
      } else {
        const data = await res.json();
        push && push(data.error || 'Erreur', 'error');
      }
    } catch (err) {
      console.error('Erreur markRead', err);
      push && push('Erreur serveur', 'error');
    }
  }, [push, fetchContacts]);

  useEffect(() => {
    if (!user) return;
    fetchContacts();
  }, [user, fetchContacts]);

  if (loading) return <div className={styles.loading}>Chargement des messages...</div>;

  return (
    <div className={styles.tabContainer}>
      <h2>Messages de contact</h2>
      {contacts.length === 0 ? (
        <div className={styles.emptyState}><p>Aucun message</p></div>
      ) : (
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Sujet</th>
              <th>Message</th>
              <th>Reçu</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.subject || '-'}</td>
                <td style={{maxWidth: 300, whiteSpace: 'normal'}}>{c.message}</td>
                <td>{new Date(c.created_at).toLocaleString('fr-FR')}</td>
                <td>
                  {!c.is_read && <button className={styles.approveBtn} onClick={() => markRead(c.id)}>Marquer lu</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
