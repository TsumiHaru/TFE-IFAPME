import { useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from "../config/api";
import styles from "./AdminTabs.module.css";
import useToasts from '../components/useToasts';

export default function EventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { push } = useToasts();
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    organizer: "",
    participants: 0,
    lat: "",
    lng: "",
    status: "Ouvert"
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.events);
      if (!response.ok) {
        throw new Error("Impossible de récupérer les événements");
      }
      const text = await response.text();
     const data = JSON.parse(text);
      setEvents(Array.isArray(data) ? data : (data.events || []));
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
      push && push(`Erreur: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.events, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Impossible de créer l'événement");
      }

      // Reset form and fetch events
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        organizer: "",
        participants: 0,
        lat: "",
        lng: "",
        status: "Ouvert"
      });
      setShowForm(false);
      fetchEvents();
    } catch (error) {
  console.error("Erreur:", error);
  setError(error.message);
  push && push(`Erreur: ${error.message}`, 'error');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
  // Toggle event status
        
        // Determine the new status based on current status
        let newStatus;
        if (currentStatus === 'Ouvert') {
            newStatus = 'Fermé';
        } else if (currentStatus === 'Fermé' || currentStatus === 'Complet' || currentStatus === 'Annulé') {
            newStatus = 'Ouvert';
        } else {
            newStatus = 'Ouvert'; // Default fallback
        }
        
        
        const response = await fetch(`${API_ENDPOINTS.events}&id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: newStatus
            }),
        });

  const text = await response.text();
        let data;
        
        try {
            data = JSON.parse(text);
        } catch (e) {
              console.error('Failed to parse response as JSON:', e);
              console.error('Response was:', text);
            push && push('Erreur lors de la mise à jour du statut', 'error');
            return;
        }

        if (response.ok) {
            fetchEvents();
            push && push(`Le statut de l'événement a été mis à jour avec succès`, 'success');
        } else {
            console.error('Error updating event status:', data);
            push && push(`Erreur lors de la mise à jour du statut: ${data.error || 'Erreur inconnue'}`, 'error');
        }
    } catch (error) {
        console.error('Error toggling event status:', error);
        push && push('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className={styles.loading}>Chargement des événements...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.tabContainer}>
      <h2>Gestion des événements</h2>
      
      <button
        className={styles.createButton}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Annuler' : 'Créer un événement'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateEvent} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              autoComplete="off"
              aria-label="Titre de l'événement"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
                aria-label="Description de l'événement"
            ></textarea>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date et heure</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                aria-label="Date et heure"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location">Lieu</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                aria-label="Lieu"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="organizer">Organisateur</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                required
                aria-label="Organisateur"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="participants">Nombre de participants</label>
              <input
                type="number"
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                min="0"
                aria-label="Nombre de participants"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="lat">Latitude</label>
              <input
                type="text"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                placeholder="Ex: 48.8566"
                aria-label="Latitude"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lng">Longitude</label>
              <input
                type="text"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleInputChange}
                placeholder="Ex: 2.3522"
                aria-label="Longitude"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Statut</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Ouvert">Ouvert</option>
              <option value="Fermé">Fermé</option>
              <option value="Complet">Complet</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Créer l'événement
          </button>
        </form>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Date</th>
              <th>Lieu</th>
              <th>Organisateur</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>{formatDate(event.date)}</td>
                  <td>{event.location}</td>
                  <td>{event.organizer}</td>
                  <td>
                    <span className={`${styles.badge} ${
                      event.status === 'Ouvert' ? styles.badgeSuccess : 
                      event.status === 'Fermé' ? styles.badgeDanger :
                      event.status === 'Complet' ? styles.badgeWarning :
                      event.status === 'Annulé' ? styles.badgeSecondary :
                      styles.badgeSuccess
                    }`}>
                      {event.status || 'Ouvert'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`${styles.actionButton} ${
                        event.status === 'Ouvert' ? styles.deactivateButton : 
                        event.status === 'Fermé' ? styles.activateButton :
                        event.status === 'Complet' ? styles.deactivateButton :
                        styles.deactivateButton
                      }`}
                      onClick={() => handleToggleStatus(event.id, event.status || 'Ouvert')}
                    >
                      {event.status === 'Fermé' ? 'Ouvrir' : 
                       event.status === 'Complet' ? 'Rouvrir' :
                       event.status === 'Annulé' ? 'Rouvrir' : 'Fermer'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noData}>Aucun événement trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
