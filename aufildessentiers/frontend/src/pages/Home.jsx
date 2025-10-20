import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      <main className={styles.heroArea}>
        <section className={styles.heroCard}>

          <div className={styles.heroText}>
            <h1>Reconnectons-nous à l'essentiel</h1>
            <p className={styles.lead}>Sortir, rencontrer, partager — des événements pensés pour recréer du lien et (re)découvrir la nature.</p>
            <div className={styles.ctas}>
              <Link to="/events"><button className={styles.primary}>Découvrir les événements</button></Link>
              <Link to="/contact"><button className={styles.ghost}>Nous contacter</button></Link>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden>
            <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className={styles.inlineSvg}>
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#9bd39b" />
                  <stop offset="100%" stopColor="#c7f0c7" />
                </linearGradient>
              </defs>
              <g>
                <ellipse cx="60" cy="80" rx="60" ry="26" fill="url(#g)" opacity="0.28" />
                <path id="leaf" d="M20,60 C40,10 140,10 160,60 C140,70 40,70 20,60 Z" fill="#8fcf8f" />
                <use href="#leaf" fill="#6fbf6f" opacity="0.5">
                  <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="4s" repeatCount="indefinite" />
                </use>
              </g>
            </svg>
          </div>
    
        </section>

        {/* Section Présentation */}
        <section className={styles.presentationSection}>
          <div className={styles.presentationContent}>
            <h2>À l'origine du projet</h2>
            <div className={styles.presentationText}>
              <p>
                Nos vies sont devenues hyperconnectées : échanges, loisirs, informations… tout passe par un écran. Pourtant, derrière cette omniprésence du numérique, beaucoup éprouvent un sentiment d'isolement. Ce paradoxe m'a conduit à créer <strong>Au Fil des Sentiers</strong>, une plateforme pensée pour retisser du lien — entre les gens d'abord, mais aussi entre les gens et la nature, par le biais d'événements locaux, solidaires et respectueux de l'environnement.
              </p>
              <p>
                L'idée a germé face à un constat personnel : autour de moi, j'ai vu des personnes en quête de rencontres qui ne savaient pas où trouver des activités près de chez elles. Parallèlement, j'ai observé des associations et initiatives locales manquer de visibilité, faute d'outils simples pour communiquer. Ce projet entend répondre à ces deux besoins en créant un espace commun où il est possible de découvrir, partager et participer à quelque chose qui a du sens.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.reviews}>
          <h3>Avis de la communauté</h3>
          <div className={styles.reviewsGrid}>
            <blockquote className={styles.review}>
              <p>« J'ai rencontré des personnes formidables et j'ai repris confiance grâce aux randonnées. »</p>
              <cite>— Marie L.</cite>
            </blockquote>
            <blockquote className={styles.review}>
              <p>« Des événements très bien organisés, idéaux pour échanger et apprendre. »</p>
              <cite>— Lucas D.</cite>
            </blockquote>
            <blockquote className={styles.review}>
              <p>« Plateforme chaleureuse et engagée — je recommande vivement. »</p>
              <cite>— Sophie R.</cite>
            </blockquote>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}