import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";
import styles from "./AdminTabs.module.css";

export default function UploadTab() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchImages();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.events);
      if (!response.ok) {
        throw new Error("Impossible de récupérer les événements");
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : (data.events || []));
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.upload}?action=list`);
      if (!response.ok) {
        throw new Error("Impossible de récupérer les images");
      }
      const data = await response.json();
      setUploadedImages(data.images || []);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un fichier' });
      return;
    }

    if (!selectedEvent) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un événement' });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('event_id', selectedEvent);

    try {
      setUploading(true);
      setMessage(null);
      
      const response = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors du téléchargement');
      }

      setMessage({ type: 'success', text: 'Image téléchargée avec succès' });
      setFile(null);
      setSelectedEvent("");
      // Reset the file input
      document.getElementById('file-upload').value = '';
      
      // Update events to reflect the new image
      fetchEvents();
      fetchImages();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageName) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.upload}?name=${imageName}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error('Impossible de supprimer l\'image');
      }

      setMessage({ type: 'success', text: 'Image supprimée avec succès' });
      fetchImages();
      fetchEvents();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.tabContainer}>
      <h2>Gestion des images d'événements</h2>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpload} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="event-select">Sélectionner un événement</label>
          <select
            id="event-select"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
            aria-label="Sélectionner un événement"
          >
            <option value="">-- Choisir un événement --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="file-upload">Sélectionner une image</label>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleFileChange}
            required
            aria-label="Sélectionner un fichier image"
          />
          <small>Formats acceptés: JPG, PNG, GIF. Taille max: 5MB</small>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={uploading}
        >
          {uploading ? 'Téléchargement...' : 'Télécharger l\'image'}
        </button>
      </form>

      <div className={styles.imagesSection}>
        <h3>Images téléchargées</h3>
        
        {uploadedImages.length === 0 ? (
          <p className={styles.noData}>Aucune image téléchargée</p>
        ) : (
          <div className={styles.imageGrid}>
            {uploadedImages.map((image, index) => (
              <div key={index} className={styles.imageCard}>
                <img 
                  src={`${API_ENDPOINTS.baseUrl}/images/${image.name}`}
                  alt={image.name}
                  className={styles.thumbnail}
                />
                <div className={styles.imageInfo}>
                  <p>{image.name}</p>
                  <p>Événement: {image.event_title || 'Non assigné'}</p>
                  <button
                    onClick={() => handleDeleteImage(image.name)}
                    className={styles.deleteButton}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.uploadInfo}>
        <h3>Informations sur l'hébergement des images</h3>
        <p>
          Les images sont actuellement stockées sur le serveur local dans le dossier <code>/backend/images/</code>.
          Pour un déploiement en ligne, vous avez deux options:
        </p>
        <ol>
          <li>
            <strong>Stockage sur le serveur:</strong> Continuez à stocker les images sur votre serveur web.
            Assurez-vous que le dossier images a les permissions d'écriture appropriées et que le chemin est correctement configuré.
          </li>
          <li>
            <strong>Service de stockage cloud:</strong> Pour plus de scalabilité, utilisez un service comme AWS S3, 
            Google Cloud Storage, ou Cloudinary. Cela nécessitera de modifier la logique de téléchargement dans le backend 
            pour utiliser l'API du service choisi.
          </li>
        </ol>
        <p>
          Le code actuel peut être facilement adapté pour utiliser un service cloud en modifiant le fichier <code>upload.php</code> 
          pour rediriger les téléchargements vers le service choisi au lieu du système de fichiers local.
        </p>
      </div>
    </div>
  );
}
