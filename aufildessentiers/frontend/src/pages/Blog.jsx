import { useEffect, useState } from 'react';
import useToasts from '../components/useToasts';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './Blog.module.css';
import { fetchArticles } from '../services/blogService';

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToasts();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetchArticles(1, 12)
      .then(data => {
        if (mounted) setArticles(data.articles || []);
      })
      .catch(err => {
        console.error('Erreur chargement articles:', err);
        if (err.message === 'Unauthorized') {
          push && push({ title: 'Accès', message: 'Vous devez vous connecter' }, 'error');
          navigate('/login');
        } else {
          push && push({ title: 'Erreur', message: 'Erreur lors du chargement des articles' }, 'error');
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [navigate, push]);

  return (
    <div className={styles.container}>
      <h1>Blog</h1>
      <p className={styles.lead}>Articles et nouvelles du projet</p>
      <div className={styles.titleUnderline}></div>
      {loading ? (
        <p>Chargement...</p>
      ) : articles.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        <div className={styles.grid}>
          {articles.map(a => (
            <Link to={`/blog/${a.id}`} key={a.id} className={styles.cardLink}>
                <article className={styles.card}>
                  <div className={styles.cardInner}>
                    <div className={styles.thumb} aria-hidden>
                      <img
                        src={a.image || '/images/articles/placeholder.jpg'}
                        alt={a.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                      />
                    </div>
                    <div style={{flex:1}}>
                      <h3>{a.title}</h3>
                      <p className={styles.excerpt}>{a.excerpt}</p>
                      <div className={styles.meta}>Par {a.author} • {new Date(a.publishedAt).toLocaleDateString()}</div>
                      <div><span className={styles.readMore}>Lire la suite →</span></div>
                    </div>
                  </div>
                </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
