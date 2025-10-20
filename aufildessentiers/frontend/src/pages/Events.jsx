import { useEffect, useState, } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { API_ENDPOINTS, API_BASE_URL } from "../config/api";
import styles from "./Events.module.css";
import PageLayout from "../components/PageLayout";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [mapCenter, setMapCenter] = useState([50.8503, 4.3517]); // bruxelles


  useEffect(() => {
    fetch(API_ENDPOINTS.events)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const eventsArray = Array.isArray(data) ? data : (data.events || []);
        setEvents(eventsArray);
        if (eventsArray.length > 0 && eventsArray[0].lat && eventsArray[0].lng) {
          setMapCenter([parseFloat(eventsArray[0].lat), parseFloat(eventsArray[0].lng)]);
        }
      })
      .catch((err) => console.error('Erreur fetch events', err));
      
  }, []);

  

  return (
    <PageLayout>
      <div className={styles.eventsPage}>
        <h1>Événements</h1>
        

        {/* carte des événements */}
        <div className={styles.mapContainer}>
          <MapContainer center={mapCenter} zoom={7} className={styles.map}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            // marque les evenements
            {events.map((event) => (
              event.lat && event.lng ? (
                <Marker
                  key={event.id}
                  position={[parseFloat(event.lat), parseFloat(event.lng)]}
                >
                  <Popup>
                    <strong>{event.title}</strong>
                    <br />
                    {event.location}
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>

      </div>
    </PageLayout>
  );
}
