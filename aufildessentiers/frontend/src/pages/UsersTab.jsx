import { useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from "../config/api";
import styles from "./AdminTabs.module.css";
import useToasts from '../components/useToasts';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseDetails, setResponseDetails] = useState(null);
  const { push } = useToasts();

  const fetchUsers = useCallback(async () => {
    try {
  setLoading(true);
  const response = await fetch(API_ENDPOINTS.users);
      
      if (!response.ok) {
        const errorText = await response.text();
          console.error("Error response body:", errorText);
        setResponseDetails(errorText);
        throw new Error(`Impossible de récupérer les utilisateurs: ${response.status} ${response.statusText}`);
      }
  const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
        console.log("Parsed data:", data);
      } catch (parseError) {
  console.error("JSON parse error:", parseError);
        setResponseDetails(text);
        throw new Error("Le serveur a renvoyé une réponse non-JSON");
      }
      
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur complète:", error);
      setError(error.message);
      push && push(`Erreur: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`${API_ENDPOINTS.users}&id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error("Impossible de modifier le statut");
      }

      // Update local state to reflect the change
      setUsers(users.map(user => 
        user.id === id ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
      push && push(`Erreur utilisateur: ${error.message}`, 'error');
    }
  };

  if (loading) return <div className={styles.loading}>Chargement des utilisateurs...</div>;
  
  if (error) {
    return (
      <div className={styles.tabContainer}>
        <div className={styles.error}>{error}</div>
        {responseDetails && (
          <div className={styles.errorDetails}>
            <h3>Détails de l'erreur:</h3>
            <pre>{responseDetails}</pre>
          </div>
        )}
        <button 
          className={styles.createButton}
          onClick={fetchUsers}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.tabContainer}>
      <h2>Gestion des utilisateurs</h2>
      
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`${styles.badge} ${user.status === 'active' ? styles.badgeSuccess : styles.badgeDanger}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`${styles.actionButton} ${user.status === 'active' ? styles.deactivateButton : styles.activateButton}`}
                      onClick={() => handleToggleStatus(user.id, user.status)}
                    >
                      {user.status === 'active' ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noData}>Aucun utilisateur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
