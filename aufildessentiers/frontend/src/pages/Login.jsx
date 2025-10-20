import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext"; 
import useToasts from "../components/useToasts";
import { useNavigate } from "react-router-dom"; 
import styles from "./Login.module.css";
import PageLayout from "../components/PageLayout";

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const { push } = useToasts();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const result = await login(email, password);
      if (result && result.success) {
        navigate("/");
      } else {
        const msg = result?.message || 'Email ou mot de passe incorrect';
        setMessage(msg);
        push && push({ title: 'Erreur', message: msg }, 'error');
      }
    } catch {
      const msg = "Email ou mot de passe incorrect";
      setMessage(msg);
      push && push({ title: 'Erreur', message: msg }, 'error');
    }
  };

  return (
    <PageLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.hero}>
            <h1>Bienvenue</h1>
            <p>Connectez-vous pour gérer vos événements et votre profil</p>
          </div>
          <div className={styles.formWrap}>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input 
                type="email" 
                name="email"
                autoComplete="email"
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={styles.input} 
                aria-label="Adresse email"
              />
              <input 
                type="password" 
                name="current-password"
                autoComplete="current-password"
                placeholder="Mot de passe" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={styles.input} 
                aria-label="Mot de passe"
              />
              <button type="submit" className={styles.button}>Se connecter</button>
            </form>
            <div className={styles.alt}>Pas de compte ? <a href="/register" className={styles.link}>S'inscrire</a></div>
            <div className={styles.forgotPasswordLink}><a href="/forgot-password" > Mot de passe oublié ? </a></div>
            {message && <p className={styles.message}>{message}</p>}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
