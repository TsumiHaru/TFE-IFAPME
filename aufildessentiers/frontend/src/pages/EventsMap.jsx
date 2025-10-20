// EventsMap.jsx - Page des événements avec carte OpenStreetMap
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useToasts from '../components/useToasts';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import styles from './EventsMap.module.css';
import ToastContainer from '../components/ToastContainer';

const EventsMap = () => {
  const { user } = useAuth();
  const { toasts, push, remove } = useToasts();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [filters, setFilters] = useState({
    date: 'all',
    status: 'all',
    participants: 'all'
  });
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);

  // Fixer les icônes Leaflet
  useEffect(() => {
    const L = window.L;
    if (L) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  // Fonction de filtrage
  const applyFilters = useCallback(() => {
    let filtered = [...events];

    // Filtre par date
    if (filters.date !== 'all') {
      const now = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        if (filters.date === 'upcoming') {
          return eventDate >= now;
        } else if (filters.date === 'past') {
          return eventDate < now;
        }
        return true;
      });
    }

    // Filtre par statut (si inscrit)
    if (filters.status !== 'all' && user) {
      if (filters.status === 'registered') {
        const registeredEventIds = userRegistrations.map(reg => reg.eventId);
        filtered = filtered.filter(event => registeredEventIds.includes(event.id));
      } else if (filters.status === 'available') {
        const registeredEventIds = userRegistrations.map(reg => reg.eventId);
        filtered = filtered.filter(event => !registeredEventIds.includes(event.id));
      }
    }

    // Filtre par nombre de participants
    if (filters.participants !== 'all') {
      const minParticipants = parseInt(filters.participants);
      filtered = filtered.filter(event => (event.participants || 0) >= minParticipants);
    }

    setFilteredEvents(filtered);
  }, [events, filters, user, userRegistrations]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const addEventMarkers = useCallback((eventsData) => {
    const L = window.L;
    if (!L || !mapInstance.current) return;

    // Nettoyer les anciens marqueurs
    markers.current.forEach(marker => mapInstance.current.removeLayer(marker));
    markers.current = [];

    eventsData.forEach(event => {
      if (event.lat && event.lng) {
        const imageHtml = event.image ? `<img src="${event.image}" alt="${event.title}" style="width:100%;height:140px;object-fit:cover;border-radius:6px;margin-bottom:8px;"/>` : '';
        const marker = L.marker([event.lat, event.lng])
          .addTo(mapInstance.current)
          .bindPopup(`
            <div class="event-popup">
              ${imageHtml}
              <h3>${event.title}</h3>
              <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('fr-FR')}</p>
              <p><strong>Lieu:</strong> ${event.location}</p>
              <p><strong>Participants:</strong> ${event.participants || 0}</p>
              <button onclick="selectEvent(${event.id})" class="btn btn-primary">Voir détails</button>
            </div>
          `)
          .on('click', () => {
            mapInstance.current.setView([event.lat, event.lng], 15);
            marker.openPopup();
          });

        markers.current.push(marker);
      }
    });
  }, []);

  const initializeMap = useCallback((eventsData) => {
    setTimeout(() => {
      if (mapRef.current && !mapInstance.current) {
        const L = window.L;
        if (!L) {
          console.error('Leaflet non chargé');
          push && push('Erreur interne: carte non chargée', 'error');
          return;
        }

        const defaultCenter = [50.8503, 4.3517];
        const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

        mapInstance.current = L.map(mapRef.current).setView(center, 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '\u00a9 OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        addEventMarkers(eventsData);

        if (userLocation) {
          L.marker([userLocation.lat, userLocation.lng])
            .addTo(mapInstance.current)
            .bindPopup('Votre position')
            .openPopup();
        }
      }
    }, 100);
  }, [userLocation, push, addEventMarkers]);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.EVENTS);
      const data = await response.json();
      
      if (response.ok) {
        setEvents(data.events);
        setFilteredEvents(data.events);
      } else {
        setError(data.error || 'Erreur lors du chargement des événements');
      }
    } catch (error) {
      console.error('Erreur loadEvents', error);
      setError('Erreur de connexion au serveur');
      push && push('Erreur de connexion au serveur', 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    if (filteredEvents && filteredEvents.length > 0) {
      try {
        addEventMarkers(filteredEvents);
      } catch (e) {
        console.error('Erreur addEventMarkers', e);
      }
    }
  }, [filteredEvents, addEventMarkers]);

  useEffect(() => {
    if (events && events.length > 0) {
      try {
        initializeMap(events);
      } catch (e) {
        console.error('Erreur initializeMap', e);
      }
    }
  }, [events, initializeMap]);

  const loadUserRegistrations = useCallback(async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.MY_REGISTRATIONS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserRegistrations(data.registrations);
      }
    } catch (error) {
      console.error('Erreur chargement inscriptions:', error);
      push && push('Erreur lors du chargement de vos inscriptions', 'error');
    }
  }, [user, push]);

  useEffect(() => {
    loadEvents();
    getUserLocation();
    if (user) {
      loadUserRegistrations();
    }
  }, [user, loadEvents, loadUserRegistrations]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Erreur géolocalisation:', error);
        }
      );
    }
  };

  const joinEvent = async (eventId) => {
    if (!user) {
      push && push('Vous devez être connecté pour rejoindre un événement', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.JOIN_EVENT(eventId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        push && push({ title: 'Inscription', message: 'Vous avez rejoint l\'événement avec succès ! En attente d\'approbation.' }, 'success');
        loadUserRegistrations();
      } else {
        push && push(data.error || 'Erreur lors de l\'inscription', 'error');
      }
    } catch (err) {
      console.error('Erreur joinEvent', err);
      push && push('Erreur lors de la participation à l\'événement', 'error');
    }
  };

  const getUserRegistrationStatus = (eventId) => {
    const registration = userRegistrations.find(reg => reg.eventId === eventId);
    return registration ? registration.status : null;
  };

  useEffect(() => {
    window.selectEvent = (eventId) => {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
      }
    };
  }, [events]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ToastContainer toasts={toasts} onClose={remove} />
      
      <div className={styles.header}>
        <h1>Carte des événements</h1>
        <p>Découvrez les événements près de chez vous</p>
        <div className={styles.titleUnderline}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.mapContainer}>
          <div ref={mapRef} className={styles.map}></div>
        </div>

        <div className={styles.sidebar}>
          <h3>Liste des événements</h3>
          {error && <div className={styles.error}>{error}</div>}
          
          {/* Filtres */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Date :</label>
              <select 
                value={filters.date} 
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className={styles.filterSelect}
              >
                <option value="all">Tous</option>
                <option value="upcoming">À venir</option>
                <option value="past">Passés</option>
              </select>
            </div>

            {user && (
              <div className={styles.filterGroup}>
                <label>Statut :</label>
                <select 
                  value={filters.status} 
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className={styles.filterSelect}
                >
                  <option value="all">Tous</option>
                  <option value="registered">Mes inscriptions</option>
                  <option value="available">Disponibles</option>
                </select>
              </div>
            )}

            <div className={styles.filterGroup}>
              <label>Participants :</label>
              <select 
                value={filters.participants} 
                onChange={(e) => setFilters({...filters, participants: e.target.value})}
                className={styles.filterSelect}
              >
                <option value="all">Tous</option>
                <option value="10">10+ participants</option>
                <option value="20">20+ participants</option>
                <option value="30">30+ participants</option>
              </select>
            </div>
          </div>

          <div className={styles.resultsCount}>
            {filteredEvents.length} événement(s) trouvé(s)
          </div>
          
          <div className={styles.eventsList}>
            {filteredEvents.map(event => (
              <div key={event.id} className={styles.eventCard}>
                <h4>{event.title}</h4>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('fr-FR')}</p>
                <p><strong>Lieu:</strong> {event.location}</p>
                <p><strong>Participants:</strong> {event.participants || 0}</p>
                <p className={styles.description}>{event.description}</p>
                
                <div className={styles.actions}>
                  <button 
                    className={styles.button}
                    onClick={() => {
                      setSelectedEvent(event);
                      if (mapInstance.current && event.lat && event.lng) {
                        mapInstance.current.setView([event.lat, event.lng], 15);
                      }
                    }}
                  >
                    Voir détails
                  </button>
                  
                  {user && (() => {
                    const registrationStatus = getUserRegistrationStatus(event.id);
                    if (registrationStatus === 'approved' || registrationStatus === 'Présent') {
                      return (
                        <span className={styles.approvedStatus}>
                          ✓ Inscrit
                        </span>
                      );
                    } else if (registrationStatus === 'pending' || registrationStatus === 'Inscrit') {
                      return (
                        <span className={styles.pendingStatus}>
                          En attente
                        </span>
                      );
                    } else if (registrationStatus === 'rejected' || registrationStatus === 'Annulé') {
                      return (
                        <span className={styles.rejectedStatus}>
                          Rejeté
                        </span>
                      );
                    } else {
                      return (
                        <button 
                          className={styles.joinButton}
                          onClick={() => joinEvent(event.id)}
                        >
                          Rejoindre
                        </button>
                      );
                    }
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>
            
            {selectedEvent.image && (
              <img src={selectedEvent.image} alt={selectedEvent.title} className={styles.detailImage} />
            )}
            <h2>{selectedEvent.title}</h2>
            <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}</p>
            <p><strong>Lieu:</strong> {selectedEvent.location}</p>
            <p><strong>Participants:</strong> {selectedEvent.participants || 0}</p>
            <p><strong>Description:</strong></p>
            <p className={styles.description}>{selectedEvent.description}</p>
            
            {user && (() => {
              const registrationStatus = getUserRegistrationStatus(selectedEvent.id);
              if (registrationStatus === 'approved' || registrationStatus === 'Présent') {
                return (
                  <div className={styles.modalActions}>
                    <span className={styles.approvedStatus}>
                      ✓ Vous êtes inscrit à cet événement
                    </span>
                  </div>
                );
              } else if (registrationStatus === 'pending' || registrationStatus === 'Inscrit') {
                return (
                  <div className={styles.modalActions}>
                    <span className={styles.pendingStatus}>
                      En attente d'approbation
                    </span>
                  </div>
                );
              } else if (registrationStatus === 'rejected' || registrationStatus === 'Annulé') {
                return (
                  <div className={styles.modalActions}>
                    <span className={styles.rejectedStatus}>
                      Inscription rejetée
                    </span>
                  </div>
                );
              } else {
                return (
                  <div className={styles.modalActions}>
                    <button 
                      className={styles.joinButton}
                      onClick={() => {
                        joinEvent(selectedEvent.id);
                        setSelectedEvent(null);
                      }}
                    >
                      Rejoindre l'événement
                    </button>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsMap;