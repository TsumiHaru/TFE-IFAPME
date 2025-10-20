import { useState } from "react";
import styles from "./Register.module.css";
import logger from "../utils/logger";
import { API_ENDPOINTS } from "../config/api";
import PageLayout from "../components/PageLayout";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit faire au moins 2 caractères";
    } else if (formData.name.length > 50) {
      newErrors.name = "Le nom ne doit pas dépasser 50 caractères";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "L'email n'est pas valide";
      }
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit faire au moins 8 caractères";
    } else if (formData.password.length > 128) {
      newErrors.password = "Le mot de passe ne doit pas dépasser 128 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBackendError = (errorMessage) => {
    const backendErrors = {};

    if (errorMessage.includes("email existe")) {
      backendErrors.email = "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser une autre adresse.";
    } else if (errorMessage.includes("8 caractères")) {
      backendErrors.password = "Le mot de passe doit faire au moins 8 caractères";
    } else if (errorMessage.includes("email")) {
      backendErrors.email = errorMessage;
    } else if (errorMessage.includes("mot de passe") || errorMessage.includes("password")) {
      backendErrors.password = errorMessage;
    } else if (errorMessage.includes("nom") || errorMessage.includes("name")) {
      backendErrors.name = errorMessage;
    } else {
      backendErrors.general = errorMessage;
    }

    setErrors(backendErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    // Valider côté frontend
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.debug('Register response', response.status, data);

      if (response.ok) {
        setMessage("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        const errorMsg = data.error || (Array.isArray(data.details) ? data.details.join(" - ") : data.message) || "Erreur lors de l'inscription";
        handleBackendError(errorMsg);
      }
    } catch (error) {
      logger.error('Register error:', error);
      setErrors({
        general: "Erreur de connexion au serveur. Vérifiez votre connexion Internet.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.hero}>
            <h1>Rejoignez-nous</h1>
            <p>Créez un compte pour participer aux événements et partager vos récits</p>
          </div>
          <div className={styles.formWrap}>
            <h2>Inscription</h2>
            
            {message && <div className={styles.success}>{message}</div>}
            {errors.general && <div className={styles.error}>{errors.general}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-label="Nom complet"
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  disabled={loading}
                />
                {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-label="Adresse email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  disabled={loading}
                />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-label="Mot de passe"
                  className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                  disabled={loading}
                />
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-label="Confirmer le mot de passe"
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                  disabled={loading}
                />
                {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
              </div>

              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </form>

            <div className={styles.alt}>Déjà un compte ? <a href="/login" className={styles.link}>Se connecter</a></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}