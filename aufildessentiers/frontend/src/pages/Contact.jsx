import { useState } from "react";
import { API_ENDPOINTS } from '../config/api';
import PageLayout from "../components/PageLayout";
import styles from "./Contact.module.css";
import useToasts from '../components/useToasts';
import ToastContainer from '../components/ToastContainer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [message, setMessage] = useState("");
  const { toasts, push, remove } = useToasts();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(API_ENDPOINTS.CONTACTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await resp.json();
      if (resp.ok) {
        push('Message envoyé ! Nous vous répondrons dans les plus brefs délais.', 'success');
        setFormData({ name: "", email: "", subject: "", message: "" });
        setMessage(data.message || 'Message envoyé');
      } else {
        push(data.error || 'Erreur lors de l\'envoi', 'error');
      }
    } catch (err) {
      const errMsg = err && err.message ? `: ${err.message}` : '';
      push(`Erreur de connexion au serveur${errMsg}`, 'error');
    }
  };

  return (
    <PageLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.left}>
            <h1>Contactez-nous</h1>
            <p className={styles.lead}>Besoin d'aide ou d'informations ? Écrivez-nous, nous répondrons rapidement.</p>

            <div className={styles.contactInfo}>
              <div><strong>Email :</strong> contact@aufildessentiers.com</div>
              <div><strong>Téléphone :</strong> +33 6 12 34 56 78</div>
              <div><strong>Heures :</strong> Lun - Ven, 9:00 - 18:00</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <input name="name" placeholder="Votre nom" value={formData.name} onChange={handleChange} required autoComplete="name" aria-label="Votre nom" />
              <input name="email" type="email" placeholder="Votre email" value={formData.email} onChange={handleChange} required autoComplete="email" aria-label="Votre email" />
            </div>

            <input name="subject" placeholder="Sujet" value={formData.subject} onChange={handleChange} required aria-label="Sujet" />

            <textarea name="message" placeholder="Votre message" value={formData.message} onChange={handleChange} required aria-label="Votre message" />

            <div className={styles.actions}>
              <button type="submit" className={styles.primary}>Envoyer</button>
              <button type="button" className={styles.dangerGreen} onClick={() => setFormData({ name: "", email: "", subject: "", message: "" })}>Effacer</button>
            </div>

            {message && <p className={styles.message}>{message}</p>}
          </form>
        </div>
        <ToastContainer toasts={toasts} onClose={remove} />
      </div>
    </PageLayout>
  );
}
  